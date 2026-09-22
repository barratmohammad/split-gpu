import { useRef } from 'react';
import { useCursor } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type * as THREE from 'three';
import { CONTROLLER_OFFSETS, L2_OFFSETS } from '../../data/dieParts';
import type { RegionStyle, Vec3 } from '../../data/types';
import { useShowcase } from '../../store/useShowcase';
import { getMaterial, getRegionMaterials } from '../materials';
import { partRefs } from '../partRefs';
import { useOutline } from '../useOutline';

interface Props {
  partId: string;
  single?: boolean;
  size: Vec3;
  style: RegionStyle;
  text: string;
  textRotation?: number;
  sm?: { offset: Vec3; size: Vec3 };
}

/**
 * One etched region of the die schematic: a thin labeled slab. The L2 and
 * controller parts render as two slabs each. A region may carry one
 * representative SM tile, which is its own click target.
 */
export function Region({ partId, size, style, text, textRotation, sm, single }: Props) {
  const smRef = useRef<THREE.Group>(null!);
  const smKey = `sm@${partId}`;
  const selectedId = useShowcase((s) => s.selectedId);
  const hoveredId = useShowcase((s) => s.hoveredId);
  const smHostId = useShowcase((s) => s.smHostId);
  const smActive = !!sm && smHostId === partId && (selectedId === 'sm' || hoveredId === smKey);

  useCursor(!!sm && hoveredId === smKey);
  useOutline(smRef, smActive);

  const offsets: Vec3[] =
    single ? [[0, 0, 0]] : style === 'controller' ? CONTROLLER_OFFSETS : style === 'l2' ? L2_OFFSETS : [[0, 0, 0]];
  const slabSize: Vec3 = !single && style === 'l2' ? [size[0] / 2 - 0.1, size[1], size[2]] : size;
  const materials = getRegionMaterials(
    `${partId}:${text}`,
    style,
    text,
    slabSize[0] / slabSize[2],
    textRotation,
  );

  const onSmClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    partRefs.set('sm', smRef.current);
    useShowcase.getState().selectSm(partId);
  };
  const onSmOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    useShowcase.setState({ hoveredId: smKey, smHostId: partId });
  };
  const onSmOut = () => {
    if (useShowcase.getState().hoveredId === smKey) useShowcase.getState().hover(null);
  };

  return (
    <group>
      {offsets.map((o, i) => (
        <mesh key={i} position={o} material={materials} castShadow receiveShadow>
          <boxGeometry args={slabSize} />
        </mesh>
      ))}
      {sm ? (
        <group ref={smRef} position={sm.offset} onClick={onSmClick} onPointerOver={onSmOver} onPointerOut={onSmOut}>
          <mesh material={getMaterial('silverMetal')} castShadow>
            <boxGeometry args={sm.size} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
