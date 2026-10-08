"""
Ponto de Entrada e Orquestração Local da Camada de Execução (Layer 3)
Smart To-Do List - Ordenação Inteligente de Tarefas
"""

import sys
import os
import argparse
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

# Adiciona o diretório raiz ao sys.path para garantir importações seguras
# Garante suporte adequado a UTF-8 no Windows para emojis e caracteres especiais
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from execution.ai_service import triar_tarefas_com_ia, obter_cliente_gemini
from execution.organize_tasks import (
    salvar_tarefas_brutas,
    ordenar_tarefas,
    salvar_tarefas_organizadas,
    ARQUIVO_ORGANIZADAS
)
from execution.view import exibir_tabela_tarefas
from execution.email_service import enviar_alerta_tarefas_criticas, verificar_configuracao_smtp

console = Console(force_terminal=True, legacy_windows=False)

LISTA_DEMO_PADRAO = (
    "responder e-mail da faculdade, "
    "consertar vazamento urgente da pia da cozinha, "
    "comprar pão na padaria, "
    "finalizar relatório trimestral para o diretor às 15h, "
    "levar o cachorro para passear"
)


def verificar_ambiente() -> bool:
    """Valida se as variáveis de ambiente necessárias estão devidamente configuradas."""
    try:
        obter_cliente_gemini()
        return True
    except ValueError as e:
        console.print(
            Panel(
                f"[bold red]{e}[/bold red]",
                title="❌ Erro de Configuração",
                border_style="red"
            )
        )
        return False


def obter_entrada_usuario(demo_mode: bool = False) -> str:
    """
    Obtém a lista de afazeres:
    - Se demo_mode=True, retorna a lista demonstrativa padrão.
    - Se for interativo, solicita a entrada do usuário via prompt do console.
    """
    if demo_mode:
        console.print(
            Panel(
                f"[bold cyan]Modo Demonstração Ativado[/bold cyan]\n"
                f"[dim]Usando afazeres de exemplo:[/dim]\n\n"
                f"[italic white]{LISTA_DEMO_PADRAO}[/italic white]",
                title="🚀 Modo Demo",
                border_style="cyan"
            )
        )
        return LISTA_DEMO_PADRAO

    console.print(
        Panel(
            "[bold white]Digite ou cole sua lista desorganizada de afazeres abaixo.[/bold white]\n"
            "[dim](Dica: Separe por vírgulas ou quebras de linha. Pressione ENTER com texto vazio para usar o modo demonstração)[/dim]",
            title="📥 Entrada de Afazeres",
            border_style="blue"
        )
    )

    try:
        entrada = Prompt.ask("[bold green]Suas Tarefas[/bold green]")
        if not entrada or not entrada.strip():
            console.print("[yellow]Nenhuma tarefa informada. Ativando afazeres padrão para demonstração...[/yellow]\n")
            return LISTA_DEMO_PADRAO
        return entrada
    except (KeyboardInterrupt, EOFError):
        console.print("\n[red]Operação cancelada pelo usuário.[/red]")
        sys.exit(0)


def executar_fluxo(demo: bool = False, texto_tarefas: str = None) -> None:
    """
    Executa o pipeline completo:
    1. Validação de ambiente (.env e GEMINI_API_KEY).
    2. Coleta de dados de entrada (Interativo ou Demo).
    3. Persistência transitória em .tmp/raw_tasks.json.
    4. Triagem cognitiva via Gemini (Structured Output).
    5. Ordenação determinística de prioridades e desempate por tempo.
    6. Persistência obrigatória em .tmp/tarefas_organizadas.json.
    7. Renderização no console via Rich.
    """
    console.print(
        Panel.fit(
            "[bold bright_white]🧠 SMART TO-DO LIST | ORDENAÇÃO INTELIGENTE COM IA[/bold bright_white]\n"
            "[dim]Arquitetura de 3 Camadas - Google Antigravity & AG Kit[/dim]",
            border_style="cyan"
        )
    )

    # 1. Validação de Ambiente
    if not verificar_ambiente():
        sys.exit(1)

    # 2. Obtenção do texto de entrada
    if texto_tarefas is not None:
        texto_bruto = texto_tarefas
    else:
        texto_bruto = obter_entrada_usuario(demo_mode=demo)

    if not texto_bruto.strip():
        console.print("[yellow]A lista de tarefas está em branco. Nenhuma ação necessária.[/yellow]")
        return

    # 3. Isolamento Transitório (Layer 1 SOP)
    salvar_tarefas_brutas(texto_bruto)

    # 4. Triagem com IA usando Gemini
    with console.status("[bold cyan]Analisando urgência, impacto e estimativas com Gemini...[/bold cyan]", spinner="dots"):
        try:
            tarefas_triadas = triar_tarefas_com_ia(texto_bruto)
        except Exception as e:
            console.print(
                Panel(
                    f"[bold red]Ocorreu um erro durante a triagem com IA:[/bold red]\n{e}",
                    title="Erro na API Gemini",
                    border_style="red"
                )
            )
            sys.exit(1)

    if not tarefas_triadas:
        console.print("[yellow]Não foi possível identificar tarefas válidas no texto informado.[/yellow]")
        return

    # 5. Ordenação Determinística
    tarefas_ordenadas = ordenar_tarefas(tarefas_triadas)

    # 6. Persistência Obrigatória
    caminho_salvo = salvar_tarefas_organizadas(tarefas_ordenadas)
    console.print(f"[bold green]✔[/bold green] [dim]Dados consolidados salvos com sucesso em:[/dim] [cyan]{caminho_salvo}[/cyan]")

    # 7. Notificação Automática por E-mail (SMTP) para Tarefas Críticas
    if verificar_configuracao_smtp():
        tem_criticas = any(t.get("prioridade") == "Crítica" for t in tarefas_ordenadas)
        if tem_criticas:
            with console.status("[bold yellow]Disparando e-mail de alerta para o gestor...[/bold yellow]"):
                sucesso_email, msg_email = enviar_alerta_tarefas_criticas(tarefas_ordenadas)
                if sucesso_email:
                    console.print(f"[bold green]📧[/bold green] [dim]{msg_email}[/dim]")
                else:
                    console.print(f"[yellow]⚠️  {msg_email}[/yellow]")

    # 8. Visualização no Console
    exibir_tabela_tarefas(tarefas_ordenadas)


def main():
    parser = argparse.ArgumentParser(description="Smart To-Do List - Triagem e Ordenação Cognitiva com IA")
    parser.add_argument(
        "--demo",
        action="store_true",
        help="Executa o pipeline imediatamente com a lista caótica de exemplo para demonstração autônoma."
    )
    parser.add_argument(
        "--input",
        type=str,
        default=None,
        help="Passa a lista de tarefas diretamente como argumento de linha de comando."
    )
    args = parser.parse_args()

    executar_fluxo(demo=args.demo, texto_tarefas=args.input)


if __name__ == "__main__":
    main()
