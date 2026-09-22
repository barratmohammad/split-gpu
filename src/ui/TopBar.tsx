import { useShowcase } from '../store/useShowcase';

export function TopBar() {
  const resetView = useShowcase((s) => s.resetView);
  return (
    <header className="topbar">
      <div>
        <div className="wordmark">SPLIT GPU</div>
        <div className="schematic-note">NVIDIA H100 SXM5 80 GB · Schematic · Not to scale</div>
      </div>
      <button type="button" className="ghost-button" onClick={resetView}>
        <span className="ghost-button__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
            <path d="M13.5 2.5v3h-3" />
          </svg>
        </span>
        Reset view
      </button>
    </header>
  );
}
