import { useRef, useState, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { Level } from '../data/types';
import { damp } from '../lib/explode';
import { useShowcase } from '../store/useShowcase';

interface Props {
  level: Level;
  children: ReactNode;
}

/** Scales its assembly in when its level is active and out (then unmounts it) when not. */
export function LevelSwitcher({ level, children }: Props) {
  const ref = useRef<THREE.Group>(null!);
  const initiallyActive = useShowcase.getState().level === level;
  const [mounted, setMounted] = useState(initiallyActive);

  useFrame((_, dt) => {
    const active = useShowcase.getState().level === level;
    if (active && !mounted) setMounted(true);
    const g = ref.current;
    if (!g) return;
    const target = active ? 1 : 0.001;
    const s = damp(g.scale.x, target, 5, Math.min(dt, 0.1));
    g.scale.setScalar(s);
    g.visible = s > 0.01;
    if (!active && s <= 0.01 && mounted) setMounted(false);
  });

  return (
    <group ref={ref} scale={initiallyActive ? 1 : 0.001}>
      {mounted ? children : null}
    </group>
  );
}
