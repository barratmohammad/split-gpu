import type { MaterialKind } from './types';

/**
 * Material look for every kind of part. Values map directly onto
 * THREE.MeshPhysicalMaterial parameters. This file holds only plain data so it
 * can be imported in tests without a WebGL context.
 *
 * Colors follow what is visible in NVIDIA's H100 SXM5 module photograph (dark
 * board, dark components, iridescent die). Parts documented only as line art
 * (heatsink assembly, plastic cover) use a neutral finish; that is a style
 * choice, not a claim about the real material.
 */
export interface MaterialParams {
  color: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  iridescence?: number;
  iridescenceIOR?: number;
  iridescenceThicknessRange?: [number, number];
  emissive?: string;
  emissiveIntensity?: number;
  envMapIntensity?: number;
}

export const MATERIALS: Record<MaterialKind, MaterialParams> = {
  darkBoard: { color: '#16171a', metalness: 0.25, roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.35 },
  copper: { color: '#c47a45', metalness: 1, roughness: 0.32, envMapIntensity: 1.3 },
  gold: { color: '#c9a24a', metalness: 1, roughness: 0.3, envMapIntensity: 1.2 },
  blackPlastic: { color: '#121316', metalness: 0.05, roughness: 0.5, clearcoat: 0.3 },
  neutralGray: { color: '#c3c7cc', metalness: 0.35, roughness: 0.5, envMapIntensity: 0.9 },
  plasticCover: { color: '#2b2d31', metalness: 0.05, roughness: 0.6 },
  substrate: { color: '#1d211f', metalness: 0.2, roughness: 0.5 },
  silverMetal: { color: '#e2e4e6', metalness: 1, roughness: 0.22, envMapIntensity: 1.4 },
  siliconGray: { color: '#2f3238', metalness: 0.6, roughness: 0.45 },
  siliconDie: {
    color: '#2a2f6e',
    metalness: 0.85,
    roughness: 0.18,
    iridescence: 1,
    iridescenceIOR: 1.7,
    iridescenceThicknessRange: [180, 620],
    emissive: '#3b2f7a',
    emissiveIntensity: 0.25,
    envMapIntensity: 1.4,
  },
  graphite: { color: '#17191c', metalness: 0.75, roughness: 0.35 },
};

/** NVIDIA green, used only as a small accent (selection glow). */
export const ACCENT_GREEN = '#76b900';
