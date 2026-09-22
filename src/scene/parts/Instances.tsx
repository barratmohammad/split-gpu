import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MaterialKind, Vec3 } from '../../data/types';
import { getMaterial } from '../materials';

interface Props {
  positions: Vec3[];
  size: Vec3;
  material: MaterialKind;
  /** 'box' or 'cylinder' (cylinder uses size[0] as diameter and size[1] as height). */
  shape?: 'box' | 'cylinder';
}

/** Many identical small parts in one draw call. */
export function Instances({ positions, size, material, shape = 'box' }: Props) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    positions.forEach((p, i) => {
      m.makeTranslation(p[0], p[1], p[2]);
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [positions]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, positions.length]}
      material={getMaterial(material)}
      castShadow
      receiveShadow
    >
      {shape === 'box' ? (
        <boxGeometry args={size} />
      ) : (
        <cylinderGeometry args={[size[0] / 2, size[0] / 2, size[1], 20]} />
      )}
    </instancedMesh>
  );
}

/** Evenly spaced positions along the x axis. */
export function row(count: number, span: number, y: number, z: number): Vec3[] {
  const out: Vec3[] = [];
  const pitch = count > 1 ? span / (count - 1) : 0;
  for (let i = 0; i < count; i++) out.push([-span / 2 + pitch * i, y, z]);
  return out;
}
