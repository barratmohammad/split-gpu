import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getPart, partsForLevel } from '../data';
import { componentGroups, groupId } from '../data/groups';
import { useShowcase } from '../store/useShowcase';

type IconName='layers'|'plus'|'minus'|'reset'|'rotate'|'expand'|'help'|'box'|'close'|'target'|'chevron';
const paths:Record<IconName,ReactNode>={
 layers:<><path d="m3 7 9-5 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
 plus:<path d="M12 4v16M4 12h16"/>,minus:<path d="M4 12h16"/>,reset:<><path d="M4 9a8 8 0 1 1 0 7M4 3v6h6"/></>,
 rotate:<><ellipse cx="12" cy="12" rx="5" ry="10"/><path d="M21 10c-1-3-5-5-9-5S3 7 3 10s4 5 9 5h7m-3-3 4 3-4 3"/></>,
 expand:<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/>,
 help:<><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v.1"/></>,
 box:<><path d="m3 6 9-4 9 4v12l-9 4-9-4V6Zm0 0 9 5 9-5M12 11v11M7 4l10 5"/></>,
 close:<path d="m5 5 14 14M19 5 5 19"/>,target:<><circle cx="12" cy="12" r="8"/><path d="M12 1v6m0 10v6M1 12h6m10 0h6"/></>,chevron:<path d="m9 5 7 7-7 7"/>
};
function Icon({name}:{name:IconName}){return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;}
function Tool({name,label,onClick,active=false}:{name:IconName;label:string;onClick:()=>void;active?:boolean}){return <button className={`tool ${active?'active':''}`} title={label} aria-label={label} aria-pressed={active} onClick={onClick}><Icon name={name}/></button>;}

