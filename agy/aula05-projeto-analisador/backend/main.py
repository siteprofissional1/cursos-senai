"""
====================================================================
Projeto: Analisador de Feedbacks - Hamburgueria Gourmet
Camada 2 (Orquestração de Aplicação): Backend API FastAPI
Com Segurança e Controle de Acesso (OWASP Top 10)
Desenvolvido com: Google Antigravity & Python
====================================================================
Função da Aplicação:
Servir como o orquestrador das rotas HTTP, recebendo as avaliações
públicas de clientes, garantindo o isolamento transitório na pasta
`.tmp/`, orquestrando os scripts determinísticos da Camada 3 (`execution/`),
protegendo dados confidenciais contra acessos não autorizados e
servindo o painel gerencial administrativo autenticado.
"""

import os
import sys
import json
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

# Assegura que o diretório raiz do projeto esteja no sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi import FastAPI, HTTPException, Query, Request, Depends, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# Importação dos módulos determinísticos da Camada 3
from execution.analyze_feedback import analisar_feedback
from execution.send_alert import disparar_alerta_gerente
from execution.manage_data import (
    salvar_feedback,
    listar_feedbacks,
    atualizar_status_feedback,
    atualizar_analise_feedback,
    obter_metricas
)

# Importação do módulo de autenticação e proteção OWASP
from backend.auth import (
    autenticar_gerente,
    revogar_token,
    obter_gerente_autenticado,
    bearer_scheme
)

# Inicialização da API FastAPI
app = FastAPI(
    title="Hamburgueria do Joselito - Analisador de Feedbacks",
    description="API inteligente de análise semântica e gestão de feedbacks da Hamburgueria do Joselito.",
    version="1.2.0"
)

# Configuração de CORS para permitir acesso irrestrito do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TMP_DIR = os.path.join(BASE_DIR, ".tmp")
os.makedirs(TMP_DIR, exist_ok=True)


# ====================================================================
# Schemas de Validação de Entrada (Pydantic)
# ====================================================================

class LoginRequest(BaseModel):
    """Schema para autenticação do gerente."""
    usuario: str = Field(..., min_length=1, max_length=50, description="Nome de usuário do gerente")
    senha: str = Field(..., min_length=1, max_length=100, description="Senha de acesso do gerente")


class NovoFeedbackRequest(BaseModel):
    """Schema do formulário público de submissão do cliente."""
    cliente_nome: str = Field(..., min_length=1, max_length=100, description="Nome do cliente (obrigatório)")
    numero_pedido: Optional[str] = Field(default="", max_length=50, description="Número do pedido (opcional)")
    cliente_contato: Optional[str] = Field(default="", max_length=100, description="Telefone ou e-mail (opcional)")
    nota_lanche: int = Field(..., ge=1, le=5, description="Avaliação do lanche de 1 a 5 estrelas")
    nota_entrega: int = Field(..., ge=1, le=5, description="Avaliação da entrega de 1 a 5 estrelas")
    nota_atendimento: int = Field(..., ge=1, le=5, description="Avaliação do atendimento de 1 a 5 estrelas")
    comentario: str = Field(..., min_length=1, max_length=1000, description="Sua avaliação em texto")


class AtualizarStatusRequest(BaseModel):
    """Schema para o gerente atualizar o status de tratativa."""
    status: str = Field(..., description="'pendente' ou 'tratado'")
    notas_gerente: Optional[str] = Field(default=None, max_length=500, description="Observações de resolução do gestor")


# ====================================================================
# Função Auxiliar de Processamento em Segundo Plano (Background Task)
# ====================================================================

