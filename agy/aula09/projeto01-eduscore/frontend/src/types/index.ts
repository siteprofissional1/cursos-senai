/**
 * Tipagens TypeScript Compartilhadas - EduScore
 * Padrão SENAI - Clean Architecture & Tipagem Estrita
 */

export interface SystemStatus {
  status_db: string;
  engine: string;
  total_rows: number;
  evaluated_rows: number;
  files: string[];
}

export interface HierarchyData {
  [region: string]: {
    [uf: string]: string[];
  };
}

export interface ScoreDetail {
  media_geral?: number;
  media_cn?: number;
  media_ch?: number;
  media_lc?: number;
  media_mt?: number;
  media_redacao?: number;
}

export interface ScoreComparison extends ScoreDetail {
  diff_geral?: number;
  diff_cn?: number;
  diff_ch?: number;
  diff_lc?: number;
  diff_mt?: number;
  diff_redacao?: number;
}

export interface AttendanceStats {
  total_inscritos: number;
  avaliados: number;
  abstencao: number;
  taxa_presenca: number;
  taxa_abstencao: number;
}

export interface TopSchoolItem {
  co_escola: number;
  nome_oficial: string;
  uf: string;
  municipio: string;
  rede: string;
  total_alunos: number;
  media_geral: number;
  media_cn?: number;
  media_ch?: number;
  media_lc?: number;
  media_mt?: number;
  media_redacao?: number;
  is_sigilo_inep: boolean;
}

export interface AnalyticsDashboardData {
  top_brasil: TopSchoolItem[];
  top_filtro: TopSchoolItem[];
  nacional_scores: ScoreDetail;
  filtro_scores: ScoreComparison;
  attendance_brasil: AttendanceStats;
  attendance_filtro: AttendanceStats;
}

export interface SchoolListItem {
  co_escola: number;
  nome_oficial: string;
  uf: string;
  municipio: string;
  rede: string;
  total_alunos: number;
  total_avaliados: number;
  media_geral: number;
  is_sigilo_inep: boolean;
}

export interface SchoolListResponse {
  total: number;
  page: number;
  limit: number;
  items: SchoolListItem[];
}

export interface StudentItem {
  id: number;
  nome_humanizado: string;
  nu_inscricao_formatada: string;
  media_geral?: number;
  nu_nota_cn?: number;
  nu_nota_ch?: number;
  nu_nota_lc?: number;
  nu_nota_mt?: number;
  nu_nota_redacao?: number;
}

export interface SchoolDetail {
  co_escola: number;
  nome_oficial: string;
  endereco: string;
  telefone: string;
  rede: string;
  uf: string;
  municipio: string;
  is_sigilo_inep: boolean;
  total_alunos: number;
  total_avaliados: number;
  scores: ScoreDetail;
  students: StudentItem[];
}

export interface FilterState {
  regiao: string;
  uf: string;
  municipio: string;
  dependencia_adm: number; // 0: Todas, 1: Federal, 2: Estadual, 3: Municipal, 4: Privada
}

// Tipagens do Simulador SISU, ProUni e FIES
export interface CidadeMapaItem {
  municipio: string;
  uf: string;
  lat: number;
  lng: number;
  total_cursos: number;
  cursos_aprovados: number;
}

export interface OportunidadeItem {
  id: number;
  programa: string;
  instituicao: string;
  sigla: string;
  tipo_instituicao: string;
  curso: string;
  grau: string;
  turno: string;
  modalidade: string;
  nota_corte: number;
  margem: number;
  status: string;
  status_cor: string;
  uf: string;
  municipio: string;
  lat: number;
  lng: number;
}

export interface SimuladorResponse {
  elegivel: boolean;
  mensagem_elegibilidade: string;
  nota_simulada: number;
  programa: string;
  total_oportunidades: number;
  total_aprovadas: number;
  cidades_mapa: CidadeMapaItem[];
  oportunidades: OportunidadeItem[];
}
