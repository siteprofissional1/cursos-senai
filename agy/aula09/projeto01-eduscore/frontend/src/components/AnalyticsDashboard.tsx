/**
 * Componente AnalyticsDashboard (Zona 4): Dashboards Visuais de Alto Impacto
 * 4.1 Donut Charts SVG (Presença/Abstenção)
 * 4.2 Side-by-Side Clustered Columns (Brasil vs. Filtro)
 * 4.3 Top 10 Rankings com Explosão por Matéria e Drill-Down Inline
 * Padrão SENAI - Clean Code, SVG Puro & Mobile-First
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Trophy, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  ExternalLink,
  Flame
} from 'lucide-react';
import type { AnalyticsDashboardData, TopSchoolItem } from '../types';

interface AnalyticsDashboardProps {
  data: AnalyticsDashboardData;
  activeMateria: string;
  onMateriaChange: (materia: string) => void;
  onSelectSchool: (coEscola: number) => void;
}

const MATERIAS_CONFIG = [
  { id: 'media_geral', label: 'Média Geral', short: 'Geral' },
  { id: 'media_cn', label: 'Ciências da Natureza (CN)', short: 'Natureza' },
  { id: 'media_ch', label: 'Ciências Humanas (CH)', short: 'Humanas' },
  { id: 'media_lc', label: 'Linguagens e Códigos (LC)', short: 'Linguagens' },
  { id: 'media_mt', label: 'Matemática (MT)', short: 'Matemática' },
  { id: 'media_redacao', label: 'Redação', short: 'Redação' },
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  activeMateria,
  onMateriaChange,
  onSelectSchool
}) => {
  const [expandedSchoolId, setExpandedSchoolId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedSchoolId(prev => (prev === id ? null : id));
  };

  // 4.1 Donut SVG Helper
  const renderDonut = (
    title: string,
    subtitle: string,
    taxaPresenca: number,
    taxaAbstencao: number,
    avaliados: number,
    abstencao: number,
    total: number,
    color: string
  ) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (taxaPresenca / 100) * circumference;

    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Donut */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Circle (Abstenção) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#E2E8F0"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Foreground Circle (Presença) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-extrabold text-slate-800 tabular-nums">
              {taxaPresenca.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium">presentes</span>
          </div>
        </div>

        {/* Legendas */}
        <div className="flex-1 w-full text-xs">
          <div className="font-bold text-slate-900 text-sm">{title}</div>
          <div className="text-slate-500 text-[11px] mb-2">{subtitle}</div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                Avaliados (Presentes):
              </span>
              <span className="font-bold text-slate-800 tabular-nums">
                {avaliados.toLocaleString('pt-BR')} ({taxaPresenca.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                Abstenções:
              </span>
              <span className="font-bold text-slate-500 tabular-nums">
                {abstencao.toLocaleString('pt-BR')} ({taxaAbstencao.toFixed(1)}%)
              </span>
            </div>
            <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Total no Censo:</span>
              <span className="tabular-nums font-semibold text-slate-600">
                {total.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dados para as 6 colunas agrupadas
  const comparisonItems = [
    {
      label: 'Média Geral',
      nac: data.nacional_scores.media_geral ?? 531.7,
      fil: data.filtro_scores.media_geral ?? 531.7,
      diff: data.filtro_scores.diff_geral ?? 0.0
    },
    {
      label: 'Natureza (CN)',
      nac: data.nacional_scores.media_cn ?? 500.1,
      fil: data.filtro_scores.media_cn ?? 500.1,
      diff: data.filtro_scores.diff_cn ?? 0.0
    },
    {
      label: 'Humanas (CH)',
      nac: data.nacional_scores.media_ch ?? 514.1,
      fil: data.filtro_scores.media_ch ?? 514.1,
      diff: data.filtro_scores.diff_ch ?? 0.0
    },
    {
      label: 'Linguagens (LC)',
      nac: data.nacional_scores.media_lc ?? 534.2,
      fil: data.filtro_scores.media_lc ?? 534.2,
      diff: data.filtro_scores.diff_lc ?? 0.0
    },
    {
      label: 'Matemática (MT)',
      nac: data.nacional_scores.media_mt ?? 520.1,
      fil: data.filtro_scores.media_mt ?? 520.1,
      diff: data.filtro_scores.diff_mt ?? 0.0
    },
    {
      label: 'Redação',
      nac: data.nacional_scores.media_redacao ?? 590.1,
      fil: data.filtro_scores.media_redacao ?? 590.1,
      diff: data.filtro_scores.diff_redacao ?? 0.0
    }
  ];

  // Helper para renderizar item de Ranking
  const renderRankingList = (schools: TopSchoolItem[], title: string, badgeBg: string) => {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 m-0">{title}</h3>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeBg}`}>
            Top 10 Instituições
          </span>
        </div>

        {schools.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Nenhuma instituição encontrada para este filtro.
          </div>
        ) : (
          <div className="space-y-2 flex-1">
            {schools.map((school, index) => {
              const isExpanded = expandedSchoolId === school.co_escola;
              const rankColor =
                index === 0
                  ? 'bg-amber-400 text-amber-950 font-black'
                  : index === 1
                  ? 'bg-slate-300 text-slate-900 font-bold'
                  : index === 2
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 font-semibold';

              return (
                <div
                  key={school.co_escola}
                  className="border border-slate-100 rounded-lg p-2.5 hover:border-slate-300 hover:bg-slate-50/50 transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    
                    {/* Posição e Nome */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[11px] ${rankColor}`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                          <span className="truncate">{school.nome_oficial}</span>
                          {school.is_sigilo_inep && (
                            <span title="Sob Sigilo Estatístico do INEP" className="shrink-0 text-indigo-600">
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {school.municipio} - {school.uf} • <span className="text-slate-500 font-medium">{school.rede}</span> • {school.total_alunos} alunos
                        </div>
                      </div>
                    </div>

                    {/* Média e Ação de Expandir */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-900 text-sm tabular-nums">
                        {school.media_geral.toFixed(1)}
                      </span>
                      <button
                        onClick={() => toggleExpand(school.co_escola)}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Ver notas detalhadas"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>

                  {/* Drill-down Inline Retrátil com as 5 notas */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 bg-white rounded p-2 shadow-2xs">
                      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] mb-2">
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-400 font-medium">CN</div>
                          <div className="font-bold text-slate-800 tabular-nums">
                            {school.media_cn?.toFixed(1) ?? '-'}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-400 font-medium">CH</div>
                          <div className="font-bold text-slate-800 tabular-nums">
                            {school.media_ch?.toFixed(1) ?? '-'}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-400 font-medium">LC</div>
                          <div className="font-bold text-slate-800 tabular-nums">
                            {school.media_lc?.toFixed(1) ?? '-'}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-400 font-medium">MT</div>
                          <div className="font-bold text-slate-800 tabular-nums">
                            {school.media_mt?.toFixed(1) ?? '-'}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded p-1">
                          <div className="text-slate-400 font-medium">Redação</div>
                          <div className="font-bold text-slate-800 tabular-nums">
                            {school.media_redacao?.toFixed(1) ?? '-'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectSchool(school.co_escola)}
                        className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                      >
                        <span>Abrir Drawer de Detalhes e Alunos</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-6">
      
      {/* 4.1 Donut Charts SVG (Presença vs. Abstenção) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <PieChart className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 m-0">
            Índices de Participação: Presentes (Avaliados) vs. Abstenção
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderDonut(
            'Brasil (Nacional)',
            'Taxa consolidada de presença no país',
            data.attendance_brasil.taxa_presenca,
            data.attendance_brasil.taxa_abstencao,
            data.attendance_brasil.avaliados,
            data.attendance_brasil.abstencao,
            data.attendance_brasil.total_inscritos,
            '#2563EB'
          )}
          {renderDonut(
            'Filtro Ativo (Localidade)',
            'Taxa de presença na região ou município selecionado',
            data.attendance_filtro.taxa_presenca,
            data.attendance_filtro.taxa_abstencao,
            data.attendance_filtro.avaliados,
            data.attendance_filtro.abstencao,
            data.attendance_filtro.total_inscritos,
            '#059669'
          )}
        </div>
      </div>

      {/* 4.2 Gráfico de Colunas Agrupadas Lado a Lado (Side-by-Side Clustered Columns) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 m-0">
                Comparativo Vertical de Desempenho por Área do Conhecimento
              </h2>
              <p className="text-xs text-slate-500">
                Escala oficial de 0 a 1000 pontos • Brasil vs. Filtro
              </p>
            </div>
          </div>
          {/* Legenda das Colunas */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600"></span>
              <span className="font-medium text-slate-700">Brasil</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600"></span>
              <span className="font-medium text-slate-700">Filtro Local</span>
            </div>
          </div>
        </div>

        {/* Área Gráfica das Colunas Lado a Lado */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-end pt-8 pb-4 min-h-[260px]">
          {comparisonItems.map((item, idx) => {
            const nacHeight = Math.max(10, Math.min(100, (item.nac / 1000) * 100));
            const filHeight = Math.max(10, Math.min(100, (item.fil / 1000) * 100));
            const isPositive = item.diff >= 0;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end">
                
                {/* Pill Comparativo Flutuante no Topo */}
                <div className="mb-2">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isPositive ? `+${item.diff.toFixed(1)}` : item.diff.toFixed(1)}
                  </span>
                </div>

                {/* Par de Colunas Lado a Lado */}
                <div className="w-full flex items-end justify-center gap-1.5 h-44 bg-slate-50/60 rounded-t-lg p-1 border-b border-slate-200">
                  {/* Coluna Brasil */}
                  <div className="w-1/2 flex flex-col items-center justify-end h-full">
                    <span className="text-[10px] font-bold text-blue-700 mb-1 tabular-nums">
                      {item.nac.toFixed(1)}
                    </span>
                    <div
                      style={{ height: `${nacHeight}%` }}
                      className="w-full rounded-t bg-gradient-to-t from-blue-700 to-indigo-500 shadow-xs transition-all duration-500 hover:brightness-110"
                      title={`Brasil: ${item.nac.toFixed(1)}`}
                    ></div>
                  </div>

                  {/* Coluna Filtro */}
                  <div className="w-1/2 flex flex-col items-center justify-end h-full">
                    <span className="text-[10px] font-bold text-emerald-700 mb-1 tabular-nums">
                      {item.fil.toFixed(1)}
                    </span>
                    <div
                      style={{ height: `${filHeight}%` }}
                      className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-teal-400 shadow-xs transition-all duration-500 hover:brightness-110"
                      title={`Filtro: ${item.fil.toFixed(1)}`}
                    ></div>
                  </div>
                </div>

                {/* Rótulo da Matéria no Rodapé */}
                <div className="mt-2 text-center">
                  <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {item.label}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 4.3 Rankings Top 10 Escolas com Seletor de Matérias */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        
        {/* Cabeçalho e Barra de Explosão por Matéria */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 m-0">
                Rankings Top 10 Melhores Escolas: Brasil vs. Filtro
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Selecione a matéria abaixo para reorganizar dinamicamente os dois rankings:
            </p>
          </div>

          {/* Botões Seletores da Barra de Explosão */}
          <div className="flex flex-wrap items-center gap-1.5">
            {MATERIAS_CONFIG.map(m => {
              const isActive = activeMateria === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onMateriaChange(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dois Rankings Paralelos Lado a Lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderRankingList(
            data.top_brasil,
            'Top 10 Escolas do Brasil',
            'bg-blue-50 text-blue-700 border border-blue-200'
          )}
          {renderRankingList(
            data.top_filtro,
            'Top 10 Escolas no Filtro Selecionado',
            'bg-emerald-50 text-emerald-700 border border-emerald-200'
          )}
        </div>

      </div>

    </section>
  );
};
