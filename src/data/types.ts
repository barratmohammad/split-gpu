export type Vec3 = [number, number, number];

export type Level = 'module' | 'die';

export type MaterialKind =
  | 'darkBoard'
  | 'copper'
  | 'gold'
  | 'blackPlastic'
  | 'neutralGray'
  | 'plasticCover'
  | 'substrate'
  | 'silverMetal'
  | 'siliconGray'
  | 'siliconDie'
  | 'graphite';

export interface Stat {
  value: string;
  label: string;
}

/** Visual style of an etched region on the die schematic. */
export type RegionStyle = 'gpc' | 'l2' | 'band' | 'controller';

export type GeometryDef =
  | { kind: 'fastener'; size: Vec3; material: MaterialKind }
  | { kind: 'component'; size: Vec3; material: MaterialKind }
  | { kind: 'board'; size: Vec3 }
  | { kind: 'powerFlanks'; boardSize: Vec3 }
  | { kind: 'package'; size: Vec3 }
  | { kind: 'hbm'; size: Vec3; positions: Vec3[] }
  | { kind: 'die'; size: Vec3 }
  | { kind: 'heatsink'; size: Vec3 }
  | { kind: 'cover'; size: Vec3 }
  | { kind: 'dieBase'; size: Vec3 }
  | {
      kind: 'region';
      single?: boolean;
      size: Vec3;
      style: RegionStyle;
      /** Text engraved on the region. */
      text: string;
      /** Rotate the engraved text by this many degrees (for side strips). */
      textRotation?: number;
      /** Optional representative SM tile shown on this region, in local coordinates. */
      sm?: { offset: Vec3; size: Vec3 };
    }
  | { kind: 'virtual' };

export interface PartDef {
  id: string;
  level: Level;
  /** Full display name shown as the panel title. */
  name: string;
  /** Short name used for the floating 3D label. */
  label: string;
  subtitle: string;
  paragraphs: [string, string];
  stats: [Stat, Stat, Stat];
  geometry: GeometryDef;
  /** Assembled position of the part group. */
  basePosition: Vec3;
  /** Offset added to basePosition when the slider is at 1. */
  explodeVector: Vec3;
  /** Set on a part that opens a deeper level when explored. */
  drillInto?: Level;
  /** Shown under the text: what this depiction is based on, and its limits. */
  note?: string;
  /** Manufacturer reference; not a claim of dimensional CAD fidelity. */
  sourceUrl?: string;
}
