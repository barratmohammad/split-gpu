import type { Vec3 } from '../../data/types';
import { getDieMaterial } from '../materials';

interface Props {
  size: Vec3;
}

/** The hero: a polished, iridescent slab of silicon with its floorplan faintly visible. */
export function GpuDie({ size }: Props) {
  return (
    <mesh material={getDieMaterial()} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}
