import type { Level, PartDef } from './types';
import { partsForLevel } from './index';
export type ComponentGroup = { id:string; name:string; parts:PartDef[] };
export function groupId(part:PartDef):string {
  const id=part.id;
  if(part.level==='die') {
    if(id==='sm'||id.startsWith('sm-'))return 'sms';
    if(id.startsWith('gpc-'))return 'compute';
    if(id.startsWith('l2')||id.startsWith('memory-'))return 'memory';
    if(id==='media-engines'||id.startsWith('decoder-'))return 'media';
    return 'interfaces';
  }
  if(id.startsWith('mounting-')||id==='support-plate')return 'structure';
  if(id==='cover'||id==='heatsink')return 'cooling';
  if(id==='cold-plate'||id==='thermal-interface')return 'thermal';
  if(id==='board'||id==='routing-board')return 'boards';
  if(id.startsWith('power-'))return 'power';
  if(id.startsWith('hbm'))return 'hbm';
  if(id==='gpu-die')return 'silicon';
  return 'package';
}
const names:Record<string,string>={cooling:'Cover & cooling',thermal:'Thermal transfer',silicon:'GPU die · GH100',hbm:'HBM3 memory',package:'Package & interposer',boards:'Circuit boards',power:'Power delivery',structure:'Mounts & fasteners',compute:'Compute clusters',sms:'Streaming multiprocessors',memory:'Cache & memory',media:'Media decoders',interfaces:'Silicon & interfaces'};
export function componentGroups(level:Level):ComponentGroup[] {
  const order=level==='module'?['cooling','thermal','silicon','hbm','package','boards','power','structure']:['compute','sms','memory','media','interfaces'];
  return order.map(id=>({id,name:names[id],parts:partsForLevel(level).filter(p=>groupId(p)===id)})).filter(g=>g.parts.length);
}
