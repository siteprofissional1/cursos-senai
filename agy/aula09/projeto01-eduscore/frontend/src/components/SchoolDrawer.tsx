/**
 * Componente SchoolDrawer (Zona 5.2): Slide-Over Lateral com Detalhes e Estudantes
 * Padrão SENAI - Humanização LGPD, Links Clicáveis tel: e Responsividade Mobile
 */

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Lock, 
  User, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Award
} from 'lucide-react';
import type { SchoolDetail } from '../types';

interface SchoolDrawerProps {
  school: SchoolDetail | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export const SchoolDrawer: React.FC<SchoolDrawerProps> = ({
  school,
  isOpen,
  onClose,
  loading
}) => {
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop com blur suave */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Conteúdo do Drawer (Slide-Over no Desktop / Tela cheia em Mobile) */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-slide-left">
        
        {/* Cabeçalho do Drawer */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                INEP #{school?.co_escola}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Rede {school?.rede}
              </span>
              {school?.is_sigilo_inep && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Lock className="w-3 h-3" /> Sigilo INEP
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 m-0">
              {school?.nome_oficial}
            </h2>

            {/* Endereço e Telefone */}
            <div className="mt-2.5 space-y-1 text-xs text-slate-600">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{school?.endereco}</span>
              </div>
              {school?.telefone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {school.telefone.startsWith('(') ? (
                    <a
                      href={`tel:${school.telefone.replace(/\D/g, '')}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {school.telefone}
                    </a>
                  ) : (
                    <span>{school.telefone}</span>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Botão de Fechar */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Drawer com Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {loading ? (
            <div className="space-y-4 py-8 animate-pulse">
              <div className="h-20 bg-slate-100 rounded-xl"></div>
              <div className="h-40 bg-slate-100 rounded-xl"></div>
              <div className="h-40 bg-slate-100 rounded-xl"></div>
            </div>
          ) : school ? (
            <>
              {/* Alerta de Sigilo INEP caso aplicável */}
              {school.is_sigilo_inep && (
                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold mb-0.5">
                      Proteção Estatística e Salvaguarda LGPD
                    </strong>
                    Por determinação do INEP, escolas com menos de 10 participantes avaliados possuem identificadores especiais para resguardar a privacidade e o sigilo dos estudantes.
                  </div>
                </div>
              )}

              {/* Boletim Consolidado da Instituição */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" /> Boletim Geral da Instituição
                  </span>
                  <div className="text-xs text-slate-500">
                    Total: <strong className="text-slate-800 tabular-nums">{school.total_alunos}</strong> alunos
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Média Geral</div>
                    <div className="text-lg font-extrabold text-blue-600 tabular-nums">
                      {school.scores.media_geral?.toFixed(1) ?? '-'}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Natureza (CN)</div>
                    <div className="text-base font-bold text-slate-800 tabular-nums">
                      {school.scores.media_cn?.toFixed(1) ?? '-'}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Humanas (CH)</div>
                    <div className="text-base font-bold text-slate-800 tabular-nums">
                      {school.scores.media_ch?.toFixed(1) ?? '-'}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Linguagens (LC)</div>
                    <div className="text-base font-bold text-slate-800 tabular-nums">
                      {school.scores.media_lc?.toFixed(1) ?? '-'}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Matemática (MT)</div>
                    <div className="text-base font-bold text-slate-800 tabular-nums">
                      {school.scores.media_mt?.toFixed(1) ?? '-'}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Redação</div>
                    <div className="text-base font-bold text-slate-800 tabular-nums">
                      {school.scores.media_redacao?.toFixed(1) ?? '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista Completa de Estudantes Humanizados */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-bold text-slate-900 m-0">
                      Estudantes Avaliados na Instituição
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    {school.students.length} estudantes listados
                  </span>
                </div>

                {school.students.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Nenhum estudante com notas válidas cadastrado para esta escola.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {school.students.map(st => {
                      const isExp = expandedStudentId === st.id;
                      return (
                        <div
                          key={st.id}
                          className="border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors bg-white text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 truncate">
                                  {st.nome_humanizado}
                                </div>
                                <div className="font-mono text-[10px] text-slate-400">
                                  {st.nu_inscricao_formatada}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-bold text-slate-900 text-sm tabular-nums">
                                {st.media_geral ? st.media_geral.toFixed(1) : '-'}
                              </span>
                              <button
                                onClick={() => setExpandedStudentId(isExp ? null : st.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              >
                                {isExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Boletim Individual do Aluno */}
                          {isExp && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-5 gap-1.5 text-center text-[10px] bg-slate-50 rounded p-2">
                              <div>
                                <div className="text-slate-400 font-medium">CN</div>
                                <div className="font-bold text-slate-800 tabular-nums">
                                  {st.nu_nota_cn?.toFixed(1) ?? '-'}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-400 font-medium">CH</div>
                                <div className="font-bold text-slate-800 tabular-nums">
                                  {st.nu_nota_ch?.toFixed(1) ?? '-'}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-400 font-medium">LC</div>
                                <div className="font-bold text-slate-800 tabular-nums">
                                  {st.nu_nota_lc?.toFixed(1) ?? '-'}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-400 font-medium">MT</div>
                                <div className="font-bold text-slate-800 tabular-nums">
                                  {st.nu_nota_mt?.toFixed(1) ?? '-'}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-400 font-medium">Redação</div>
                                <div className="font-bold text-slate-800 tabular-nums">
                                  {st.nu_nota_redacao?.toFixed(1) ?? '-'}
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : null}

        </div>

      </div>

    </div>
  );
};
