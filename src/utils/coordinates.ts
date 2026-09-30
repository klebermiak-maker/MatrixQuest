import { Coordinate, CoordinateDisplayMode } from '../types/game';

export const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/**
 * Formats a 0-indexed coordinate into a readable string according to user mode
 */
export function formatCoordinate(
  coord: Coordinate,
  mode: CoordinateDisplayMode = 'row-col',
  totalRows: number = 5
): string {
  const rowNumber = coord.r + 1;
  const colNumber = coord.c + 1;

  switch (mode) {
    case 'alpha-num': {
      const letter = ROW_LETTERS[coord.r] || `L${rowNumber}`;
      return `${letter}${colNumber}`;
    }
    case 'cartesian': {
      // Cartesian standard: X = horizontal (col), Y = vertical (from bottom up)
      const cartX = colNumber;
      const cartY = totalRows - coord.r;
      return `(X: ${cartX}, Y: ${cartY})`;
    }
    case 'row-col':
    default:
      return `(Linha ${rowNumber}, Coluna ${colNumber})`;
  }
}

/**
 * Short representation for buttons or small chips
 */
export function formatCoordinateShort(
  coord: Coordinate,
  mode: CoordinateDisplayMode = 'row-col',
  totalRows: number = 5
): string {
  const rowNumber = coord.r + 1;
  const colNumber = coord.c + 1;

  switch (mode) {
    case 'alpha-num':
      return `${ROW_LETTERS[coord.r] || `L${rowNumber}`}${colNumber}`;
    case 'cartesian':
      return `(${colNumber}, ${totalRows - coord.r})`;
    case 'row-col':
    default:
      return `[L${rowNumber}, C${colNumber}]`;
  }
}

export function areCoordsEqual(a: Coordinate, b: Coordinate): boolean {
  return a.r === b.r && a.c === b.c;
}

export function includesCoord(list: Coordinate[], target: Coordinate): boolean {
  return list.some(item => areCoordsEqual(item, target));
}

export function getManhattanDistance(a: Coordinate, b: Coordinate): number {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}
