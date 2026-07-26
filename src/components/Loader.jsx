import { useState, useEffect } from 'react';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setHidden(true), 400);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div className={`loader${hidden ? ' hidden' : ''}`}>
      <div className="loader-ring" />
      <p>Waking the Neural Engine…</p>
    </div>
  );
}
