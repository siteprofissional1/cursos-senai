/**
 * Camada de Comunicação com a API FastAPI
 * Padrão SENAI - Fetch Assíncrono Tipado com Tratamento de Erros
 */

import type {
  SystemStatus,
  HierarchyData,
  AnalyticsDashboardData,
  SchoolListResponse,
  SchoolDetail,
  FilterState,
  SimuladorResponse
} from '../types';

const API_BASE = '/api';

export async function getSystemStatus(): Promise<SystemStatus> {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error('Falha ao obter status do sistema');
  return res.json();
}

export async function getLocations(): Promise<HierarchyData> {
  const res = await fetch(`${API_BASE}/filters/locations`);
  if (!res.ok) throw new Error('Falha ao obter hierarquia geográfica');
  return res.json();
}

export async function getDashboard(
  filters: FilterState,
  materia: string = 'media_geral'
): Promise<AnalyticsDashboardData> {
  const params = new URLSearchParams();
  if (filters.regiao) params.append('regiao', filters.regiao);
  if (filters.uf) params.append('uf', filters.uf);
  if (filters.municipio) params.append('municipio', filters.municipio);
  if (filters.dependencia_adm > 0) params.append('dependencia_adm', filters.dependencia_adm.toString());
  if (materia) params.append('materia', materia);

  const res = await fetch(`${API_BASE}/analytics/dashboard?${params.toString()}`);
  if (!res.ok) throw new Error('Falha ao carregar métricas analíticas');
  return res.json();
}

export async function getSchools(
  filters: FilterState,
  page: number = 1,
  limit: number = 12,
  search: string = '',
  sortBy: string = 'media_geral',
  order: string = 'desc'
): Promise<SchoolListResponse> {
  const params = new URLSearchParams();
  if (filters.regiao) params.append('regiao', filters.regiao);
  if (filters.uf) params.append('uf', filters.uf);
  if (filters.municipio) params.append('municipio', filters.municipio);
  if (filters.dependencia_adm > 0) params.append('dependencia_adm', filters.dependencia_adm.toString());
  if (search) params.append('search', search);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('sort_by', sortBy);
  params.append('order', order);

  const res = await fetch(`${API_BASE}/schools?${params.toString()}`);
  if (!res.ok) throw new Error('Falha ao listar escolas');
  return res.json();
}

export async function getSchoolDetails(coEscola: number): Promise<SchoolDetail> {
  const res = await fetch(`${API_BASE}/schools/${coEscola}/details`);
  if (!res.ok) throw new Error(`Falha ao obter detalhes da escola #${coEscola}`);
  return res.json();
}

export async function simularOportunidades(
  programa: string,
  nota: number,
  uf: string = '',
  municipio: string = '',
  abrangencia: string = 'estado',
  curso: string = '',
  turno: string = '',
  apenasAprovados: boolean = false
): Promise<SimuladorResponse> {
  const params = new URLSearchParams();
  params.append('programa', programa);
  params.append('nota', nota.toString());
  if (uf) params.append('uf', uf);
  if (municipio) params.append('municipio', municipio);
  params.append('abrangencia', abrangencia);
  if (curso) params.append('curso', curso);
  if (turno) params.append('turno', turno);
  params.append('apenas_aprovados', apenasAprovados.toString());

  const res = await fetch(`${API_BASE}/simulador/oportunidades?${params.toString()}`);
  if (!res.ok) throw new Error('Falha ao simular oportunidades universitárias');
  return res.json();
}
