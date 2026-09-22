import { RoundedBox } from '@react-three/drei';
import type { MaterialKind, Vec3 } from '../../data/types';
import { getMaterial } from '../materials';

export function BoardComponent({size:[w,h,d],material}:{size:Vec3;material:MaterialKind}) {
  if(material==='graphite') return <group>
    <mesh material={getMaterial('silverMetal')} castShadow receiveShadow><cylinderGeometry args={[w*.46,w*.46,h,24]}/></mesh>
    <mesh position={[0,-h*.43,0]} material={getMaterial('blackPlastic')}><cylinderGeometry args={[w*.48,w*.48,h*.15,24]}/></mesh>
    <mesh position={[0,h/2+.004,0]} material={getMaterial('graphite')}><boxGeometry args={[w*.65,.006,.012]}/></mesh>
    <mesh position={[0,h/2+.005,0]} material={getMaterial('graphite')}><boxGeometry args={[.012,.006,w*.65]}/></mesh>
  </group>;
  return <group>
    <RoundedBox args={[w,h,d]} radius={.014} smoothness={2} material={getMaterial(material)} castShadow receiveShadow />
    <mesh position={[0,h/2+.002,0]} material={getMaterial('siliconGray')}><boxGeometry args={[w*.68,.004,d*.68]}/></mesh>
    {[-1,1].flatMap(side=>Array.from({length:5},(_,i)=><mesh key={`${side}:${i}`} position={[side*(w/2+.012),-h/2+.04,-d*.35+i*d*.175]} material={getMaterial('silverMetal')}>
      <boxGeometry args={[.055,.045,.024]}/>
    </mesh>))}
  </group>;
}
