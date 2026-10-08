"""
Módulo de Triagem Cognitiva de Tarefas com Google GenAI (Gemini)
Camada 3 (Execução) - Smart To-Do List
"""

import os
import json
import time
from typing import List, Literal, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Modelos recomendados em ordem de prioridade para alta disponibilidade e resiliência (Self-Annealing)
MODELOS_PREFERENCIAIS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-flash-latest"
]

# Definição do Schema Pydantic para validação estrita da resposta da IA
class Tarefa(BaseModel):
    """Modelo de dados de uma tarefa individual com classificação e estimativas."""
    titulo: str = Field(
        description="Nome claro, conciso e normalizado do afazer."
    )
    prioridade: Literal["Crítica", "Alta", "Média", "Baixa"] = Field(
        description="Nível de prioridade semântica da tarefa."
    )
    score_prioridade: int = Field(
        ge=1, le=5,
        description="Score numérico de prioridade de 1 (menor) a 5 (urgência máxima)."
    )
    tempo_estimado_minutos: int = Field(
        ge=1,
        description="Estimativa realista do tempo necessário em minutos."
    )
    justificativa: str = Field(
        description="Breve justificativa estratégica explicando o impacto e o motivo da prioridade."
    )

class TriagemTarefas(BaseModel):
    """Contêiner da lista estruturada de tarefas retornadas pelo modelo."""
    tarefas: List[Tarefa] = Field(
        description="Lista completa de tarefas analisadas, categorizadas e estimadas."
    )


def obter_cliente_gemini() -> genai.Client:
    """
    Inicializa e retorna o cliente do Google GenAI utilizando a GEMINI_API_KEY do .env.
    Lança ValueError se a chave não estiver configurada.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.strip() == "" or "sua_chave_aqui" in api_key:
        raise ValueError(
            "⚠️ GEMINI_API_KEY não foi encontrada ou não foi configurada no arquivo .env!\n"
            "Por favor, configure sua chave no arquivo .env antes de executar."
        )
    return genai.Client(api_key=api_key)


def registrar_log_erro(mensagem: str) -> None:
    """Registra incidentes no arquivo de log transitório .tmp/error.log."""
    os.makedirs(".tmp", exist_ok=True)
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    with open(".tmp/error.log", "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {mensagem}\n")


def triar_tarefas_com_ia(texto_bruto: str, max_tentativas: int = 3) -> List[dict]:
    """
    Recebe o texto caótico com afazeres e consome a API do Gemini utilizando
    Structured Outputs (JSON Schema estrito) para normalizar, priorizar e estimar as tarefas.

    Implementa Self-Annealing com cascata de modelos e retentativa exponencial.
    """
    if not texto_bruto or not texto_bruto.strip():
        return []

    client = obter_cliente_gemini()

    prompt_instrucao = (
        "Você é um especialista em produtividade, priorização estratégica de tempo e triagem de tarefas.\n"
        "Analise a seguinte lista bruta e desorganizada de afazeres informada pelo usuário.\n"
        "Para CADA tarefa identificada no texto:\n"
        "1. Extraia um 'titulo' claro, normalizado e objetivo.\n"
        "2. Defina a 'prioridade' estritamente entre ['Crítica', 'Alta', 'Média', 'Baixa'].\n"
        "   - Crítica (Score 5): Riscos graves, emergências da casa/vida, prazos iminentes no dia (ex: até às 15h) que causam prejuízos imediatos.\n"
        "   - Alta (Score 4): Obrigações acadêmicas importantes, compromissos que travam outras pessoas.\n"
        "   - Média (Score 3): Demandas rotineiras, cuidados com pet/família sem urgência de curto prazo.\n"
        "   - Baixa (Score 1 ou 2): Tarefas triviais, opcionais ou de conveniência que podem ser adiadas sem impacto severo.\n"
        "3. Defina o 'score_prioridade' de 1 a 5 coerente com a prioridade.\n"
        "4. Estime o 'tempo_estimado_minutos' (em minutos, realista).\n"
        "5. Forneça uma 'justificativa' concisa e estratégica do porquê fazer neste momento.\n\n"
        f"--- LISTA BRUTA DO USUÁRIO ---\n{texto_bruto}\n"
    )

    ultimo_erro = None

    # Itera sobre os modelos candidatos em caso de indisponibilidade ou rate limit
    for modelo in MODELOS_PREFERENCIAIS:
        for tentativa in range(1, max_tentativas + 1):
            try:
                resposta = client.models.generate_content(
                    model=modelo,
                    contents=prompt_instrucao,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=TriagemTarefas,
                        temperature=0.1,
                    ),
                )

                # Extrai os dados validados pelo Pydantic Schema
                if resposta.parsed and hasattr(resposta.parsed, "tarefas"):
                    return [t.model_dump() for t in resposta.parsed.tarefas]

                # Fallback para parsing manual do JSON
                if resposta.text:
                    dados = json.loads(resposta.text)
                    if isinstance(dados, dict) and "tarefas" in dados:
                        return dados["tarefas"]
                    elif isinstance(dados, list):
                        return dados

                raise ValueError(f"Resposta do modelo {modelo} não retornou estrutura esperada.")

            except Exception as erro:
                ultimo_erro = erro
                msg = f"Modelo {modelo} (tentativa {tentativa}/{max_tentativas}) falhou: {erro}"
                registrar_log_erro(msg)

                # Se for erro 404 (modelo não existe/descontinuado), pula para o próximo modelo imediatamente
                if "404" in str(erro) or "NOT_FOUND" in str(erro):
                    break

                # Se for erro de quota 429 ou esgotamento, tenta o próximo modelo da lista
                if "429" in str(erro) or "RESOURCE_EXHAUSTED" in str(erro):
                    break

                # Backoff exponencial antes da próxima tentativa com o mesmo modelo
                if tentativa < max_tentativas:
                    time.sleep(2 ** tentativa)

    # Se todos os modelos e tentativas falharam
    raise RuntimeError(
        f"Falha na triagem com IA após tentar os modelos disponíveis. Detalhes do último erro: {ultimo_erro}"
    )
