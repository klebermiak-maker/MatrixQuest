import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Grid, Award, RotateCcw } from 'lucide-react';
import { CoordinateDisplayMode } from '../types/game';

interface HeaderProps {
  activeTab: 'challenges' | 'sandbox' | 'pedagogy' | 'badges';
  setActiveTab: (tab: 'challenges' | 'sandbox' | 'pedagogy' | 'badges') => void;
  coordMode: CoordinateDisplayMode;
  onCoordModeChange: (mode: CoordinateDisplayMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  completedCount: number;
  totalStars: number;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  coordMode,
  onCoordModeChange,
  isMuted,
  onToggleMute,
  completedCount,
  totalStars,
  onResetProgress
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand */}
        <button
          onClick={() => setActiveTab('challenges')}
          className="text-left group flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            M
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            MatrixQuest 4º Ano
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'challenges'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            20 Desafios
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'sandbox'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Laboratório Livre</span>
          </button>

          <button
            onClick={() => setActiveTab('pedagogy')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'pedagogy'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guia BNCC EF04CO01</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Conquistas</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Quick Controls */}
        <div className="flex items-center gap-3">
          {/* Coordinate Notation Segmented Selector */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
            <span className="px-2 text-slate-600">Notação:</span>
            <button
              onClick={() => onCoordModeChange('row-col')}
              className={`px-2 py-1 rounded transition-colors ${
                coordMode === 'row-col' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
              title="Notação: Linha e Coluna (ex: Linha 2, Coluna 3)"
            >
              Linha/Coluna
            </button>
            <button
              onClick={() => onCoordModeChange('alpha-num')}
              className={`px-2 py-1 rounded transition-colors ${
                coordMode === 'alpha-num' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
              title="Notação Alfanumérica (ex: B3)"
            >
              A1, B2
            </button>
            <button
              onClick={() => onCoordModeChange('cartesian')}
              className={`px-2 py-1 rounded transition-colors ${
                coordMode === 'cartesian' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
              title="Notação Cartesiana (X, Y)"
            >
              (X, Y)
            </button>
          </div>

          {/* Quick Stats: Clean unboxed text */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
            <span className="text-amber-600">★</span>
            <span className="font-mono-numbers">{totalStars}/60</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono-numbers">{completedCount}/20</span>
          </div>

          {/* Audio toggle button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? 'Ativar som' : 'Silenciar som'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-600" /> : <Volume2 className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Reset progress */}
          <button
            onClick={onResetProgress}
            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Reiniciar todo o progresso dos desafios"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-3 py-2 text-xs font-medium bg-slate-50">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`py-1 px-2 rounded ${activeTab === 'challenges' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'text-slate-600'}`}
        >
          20 Desafios
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`py-1 px-2 rounded ${activeTab === 'sandbox' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'text-slate-600'}`}
        >
          Laboratório
        </button>
        <button
          onClick={() => setActiveTab('pedagogy')}
          className={`py-1 px-2 rounded ${activeTab === 'pedagogy' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'text-slate-600'}`}
        >
          BNCC
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`py-1 px-2 rounded ${activeTab === 'badges' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'text-slate-600'}`}
        >
          Conquistas
        </button>
      </div>
    </header>
  );
};
