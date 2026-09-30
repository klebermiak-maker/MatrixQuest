import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Repeat, 
  CheckCircle, 
  Lightbulb,
  StepForward,
  Eraser,
  Sparkles
} from 'lucide-react';
import { Challenge, CommandStep, CommandType, Coordinate, CoordinateDisplayMode } from '../types/game';
import { formatCoordinate } from '../utils/coordinates';
import { sound } from '../utils/audio';

interface ControlDeckProps {
  challenge: Challenge;
  program: CommandStep[];
  setProgram: React.Dispatch<React.SetStateAction<CommandStep[]>>;
  isExecuting: boolean;
  currentStepIndex: number | null;
  onExecuteProgram: () => void;
  onStepForward: () => void;
  onResetBoard: () => void;
  onConfirmSelection: () => void;
  selectedCoords: Coordinate[];
  paintedCount: number;
  activeColor: string;
  setActiveColor: (color: string) => void;
  quizSelectedRow: number | null;
  setQuizSelectedRow: (row: number | null) => void;
  quizSelectedCol: number | null;
  setQuizSelectedCol: (col: number | null) => void;
  coordMode: CoordinateDisplayMode;
  onShowHint: () => void;
  currentHintIndex: number;
  availableHintsCount: number;
  isGradualAvailable?: boolean;
  onOpenGradualClues?: () => void;
  secondsStuck?: number;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  challenge,
  program,
  setProgram,
  isExecuting,
  currentStepIndex,
  onExecuteProgram,
  onStepForward,
  onResetBoard,
  onConfirmSelection,
  selectedCoords,
  paintedCount,
  activeColor,
  setActiveColor,
  quizSelectedRow,
  setQuizSelectedRow,
  quizSelectedCol,
  setQuizSelectedCol,
  coordMode,
  onShowHint,
  currentHintIndex,
  availableHintsCount,
  isGradualAvailable = false,
  onOpenGradualClues,
  secondsStuck = 0
}) => {
  const [repeatTimes, setRepeatTimes] = useState<number>(3);
  const [repeatCommand, setRepeatCommand] = useState<CommandType>('right');

  const addCommand = (type: CommandType) => {
    if (isExecuting) return;
    if (challenge.maxCommands && program.length >= challenge.maxCommands) {
      sound.playError();
      return;
    }
    sound.playClick();
    setProgram(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        type
      }
    ]);
  };

  const addLoopCommand = () => {
    if (isExecuting) return;
    if (challenge.maxCommands && program.length >= challenge.maxCommands) {
      sound.playError();
      return;
    }
    sound.playClick();
    setProgram(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'loop_repeat',
        repeatCount: repeatTimes,
        innerCommands: [repeatCommand]
      }
    ]);
  };

  const removeLastCommand = () => {
    if (isExecuting || program.length === 0) return;
    sound.playClick();
    setProgram(prev => prev.slice(0, -1));
  };

  const clearProgram = () => {
    if (isExecuting || program.length === 0) return;
    sound.playClick();
    setProgram([]);
  };

  // Label for direction commands in kid-friendly Portuguese
  const getCommandLabel = (type: CommandType) => {
    switch (type) {
      case 'up':
        return 'Subir (Norte)';
      case 'down':
        return 'Descer (Sul)';
      case 'left':
        return 'Esquerda (Oeste)';
      case 'right':
        return 'Direita (Leste)';
      case 'action':
        return 'Ação';
      case 'loop_repeat':
        return 'Repetir';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
      {/* Top Deck: Action Objective & Hint */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {challenge.interactionType === 'navigation'
              ? 'Painel de Algoritmo'
              : challenge.interactionType === 'pixel-draw'
              ? 'Paleta de Imagem Digital'
              : challenge.interactionType === 'coordinate-quiz'
              ? 'Identificação de Coordenada'
              : 'Seleção em Matriz'}
          </span>
        </div>

        {/* Hint buttons */}
        <div className="flex items-center gap-2">
          {isGradualAvailable && onOpenGradualClues && (
            <button
              onClick={onOpenGradualClues}
              className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 px-3 py-1.5 rounded-lg transition-all animate-pulse shadow-xs"
              title="Pistas graduais de coordenadas desbloqueadas!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>Pistas de Coordenadas (30s)</span>
            </button>
          )}

          <button
            onClick={onShowHint}
            className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {currentHintIndex === 0
                ? 'Dica do Professor'
                : `Dica (${currentHintIndex}/${availableHintsCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* Mode 1: Navigation Programming */}
      {challenge.interactionType === 'navigation' && (
        <div className="flex flex-col gap-4">
          {/* Program sequence queue */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[72px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
              <span>Sequência de Comandos ({program.length}{challenge.maxCommands ? ` / máx ${challenge.maxCommands}` : ''}):</span>
              {program.length > 0 && !isExecuting && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={removeLastCommand}
                    className="cursor-pointer hover:text-slate-800 transition-colors"
                    title="Desfazer último comando"
                  >
                    Desfazer
                  </button>
                  <button
                    onClick={clearProgram}
                    className="cursor-pointer hover:text-rose-600 transition-colors flex items-center gap-0.5"
                    title="Limpar todos"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpar</span>
                  </button>
                </div>
              )}
            </div>

            {/* List of blocks */}
            {program.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">
                Clique nos botões de direção abaixo para montar o algoritmo do robô!
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1 max-h-32">
                {program.map((step, idx) => {
                  const isActive = currentStepIndex === idx;
                  return (
                    <div
                      key={step.id}
                      className={`
                        text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 border transition-all duration-150
                        ${
                          isActive
                            ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-md scale-105 font-bold ring-2 ring-amber-300'
                            : step.type === 'loop_repeat'
                            ? 'bg-purple-100 border-purple-200 text-purple-800'
                            : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                        }
                      `}
                    >
                      <span className="text-[10px] text-slate-600 font-mono-numbers">
                        #{idx + 1}
                      </span>
                      {step.type === 'up' && <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />}
                      {step.type === 'down' && <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />}
                      {step.type === 'left' && <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />}
                      {step.type === 'right' && <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />}
                      {step.type === 'action' && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                      {step.type === 'loop_repeat' && (
                        <span className="flex items-center gap-1 font-mono-numbers">
                          <Repeat className="w-3 h-3" />
                          <span>{step.repeatCount}x {step.innerCommands?.[0] === 'right' ? '→' : step.innerCommands?.[0] === 'left' ? '←' : '↑'}</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* D-Pad Command buttons */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => addCommand('up')}
              disabled={isExecuting}
              className="cursor-pointer w-28 py-2.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 rounded-xl border border-indigo-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Cima</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addCommand('left')}
                disabled={isExecuting}
                className="cursor-pointer w-28 py-2.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 rounded-xl border border-indigo-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Esquerda</span>
              </button>

              <button
                onClick={() => addCommand('right')}
                disabled={isExecuting}
                className="cursor-pointer w-28 py-2.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 rounded-xl border border-indigo-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Direita</span>
              </button>
            </div>

            <button
              onClick={() => addCommand('down')}
              disabled={isExecuting}
              className="cursor-pointer w-28 py-2.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 rounded-xl border border-indigo-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
            >
              <ArrowDown className="w-4 h-4" />
              <span>Baixo</span>
            </button>
          </div>

          {/* Loop command option if allowed */}
          {challenge.allowedCommands?.includes('loop_repeat') && (
            <div className="flex items-center justify-between p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 gap-2">
              <div className="flex items-center gap-1.5">
                <Repeat className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Comando Loop:</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={repeatTimes}
                  onChange={e => setRepeatTimes(Number(e.target.value))}
                  disabled={isExecuting}
                  className="bg-white border border-purple-300 rounded px-2 py-1 font-mono-numbers text-xs"
                >
                  <option value={2}>Repetir 2x</option>
                  <option value={3}>Repetir 3x</option>
                  <option value={4}>Repetir 4x</option>
                </select>
                <select
                  value={repeatCommand}
                  onChange={e => setRepeatCommand(e.target.value as CommandType)}
                  disabled={isExecuting}
                  className="bg-white border border-purple-300 rounded px-2 py-1 text-xs"
                >
                  <option value="right">Direita (→)</option>
                  <option value="left">Esquerda (←)</option>
                  <option value="up">Cima (↑)</option>
                  <option value="down">Baixo (↓)</option>
                </select>
                <button
                  onClick={addLoopCommand}
                  disabled={isExecuting}
                  className="cursor-pointer px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors"
                >
                  + Adicionar Loop
                </button>
              </div>
            </div>
          )}

          {/* Execution action bar */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onExecuteProgram}
              disabled={isExecuting || program.length === 0}
              className="cursor-pointer col-span-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isExecuting ? 'Executando...' : 'Executar Programa'}</span>
            </button>

            <button
              onClick={onResetBoard}
              disabled={isExecuting}
              className="cursor-pointer py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              title="Reiniciar posição do robô"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Pixel Draw Palette */}
      {challenge.interactionType === 'pixel-draw' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Pixels coloridos: <strong className="font-mono-numbers">{paintedCount}</strong></span>
            <span>Meta: {challenge.targetCoords?.length || 0} pixels</span>
          </div>

          {/* Color swatches */}
          <div className="flex items-center justify-center gap-3 py-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
            {[
              { label: 'Vermelho', color: '#EF4444' },
              { label: 'Azul', color: '#3B82F6' },
              { label: 'Amarelo', color: '#FACC15' },
              { label: 'Roxo', color: '#A855F7' },
              { label: 'Preto', color: '#1E293B' }
            ].map(swatch => (
              <button
                key={swatch.color}
                onClick={() => {
                  sound.playClick();
                  setActiveColor(swatch.color);
                }}
                className={`cursor-pointer w-8 h-8 rounded-full border-2 transition-transform ${
                  activeColor === swatch.color ? 'scale-120 border-slate-900 shadow-md ring-2 ring-indigo-400' : 'border-white shadow-2xs hover:scale-110'
                }`}
                style={{ backgroundColor: swatch.color }}
                title={`Pincel ${swatch.label}`}
              />
            ))}

            <button
              onClick={() => {
                sound.playClick();
                setActiveColor('');
              }}
              className={`cursor-pointer w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white text-slate-500 transition-transform ${
                activeColor === '' ? 'scale-120 border-slate-900 shadow-md ring-2 ring-indigo-400' : 'border-slate-300 hover:scale-110'
              }`}
              title="Borracha (apagar pixel)"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onConfirmSelection}
              className="cursor-pointer py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verificar Desenho</span>
            </button>

            <button
              onClick={onResetBoard}
              className="cursor-pointer py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Tela</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Cell Pick or Matrix Transform */}
      {(challenge.interactionType === 'cell-pick' || challenge.interactionType === 'matrix-transform') && (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[60px]">
            <p className="text-xs text-slate-600 font-medium mb-1.5">
              Coordenadas Selecionadas ({selectedCoords.length} / {challenge.targetCoords?.length || 1}):
            </p>
            {selectedCoords.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Clique nos quadrados da matriz acima para marcar sua resposta!
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {selectedCoords.map((coord, idx) => (
                  <span
                    key={`sel-${idx}`}
                    className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono-numbers font-medium"
                  >
                    {formatCoordinate(coord, coordMode, challenge.rows)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onConfirmSelection}
              disabled={selectedCoords.length === 0}
              className="cursor-pointer py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirmar Seleção</span>
            </button>

            <button
              onClick={onResetBoard}
              className="cursor-pointer py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Desmarcar Tudo</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 4: Coordinate Quiz */}
      {challenge.interactionType === 'coordinate-quiz' && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-600">
            Escolha o número da <strong>Linha</strong> e da <strong>Coluna</strong> onde o item está localizado:
          </p>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Qual Linha?
              </label>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: challenge.rows }, (_, r) => (
                  <button
                    key={`q-row-${r}`}
                    onClick={() => {
                      sound.playClick();
                      setQuizSelectedRow(r);
                    }}
                    className={`cursor-pointer px-2.5 py-1 rounded text-xs font-mono-numbers font-medium transition-colors ${
                      quizSelectedRow === r
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    L{r + 1}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Qual Coluna?
              </label>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: challenge.cols }, (_, c) => (
                  <button
                    key={`q-col-${c}`}
                    onClick={() => {
                      sound.playClick();
                      setQuizSelectedCol(c);
                    }}
                    className={`cursor-pointer px-2.5 py-1 rounded text-xs font-mono-numbers font-medium transition-colors ${
                      quizSelectedCol === c
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    C{c + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-mono-numbers">
              {quizSelectedRow !== null && quizSelectedCol !== null ? (
                formatCoordinate({ r: quizSelectedRow, c: quizSelectedCol }, coordMode, challenge.rows)
              ) : (
                'Nenhuma coordenada escolhida'
              )}
            </span>

            <button
              onClick={onConfirmSelection}
              disabled={quizSelectedRow === null || quizSelectedCol === null}
              className="cursor-pointer py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirmar Resposta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
