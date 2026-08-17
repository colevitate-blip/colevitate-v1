/** Converts a -100..100 axis signal into a 0..100 horizontal position on the bar track. */
export function positionOf(signal: number): number {
  const clamped = Math.max(-100, Math.min(100, signal));
  return 50 + clamped / 2;
}

/** Fill-bar left offset and width (both 0..50) for a -100..100 axis score, anchored at the track's center. */
export function fillRect(score: number): { left: number; width: number } {
  const clamped = Math.max(-100, Math.min(100, score));
  const left = clamped < 0 ? 50 + clamped / 2 : 50;
  const width = Math.abs(clamped) / 2;
  return { left, width };
}
