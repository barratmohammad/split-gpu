import { getPart, partsForLevel } from '../data';
import type { Level } from '../data/types';
import { useShowcase } from '../store/useShowcase';

const FOOTER: Record<Level, string> = {
  module: 'Conceptual teardown · Mechanical construction illustrative',
  die: 'Source: NVIDIA Hopper architecture · Schematic, positions simplified',
};

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="chip">
      <div className="chip__value">{value}</div>
      <div className="chip__label">{label}</div>
    </div>
  );
}

function Intro({ level }: { level: Level }) {
  const enterDie = useShowcase((s) => s.enterDie);
  const backToModule = useShowcase((s) => s.backToModule);
  if (level === 'module') {
    return (
      <>
        <h1 className="panel__title">H100 SXM</h1>
        <p className="panel__subtitle">GH100 silicon, HBM3 memory and onboard power circuitry.</p>
        <p className="panel__body">
          Explore the layers of a GPU assembly, from its supporting board and power circuitry to memory, silicon and cooling.
        </p>
        
        <p className="panel__body">
          Drag the slider to lift the layers apart. Orbit to inspect the board, or select the silicon die to explore its architecture.
        </p>
        <div className="chips">
          <StatChip value="700 W" label="max configurable TDP" />
          <StatChip value="80 GB" label="HBM3" />
          <StatChip value="132" label="enabled SMs" />
        </div>
        <button type="button" className="panel__action" onClick={enterDie}>
          Explore inside the die
        </button>
      </>
    );
  }
  return (
    <>
      <h1 className="panel__title">GH100 architecture</h1>
      <p className="panel__subtitle">A schematic of what is etched into the silicon.</p>
      <p className="panel__body">
        Eight compute clusters sit in two rows with the shared L2 cache between them, memory controllers on both
        edges, PCIe and the GigaThread engine across the top and NVLink along the bottom. Drag the slider toward
        Detail to spread the individual regions horizontally.
      </p>
      <p className="panel__body">
        These are regions of one die, not separate chips. Click any region, or any of the 132 individually selectable SMs in the logical inventory beside the die.
      </p>
      <div className="chips">
        <StatChip value="8" label="GPCs" />
        <StatChip value="50 MB" label="L2 cache" />
        <StatChip value="900 GB/s" label="NVLink" />
      </div>
      <button type="button" className="panel__action panel__action--secondary" onClick={backToModule}>
        Back to module
      </button>
    </>
  );
}

export function InfoPanel() {
  const selectedId = useShowcase((s) => s.selectedId);
  const level = useShowcase((s) => s.level);
  const backToModule = useShowcase((s) => s.backToModule);
  const part = selectedId ? getPart(selectedId) : undefined;

  return (
    <aside className={`panel ${selectedId === 'gpu-die' ? 'panel--hero' : 'panel--detail'}`} key={selectedId ?? `intro-${level}`}>
      <div className="panel__caption">{level === 'module' ? 'Inside the GPU assembly' : 'GH100 architecture'}</div>
      {!part ? (
        <Intro level={level} />
      ) : (
        <>
          <h1 className="panel__title">{part.name}</h1>
          {part.subtitle !== 'Inside the GPU assembly' && <p className="panel__subtitle">{part.subtitle}</p>}
          {[part.paragraphs[0]].map((p, i) => (
            <p key={i} className="panel__body">
              {p}
            </p>
          ))}
          {part.level === 'die' ? (
            <button type="button" className="panel__action panel__action--secondary" onClick={backToModule}>
              Back to module
            </button>
          ) : null}
        </>
      )}
      <details className="panel__details">
        <summary>More details</summary>
        {part && <div className="chips">
          {part.stats.map((s) => <StatChip key={s.label} value={s.value} label={s.label} />)}
        </div>}
        {part && <p className="panel__note">{part.paragraphs[1]}</p>}
      <label className="part-picker">
        Inspect modeled objects ({partsForLevel(level).length})
        <select value={selectedId ?? ''} onChange={(event) => useShowcase.getState().select(event.target.value || null)}>
          <option value="">All components</option>
          {partsForLevel(level).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
        {part?.sourceUrl && <a className="panel__source" href={part.sourceUrl} target="_blank" rel="noreferrer">Manufacturer reference ↗</a>}
        {part?.note ? <p className="panel__note">{part.note}</p> : null}
        <div className="panel__footer">{FOOTER[level]}</div>
      </details>
    </aside>
  );
}
