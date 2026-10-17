"""
Configurações Globais do Backend EduScore
Padrão SENAI - Clean Code & Spec-Driven Development
"""

import os
from pathlib import Path

# Diretórios base
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"

# Caminhos dos arquivos de dados
DUCKDB_PATH = PROCESSED_DIR / "eduscore.duckdb"
GEO_HIERARCHY_PATH = PROCESSED_DIR / "geo_hierarchy.json"
GEO_ATTENDANCE_PATH = PROCESSED_DIR / "geo_attendance.json"
CSV_RESULTADOS_PATH = DATA_DIR / "microdados_enem_2025" / "DADOS" / "RESULTADOS_2025.csv"

# Totais canônicos do Censo ENEM 2025
TOTAL_CENSO_INSCRITOS = 4810772
TOTAL_CENSO_AVALIADOS = 3473543
