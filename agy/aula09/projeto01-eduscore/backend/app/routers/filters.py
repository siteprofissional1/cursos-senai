"""
Router de Filtros Geográficos e Estrutura Hierárquica
Padrão SENAI - Clean Code & Cache Local
"""

import json
from fastapi import APIRouter, HTTPException
from backend.app.core.config import GEO_HIERARCHY_PATH

router = APIRouter(prefix="/api/filters", tags=["Filters"])

@router.get("/locations")
async def get_locations():
    """
    Retorna a árvore hierárquica cacheada de Regiões, UFs e Municípios.
    Permite comboboxes em cascata sem repetição de requisições pesadas.
    """
    if not GEO_HIERARCHY_PATH.exists():
        raise HTTPException(status_code=404, detail="Hierarquia geográfica não encontrada.")

    try:
        with open(GEO_HIERARCHY_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao ler hierarquia: {str(e)}")
