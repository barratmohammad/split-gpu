import { useMemo } from 'react';
import * as THREE from 'three';
import type { Vec3 } from '../../data/types';
import { getMaterial } from '../materials';
import { Instances } from './Instances';

/** Source-based board silhouette; fine traces and markings are decorative, not a netlist. */
export function Board({ size: [width, h, depth] }: { size: Vec3 }) {
  const w = 10, d = 4.6;
  const { geometry, texture, holes, pads, passives } = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 0.14;
    shape.moveTo(-w / 2 + r, -d / 2);
    shape.lineTo(w / 2 - r, -d / 2); shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    shape.lineTo(w / 2, d / 2 - r); shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
    shape.lineTo(-w / 2 + r, d / 2); shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
    shape.lineTo(-w / 2, -d / 2 + r); shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const holes: Vec3[] = [];
    for (const x of [-3.0, -2.35, 2.35, 3.0]) for (const z of [-1.85, 1.85]) holes.push([x, h / 2 + 0.004, z]);
    for (const x of [-4.77, 4.77]) for (const z of [-2.08, 2.08]) holes.push([x, h / 2 + 0.004, z]);
    for (const [x, , z] of holes) { const hole = new THREE.Path(); hole.absarc(x, -z, 0.092, 0, Math.PI * 2, true); shape.holes.push(hole); }
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 16 });
    geometry.rotateX(-Math.PI / 2); geometry.translate(0, -h / 2, 0);
    const uv = geometry.attributes.uv;
    const pos = geometry.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getZ(i) + d / 2) / d);
    const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 1024;
    const c = canvas.getContext('2d')!;
    c.fillStyle = '#191d1c'; c.fillRect(0, 0, 2048, 1024);
    for (let i = 0; i < 1600; i++) {
      const x = (i * 137 + 37) % 2048; const y = (i * 83 + 51) % 1024;
      c.strokeStyle = i % 4 ? '#303831' : '#655e45'; c.lineWidth = i % 3 ? 1 : 2;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + 18 + i % 40, y); c.lineTo(x + 42 + i % 40, y + 24); c.lineTo(x + 90, y + 24); c.stroke();
      c.fillStyle = '#62655a'; c.fillRect(x, y, 3, 3);
    }
    c.fillStyle = '#9b9c87'; c.font = '14px monospace';
    for (let i = 0; i < 46; i++) c.fillText(`R${i + 1}`, (i * 173) % 1950 + 20, (i * 91) % 950 + 30);
    c.font = '22px monospace'; c.fillText('SXM5  /  GH100', 760, 990);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
    const pads: Vec3[] = []; const passives: Vec3[] = [];
    for (const sign of [-1, 1]) for (let i = 0; i < 34; i++) {
      const z = -2.05 + i * 0.123;
      pads.push([sign * 1.9, h / 2 + 0.012, z]);
      if (i % 3 !== 0) passives.push([sign * 2.12, h / 2 + 0.035, z]);
    }
    return { geometry, texture, holes, pads, passives };
  }, [w, h, d]);
  return <group scale={[width / w, 1, depth / d]}>
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial map={texture} color="#ffffff" metalness={0.18} roughness={0.65} clearcoat={0.25} />
    </mesh>
    {holes.map((p, i) => <mesh key={i} position={p} rotation-x={-Math.PI / 2} material={getMaterial('copper')}>
      <ringGeometry args={[0.095, i > 7 ? 0.14 : 0.19, 32]} />
    </mesh>)}
    <Instances positions={Array.from({length:240},(_,i):Vec3 => [((i*37)%93)/10-4.6,h/2+.035,((i*29)%39)/10-1.9])} size={[.085,.055,.044]} material="blackPlastic" />
    <Instances positions={Array.from({length:240},(_,i):Vec3 => [((i*37)%93)/10-4.55,h/2+.035,((i*29)%39)/10-1.9])} size={[.018,.06,.047]} material="silverMetal" />
    <Instances positions={pads} size={[0.065, 0.02, 0.055]} material="silverMetal" />
    <Instances positions={passives} size={[0.11, 0.045, 0.055]} material="blackPlastic" />
    <mesh position={[3.95, h / 2 + 0.12, -1.55]} material={getMaterial('substrate')} castShadow>
      <boxGeometry args={[1.4, 0.06, 0.9]} />
    </mesh>
    <Instances positions={[[3.5, .23, -1.7], [3.95, .23, -1.7], [4.4, .23, -1.7], [3.75, .23, -1.25], [4.2, .23, -1.25]]}
      size={[.25, .12, .2]} material="blackPlastic" />
  </group>;
}
