import { MechanicalPlate } from './MechanicalPlate';
import type { Vec3 } from '../../data/types';
import { getMaterial } from '../materials';

export function Cover({size:[w,h,d]}:{size:Vec3}) {
  return <group>
    <MechanicalPlate size={[w,h,d]} />
    <mesh position={[0,h/2+.006,d*.18]}>
      <boxGeometry args={[w-.05,.014,.027]} /><meshStandardMaterial color="#94be48" metalness={.5} roughness={.3}/>
    </mesh>
    {[-1,1].map(side=><group key={side} position={[side*(w/2+.001),-.01,0]} rotation-z={Math.PI/2}>
      <mesh material={getMaterial('graphite')}><cylinderGeometry args={[.16,.16,.015,32]}/></mesh>
      <mesh material={getMaterial('silverMetal')}><torusGeometry args={[.15,.025,8,32]}/></mesh>
    </group>)}
  </group>;
}
