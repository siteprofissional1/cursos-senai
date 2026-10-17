/**
 * Componente SchoolExplorer (Zona 5.1): Grid de Escolas e Busca Interativa
 * Padrão SENAI - Clean Architecture & Navegação Mobile-First
 */

import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  Lock, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  Users
} from 'lucide-react';
import type { SchoolListResponse } from '../types';

interface SchoolExplorerProps {
  schoolsData: SchoolListResponse | null;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sortBy: string) => void;
  onSelectSchool: (coEscola: number) => void;
}

export const SchoolExplorer: React.FC<SchoolExplorerProps> = ({
  schoolsData,
  loading,
  currentPage,
  onPageChange,
  onSearchChange,
  onSortChange,
  onSelectSchool
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const totalPages = schoolsData ? Math.ceil(schoolsData.total / schoolsData.limit) : 1;

  const getScoreBadgeClass = (score: number) => {
    if (score >= 700) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (score >= 600) return 'bg-blue-50 text-blue-800 border-blue-200';
    if (score >= 500) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-rose-50 text-rose-800 border-rose-200';
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      
      {/* Cabeçalho, Busca e Ordenação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 m-0">
              Explorador de Instituições de Ensino
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {schoolsData ? (
              <span>
                Total de <strong className="text-slate-700 tabular-nums">{schoolsData.total.toLocaleString('pt-BR')}</strong> escolas encontradas para o filtro ativo
              </span>
            ) : (
              'Carregando dados...'
            )}
          </p>
        </div>

        {/* Barra de Busca e Ordenação */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Busca textual */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Buscar por escola ou código..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Seletor de Ordenação */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              onChange={e => onSortChange(e.target.value)}
              defaultValue="media_geral"
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="media_geral">Maior Média Geral</option>
              <option value="total_alunos">Mais Alunos</option>
              <option value="nome">Nome Alfabético</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Escolas */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : !schoolsData || schoolsData.items.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          Nenhuma escola encontrada com os parâmetros informados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schoolsData.items.map(school => (
            <div
              key={school.co_escola}
              className="bg-white border border-slate-200/90 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                
                {/* Badges de Identificação */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    INEP #{school.co_escola}
                  </span>
                  <div className="flex items-center gap-1">
                    {school.is_sigilo_inep && (
                      <span
                        title="Sob Sigilo Estatístico do INEP (LGPD: Turma reduzida)"
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        <Lock className="w-2.5 h-2.5" /> Sigilo INEP
                      </span>
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {school.rede}
                    </span>
                  </div>
                </div>

                {/* Nome Oficial da Escola */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 m-0 mb-1">
                  {school.nome_oficial}
                </h3>
                
                <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                  {school.municipio} - {school.uf}
                </p>

              </div>

              {/* Métricas e Botão de Ação */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 tabular-nums">{school.total_alunos}</span> alunos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Badge de Média Geral */}
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border tabular-nums ${getScoreBadgeClass(
                      school.media_geral
                    )}`}
                  >
                    {school.media_geral.toFixed(1)}
                  </span>

                  <button
                    onClick={() => onSelectSchool(school.co_escola)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                    title="Ver boletim completo e lista de estudantes"
                  >
                    <GraduationCap className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {schoolsData && totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            Página <strong className="text-slate-900">{currentPage}</strong> de{' '}
            <strong className="text-slate-900">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Anterior
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Próxima <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
