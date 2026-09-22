import { beforeEach, describe, expect, it } from 'vitest';
import { useShowcase } from '../store/useShowcase';
import { moduleParts, dieParts } from '../data';
import { displayPosition } from '../lib/inventory';

describe('studio interactions',()=>{
 beforeEach(()=>useShowcase.getState().backToModule());
 it('exits isolation when closing details, changing explosion or changing levels',()=>{
  const s=useShowcase.getState;
  s().toggleIsolate(); expect(s().isolated).toBe(true);
  s().select(null); expect(s().isolated).toBe(false);
  s().select('gpu-die'); s().toggleIsolate(); s().setExplode(1); expect(s().isolated).toBe(false);
  s().toggleIsolate(); s().enterDie(); expect(s().isolated).toBe(false); expect(s().selectedId).toBeNull();
 });
 it('resets assembly and camera modes',()=>{
  const s=useShowcase.getState;s().setExplode(1);s().toggleRotate();s().toggleIsolate();s().resetView();
  expect(s().explode).toBe(0);expect(s().autoRotate).toBe(false);expect(s().isolated).toBe(false);
 });
 it('preserves assembled coordinates and keeps transition coordinates finite',()=>{
  for(const part of [...moduleParts,...dieParts]){
   expect(displayPosition(part,0)).toEqual(part.basePosition);
   for(const amount of [.2,.65,.8,1]) expect(displayPosition(part,amount).every(Number.isFinite)).toBe(true);
  }
 });
});
