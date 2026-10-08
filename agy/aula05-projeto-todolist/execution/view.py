import sys
import os
from typing import List, Dict, Any
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.align import Align
from rich.text import Text
from rich.columns import Columns

# Garante suporte adequado a UTF-8 no Windows para emojis e caracteres especiais
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

console = Console(force_terminal=True, legacy_windows=False)

# Mapeamento de cores e estilos semânticos para cada nível de prioridade
ESTILOS_PRIORIDADE = {
    "Crítica": "[bold white on red] 🚨 CRÍTICA [/]",
    "Alta": "[bold black on yellow] ⚠️  ALTA   [/]",
    "Média": "[bold white on blue] ℹ️  MÉDIA  [/]",
    "Baixa": "[bold white on green] ✅ BAIXA  [/]"
}

def formatar_tempo(minutos: int) -> str:
    """Formata minutos em um formato amigável como 'Xh Ymin' ou 'Z min'."""
    if minutos >= 60:
        horas = minutos // 60
        mins_restantes = minutos % 60
        if mins_restantes > 0:
            return f"{horas}h {mins_restantes}min"
        return f"{horas}h"
    return f"{minutos} min"


def exibir_tabela_tarefas(tarefas: List[Dict[str, Any]]) -> None:
    """
    Renderiza no console uma tabela rica, estilizada e moderna com a lista de tarefas,
    painéis de resumo com métricas do dia e o rodapé padrão obrigatório.
    """
    if not tarefas:
        console.print(
            Panel(
                "[yellow]Nenhuma tarefa a ser exibida na agenda.[/yellow]",
                title="Aviso",
                border_style="yellow"
            )
        )
        return

    # 1. Criação da Tabela Rich
    tabela = Table(
        title="📋 [bold cyan]Agenda Inteligente de Afazeres (Smart To-Do List)[/bold cyan]",
        title_justify="center",
        border_style="bright_blue",
        header_style="bold bright_white on dark_blue",
        show_lines=True
    )

    tabela.add_column("# Ordem", justify="center", style="bold cyan", no_wrap=True)
    tabela.add_column("Prioridade", justify="center", no_wrap=True)
    tabela.add_column("Tempo", justify="center", style="magenta", no_wrap=True)
    tabela.add_column("Tarefa", justify="left", style="bold white")
    tabela.add_column("Justificativa Estratégica", justify="left", style="italic white")

    tempo_total_minutos = 0
    total_criticas = 0

    for idx, tarefa in enumerate(tarefas, start=1):
        prioridade = tarefa.get("prioridade", "Média")
        badge_prioridade = ESTILOS_PRIORIDADE.get(
            prioridade, f"[cyan]{prioridade}[/]"
        )

        minutos = int(tarefa.get("tempo_estimado_minutos", 0))
        tempo_total_minutos += minutos

        if prioridade == "Crítica":
            total_criticas += 1

        tabela.add_row(
            f"{idx:02d}",
            badge_prioridade,
            formatar_tempo(minutos),
            tarefa.get("titulo", ""),
            tarefa.get("justificativa", "")
        )

    # Exibe a tabela principal
    console.print()
    console.print(tabela)
    console.print()

    # 2. Construção dos Cards de Resumo e Métricas
    tempo_formatado = formatar_tempo(tempo_total_minutos)
    
    card_tempo = Panel(
        Align.center(f"[bold green]{tempo_formatado}[/bold green]\n[dim]Tempo Estimado Total[/dim]"),
        title="⏳ [bold]Carga do Dia[/bold]",
        border_style="green"
    )

    estilo_critica = "bold red" if total_criticas > 0 else "dim green"
    card_criticas = Panel(
        Align.center(f"[{estilo_critica}]{total_criticas}[/{estilo_critica}]\n[dim]Ações Imediatas[/dim]"),
        title="🚨 [bold]Urgências[/bold]",
        border_style="red" if total_criticas > 0 else "green"
    )

    dica = (
        "Inicie imediatamente pela Tarefa #01 (Prioridade Máxima) para mitigar riscos!"
        if total_criticas > 0
        else "Excelente equilíbrio de demandas! Aplique blocos Pomodoro de 25 minutos."
    )
    card_dica = Panel(
        Align.center(f"[bold italic bright_yellow]{dica}[/bold italic bright_yellow]\n[dim]Foco & Produtividade[/dim]"),
        title="💡 [bold]Dica Estratégica[/bold]",
        border_style="yellow"
    )

    console.print(Columns([card_tempo, card_criticas, card_dica], equal=True))
    console.print()

    # 3. Rodapé Obrigatório (Global Rule):
    # 'Criado por siteprofissional.pro' centralizado no centro com link em azul
    texto_rodape = Text.from_markup(
        "Criado por [bold blue link=https://siteprofissional.pro]siteprofissional.pro[/bold blue link]"
    )
    console.print(Align.center(texto_rodape))
    console.print()
