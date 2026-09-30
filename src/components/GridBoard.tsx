import React, { useState } from 'react';
import { Coordinate, Direction, CoordinateDisplayMode, Challenge } from '../types/game';
import { formatCoordinate, ROW_LETTERS, areCoordsEqual } from '../utils/coordinates';
import { sound } from '../utils/audio';

interface GridBoardProps {
  challenge: Challenge;
  playerPos?: Coordinate;
  playerDir?: Direction;
  visitedCells?: Coordinate[];
  selectedCoords?: Coordinate[];
  onCellClick?: (coord: Coordinate) => void;
  paintedPixels?: Record<string, string>;
  coordMode: CoordinateDisplayMode;
  isExecuting?: boolean;
  hintHighlightCoords?: Coordinate[];
  hintHighlightRow?: number;
  hintHighlightCol?: number;
}

export const GridBoard: React.FC<GridBoardProps> = ({
  challenge,
  playerPos,
  playerDir = 'right',
  visitedCells = [],
  selectedCoords = [],
  onCellClick,
  paintedPixels = {},
  coordMode,
  isExecuting = false,
  hintHighlightCoords = [],
  hintHighlightRow,
  hintHighlightCol
}) => {
  const [hoveredCell, setHoveredCell] = useState<Coordinate | null>(null);

  const { rows, cols, obstacles = [], initialBoard } = challenge;

  // Rotation style for the character
  const getRotationDegree = (dir?: Direction) => {
    switch (dir) {
      case 'up':
        return -90;
      case 'down':
        return 90;
      case 'left':
        return 180;
      case 'right':
      default:
        return 0;
    }
  };

  // Helper to render character icon according to challenge theme
  const getCharacterIcon = () => {
    switch (challenge.theme) {
      case 'space':
        return '🚀';
      case 'farm':
        return '🚜';
      case 'city':
        return '🚁';
      case 'island':
        return '🧭';
      default:
        return '🤖';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Dynamic Hover Coordinate Indicator */}
      <div className="h-8 mb-2 flex items-center justify-center text-xs font-medium text-slate-600 transition-all">
        {hoveredCell ? (
          <span className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-3 py-1 rounded-md font-mono-numbers">
            {formatCoordinate(hoveredCell, coordMode, rows)}
          </span>
        ) : (
          <span className="text-slate-600 text-xs">Passe o mouse ou toque nos quadrados para inspecionar as coordenadas</span>
        )}
      </div>

      {/* Grid container with axes */}
      <div className="inline-block p-4 sm:p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
        {/* Top Header: Columns */}
        <div className="flex items-center mb-2">
          {/* Top-left corner spacer for row header */}
          <div className="w-8 sm:w-10 text-center text-xs font-semibold text-slate-500 font-mono-numbers">
            {coordMode === 'cartesian' ? 'Y \\ X' : 'L \\ C'}
          </div>

          {/* Column indicators */}
          <div
            className="grid gap-1.5 sm:gap-2"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: cols }, (_, c) => {
              const label = coordMode === 'cartesian' ? `X${c + 1}` : `C${c + 1}`;
              const isColHint = hintHighlightCol === c;
              return (
                <div
                  key={`col-head-${c}`}
                  className={`w-10 h-6 sm:w-14 sm:h-7 flex items-center justify-center text-xs font-semibold font-mono-numbers rounded transition-all ${
                    isColHint
                      ? 'bg-amber-400 text-slate-950 font-bold ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-900 animate-pulse'
                      : 'text-indigo-300 bg-slate-800/80'
                  }`}
                >
                  {isColHint ? `↓ ${label}` : label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rows and Grid Body */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {Array.from({ length: rows }, (_, r) => {
            // Row label according to mode
            let rowLabel = `L${r + 1}`;
            if (coordMode === 'alpha-num') {
              rowLabel = ROW_LETTERS[r] || `L${r + 1}`;
            } else if (coordMode === 'cartesian') {
              rowLabel = `Y${rows - r}`;
            }
            const isRowHint = hintHighlightRow === r;

            return (
              <div key={`row-${r}`} className="flex items-center">
                {/* Left Row Header */}
                <div
                  className={`w-8 sm:w-10 text-center text-xs font-semibold font-mono-numbers pr-2 transition-all ${
                    isRowHint
                      ? 'text-amber-400 font-bold scale-110 drop-shadow'
                      : 'text-indigo-300'
                  }`}
                >
                  {isRowHint ? `→ ${rowLabel}` : rowLabel}
                </div>

                {/* Row Cells */}
                <div
                  className="grid gap-1.5 sm:gap-2"
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: cols }, (_, c) => {
                    const currentCoord: Coordinate = { r, c };
                    const coordKey = `${r},${c}`;

                    // Check states
                    const isPlayerHere = playerPos && areCoordsEqual(playerPos, currentCoord);
                    const isObstacle = obstacles.some(obs => areCoordsEqual(obs, currentCoord));
                    const isVisited = visitedCells.some(v => areCoordsEqual(v, currentCoord));
                    const isSelected = selectedCoords.some(s => areCoordsEqual(s, currentCoord));
                    const isHintTarget = hintHighlightCoords.some(h => areCoordsEqual(h, currentCoord));

                    // Items on board
                    const boardItem = initialBoard?.items?.find(it => areCoordsEqual(it.pos, currentCoord));
                    const isTargetPixel = initialBoard?.targetPixels?.find(p => areCoordsEqual(p.pos, currentCoord));
                    const isInitialPixel = initialBoard?.pixels?.find(p => areCoordsEqual(p.pos, currentCoord));
                    const customPixelColor = paintedPixels[coordKey] || (isInitialPixel ? isInitialPixel.color : undefined);

                    // Goal pos
                    const isGoal = challenge.targetPos && areCoordsEqual(challenge.targetPos, currentCoord);
                    const isTargetCoord = challenge.targetCoords?.some(tc => areCoordsEqual(tc, currentCoord));

                    const canClick = !isExecuting && !!onCellClick;

                    return (
                      <button
                        key={`cell-${r}-${c}`}
                        type="button"
                        disabled={isExecuting}
                        onMouseEnter={() => setHoveredCell(currentCoord)}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => {
                          if (canClick && onCellClick) {
                            sound.playClick();
                            onCellClick(currentCoord);
                          }
                        }}
                        aria-label={`Coordenada ${formatCoordinate(currentCoord, coordMode, rows)}`}
                        style={
                          customPixelColor
                            ? { backgroundColor: customPixelColor }
                            : undefined
                        }
                        className={`
                          relative w-10 h-10 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center select-none
                          transition-all duration-150 text-base sm:text-2xl font-bold cursor-pointer
                          ${
                            customPixelColor
                              ? 'border-2 border-white/40 shadow-inner'
                              : isObstacle
                              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                              : isSelected
                              ? 'bg-indigo-500/30 border-2 border-indigo-400 shadow-md text-white'
                              : isHintTarget
                              ? 'bg-amber-500/25 border-2 border-amber-400 ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-900 animate-pulse'
                              : isGoal || isTargetCoord
                              ? 'bg-indigo-950/60 border border-indigo-500/50 hover:border-indigo-400'
                              : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60'
                          }
                          ${hoveredCell && areCoordsEqual(hoveredCell, currentCoord) ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 z-10' : ''}
                        `}
                      >
                        {/* Radar indicator if active hint target */}
                        {isHintTarget && !customPixelColor && !boardItem && !isPlayerHere && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-amber-300 text-xs sm:text-sm animate-ping">🎯</span>
                          </div>
                        )}
                        {/* Target pixel outline if guided pixel art */}
                        {isTargetPixel && !customPixelColor && (
                          <div className="absolute inset-1 rounded-sm border border-dashed border-red-400/40 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                          </div>
                        )}

                        {/* Visited path trail indicator */}
                        {isVisited && !isPlayerHere && !customPixelColor && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 animate-pulse" />
                          </div>
                        )}

                        {/* Obstacle Icon */}
                        {isObstacle && (
                          <span className="filter drop-shadow select-none">
                            {challenge.theme === 'farm' ? '🪵' : challenge.theme === 'space' ? '🪨' : '🧱'}
                          </span>
                        )}

                        {/* Board Item */}
                        {boardItem && !isPlayerHere && (
                          <span className="filter drop-shadow text-lg sm:text-2xl select-none animate-pulse-subtle">
                            {boardItem.icon}
                          </span>
                        )}

                        {/* Goal indicator if not board item */}
                        {isGoal && !boardItem && !isPlayerHere && (
                          <span className="text-amber-400 text-lg sm:text-2xl animate-bounce">
                            ⭐
                          </span>
                        )}

                        {/* Selection checkmark badge */}
                        {isSelected && !customPixelColor && (
                          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center text-[9px] text-white">
                            ✓
                          </div>
                        )}

                        {/* Character Player Avatar with rotation */}
                        {isPlayerHere && (
                          <div
                            className="relative z-20 transition-transform duration-200 filter drop-shadow-md text-xl sm:text-3xl"
                            style={{
                              transform: `rotate(${getRotationDegree(playerDir)}deg)`
                            }}
                          >
                            {getCharacterIcon()}
                          </div>
                        )}

                        {/* Subtle coordinate number in bottom corner for kids learning */}
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-slate-500/70 select-none pointer-events-none">
                          {r + 1},{c + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
