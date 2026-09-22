import { RoundedBox } from '@react-three/drei';
import type { Vec3 } from '../../data/types';
import { getMaterial } from '../materials';

/** Closely spaced illustrative fins with bright machined edges. */
export function Heatsink({ size: [w, h, d] }: { size: Vec3 }) {
  return <group>
    <RoundedBox args={[w,.08,d]} position={[0,-h/2+.04,0]} radius={.025} smoothness={2} material={getMaterial('silverMetal')} castShadow receiveShadow />
    {Array.from({length:56},(_,i) => <mesh key={i} position={[-w/2+.05+i*(w-.1)/55,0,0]} material={getMaterial('silverMetal')} castShadow receiveShadow>
      <boxGeometry args={[.038,h,d]} />
    </mesh>)}
  </group>;
}
