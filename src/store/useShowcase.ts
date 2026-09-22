import { create } from 'zustand';
import type { Level } from '../data/types';

export const DIE_PART_ID = 'gpu-die';
export const INITIAL_EXPLODE = 0;

export interface ShowcaseState {
  /** Slider target, 0 = assembled, 1 = fully exploded. Parts ease toward it. */
  explode: number;
  level: Level;
  selectedId: string | null;
  hoveredId: string | null;
  /** True while the camera and assemblies animate between levels. */
  transitioning: boolean;
  /** Bumped to ask the camera rig to return to its default framing. */
  resetToken: number;
  /** Which GPC hosts the SM bank that was last hovered or selected. */
  smHostId: string | null;

  labels: boolean;
  autoRotate: boolean;
  isolated: boolean;
  componentsOpen: boolean;
  helpOpen: boolean;
  zoomRequest: number;
  toggleLabels: () => void;
  toggleRotate: () => void;
  toggleIsolate: () => void;
  toggleComponents: () => void;
  toggleHelp: () => void;
  zoom: (direction: number) => void;
  setExplode: (v: number) => void;
  select: (id: string | null) => void;
  selectSm: (hostId: string) => void;
  hover: (id: string | null) => void;
  enterDie: () => void;
  backToModule: () => void;
  endTransition: () => void;
  resetView: () => void;
}

export const useShowcase = create<ShowcaseState>((set) => ({
  explode: INITIAL_EXPLODE,
  level: 'module',
  selectedId: DIE_PART_ID,
  hoveredId: null,
  transitioning: false,
  resetToken: 0,
  smHostId: null,
  labels: false, autoRotate: false, isolated: false,
  componentsOpen: true, helpOpen: false, zoomRequest: 0,
  toggleLabels: () => set(s=>({labels:!s.labels})),
  toggleRotate: () => set(s=>({autoRotate:!s.autoRotate})),
  toggleIsolate: () => set(s=>({isolated:!!s.selectedId&&!s.isolated})),
  toggleComponents: () => set(s=>({componentsOpen:!s.componentsOpen})),
  toggleHelp: () => set(s=>({helpOpen:!s.helpOpen})),
  zoom: (direction) => set(s=>({zoomRequest:s.zoomRequest+direction})),

  setExplode: (v) => set({ explode: Math.min(1, Math.max(0, Number.isFinite(v)?v:0)), isolated: false }),
  select: (id) => set({ selectedId: id, ...(id===null?{isolated:false}:{} ) }),
  selectSm: (hostId) => set({ selectedId: 'sm', smHostId: hostId }),
  hover: (id) => set({ hoveredId: id }),
  enterDie: () =>
    set({ isolated:false, autoRotate:false, level: 'die', selectedId: null, hoveredId: null, transitioning: true, explode: 0 }),
  backToModule: () =>
    set({ isolated:false, autoRotate:false, level: 'module', selectedId: DIE_PART_ID, hoveredId: null, transitioning: true, explode: INITIAL_EXPLODE }),
  endTransition: () => set({ transitioning: false }),
  resetView: (): void =>
    set((s) => ({
      selectedId: s.level === 'module' ? DIE_PART_ID : null,
      hoveredId: null, isolated:false, autoRotate:false,
      explode: s.level === 'module' ? INITIAL_EXPLODE : 0,
      resetToken: s.resetToken + 1,
    })),
}));
