import { describe, expect, it } from 'vitest';
import { dieParts, getPart, moduleParts } from '../data';
import { partTargetBox } from '../lib/framing';
import { Vector3 } from 'three';
import { STUDIO_DIRECTION } from '../lib/inventory';
import { MATERIALS } from '../data/materials';

const all = [...moduleParts, ...dieParts];

describe('part data integrity', () => {
  it('has unique ids across both levels', () => {
    const ids = all.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every part two paragraphs, three stats and a source note', () => {
    for (const p of all) {
      expect(p.paragraphs, p.id).toHaveLength(2);
      for (const para of p.paragraphs) expect(para.length, p.id).toBeGreaterThan(40);
      expect(p.stats, p.id).toHaveLength(3);
      for (const s of p.stats) {
        expect(s.value.length, p.id).toBeGreaterThan(0);
        expect(s.label.length, p.id).toBeGreaterThan(0);
      }
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.subtitle.length).toBeGreaterThan(0);
      expect(p.note, p.id).toBeTruthy();
    }
  });

  it('has finite positions and explode vectors', () => {
    for (const p of all) {
      for (const v of [...p.basePosition, ...p.explodeVector]) expect(Number.isFinite(v), p.id).toBe(true);
    }
  });

  it('lifts module layers vertically while preserving the die detail layout', () => {
    for (const part of moduleParts) {
      expect(part.explodeVector[0], part.id).toBe(0);
      expect(part.explodeVector[2], part.id).toBe(0);
    }
    for (const part of dieParts) expect(part.explodeVector[1], part.id).toBe(0);
    expect(moduleParts.length).toBeGreaterThan(70);
    const hbm = moduleParts.filter(p => p.geometry.kind === 'hbm');
    expect(hbm).toHaveLength(6);
    for (const part of hbm) {
      if (part.geometry.kind === 'hbm') expect(part.geometry.positions).toHaveLength(1);
    }
    expect(moduleParts.filter(p => p.id === 'power-delivery' || p.id.startsWith('power-component-'))).toHaveLength(66);
    expect(getPart('gpu-die')?.drillInto).toBe('die');
  });

  it('lays out the die as two rows of four GPCs with an independently selectable representative SM', () => {
    const gpcs = dieParts.filter((p) => p.id.startsWith('gpc-'));
    expect(gpcs).toHaveLength(8);
    const rows = new Set(gpcs.map((g) => g.basePosition[2]));
    expect(rows.size).toBe(2);
    const withSm = gpcs.filter((g) => g.geometry.kind === 'region' && g.geometry.sm);
    expect(withSm).toHaveLength(0);
    expect(getPart('sm')?.geometry.kind).toBe('region');
    expect(getPart('media-engines')?.geometry.kind).toBe('region');
    expect(dieParts.some((p) => /nvenc|display/i.test(p.name))).toBe(false);
  });

  it('states enabled H100 SXM5 figures, not full-design counts, as product stats', () => {
    const die = getPart('gpu-die')!;
    expect(die.stats.map((s) => s.value)).toEqual(['80 billion', '132', '50 MB']);
    const hbm = getPart('hbm')!;
    expect(hbm.stats[0].value).toBe('80 GB');
    expect(hbm.stats[2].value).toBe('5 active');
    const mc = getPart('memory-controllers')!;
    expect(mc.stats[0].value).toBe('10 x 512-bit');
  });

  it('leaves every rendered part separate in the viewing plane at full explosion', () => {
    for (const parts of [moduleParts, dieParts]) {
      const right=new Vector3().crossVectors(new Vector3(0,1,0),STUDIO_DIRECTION).normalize();
      const up=new Vector3().crossVectors(STUDIO_DIRECTION,right).normalize();
      const project=(box: ReturnType<typeof partTargetBox>)=>{
        const xs:number[]=[],ys:number[]=[];
        for(const x of [box.min[0],box.max[0]])for(const y of [box.min[1],box.max[1]])for(const z of [box.min[2],box.max[2]]){const v=new Vector3(x,y,z);xs.push(v.dot(right));ys.push(v.dot(up));}
        return {min:[Math.min(...xs),Math.min(...ys)],max:[Math.max(...xs),Math.max(...ys)]};
      };
      const rendered = parts.filter(p => p.geometry.kind !== 'virtual');
      for (let i = 0; i < rendered.length; i++) {
        const a = project(partTargetBox(rendered[i], 1));
        for (let j = i + 1; j < rendered.length; j++) {
          const b = project(partTargetBox(rendered[j], 1));
          const overlapX = Math.min(a.max[0], b.max[0]) - Math.max(a.min[0], b.min[0]);
          const overlapZ = Math.min(a.max[1], b.max[1]) - Math.max(a.min[1], b.min[1]);
          expect(overlapX > 0 && overlapZ > 0, `${rendered[i].id} overlaps ${rendered[j].id}`).toBe(false);
        }
      }
    }
  });

  it('separates conceptual mechanical layers vertically and preserves the silicon inventory', () => {
    const ids = ['support-plate','board','routing-board','package','thermal-interface','cold-plate','heatsink','cover'];
    for (let i = 1; i < ids.length; i++) {
      const below = partTargetBox(getPart(ids[i-1])!, .65);
      const above = partTargetBox(getPart(ids[i])!, .65);
      expect(above.min[1], ids[i]).toBeGreaterThan(below.max[1]);
    }
    expect(getPart('heatsink')?.note).toContain('illustrative');
    expect(dieParts.filter(p => p.id === 'sm' || p.id.startsWith('sm-'))).toHaveLength(132);
    expect(dieParts.filter(p => p.id === 'media-engines' || p.id.startsWith('decoder-'))).toHaveLength(14);
  });

  it('uses valid hex colors for every material', () => {
    for (const [kind, m] of Object.entries(MATERIALS)) {
      expect(m.color, kind).toMatch(/^#[0-9a-f]{6}$/i);
      expect(m.roughness).toBeGreaterThanOrEqual(0);
      expect(m.metalness).toBeLessThanOrEqual(1);
    }
  });
});
