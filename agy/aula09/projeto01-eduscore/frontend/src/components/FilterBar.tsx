/**
 * Componente FilterBar (Zona 2): Barra Sticky de Filtros Geográficos em Cascata
 * Padrão SENAI - Persistência em localStorage & Mobile-First
 */

import React from 'react';
import { MapPin, FilterX, ChevronDown } from 'lucide-react';
import type { FilterState, HierarchyData } from '../types';

interface FilterBarProps {
  filters: FilterState;
  hierarchy: HierarchyData | null;
  onFilterChange: (newFilters: FilterState) => void;
  onClearFilters: () => void;
}

const REDE_OPTIONS = [
  { value: 0, label: 'Todas as Redes' },
  { value: 4, label: 'Privada (Particular)' },
  { value: 2, label: 'Estadual' },
  { value: 1, label: 'Federal' },
  { value: 3, label: 'Municipal' }
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  hierarchy,
  onFilterChange,
  onClearFilters
}) => {
  const regions = hierarchy ? Object.keys(hierarchy) : [];

  // UFs disponíveis com base na região selecionada
  const availableUfs = React.useMemo(() => {
    if (!hierarchy) return [];
    if (filters.regiao && hierarchy[filters.regiao]) {
      return Object.keys(hierarchy[filters.regiao]).sort();
    }
    // Todas as UFs de todas as regiões
    const allUfs: string[] = [];
    Object.values(hierarchy).forEach(reg => {
      allUfs.push(...Object.keys(reg));
    });
    return allUfs.sort();
  }, [hierarchy, filters.regiao]);

  // Municípios disponíveis com base na UF selecionada
  const availableMunicipios = React.useMemo(() => {
    if (!hierarchy || !filters.uf) return [];
    for (const reg of Object.values(hierarchy)) {
      if (reg[filters.uf]) {
        return reg[filters.uf].sort();
      }
    }
    return [];
  }, [hierarchy, filters.uf]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regiao = e.target.value;
    onFilterChange({
      ...filters,
      regiao,
      uf: '',
      municipio: ''
    });
  };

  const handleUfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uf = e.target.value;
    // Se selecionou UF, atualizar também a região automaticamente se vazia
    let regiao = filters.regiao;
    if (uf && hierarchy && !regiao) {
      for (const [r, ufs] of Object.entries(hierarchy)) {
        if (ufs[uf]) {
          regiao = r;
          break;
        }
      }
    }
    onFilterChange({
      ...filters,
      regiao,
      uf,
      municipio: ''
    });
  };

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      municipio: e.target.value
    });
  };

  const handleRedeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      dependencia_adm: Number(e.target.value)
    });
  };

  const hasActiveFilters = Boolean(
    filters.regiao || filters.uf || filters.municipio || filters.dependencia_adm > 0
  );

  return (
    <div className="sticky top-0 z-20 backdrop-blur-md bg-white/95 border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Título contextual do Filtro */}
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Filtros Geográficos e Administrativos:</span>
          </div>

          {/* Grid dos Seletores em Cascata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-2.5 flex-1 lg:max-w-4xl">
            
            {/* Seletor de Região */}
            <div className="relative">
              <select
                id="filter-region"
                value={filters.regiao}
                onChange={handleRegionChange}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="">Brasil (Todas Regiões)</option>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Seletor de UF */}
            <div className="relative">
              <select
                id="filter-uf"
                value={filters.uf}
                onChange={handleUfChange}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="">Todas as UFs</option>
                {availableUfs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Seletor de Município */}
            <div className="relative">
              <select
                id="filter-municipio"
                value={filters.municipio}
                onChange={handleMunicipioChange}
                disabled={!filters.uf}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {filters.uf ? 'Todos os Municípios' : 'Selecione a UF primeiro'}
                </option>
                {availableMunicipios.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Seletor de Rede */}
            <div className="relative">
              <select
                id="filter-rede"
                value={filters.dependencia_adm}
                onChange={handleRedeChange}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              >
                {REDE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

          {/* Botão de Limpar Filtros */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer self-end lg:self-auto"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
