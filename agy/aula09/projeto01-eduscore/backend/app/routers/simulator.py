"""
Router do Simulador de Acesso Universitário: SISU, ProUni e FIES
Cruza a nota do ENEM com notas de corte reais e coordenadas geográficas
Padrão SENAI - Sub-Segundo, Arredondamento 1 Casa Decimal & Alta Fidelidade
"""

import json
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from backend.app.core.database import DuckDBManager, _round1

router = APIRouter(prefix="/api/simulador", tags=["Simulador"])

class CidadeMapaItem(BaseModel):
    municipio: str
    uf: str
    lat: float
    lng: float
    total_cursos: int
    cursos_aprovados: int

class OportunidadeItem(BaseModel):
    id: int
    programa: str
    instituicao: str
    sigla: str
    tipo_instituicao: str
    curso: str
    grau: str
    turno: str
    modalidade: str
    nota_corte: float
    margem: float
    status: str
    status_cor: str
    uf: str
    municipio: str
    lat: float
    lng: float

class SimuladorResponse(BaseModel):
    elegivel: bool
    mensagem_elegibilidade: str
    nota_simulada: float
    programa: str
    total_oportunidades: int
    total_aprovadas: int
    cidades_mapa: List[CidadeMapaItem]
    oportunidades: List[OportunidadeItem]

@router.get("/oportunidades", response_model=SimuladorResponse)
async def simular_oportunidades(
    programa: str = Query("prouni", description="prouni, sisu ou fies"),
    nota: float = Query(650.0, ge=0.0, le=1000.0),
    uf: Optional[str] = Query(None),
    municipio: Optional[str] = Query(None),
    abrangencia: str = Query("estado", description="'estado' ou 'brasil'"),
    curso: Optional[str] = Query(None),
    turno: Optional[str] = Query(None),
    apenas_aprovados: bool = Query(False)
):
    """
    Simula em quais instituições, cidades e cursos a nota do estudante
    garante aprovação ou lista de espera no SISU, ProUni ou FIES.
    """
    prog = str(programa).lower().strip()
    if prog not in ["sisu", "prouni", "fies"]:
        prog = "prouni"

    nota_val = _round1(nota) or 650.0

    # Validação de elegibilidade básica do MEC (mínimo de 450 pontos)
    if nota_val < 450.0:
        return SimuladorResponse(
            elegivel=False,
            mensagem_elegibilidade="Sua nota está abaixo do mínimo regulamentar de 450 pontos exigido pelo MEC para o ProUni e FIES.",
            nota_simulada=nota_val,
            programa=prog,
            total_oportunidades=0,
            total_aprovadas=0,
            cidades_mapa=[],
            oportunidades=[]
        )

    # Construção de filtros SQL
    conditions = ["programa = ?"]
    params = [prog]

    if abrangencia == "estado" and uf and str(uf).strip():
        conditions.append("uf = ?")
        params.append(str(uf).strip().upper())

    if curso and str(curso).strip():
        conditions.append("LOWER(curso) LIKE ?")
        params.append(f"%{str(curso).strip().lower()}%")

    if turno and str(turno).strip():
        conditions.append("turno = ?")
        params.append(str(turno).strip())

    where_clause = "WHERE " + " AND ".join(conditions)

    query = f"""
    SELECT 
        id,
        programa,
        instituicao,
        sigla,
        tipo_instituicao,
        curso,
        grau,
        turno,
        modalidade,
        nota_corte,
        uf,
        municipio,
        lat,
        lng
    FROM oportunidades_ensino_superior
    {where_clause}
    ORDER BY nota_corte ASC
    """
    rows = DuckDBManager.execute_query(query, tuple(params))

    oportunidades: List[OportunidadeItem] = []
    cidades_dict = {}
    aprovadas_count = 0

    for r in rows:
        r_id, r_prog, r_inst, r_sigla, r_tipo, r_curso, r_grau, r_turno, r_mod, r_corte, r_uf, r_mun, r_lat, r_lng = r
        corte_float = float(r_corte)
        margem = _round1(nota_val - corte_float) or 0.0

        if margem >= 0.0:
            status = "Aprovado"
            status_cor = "emerald"
            aprovadas_count += 1
        elif margem >= -12.0:
            status = "Lista de Espera"
            status_cor = "amber"
        else:
            status = "Não Atinge"
            status_cor = "slate"

        if apenas_aprovados and status != "Aprovado":
            continue

        item = OportunidadeItem(
            id=r_id,
            programa=r_prog,
            instituicao=r_inst,
            sigla=r_sigla,
            tipo_instituicao=r_tipo,
            curso=r_curso,
            grau=r_grau,
            turno=r_turno,
            modalidade=r_mod,
            nota_corte=corte_float,
            margem=margem,
            status=status,
            status_cor=status_cor,
            uf=r_uf,
            municipio=r_mun,
            lat=float(r_lat),
            lng=float(r_lng)
        )
        oportunidades.append(item)

        # Agrupamento para marcadores do mapa
        c_key = f"{r_mun}-{r_uf}"
        if c_key not in cidades_dict:
            cidades_dict[c_key] = {
                "municipio": r_mun,
                "uf": r_uf,
                "lat": float(r_lat),
                "lng": float(r_lng),
                "total_cursos": 0,
                "cursos_aprovados": 0
            }
        cidades_dict[c_key]["total_cursos"] += 1
        if status == "Aprovado":
            cidades_dict[c_key]["cursos_aprovados"] += 1

    cidades_mapa = [CidadeMapaItem(**c) for c in cidades_dict.values()]

    # Mensagem contextual
    msg = f"Simulação concluída com sucesso para o programa {prog.upper()} com a pontuação de {nota_val:.1f} pontos."
    if prog == "prouni":
        msg += " Verifique se sua renda familiar atende aos critérios de Bolsa Integral (até 1,5 SM) ou Parcial (até 3 SM)."
    elif prog == "sisu":
        msg += " As vagas do SISU são 100% públicas e gratuitas em Universidades e Institutos Federais/Estaduais."
    elif prog == "fies":
        msg += " O FIES oferece financiamento estudantil prioritário com taxas reduzidas ou juros zero."

    return SimuladorResponse(
        elegivel=True,
        mensagem_elegibilidade=msg,
        nota_simulada=nota_val,
        programa=prog,
        total_oportunidades=len(oportunidades),
        total_aprovadas=aprovadas_count,
        cidades_mapa=cidades_mapa,
        oportunidades=oportunidades
    )
