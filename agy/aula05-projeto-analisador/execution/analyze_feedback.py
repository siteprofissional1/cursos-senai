"""
====================================================================
Projeto: Analisador de Feedbacks - Hamburgueria Gourmet
Camada 3 (Execução Determinística): Análise Semântica com IA (Gemini)
Desenvolvido com: Google Antigravity & Python
====================================================================
Função do Módulo:
Analisar semanticamente os comentários recebidos de clientes,
extrair o sentimento estrito ("Positivo", "Neutro", "Crítico"),
identificar as tags chave ("Entrega", "Sabor", "Atendimento")
e avaliar o nível de urgência com justificativa.

Padrões de Resiliência (Self-Annealing):
- Schema estrito de JSON.
- Retentativa com múltiplos modelos suportados e temperatura zero.
- Sanitização de resposta contra payloads imperfeitos.
- Fallback determinístico heurístico de contingência caso a nuvem esteja indisponível.
"""

import os
import json
import re
from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Definição dos modelos prioritários disponíveis no ecossistema GenAI
MODELOS_PRIORITARIOS = [
    "gemini-3.8-flash",
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-3.5-flash",
    "gemini-2.5-flash"
]

# Tags de taxonomia estrita obrigatórias pela Diretiva (Layer 1)
TAGS_VALIDAS = ["Entrega", "Sabor", "Atendimento"]
SENTIMENTOS_VALIDOS = ["Positivo", "Neutro", "Crítico"]


class AnaliseFeedbackSchema(BaseModel):
    """Schema Pydantic de saída estrita para validação da resposta da IA."""
    sentimento: Literal["Positivo", "Neutro", "Crítico"] = Field(
        description="Classificação categórica do sentimento geral expresso pelo cliente."
    )
    tags: List[Literal["Entrega", "Sabor", "Atendimento"]] = Field(
        default_factory=list,
        description="Lista de tags identificadas no comentário, respeitando exclusivamente as opções válidas."
    )
    resumo: str = Field(
        description="Síntese executiva da avaliação em até 100 caracteres."
    )
    urgencia: bool = Field(
        description="Verdadeiro se o sentimento for 'Crítico' ou demandar atenção operacional imediata."
    )
    justificativa: str = Field(
        description="Explicação concisa do racional da classificação adotada pela IA."
    )


PROMPT_SISTEMA = """
Você é o Especialista em Experiência do Cliente de uma Hamburgueria Gourmet em Ourinhos.
Sua missão é ler o comentário do cliente e categorizá-lo de forma estrita, precisa e estruturada.

Regras de Negócio e Taxonomia Obrigatória:
1. Sentimento: Deve ser EXATAMENTE um entre: "Positivo", "Neutro", "Crítico".
   - "Positivo": Elogios gerais, satisfação com o lanche, rapidez ou atendimento.
   - "Neutro": Comentários descritivos, sugestões construtivas moderadas, pedidos de informação sem indignação.
   - "Crítico": Reclamações sobre atrasos graves, lanche frio/queimado, itens faltantes, mau atendimento, decepção severa.
2. Tags: Inclua SOMENTE tags que foram mencionadas no texto entre:
   - "Entrega" (tempo, motoboy, embalagem violada/amassada, temperatura no transporte).
   - "Sabor" (ponto da carne, tempero, textura da batata, maionese, ingredientes).
   - "Atendimento" (educação, cortesia, agilidade no balcão/WhatsApp, resolução de dúvidas).
3. Resumo: Breve e direto ao ponto para leitura rápida do gerente.
4. Urgência: 'true' se sentimento for "Crítico" ou envolver problema grave; caso contrário 'false'.
5. Justificativa: 1 a 2 frases explicando a escolha.

Retorne EXCLUSIVAMENTE um objeto JSON válido correspondente ao schema solicitado.
"""


def _analise_deterministica_fallback(comentario: str) -> Dict[str, Any]:
    """
    Rotina de contingência determinística baseada em heurística léxica.
    Garante que o sistema continue operacional e seguro caso a API externa
    enfrente indisponibilidade temporária de rede ou cota.
    """
    texto = comentario.lower()
    tags = []
    
    # Detecção de tags
    if any(p in texto for p in ["entrega", "motoboy", "demora", "demorou", "tempo", "atraso", "chegou"]):
        tags.append("Entrega")
    if any(p in texto for p in ["sabor", "hambúrguer", "burger", "lanche", "carne", "batata", "frio", "queimado", "maionese", "salgado", "gosto", "murcha"]):
        tags.append("Sabor")
    if any(p in texto for p in ["atendimento", "atendente", "educação", "garçom", "whatsapp", "educado", "grosseiro", "suporte"]):
        tags.append("Atendimento")

    if not tags:
        tags.append("Sabor")

    # Detecção de termos críticos
    termos_criticos = [
        "péssimo", "horrível", "queimado", "frio", "murcha", "demorou muito",
        "falta", "faltou", "errado", "nojento", "cru", "decepcionado",
        "reclamar", "estragado", "demora excessiva", "pior"
    ]
    termos_positivos = [
        "incrível", "excelente", "ótimo", "maravilhoso", "melhor",
        "parabéns", "delícia", "muito bom", "perfeito", "adorei", "amei", "top"
    ]

    is_critico = any(t in texto for t in termos_criticos)
    is_positivo = any(t in texto for t in termos_positivos)

    if is_critico:
        sentimento = "Crítico"
        urgencia = True
        resumo = f"Reclamação crítica identificada via contingência: {comentario[:60]}..."
        justificativa = "Palavras-chave de insatisfação severa detectadas no comentário do cliente."
    elif is_positivo:
        sentimento = "Positivo"
        urgencia = False
        resumo = f"Feedback positivo: {comentario[:60]}..."
        justificativa = "Elogios claros identificados em relação ao pedido ou atendimento."
    else:
        sentimento = "Neutro"
        urgencia = False
        resumo = f"Avaliação geral: {comentario[:60]}..."
        justificativa = "Comentário moderado sem termos enfáticos de satisfação ou repúdio."

    return {
        "sentimento": sentimento,
        "tags": tags,
        "resumo": resumo,
        "urgencia": urgencia,
        "justificativa": justificativa,
        "metodo": "fallback_deterministico"
    }


