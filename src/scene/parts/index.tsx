import { Fastener } from './Fastener';
import { MechanicalPlate } from './MechanicalPlate';
import { BoardComponent } from './BoardComponent';
import type { PartDef } from '../../data/types';
import { Board } from './Board';
import { PowerFlanks } from './PowerFlanks';
import { Package } from './Package';
import { HbmStacks } from './HbmStacks';
import { GpuDie } from './GpuDie';
import { Heatsink } from './Heatsink';
import { Cover } from './Cover';
import { DieBase } from './DieBase';
import { Region } from './Region';

/** Picks the geometry builder for a part definition. */
export function PartGeometry({ def }: { def: PartDef }) {
  const g = def.geometry;
  switch (g.kind) {
    case 'fastener':
      return <Fastener diameter={g.size[0]} height={g.size[1]} />;
    case 'component':
      if (g.size[0] > 3) return <MechanicalPlate size={g.size} material={g.material} />;
      return <BoardComponent size={g.size} material={g.material} />;
    case 'board':
      return <Board {...g} />;
    case 'powerFlanks':
      return <PowerFlanks {...g} />;
    case 'package':
      return <Package {...g} />;
    case 'hbm':
      return <HbmStacks {...g} />;
    case 'die':
      return <GpuDie {...g} />;
    case 'heatsink':
      return <Heatsink {...g} />;
    case 'cover':
      return <Cover {...g} />;
    case 'dieBase':
      return <DieBase {...g} />;
    case 'region':
      return <Region {...g} partId={def.id} />;
    case 'virtual':
      return null;
  }
}
