import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPart } from '../data';
import { labelAnchor } from '../lib/framing';
import { damp } from '../lib/explode';
import { useShowcase } from '../store/useShowcase';
import { partRefs } from './partRefs';

const box = new THREE.Box3();
const center = new THREE.Vector3();

/** A floating name tag with a thin leader line, following the selected part. */
export function PartLabel() {
  const ref = useRef<THREE.Group>(null!);
  const selectedId = useShowcase((s) => s.selectedId);
  const transitioning = useShowcase((s) => s.transitioning);
  const part = selectedId ? getPart(selectedId) : undefined;

  useFrame((_, dt) => {
    if (!part) return;
    const k = Math.min(dt, 0.1);
    let x: number;
    let y: number;
    let z: number;
    if (part.geometry.kind === 'virtual') {
      const obj = partRefs.get(part.id);
      if (!obj) return;
      box.setFromObject(obj);
      box.getCenter(center);
      x = box.max.x;
      y = box.max.y + 0.05;
      z = center.z;
    } else {
      [x, y, z] = labelAnchor(part, useShowcase.getState().explode);
    }
    const p = ref.current.position;
    p.x = damp(p.x, x, 8, k);
    p.y = damp(p.y, y, 8, k);
    p.z = damp(p.z, z, 8, k);
  });

  if (!part || transitioning) return null;
  return (
    <group ref={ref}>
      <Html zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div className="part-label">
          <span className="part-label__dot" />
          <span className="part-label__line" />
          <span className="part-label__text">{part.label}</span>
        </div>
      </Html>
    </group>
  );
}
