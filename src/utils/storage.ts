import { LevelProgress, CoordinateDisplayMode } from '../types/game';
import { BADGES_LIST } from '../data/challenges';

const STORAGE_KEY_PROGRESS = 'matrixquest_progress_v1';
const STORAGE_KEY_BADGES = 'matrixquest_badges_v1';
const STORAGE_KEY_COORD_MODE = 'matrixquest_coord_mode_v1';

export function loadProgress(): Record<number, LevelProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveLevelProgress(
  levelId: number,
  stars: number,
  commandsCount?: number,
  hintsUsed: number = 0
): Record<number, LevelProgress> {
  const current = loadProgress();
  const existing = current[levelId];

  const newStars = Math.max(existing?.stars || 0, stars);
  const bestCommands = existing?.bestCommandsCount
    ? Math.min(existing.bestCommandsCount, commandsCount || existing.bestCommandsCount)
    : commandsCount;

  current[levelId] = {
    levelId,
    completed: true,
    stars: newStars,
    bestCommandsCount: bestCommands,
    hintsUsed: Math.min(existing?.hintsUsed ?? hintsUsed, hintsUsed),
    completedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(current));
  } catch {
    // ignore
  }

  // Check badges unlock
  checkAndUnlockBadges(current);

  return current;
}

export function loadUnlockedBadges(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BADGES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function checkAndUnlockBadges(progress: Record<number, LevelProgress>): string[] {
  const unlocked = new Set<string>(loadUnlockedBadges());
  let newUnlocked = false;

  if (progress[1]?.completed && !unlocked.has('first-step')) {
    unlocked.add('first-step');
    newUnlocked = true;
  }

  if (progress[2]?.completed && !unlocked.has('cinema-boss')) {
    unlocked.add('cinema-boss');
    newUnlocked = true;
  }

  if (progress[6]?.completed && progress[7]?.completed && !unlocked.has('pixel-artist')) {
    unlocked.add('pixel-artist');
    newUnlocked = true;
  }

  if (progress[8]?.completed && !unlocked.has('transformer')) {
    unlocked.add('transformer');
    newUnlocked = true;
  }

  if (progress[10]?.completed && !unlocked.has('bug-hunter')) {
    unlocked.add('bug-hunter');
    newUnlocked = true;
  }

  if (progress[11]?.completed && !unlocked.has('clean-bot')) {
    unlocked.add('clean-bot');
    newUnlocked = true;
  }

  if (progress[13]?.completed && !unlocked.has('route-optimizer')) {
    unlocked.add('route-optimizer');
    newUnlocked = true;
  }

  if (progress[15]?.completed && !unlocked.has('loop-coder')) {
    unlocked.add('loop-coder');
    newUnlocked = true;
  }

  if (progress[16]?.completed && progress[18]?.completed && !unlocked.has('earth-defender')) {
    unlocked.add('earth-defender');
    newUnlocked = true;
  }

  // All 20 completed
  const allCompleted = Array.from({ length: 20 }, (_, i) => i + 1).every(
    lvl => progress[lvl]?.completed
  );
  if (allCompleted && !unlocked.has('grand-master')) {
    unlocked.add('grand-master');
    newUnlocked = true;
  }

  if (newUnlocked) {
    const array = Array.from(unlocked);
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(array));
    return array;
  }

  return Array.from(unlocked);
}

export function loadCoordMode(): CoordinateDisplayMode {
  if (typeof window === 'undefined') return 'row-col';
  const saved = localStorage.getItem(STORAGE_KEY_COORD_MODE);
  if (saved === 'row-col' || saved === 'alpha-num' || saved === 'cartesian') {
    return saved;
  }
  return 'row-col';
}

export function saveCoordMode(mode: CoordinateDisplayMode) {
  try {
    localStorage.setItem(STORAGE_KEY_COORD_MODE, mode);
  } catch {
    // ignore
  }
}

export function resetAllProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    localStorage.removeItem(STORAGE_KEY_BADGES);
  } catch {
    // ignore
  }
}
