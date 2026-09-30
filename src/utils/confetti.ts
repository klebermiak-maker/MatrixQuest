import confetti from 'canvas-confetti';

/**
 * Fires a spectacular multi-cannon confetti celebration for kids
 */
export function triggerVictoryConfetti() {
  try {
    // Left Cannon Burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.75 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    });

    // Right Cannon Burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: 0.75 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    });

    // Center Firework Burst after 200ms
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        shapes: ['circle', 'square'],
        colors: ['#FACC15', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4'],
        scalar: 1.2
      });
    }, 200);

    // Golden Stars shower after 450ms
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { x: 0.5, y: 0.4 },
        shapes: ['star'],
        colors: ['#F59E0B', '#FBBF24', '#FDE047'],
        scalar: 1.4
      });
    }, 450);
  } catch {
    // Graceful fallback if canvas is unavailable
  }
}
