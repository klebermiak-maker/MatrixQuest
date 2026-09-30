import React, { useEffect } from 'react';
import { Star, ArrowRight, RotateCcw, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { Challenge } from '../types/game';
import { sound } from '../utils/audio';
import { triggerVictoryConfetti } from '../utils/confetti';

interface ChallengeModalProps {
  challenge: Challenge;
  starsEarned: number;
  isOpen: boolean;
  onClose: () => void;
  onNextChallenge: () => void;
  onReplay: () => void;
  hasNext: boolean;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  starsEarned,
  isOpen,
  onClose,
  onNextChallenge,
  onReplay,
  hasNext
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playSuccess();
      triggerVictoryConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Celebration Header */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 shadow-inner animate-celebrate-float">
            <span className="text-3xl">🏆</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Desafio Concluído com Sucesso!</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
            {challenge.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Módulo {challenge.module}: {challenge.moduleName} · Desafio {challenge.id} de 20
          </p>

          {/* Sequential Animated Stars display */}
          <div className="flex items-center justify-center gap-2 my-4">
            {[1, 2, 3].map(s => {
              const isEarned = s <= starsEarned;
              const animClass = s === 1 ? 'animate-star-pop-1' : s === 2 ? 'animate-star-pop-2' : 'animate-star-pop-3';

              return (
                <div key={`star-box-${s}`} className={animClass}>
                  <Star
                    className={`w-9 h-9 sm:w-11 sm:h-11 transition-all filter ${
                      isEarned
                        ? 'fill-amber-400 text-amber-500 drop-shadow-md'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-4 py-2.5 rounded-xl mb-4 text-center leading-relaxed">
            {challenge.successMessage}
          </p>
        </div>

        {/* BNCC Computational Thinking Lesson */}
        <div className="relative z-10 bg-slate-50 border border-slate-200 rounded-2xl p-4 my-3 flex flex-col gap-2.5 text-left text-xs">
          <div>
            <span className="font-bold text-indigo-700 block mb-0.5">
              💡 O que você praticou em Computação (BNCC EF04CO01):
            </span>
            <p className="text-slate-600 leading-relaxed font-medium">
              {challenge.bnccGoal}
            </p>
          </div>

          <div className="border-t border-slate-200/60 pt-2">
            <span className="font-bold text-slate-700 block mb-0.5">
              🌍 Onde isso é usado no mundo real?
            </span>
            <p className="text-slate-600 leading-relaxed font-medium">
              {challenge.realWorldConnection}
            </p>
          </div>
        </div>

        {/* Action buttons with Confetti trigger */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onReplay}
              className="cursor-pointer py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors"
              title="Jogar este desafio novamente"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir</span>
            </button>

            <button
              onClick={() => triggerVictoryConfetti()}
              className="cursor-pointer py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors"
              title="Soltar mais confetes!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Mais Confetes! 🎉</span>
            </button>
          </div>

          {hasNext ? (
            <button
              onClick={onNextChallenge}
              className="cursor-pointer py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm ml-auto"
            >
              <span>Próximo Desafio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="cursor-pointer py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm ml-auto"
            >
              <Award className="w-4 h-4" />
              <span>Ver Medalhas Conquistadas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

