import { useScrollProgress } from '../hooks/useScrollProgress';

export default function ProgressTracker() {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100);

  return (
    <>
      <div className="progress-track">
        <div className="progress-fill" style={{ height: `${(progress * 100).toFixed(1)}%` }} />
      </div>
      <div className="progress-label">{pct}%</div>
    </>
  );
}
