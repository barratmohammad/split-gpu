import { MechanicalPlate } from './MechanicalPlate';
import type { Vec3 } from '../../data/types';

export function Cover({size:[w,h,d]}:{size:Vec3}) {
  return <group>
    <MechanicalPlate size={[w,h,d]} material="champagneMetal" />
    <mesh position={[0,h/2+.006,d*.18]}>
      <boxGeometry args={[w-.05,.014,.027]} /><meshStandardMaterial color="#252823" metalness={.5} roughness={.3}/>
    </mesh>
  </group>;
}
