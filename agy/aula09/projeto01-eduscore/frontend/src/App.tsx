/**
 * Aplicação Principal EduScore - Single-Page Workspace
 * Padrão SENAI - Clean Code, Mobile-First & Alta Performance
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { PerformanceCards } from './components/PerformanceCards';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SchoolExplorer } from './components/SchoolExplorer';
import { SchoolDrawer } from './components/SchoolDrawer';
import { SimulatorSection } from './components/SimulatorSection';
import { 
  getSystemStatus, 
  getLocations, 
  getDashboard, 
  getSchools, 
  getSchoolDetails 
} from './services/api';
import type { 
  SystemStatus, 
  HierarchyData, 
  AnalyticsDashboardData, 
  SchoolListResponse, 
  SchoolDetail, 
  FilterState 
} from './types';

const STORAGE_KEY = 'eduscore_filters_v2';

const DEFAULT_FILTERS: FilterState = {
  regiao: '',
  uf: '',
  municipio: '',
  dependencia_adm: 0
};

export const App: React.FC = () => {
  // Estado dos filtros com restauração do localStorage
  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Erro ao restaurar filtros do localStorage:', e);
    }
    return DEFAULT_FILTERS;
  });

  // Estados dos dados
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [hierarchy, setHierarchy] = useState<HierarchyData | null>(null);
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [schoolsData, setSchoolsData] = useState<SchoolListResponse | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Estados de controle de UI
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingDrawer, setLoadingDrawer] = useState(false);
  const [activeMateria, setActiveMateria] = useState('media_geral');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('media_geral');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Persistir filtros automaticamente no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (e) {
      console.warn('Erro ao salvar filtros no localStorage:', e);
    }
  }, [filters]);

  // Carregar status e hierarquia na montagem
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoadingStatus(true);
        const [statusRes, hierarchyRes] = await Promise.all([
          getSystemStatus(),
          getLocations()
        ]);
        setStatus(statusRes);
        setHierarchy(hierarchyRes);
      } catch (err: any) {
        console.error('Erro na inicialização:', err);
        setErrorMsg('Erro ao conectar com a API do EduScore. Verifique se o backend está ativo.');
      } finally {
        setLoadingStatus(false);
      }
    };
    initApp();
  }, []);

  // Carregar dados analíticos do Dashboard
  const loadDashboard = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const data = await getDashboard(filters, activeMateria);
      setDashboardData(data);
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoadingDashboard(false);
    }
  }, [filters, activeMateria]);

  // Carregar listagem de escolas
  const loadSchools = useCallback(async () => {
    try {
      setLoadingSchools(true);
      const data = await getSchools(filters, currentPage, 12, searchQuery, sortBy);
      setSchoolsData(data);
    } catch (err: any) {
      console.error('Erro ao carregar escolas:', err);
    } finally {
      setLoadingSchools(false);
    }
  }, [filters, currentPage, searchQuery, sortBy]);

  // Re-executar buscas quando filtros ou opções mudarem
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  // Manipulador para abrir o Drawer de detalhes da escola
  const handleSelectSchool = async (coEscola: number) => {
    setIsDrawerOpen(true);
    setLoadingDrawer(true);
    try {
      const details = await getSchoolDetails(coEscola);
      setSelectedSchool(details);
    } catch (err: any) {
      console.error('Erro ao buscar detalhes da escola:', err);
    } finally {
      setLoadingDrawer(false);
    }
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Resetar para a primeira página ao alterar filtros
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Zona 1: Header de Telemetria e Ingestão */}
      <Header status={status} loading={loadingStatus} />

      {/* Zona 2: Barra Sticky de Filtros Geográficos em Cascata */}
      <FilterBar
        filters={filters}
        hierarchy={hierarchy}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Mensagem de Erro Global se houver */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        </div>
      )}

      {/* Conteúdo Principal do Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        
        {/* Zona 3: Cards de Benchmark Rápido Brasil vs. Filtro */}
        {loadingDashboard && (
          <div className="flex items-center justify-end text-xs text-blue-600 font-semibold animate-pulse">
            Atualizando métricas em tempo real...
          </div>
        )}
        {dashboardData && (
          <PerformanceCards
            nacional={dashboardData.nacional_scores}
            filtro={dashboardData.filtro_scores}
            filters={filters}
          />
        )}

        {/* Zona 4: Dashboard Analítico Visual de Alto Impacto */}
        {dashboardData && (
          <AnalyticsDashboard
            data={dashboardData}
            activeMateria={activeMateria}
            onMateriaChange={setActiveMateria}
            onSelectSchool={handleSelectSchool}
          />
        )}

        {/* Módulo Especial: Simulador Universitário SISU, ProUni e FIES */}
        <SimulatorSection
          filters={filters}
          suggestedScore={
            dashboardData?.top_filtro && dashboardData.top_filtro.length > 0
              ? dashboardData.top_filtro[0].media_geral
              : (dashboardData?.filtro_scores.media_geral ?? 650.0)
          }
          schoolName={
            dashboardData?.top_filtro && dashboardData.top_filtro.length > 0
              ? dashboardData.top_filtro[0].nome_oficial
              : 'Escola Referência'
          }
        />

        {/* Zona 5: Explorador de Escolas e Alunos */}
        <SchoolExplorer
          schoolsData={schoolsData}
          loading={loadingSchools}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onSelectSchool={handleSelectSchool}
        />

      </main>

      {/* Zona 5.2: Slide-Over Drawer de Detalhes da Escola e Estudantes */}
      <SchoolDrawer
        school={selectedSchool}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        loading={loadingDrawer}
      />

      {/* Rodapé Mandatório do Sistema */}
      <footer className="w-full bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-500 m-0">
            desenvolvido por <a href="https://siteprofissional.pro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">siteprofissional</a>
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;
