import * as THREE from 'three';
import { MATERIALS } from '../data/materials';
import type { MaterialKind, RegionStyle } from '../data/types';

const cache = new Map<string, THREE.Material>();

function build(kind: MaterialKind): THREE.MeshPhysicalMaterial {
  const p = MATERIALS[kind];
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(p.color),
    metalness: p.metalness,
    roughness: p.roughness,
    clearcoat: p.clearcoat ?? 0,
    clearcoatRoughness: p.clearcoatRoughness ?? 0,
    iridescence: p.iridescence ?? 0,
    iridescenceIOR: p.iridescenceIOR ?? 1.3,
    iridescenceThicknessRange: p.iridescenceThicknessRange ?? [100, 400],
    emissive: new THREE.Color(p.emissive ?? '#000000'),
    emissiveIntensity: p.emissiveIntensity ?? 1,
    envMapIntensity: p.envMapIntensity ?? 1,
  });
  if (['silverMetal','champagneMetal','copper','graphite'].includes(kind)) {
    const width=512, height=512;
    const pixels=new Uint8Array(width*height*4);
    for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
      const value=120+Math.round(Math.sin(y*79.1)*24+Math.sin(x*.075+y*21.13)*9);
      const i=(y*width+x)*4; pixels[i]=pixels[i+1]=pixels[i+2]=value; pixels[i+3]=255;
    }
    const texture=new THREE.DataTexture(pixels,width,height);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.anisotropy=8;texture.needsUpdate=true;
    material.bumpMap=texture;material.bumpScale=.0006;
    material.roughness=kind==='graphite'?.6:.43;
    material.anisotropy=.65;
  }
  return material;
}

/** One shared material instance per kind, so every part of a kind renders identically. */
export function getMaterial(kind: MaterialKind): THREE.MeshPhysicalMaterial {
  let m = cache.get(kind) as THREE.MeshPhysicalMaterial | undefined;
  if (!m) {
    m = build(kind);
    cache.set(kind, m);
  }
  return m;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function toTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Faint, uncountable line texture that suggests dense logic without depicting unit counts. */
function hatch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, alpha: number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = `rgba(200, 210, 255, ${alpha})`;
  ctx.lineWidth = 1;
  let yy = y + 6;
  let i = 0;
  while (yy < y + h) {
    ctx.beginPath();
    ctx.moveTo(x, yy);
    ctx.lineTo(x + w, yy);
    ctx.stroke();
    yy += 7 + ((i * 7) % 5);
    i++;
  }
  let xx = x + 9;
  i = 0;
  while (xx < x + w) {
    ctx.beginPath();
    ctx.moveTo(xx, y);
    ctx.lineTo(xx, y + h);
    ctx.stroke();
    xx += 11 + ((i * 5) % 7);
    i++;
  }
  ctx.restore();
}

const DIE_LAYOUT = {
  bandFill: '#4c524c',
  gpcFill: '#454d46',
  l2Fill: '#596353',
  ctrlFill: '#525b52',
};

/**
 * The die's top surface for the module view: a faint print of the block
 * layout (PCIe and GigaThread across the top, two rows of four GPCs, the L2
 * between them, controllers at the sides, NVLink along the bottom).
 */
export function getDieTexture(): THREE.CanvasTexture {
  const key = 'tex:die';
  const cached = cache.get(key) as unknown as THREE.CanvasTexture | undefined;
  if (cached) return cached;
  const W = 1024;
  const H = 896;
  const [c, ctx] = makeCanvas(W, H);
  ctx.fillStyle = '#303a34';
  ctx.fillRect(0, 0, W, H);
  const block = (x: number, y: number, w: number, h: number, fill: string) => {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(167, 174, 149, 0.22)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
  };
  const m = 28;
  const side = 60;
  block(m + side + 10, m, W - 2 * (m + side + 10), 44, DIE_LAYOUT.bandFill);
  block(m + side + 10, m + 52, W - 2 * (m + side + 10), 44, DIE_LAYOUT.bandFill);
  block(m + side + 10, H - m - 44, W - 2 * (m + side + 10), 44, DIE_LAYOUT.bandFill);
  block(m, m, side, H - 2 * m, DIE_LAYOUT.ctrlFill);
  block(W - m - side, m, side, H - 2 * m, DIE_LAYOUT.ctrlFill);
  const top = m + 110;
  const bottom = H - m - 56;
  const rowH = (bottom - top - 70) / 2;
  block(m + side + 10, top + rowH + 6, (W - 2 * (m + side + 10)) / 2 - 6, 58, DIE_LAYOUT.l2Fill);
  block(W / 2 + 6, top + rowH + 6, (W - 2 * (m + side + 10)) / 2 - 6, 58, DIE_LAYOUT.l2Fill);
  const innerW = W - 2 * (m + side + 10);
  const gw = innerW / 4;
  for (let r = 0; r < 2; r++) {
    for (let col = 0; col < 4; col++) {
      const x = m + side + 10 + col * gw + 6;
      const y = r === 0 ? top : top + rowH + 70;
      block(x, y, gw - 12, rowH - 6, DIE_LAYOUT.gpcFill);
      hatch(ctx, x + 8, y + 8, gw - 28, rowH - 22, 0.22);
    }
  }
  // Dense patterned silicon detail, decorative rather than a fabricated transistor map.
  for (let i=0;i<1800;i++) {
    const x=35+(i*47)%954, y=35+(i*71)%826;
    ctx.strokeStyle=i%3?'rgba(25,32,27,.4)':'rgba(159,173,145,.28)';
    ctx.lineWidth=1;ctx.strokeRect(x,y,5+i%19,3+i%11);
  }
  const wash=ctx.createLinearGradient(0,0,W,H);wash.addColorStop(0,'#a8b59812');wash.addColorStop(.5,'#b4aa8510');wash.addColorStop(1,'#819d8d12');ctx.fillStyle=wash;ctx.fillRect(0,0,W,H);
  const t = toTexture(c);
  cache.set(key, t as unknown as THREE.Material);
  return t;
}

