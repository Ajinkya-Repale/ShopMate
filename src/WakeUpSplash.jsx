import { useState, useEffect, useRef } from 'react';
import './WakeUpSplash.css';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://shopmate-backend-m8ql.onrender.com';
const HEALTH_ENDPOINT = `${BACKEND_URL}/api/products`;
const POLL_INTERVAL = 4000;
const MAX_WAIT_MS  = 90000;

const TIPS = [
  'Browse thousands of curated products across 10+ categories.',
  'Use the Deals page to find limited-time offers.',
  'Save items to your wishlist and shop later.',
  'Track all your orders in real time from My Orders.',
  'Apply coupon codes at checkout for instant savings.',
  'Discover top brands curated just for you.',
];

export default function WakeUpSplash({ onReady }) {
  const [dots, setDots]         = useState('');
  const [tip, setTip]           = useState(0);
  const [elapsed, setElapsed]   = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const startRef   = useRef(Date.now());
  const stopRef    = useRef(false);   // use plain ref, not aliveRef — avoids stale closure bug

  /* animated dots */
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(id);
  }, []);

  /* rotate tips */
  useEffect(() => {
    const id = setInterval(() => setTip(t => (t + 1) % TIPS.length), 4000);
    return () => clearInterval(id);
  }, []);

  /* elapsed counter */
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  /* poll backend — runs once on mount, cleans up on unmount */
  useEffect(() => {
    stopRef.current = false;
    let timeoutId;

    const check = async () => {
      if (stopRef.current) return;

      if (Date.now() - startRef.current > MAX_WAIT_MS) {
        setTimedOut(true);
        return;
      }

      try {
        const res = await fetch(HEALTH_ENDPOINT, { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          if (!stopRef.current) onReady();
          return;
        }
      } catch {
        /* backend still sleeping — expected, keep polling */
      }

      timeoutId = setTimeout(check, POLL_INTERVAL);
    };

    check();

    return () => {
      stopRef.current = true;
      clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => window.location.reload();

  return (
    <div className="wus-root">
      <div className="wus-orb wus-orb1" />
      <div className="wus-orb wus-orb2" />

      <div className="wus-card">
        <div className="wus-logo">
          <span className="wus-logo-icon">🛍</span>
          <span className="wus-logo-text">ShopMate</span>
        </div>

        {timedOut ? (
          <>
            <p className="wus-title">Taking longer than usual…</p>
            <p className="wus-sub">The server may be under load. Try refreshing.</p>
            <button className="wus-btn" onClick={handleRetry}>Retry</button>
          </>
        ) : (
          <>
            <div className="wus-spinner-wrap">
              <div className="wus-spinner" />
              <div className="wus-spinner wus-spinner2" />
            </div>

            <p className="wus-title">Waking up the server{dots}</p>
            <p className="wus-sub">
              Our backend is starting up on Render's free plan.<br />
              This takes <strong>up to 60 seconds</strong> — hang tight!
            </p>

            <div className="wus-bar-track">
              <div
                className="wus-bar-fill"
                style={{ width: `${Math.min((elapsed / 60) * 100, 99)}%` }}
              />
            </div>
            <p className="wus-elapsed">{elapsed}s elapsed</p>

            <div className="wus-tip-box">
              <span className="wus-tip-label">💡 Did you know?</span>
              <p className="wus-tip-text" key={tip}>{TIPS[tip]}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}