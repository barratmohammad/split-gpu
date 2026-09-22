import { Environment as DreiEnvironment, Lightformer, MeshReflectorMaterial } from '@react-three/drei';

import { useShowcase } from '../store/useShowcase';

/** A contrasty photographic studio: bright strip reflections against dark flags. */
export function Environment() {
  const stage=useShowcase(s=>s.level==='module'&&!s.isolated&&s.explode<.66);
  return <>
    <color attach="background" args={['#05080d']} />
    <fog attach="fog" args={['#05080d',30,100]} />
    <ambientLight intensity={0.2}/>
    <directionalLight position={[-4,12,5]} intensity={2.5} castShadow shadow-mapSize={[2048,2048]} shadow-bias={-.00015}
      shadow-normalBias={.025} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={14} shadow-camera-bottom={-12} shadow-camera-far={45}/>
    <directionalLight position={[7,6,-4]} intensity={1.1} color="#edf3ff"/>
    <DreiEnvironment resolution={512} frames={1} environmentIntensity={1}>
      <color attach="background" args={['#16191d']}/>
      <Lightformer intensity={5} position={[-5,8,3]} rotation-y={Math.PI/3} rotation-x={Math.PI/5} scale={[5,10,1]}/>
      <Lightformer intensity={6} position={[0,10,0]} rotation-x={Math.PI/2} scale={[12,4,1]}/>
      <Lightformer intensity={3} position={[7,3,2]} rotation-y={-Math.PI/2} scale={[2,8,1]}/>
      <Lightformer intensity={4} position={[0,5,-7]} scale={[12,3,1]}/>
      <Lightformer intensity={1.5} position={[0,0,10]} rotation-y={Math.PI} scale={[10,6,1]}/>
    </DreiEnvironment>
    {stage && <group>
      <mesh position={[0,-.37,0]} receiveShadow><cylinderGeometry args={[6.2,6.25,.2,128]}/><meshStandardMaterial color="#526478" metalness={.5} roughness={.45}/></mesh>
      <mesh position={[0,-.264,0]} rotation-x={-Math.PI/2}><torusGeometry args={[6.03,.012,8,128]}/><meshStandardMaterial color="#9aabb9" metalness={.7} roughness={.3}/></mesh>
    </group>}
    <mesh rotation-x={-Math.PI/2} position={[0,-.48,0]} receiveShadow>
      <planeGeometry args={[250,250]}/>
      <MeshReflectorMaterial resolution={512} blur={[500,160]} mixBlur={1} mixStrength={.3} mirror={.22}
        color="#344457" metalness={.35} roughness={.72} depthScale={.15} minDepthThreshold={.8} maxDepthThreshold={1.2}/>
    </mesh>
  </>;
}
