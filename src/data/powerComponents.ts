import type { MaterialKind, Vec3 } from './types';

/** Visible component proxies; quantities and dimensions are illustrative. */
export function powerComponents(boardSize: Vec3) {
  const parts: { position: Vec3; size: Vec3; material: MaterialKind }[] = [];
  for (const sign of [-1, 1]) {
    for (const x of [2.45, 3.05, 3.65, 4.25]) {
      for (const z of [-1.35, -0.75, -0.15, 0.45, 1.05, 1.65]) {
        parts.push({ position: [sign * x, 0.16, z], size: [0.46, 0.32, 0.5], material: 'blackPlastic' });
      }
      parts.push({ position: [sign * x, 0.27, -boardSize[2] / 2 + 0.38], size: [0.46, 0.54, 0.34], material: 'graphite' });
    }
  }
  for (const x of [-1.15, -0.55, 0.05, 0.65, 1.25]) {
    for (const z of [-1.92, 1.92]) parts.push({ position: [x, 0.2, z], size: [0.5, 0.4, 0.42], material: 'blackPlastic' });
  }
  return parts;
}
