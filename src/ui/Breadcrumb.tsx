import { useShowcase } from '../store/useShowcase';

export function Breadcrumb() {
  const level = useShowcase((s) => s.level);
  const enterDie = useShowcase((s) => s.enterDie);
  const backToModule = useShowcase((s) => s.backToModule);
  return (
    <div className="breadcrumb-wrap">
      {level === 'die' && <div className="breadcrumb__caption">Inside the die</div>}
      <nav className="breadcrumb" aria-label="Level">
        <button
          type="button"
          className={`breadcrumb__item ${level === 'module' ? 'is-active' : ''}`}
          onClick={() => level === 'die' && backToModule()}
        >
          MODULE
        </button>
        <span className="breadcrumb__sep" aria-hidden="true">
          ›
        </span>
        <button
          type="button"
          className={`breadcrumb__item ${level === 'die' ? 'is-active' : ''}`}
          onClick={() => level === 'module' && enterDie()}
        >
          DIE
        </button>
      </nav>
    </div>
  );
}
