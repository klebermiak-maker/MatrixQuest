/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChallengeView } from './components/ChallengeView';
import { FreeSandbox } from './components/FreeSandbox';
import { PedagogicalGuide } from './components/PedagogicalGuide';
import { BadgesModal } from './components/BadgesModal';
import { 
  loadProgress, 
  loadUnlockedBadges, 
  loadCoordMode, 
  saveCoordMode, 
  resetAllProgress 
} from './utils/storage';
import { CoordinateDisplayMode, LevelProgress } from './types/game';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'sandbox' | 'pedagogy' | 'badges'>('challenges');
  const [currentChallengeId, setCurrentChallengeId] = useState<number>(1);
  const [progress, setProgress] = useState<Record<number, LevelProgress>>({});
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [coordMode, setCoordMode] = useState<CoordinateDisplayMode>('row-col');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Load saved state on mount
  useEffect(() => {
    setProgress(loadProgress());
    setUnlockedBadges(loadUnlockedBadges());
    setCoordMode(loadCoordMode());
    setIsMuted(sound.getMuted());
  }, []);

  const handleCoordModeChange = (mode: CoordinateDisplayMode) => {
    sound.playClick();
    setCoordMode(mode);
    saveCoordMode(mode);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) {
      sound.playClick();
    }
  };

  const handleRefreshBadges = () => {
    setUnlockedBadges(loadUnlockedBadges());
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setProgress({});
    setUnlockedBadges([]);
    setCurrentChallengeId(1);
    setShowResetConfirm(false);
    sound.playClick();
  };

  // Metrics
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalStars = Object.values(progress).reduce((acc, cur) => acc + (cur.stars || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Bar Contract Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        coordMode={coordMode}
        onCoordModeChange={handleCoordModeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        completedCount={completedCount}
        totalStars={totalStars}
        onResetProgress={() => setShowResetConfirm(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'challenges' && (
          <ChallengeView
            currentChallengeId={currentChallengeId}
            setCurrentChallengeId={setCurrentChallengeId}
            progress={progress}
            setProgress={setProgress}
            coordMode={coordMode}
            onRefreshBadges={handleRefreshBadges}
          />
        )}

        {activeTab === 'sandbox' && (
          <FreeSandbox coordMode={coordMode} />
        )}

        {activeTab === 'pedagogy' && (
          <PedagogicalGuide />
        )}

        {activeTab === 'badges' && (
          <BadgesModal
            unlockedBadgeIds={unlockedBadges}
            progress={progress}
            totalStars={totalStars}
            completedCount={completedCount}
          />
        )}
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Reiniciar Todo o Progresso?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Isso apagará as estrelas conquistadas, medalhas e o histórico dos 20 desafios. Deseja recomeçar do zero?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="cursor-pointer py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="cursor-pointer py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
              >
                Sim, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiet, Clean Educational Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">MatrixQuest 4º Ano</span>
            <span aria-hidden="true">·</span>
            <span>Habilidade BNCC EF04CO01 (Computação na Educação Básica)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>20 Desafios Interativos em Matriz e Grid</span>
            <span aria-hidden="true">·</span>
            <span>Pensamento Computacional</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
