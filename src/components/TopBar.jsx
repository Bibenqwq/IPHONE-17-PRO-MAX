import { useScrollProgress } from '../hooks/useScrollProgress';

export default function TopBar() {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100).toString().padStart(2, '0') + '%';

  return (
    <div className="top-bar">
      <div className="brand-mark">
        iPhone <span>17 Pro Max</span>
      </div>
      <div className="hud-right">
        <span>{pct}</span>
        <div className="rec-indicator">
          <span className="rec-dot" />
          A19 PRO
        </div>
      </div>
    </div>
  );
}
