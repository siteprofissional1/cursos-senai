"""
Ponto de Entrada Principal (Root Entrypoint)
Smart To-Do List (Ordenação Inteligente) - Google Antigravity & AG Kit
"""

import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from execution.main import main

if __name__ == "__main__":
    main()
