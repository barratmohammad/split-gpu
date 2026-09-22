import { useShowcase } from '../store/useShowcase';

/** Bottom-left notes shown on the die level: the scene caption and the unplaced decoders. */
export function DieNotes() {
  const level = useShowcase((s) => s.level);
  const select = useShowcase((s) => s.select);
  if (level !== 'die') return null;
  return (
    <div className="die-notes">
      <button type="button" className="die-notes__callout" onClick={() => select('media-engines')}>
        <span className="die-notes__callout-title">Also on die:</span>
        <span>NVDEC · JPEG decoders</span>
      </button>
      <div className="die-notes__caption">Architecture schematic · Positions and sizes simplified</div>
    </div>
  );
}
