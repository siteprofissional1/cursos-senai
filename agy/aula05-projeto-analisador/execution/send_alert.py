"""
====================================================================
Projeto: Analisador de Feedbacks - Hamburgueria Gourmet
Camada 3 (Execução Determinística): Disparo de Alertas Críticos (SMTP)
Desenvolvido com: Google Antigravity & Python
====================================================================
Função do Módulo:
Notificar imediatamente o gerente por e-mail quando uma avaliação
crítica for detectada.
Possui arquitetura de resiliência (Self-Annealing) com retentativas
e fila de contingência local em `.tmp/failed_alerts_queue.json`.
"""

import os
import json
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Carrega variáveis de ambiente com sobrescrita explícita
load_dotenv(override=True)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMP_DIR = os.path.join(BASE_DIR, ".tmp")
FAILED_ALERTS_FILE = os.path.join(TMP_DIR, "failed_alerts_queue.json")


def _garantir_diretorio_tmp() -> None:
    """Garante a existência do diretório temporário .tmp."""
    os.makedirs(TMP_DIR, exist_ok=True)


def _salvar_fila_contingencia(dados_alerta: Dict[str, Any], motivo: str) -> None:
    """
    Registra o alerta não enviado na fila de contingência `.tmp/failed_alerts_queue.json`.
    Permite reprocessamento posterior sem perda de dados críticos.
    """
    _garantir_diretorio_tmp()
    fila = []
    if os.path.exists(FAILED_ALERTS_FILE):
        try:
            with open(FAILED_ALERTS_FILE, "r", encoding="utf-8") as f:
                fila = json.load(f)
        except Exception:
            fila = []

    item_contingencia = {
        "timestamp_tentativa": datetime.now().isoformat(),
        "motivo_falha": motivo,
        "dados": dados_alerta
    }
    fila.append(item_contingencia)

    with open(FAILED_ALERTS_FILE, "w", encoding="utf-8") as f:
        json.dump(fila, f, indent=2, ensure_ascii=False)


def construir_corpo_email_html(feedback: Dict[str, Any]) -> str:
    """Gera template de e-mail HTML moderno e de alto impacto para o gerente."""
    cliente_nome = feedback.get("cliente_nome", "Anônimo")
    numero_pedido = feedback.get("numero_pedido") or "Não informado"
    cliente_contato = feedback.get("cliente_contato") or "Não informado"
    comentario = feedback.get("comentario", "")
    resumo = feedback.get("resumo", "Atenção requerida")
    tags = ", ".join(feedback.get("tags", [])) or "Geral"
    justificativa = feedback.get("justificativa", "")
    criado_em = feedback.get("criado_em", datetime.now().strftime("%d/%m/%Y %H:%M"))
    
    nota_lanche = feedback.get("nota_lanche", feedback.get("nota_satisfacao", "-"))
    nota_entrega = feedback.get("nota_entrega", "-")
    nota_atendimento = feedback.get("nota_atendimento", "-")

    html = f"""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>ALERTA DE EMERGÊNCIA: Hamburgueria do Joselito</title>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
            .card {{ background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #fee2e2; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.08); overflow: hidden; }}
            .header {{ background-color: #dc2626; color: #ffffff; padding: 24px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }}
            .content {{ padding: 24px; color: #1e293b; }}
            .tag-badge {{ display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 12px; margin-right: 6px; }}
            .review-box {{ background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }}
            .ratings-grid {{ display: flex; gap: 10px; margin: 12px 0; background: #fff1f2; padding: 10px; border-radius: 8px; font-size: 13px; }}
            .footer {{ background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }}
            .footer a {{ color: #2563eb; text-decoration: none; font-weight: 600; }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h1>🚨 Alerta de Emergência (Nota 1 ou 2)</h1>
                <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Hamburgueria do Joselito - Ação Imediata Necessária</p>
            </div>
            <div class="content">
                <p><strong>Síntese da Ocorrência:</strong></p>
                <div class="review-box">
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #991b1b;">{resumo}</p>
                    <p style="margin: 8px 0 0 0; font-style: italic; color: #334155;">"{comentario}"</p>
                </div>

                <div class="ratings-grid">
                    <div>🍔 Lanche: <strong>{nota_lanche}★</strong></div>
                    <div>🚚 Entrega: <strong>{nota_entrega}★</strong></div>
                    <div>🤝 Atendimento: <strong>{nota_atendimento}★</strong></div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Cliente:</strong></td>
                        <td style="padding: 6px 0;">{cliente_nome}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Nº do Pedido:</strong></td>
                        <td style="padding: 6px 0;">{numero_pedido}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Contato:</strong></td>
                        <td style="padding: 6px 0;">{cliente_contato}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Tags Afetadas:</strong></td>
                        <td style="padding: 6px 0;"><span class="tag-badge">{tags}</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Análise Técnica (IA):</strong></td>
                        <td style="padding: 6px 0; color: #475569;">{justificativa}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #64748b;"><strong>Data/Hora:</strong></td>
                        <td style="padding: 6px 0;">{criado_em}</td>
                    </tr>
                </table>
                <div style="margin-top: 24px; text-align: center;">
                    <a href="http://localhost:8000/admin" style="background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; display: inline-block;">Acessar Painel do Gerente</a>
                </div>
            </div>
            <div class="footer">
                Criado por <a href="https://siteprofissional.pro" target="_blank" rel="noopener noreferrer">siteprofissional.pro</a>
            </div>
        </div>
    </body>
    </html>
    """
    return html


