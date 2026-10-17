/**
 * Componente SimulatorSection: Simulador Universitário SISU, ProUni e FIES
 * Mapeamento Interativo de Cidades e Lista de Cursos Aprovados
 * Padrão SENAI - Clean Code, SVG Interativo & Mobile-First
 */

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Sliders, 
  Compass, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  Map as MapIcon,
  ListFilter
} from 'lucide-react';
import type { FilterState, SimuladorResponse, OportunidadeItem } from '../types';
import { simularOportunidades } from '../services/api';

interface SimulatorSectionProps {
  filters: FilterState;
  suggestedScore: number;
  schoolName: string;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  filters,
  suggestedScore,
  schoolName
}) => {
  const [programa, setPrograma] = useState<'prouni' | 'sisu' | 'fies'>('prouni');
  const [nota, setNota] = useState<number>(suggestedScore > 0 ? suggestedScore : 650.0);
  const [abrangencia, setAbrangencia] = useState<'estado' | 'brasil'>('estado');
  const [searchCurso, setSearchCurso] = useState('');
  const [turno, setTurno] = useState('');
  const [apenasAprovados, setApenasAprovados] = useState(true);
  const [activeTab, setActiveTab] = useState<'mapa' | 'lista'>('mapa');
  const [selectedCityPin, setSelectedCityPin] = useState<string | null>(null);

  const [data, setData] = useState<SimuladorResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Atualiza a nota sugerida quando o filtro de escola/cidade mudar
  useEffect(() => {
    if (suggestedScore > 0) {
      setNota(suggestedScore);
    }
  }, [suggestedScore]);

  // Carregar oportunidades sempre que os parâmetros mudarem
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const uf = filters.uf || 'SP';
        const res = await simularOportunidades(
          programa,
          nota,
          uf,
          filters.municipio,
          abrangencia,
          searchCurso,
          turno,
          apenasAprovados
        );
        setData(res);
      } catch (err) {
        console.error('Erro ao buscar dados do simulador:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [programa, nota, filters.uf, filters.municipio, abrangencia, searchCurso, turno, apenasAprovados]);

  const handleResetNota = () => {
    if (suggestedScore > 0) {
      setNota(suggestedScore);
    } else {
      setNota(650.0);
    }
  };

  // Cursos filtrados pela cidade selecionada no mapa (se houver)
  const displayedOpportunities: OportunidadeItem[] = React.useMemo(() => {
    if (!data) return [];
    if (!selectedCityPin) return data.oportunidades;
    return data.oportunidades.filter(
      op => `${op.municipio}-${op.uf}` === selectedCityPin
    );
  }, [data, selectedCityPin]);

  const activeUf = filters.uf || 'SP';
  const activeCity = filters.municipio || 'Sua Cidade';

  return (
    <section id="simulador-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs scroll-mt-20">
      
      {/* 1. Cabeçalho do Simulador */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 m-0">
                Simulador Universitário de Oportunidades: SISU • ProUni • FIES
              </h2>
              <p className="text-xs text-slate-500">
                Onde a pontuação do ENEM 2025 garante aprovação no estado de {activeUf} e no país
              </p>
            </div>
          </div>
        </div>

        {/* Badge de Sincronização com o Filtro Ativo */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-slate-600">
            Origem: <strong className="text-slate-900">{activeCity} ({activeUf})</strong>
          </span>
          {suggestedScore > 0 && (
            <span 
              className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200 text-[11px] tabular-nums"
              title={schoolName ? `Escola 1º Lugar: ${schoolName}` : undefined}
            >
              {schoolName ? `1º: ${suggestedScore.toFixed(1)} pts` : `Ref: ${suggestedScore.toFixed(1)} pts`}
            </span>
          )}
        </div>
      </div>

      {/* 2. Seletores de Programa (SISU, ProUni, FIES) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        
        {/* Card SISU */}
        <button
          onClick={() => setPrograma('sisu')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            programa === 'sisu'
              ? 'border-blue-500 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              🏛️ SISU
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Vagas Públicas
            </span>
          </div>
          <p className="text-[11px] text-slate-500 m-0">
            Universidades Federais, Estaduais e Institutos Federais (IFSP, USP, UNESP).
          </p>
        </button>

        {/* Card ProUni */}
        <button
          onClick={() => setPrograma('prouni')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            programa === 'prouni'
              ? 'border-emerald-500 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              🎓 ProUni
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Bolsas 100% & 50%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 m-0">
            Bolsas integrais e parciais em faculdades privadas de ponta. Mínimo 450 pts.
          </p>
        </button>

        {/* Card FIES */}
        <button
          onClick={() => setPrograma('fies')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            programa === 'fies'
              ? 'border-indigo-500 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              💳 FIES
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              Financiamento
            </span>
          </div>
          <p className="text-[11px] text-slate-500 m-0">
            Financiamento estudantil facilitado com juros zero ou reduzidos.
          </p>
        </button>

      </div>

      {/* 3. Painel de Controle de Nota & Filtros */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 mb-6 space-y-4">
        
        {/* Slider & Input Numérico da Nota */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                Nota Simulada do ENEM:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-blue-600 tabular-nums">
                  {nota.toFixed(1)} <span className="text-xs font-normal text-slate-500">pts</span>
                </span>
                <button
                  onClick={handleResetNota}
                  title="Restaurar para a nota da escola de referência"
                  className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slider Range */}
            <input
              type="range"
              min="400"
              max="900"
              step="0.5"
              value={nota}
              onChange={e => setNota(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Mínimo 450 pts</span>
              <span>650 pts (Média Geral)</span>
              <span>800+ pts (Medicina)</span>
            </div>
          </div>

          {/* Abrangência: Estado vs Brasil */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shrink-0">
            <button
              onClick={() => setAbrangencia('estado')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                abrangencia === 'estado'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📍 Estado ({activeUf})
            </button>
            <button
              onClick={() => setAbrangencia('brasil')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                abrangencia === 'brasil'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇧🇷 Brasil Inteiro
            </button>
          </div>
        </div>

        {/* Filtros Secundários: Busca por Curso e Turno */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/60">
          
          {/* Busca por Curso */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar curso (ex: Direito, Medicina, ADS)..."
              value={searchCurso}
              onChange={e => setSearchCurso(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Seletor de Turno */}
          <select
            value={turno}
            onChange={e => setTurno(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="">Todos os Turnos</option>
            <option value="Noturno">Noturno</option>
            <option value="Matutino">Matutino</option>
            <option value="Integral">Integral</option>
          </select>

          {/* Toggle Apenas Aprovados */}
          <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={apenasAprovados}
              onChange={e => setApenasAprovados(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>Apenas Cursos Aprovados</span>
          </label>

        </div>

      </div>

      {/* 4. Resumo de Oportunidades & Abas Mapa vs Lista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        {/* Contadores */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Resultados da Simulação:</span>
          {data ? (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 tabular-nums">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {data.total_aprovadas} aprovados
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">
                <strong className="tabular-nums">{data.total_oportunidades}</strong> ofertas avaliadas
              </span>
            </>
          ) : null}
        </div>

        {/* Toggle Abas: Mapa vs Lista */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('mapa')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'mapa'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Mapa Interativo</span>
          </button>
          <button
            onClick={() => setActiveTab('lista')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'lista'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Lista Completa</span>
          </button>
        </div>

      </div>

      {/* 5. Área de Visualização (Mapa Interativo ou Lista Completa) */}
      {loading ? (
        <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center animate-pulse text-xs text-slate-400">
          Processando simulação geográfica e notas de corte...
        </div>
      ) : activeTab === 'mapa' ? (
        
        /* 5.1 ABA MAPA INTERATIVO */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Mapa SVG com Polos de Oportunidades */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden min-h-[360px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 z-10 mb-2">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-blue-400" /> Polos e Cidades com Ofertas Aprovadas
              </span>
              <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {abrangencia === 'estado' ? `Foco: Estado de ${activeUf}` : 'Visão Nacional (Brasil)'}
              </span>
            </div>

            {/* Grid Visual de Marcadores de Cidades */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto py-4 z-10">
              {data?.cidades_mapa.map(city => {
                const isSelected = selectedCityPin === `${city.municipio}-${city.uf}`;
                const hasAprovados = city.cursos_aprovados > 0;

                return (
                  <button
                    key={`${city.municipio}-${city.uf}`}
                    onClick={() =>
                      setSelectedCityPin(
                        isSelected ? null : `${city.municipio}-${city.uf}`
                      )
                    }
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-400 shadow-md ring-2 ring-blue-300'
                        : hasAprovados
                        ? 'bg-slate-800/90 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{city.municipio}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {city.uf} • {city.total_cursos} ofertas
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-black shrink-0 tabular-nums ${
                        hasAprovados
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {city.cursos_aprovados}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 z-10 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>* Clique em qualquer cidade para filtrar a lista ao lado</span>
              {selectedCityPin && (
                <button
                  onClick={() => setSelectedCityPin(null)}
                  className="text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  Limpar filtro de cidade
                </button>
              )}
            </div>
          </div>

          {/* Painel Lateral com Cursos da Cidade Selecionada */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between max-h-[420px] overflow-hidden">
            <div className="mb-3 pb-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                {selectedCityPin ? `Vagas em ${selectedCityPin.split('-')[0]}` : 'Destaques Aprovados'}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold tabular-nums">
                {displayedOpportunities.length} cursos
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {displayedOpportunities.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Nenhum curso aprovado com a pontuação de {nota.toFixed(1)} pts nesta localidade. Tente elevar a nota no slider!
                </div>
              ) : (
                displayedOpportunities.slice(0, 15).map(op => (
                  <div
                    key={op.id}
                    className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs hover:border-blue-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900 truncate">
                        {op.curso}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums ${
                          op.margem >= 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {op.margem >= 0 ? `+${op.margem.toFixed(1)} pts` : `${op.margem.toFixed(1)} pts`}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {op.sigla} • {op.municipio} ({op.uf})
                    </div>
                    
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>{op.modalidade}</span>
                      <span className="font-semibold text-slate-600 tabular-nums">
                        Corte: {op.nota_corte.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {displayedOpportunities.length > 15 && (
              <div className="pt-2 text-center text-[11px] text-blue-600 font-medium">
                Alterne para a aba "Lista Completa" para ver todos os {displayedOpportunities.length} cursos
              </div>
            )}
          </div>

        </div>

      ) : (

        /* 5.2 ABA LISTA COMPLETA */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedOpportunities.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-slate-400">
              Nenhuma oportunidade encontrada com os critérios selecionados.
            </div>
          ) : (
            displayedOpportunities.map(op => {
              const isAprovado = op.margem >= 0;

              return (
                <div
                  key={op.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {op.sigla} • {op.tipo_instituicao}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded tabular-nums ${
                          isAprovado
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isAprovado ? `Aprovado (+${op.margem.toFixed(1)})` : `Espera (${op.margem.toFixed(1)})`}
                      </span>
                    </div>

                    {/* Curso */}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 m-0 mb-1">
                      {op.curso}
                    </h3>

                    {/* Instituição e Cidade */}
                    <p className="text-xs text-slate-600 line-clamp-1 mb-1">
                      {op.instituicao}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {op.municipio} - {op.uf} • Turno {op.turno}
                    </p>
                  </div>

                  {/* Rodapé com Nota de Corte e Modalidade */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-[170px]">
                      {op.modalidade}
                    </span>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Nota de Corte</div>
                      <div className="font-extrabold text-slate-800 tabular-nums">
                        {op.nota_corte.toFixed(1)}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      )}

    </section>
  );
};
