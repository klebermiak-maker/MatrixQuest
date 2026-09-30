import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Trash2, 
  Eraser, 
  Copy, 
  Check, 
  Sparkles,
  Grid as GridIcon,
  Compass
} from 'lucide-react';
import { Coordinate, Direction, CoordinateDisplayMode } from '../types/game';
import { formatCoordinate, areCoordsEqual, ROW_LETTERS } from '../utils/coordinates';
import { sound } from '../utils/audio';

interface FreeSandboxProps {
  coordMode: CoordinateDisplayMode;
}

export const FreeSandbox: React.FC<FreeSandboxProps> = ({ coordMode }) => {
  const [gridSize, setGridSize] = useState<number>(6);
  const [sandboxMode, setSandboxMode] = useState<'pixel' | 'robot'>('robot');

  // Robot State
  const [robotPos, setRobotPos] = useState<Coordinate>({ r: 0, c: 0 });
  const [robotDir, setRobotDir] = useState<Direction>('right');
  const [obstacles, setObstacles] = useState<Coordinate[]>([]);
  const [targets, setTargets] = useState<Coordinate[]>([]);
  const [visited, setVisited] = useState<Coordinate[]>([]);
  const [commands, setCommands] = useState<('up' | 'down' | 'left' | 'right')[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null);

  // Pixel State
  const [paintedPixels, setPaintedPixels] = useState<Record<string, string>>({});
  const [activeColor, setActiveColor] = useState<string>('#3B82F6');
  const [copied, setCopied] = useState(false);

  // Editing tool for robot mode
  const [robotTool, setRobotTool] = useState<'move-start' | 'add-obstacle' | 'add-star'>('add-star');

  // Handle cell click
  const handleCellClick = (coord: Coordinate) => {
    sound.playClick();
    const key = `${coord.r},${coord.c}`;

    if (sandboxMode === 'pixel') {
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
    } else {
      // Robot mode
      if (robotTool === 'move-start') {
        setRobotPos(coord);
        setObstacles(prev => prev.filter(o => !areCoordsEqual(o, coord)));
        setTargets(prev => prev.filter(t => !areCoordsEqual(t, coord)));
      } else if (robotTool === 'add-obstacle') {
        if (areCoordsEqual(robotPos, coord)) return;
        setTargets(prev => prev.filter(t => !areCoordsEqual(t, coord)));
        setObstacles(prev => {
          if (prev.some(o => areCoordsEqual(o, coord))) {
            return prev.filter(o => !areCoordsEqual(o, coord));
          }
          return [...prev, coord];
        });
      } else if (robotTool === 'add-star') {
        if (areCoordsEqual(robotPos, coord)) return;
        setObstacles(prev => prev.filter(o => !areCoordsEqual(o, coord)));
        setTargets(prev => {
          if (prev.some(t => areCoordsEqual(t, coord))) {
            return prev.filter(t => !areCoordsEqual(t, coord));
          }
          return [...prev, coord];
        });
      }
    }
  };

  // Add navigation command
  const addCommand = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (isExecuting) return;
    sound.playClick();
    setCommands(prev => [...prev, dir]);
  };

  // Execute robot program
  const runRobotProgram = async () => {
    if (commands.length === 0 || isExecuting) return;
    setIsExecuting(true);
    let curPos = { ...robotPos };
    const curVisited: Coordinate[] = [{ ...curPos }];
    setVisited(curVisited);

    for (let i = 0; i < commands.length; i++) {
      setCurrentStepIdx(i);
      const cmd = commands[i];
      let nextPos = { ...curPos };
      let nextDir = robotDir;

      if (cmd === 'up') {
        nextPos.r = Math.max(0, curPos.r - 1);
        nextDir = 'up';
      } else if (cmd === 'down') {
        nextPos.r = Math.min(gridSize - 1, curPos.r + 1);
        nextDir = 'down';
      } else if (cmd === 'left') {
        nextPos.c = Math.max(0, curPos.c - 1);
        nextDir = 'left';
      } else if (cmd === 'right') {
        nextPos.c = Math.min(gridSize - 1, curPos.c + 1);
        nextDir = 'right';
      }

      setRobotDir(nextDir);

      // Check collision
      const hitObstacle = obstacles.some(obs => areCoordsEqual(obs, nextPos));
      if (hitObstacle) {
        sound.playError();
        break;
      }

      curPos = nextPos;
      setRobotPos(curPos);
      curVisited.push({ ...curPos });
      setVisited([...curVisited]);
      sound.playStep();

      // Check target collect
      const hitTarget = targets.some(t => areCoordsEqual(t, curPos));
      if (hitTarget) {
        sound.playCollect();
      }

      await new Promise(res => setTimeout(res, 280));
    }

    setCurrentStepIdx(null);
    setIsExecuting(false);
  };

  // Reset sandbox
  const resetRobot = () => {
    setRobotPos({ r: 0, c: 0 });
    setRobotDir('right');
    setVisited([]);
    setCurrentStepIdx(null);
  };

  const clearEverything = () => {
    sound.playClick();
    setRobotPos({ r: 0, c: 0 });
    setRobotDir('right');
    setObstacles([]);
    setTargets([]);
    setVisited([]);
    setCommands([]);
    setPaintedPixels({});
  };

  // Export coordinates text
  const exportCoordinatesText = () => {
    if (sandboxMode === 'pixel') {
      const keys = Object.keys(paintedPixels);
      if (keys.length === 0) return 'Nenhum pixel colorido ainda.';
      return keys.map(k => {
        const [r, c] = k.split(',').map(Number);
        return `${formatCoordinate({ r, c }, coordMode, gridSize)}: Cor ${paintedPixels[k]}`;
      }).join('\n');
    } else {
      let text = `Posição Inicial do Robô: ${formatCoordinate(robotPos, coordMode, gridSize)}\n`;
      text += `Estrelas: ${targets.map(t => formatCoordinate(t, coordMode, gridSize)).join(', ') || 'Nenhuma'}\n`;
      text += `Obstáculos: ${obstacles.map(o => formatCoordinate(o, coordMode, gridSize)).join(', ') || 'Nenhum'}\n`;
      text += `Programa (${commands.length} passos): ${commands.join(' → ')}`;
      return text;
    }
  };

  const copyToClipboard = () => {
    sound.playClick();
    navigator.clipboard.writeText(exportCoordinatesText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Sandbox Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Espaço Criativo · Habilidade EF04CO01
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Laboratório Livre da Matriz
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Crie seus próprios mapas de robôs ou desenhos de pixel art! Observe como cada componente fica armazenado em sua coordenada exata.
          </p>
        </div>

        {/* Sandbox Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSandboxMode('robot')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              sandboxMode === 'robot' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Navegação de Robô</span>
          </button>

          <button
            onClick={() => setSandboxMode('pixel')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              sandboxMode === 'pixel' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pixel Art & Cores</span>
          </button>
        </div>
      </div>

      {/* Grid Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">Tamanho da Matriz:</span>
          {[4, 5, 6, 7, 8].map(size => (
            <button
              key={`size-${size}`}
              onClick={() => {
                sound.playClick();
                setGridSize(size);
                clearEverything();
              }}
              className={`cursor-pointer px-2.5 py-1 rounded-md font-mono-numbers font-medium transition-colors ${
                gridSize === size
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        <button
          onClick={clearEverything}
          className="cursor-pointer text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar Tudo</span>
        </button>
      </div>

      {/* Main Sandbox Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Grid */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="inline-block p-4 sm:p-5 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
            {/* Column Headers */}
            <div className="flex items-center mb-2">
              <div className="w-7 sm:w-9 text-center text-xs font-semibold text-slate-500 font-mono-numbers">
                L\C
              </div>
              <div
                className="grid gap-1 sm:gap-1.5"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: gridSize }, (_, c) => (
                  <div
                    key={`c-head-${c}`}
                    className="w-9 h-6 sm:w-11 sm:h-6 flex items-center justify-center text-[11px] font-semibold text-indigo-300 font-mono-numbers bg-slate-800/80 rounded"
                  >
                    C{c + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              {Array.from({ length: gridSize }, (_, r) => (
                <div key={`r-row-${r}`} className="flex items-center">
                  <div className="w-7 sm:w-9 text-center text-xs font-semibold text-indigo-300 font-mono-numbers pr-1.5">
                    L{r + 1}
                  </div>

                  <div
                    className="grid gap-1 sm:gap-1.5"
                    style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: gridSize }, (_, c) => {
                      const coord: Coordinate = { r, c };
                      const key = `${r},${c}`;
                      const isRobot = sandboxMode === 'robot' && areCoordsEqual(robotPos, coord);
                      const isObs = sandboxMode === 'robot' && obstacles.some(o => areCoordsEqual(o, coord));
                      const isTgt = sandboxMode === 'robot' && targets.some(t => areCoordsEqual(t, coord));
                      const isVst = sandboxMode === 'robot' && visited.some(v => areCoordsEqual(v, coord));
                      const pixelColor = sandboxMode === 'pixel' ? paintedPixels[key] : undefined;

                      return (
                        <button
                          key={`s-cell-${r}-${c}`}
                          type="button"
                          onClick={() => handleCellClick(coord)}
                          style={pixelColor ? { backgroundColor: pixelColor } : undefined}
                          className={`
                            relative w-9 h-9 sm:w-11 sm:h-11 rounded-md flex items-center justify-center text-sm sm:text-base cursor-pointer
                            transition-all select-none border
                            ${
                              pixelColor
                                ? 'border-white/30 shadow-inner'
                                : isObs
                                ? 'bg-slate-800 border-slate-700'
                                : isTgt
                                ? 'bg-amber-950/40 border-amber-600/50'
                                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                            }
                          `}
                          title={formatCoordinate(coord, coordMode, gridSize)}
                        >
                          {isRobot && <span className="text-xl sm:text-2xl filter drop-shadow">🤖</span>}
                          {isObs && !isRobot && <span>🧱</span>}
                          {isTgt && !isRobot && <span className="animate-pulse">⭐</span>}
                          {isVst && !isRobot && !isObs && !isTgt && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400/80" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Controls & Coordinate Inspector Deck */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {sandboxMode === 'robot' ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ferramentas do Tabuleiro
              </span>

              {/* Tool selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setRobotTool('move-start')}
                  className={`cursor-pointer py-2 px-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-colors ${
                    robotTool === 'move-start' ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-lg">🤖</span>
                  <span>Mover Robô</span>
                </button>

                <button
                  onClick={() => setRobotTool('add-star')}
                  className={`cursor-pointer py-2 px-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-colors ${
                    robotTool === 'add-star' ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-lg">⭐</span>
                  <span>Pôr Estrela</span>
                </button>

                <button
                  onClick={() => setRobotTool('add-obstacle')}
                  className={`cursor-pointer py-2 px-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-colors ${
                    robotTool === 'add-obstacle' ? 'bg-slate-100 border-slate-300 text-slate-800 font-semibold' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-lg">🧱</span>
                  <span>Pôr Parede</span>
                </button>
              </div>

              {/* Command Sequence Panel */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Algoritmo ({commands.length} passos):</span>
                  {commands.length > 0 && (
                    <button
                      onClick={() => setCommands([])}
                      className="cursor-pointer text-slate-500 hover:text-rose-600 text-xs"
                    >
                      Limpar Passos
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[48px]">
                  {commands.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Adicione comandos abaixo</span>
                  ) : (
                    commands.map((cmd, idx) => (
                      <span
                        key={`cmd-${idx}`}
                        className={`text-xs px-2 py-0.5 rounded font-mono-numbers font-medium ${
                          currentStepIdx === idx ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        {cmd === 'up' && '↑ Cima'}
                        {cmd === 'down' && '↓ Baixo'}
                        {cmd === 'left' && '← Esq'}
                        {cmd === 'right' && '→ Dir'}
                      </span>
                    ))
                  )}
                </div>

                {/* D-Pad Buttons */}
                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  <button
                    onClick={() => addCommand('up')}
                    className="cursor-pointer py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Cima</span>
                  </button>
                  <button
                    onClick={() => addCommand('down')}
                    className="cursor-pointer py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Baixo</span>
                  </button>
                  <button
                    onClick={() => addCommand('left')}
                    className="cursor-pointer py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Esq</span>
                  </button>
                  <button
                    onClick={() => addCommand('right')}
                    className="cursor-pointer py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Dir</span>
                  </button>
                </div>

                {/* Execution bar */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={runRobotProgram}
                    disabled={isExecuting || commands.length === 0}
                    className="cursor-pointer py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Executar</span>
                  </button>

                  <button
                    onClick={resetRobot}
                    disabled={isExecuting}
                    className="cursor-pointer py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resetar</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paleta de Cores de Pixel Art
              </span>

              <div className="flex items-center justify-center gap-3 py-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                {[
                  { label: 'Azul', color: '#3B82F6' },
                  { label: 'Vermelho', color: '#EF4444' },
                  { label: 'Verde', color: '#10B981' },
                  { label: 'Amarelo', color: '#FACC15' },
                  { label: 'Roxo', color: '#8B5CF6' },
                  { label: 'Laranja', color: '#F97316' },
                  { label: 'Preto', color: '#0F172A' }
                ].map(swatch => (
                  <button
                    key={swatch.color}
                    onClick={() => {
                      sound.playClick();
                      setActiveColor(swatch.color);
                    }}
                    className={`cursor-pointer w-8 h-8 rounded-full border-2 transition-transform ${
                      activeColor === swatch.color ? 'scale-125 border-slate-900 shadow-md ring-2 ring-indigo-400' : 'border-white hover:scale-110 shadow-2xs'
                    }`}
                    style={{ backgroundColor: swatch.color }}
                  />
                ))}

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveColor('');
                  }}
                  className={`cursor-pointer w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white text-slate-500 transition-transform ${
                    activeColor === '' ? 'scale-125 border-slate-900 shadow-md ring-2 ring-indigo-400' : 'border-slate-300 hover:scale-110'
                  }`}
                  title="Borracha"
                >
                  <Eraser className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Total de pixels: <strong>{Object.keys(paintedPixels).length}</strong></span>
                <button
                  onClick={() => setPaintedPixels({})}
                  className="cursor-pointer text-rose-600 hover:underline"
                >
                  Limpar Desenho
                </button>
              </div>
            </div>
          )}

          {/* Coordinate Data Output & Export */}
          <div className="bg-slate-900 text-slate-200 rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Mapeamento das Coordenadas (Computação)
              </span>

              <button
                onClick={copyToClipboard}
                className="cursor-pointer text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <pre className="text-xs font-mono bg-slate-950 p-3 rounded-xl max-h-36 overflow-y-auto whitespace-pre-wrap text-slate-300 border border-slate-800">
              {exportCoordinatesText()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
