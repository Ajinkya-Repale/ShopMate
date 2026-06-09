import { useState, useEffect, useRef } from 'react';
import { productAPI, cartAPI } from './api';
import './Hero.css';

const STATS = [
  { num: '50K+', label: 'Products curated' },
  { num: '120K+', label: 'Happy customers' },
  { num: '4.9★', label: 'Average rating' },
];

const FALLBACK = [
  { id: 1, name: 'Italian Leather Tote', category: 'Fashion', brand: 'Premium', price: 8999, discountedPrice: 5499, images: [] },
  { id: 2, name: 'Smart Watch Series 7', category: 'Electronics', brand: 'Tech', price: 7499, discountedPrice: 5999, images: [] },
  { id: 3, name: 'Wireless ANC Headphones', category: 'Electronics', brand: 'Audio', price: 11999, discountedPrice: 8499, images: [] },
  { id: 4, name: 'Artisan Ceramic Vase', category: 'Home', brand: 'Decor', price: 1799, discountedPrice: 1249, images: [] },
];

const ICONS = ['👜', '⌚', '🎧', '🌿', '💄', '👟', '📱', '🕶️'];

function getDiscount(original, discounted) {
  if (!discounted || discounted >= original) return null;
  return Math.round(((original - discounted) / original) * 100);
}

function getPrice(p) {
  return p.discountedPrice > 0 && p.discountedPrice < p.price ? p.discountedPrice : p.price;
}

const Hero = ({ onExplore }) => {
  const [products, setProducts] = useState([]);
  const [cur, setCur] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState('');
  const timerRef = useRef(null);
  const phaseRef = useRef('idle');

  useEffect(() => {
    productAPI.getAll()
      .then(data => {
        const valid = (data || []).filter(p => p && p.name);
        setProducts(valid.length >= 2 ? valid.slice(0, 4) : FALLBACK);
      })
      .catch(() => setProducts(FALLBACK));
  }, []);

  const scheduleNext = (fromIdx, total) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => transition((fromIdx + 1) % total), 4000);
  };

  const transition = (nextIdx) => {
    if (phaseRef.current !== 'idle') return;
    phaseRef.current = 'out';
    setPhase('out');
    setTimeout(() => {
      setCur(nextIdx);
      phaseRef.current = 'in';
      setPhase('in');
      setTimeout(() => {
        phaseRef.current = 'idle';
        setPhase('idle');
        scheduleNext(nextIdx, products.length);
      }, 450);
    }, 350);
  };

  const goTo = (idx) => {
    if (idx === cur || phaseRef.current !== 'idle') return;
    clearTimeout(timerRef.current);
    transition(idx);
  };

  useEffect(() => {
    if (!products.length) return;
    scheduleNext(cur, products.length);
    return () => clearTimeout(timerRef.current);
  }, [products]);

  const handleAddToCart = async () => {
    const p = products[cur];
    if (!p) return;
    setCartLoading(true);
    try {
      await cartAPI.addToCart(p.id, 1);
      setCartMsg('Added!');
      setTimeout(() => setCartMsg(''), 2000);
    } catch {
      setCartMsg('Login to add');
      setTimeout(() => setCartMsg(''), 2000);
    } finally {
      setCartLoading(false);
    }
  };

  const p = products[cur];
  const spotPrice = p ? getPrice(p) : null;
  const discount = p ? getDiscount(p.price, p.discountedPrice) : null;
  const spotImg = p?.images?.length > 0 ? p.images[0] : null;
  const fallbackIcon = ICONS[cur % ICONS.length];
  const cardClass = `spot-card${phase === 'out' ? ' spot-card--out' : phase === 'in' ? ' spot-card--in' : ''}`;

  return (
    <section className="hero">
      {/* LEFT */}
      <div className="hero__left">
        <p className="hero__overline">Season 2026 — New Arrivals</p>

        <h1 className="hero__title">
          The New{' '}
          <span className="hero__title--italic">Way</span> to{' '}
          <span className="hero__title--outline">Shop</span>
        </h1>

        <div className="hero__stats">
          {STATS.map((s, i) => (
            <div key={s.num} className="hero__stat-row">
              {i > 0 && <div className="hero__stat-divider" />}
              <div>
                <div className="hero__stat-num">{s.num}</div>
                <div className="hero__stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="hero__desc">
          ShopMate redefines online shopping with curated collections, smart
          search, and personalised experiences — all in one beautiful platform.
        </p>

        <div className="hero__btns">
          <button className="btn--warm" onClick={onExplore}>Explore Collections →</button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero__right">
        <div className="hero__spotlight">
          <p className="hero__featured-label">Editor's Pick</p>

          {p ? (
            <div className={cardClass}>
              {/* BIG image */}
              <div className="spot-visual">
                {spotImg ? (
                  <img
                    src={spotImg}
                    alt={p.name}
                    className="spot-img"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span
                  className="spot-icon"
                  style={{ display: spotImg ? 'none' : 'block' }}
                >
                  {fallbackIcon}
                </span>
              </div>

              {/* Info block — wrapped for tablet row layout */}
              <div className="spot-info">
                <div className="spot-meta">
                  <div className="spot-name">{p.name}</div>
                  <div className="spot-cat">
                    {p.category}{p.brand ? ` · ${p.brand}` : ''}
                  </div>
                </div>

                <div className="spot-bottom">
                  <div className="spot-pricing">
                    <span className="spot-price">
                      ₹{spotPrice?.toLocaleString('en-IN')}
                    </span>
                    {discount && (
                      <>
                        <span className="spot-old">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span className="spot-badge">-{discount}%</span>
                      </>
                    )}
                  </div>
                  <button
                    className={`spot-cta${cartLoading ? ' spot-cta--loading' : ''}${cartMsg ? ' spot-cta--msg' : ''}`}
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                  >
                    {cartMsg || (cartLoading ? '...' : 'Add to Cart')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="spot-skeleton">
              <div className="skel skel--visual" />
              <div className="skel skel--title" />
              <div className="skel skel--sub" />
              <div className="skel skel--price" />
            </div>
          )}
        </div>

        {/* Queue */}
        <div className="hero__queue">
          {(products.length ? products : FALLBACK).map((item, i) => {
            const qImg = item.images?.length > 0 ? item.images[0] : null;
            const qPrice = getPrice(item);
            return (
              <div
                key={item.id || i}
                className={`q-item${i === cur ? ' q-item--active' : ''}`}
                onClick={() => goTo(i)}
              >
                <div className="q-visual">
                  {qImg
                    ? <img src={qImg} alt={item.name} className="q-img"
                        onError={e => { e.target.style.display = 'none'; }} />
                    : <span className="q-icon">{ICONS[i % ICONS.length]}</span>
                  }
                </div>
                <div className="q-name">{item.name}</div>
                <div className="q-price">₹{qPrice?.toLocaleString('en-IN')}</div>
                {i === cur && <div className="q-progress" key={`prog-${cur}`} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;




