import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Selection } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useShowcase } from '../store/useShowcase';
import { CameraRig } from './CameraRig';
import { DieAssembly } from './DieAssembly';
import { Effects } from './Effects';
import { Environment } from './Environment';
import { LevelSwitcher } from './LevelSwitcher';
import { ModuleAssembly } from './ModuleAssembly';

/** The full 3D view. Clicking empty space clears the selection. */
export function Scene() {
  return (
    <Canvas
      className="scene"
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ fov: 32, near: 0.1, far: 200, position: [13.5, 10.5, 16.5] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
      onPointerMissed={() => useShowcase.getState().select(null)}
    >
      <Suspense fallback={null}>
        <Environment />
        <Selection>
          <LevelSwitcher level="module">
            <ModuleAssembly />
          </LevelSwitcher>
          <LevelSwitcher level="die">
            <DieAssembly />
          </LevelSwitcher>
          <Effects />
        </Selection>
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}
