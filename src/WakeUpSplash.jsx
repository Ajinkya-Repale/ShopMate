import { useState, useEffect, useRef } from 'react';
import './WakeUpSplash.css';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://shopmate-backend-m8ql.onrender.com';
const HEALTH_ENDPOINT = `${BACKEND_URL}/api/products`;
const POLL_INTERVAL = 4000;
const MAX_WAIT_MS  = 180000; // 3 min

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
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false); // backend ready
  const [visible, setVisible]   = useState(true);  // for fade-out

  const startRef = useRef(Date.now());
  const stopRef  = useRef(false);

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

  /* progress animation — ease toward 85%, stall there until backend ready */
  useEffect(() => {
    const id = setInterval(() => {
      setProgress(prev => {
        if (done) return prev; // freeze until jump to 100
        const elapsed = (Date.now() - startRef.current) / 1000;
        // easeOut curve: fast early, slows near 85
        const target = 85 * (1 - Math.exp(-elapsed / 30));
        return Math.max(prev, Math.min(target, 85));
      });
    }, 300);
    return () => clearInterval(id);
  }, [done]);

  /* poll backend */
  useEffect(() => {
    stopRef.current = false;
    let timeoutId;

    const check = async () => {
      if (stopRef.current) return;

      try {
        const res = await fetch(HEALTH_ENDPOINT, { signal: AbortSignal.timeout(8000) });
        if (res.ok && !stopRef.current) {
          setDone(true);
          setProgress(100);
          // wait for bar to animate to 100%, then fade out, then call onReady
          setTimeout(() => {
            setVisible(false);
            setTimeout(onReady, 500); // after fade
          }, 800);
          return;
        }
      } catch {
        /* still sleeping */
      }

      if (Date.now() - startRef.current < MAX_WAIT_MS) {
        timeoutId = setTimeout(check, POLL_INTERVAL);
      }
    };

    check();
    return () => {
      stopRef.current = true;
      clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`wus-root${!visible ? ' wus-fadeout' : ''}`}>
      <div className="wus-orb wus-orb1" />
      <div className="wus-orb wus-orb2" />

      <div className="wus-card">
        <div className="wus-logo">
          <span className="wus-logo-icon">🛍</span>
          <span className="wus-logo-text">ShopMate</span>
        </div>

        {!done && (
          <div className="wus-spinner-wrap">
            <div className="wus-spinner" />
            <div className="wus-spinner wus-spinner2" />
          </div>
        )}

        <p className="wus-title">
          {done ? 'Ready!' : `Waking up the server${dots}`}
        </p>
        <p className="wus-sub">
          {done
            ? 'Taking you to the store…'
            : <>Our backend is starting up on Render's free plan.<br />This takes <strong>up to 60 seconds</strong> — hang tight!</>
          }
        </p>

        <div className="wus-bar-track">
          <div className="wus-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="wus-elapsed">{Math.round(progress)}%</p>

        {!done && (
          <div className="wus-tip-box">
            <span className="wus-tip-label">💡 Did you know?</span>
            <p className="wus-tip-text" key={tip}>{TIPS[tip]}</p>
          </div>
        )}
      </div>
    </div>
  );
}