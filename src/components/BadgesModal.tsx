import React from 'react';
import { Award, Star, CheckCircle, Lock, Trophy, Printer } from 'lucide-react';
import { BADGES_LIST } from '../data/challenges';
import { LevelProgress } from '../types/game';

interface BadgesModalProps {
  unlockedBadgeIds: string[];
  progress: Record<number, LevelProgress>;
  totalStars: number;
  completedCount: number;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  unlockedBadgeIds,
  progress,
  totalStars,
  completedCount
}) => {
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Conquistas & Progresso do Aluno
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quadro de Medalhas & Certificado
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Cada medalha celebra uma conquista no aprendizado de matrizes, coordenadas e pensamento computacional.
          </p>
        </div>

        {/* Action: Print report */}
        <button
          onClick={handlePrintCertificate}
          className="cursor-pointer py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Relatório</span>
        </button>
      </div>

      {/* Summary Stats Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs text-center">
          <span className="text-xs font-medium text-slate-500 block mb-1">Desafios Concluídos</span>
          <span className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono-numbers">
            {completedCount} <span className="text-sm font-semibold text-slate-400">/ 20</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs text-center">
          <span className="text-xs font-medium text-slate-500 block mb-1">Estrelas Douradas</span>
          <div className="flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">
              {totalStars} <span className="text-sm font-semibold text-slate-400">/ 60</span>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs text-center">
          <span className="text-xs font-medium text-slate-500 block mb-1">Medalhas Desbloqueadas</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono-numbers">
            {unlockedBadgeIds.length} <span className="text-sm font-semibold text-slate-400">/ {BADGES_LIST.length}</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs text-center">
          <span className="text-xs font-medium text-slate-500 block mb-1">Status BNCC EF04CO01</span>
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            {completedCount === 20 ? '🏆 100% Dominado' : completedCount >= 10 ? '⚡ Avançado' : '🌱 Em Progresso'}
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES_LIST.map(badge => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`
                p-5 rounded-3xl border transition-all flex items-start gap-4
                ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-200/60'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }
              `}
            >
              <div
                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner
                  ${isUnlocked ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-400'}
                `}
              >
                {isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-slate-400" />}
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {badge.title}
                  </h4>
                  {isUnlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </div>

                <p className="text-xs text-slate-600 leading-snug">
                  {badge.description}
                </p>

                <span className="text-[11px] font-semibold text-indigo-700 mt-1">
                  Requisito: {badge.reqText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Certificate Card (Printable) */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-indigo-700/50 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center text-3xl mb-4">
          🎓
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-1">
          Certificado de Participação em Computação
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          MatrixQuest: Navegação e Matrizes 4º Ano
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2">
          Certifica o desenvolvimento de habilidades em representação de dados matriciais, coordenadas bidimensionais e pensamento algorítmico (BNCC EF04CO01).
        </p>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-indigo-800/80 text-xs text-indigo-200">
          <div>
            <span className="block font-bold text-white text-base font-mono-numbers">{completedCount}/20</span>
            <span>Desafios Concluídos</span>
          </div>
          <div className="w-px h-8 bg-indigo-800" />
          <div>
            <span className="block font-bold text-white text-base font-mono-numbers">{totalStars}/60</span>
            <span>Estrelas Coletadas</span>
          </div>
          <div className="w-px h-8 bg-indigo-800" />
          <div>
            <span className="block font-bold text-white text-base font-mono-numbers">{unlockedBadgeIds.length}/10</span>
            <span>Medalhas de Honra</span>
          </div>
        </div>
      </div>
    </div>
  );
};
