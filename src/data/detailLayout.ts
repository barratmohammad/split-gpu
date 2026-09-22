import type { PartDef, Vec3 } from './types';
import { powerComponents } from './powerComponents';

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const place = (part: PartDef, x: number, z: number): PartDef => ({
  ...part, explodeVector: [x - part.basePosition[0], 0, z - part.basePosition[2]],
});

/** Decompose grouped render proxies into individually pickable, horizontally separated parts. */
export function detailedModule(parts: PartDef[]): PartDef[] {
  return parts.flatMap((part): PartDef[] => {
    const g = part.geometry;
    // This view is the exposed module in NVIDIA's photograph, not a cooler teardown.
    if (g.kind === 'heatsink' || g.kind === 'cover') return [];
    if (g.kind === 'powerFlanks') return powerComponents(g.boardSize).map((item, i) => place({
      ...part, id: i === 0 ? part.id : `power-component-${i + 1}`,
      name: `Board component ${i + 1}`, label: `Board component ${i + 1}`,
      subtitle: 'An individually separated power-circuitry proxy',
      geometry: { kind: 'component', size: item.size, material: item.material },
      basePosition: add(part.basePosition, item.position),
    }, item.position[0] < -1.8 ? item.position[0] - 5.4 : item.position[0] > 1.8 ? item.position[0] + 5.4 : item.position[0] * 1.35, Math.abs(item.position[0]) < 1.8 ? Math.sign(item.position[2]) * 5.5 : item.position[2] * 1.8));
    if (g.kind === 'hbm') return g.positions.map((position, i) => place({
      ...part, id: i === 0 ? part.id : `hbm-position-${i + 1}`,
      name: `HBM3 package position ${i + 1}`, label: `HBM position ${i + 1}`,
      geometry: { ...g, positions: [[0, 0, 0]] }, basePosition: add(part.basePosition, position),
    }, -1.6 + (i % 3) * 1.6, i < 3 ? -3.7 : 3.7));
    const targets: Record<string, [number, number]> = {
      board: [-8.4, -8.5], package: [0, 0], 'gpu-die': [4.7, 0],
    };
    const target = targets[part.id];
    return [target ? place(part, ...target) : part];
  });
}

export function detailedDie(parts: PartDef[]): PartDef[] {
  return parts.flatMap((part): PartDef[] => {
    const g = part.geometry;
    if (g.kind === 'region' && (g.style === 'l2' || g.style === 'controller')) {
      return [-1, 1].map((side, i) => {
        const isL2 = g.style === 'l2';
        return place({ ...part, id: i === 0 ? part.id : `${part.id}-2`,
          name: `${part.name} — ${isL2 ? `partition ${i + 1}` : `${side < 0 ? 'left' : 'right'} region`}`,
          geometry: { ...g, single: true, size: isL2 ? [g.size[0] / 2 - 0.1, g.size[1], g.size[2]] : g.size },
          basePosition: add(part.basePosition, [side * (isL2 ? 2.12 : 4.5), 0, 0]),
        }, isL2 ? 2 + i * 5 : -3 + i * 15, 0);
      });
    }
    if (part.id === 'sm') {
      return Array.from({ length: 132 }, (_, i) => place({
        ...part, id: i === 0 ? 'sm' : `sm-${i + 1}`,
        name: `Streaming Multiprocessor ${i + 1}`, label: `SM ${i + 1}`,
        subtitle: 'One of 132 enabled SMs · logical inventory',
        geometry: { kind: 'region', size: [0.5, 0.05, 0.42], style: 'gpc', text: `${i + 1}`, single: true },
        basePosition: [11 + (i % 12) * 0.56, 0.3, -2.5 + Math.floor(i / 12) * 0.48],
        note: '132 enabled SMs, per NVIDIA. This bank is a logical inventory beside the die, not a physical floorplan or a mapping of disabled units.',
      }, 16 + (i % 12) * 0.75, -3.6 + Math.floor(i / 12) * 0.75));
    }
    if (part.id === 'media-engines') {
      return Array.from({ length: 14 }, (_, i) => {
        const family = i < 7 ? 'NVDEC' : 'JPEG';
        const n = i % 7 + 1;
        return place({ ...part, id: i === 0 ? 'media-engines' : `decoder-${i + 1}`,
          name: `${family} decoder ${n}`, label: `${family} ${n}`,
          subtitle: 'Individual decoder · logical inventory',
          geometry: { kind: 'region', size: [0.7, 0.08, 0.55], style: 'band', text: `${family} ${n}`, single: true },
          basePosition: [i % 7 * 0.85, 0.28, 6 + Math.floor(i / 7) * 0.7],
          note: 'NVIDIA lists seven NVDEC and seven JPEG decoders. These positions are an inventory layout, not physical die coordinates.',
        }, i % 7 * 1.2, 7 + Math.floor(i / 7) * 1.1);
      });
    }
    if (part.id.startsWith('gpc-')) {
      const n = Number(part.id.slice(4)) - 1;
      return [place({ ...part, geometry: g.kind === 'region' ? { ...g, sm: undefined } : g }, (n % 4) * 3, n < 4 ? -2 : 2)];
    }
    const targets: Record<string, [number, number]> = {
      'die-base': [-10, 0], pcie: [4.5, -5], gigathread: [4.5, -4], nvlink: [4.5, 4],
    };
    const target = targets[part.id];
    return [target ? place(part, ...target) : part];
  });
}