export function Studio() {
 const s=useShowcase();const selected=s.selectedId?getPart(s.selectedId):undefined;
 const groups=componentGroups(s.level);const group=selected?groups.find(g=>g.id===groupId(selected)):undefined;
 const [tab,setTab]=useState<'overview'|'working'>('overview');const [fullscreen,setFullscreen]=useState(false);const [notice,setNotice]=useState('');
 const helpClose=useRef<HTMLButtonElement>(null);const helpTrigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setTab('overview');},[s.selectedId]);
 useEffect(()=>{const changed=()=>setFullscreen(!!document.fullscreenElement);document.addEventListener('fullscreenchange',changed);return()=>document.removeEventListener('fullscreenchange',changed);},[]);
 useEffect(()=>{if(s.helpOpen)helpClose.current?.focus();},[s.helpOpen]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(useShowcase.getState().helpOpen){useShowcase.getState().toggleHelp();helpTrigger.current?.focus();}else if(useShowcase.getState().isolated)useShowcase.getState().toggleIsolate();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 const toggleFullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else setNotice('Fullscreen is not supported in this browser.');}catch{setNotice('Fullscreen is unavailable. You can use your browser’s fullscreen command.');}};
 return <>
  <header className="studio-brand"><span>SPLIT GPU</span><h1>H100 STUDIO</h1><nav aria-label="Model level"><button className={s.level==='module'?'active':''} onClick={s.backToModule}>Module</button><span>/</span><button className={s.level==='die'?'active':''} onClick={s.enterDie}>Inside the die</button></nav></header>
  {s.componentsOpen&&<aside className="component-nav studio-panel" aria-label="Components">
    <div className="panel-heading"><h2>Components</h2><Tool name="close" label="Hide components" onClick={s.toggleComponents}/></div>
    <div className="component-rows">{groups.map((g,i)=><button key={g.id} className={`component-row ${group?.id===g.id?'selected':''}`} aria-pressed={group?.id===g.id} onClick={()=>s.select(g.parts[0].id)}><small>{String(i+1).padStart(2,'0')}</small><span>{g.name}</span><Icon name="chevron"/></button>)}</div>
  </aside>}
  {selected&&<aside className="studio-detail studio-panel" aria-label="Component details">
    <div className="panel-heading"><span>{group?.name}<small className="model-kind">Illustrative</small></span><Tool name="close" label="Close details" onClick={()=>s.select(null)}/></div>
    <div className="detail-content"><h2>{selected.name}</h2>
      <div className="detail-tabs" role="tablist" aria-label="Component information">
        <button id="tab-overview" role="tab" aria-controls="component-copy" aria-selected={tab==='overview'} onClick={()=>setTab('overview')}>Overview</button>
        <button id="tab-working" role="tab" aria-controls="component-copy" aria-selected={tab==='working'} onClick={()=>setTab('working')}>How it works</button>
      </div>
      <p id="component-copy" role="tabpanel" aria-labelledby={`tab-${tab==='overview'?'overview':'working'}`} className="detail-copy">{selected.paragraphs[tab==='overview'?0:1]}</p>
      <dl className="detail-stats">{selected.stats.map(stat=><div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>
      {group&&group.parts.length>1&&<label className="piece-picker">Individual pieces <select value={selected.id} onChange={e=>s.select(e.target.value)}>{group.parts.map((p,i)=><option key={p.id} value={p.id}>{String(i+1).padStart(2,'0')} · {p.name}</option>)}</select></label>}
      <button className={`isolate-button ${s.isolated?'active':''}`} onClick={s.toggleIsolate}><Icon name={s.isolated?'layers':'target'}/>{s.isolated?'Show everything':'Isolate piece'}</button>
      {selected.drillInto==='die'&&<button className="inside-button" onClick={s.enterDie}>Explore inside the die <span>↗</span></button>}
      <a className="studio-source" href={selected.sourceUrl??(s.level==='module'?'https://pubs.lenovo.com/sr685a-v3/remove_an_h100_gpu':'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/')} target="_blank" rel="noreferrer">{selected.sourceUrl?'Manufacturer reference':'Hardware reference'} ↗</a>
    </div>
  </aside>}
  <nav className="view-tools studio-panel" aria-label="View controls">
    <Tool name="layers" label="Toggle components" active={s.componentsOpen} onClick={s.toggleComponents}/><hr/>
    <Tool name="plus" label="Zoom in" onClick={()=>s.zoom(1)}/><Tool name="minus" label="Zoom out" onClick={()=>s.zoom(-1)}/>
    <Tool name="reset" label="Reset view" onClick={s.resetView}/><Tool name="rotate" label="Auto rotate" active={s.autoRotate} onClick={s.toggleRotate}/><hr/>
    <Tool name="expand" label="Toggle fullscreen" active={fullscreen} onClick={()=>void toggleFullscreen()}/>
    <button ref={helpTrigger} className={`tool ${s.helpOpen?'active':''}`} title="Help" aria-label="Help" aria-expanded={s.helpOpen} onClick={s.toggleHelp}><Icon name="help"/></button>
  </nav>
  <section className="explode-dock studio-panel" aria-label="Assembly controls">
    <button className={`dock-button ${s.explode===0?'active':''}`} aria-label="Assemble GPU" onClick={()=>s.setExplode(0)}><Icon name="box"/><span>Assemble</span></button>
    <div className="explode-control"><div><label htmlFor="studio-explode">Explode</label><output htmlFor="studio-explode">{s.explode===1?`${partsForLevel(s.level).length} pieces`:`${Math.round(s.explode*100)}%`}</output></div><input id="studio-explode" aria-label="Explode amount" type="range" min="0" max="1" step="0.005" value={s.explode} onChange={e=>s.setExplode(Number(e.target.value))} style={{'--progress':`${s.explode*100}%`} as React.CSSProperties}/></div>
    <button className={`dock-button ${s.explode===1?'active':''}`} aria-label="Separate all parts" onClick={()=>s.setExplode(1)}><Icon name="expand"/><span>All parts</span></button>
    <span className="dock-divider"/>
    <button className="labels-control" role="switch" aria-label="Show labels" aria-checked={s.labels} onClick={s.toggleLabels}><span className={`switch ${s.labels?'on':''}`}><i/></span><span>Labels</span></button>
  </section>
  {s.isolated&&<button className="isolation-status" onClick={s.toggleIsolate}>Isolated view · Show everything</button>}
  {s.helpOpen&&<div className="help-backdrop" onClick={s.toggleHelp}><section className="help-panel studio-panel" role="dialog" aria-modal="true" aria-label="Studio help" onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Tab'){e.preventDefault();helpClose.current?.focus();}}}><div className="panel-heading"><h2>Explore the GPU</h2><button ref={helpClose} className="tool" aria-label="Close help" onClick={()=>{s.toggleHelp();helpTrigger.current?.focus();}}><Icon name="close"/></button></div><p>Drag to orbit. Scroll or pinch to zoom. Select any modeled piece to inspect it.</p><p>The slider first opens the assembly, then arranges the pieces individually. All parts jumps to the complete layout. Isolate piece lets you examine one object.</p><p>Escape closes help or exits isolation. Labels, auto rotation and fullscreen are available in the controls.</p><p className="help-note">An educational H100 visualization. Mechanical construction and tiny component geometry are illustrative. The piece count describes this model, not a complete manufacturer parts catalog.</p></section></div>}
  {notice&&<button className="studio-notice" onClick={()=>setNotice('')}>{notice} ×</button>}
 </>;
}
