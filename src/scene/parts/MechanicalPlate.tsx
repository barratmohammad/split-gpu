import { useMemo } from 'react';
import * as THREE from 'three';
import type { MaterialKind, Vec3 } from '../../data/types';
import { getMaterial } from '../materials';

/** Machined plate, with actual through-holes and a bevel that catches the studio. */
export function MechanicalPlate({size:[w,h,d],material='silverMetal',bolts=false}:{size:Vec3;material?:MaterialKind;bolts?:boolean}) {
  const geometry=useMemo(()=>{
    const s=new THREE.Shape(); const r=.12;
    s.moveTo(-w/2+r,-d/2); s.lineTo(w/2-r,-d/2); s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);
    s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);
    s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);
    for(const x of [-1,1]) for(const z of [-1,1]) { const hole=new THREE.Path();hole.absarc(x*(w/2-.26),z*(d/2-.26),.11,0,Math.PI*2,true);s.holes.push(hole); }
    const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.01,h-.04),bevelEnabled:true,bevelThickness:.02,bevelSize:.018,bevelSegments:2,curveSegments:16});
    g.rotateX(-Math.PI/2);g.translate(0,-h/2+.02,0); return g;
  },[w,h,d]);
  return <group>
    <mesh geometry={geometry} material={getMaterial(material)} castShadow receiveShadow />
    {bolts&&[-1,1].flatMap(x=>[-1,1].map(z=><group key={`${x}:${z}`} position={[x*(w/2-.26),h/2,z*(d/2-.26)]}>
      <mesh material={getMaterial('graphite')}><cylinderGeometry args={[.09,.09,.04,24]}/></mesh>
      <mesh position={[0,.025,0]} material={getMaterial('silverMetal')}><boxGeometry args={[.1,.007,.014]}/></mesh>
    </group>))}
  </group>;
}
