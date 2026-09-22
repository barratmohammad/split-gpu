import { MechanicalPlate } from './MechanicalPlate';
import type { Vec3 } from '../../data/types';
import { getMaterial } from '../materials';

interface Props {
  size: Vec3;
}

/** The dark package substrate with a thin interposer on top and a gold trace frame. */
export function Package({ size: [w, h, d] }: Props) {
  const frame: { pos: Vec3; size: Vec3 }[] = [
    { pos: [0, h / 2 + 0.005, -1.45], size: [2.9, 0.01, 0.03] },
    { pos: [0, h / 2 + 0.005, 1.45], size: [2.9, 0.01, 0.03] },
    { pos: [-1.45, h / 2 + 0.005, 0], size: [0.03, 0.01, 2.9] },
    { pos: [1.45, h / 2 + 0.005, 0], size: [0.03, 0.01, 2.9] },
  ];
  return (
    <group>
      <MechanicalPlate size={[w,h,d]} material="darkBoard" bolts />
      <mesh position={[0, h / 2 + 0.02, 0]} material={getMaterial('substrate')} castShadow receiveShadow>
        <boxGeometry args={[2.95, 0.04, 2.85]} />
      </mesh>
      {frame.map((f, i) => (
        <mesh key={i} position={[f.pos[0], f.pos[1] + 0.045, f.pos[2]]} material={getMaterial('gold')}>
          <boxGeometry args={f.size} />
        </mesh>
      ))}
    </group>
  );
}
