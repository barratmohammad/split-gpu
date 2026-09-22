import type { GeometryDef, Vec3 } from '../data/types';
import { CONTROLLER_OFFSETS } from '../data/dieParts';
export interface LocalBox {
  min: Vec3;
  max: Vec3;
}

function boxFromPoints(points: Vec3[], size: Vec3): LocalBox {
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const p of points) {
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], p[i] - size[i] / 2);
      max[i] = Math.max(max[i], p[i] + size[i] / 2);
    }
  }
  return { min, max };
}

function centered(size: Vec3): LocalBox {
  return { min: [-size[0] / 2, -size[1] / 2, -size[2] / 2], max: [size[0] / 2, size[1] / 2, size[2] / 2] };
}

/** Axis-aligned bounds of a part's geometry relative to the part group origin. */
export function partLocalBox(geometry: GeometryDef): LocalBox {
  switch (geometry.kind) {
    case 'fastener':
    case 'component':
    case 'board':
    case 'package':
    case 'die':
    case 'heatsink':
    case 'cover':
    case 'dieBase':
      return centered(geometry.size);
    case 'powerFlanks': {
      const [w, , d] = geometry.boardSize;
      return { min: [-w / 2 + 0.2, 0, -d / 2 + 0.2], max: [w / 2 - 0.2, 0.6, d / 2 - 0.2] };
    }
    case 'hbm':
      return boxFromPoints(geometry.positions, geometry.size);
    case 'region':
      return geometry.style === 'controller' && !geometry.single
        ? boxFromPoints(CONTROLLER_OFFSETS, geometry.size)
        : centered(geometry.size);
    case 'virtual':
      return { min: [0, 0, 0], max: [0, 0, 0] };
  }
}

