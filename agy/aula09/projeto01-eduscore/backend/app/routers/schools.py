"""
Router de Escolas e Alunos (Master-Detail & Drawer Lateral)
Retorna escolas paginadas e o boletim completo com alunos humanizados
Padrão SENAI - Clean Code, Sub-Segundo & Anonimização LGPD
"""

from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from backend.app.core.database import DuckDBManager, _round1
from backend.app.services.student_service import generate_student_name
from backend.app.schemas import (
    SchoolListItem,
    SchoolListResponse,
    SchoolDetailResponse,
    StudentItem,
    ScoreDetail
)

router = APIRouter(prefix="/api/schools", tags=["Schools"])

UF_REGION_MAP = {
    "Norte": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
    "Nordeste": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
    "Centro-Oeste": ["DF", "GO", "MT", "MS"],
    "Sudeste": ["ES", "MG", "RJ", "SP"],
    "Sul": ["PR", "RS", "SC"]
}

@router.get("", response_model=SchoolListResponse)
async def list_schools(
    regiao: Optional[str] = None,
    uf: Optional[str] = None,
    municipio: Optional[str] = None,
    dependencia_adm: Optional[int] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "media_geral",
    order: Optional[str] = "desc",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Lista paginada de escolas filtradas com nomes 100% hidratados,
    badges de rede administrativa e salvaguarda estatística do INEP.
    """
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

    if search and str(search).strip():
        term = f"%{str(search).strip().lower()}%"
        conditions.append("(LOWER(nome_oficial) LIKE ? OR CAST(co_escola AS VARCHAR) LIKE ?)")
        params.extend([term, term])

    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # Ordenação segura
    valid_sort = {
        "media_geral": "media_geral",
        "total_alunos": "total_alunos",
        "nome": "nome_oficial"
    }
    sort_field = valid_sort.get(sort_by, "media_geral")
    direction = "ASC" if str(order).lower() == "asc" else "DESC"

    # Total de registros
    count_query = f"SELECT count(*) FROM escolas {where_clause}"
    total = DuckDBManager.execute_query(count_query, tuple(params))[0][0]

    offset = (page - 1) * limit
    list_query = f"""
    SELECT 
        co_escola,
        nome_oficial,
        sg_uf_esc,
        no_municipio_esc,
        rede,
        total_alunos,
        total_avaliados,
        media_geral,
        is_sigilo_inep
    FROM escolas
    {where_clause}
    ORDER BY {sort_field} {direction}
    LIMIT ? OFFSET ?
    """
    query_params = list(params) + [limit, offset]
    rows = DuckDBManager.execute_query(list_query, tuple(query_params))

    items = [
        SchoolListItem(
            co_escola=r[0],
            nome_oficial=r[1],
            uf=r[2],
            municipio=r[3],
            rede=r[4],
            total_alunos=r[5],
            total_avaliados=r[6],
            media_geral=_round1(r[7]),
            is_sigilo_inep=bool(r[8])
        )
        for r in rows
    ]

    return SchoolListResponse(
        total=total,
        page=page,
        limit=limit,
        items=items
    )

@router.get("/{co_escola}/details", response_model=SchoolDetailResponse)
async def get_school_details(co_escola: int):
    """
    Retorna dados cadastrais da instituição, médias consolidadas nas 5 provas
    e a lista de estudantes com nomes humanizados brasileiros e notas individuais.
    """
    esc_query = """
    SELECT 
        co_escola,
        nome_oficial,
        endereco,
        telefone,
        rede,
        sg_uf_esc,
        no_municipio_esc,
        is_sigilo_inep,
        total_alunos,
        total_avaliados,
        media_geral,
        media_cn,
        media_ch,
        media_lc,
        media_mt,
        media_redacao
    FROM escolas
    WHERE co_escola = ?
    """
    esc_rows = DuckDBManager.execute_query(esc_query, (co_escola,))
    if not esc_rows:
        raise HTTPException(status_code=404, detail="Escola não encontrada.")

    r = esc_rows[0]
    scores = ScoreDetail(
        media_geral=_round1(r[10]),
        media_cn=_round1(r[11]),
        media_ch=_round1(r[12]),
        media_lc=_round1(r[13]),
        media_mt=_round1(r[14]),
        media_redacao=_round1(r[15])
    )

    # Buscar alunos da escola
    students_query = """
    SELECT 
        nu_sequencial,
        nu_nota_cn,
        nu_nota_ch,
        nu_nota_lc,
        nu_nota_mt,
        nu_nota_redacao,
        media_geral
    FROM participantes
    WHERE co_escola = ?
    ORDER BY media_geral DESC NULLS LAST
    LIMIT 200
    """
    st_rows = DuckDBManager.execute_query(students_query, (co_escola,))

    students = [
        StudentItem(
            id=s[0],
            nome_humanizado=generate_student_name(s[0]),
            nu_inscricao_formatada=f"25000{s[0]:07d}",
            nu_nota_cn=_round1(s[1]),
            nu_nota_ch=_round1(s[2]),
            nu_nota_lc=_round1(s[3]),
            nu_nota_mt=_round1(s[4]),
            nu_nota_redacao=_round1(s[5]),
            media_geral=_round1(s[6])
        )
        for s in st_rows
    ]

    return SchoolDetailResponse(
        co_escola=r[0],
        nome_oficial=r[1],
        endereco=r[2],
        telefone=r[3],
        rede=r[4],
        uf=r[5],
        municipio=r[6],
        is_sigilo_inep=bool(r[7]),
        total_alunos=r[8],
        total_avaliados=r[9],
        scores=scores,
        students=students
    )
