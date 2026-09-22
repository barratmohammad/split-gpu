import { Vector3 } from 'three';
import { partsForLevel } from '../data';
import type { Level, PartDef, Vec3 } from '../data/types';
import { partLocalBox } from './bounds';
import { easeExplode, partPosition } from './explode';

export const STUDIO_DIRECTION=new Vector3(.9,.75,1.8).normalize();
const right=new Vector3().crossVectors(new Vector3(0,1,0),STUDIO_DIRECTION).normalize();
const up=new Vector3().crossVectors(STUDIO_DIRECTION,right).normalize();
const layouts=new Map<Level,Map<string,Vec3>>();
export function inventoryPositions(level:Level):Map<string,Vec3> {
  const cached=layouts.get(level);if(cached)return cached;
  const cards=partsForLevel(level).map(part=>{
    const box=partLocalBox(part.geometry);let xmin=Infinity,xmax=-Infinity,ymin=Infinity,ymax=-Infinity;
    for(const x of [box.min[0],box.max[0]])for(const y of [box.min[1],box.max[1]])for(const z of [box.min[2],box.max[2]]) {
      const v=new Vector3(x,y,z);const a=v.dot(right),b=v.dot(up);xmin=Math.min(xmin,a);xmax=Math.max(xmax,a);ymin=Math.min(ymin,b);ymax=Math.max(ymax,b);
    }
    return {part,w:Math.max(.32,xmax-xmin)+.42,h:Math.max(.24,ymax-ymin)+.42,cx:(xmin+xmax)/2,cy:(ymin+ymax)/2};
  }).sort((a,b)=>b.h-a.h||a.part.id.localeCompare(b.part.id));
  const rowLimit=Math.max(12,Math.sqrt(cards.reduce((sum,c)=>sum+c.w*c.h,0)*1.8));
  let x=0,y=0,rowHeight=0,maxWidth=0;
  const slots=cards.map(c=>{if(x+c.w>rowLimit&&x>0){x=0;y+=rowHeight;rowHeight=0;}const slot={...c,x:x+c.w/2,y:y+c.h/2};x+=c.w;maxWidth=Math.max(maxWidth,x);rowHeight=Math.max(rowHeight,c.h);return slot;});
  const height=y+rowHeight;
  const map=new Map<string,Vec3>();
  for(const slot of slots){const p=right.clone().multiplyScalar(slot.x-maxWidth/2-slot.cx).addScaledVector(up,height/2-slot.y-slot.cy);p.y+=height*.65+1;map.set(slot.part.id,[p.x,p.y,p.z]);}
  layouts.set(level,map);return map;
}
/** First open the assembly; then arrange its actual modeled objects for inspection. */
export function displayPosition(part:PartDef,t:number,out:Vec3=[0,0,0]):Vec3 {
  const amount=Math.max(0,Math.min(1,Number.isFinite(t)?t:0));
  partPosition(part.basePosition,part.explodeVector,Math.min(1,amount/.65),out);
  if(amount>.65){const grid=inventoryPositions(part.level).get(part.id)!;const k=easeExplode((amount-.65)/.35);for(let i=0;i<3;i++)out[i]+=(grid[i]-out[i])*k;}
  return out;
}
