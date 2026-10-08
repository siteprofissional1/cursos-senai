"""
====================================================================
Projeto: Analisador de Feedbacks - Hamburgueria Gourmet
Camada 2 / Segurança: Módulo de Autenticação e Controle de Acesso
Em conformidade com OWASP Top 10 (A01 - Broken Access Control,
A07 - Identification and Authentication Failures)
Desenvolvido com: Google Antigravity & Python
====================================================================
"""

import os
import secrets
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

# Credenciais padrão seguras (podem ser substituídas via .env)
GERENTE_USUARIO = os.getenv("ADMIN_USERNAME", "gerente")
GERENTE_SENHA = os.getenv("ADMIN_PASSWORD", "gerente")

# Duração da sessão em horas
DURACAO_SESSAO_HORAS = 8

# Armazenamento em memória das sessões ativas: {token: {"usuario": str, "expira_em": datetime}}
SESSÕES_ATIVAS: Dict[str, Dict[str, Any]] = {}

# Controle de taxa contra força bruta (OWASP A07): {ip: {"tentativas": int, "bloqueado_ate": float}}
RATE_LIMIT_LOGIN: Dict[str, Dict[str, Any]] = {}
MAX_TENTATIVAS_FALHAS = 5
TEMPO_BLOQUEIO_SEGUNDOS = 60  # Bloqueio temporário de 1 minuto após 5 falhas

# Esquema de segurança HTTP Bearer
bearer_scheme = HTTPBearer(auto_error=False)


def verificar_rate_limit(ip: str) -> None:
    """Verifica e bloqueia tentativas excessivas de login para prevenir força bruta."""
    agora = time.time()
    registro = RATE_LIMIT_LOGIN.get(ip)
    if registro:
        if registro.get("bloqueado_ate", 0) > agora:
            tempo_restante = int(registro["bloqueado_ate"] - agora)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Muitas tentativas incorretas. Tente novamente em {tempo_restante} segundos."
            )
        elif registro.get("bloqueado_ate", 0) <= agora and registro.get("tentativas", 0) >= MAX_TENTATIVAS_FALHAS:
            # Reseta após término do bloqueio
            RATE_LIMIT_LOGIN[ip] = {"tentativas": 0, "bloqueado_ate": 0}


def registrar_falha_login(ip: str) -> None:
    """Registra tentativa falha e ativa bloqueio temporário se atingir o limite."""
    agora = time.time()
    registro = RATE_LIMIT_LOGIN.setdefault(ip, {"tentativas": 0, "bloqueado_ate": 0})
    registro["tentativas"] += 1
    if registro["tentativas"] >= MAX_TENTATIVAS_FALHAS:
        registro["bloqueado_ate"] = agora + TEMPO_BLOQUEIO_SEGUNDOS


def resetar_falhas_login(ip: str) -> None:
    """Limpa histórico de falhas após login bem-sucedido."""
    if ip in RATE_LIMIT_LOGIN:
        del RATE_LIMIT_LOGIN[ip]


def autenticar_gerente(usuario: str, senha: str, ip: str = "127.0.0.1") -> str:
    """
    Autentica o gerente utilizando comparação de tempo constante (secrets.compare_digest)
    para proteção estrita contra Timing Attacks (OWASP).
    Retorna um token criptograficamente seguro (32 bytes urlsafe).
    """
    verificar_rate_limit(ip)

    # Comparação em tempo constante para evitar vulnerabilidades de canal lateral (Timing Attack)
    usuario_valido = secrets.compare_digest(usuario.strip(), GERENTE_USUARIO)
    senha_valida = secrets.compare_digest(senha.strip(), GERENTE_SENHA)

    if not (usuario_valido and senha_valida):
        registrar_falha_login(ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas. Verifique usuário e senha.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Login bem-sucedido: limpa falhas do IP
    resetar_falhas_login(ip)

    # Gera token de alta entropia
    token = secrets.token_urlsafe(32)
    expiracao = datetime.now() + timedelta(hours=DURACAO_SESSAO_HORAS)

    SESSÕES_ATIVAS[token] = {
        "usuario": usuario,
        "expira_em": expiracao,
        "ip_origem": ip
    }

    return token


def validar_token(token: str) -> bool:
    """Valida se o token existe e não está expirado."""
    if not token or token not in SESSÕES_ATIVAS:
        return False

    sessao = SESSÕES_ATIVAS[token]
    if datetime.now() > sessao["expira_em"]:
        del SESSÕES_ATIVAS[token]
        return False

    return True


def revogar_token(token: str) -> bool:
    """Encerra a sessão revogando o token no servidor."""
    if token in SESSÕES_ATIVAS:
        del SESSÕES_ATIVAS[token]
        return True
    return False


def obter_gerente_autenticado(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)
) -> str:
    """
    Dependência do FastAPI para proteger rotas administrativas.
    Exige cabeçalho 'Authorization: Bearer <token>' válido.
    Impede que clientes ou usuários não autenticados acessem dados de outros clientes (OWASP A01).
    """
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Acesso restrito. Faça login para acessar o painel administrativo.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = auth.credentials.strip()
    if not validar_token(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sessão expirada ou token inválido. Faça login novamente.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return SESSÕES_ATIVAS[token]["usuario"]