def _sanitizar_json_string(texto_resposta: str) -> str:
    """Extrai e limpa blocos markdown de JSON caso a resposta contenha formatação extra."""
    texto_limpo = texto_resposta.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", texto_limpo)
    if match:
        return match.group(1).strip()
    return texto_limpo


def analisar_feedback(comentario: str, temperatura: float = 0.2) -> Dict[str, Any]:
    """
    Executa a análise semântica do comentário utilizando o Google GenAI SDK.
    Possui loop de retentativa, troca de modelos suportados e fallback automático.
    
    Retorna dicionário validado conforme o AnaliseFeedbackSchema.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[AVISO] GEMINI_API_KEY não localizada no ambiente. Acionando análise de contingência.")
        return _analise_deterministica_fallback(comentario)

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    # Tenta obter a resposta estruturada alternando entre os modelos disponíveis
    for modelo in MODELOS_PRIORITARIOS:
        try:
            config = types.GenerateContentConfig(
                system_instruction=PROMPT_SISTEMA,
                temperature=temperatura,
                response_mime_type="application/json",
                response_schema=AnaliseFeedbackSchema
            )

            prompt_completo = f"Avalie o seguinte feedback de cliente:\n\"{comentario}\""
            
            resposta = client.models.generate_content(
                model=modelo,
                contents=prompt_completo,
                config=config
            )

            if resposta and resposta.text:
                json_str = _sanitizar_json_string(resposta.text)
                dados = json.loads(json_str)

                # Validação rigorosa dos campos obrigatórios
                sentimento = dados.get("sentimento", "Neutro")
                if sentimento not in SENTIMENTOS_VALIDOS:
                    sentimento = "Neutro"

                tags_filtradas = [t for t in dados.get("tags", []) if t in TAGS_VALIDAS]
                if not tags_filtradas:
                    tags_filtradas = ["Sabor"]  # Tag de default caso nenhuma seja extraída

                return {
                    "sentimento": sentimento,
                    "tags": tags_filtradas,
                    "resumo": dados.get("resumo", comentario[:80]),
                    "urgencia": bool(dados.get("urgencia", sentimento == "Crítico")),
                    "justificativa": dados.get("justificativa", "Análise realizada pelo modelo neural."),
                    "modelo_utilizado": modelo,
                    "metodo": "google_genai"
                }

        except Exception as e:
            # Em caso de erro transitório, testa próximo modelo ou temperatura zero
            print(f"[IA AVISO] Modelo {modelo} indisponível ou com erro: {e}")
            continue

    # Tentativa de segunda rodada com temperatura 0 (Self-Annealing) sem structured schema estrito caso haja incompatibilidade
    for modelo in MODELOS_PRIORITARIOS[:2]:
        try:
            prompt_fallback = (
                f"{PROMPT_SISTEMA}\n\n"
                f"Retorne um JSON puro no formato:\n"
                f'{{"sentimento": "Positivo"|"Neutro"|"Crítico", "tags": ["Entrega"|"Sabor"|"Atendimento"], '
                f'"resumo": "...", "urgencia": true|false, "justificativa": "..."}}\n\n'
                f"Comentário: \"{comentario}\""
            )
            config_simples = types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json"
            )
            resposta = client.models.generate_content(
                model=modelo,
                contents=prompt_fallback,
                config=config_simples
            )
            if resposta and resposta.text:
                json_str = _sanitizar_json_string(resposta.text)
                dados = json.loads(json_str)
                sentimento = dados.get("sentimento", "Neutro")
                if sentimento not in SENTIMENTOS_VALIDOS:
                    sentimento = "Neutro"
                tags = [t for t in dados.get("tags", []) if t in TAGS_VALIDAS] or ["Sabor"]
                return {
                    "sentimento": sentimento,
                    "tags": tags,
                    "resumo": dados.get("resumo", comentario[:80]),
                    "urgencia": bool(dados.get("urgencia", sentimento == "Crítico")),
                    "justificativa": dados.get("justificativa", "Classificação recuperada via fallback de temperatura 0."),
                    "modelo_utilizado": modelo,
                    "metodo": "google_genai_self_annealing"
                }
        except Exception:
            continue

    # Caso todos os modelos externos falhem, aciona o fallback determinístico local
    print("[IA RESILIÊNCIA] Todos os modelos remotos falharam temporariamente. Ativando fallback determinístico local.")
    return _analise_deterministica_fallback(comentario)


if __name__ == "__main__":
    # Testes rápidos de validação determinística
    exemplos = [
        "O hambúrguer estava incrível, mas a batata chegou murcha e fria!",
        "Atendimento nota 10, melhor maionese da cidade!",
        "Demorou mais de 1 hora e não mandaram o refrigerante, fiquei revoltado!"
    ]
    for ex in exemplos:
        print(f"\n--- Analisando: '{ex}' ---")
        resultado = analisar_feedback(ex)
        print(json.dumps(resultado, indent=2, ensure_ascii=False))