def processar_analise_e_alerta_em_segundo_plano(
    feedback_id: str,
    cliente_nome: str,
    numero_pedido: str,
    cliente_contato: str,
    nota_lanche: int,
    nota_entrega: int,
    nota_atendimento: int,
    comentario: str
) -> None:
    """
    Executa a análise semântica da IA e o disparo de e-mail de alerta em background.
    Garante que a resposta ao cliente seja imediata, sem telas de carregamento.
    """
    try:
        analise = analisar_feedback(comentario)

        # Regra de Emergência: Alerta por e-mail se qualquer uma das notas for 1 ou 2
        eh_emergencia = (nota_lanche in [1, 2]) or (nota_entrega in [1, 2]) or (nota_atendimento in [1, 2])

        alerta_disparado = False
        resultado_alerta = None

        if eh_emergencia:
            dados_alerta = {
                "cliente_nome": cliente_nome,
                "numero_pedido": numero_pedido,
                "cliente_contato": cliente_contato,
                "nota_lanche": nota_lanche,
                "nota_entrega": nota_entrega,
                "nota_atendimento": nota_atendimento,
                "nota_satisfacao": nota_lanche,
                "comentario": comentario,
                "sentimento": analise.get("sentimento", "Crítico"),
                "tags": analise.get("tags", ["Sabor"]),
                "resumo": analise.get("resumo", comentario[:80]),
                "justificativa": analise.get("justificativa", "Avaliação com nota baixa detectada."),
                "criado_em": datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            }
            resultado_alerta = disparar_alerta_gerente(dados_alerta)
            alerta_disparado = True

        atualizar_analise_feedback(
            feedback_id=feedback_id,
            analise=analise,
            alerta_disparado=alerta_disparado,
            resultado_alerta=resultado_alerta
        )
    except Exception as e:
        print(f"[ERRO BACKGROUND PROCESSING] Falha ao processar feedback {feedback_id}: {e}")


# ====================================================================
# Endpoints de Autenticação (OWASP A01 / A07)
# ====================================================================

