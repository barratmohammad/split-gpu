import type { Level, PartDef, Vec3 } from '../data/types';
import { partsForLevel } from '../data';
import { partLocalBox, type LocalBox } from './bounds';
export { partLocalBox, type LocalBox } from './bounds';
import { displayPosition } from './inventory';

/** World-space bounds of a part when it has settled at a given explode amount. */
export function partTargetBox(def: PartDef, explode: number): LocalBox {
  const p = displayPosition(def, explode);
  const local = partLocalBox(def.geometry);
  return {
    min: [p[0] + local.min[0], p[1] + local.min[1], p[2] + local.min[2]],
    max: [p[0] + local.max[0], p[1] + local.max[1], p[2] + local.max[2]],
  };
}

/** Union of every rendered part's settled bounds on a level. */
export function levelBox(level: Level, explode: number): LocalBox {
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const def of partsForLevel(level)) {
    if (def.geometry.kind === 'virtual') continue;
    const b = partTargetBox(def, explode);
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], b.min[i]);
      max[i] = Math.max(max[i], b.max[i]);
    }
  }
  return { min, max };
}

/** Where the floating label should attach: top-right edge of the part, in world space. */
export function labelAnchor(def: PartDef, explode: number): Vec3 {
  const b = partTargetBox(def, explode);
  return [b.max[0] * 0.55 + b.min[0] * 0.45, b.max[1] + 0.08, (b.min[2] + b.max[2]) / 2];
}
