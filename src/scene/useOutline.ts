import { useContext, useEffect, useRef, type RefObject } from 'react';
import type * as THREE from 'three';
import { selectionContext } from '@react-three/postprocessing';

/**
 * Registers every mesh (including instanced meshes) under `ref` with the
 * postprocessing Outline effect while `enabled` is true.
 *
 * Only the context's state setter is used inside the effect. It is a stable
 * React dispatcher, so registering meshes does not re-trigger the effect.
 */
export function useOutline(ref: RefObject<THREE.Object3D | null>, enabled: boolean): void {
  const api = useContext(selectionContext);
  const select = api?.select ?? null;
  const selectRef = useRef(select);
  selectRef.current = select;

  useEffect(() => {
    const dispatch = selectRef.current;
    if (!dispatch || !enabled || !ref.current) return;
    const meshes: THREE.Object3D[] = [];
    ref.current.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o);
    });
    dispatch((state) => [...state, ...meshes]);
    return () => {
      dispatch((state) => state.filter((o) => !meshes.includes(o)));
    };
  }, [enabled, ref]);
}
