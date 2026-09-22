import { useShowcase } from '../store/useShowcase';

const LABELS = {
  module: ['ASSEMBLED', 'EXPLODED'],
  die: ['OVERVIEW', 'DETAIL'],
} as const;

export function ExplodeSlider() {
  const explode = useShowcase((s) => s.explode);
  const level = useShowcase((s) => s.level);
  const setExplode = useShowcase((s) => s.setExplode);
  const [left, right] = LABELS[level];
  return (
    <div className="slider">
      <span className="slider__label">{left}</span>
      <input
        className="slider__input"
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={explode}
        onChange={(e) => setExplode(Number(e.target.value))}
        aria-label={level === 'module' ? 'Explode amount' : 'Schematic detail'}
        style={{ ['--fill' as string]: `${explode * 100}%` }}
      />
      <span className="slider__label">{right}</span>
    </div>
  );
}
