import type { Vec3 } from '../data/types';

/** Clamp to [0, 1] then apply smoothstep so the slider feels weighted at both ends. */
export function easeExplode(t: number): number {
  const x = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0));
  return x * x * (3 - 2 * x);
}

/**
 * Position of a part for a given explode amount:
 * base + explodeVector * ease(explode). Writes into `out` when provided.
 */
export function partPosition(base: Vec3, vec: Vec3, explode: number, out: Vec3 = [0, 0, 0]): Vec3 {
  const e = easeExplode(explode);
  out[0] = base[0] + vec[0] * e;
  out[1] = base[1] + vec[1] * e;
  out[2] = base[2] + vec[2] * e;
  return out;
}

/** Frame-rate independent exponential approach of `cur` toward `target`. */
export function damp(cur: number, target: number, lambda: number, dt: number): number {
  return cur + (target - cur) * (1 - Math.exp(-lambda * dt));
}
