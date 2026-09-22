import { describe, expect, it } from 'vitest';
import { damp, easeExplode, partPosition } from '../lib/explode';

describe('easeExplode', () => {
  it('is 0 at 0 and 1 at 1', () => {
    expect(easeExplode(0)).toBe(0);
    expect(easeExplode(1)).toBe(1);
  });
  it('clamps out-of-range and non-finite input', () => {
    expect(easeExplode(-2)).toBe(0);
    expect(easeExplode(5)).toBe(1);
    expect(easeExplode(Number.NaN)).toBe(0);
  });
  it('is monotonic', () => {
    let prev = -1;
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const v = easeExplode(t);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe('partPosition', () => {
  it('returns the base at explode 0 and base + vector at explode 1', () => {
    expect(partPosition([1, 2, 3], [0, 5, 0], 0)).toEqual([1, 2, 3]);
    expect(partPosition([1, 2, 3], [0, 5, 0], 1)).toEqual([1, 7, 3]);
  });
  it('writes into the provided output tuple', () => {
    const out: [number, number, number] = [0, 0, 0];
    const r = partPosition([0, 1, 0], [0, 2, 0], 0.5, out);
    expect(r).toBe(out);
    expect(out[1]).toBeCloseTo(2);
  });
});

describe('damp', () => {
  it('moves toward the target and never overshoots', () => {
    let v = 0;
    for (let i = 0; i < 200; i++) v = damp(v, 10, 8, 1 / 60);
    expect(v).toBeGreaterThan(9.99);
    expect(v).toBeLessThanOrEqual(10);
  });
});