/** The hero silicon: iridescent physical material with the block layout as its color and glow. */
export function getDieMaterial(): THREE.MeshPhysicalMaterial {
  const key = 'siliconDie:textured';
  let m = cache.get(key) as THREE.MeshPhysicalMaterial | undefined;
  if (!m) {
    m = build('siliconDie');
    const tex = getDieTexture();
    m.map = tex;
    m.emissiveMap = tex;
    m.color.set('#ffffff');
    m.metalness = 0.75;
    m.roughness = 0.24;
    m.emissive.set('#000000');
    m.emissiveIntensity = 0;
    m.needsUpdate = true;
    cache.set(key, m);
  }
  return m;
}

/** Base slab of the die schematic: dark silicon with faint traces. */
export function getDieBaseMaterial(): THREE.MeshPhysicalMaterial {
  const key = 'dieBase';
  let m = cache.get(key) as THREE.MeshPhysicalMaterial | undefined;
  if (!m) {
    const [c, ctx] = makeCanvas(1024, 576);
    ctx.fillStyle = '#1e2250';
    ctx.fillRect(0, 0, 1024, 576);
    hatch(ctx, 0, 0, 1024, 576, 0.12);
    const tex = toTexture(c);
    m = build('siliconDie');
    m.map = tex;
    m.color.set('#ffffff');
    m.emissive.set('#000000');
    m.iridescence = 0.6;
    m.roughness = 0.3;
    m.needsUpdate = true;
    cache.set(key, m);
  }
  return m;
}

const REGION_COLORS: Record<RegionStyle, { fill: string; side: string }> = {
  gpc: { fill: '#3a4292', side: '#2b3170' },
  l2: { fill: '#5460ad', side: '#3d4787' },
  band: { fill: '#4a52a0', side: '#353c7c' },
  controller: { fill: '#565a8c', side: '#41446c' },
};

/**
 * Materials for one etched region: a labeled top face plus plain sides.
 * Returned as a six-entry array for a box (px, nx, py, ny, pz, nz).
 */
export function getRegionMaterials(
  key: string,
  style: RegionStyle,
  text: string,
  aspect: number,
  textRotation = 0,
): THREE.Material[] {
  const cacheKey = `region:${key}`;
  const cached = cache.get(cacheKey) as unknown as THREE.Material[] | undefined;
  if (cached) return cached;

  const colors = REGION_COLORS[style];
  const W = 1024;
  const H = Math.max(96, Math.round(W / aspect));
  const [c, ctx] = makeCanvas(W, H);
  ctx.fillStyle = colors.fill;
  ctx.fillRect(0, 0, W, H);
  if (style === 'gpc') hatch(ctx, 14, 14, W - 28, H - 28, 0.2);
  else hatch(ctx, 10, 10, W - 20, H - 20, 0.08);
  ctx.strokeStyle = 'rgba(210, 220, 255, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  // Engraved label
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate((textRotation * Math.PI) / 180);
  const available = textRotation % 180 === 0 ? W : H;
  let px = Math.min(H * 0.42, 110);
  ctx.font = `600 ${px}px Inter, system-ui, -apple-system, sans-serif`;
  while (ctx.measureText(text).width > available * 0.9 && px > 18) {
    px -= 4;
    ctx.font = `600 ${px}px Inter, system-ui, -apple-system, sans-serif`;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 6;
  ctx.fillText(text, 0, style === 'gpc' ? -H * 0.34 : 0);
  ctx.restore();

  const top = new THREE.MeshPhysicalMaterial({
    map: toTexture(c),
    color: '#ffffff',
    metalness: 0.7,
    roughness: 0.32,
    iridescence: 0.5,
    iridescenceIOR: 1.5,
    envMapIntensity: 1.1,
  });
  const side = new THREE.MeshPhysicalMaterial({ color: colors.side, metalness: 0.7, roughness: 0.4 });
  const mats = [side, side, top, side, side, side];
  cache.set(cacheKey, mats as unknown as THREE.Material);
  return mats;
}

/** Vertical silver-to-chrome gradient used as the scene background. */
export function getBackgroundTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(4, 512);
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, '#f7f8fa');
  g.addColorStop(0.3, '#e9ebee');
  g.addColorStop(0.55, '#d7dade');
  g.addColorStop(1, '#d7dade');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 512);
  return toTexture(c);
}