@app.post("/api/auth/login")
def login_gerente(dados: LoginRequest, request: Request) -> Dict[str, Any]:
    """
    Autentica o gerente e emite um token Bearer seguro.
    Protegido contra Timing Attacks e Força Bruta (Rate Limiting).
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    token = autenticar_gerente(dados.usuario, dados.senha, ip=client_ip)
    return {
        "sucesso": True,
        "mensagem": "Autenticação realizada com sucesso.",
        "token": token,
        "usuario": dados.usuario
    }


@app.post("/api/auth/logout")
def logout_gerente(
    usuario: str = Depends(obter_gerente_autenticado),
    auth = Depends(bearer_scheme)
) -> Dict[str, Any]:
    """Encerra a sessão administrativa revogando o token ativo no servidor."""
    if auth and auth.credentials:
        revogar_token(auth.credentials)
    return {"sucesso": True, "mensagem": "Sessão encerrada com sucesso."}


@app.get("/api/auth/verify")
def verificar_sessao(usuario: str = Depends(obter_gerente_autenticado)) -> Dict[str, Any]:
    """Valida se a sessão do gerente permanece válida."""
    return {"autenticado": True, "usuario": usuario}


# ====================================================================
# Endpoints Públicos (Clientes)
# ====================================================================

@app.get("/api/health")
def health_check() -> Dict[str, Any]:
    """Endpoint de checagem de saúde e status do sistema."""
    return {
        "status": "online",
        "sistema": "Hamburgueria do Joselito",
        "timestamp": datetime.now().isoformat(),
        "versao": "1.2.0"
    }


@app.post("/api/feedbacks", status_code=status.HTTP_201_CREATED)
def criar_feedback(
    dados: NovoFeedbackRequest,
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    """
    Fluxo Instantâneo de Ingestão:
    1. Salva imediatamente no banco persistente em ~5ms para que apareça de pronto na área do gerente.
    2. Dispara a análise com IA e notificação de e-mail em background tasks assíncrono.
    3. Retorna sucesso imediato para o cliente sem esperas ou telas de carregamento.
    """
    eh_emergencia = (dados.nota_lanche in [1, 2]) or (dados.nota_entrega in [1, 2]) or (dados.nota_atendimento in [1, 2])
    nota_media = round((dados.nota_lanche + dados.nota_entrega + dados.nota_atendimento) / 3, 1)

    registro_inicial = {
        "cliente_nome": dados.cliente_nome.strip(),
        "numero_pedido": (dados.numero_pedido or "").strip(),
        "cliente_contato": (dados.cliente_contato or "").strip(),
        "nota_lanche": dados.nota_lanche,
        "nota_entrega": dados.nota_entrega,
        "nota_atendimento": dados.nota_atendimento,
        "nota_satisfacao": dados.nota_lanche,
        "nota_media": nota_media,
        "comentario": dados.comentario.strip(),
        "sentimento": "Crítico" if eh_emergencia else "Pendente",
        "tags": ["Entrega", "Sabor"] if eh_emergencia else [],
        "resumo": "Processando análise semântica...",
        "urgencia": eh_emergencia,
        "alerta_disparado": False,
        "status": "pendente"
    }

    registro_salvo = salvar_feedback(registro_inicial)

    # Agenda processamento de IA e disparo de e-mail em segundo plano
    background_tasks.add_task(
        processar_analise_e_alerta_em_segundo_plano,
        feedback_id=registro_salvo["id"],
        cliente_nome=dados.cliente_nome.strip(),
        numero_pedido=(dados.numero_pedido or "").strip(),
        cliente_contato=(dados.cliente_contato or "").strip(),
        nota_lanche=dados.nota_lanche,
        nota_entrega=dados.nota_entrega,
        nota_atendimento=dados.nota_atendimento,
        comentario=dados.comentario.strip()
    )

    return {
        "sucesso": True,
        "mensagem": "Sua avaliação foi enviada com sucesso! Muito obrigado pelo seu feedback!",
        "feedback": registro_salvo
    }


# ====================================================================
# Endpoints Protegidos (Área Exclusiva do Gerente - OWASP A01)
# ====================================================================

@app.get("/api/feedbacks")
def listar_todos_feedbacks(
    sentimento: Optional[str] = Query(None, description="Filtrar por 'Positivo', 'Neutro' ou 'Crítico'"),
    tag: Optional[str] = Query(None, description="Filtrar por 'Entrega', 'Sabor' ou 'Atendimento'"),
    status: Optional[str] = Query(None, description="Filtrar por 'pendente' ou 'tratado'"),
    busca: Optional[str] = Query(None, description="Texto de busca em comentário ou nome"),
    usuario: str = Depends(obter_gerente_autenticado)
) -> List[Dict[str, Any]]:
    """
    Consulta as avaliações estruturadas para o painel administrativo.
    Requer autenticação Bearer de Gerente.
    """
    return listar_feedbacks(sentimento=sentimento, tag=tag, status=status, busca=busca)


@app.patch("/api/feedbacks/{feedback_id}")
def atualizar_status(
    feedback_id: str,
    dados: AtualizarStatusRequest,
    usuario: str = Depends(obter_gerente_autenticado)
) -> Dict[str, Any]:
    """
    Atualiza o status de tratativa e notas de resolução do gerente.
    Requer autenticação Bearer de Gerente.
    """
    if dados.status not in ["pendente", "tratado"]:
        raise HTTPException(status_code=400, detail="Status deve ser 'pendente' ou 'tratado'.")

    atualizado = atualizar_status_feedback(feedback_id, dados.status, dados.notas_gerente)
    if not atualizado:
        raise HTTPException(status_code=404, detail="Feedback não encontrado.")

    return {
        "sucesso": True,
        "mensagem": f"Status atualizado para '{dados.status}'.",
        "feedback": atualizado
    }


@app.get("/api/metrics")
def consultar_metricas(
    usuario: str = Depends(obter_gerente_autenticado)
) -> Dict[str, Any]:
    """
    Retorna indicadores de desempenho e distribuição de feedbacks.
    Requer autenticação Bearer de Gerente.
    """
    return obter_metricas()


@app.post("/api/test-alert")
def testar_disparo_alerta(
    usuario: str = Depends(obter_gerente_autenticado)
) -> Dict[str, Any]:
    """
    Dispara um teste controlado de envio de e-mail de contingência ao gerente.
    Requer autenticação Bearer de Gerente.
    """
    feedback_exemplo = {
        "id": "fb_teste_sistema",
        "cliente_nome": "Avaliação de Teste do Sistema",
        "cliente_contato": "(14) 99999-0000",
        "comentario": "Teste automatizado da rotina de contingência do Analisador de Feedbacks.",
        "sentimento": "Crítico",
        "tags": ["Entrega", "Sabor", "Atendimento"],
        "resumo": "Disparo de Teste do Gerador de Alertas",
        "justificativa": "Validação de rotina de e-mail solicitada pelo administrador."
    }
    resultado = disparar_alerta_gerente(feedback_exemplo)
    return {"sucesso": True, "resultado": resultado}


# ====================================================================
# Servir arquivos do Frontend Estático
# ====================================================================
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    def index():
        cliente_html = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(cliente_html):
            return FileResponse(cliente_html)
        return {"mensagem": "API ativa. Acesse /docs para documentação interativa."}

    @app.get("/admin")
    def admin():
        admin_html = os.path.join(FRONTEND_DIR, "admin.html")
        if os.path.exists(admin_html):
            return FileResponse(admin_html)
        return {"mensagem": "Painel de administração em construção."}


if __name__ == "__main__":
    import uvicorn
    # Executa o servidor na porta 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
