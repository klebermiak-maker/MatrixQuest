import React from 'react';
import { Lightbulb, Compass, Target, ArrowRight, Check, X, Sparkles, ChevronRight } from 'lucide-react';
import { Challenge, CoordinateDisplayMode, GradualClue } from '../types/game';
import { sound } from '../utils/audio';

interface GradualCluesModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  clues: GradualClue[];
  activeStage: 1 | 2 | 3;
  setActiveStage: (stage: 1 | 2 | 3) => void;
  unlockedStage: 1 | 2 | 3;
  setUnlockedStage: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  coordMode: CoordinateDisplayMode;
  secondsStuck: number;
}

export const GradualCluesModal: React.FC<GradualCluesModalProps> = ({
  isOpen,
  onClose,
  challenge,
  clues,
  activeStage,
  setActiveStage,
  unlockedStage,
  setUnlockedStage,
  coordMode,
  secondsStuck
}) => {
  if (!isOpen) return null;

  const currentClue = clues.find(c => c.stage === activeStage) || clues[0];

  const handleNextStage = () => {
    sound.playClick();
    if (activeStage === 1) {
      setActiveStage(2);
      if (unlockedStage < 2) setUnlockedStage(2);
    } else if (activeStage === 2) {
      setActiveStage(3);
      if (unlockedStage < 3) setUnlockedStage(3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 flex flex-col gap-5 animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shadow-inner">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Assistente de Coordenadas
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-mono-numbers">
                  Tempo no desafio: {secondsStuck}s
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Pistas Graduais: Lógica da Matriz
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="cursor-pointer p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Fechar pistas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Step Tabs Navigation */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold">
          {[
            { stage: 1 as const, label: '1. Eixos do Grid', icon: Compass },
            { stage: 2 as const, label: '2. Lógica Espacial', icon: Target },
            { stage: 3 as const, label: '3. Radar Ativo', icon: Sparkles }
          ].map(tab => {
            const isSelected = activeStage === tab.stage;
            const isUnlocked = unlockedStage >= tab.stage;
            const Icon = tab.icon;

            return (
              <button
                key={`tab-stage-${tab.stage}`}
                disabled={!isUnlocked}
                onClick={() => {
                  sound.playClick();
                  setActiveStage(tab.stage);
                }}
                className={`
                  cursor-pointer py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center
                  ${
                    isSelected
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : isUnlocked
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Clue Content Card */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <h4 className="text-sm font-bold text-amber-950">
              {currentClue.stageName}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {currentClue.explanation}
          </p>

          {activeStage === 3 && (
            <div className="mt-1 p-3 bg-white rounded-xl border border-amber-200 text-xs text-indigo-900 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span>
                <strong>Radar Ligado:</strong> O grid agora está destacando o caminho e os alvos com luz amarela pulsante!
              </span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Fechar e Testar
          </button>

          {activeStage < 3 ? (
            <button
              onClick={handleNextStage}
              className="cursor-pointer py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ml-auto"
            >
              <span>Avançar para {activeStage === 1 ? 'Pista 2' : 'Radar de Coordenadas'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="cursor-pointer py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ml-auto"
            >
              <Check className="w-4 h-4" />
              <span>Pronto, vou resolver agora!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
