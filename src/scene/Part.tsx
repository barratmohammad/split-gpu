import { useEffect, useRef, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import type * as THREE from 'three';
import type { PartDef, Vec3 } from '../data/types';
import { damp } from '../lib/explode';
import { useShowcase } from '../store/useShowcase';
import { displayPosition } from '../lib/inventory';
import { partRefs } from './partRefs';
import { useOutline } from './useOutline';

interface Props {
  def: PartDef;
  children: ReactNode;
}

/**
 * A clickable, hoverable group that eases toward its exploded position every
 * frame. Geometry builders are passed as children.
 */
export function Part({ def, children }: Props) {
  const ref = useRef<THREE.Group>(null!);
  const target = useRef<Vec3>([...def.basePosition]);
  const selectedId = useShowcase((s) => s.selectedId);
  const hoveredId = useShowcase((s) => s.hoveredId);
  const isolated = useShowcase(s=>s.isolated);
  const labels = useShowcase(s=>s.labels);
  const isSelected = selectedId === def.id;
  const isHovered = hoveredId === def.id;

  useEffect(() => {
    partRefs.set(def.id, ref.current);
    return () => {
      partRefs.delete(def.id);
    };
  }, [def.id]);

  useFrame((_, dt) => {
    const state=useShowcase.getState();
    ref.current.visible=!state.isolated||state.selectedId===def.id;
    const t = displayPosition(def,state.explode,target.current);
    const p = ref.current.position;
    const k = Math.min(dt, 0.1);
    p.x = damp(p.x, t[0], 7, k);
    p.y = damp(p.y, t[1], 7, k);
    p.z = damp(p.z, t[2], 7, k);
  });

  useCursor(isHovered);
  useOutline(ref, isSelected || isHovered);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    useShowcase.getState().select(def.id);
  };
  const onDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (def.drillInto === 'die') useShowcase.getState().enterDie();
  };
  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    useShowcase.getState().hover(def.id);
  };
  const onPointerOut = () => {
    if (useShowcase.getState().hoveredId === def.id) useShowcase.getState().hover(null);
  };

  return (
    <group
      ref={ref}
      position={def.basePosition}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {children}
      {labels && (!isolated || isSelected) && <Html center position={[0,.25,0]} zIndexRange={[5,0]} style={{pointerEvents:'none'}}><span className="piece-label">{def.label}</span></Html>}
    </group>
  );
}
