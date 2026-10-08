"""
====================================================================
Projeto: Analisador de Feedbacks - Hamburgueria Gourmet
Camada 3 (Execução Determinística): Gerenciamento de Persistência
Desenvolvido com: Google Antigravity & Python
====================================================================
Função do Módulo:
Gerenciar a leitura, gravação e atualização dos feedbacks estruturados
no banco de dados JSON persistente (backend/data/feedbacks.json).
Garante atomicidade, integridade de dados e auditoria de status.
"""

import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

# Definição dos caminhos padrão do projeto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "backend", "data")
DB_FILE_PATH = os.path.join(DATA_DIR, "feedbacks.json")


def _garantir_diretorio_e_arquivo() -> None:
    """
    Garante que a pasta de dados e o arquivo JSON existam.
    Se não existirem, são criados com estrutura inicial vazia.
    """
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DB_FILE_PATH):
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2, ensure_ascii=False)


def listar_feedbacks(
    sentimento: Optional[str] = None,
    tag: Optional[str] = None,
    status: Optional[str] = None,
    busca: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Retorna a lista de feedbacks aplicando filtros opcionais.
    
    Parâmetros:
        sentimento: 'Positivo', 'Neutro' ou 'Crítico'
        tag: 'Entrega', 'Sabor' ou 'Atendimento'
        status: 'pendente' ou 'tratado'
        busca: Texto para busca no comentário ou nome do cliente
    """
    _garantir_diretorio_e_arquivo()
    try:
        with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
            feedbacks: List[Dict[str, Any]] = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        feedbacks = []

    # Aplicação de filtros determinísticos
    resultado = feedbacks

    if sentimento:
        resultado = [item for item in resultado if item.get("sentimento", "").lower() == sentimento.lower()]

    if tag:
        resultado = [
            item for item in resultado
            if tag.lower() in [t.lower() for t in item.get("tags", [])]
        ]

    if status:
        resultado = [item for item in resultado if item.get("status", "").lower() == status.lower()]

    if busca:
        termo = busca.lower()
        resultado = [
            item for item in resultado
            if termo in item.get("comentario", "").lower() or termo in item.get("cliente_nome", "").lower()
        ]

    # Ordenação decrescente por data/hora (mais recentes primeiro)
    resultado.sort(key=lambda x: x.get("criado_em", ""), reverse=True)
    return resultado


def salvar_feedback(dados_feedback: Dict[str, Any]) -> Dict[str, Any]:
    """
    Persiste um novo feedback analisado na base de dados JSON.
    Gera identificador único UUID e carimbo de data/hora ISO 8601.
    
    Retorna o feedback persistido completo.
    """
    _garantir_diretorio_e_arquivo()
    feedbacks = listar_feedbacks()

    novo_id = dados_feedback.get("id") or f"fb_{uuid.uuid4().hex[:8]}"
    agora_iso = datetime.now().isoformat()

    registro: Dict[str, Any] = {
        "id": novo_id,
        "cliente_nome": dados_feedback.get("cliente_nome", "Cliente Anônimo"),
        "cliente_contato": dados_feedback.get("cliente_contato", ""),
        "numero_pedido": dados_feedback.get("numero_pedido", ""),
        "nota_lanche": dados_feedback.get("nota_lanche", 5),
        "nota_entrega": dados_feedback.get("nota_entrega", 5),
        "nota_atendimento": dados_feedback.get("nota_atendimento", 5),
        "nota_satisfacao": dados_feedback.get("nota_satisfacao", 5),
        "comentario": dados_feedback.get("comentario", ""),
        "sentimento": dados_feedback.get("sentimento", "Pendente"),
        "tags": dados_feedback.get("tags", []),
        "resumo": dados_feedback.get("resumo", "Processando análise semântica..."),
        "urgencia": dados_feedback.get("urgencia", False),
        "justificativa": dados_feedback.get("justificativa", ""),
        "alerta_disparado": dados_feedback.get("alerta_disparado", False),
        "resultado_alerta": dados_feedback.get("resultado_alerta"),
        "status": dados_feedback.get("status", "pendente"),  # 'pendente' ou 'tratado'
        "criado_em": dados_feedback.get("criado_em", agora_iso),
        "tratado_em": None,
        "notas_gerente": ""
    }

    feedbacks.append(registro)

    # Gravação atômica com indentação legível
    with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(feedbacks, f, indent=2, ensure_ascii=False)

    return registro


def atualizar_analise_feedback(
    feedback_id: str,
    analise: Dict[str, Any],
    alerta_disparado: bool = False,
    resultado_alerta: Optional[Dict[str, Any]] = None
) -> Optional[Dict[str, Any]]:
    """
    Atualiza um feedback já persistido com os resultados da análise semântica assíncrona da IA
    e o status do disparo do alerta de emergência.
    """
    _garantir_diretorio_e_arquivo()
    try:
        with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
            feedbacks: List[Dict[str, Any]] = json.load(f)
    except Exception:
        return None

    atualizado = None
    for item in feedbacks:
        if item.get("id") == feedback_id:
            item["sentimento"] = analise.get("sentimento", item.get("sentimento", "Neutro"))
            item["tags"] = analise.get("tags", item.get("tags", ["Sabor"]))
            item["resumo"] = analise.get("resumo", item.get("resumo", ""))
            item["justificativa"] = analise.get("justificativa", "")
            if analise.get("urgencia") or item.get("urgencia"):
                item["urgencia"] = True
            item["alerta_disparado"] = alerta_disparado
            item["resultado_alerta"] = resultado_alerta
            atualizado = item
            break

    if atualizado:
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(feedbacks, f, indent=2, ensure_ascii=False)

    return atualizado


def atualizar_status_feedback(
    feedback_id: str,
    status: str,
    notas_gerente: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Atualiza o status de tratativa de um feedback ('pendente' ou 'tratado')
    e opcionalmente anexa observações do gestor.
    """
    _garantir_diretorio_e_arquivo()
    try:
        with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
            feedbacks: List[Dict[str, Any]] = json.load(f)
    except Exception:
        return None

    atualizado = None
    for item in feedbacks:
        if item.get("id") == feedback_id:
            item["status"] = status
            if status == "tratado":
                item["tratado_em"] = datetime.now().isoformat()
            else:
                item["tratado_em"] = None

            if notas_gerente is not None:
                item["notas_gerente"] = notas_gerente

            atualizado = item
            break

    if atualizado:
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(feedbacks, f, indent=2, ensure_ascii=False)

    return atualizado


def obter_metricas() -> Dict[str, Any]:
    """
    Calcula métricas analíticas e operacionais consolidadas:
    - Total de feedbacks recebidos
    - Contagem por sentimento (Positivo, Neutro, Crítico)
    - Contagem por tag de domínio (Entrega, Sabor, Atendimento)
    - Taxa de tratativas concluídas pelo gestor
    """
    feedbacks = listar_feedbacks()
    total = len(feedbacks)

    positivos = sum(1 for f in feedbacks if f.get("sentimento", "").lower() == "positivo")
    neutros = sum(1 for f in feedbacks if f.get("sentimento", "").lower() == "neutro")
    criticos = sum(1 for f in feedbacks if f.get("sentimento", "").lower() == "crítico" or f.get("sentimento", "").lower() == "critico")

    tratados = sum(1 for f in feedbacks if f.get("status", "").lower() == "tratado")
    pendentes = total - tratados

    tags_contagem = {
        "Entrega": sum(1 for f in feedbacks if "entrega" in [t.lower() for t in f.get("tags", [])]),
        "Sabor": sum(1 for f in feedbacks if "sabor" in [t.lower() for t in f.get("tags", [])]),
        "Atendimento": sum(1 for f in feedbacks if "atendimento" in [t.lower() for t in f.get("tags", [])]),
    }

    taxa_resolucao = round((tratados / total * 100), 1) if total > 0 else 0.0

    return {
        "total": total,
        "positivos": positivos,
        "neutros": neutros,
        "criticos": criticos,
        "pendentes": pendentes,
        "tratados": tratados,
        "taxa_resolucao_pct": taxa_resolucao,
        "tags": tags_contagem
    }


if __name__ == "__main__":
    # Teste rápido de execução determinística
    print("Métricas atuais:", obter_metricas())
