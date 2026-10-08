"""
Módulo de Notificação por E-mail (SMTP)
Camada 3 (Execução) - Smart To-Do List
Envia alertas automáticos para o gestor quando tarefas de prioridade 'Crítica' são detectadas.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Any, Tuple
from dotenv import load_dotenv

load_dotenv()


def verificar_configuracao_smtp() -> bool:
    """Verifica se todas as variáveis necessárias para envio de e-mail estão presentes."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    manager_email = os.getenv("MANAGER_EMAIL")

    return bool(smtp_host and smtp_user and smtp_pass and manager_email)


def gerar_corpo_html(tarefas_criticas: List[Dict[str, Any]]) -> str:
    """Gera o template HTML estruturado e estilizado para o e-mail de notificação."""
    linhas_tabela = ""
    for idx, t in enumerate(tarefas_criticas, start=1):
        linhas_tabela += f"""
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; text-align: center; font-weight: bold; color: #e53e3e;">#{idx:02d}</td>
            <td style="padding: 12px; font-weight: bold; color: #2d3748;">{t.get('titulo', '')}</td>
            <td style="padding: 12px; text-align: center; color: #4a5568;">{t.get('tempo_estimado_minutos', 0)} min</td>
            <td style="padding: 12px; color: #718096; font-style: italic;">{t.get('justificativa', '')}</td>
        </tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px; }}
            .container {{ max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }}
            .header {{ background: #e53e3e; color: #ffffff; padding: 20px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 20px; letter-spacing: 0.5px; }}
            .content {{ padding: 24px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 16px; }}
            th {{ background: #edf2f7; color: #4a5568; padding: 10px; font-size: 13px; text-transform: uppercase; text-align: left; }}
            .footer {{ text-align: center; padding: 20px; font-size: 13px; color: #a0aec0; border-top: 1px solid #edf2f7; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚨 ALERTA: Demandas Críticas Identificadas</h1>
            </div>
            <div class="content">
                <p style="color: #4a5568; font-size: 15px;">
                    Olá! O sistema <strong>Smart To-Do List</strong> identificou afazeres de urgência máxima (Score 5) que exigem intervenção imediata.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: center;">#</th>
                            <th>Tarefa</th>
                            <th style="text-align: center;">Tempo</th>
                            <th>Justificativa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {linhas_tabela}
                    </tbody>
                </table>
            </div>
            <div class="footer">
                <p>Criado por <a href="https://siteprofissional.pro" style="color: #3182ce; text-decoration: underline;">siteprofissional.pro</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    return html


def enviar_alerta_tarefas_criticas(tarefas: List[Dict[str, Any]]) -> Tuple[bool, str]:
    """
    Filtra tarefas com prioridade 'Crítica' e dispara o e-mail de alerta para o MANAGER_EMAIL.
    Retorna uma tupla (sucesso: bool, mensagem: str).
    """
    tarefas_criticas = [t for t in tarefas if t.get("prioridade") == "Crítica"]
    if not tarefas_criticas:
        return False, "Nenhuma tarefa crítica encontrada. Notificação por e-mail dispensada."

    if not verificar_configuracao_smtp():
        return False, "Configurações SMTP incompletas no arquivo .env."

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 465))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    manager_email = os.getenv("MANAGER_EMAIL")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🚨 [Smart To-Do] {len(tarefas_criticas)} Tarefa(s) Crítica(s) Requerem Atenção Imediata"
    msg["From"] = f"Smart To-Do List <{smtp_user}>"
    msg["To"] = manager_email

    html_content = gerar_corpo_html(tarefas_criticas)
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        # Tenta conexão segura via SSL (Porta 465) ou STARTTLS (Porta 587)
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10) as server:
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [manager_email], msg.as_string())
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [manager_email], msg.as_string())

        return True, f"E-mail de alerta enviado com sucesso para {manager_email}."

    except Exception as erro:
        # Registra falha no log transitório para auditoria sem quebrar o fluxo principal
        os.makedirs(".tmp", exist_ok=True)
        with open(".tmp/error.log", "a", encoding="utf-8") as f:
            f.write(f"[FALHA SMTP] Erro ao enviar e-mail para {manager_email}: {erro}\n")

        return False, f"Falha ao enviar e-mail de notificação: {erro}"
