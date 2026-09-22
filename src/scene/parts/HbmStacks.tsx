import { RoundedBox } from '@react-three/drei';
import type { Vec3 } from '../../data/types';
import { getMaterial } from '../materials';
import { Instances } from './Instances';

/** Encapsulated packages: surface detail does not assert a DRAM layer count. */
export function HbmStacks({size:[w,h,d],positions}:{size:Vec3;positions:Vec3[]}) {
  return <group>{positions.map((p,i)=><group key={i} position={p}>
    <RoundedBox args={[w,h,d]} radius={.02} smoothness={3} material={getMaterial('blackPlastic')} castShadow receiveShadow/>
    <mesh position={[0,-h/2+.015,0]} material={getMaterial('substrate')}><boxGeometry args={[w+.035,.035,d+.035]}/></mesh>
    <mesh position={[0,h/2+.002,0]} material={getMaterial('siliconGray')}><boxGeometry args={[w*.86,.004,d*.82]}/></mesh>
    <mesh position={[-w*.36,h/2+.006,-d*.3]} rotation-x={-Math.PI/2}><circleGeometry args={[.025,16]}/><meshStandardMaterial color="#84898c" roughness={.75}/></mesh>
    <Instances positions={Array.from({length:12},(_,n):Vec3=>[-w*.4+n*w*.073,-h/2-.012,-d*.43])} size={[.025,.02,.025]} material="silverMetal"/>
  </group>)}</group>;
}
