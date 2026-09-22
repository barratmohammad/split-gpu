import { useMemo } from 'react';
import type { Vec3 } from '../../data/types';
import { Instances } from './Instances';

interface Props {
  boardSize: Vec3;
}

/**
 * Generic power components on both flanks of the board, plus a row above and
 * below the package, matching the groupings visible in NVIDIA's photograph.
 * Counts are illustrative.
 */
export function PowerFlanks({ boardSize: [, , d] }: Props) {
  const { blocks, tall, rows } = useMemo(() => {
    const blocks: Vec3[] = [];
    const tall: Vec3[] = [];
    const rows: Vec3[] = [];
    const cols = [2.45, 3.05, 3.65, 4.25];
    const zs = [-1.35, -0.75, -0.15, 0.45, 1.05, 1.65];
    for (const sign of [-1, 1]) {
      for (const x of cols) {
        for (const z of zs) blocks.push([sign * x, 0.16, z]);
        tall.push([sign * x, 0.27, -d / 2 + 0.38]);
      }
    }
    for (const x of [-1.15, -0.55, 0.05, 0.65, 1.25]) {
      rows.push([x, 0.2, -1.92]);
      rows.push([x, 0.2, 1.92]);
    }
    return { blocks, tall, rows };
  }, [d]);
  return (
    <group>
      <Instances positions={blocks} size={[0.46, 0.32, 0.5]} material="blackPlastic" />
      <Instances positions={tall} size={[0.46, 0.54, 0.34]} material="graphite" />
      <Instances positions={rows} size={[0.5, 0.4, 0.42]} material="blackPlastic" />
    </group>
  );
}
