"""
Contratos Pydantic e Schemas da API EduScore
Padrão SENAI - Spec-Driven Development & Validação Rigorosa
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class StatusResponse(BaseModel):
    status_db: str
    engine: str
    total_rows: int = Field(..., description="Total de inscritos no censo bruto (+4.81M)")
    evaluated_rows: int = Field(..., description="Participantes avaliados com notas válidas (+3.47M)")
    files: List[str]

class ScoreDetail(BaseModel):
    media_geral: Optional[float] = None
    media_cn: Optional[float] = None
    media_ch: Optional[float] = None
    media_lc: Optional[float] = None
    media_mt: Optional[float] = None
    media_redacao: Optional[float] = None

class ScoreComparison(BaseModel):
    media_geral: Optional[float] = None
    media_cn: Optional[float] = None
    media_ch: Optional[float] = None
    media_lc: Optional[float] = None
    media_mt: Optional[float] = None
    media_redacao: Optional[float] = None
    diff_geral: Optional[float] = None
    diff_cn: Optional[float] = None
    diff_ch: Optional[float] = None
    diff_lc: Optional[float] = None
    diff_mt: Optional[float] = None
    diff_redacao: Optional[float] = None

class AttendanceStats(BaseModel):
    total_inscritos: int
    avaliados: int
    abstencao: int
    taxa_presenca: float
    taxa_abstencao: float

class TopSchoolItem(BaseModel):
    co_escola: int
    nome_oficial: str
    uf: str
    municipio: str
    rede: str
    total_alunos: int
    media_geral: float
    media_cn: Optional[float] = None
    media_ch: Optional[float] = None
    media_lc: Optional[float] = None
    media_mt: Optional[float] = None
    media_redacao: Optional[float] = None
    is_sigilo_inep: bool

class AnalyticsDashboardResponse(BaseModel):
    top_brasil: List[TopSchoolItem]
    top_filtro: List[TopSchoolItem]
    nacional_scores: ScoreDetail
    filtro_scores: ScoreComparison
    attendance_brasil: AttendanceStats
    attendance_filtro: AttendanceStats

class SchoolListItem(BaseModel):
    co_escola: int
    nome_oficial: str
    uf: str
    municipio: str
    rede: str
    total_alunos: int
    total_avaliados: int
    media_geral: float
    is_sigilo_inep: bool

class SchoolListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[SchoolListItem]

class StudentItem(BaseModel):
    id: int
    nome_humanizado: str
    nu_inscricao_formatada: str
    media_geral: Optional[float] = None
    nu_nota_cn: Optional[float] = None
    nu_nota_ch: Optional[float] = None
    nu_nota_lc: Optional[float] = None
    nu_nota_mt: Optional[float] = None
    nu_nota_redacao: Optional[float] = None

class SchoolDetailResponse(BaseModel):
    co_escola: int
    nome_oficial: str
    endereco: str
    telefone: str
    rede: str
    uf: str
    municipio: str
    is_sigilo_inep: bool
    total_alunos: int
    total_avaliados: int
    scores: ScoreDetail
    students: List[StudentItem]
