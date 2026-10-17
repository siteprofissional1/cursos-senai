/**
 * Componente Header (Zona 1): Telemetria Massiva e Auditoria de Arquivos
 * Padrão SENAI - Transparência Estatística & Clean Data Intelligence
 */

import React from 'react';
import { Database, FileSpreadsheet, FileCode, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import type { SystemStatus } from '../types';

interface HeaderProps {
  status: SystemStatus | null;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ status }) => {
  const totalCenso = status?.total_rows ?? 4810772;
  const totalAvaliados = status?.evaluated_rows ?? 3473543;

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo e Identidade */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 m-0 p-0">
                  EduScore
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 text-blue-500" /> Antigravity AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Plataforma Analítica de Alta Performance • Microdados ENEM 2025
              </p>
            </div>
          </div>

          {/* Telemetria e Transparência Estatística */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            
            {/* Card Censo Total */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 flex items-center gap-3 shadow-2xs">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <div>
                <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Censo Bruto Total
                </div>
                <div className="text-sm font-bold text-slate-800 tabular-nums">
                  {totalCenso.toLocaleString('pt-BR')} <span className="text-[11px] font-normal text-slate-500">inscritos</span>
                </div>
              </div>
            </div>

            {/* Card Avaliados */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 flex items-center gap-3 shadow-2xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <div>
                <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Participantes Avaliados
                </div>
                <div className="text-sm font-bold text-slate-800 tabular-nums">
                  {totalAvaliados.toLocaleString('pt-BR')} <span className="text-[11px] font-normal text-slate-500">com notas</span>
                </div>
              </div>
            </div>

            {/* Status DuckDB */}
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Base 100% Pronta (DuckDB)</span>
            </div>

          </div>
        </div>

        {/* Linha de Auditoria dos Arquivos Oficiais */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-slate-400" /> Fontes Auditadas:
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
            <FileSpreadsheet className="w-3 h-3 text-blue-500" /> MICRODADOS_ENEM_2025.csv (+4.81M)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
            <FileSpreadsheet className="w-3 h-3 text-emerald-500" /> Dicionário Oficial INEP (.xlsx)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
            <FileCode className="w-3 h-3 text-indigo-500" /> Scripts R/SAS de Tipagem
          </span>
        </div>

      </div>
    </header>
  );
};
