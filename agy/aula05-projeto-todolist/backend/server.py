"""
Servidor Backend FastAPI - Smart To-Do List
Disponibiliza API REST para triagem com Gemini e serve o Frontend estático na porta 8001.
"""

import os
import sys
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Garante acesso aos módulos em execution/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from execution.ai_service import triar_tarefas_com_ia, obter_cliente_gemini
from execution.organize_tasks import (
    salvar_tarefas_brutas,
    ordenar_tarefas,
    salvar_tarefas_organizadas,
    carregar_tarefas_organizadas,
    ARQUIVO_ORGANIZADAS
)
from execution.email_service import enviar_alerta_tarefas_criticas, verificar_configuracao_smtp

app = FastAPI(
    title="Smart To-Do List API",
    description="API para triagem inteligente e ordenação determinística de tarefas com IA (Gemini)",
    version="1.0.0"
)

# Habilita CORS para permitir acesso seguro
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrganizeRequest(BaseModel):
    text: str

class OrganizeResponse(BaseModel):
    tasks: List[Dict[str, Any]]
    total_minutos: int
    total_criticas: int
    email_enviado: bool
    mensagem_email: Optional[str] = None


@app.get("/api/tasks")
def listar_tarefas():
    """Retorna as tarefas atualmente organizadas no arquivo .tmp/tarefas_organizadas.json."""
    tarefas = carregar_tarefas_organizadas()
    total_minutos = sum(int(t.get("tempo_estimado_minutos", 0)) for t in tarefas)
    total_criticas = sum(1 for t in tarefas if t.get("prioridade") == "Crítica")
    return {
        "tasks": tarefas,
        "total_minutos": total_minutos,
        "total_criticas": total_criticas
    }


@app.post("/api/organize", response_model=OrganizeResponse)
def organizar_tarefas_endpoint(payload: OrganizeRequest):
    """
    Recebe a lista de afazeres brutos, realiza triagem cognitiva com Gemini,
    aplica ordenação determinística e dispara notificação SMTP se houver tarefas críticas.
    """
    texto = payload.text.strip() if payload.text else ""
    if not texto:
        raise HTTPException(status_code=400, detail="O texto das tarefas não pode estar em branco.")

    # 1. Isolamento Transitório
    salvar_tarefas_brutas(texto)

    # 2. Triagem com IA
    try:
        tarefas_triadas = triar_tarefas_com_ia(texto)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise de IA: {str(e)}")

    if not tarefas_triadas:
        return OrganizeResponse(
            tasks=[],
            total_minutos=0,
            total_criticas=0,
            email_enviado=False,
            mensagem_email="Nenhuma tarefa válida identificada pelo modelo."
        )

    # 3. Ordenação Determinística
    tarefas_ordenadas = ordenar_tarefas(tarefas_triadas)

    # 4. Persistência Obrigatória
    salvar_tarefas_organizadas(tarefas_ordenadas)

    # 5. Notificação por E-mail (se houver tarefas críticas e SMTP configurado)
    email_enviado = False
    mensagem_email = None
    if verificar_configuracao_smtp():
        tem_criticas = any(t.get("prioridade") == "Crítica" for t in tarefas_ordenadas)
        if tem_criticas:
            email_enviado, mensagem_email = enviar_alerta_tarefas_criticas(tarefas_ordenadas)

    total_minutos = sum(int(t.get("tempo_estimado_minutos", 0)) for t in tarefas_ordenadas)
    total_criticas = sum(1 for t in tarefas_ordenadas if t.get("prioridade") == "Crítica")

    return OrganizeResponse(
        tasks=tarefas_ordenadas,
        total_minutos=total_minutos,
        total_criticas=total_criticas,
        email_enviado=email_enviado,
        mensagem_email=mensagem_email
    )


# Monta a pasta frontend estática para servir a interface web na rota raiz
caminho_frontend = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(caminho_frontend):
    app.mount("/", StaticFiles(directory=caminho_frontend, html=True), name="frontend")
