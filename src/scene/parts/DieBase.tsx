import { RoundedBox } from '@react-three/drei';
import type { Vec3 } from '../../data/types';
import { getDieBaseMaterial } from '../materials';

interface Props {
  size: Vec3;
}

/** The enlarged silicon slab that the schematic regions sit on. */
export function DieBase({ size }: Props) {
  return <RoundedBox args={size} radius={0.05} smoothness={3} material={getDieBaseMaterial()} castShadow receiveShadow />;
}
