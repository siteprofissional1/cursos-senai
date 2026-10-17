"""
Router de Analytics e Métricas Comparativas
Processa Benchmarks, Donut Charts e Rankings Top 10
Padrão SENAI - Sub-Segundo, Arredondamento Estrito 1 Casa Decimal
"""

import json
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from backend.app.core.database import DuckDBManager, _round1
from backend.app.core.config import GEO_ATTENDANCE_PATH
from backend.app.schemas import (
    AnalyticsDashboardResponse,
    ScoreDetail,
    ScoreComparison,
    AttendanceStats,
    TopSchoolItem
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

UF_REGION_MAP = {
    "Norte": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
    "Nordeste": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
    "Centro-Oeste": ["DF", "GO", "MT", "MS"],
    "Sudeste": ["ES", "MG", "RJ", "SP"],
    "Sul": ["PR", "RS", "SC"]
}

VALID_SORT_COLS = {
    "media_geral": "media_geral",
    "geral": "media_geral",
    "natureza": "media_cn",
    "cn": "media_cn",
    "humanas": "media_ch",
    "ch": "media_ch",
    "linguagens": "media_lc",
    "lc": "media_lc",
    "matematica": "media_mt",
    "mt": "media_mt",
    "redacao": "media_redacao"
}

def load_attendance_cache():
    if not GEO_ATTENDANCE_PATH.exists():
        return None
    try:
        with open(GEO_ATTENDANCE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None

@router.get("/summary", response_model=ScoreComparison)
async def get_summary(
    regiao: Optional[str] = None,
    uf: Optional[str] = None,
    municipio: Optional[str] = None,
    dependencia_adm: Optional[int] = None
):
    """
    Retorna comparativo resumido de notas entre o Filtro e o Brasil.
    """
    dash = await get_dashboard(regiao=regiao, uf=uf, municipio=municipio, dependencia_adm=dependencia_adm)
    return dash.filtro_scores

@router.get("/dashboard", response_model=AnalyticsDashboardResponse)
async def get_dashboard(
    regiao: Optional[str] = None,
    uf: Optional[str] = None,
    municipio: Optional[str] = None,
    dependencia_adm: Optional[int] = None,
    materia: Optional[str] = "media_geral"
):
    """
    Retorna o payload consolidado do Dashboard:
    - Top 10 Brasil e Top 10 Filtro (com reordenação por matéria)
    - Médias e diferenciais de notas
    - Dados de Presença e Abstenção (Donut Charts)
    """
    sort_col = VALID_SORT_COLS.get(str(materia).lower().strip(), "media_geral")

    # 1. Obter Benchmark Nacional
    nac_query = "SELECT media_geral, media_cn, media_ch, media_lc, media_mt, media_redacao FROM nacional_benchmark"
    nac_row = DuckDBManager.execute_query(nac_query)
    if nac_row:
        n_geral, n_cn, n_ch, n_lc, n_mt, n_red = [float(x) if x is not None else 0.0 for x in nac_row[0]]
    else:
        n_geral, n_cn, n_ch, n_lc, n_mt, n_red = 531.7, 500.1, 514.1, 534.2, 520.1, 590.1

    nacional_scores = ScoreDetail(
        media_geral=_round1(n_geral),
        media_cn=_round1(n_cn),
        media_ch=_round1(n_ch),
        media_lc=_round1(n_lc),
        media_mt=_round1(n_mt),
        media_redacao=_round1(n_red)
    )

    # 2. Construir cláusula WHERE para o filtro selecionado
    conditions = []
    params = []

    if municipio and str(municipio).strip():
        conditions.append("LOWER(no_municipio_esc) = LOWER(?)")
        params.append(str(municipio).strip())
    if uf and str(uf).strip():
        conditions.append("sg_uf_esc = ?")
        params.append(str(uf).strip().upper())
    elif regiao and str(regiao).strip() in UF_REGION_MAP:
        ufs_in_region = UF_REGION_MAP[str(regiao).strip()]
        placeholders = ", ".join(["?"] * len(ufs_in_region))
        conditions.append(f"sg_uf_esc IN ({placeholders})")
        params.extend(ufs_in_region)

    if dependencia_adm and int(dependencia_adm) > 0:
        conditions.append("tp_dependencia_adm_esc = ?")
        params.append(int(dependencia_adm))

    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # 3. Médias do Filtro
    filtro_query = f"""
    SELECT 
        ROUND(AVG(media_geral), 1) as media_geral,
        ROUND(AVG(media_cn), 1) as media_cn,
        ROUND(AVG(media_ch), 1) as media_ch,
        ROUND(AVG(media_lc), 1) as media_lc,
        ROUND(AVG(media_mt), 1) as media_mt,
        ROUND(AVG(media_redacao), 1) as media_redacao
    FROM escolas
    {where_clause}
    """
    f_rows = DuckDBManager.execute_query(filtro_query, tuple(params))
    if f_rows and f_rows[0][0] is not None:
        f_geral, f_cn, f_ch, f_lc, f_mt, f_red = [float(x) if x is not None else 0.0 for x in f_rows[0]]
        # Calcular diferenciais
        d_geral = _round1(f_geral - n_geral)
        d_cn = _round1(f_cn - n_cn)
        d_ch = _round1(f_ch - n_ch)
        d_lc = _round1(f_lc - n_lc)
        d_mt = _round1(f_mt - n_mt)
        d_red = _round1(f_red - n_red)
    else:
        # Se nenhum filtro ou dados nulos, espelha o nacional
        f_geral, f_cn, f_ch, f_lc, f_mt, f_red = n_geral, n_cn, n_ch, n_lc, n_mt, n_red
        d_geral, d_cn, d_ch, d_lc, d_mt, d_red = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0

    filtro_scores = ScoreComparison(
        media_geral=_round1(f_geral),
        media_cn=_round1(f_cn),
        media_ch=_round1(f_ch),
        media_lc=_round1(f_lc),
        media_mt=_round1(f_mt),
        media_redacao=_round1(f_red),
        diff_geral=d_geral,
        diff_cn=d_cn,
        diff_ch=d_ch,
        diff_lc=d_lc,
        diff_mt=d_mt,
        diff_redacao=d_red
    )

    # 4. Top 10 Escolas do Brasil
    top_br_query = f"""
    SELECT 
        co_escola,
        nome_oficial,
        sg_uf_esc,
        no_municipio_esc,
        rede,
        total_alunos,
        media_geral,
        media_cn,
        media_ch,
        media_lc,
        media_mt,
        media_redacao,
        is_sigilo_inep
    FROM escolas
    WHERE total_alunos >= 10
    ORDER BY {sort_col} DESC
    LIMIT 10
    """
    top_br_rows = DuckDBManager.execute_query(top_br_query)
    top_brasil = [
        TopSchoolItem(
            co_escola=r[0],
            nome_oficial=r[1],
            uf=r[2],
            municipio=r[3],
            rede=r[4],
            total_alunos=r[5],
            media_geral=_round1(r[6]),
            media_cn=_round1(r[7]),
            media_ch=_round1(r[8]),
            media_lc=_round1(r[9]),
            media_mt=_round1(r[10]),
            media_redacao=_round1(r[11]),
            is_sigilo_inep=bool(r[12])
        )
        for r in top_br_rows
    ]

    # 5. Top 10 Escolas do Filtro
    top_f_where = f"{where_clause} AND total_alunos >= 1" if where_clause else "WHERE total_alunos >= 10"
    top_f_query = f"""
    SELECT 
        co_escola,
        nome_oficial,
        sg_uf_esc,
        no_municipio_esc,
        rede,
        total_alunos,
        media_geral,
        media_cn,
        media_ch,
        media_lc,
        media_mt,
        media_redacao,
        is_sigilo_inep
    FROM escolas
    {top_f_where}
    ORDER BY {sort_col} DESC
    LIMIT 10
    """
    top_f_rows = DuckDBManager.execute_query(top_f_query, tuple(params))
    top_filtro = [
        TopSchoolItem(
            co_escola=r[0],
            nome_oficial=r[1],
            uf=r[2],
            municipio=r[3],
            rede=r[4],
            total_alunos=r[5],
            media_geral=_round1(r[6]),
            media_cn=_round1(r[7]),
            media_ch=_round1(r[8]),
            media_lc=_round1(r[9]),
            media_mt=_round1(r[10]),
            media_redacao=_round1(r[11]),
            is_sigilo_inep=bool(r[12])
        )
        for r in top_f_rows
    ]

    # 6. Presença e Abstenção (Donut Charts)
    att_cache = load_attendance_cache()
    if att_cache:
        br_att = att_cache.get("brasil", {
            "total_inscritos": 4810772,
            "avaliados": 3473543,
            "abstencao": 1337229,
            "taxa_presenca": 72.2,
            "taxa_abstencao": 27.8
        })
        attendance_brasil = AttendanceStats(**br_att)

        f_att = None
        if uf and municipio:
            key = f"{uf.strip().upper()}:{municipio.strip().lower()}"
            f_att = att_cache.get("municipios", {}).get(key)
        if not f_att and uf:
            f_att = att_cache.get("ufs", {}).get(uf.strip().upper())
        if not f_att and regiao:
            f_att = att_cache.get("regioes", {}).get(regiao.strip())
        if not f_att:
            f_att = br_att

        attendance_filtro = AttendanceStats(**f_att)
    else:
        attendance_brasil = AttendanceStats(
            total_inscritos=4810772,
            avaliados=3473543,
            abstencao=1337229,
            taxa_presenca=72.2,
            taxa_abstencao=27.8
        )
        attendance_filtro = attendance_brasil

    return AnalyticsDashboardResponse(
        top_brasil=top_brasil,
        top_filtro=top_filtro,
        nacional_scores=nacional_scores,
        filtro_scores=filtro_scores,
        attendance_brasil=attendance_brasil,
        attendance_filtro=attendance_filtro
    )
