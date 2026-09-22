import type * as THREE from 'three';

/** Live scene objects by part id, used by the camera rig and label to follow moving parts. */
export const partRefs = new Map<string, THREE.Object3D>();
