import { Recipe } from '@/types';
import { getRecentSpins } from './storage';

export function pickRandomRecipe(candidates: Recipe[]): { recipe: Recipe; index: number } {
  if (candidates.length === 0) {
    throw new Error('No recipes available in this category');
  }

  const recent = getRecentSpins();
  // Filter out recent items if we have plenty of candidates
  const nonRecent = candidates.filter(r => !recent.slice(0, 3).includes(r.id));
  const pool = nonRecent.length >= 3 ? nonRecent : candidates;

  const selected = pool[Math.floor(Math.random() * pool.length)];
  const index = candidates.findIndex(r => r.id === selected.id);

  return {
    recipe: selected,
    index: index >= 0 ? index : 0,
  };
}

/**
 * Calculates the exact target rotation in radians for the wheel to land on candidate index.
 * - Pointer is positioned at TOP (12 o'clock, which is -π/2 or 3π/2).
 * - Segment index goes from 0 to N-1 clockwise.
 */
export function calculateTargetRotation(
  currentRotation: number,
  targetIndex: number,
  totalSegments: number,
  fullRotations: number = 6
): number {
  const step = (Math.PI * 2) / totalSegments;
  // Center angle of target segment on unrotated wheel
  const segmentCenter = (targetIndex + 0.5) * step;

  // Pointer is at the top: 3π/2 (270 degrees)
  const pointerAngle = (Math.PI * 3) / 2;

  // Calculate the remainder angle needed to land under pointer
  let targetAngleMod = (pointerAngle - segmentCenter) % (Math.PI * 2);
  if (targetAngleMod < 0) {
    targetAngleMod += Math.PI * 2;
  }

  // Add small organic jitter within the wedge (-30% to +30% of wedge width)
  const organicOffset = (Math.random() - 0.5) * step * 0.55;
  targetAngleMod += organicOffset;

  // Calculate current rotation mod 2π
  const currentMod = currentRotation % (Math.PI * 2);

  // Additional angle from current to desired targetMod
  let diff = targetAngleMod - currentMod;
  if (diff < 0) {
    diff += Math.PI * 2;
  }

  // Add full rotations
  return currentRotation + fullRotations * Math.PI * 2 + diff;
}
