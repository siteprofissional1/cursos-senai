/**
 * Componente PerformanceCards (Zona 3): Cards de Benchmark Rápido Brasil vs. Filtro
 * Padrão SENAI - Clean Data Intelligence & Arredondamento 1 Casa Decimal
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Award, Compass } from 'lucide-react';
import type { ScoreDetail, ScoreComparison, FilterState } from '../types';

interface PerformanceCardsProps {
  nacional: ScoreDetail;
  filtro: ScoreComparison;
  filters: FilterState;
}

export const PerformanceCards: React.FC<PerformanceCardsProps> = ({
  nacional,
  filtro,
  filters
}) => {
  // Constrói o título contextual do filtro
  const filterTitle = React.useMemo(() => {
    const parts = [];
    if (filters.regiao) parts.push(filters.regiao);
    if (filters.uf) parts.push(filters.uf);
    if (filters.municipio) parts.push(filters.municipio);
    if (filters.dependencia_adm === 1) parts.push('Rede Federal');
    if (filters.dependencia_adm === 2) parts.push('Rede Estadual');
    if (filters.dependencia_adm === 3) parts.push('Rede Municipal');
    if (filters.dependencia_adm === 4) parts.push('Rede Privada');

    if (parts.length === 0) return 'Brasil (Benchmark Consolidado)';
    return parts.join(' › ');
  }, [filters]);

  const renderDiffBadge = (diff?: number) => {
    if (diff === undefined || diff === null) return null;
    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          +{diff.toFixed(1)} pts
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 tabular-nums">
          <TrendingDown className="w-3 h-3 text-rose-600" />
          {diff.toFixed(1)} pts
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 tabular-nums">
        <Minus className="w-3 h-3 text-slate-400" />
        0.0 pts
      </span>
    );
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Card da Esquerda - Referência Nacional (Brasil) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇧🇷</span>
            <div>
              <h2 className="text-base font-bold text-slate-900 m-0">Referência Nacional (Brasil)</h2>
              <p className="text-xs text-slate-500">Média ponderada do exame em todo o país</p>
            </div>
          </div>
          <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Award className="w-5 h-5" />
          </span>
        </div>

        {/* Média Geral Nacional */}
        <div className="mb-5 pb-4 border-b border-slate-100 flex items-baseline gap-3">
          <span className="text-4xl font-extrabold text-blue-600 tracking-tight tabular-nums">
            {nacional.media_geral?.toFixed(1) ?? '531.7'}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Média Geral Nacional
          </span>
        </div>

        {/* Mini-Grid 5 Matérias */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Natureza</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums mt-0.5">
              {nacional.media_cn?.toFixed(1) ?? '500.1'}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Humanas</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums mt-0.5">
              {nacional.media_ch?.toFixed(1) ?? '514.1'}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Linguagens</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums mt-0.5">
              {nacional.media_lc?.toFixed(1) ?? '534.2'}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Matemática</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums mt-0.5">
              {nacional.media_mt?.toFixed(1) ?? '520.1'}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Redação</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums mt-0.5">
              {nacional.media_redacao?.toFixed(1) ?? '590.1'}
            </div>
          </div>
        </div>

      </div>

      {/* Card da Direita - Resultado do Filtro Selecionado */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 m-0 line-clamp-1">{filterTitle}</h2>
              <p className="text-xs text-slate-500">Média calculada para a seleção atual</p>
            </div>
          </div>
          {renderDiffBadge(filtro.diff_geral)}
        </div>

        {/* Média Geral do Filtro */}
        <div className="mb-5 pb-4 border-b border-slate-100 flex items-baseline gap-3">
          <span className="text-4xl font-extrabold text-emerald-600 tracking-tight tabular-nums">
            {filtro.media_geral?.toFixed(1) ?? '531.7'}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Média Geral do Filtro
          </span>
        </div>

        {/* Mini-Grid 5 Matérias com Diferencial */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Natureza</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums my-1">
              {filtro.media_cn?.toFixed(1) ?? '500.1'}
            </div>
            {renderDiffBadge(filtro.diff_cn)}
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Humanas</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums my-1">
              {filtro.media_ch?.toFixed(1) ?? '514.1'}
            </div>
            {renderDiffBadge(filtro.diff_ch)}
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Linguagens</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums my-1">
              {filtro.media_lc?.toFixed(1) ?? '534.2'}
            </div>
            {renderDiffBadge(filtro.diff_lc)}
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Matemática</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums my-1">
              {filtro.media_mt?.toFixed(1) ?? '520.1'}
            </div>
            {renderDiffBadge(filtro.diff_mt)}
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Redação</div>
            <div className="text-sm font-bold text-slate-800 tabular-nums my-1">
              {filtro.media_redacao?.toFixed(1) ?? '590.1'}
            </div>
            {renderDiffBadge(filtro.diff_redacao)}
          </div>
        </div>

        {/* Atalho Rápido para o Simulador SISU, ProUni e FIES */}
        <a
          href="#simulador-section"
          className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer text-center"
        >
          <span>🎯 Simular Vagas no SISU, ProUni e FIES com esta Nota</span>
        </a>

      </div>

    </section>
  );
};
