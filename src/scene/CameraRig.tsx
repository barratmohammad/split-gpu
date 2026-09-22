import { useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type CameraControlsImpl from 'camera-controls';
import { getPart } from '../data';
import type { Level } from '../data/types';
import { levelBox, partTargetBox, type LocalBox } from '../lib/framing';
import { useShowcase } from '../store/useShowcase';
import { STUDIO_DIRECTION } from '../lib/inventory';

/** Default viewing direction per level (unit vector from subject toward camera). */
const VIEW_DIR: Record<Level, THREE.Vector3> = {
  module: new THREE.Vector3(0.9, 0.75, 1.8).normalize(),
  die: new THREE.Vector3(0.02, 1.2, 0.65).normalize(),
};

/** How far left of center the subject sits so it stays clear of the info panel. */
const PANEL_SHIFT = 0.09;

const UP = new THREE.Vector3(0, 1, 0);
/**
 * Moves the camera so a box fits the view along `dir`, shifted left on wide
 * screens. Uses the box's bounding sphere, which is simple and never clips.
 */
function frameBox(
  controls: CameraControlsImpl,
  camera: THREE.PerspectiveCamera,
  box: LocalBox,
  dir: THREE.Vector3,
  animate: boolean,
  fill = 1.1,
  minDistance = 3,
) {
  const center = new THREE.Vector3(
    (box.min[0] + box.max[0]) / 2,
    (box.min[1] + box.max[1]) / 2,
    (box.min[2] + box.max[2]) / 2,
  );
  const vfov = (camera.fov * Math.PI) / 180;
  const forward = dir.clone().negate();
  const right = new THREE.Vector3().crossVectors(forward, UP).normalize();
  const screenUp = new THREE.Vector3().crossVectors(dir, right).normalize();
  const wide = camera.aspect > 1.1;
  const tanV = Math.tan(vfov / 2) * 0.80;
  const tanH = Math.tan(vfov / 2) * camera.aspect * (wide ? 0.52 : 0.9);
  let distance = minDistance;
  for (const x of [box.min[0], box.max[0]]) {
    for (const y of [box.min[1], box.max[1]]) {
      for (const z of [box.min[2], box.max[2]]) {
        const corner = new THREE.Vector3(x, y, z).sub(center);
        const depth = corner.dot(dir);
        distance = Math.max(distance, depth + Math.abs(corner.dot(right)) / tanH * fill,
          depth + Math.abs(corner.dot(screenUp)) / tanV * fill);
      }
    }
  }
  const halfWidth = distance * Math.tan(vfov / 2) * camera.aspect;
  const shift = wide ? halfWidth * PANEL_SHIFT : 0;
  const target = center.clone().addScaledVector(right, shift);
  if (wide) target.addScaledVector(screenUp, -distance * Math.tan(vfov / 2) * 0.035);
  const position = target.clone().addScaledVector(dir, distance);
  void controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, animate);
}

/** Owns the camera: default framing, glide to a selected part, reset, and level changes. */
export function CameraRig() {
  const ref = useRef<CameraControlsImpl>(null!);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const explode = useShowcase((s) => s.explode);
  const viewport = useThree((s) => s.size);
  const level = useShowcase((s) => s.level);
  const selectedId = useShowcase((s) => s.selectedId);
  const resetToken = useShowcase((s) => s.resetToken);
  const first = useRef(true);

  const isolated = useShowcase(s=>s.isolated);
  const componentsOpen = useShowcase(s=>s.componentsOpen);
  const zoomRequest = useShowcase(s=>s.zoomRequest);
  const previousZoom = useRef(zoomRequest);
  useFrame((_,delta)=>{
    if(ref.current && useShowcase.getState().autoRotate) void ref.current.rotate(delta*.18,0,false);
  });
  useEffect(()=>{
    const change=zoomRequest-previousZoom.current;
    previousZoom.current=zoomRequest;
    if(change && ref.current) void ref.current.dolly(change*ref.current.distance*.18,true);
  },[zoomRequest]);
  useEffect(()=>{
    if(!ref.current)return;
    const selected=selectedId?getPart(selectedId):null;
    const box=isolated&&selected?partTargetBox(selected,explode):levelBox(level,explode);
    const dir=explode>.65?STUDIO_DIRECTION:VIEW_DIR[level];
    frameBox(ref.current,camera,box,dir,!first.current,.9,isolated?2:3);
    first.current=false;
    const timer=window.setTimeout(()=>useShowcase.getState().endTransition(),900);
    return ()=>window.clearTimeout(timer);
  },[level,explode,isolated,isolated?selectedId:null,resetToken,viewport.width,viewport.height,componentsOpen,camera]);

  return (
    <CameraControls
      ref={ref}
      makeDefault
      smoothTime={0.55}
      draggingSmoothTime={0.12}
      minDistance={3}
      maxDistance={200}
      maxPolarAngle={Math.PI / 2 - 0.04}
      dollyToCursor={false}
    />
  );
}
