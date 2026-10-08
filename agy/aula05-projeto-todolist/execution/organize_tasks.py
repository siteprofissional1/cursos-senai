"""
Módulo de Ordenação e Persistência Determinística de Tarefas
Camada 3 (Execução) - Smart To-Do List
"""

import os
import json
from typing import List, Dict, Any

# Caminhos dos arquivos de persistência conforme Layer 1 (Diretivas)
CAMINHO_TMP = ".tmp"
ARQUIVO_ORGANIZADAS = os.path.join(CAMINHO_TMP, "tarefas_organizadas.json")
ARQUIVO_RAW = os.path.join(CAMINHO_TMP, "raw_tasks.json")


def salvar_tarefas_brutas(texto_bruto: str) -> None:
    """
    Grava o texto de entrada original do usuário em .tmp/raw_tasks.json
    para fins de auditoria, rastreabilidade e garantia de idempotência.
    """
    os.makedirs(CAMINHO_TMP, exist_ok=True)
    dados_transitorios = {
        "input_bruto": texto_bruto,
        "total_caracteres": len(texto_bruto)
    }
    with open(ARQUIVO_RAW, "w", encoding="utf-8") as f:
        json.dump(dados_transitorios, f, ensure_ascii=False, indent=2)


def ordenar_tarefas(tarefas: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Aplica ordenação determinística na lista de afazeres:
    - 1º Critério: 'score_prioridade' em ordem decrescente (5 -> 1).
    - 2º Critério (Desempate): 'tempo_estimado_minutos' em ordem crescente (tarefas mais rápidas primeiro).
    
    Retorna uma nova lista ordenada sem mutar os dados originais indevidamente.
    """
    # Cria uma cópia rasa da lista para evitar efeitos colaterais
    tarefas_ordenadas = list(tarefas)

    # Chave de ordenação: (-score, tempo_em_minutos)
    tarefas_ordenadas.sort(
        key=lambda t: (
            -int(t.get("score_prioridade", 1)),
            int(t.get("tempo_estimado_minutos", 999))
        )
    )

    return tarefas_ordenadas


def salvar_tarefas_organizadas(tarefas_ordenadas: List[Dict[str, Any]]) -> str:
    """
    Persiste a lista final de tarefas estritamente no arquivo .tmp/tarefas_organizadas.json.
    Utiliza indentação de 2 espaços e codificação utf-8.
    Retorna o caminho absoluto do arquivo gerado.
    """
    os.makedirs(CAMINHO_TMP, exist_ok=True)

    with open(ARQUIVO_ORGANIZADAS, "w", encoding="utf-8") as f:
        json.dump(tarefas_ordenadas, f, ensure_ascii=False, indent=2)

    return os.path.abspath(ARQUIVO_ORGANIZADAS)


def carregar_tarefas_organizadas() -> List[Dict[str, Any]]:
    """
    Lê e retorna as tarefas gravadas em .tmp/tarefas_organizadas.json.
    Caso o arquivo não exista, retorna uma lista vazia.
    """
    if not os.path.exists(ARQUIVO_ORGANIZADAS):
        return []

    with open(ARQUIVO_ORGANIZADAS, "r", encoding="utf-8") as f:
        return json.load(f)