def disparar_alerta_gerente(
    feedback: Dict[str, Any],
    max_retentativas: int = 3
) -> Dict[str, Any]:
    """
    Dispara e-mail de alerta crítico para o gerente.
    Implementa retentativas com recuo exponencial e fallback para fila de contingência.
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    manager_email = os.getenv("MANAGER_EMAIL", "gerente@hamburgueriaourinhos.com.br")

    # Verificação de credenciais para ambiente de homologação/produção
    is_placeholder = (
        not (smtp_host and smtp_user and smtp_pass) or
        "sua_senha" in smtp_pass.lower() or
        "seu_email" in smtp_user.lower() or
        "exemplo" in smtp_user.lower()
    )
    if is_placeholder:
        motivo = "Credenciais SMTP ausentes ou com valores de placeholder no .env. Ativando modo de contingência/simulação."
        _salvar_fila_contingencia(feedback, motivo)
        print(f"[ALERTA CRÍTICO - CONTINGÊNCIA] {motivo} Alerta registrado na fila local.")
        return {
            "sucesso": True,
            "modo": "simulado_contingencia",
            "mensagem": "Alerta registrado com sucesso na fila local (.tmp/failed_alerts_queue.json).",
            "destinatario": manager_email
        }

    # Tentativas determinísticas de envio com retentativa exponencial
    for tentativa in range(1, max_retentativas + 1):
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"🚨 [CRÍTICO] Avaliação Negativa Recebida - {feedback.get('cliente_nome', 'Cliente')}"
            msg["From"] = smtp_user
            msg["To"] = manager_email

            corpo_html = construir_corpo_email_html(feedback)
            msg.attach(MIMEText(corpo_html, "html", "utf-8"))

            if smtp_port == 465:
                with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10) as server:
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [manager_email], msg.as_string())
            else:
                with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [manager_email], msg.as_string())

            print(f"[ALERTA CRÍTICO] E-mail enviado com sucesso na tentativa {tentativa} para {manager_email}")
            return {
                "sucesso": True,
                "modo": "smtp_real",
                "tentativas": tentativa,
                "destinatario": manager_email
            }

        except Exception as erro:
            print(f"[ALERTA CRÍTICO] Falha na tentativa {tentativa}/{max_retentativas}: {erro}")
            if tentativa < max_retentativas:
                time.sleep(2 ** tentativa)  # Recuo exponencial: 2s, 4s...
            else:
                motivo = f"Erro de conexão SMTP após {max_retentativas} tentativas: {str(erro)}"
                _salvar_fila_contingencia(feedback, motivo)
                return {
                    "sucesso": False,
                    "modo": "falha_contingencia",
                    "erro": motivo,
                    "destinatario": manager_email
                }

    return {"sucesso": False, "modo": "desconhecido"}


if __name__ == "__main__":
    # Teste de simulação de disparo
    teste_feedback = {
        "id": "fb_teste",
        "cliente_nome": "João Carlos",
        "cliente_contato": "(14) 99999-8888",
        "comentario": "O hambúrguer estava completamente queimado e a entrega demorou 1h40!",
        "sentimento": "Crítico",
        "tags": ["Entrega", "Sabor"],
        "resumo": "Atraso severo na entrega e hambúrguer queimado",
        "justificativa": "Cliente expressou indignação grave com entrega e preparo do produto."
    }
    resultado = disparar_alerta_gerente(teste_feedback)
    print("Resultado do disparo:", resultado)
