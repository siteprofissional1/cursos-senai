"""
Router de Status e Telemetria do Sistema EduScore
Padrão SENAI - Transparência Estatística & Auditoria
"""

import os
from fastapi import APIRouter
from backend.app.schemas import StatusResponse
from backend.app.core.config import TOTAL_CENSO_INSCRITOS, TOTAL_CENSO_AVALIADOS, DUCKDB_PATH, DATA_DIR

router = APIRouter(prefix="/api/status", tags=["Status"])

@router.get("", response_model=StatusResponse)
async def get_system_status():
    """
    Retorna o status do motor DuckDB, total de inscritos no censo (+4.81M)
    e total de participantes avaliados (+3.47M).
    """
    detected_files = []
    dados_dir = DATA_DIR / "microdados_enem_2025" / "DADOS"
    if dados_dir.exists():
        for f in os.listdir(dados_dir):
            if f.endswith(".csv"):
                detected_files.append(f)

    db_ready = DUCKDB_PATH.exists()

    return StatusResponse(
        status_db="Pronto para Consulta Instantânea" if db_ready else "Inicializando",
        engine="DuckDB Vectorized OLAP",
        total_rows=TOTAL_CENSO_INSCRITOS,
        evaluated_rows=TOTAL_CENSO_AVALIADOS,
        files=detected_files
    )
