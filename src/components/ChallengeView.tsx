import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Lightbulb, 
  Info, 
  CheckCircle,
  HelpCircle,
  Compass,
  Sparkles,
  MapPin,
  Clock,
  X
} from 'lucide-react';
import { CHALLENGES } from '../data/challenges';
import { 
  Challenge, 
  CommandStep, 
  CommandType,
  Coordinate, 
  Direction, 
  CoordinateDisplayMode, 
  LevelProgress 
} from '../types/game';
import { GridBoard } from './GridBoard';
import { ControlDeck } from './ControlDeck';
import { ChallengeModal } from './ChallengeModal';
import { GradualCluesModal } from './GradualCluesModal';
import { getGradualCluesForChallenge } from '../utils/clues';
import { areCoordsEqual, formatCoordinate, includesCoord } from '../utils/coordinates';
import { sound } from '../utils/audio';
import { saveLevelProgress } from '../utils/storage';
import { triggerVictoryConfetti } from '../utils/confetti';

interface ChallengeViewProps {
  currentChallengeId: number;
  setCurrentChallengeId: (id: number) => void;
  progress: Record<number, LevelProgress>;
  setProgress: React.Dispatch<React.SetStateAction<Record<number, LevelProgress>>>;
  coordMode: CoordinateDisplayMode;
  onRefreshBadges: () => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  currentChallengeId,
  setCurrentChallengeId,
  progress,
  setProgress,
  coordMode,
  onRefreshBadges
}) => {
  const challenge = CHALLENGES.find(c => c.id === currentChallengeId) || CHALLENGES[0];

  // Game state
  const [playerPos, setPlayerPos] = useState<Coordinate>(challenge.startPos || { r: 0, c: 0 });
  const [playerDir, setPlayerDir] = useState<Direction>(challenge.startDir || 'right');
  const [visitedCells, setVisitedCells] = useState<Coordinate[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<Coordinate[]>([]);
  const [paintedPixels, setPaintedPixels] = useState<Record<string, string>>({});
  const [activeColor, setActiveColor] = useState<string>('#EF4444');

  // Quiz state
  const [quizSelectedRow, setQuizSelectedRow] = useState<number | null>(null);
  const [quizSelectedCol, setQuizSelectedCol] = useState<number | null>(null);

  // Algorithm Program
  const [program, setProgram] = useState<CommandStep[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  // Hints
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);

  // 30 Seconds Stuck Detection & Gradual Clues System
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [showStuckNudge, setShowStuckNudge] = useState<boolean>(false);
  const [dismissedNudge, setDismissedNudge] = useState<boolean>(false);
  const [isGradualCluesModalOpen, setIsGradualCluesModalOpen] = useState<boolean>(false);
  const [activeClueStage, setActiveClueStage] = useState<1 | 2 | 3>(1);
  const [unlockedClueStage, setUnlockedClueStage] = useState<1 | 2 | 3>(1);

  // Victory Modal
  const [victoryModalOpen, setVictoryModalOpen] = useState(false);
  const [starsEarned, setStarsEarned] = useState(3);

  // Track items collected in active run
  const [collectedItems, setCollectedItems] = useState<Coordinate[]>([]);

  // Execution cancel token
  const executionTokenRef = useRef<number>(0);

  // Gradual clues data for this challenge
  const gradualClues = getGradualCluesForChallenge(challenge, coordMode);

  // 30-Second Timer to detect when student is stuck
  useEffect(() => {
    setTimeSpentSeconds(0);
    setShowStuckNudge(false);
    setDismissedNudge(false);

    const timer = setInterval(() => {
      setTimeSpentSeconds(prev => {
        const next = prev + 1;
        if (next >= 30 && !dismissedNudge && !victoryModalOpen) {
          setShowStuckNudge(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentChallengeId, dismissedNudge, victoryModalOpen]);

  // Reset challenge state whenever challenge ID changes
  useEffect(() => {
    resetChallenge();
  }, [currentChallengeId]);

  const resetChallenge = () => {
    executionTokenRef.current += 1;
    setIsExecuting(false);
    setCurrentStepIndex(null);
    setPlayerPos(challenge.startPos || { r: 0, c: 0 });
    setPlayerDir(challenge.startDir || 'right');
    setVisitedCells(challenge.startPos ? [{ ...challenge.startPos }] : []);
    setSelectedCoords([]);
    setProgram([]);
    setHintIndex(0);
    setShowHintModal(false);
    setQuizSelectedRow(null);
    setQuizSelectedCol(null);
    setCollectedItems([]);
    setTimeSpentSeconds(0);
    setShowStuckNudge(false);
    setDismissedNudge(false);
    setIsGradualCluesModalOpen(false);
    setActiveClueStage(1);
    setUnlockedClueStage(1);

    // Initial pixels if any
    const initialPixelMap: Record<string, string> = {};
    if (challenge.initialBoard?.pixels) {
      challenge.initialBoard.pixels.forEach(p => {
        initialPixelMap[`${p.pos.r},${p.pos.c}`] = p.color;
      });
    }
    setPaintedPixels(initialPixelMap);
  };

  // Cell click handler
  const handleCellClick = (coord: Coordinate) => {
    if (isExecuting) return;

    if (challenge.interactionType === 'cell-pick' || challenge.interactionType === 'matrix-transform') {
      setSelectedCoords(prev => {
        const exists = prev.some(c => areCoordsEqual(c, coord));
        if (exists) {
          return prev.filter(c => !areCoordsEqual(c, coord));
        } else {
          // If single pick challenge, replace
          if (challenge.targetCoords?.length === 1) {
            return [coord];
          }
          return [...prev, coord];
        }
      });
    } else if (challenge.interactionType === 'pixel-draw') {
      const key = `${coord.r},${coord.c}`;
      if (!activeColor) {
        // Eraser
        setPaintedPixels(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      } else {
        setPaintedPixels(prev => ({
          ...prev,
          [key]: activeColor
        }));
      }
    }
  };

  // Run navigation program
  const executeProgram = async () => {
    if (program.length === 0 || isExecuting) return;

    setIsExecuting(true);
    const token = ++executionTokenRef.current;

    let curPos = { ...(challenge.startPos || { r: 0, c: 0 }) };
    let curDir = challenge.startDir || 'right';
    const visited: Coordinate[] = [{ ...curPos }];
    const collected: Coordinate[] = [];

    setPlayerPos(curPos);
    setPlayerDir(curDir);
    setVisitedCells(visited);
    setCollectedItems(collected);

    // Expand commands (handling loop commands)
    const flatCommands: { dir: CommandType; stepIdx: number }[] = [];
    program.forEach((step, sIdx) => {
      if (step.type === 'loop_repeat' && step.innerCommands) {
        const count = step.repeatCount || 1;
        for (let r = 0; r < count; r++) {
          step.innerCommands.forEach(cmd => {
            flatCommands.push({ dir: cmd, stepIdx: sIdx });
          });
        }
      } else {
        flatCommands.push({ dir: step.type, stepIdx: sIdx });
      }
    });

    let failed = false;

    for (let i = 0; i < flatCommands.length; i++) {
      if (executionTokenRef.current !== token) return;

      const item = flatCommands[i];
      setCurrentStepIndex(item.stepIdx);

      let nextPos = { ...curPos };
      let nextDir = curDir;

      if (item.dir === 'up') {
        nextPos.r = Math.max(0, curPos.r - 1);
        nextDir = 'up';
      } else if (item.dir === 'down') {
        nextPos.r = Math.min(challenge.rows - 1, curPos.r + 1);
        nextDir = 'down';
      } else if (item.dir === 'left') {
        nextPos.c = Math.max(0, curPos.c - 1);
        nextDir = 'left';
      } else if (item.dir === 'right') {
        nextPos.c = Math.min(challenge.cols - 1, curPos.c + 1);
        nextDir = 'right';
      }

      curDir = nextDir;
      setPlayerDir(curDir);

      // Check collision with obstacles
      const isObstacle = challenge.obstacles?.some(obs => areCoordsEqual(obs, nextPos));
      if (isObstacle) {
        sound.playError();
        failed = true;
        break;
      }

      curPos = nextPos;
      setPlayerPos(curPos);
      visited.push({ ...curPos });
      setVisitedCells([...visited]);
      sound.playStep();

      // Check if item collected
      if (challenge.targetCoords) {
        const reachedTarget = challenge.targetCoords.find(
          tc => areCoordsEqual(tc, curPos) && !collected.some(c => areCoordsEqual(c, tc))
        );
        if (reachedTarget) {
          collected.push(reachedTarget);
          setCollectedItems([...collected]);
          sound.playCollect();
        }
      }

      await new Promise(res => setTimeout(res, 280));
    }

    if (executionTokenRef.current !== token) return;

    setCurrentStepIndex(null);
    setIsExecuting(false);

    if (failed) return;

    // Evaluate Goal Condition for navigation
    let isSuccess = false;

    if (challenge.targetPos && challenge.targetCoords && challenge.targetCoords.length > 0) {
      // Must collect all targetCoords AND reach targetPos
      const allCollected = challenge.targetCoords.every(tc =>
        visited.some(v => areCoordsEqual(v, tc))
      );
      const atFinalPos = areCoordsEqual(curPos, challenge.targetPos);
      isSuccess = allCollected && atFinalPos;
    } else if (challenge.targetPos) {
      isSuccess = areCoordsEqual(curPos, challenge.targetPos);
    } else if (challenge.targetCoords && challenge.targetCoords.length > 0) {
      isSuccess = challenge.targetCoords.every(tc =>
        visited.some(v => areCoordsEqual(v, tc))
      );
    }

    if (isSuccess) {
      handleSuccess();
    } else {
      sound.playError();
    }
  };

  // Confirm selection for cell-pick, pixel-art, matrix-transform, and quiz
  const handleConfirmSelection = () => {
    let isSuccess = false;

    if (challenge.interactionType === 'cell-pick' || challenge.interactionType === 'matrix-transform') {
      const required = challenge.targetCoords || [];
      if (required.length === selectedCoords.length) {
        const allMatch = required.every(r => includesCoord(selectedCoords, r));
        if (allMatch) isSuccess = true;
      }
    } else if (challenge.interactionType === 'pixel-draw') {
      const required = challenge.targetCoords || [];
      const paintedKeys = Object.keys(paintedPixels);
      if (paintedKeys.length >= required.length) {
        const allPresent = required.every(r => !!paintedPixels[`${r.r},${r.c}`]);
        if (allPresent) isSuccess = true;
      }
    } else if (challenge.interactionType === 'coordinate-quiz') {
      if (quizSelectedRow !== null && quizSelectedCol !== null && challenge.targetCoords?.[0]) {
        const correct = challenge.targetCoords[0];
        if (correct.r === quizSelectedRow && correct.c === quizSelectedCol) {
          isSuccess = true;
        }
      }
    }

    if (isSuccess) {
      handleSuccess();
    } else {
      sound.playError();
    }
  };

  // Successful challenge resolution
  const handleSuccess = () => {
    let stars = 3;
    if (hintIndex >= 2) {
      stars = 1;
    } else if (hintIndex === 1) {
      stars = 2;
    }

    setStarsEarned(stars);
    setVictoryModalOpen(true);
    sound.playSuccess();
    triggerVictoryConfetti();

    const updated = saveLevelProgress(challenge.id, stars, program.length, hintIndex);
    setProgress(updated);
    onRefreshBadges();
  };

  // Progressive Hint
  const handleShowHint = () => {
    sound.playClick();
    if (hintIndex < challenge.hints.length) {
      setHintIndex(prev => prev + 1);
    }
    setShowHintModal(true);
  };

  const currentLevelProgress = progress[challenge.id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* 20 Levels Quick Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {challenge.moduleName}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Desafio {challenge.id} de 20
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (currentChallengeId > 1) {
                  sound.playClick();
                  setCurrentChallengeId(currentChallengeId - 1);
                }
              }}
              disabled={currentChallengeId === 1}
              className="cursor-pointer p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100"
              title="Desafio Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (currentChallengeId < 20) {
                  sound.playClick();
                  setCurrentChallengeId(currentChallengeId + 1);
                }
              }}
              disabled={currentChallengeId === 20}
              className="cursor-pointer p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100"
              title="Próximo Desafio"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 20-Level Circles carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CHALLENGES.map(lvl => {
            const isCurrent = lvl.id === currentChallengeId;
            const lvlProgress = progress[lvl.id];
            const isCompleted = !!lvlProgress?.completed;

            return (
              <button
                key={`lvl-pill-${lvl.id}`}
                onClick={() => {
                  sound.playClick();
                  setCurrentChallengeId(lvl.id);
                }}
                className={`
                  cursor-pointer shrink-0 w-8 h-8 rounded-lg flex flex-col items-center justify-center font-mono-numbers text-xs font-bold transition-all relative
                  ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300 ring-offset-1'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
                title={`${lvl.id}. ${lvl.title}`}
              >
                <span>{lvl.id}</span>
                {isCompleted && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Challenge Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          {/* Clean unboxed metadata with separators */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Módulo {challenge.module}</span>
            <span aria-hidden="true">·</span>
            <span>{challenge.moduleName}</span>
            <span aria-hidden="true">·</span>
            <span>Matriz {challenge.rows}x{challenge.cols}</span>
            {currentLevelProgress?.completed && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Concluído ({currentLevelProgress.stars}★)</span>
                </span>
              </>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {challenge.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            {challenge.description}
          </p>

          {challenge.coordinateTaskHint && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-3 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5" />
              <span>{challenge.coordinateTaskHint}</span>
            </div>
          )}
        </div>

        {/* BNCC badge and Timer */}
        <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col items-center md:items-end text-center md:text-right w-full">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
              Habilidade BNCC
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              EF04CO01 · Computação
            </span>
          </div>

          {/* Real-time timer and stuck helper button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-xl font-mono-numbers">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {Math.floor(timeSpentSeconds / 60).toString().padStart(2, '0')}:
                {(timeSpentSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {timeSpentSeconds >= 30 && (
              <button
                onClick={() => {
                  sound.playClick();
                  setShowStuckNudge(false);
                  setIsGradualCluesModalOpen(true);
                }}
                className="cursor-pointer text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 px-3 py-1.5 rounded-xl transition-all animate-pulse flex items-center gap-1 shadow-2xs"
                title="Pistas graduais de coordenadas desbloqueadas!"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                <span>Pistas (30s+)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Celebration Banner on ChallengeView */}
      {currentLevelProgress?.completed && (
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-300/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0 animate-celebrate-float">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                  Desafio Concluído com Sucesso!
                </span>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(s => (
                    <Star
                      key={`banner-star-${s}`}
                      className={`w-4 h-4 ${s <= (currentLevelProgress.stars || 0) ? 'fill-amber-400 text-amber-500' : 'text-slate-300 fill-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Parabéns! Você dominou as coordenadas deste desafio. Que tal soltar confetes ou avançar para o próximo?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                sound.playSuccess();
                triggerVictoryConfetti();
              }}
              className="cursor-pointer py-2 px-3.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
              title="Disparar chuva de confetes festiva!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Soltar Confetes! 🎉</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setVictoryModalOpen(true);
              }}
              className="cursor-pointer py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
            >
              Ver Detalhes BNCC
            </button>
          </div>
        </div>
      )}

      {/* Split Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Grid Board Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[420px]">
          <GridBoard
            challenge={challenge}
            playerPos={playerPos}
            playerDir={playerDir}
            visitedCells={visitedCells}
            selectedCoords={selectedCoords}
            onCellClick={handleCellClick}
            paintedPixels={paintedPixels}
            coordMode={coordMode}
            isExecuting={isExecuting}
            hintHighlightCoords={
              (activeClueStage === 3 && isGradualCluesModalOpen) || (unlockedClueStage === 3)
                ? (gradualClues[2]?.highlightCoords || challenge.targetCoords || (challenge.targetPos ? [challenge.targetPos] : []))
                : []
            }
            hintHighlightRow={
              isGradualCluesModalOpen && activeClueStage >= 1
                ? gradualClues[activeClueStage - 1]?.focusRow
                : undefined
            }
            hintHighlightCol={
              isGradualCluesModalOpen && activeClueStage >= 2
                ? gradualClues[activeClueStage - 1]?.focusCol
                : undefined
            }
          />
        </div>

        {/* Right: The Control Deck */}
        <div className="lg:col-span-5 flex flex-col">
          <ControlDeck
            challenge={challenge}
            program={program}
            setProgram={setProgram}
            isExecuting={isExecuting}
            currentStepIndex={currentStepIndex}
            onExecuteProgram={executeProgram}
            onStepForward={() => {}}
            onResetBoard={resetChallenge}
            onConfirmSelection={handleConfirmSelection}
            selectedCoords={selectedCoords}
            paintedCount={Object.keys(paintedPixels).length}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            quizSelectedRow={quizSelectedRow}
            setQuizSelectedRow={setQuizSelectedRow}
            quizSelectedCol={quizSelectedCol}
            setQuizSelectedCol={setQuizSelectedCol}
            coordMode={coordMode}
            onShowHint={handleShowHint}
            currentHintIndex={hintIndex}
            availableHintsCount={challenge.hints.length}
            isGradualAvailable={timeSpentSeconds >= 30}
            onOpenGradualClues={() => {
              sound.playClick();
              setShowStuckNudge(false);
              setIsGradualCluesModalOpen(true);
            }}
            secondsStuck={timeSpentSeconds}
          />
        </div>
      </div>

      {/* Floating 30-Second Stuck Nudge Helper */}
      {showStuckNudge && !victoryModalOpen && !isGradualCluesModalOpen && (
        <aside
          aria-label="Assistente de Coordenadas"
          className="fixed bottom-6 right-6 z-40 max-w-sm bg-white rounded-3xl border-2 border-amber-300 shadow-2xl p-5 animate-in slide-in-from-bottom-5 duration-300 ring-4 ring-amber-100/70"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
              🤖
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Assistente de Coordenadas (30s+)
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowStuckNudge(false);
                    setDismissedNudge(true);
                  }}
                  className="cursor-pointer text-slate-400 hover:text-slate-600 p-0.5"
                  title="Fechar aviso"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                Pensando há mais de 30 segundos?
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                As coordenadas da matriz têm uma lógica simples! Que tal liberar uma pista passo a passo para destravar o caminho?
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowStuckNudge(false);
                    setIsGradualCluesModalOpen(true);
                  }}
                  className="cursor-pointer py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                >
                  Ver Pistas Graduais
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowStuckNudge(false);
                    setDismissedNudge(true);
                  }}
                  className="cursor-pointer py-1.5 px-2.5 text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  Continuar Sozinho
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Gradual Clues Modal */}
      <GradualCluesModal
        isOpen={isGradualCluesModalOpen}
        onClose={() => setIsGradualCluesModalOpen(false)}
        challenge={challenge}
        clues={gradualClues}
        activeStage={activeClueStage}
        setActiveStage={setActiveClueStage}
        unlockedStage={unlockedClueStage}
        setUnlockedStage={setUnlockedClueStage}
        coordMode={coordMode}
        secondsStuck={timeSpentSeconds}
      />

      {/* Teacher Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 max-w-md w-full animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-base">
                Dica do Professor ({hintIndex}/{challenge.hints.length})
              </h3>
            </div>

            <div className="flex flex-col gap-2.5 my-4">
              {challenge.hints.slice(0, hintIndex).map((h, i) => (
                <div
                  key={`hint-${i}`}
                  className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 leading-relaxed font-medium"
                >
                  <span className="font-bold block mb-0.5 text-amber-950">
                    Dica {i + 1}:
                  </span>
                  {h}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              {hintIndex < challenge.hints.length ? (
                <button
                  onClick={() => setHintIndex(prev => prev + 1)}
                  className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Ver Próxima Dica
                </button>
              ) : (
                <span className="text-xs text-slate-400">Todas as dicas exibidas</span>
              )}

              <button
                onClick={() => setShowHintModal(false)}
                className="cursor-pointer py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory Celebration Modal */}
      <ChallengeModal
        challenge={challenge}
        starsEarned={starsEarned}
        isOpen={victoryModalOpen}
        onClose={() => setVictoryModalOpen(false)}
        onNextChallenge={() => {
          setVictoryModalOpen(false);
          if (currentChallengeId < 20) {
            setCurrentChallengeId(currentChallengeId + 1);
          }
        }}
        onReplay={() => {
          setVictoryModalOpen(false);
          resetChallenge();
        }}
        hasNext={currentChallengeId < 20}
      />
    </div>
  );
};
