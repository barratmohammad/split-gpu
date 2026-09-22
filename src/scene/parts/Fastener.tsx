import { useMemo } from 'react';
import * as THREE from 'three';
import { getMaterial } from '../materials';

/** Recessed six-lobe drive, washer and threaded shank; illustrative dimensions. */
export function Fastener({diameter=.2,height=.42}:{diameter?:number;height?:number}) {
  const head=useMemo(()=>{
    const s=new THREE.Shape();s.absarc(0,0,diameter/2,0,Math.PI*2,false);
    const recess=new THREE.Path();
    for(let i=0;i<=72;i++) {const a=i/72*Math.PI*2;const r=diameter*(.20+.045*Math.cos(6*a));const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)recess.moveTo(x,y);else recess.lineTo(x,y);}
    s.holes.push(recess);
    const g=new THREE.ExtrudeGeometry(s,{depth:diameter*.24,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:24});g.rotateX(-Math.PI/2);return g;
  },[diameter]);
  return <group>
    <mesh geometry={head} position={[0,height/2-diameter*.24,0]} material={getMaterial('silverMetal')} castShadow/>
    <mesh position={[0,height/2-diameter*.22,0]} material={getMaterial('graphite')}><cylinderGeometry args={[diameter*.3,diameter*.3,.012,24]}/></mesh>
    <mesh position={[0,-.03,0]} material={getMaterial('silverMetal')} castShadow><cylinderGeometry args={[diameter*.24,diameter*.24,height*.8,16]}/></mesh>
    <mesh position={[0,height*.24,0]} material={getMaterial('silverMetal')} rotation-x={Math.PI/2}><torusGeometry args={[diameter*.48,diameter*.08,8,24]}/></mesh>
    {Array.from({length:7},(_,i)=><mesh key={i} position={[0,-height*.4+i*height*.09,0]} rotation-x={Math.PI/2} material={getMaterial('graphite')}><torusGeometry args={[diameter*.24,.005,4,16]}/></mesh>)}
  </group>;
}
