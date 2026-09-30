export type Coordinate = {
  r: number; // 0-indexed row
  c: number; // 0-indexed col
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type CoordinateDisplayMode = 'row-col' | 'alpha-num' | 'cartesian';

export type ChallengeCategory = 
  | 'foundations'   // Módulo 1: Linhas, Colunas e Mapas
  | 'pixel-art'     // Módulo 2: Manipulação de Imagens Digitais e Matrizes
  | 'algorithms'    // Módulo 3: Navegação Autônoma, Algoritmos e Loops
  | 'real-world';   // Módulo 4: Aplicações do Mundo Real e Exploração Espacial

export type InteractionType = 
  | 'navigation'       // Program steps to navigate a character to target(s)
  | 'cell-pick'        // Click target coordinates matching criteria
  | 'pixel-draw'       // Paint pixels in a matrix to match target drawing
  | 'matrix-transform' // Shift / mirror / repair coordinates
  | 'coordinate-quiz'; // Answer what coordinate an item is at

export type CommandType = 
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'action'
  | 'loop_repeat';

export interface CommandStep {
  id: string;
  type: CommandType;
  repeatCount?: number;
  innerCommands?: CommandType[];
}

export interface GridCell {
  r: number;
  c: number;
  type?: 'empty' | 'wall' | 'water' | 'furniture' | 'rock' | 'fire' | 'dry-soil';
  hasItem?: boolean;
  itemIcon?: string;
  itemColor?: string;
  itemName?: string;
  pixelColor?: string;
  targetPixelColor?: string;
  isGoal?: boolean;
  isCleaned?: boolean;
  isVisited?: boolean;
}

export interface GradualClue {
  stage: 1 | 2 | 3;
  stageName: string;
  explanation: string;
  focusRow?: number;
  focusCol?: number;
  highlightCoords?: Coordinate[];
}

export interface Challenge {
  id: number;
  title: string;
  module: number;
  moduleName: string;
  category: ChallengeCategory;
  interactionType: InteractionType;
  theme: 'island' | 'cinema' | 'library' | 'pixel' | 'lab' | 'city' | 'space' | 'farm';
  description: string;
  bnccGoal: string; // Explicação pedagógica simplificada para o 4º ano
  rows: number;
  cols: number;
  startPos?: Coordinate;
  startDir?: Direction;
  targetPos?: Coordinate;
  targetCoords?: Coordinate[];
  obstacles?: Coordinate[];
  initialBoard?: {
    walls?: Coordinate[];
    items?: { pos: Coordinate; name: string; icon: string; color?: string }[];
    pixels?: { pos: Coordinate; color: string }[];
    targetPixels?: { pos: Coordinate; color: string }[];
  };
  allowedCommands?: CommandType[];
  maxCommands?: number;
  hints: string[];
  gradualClues?: GradualClue[];
  coordinateTaskHint?: string;
  successMessage: string;
  realWorldConnection: string;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number;
  bestCommandsCount?: number;
  hintsUsed: number;
  completedAt?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  reqText: string;
}
