import { moduleParts } from './moduleParts';
import { dieParts } from './dieParts';
import type { Level, PartDef } from './types';

const all = [...moduleParts, ...dieParts];
const byId = new Map(all.map((p) => [p.id, p]));

export function partsForLevel(level: Level): PartDef[] {
  return level === 'module' ? moduleParts : dieParts;
}

export function getPart(id: string): PartDef | undefined {
  return byId.get(id);
}

export { moduleParts, dieParts };
