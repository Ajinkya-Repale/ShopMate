import { useState, useEffect, useCallback } from 'react';
import { productAPI, cartAPI, wishlistAPI } from './api';
import './Dealspage.css';

/* ── Icons ── */
const IconArrowLeft = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconCart = ({ size = 14, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const IconHeart = ({ filled = false, size = 14, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconTag = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconSearch = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconWarning = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconClose = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconFire = ({ size = 14, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C9.5 5 8 7.5 9.5 10c.5.8 1 1.5 1 2.5 0 1.5-1.5 2.5-1.5 2.5s.5-2-1-3.5C6.5 10 5 8 5 5.5 3.5 7.5 3 10 3 12c0 5 4 9 9 9s9-4 9-9c0-4-3-7.5-5-9-.5 2-2 3.5-4 3.5z"/>
  </svg>
);

/* ── Helpers ── */
const renderStars = (rating = 0) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

const SORT_OPTIONS = [
  { value: 'discount_desc', label: 'Biggest Discount' },
  { value: 'price_asc',     label: 'Price: Low to High' },
  { value: 'price_desc',    label: 'Price: High to Low' },
  { value: 'rating',        label: 'Avg. Customer Review' },
  { value: 'savings',       label: 'Most Savings (₹)' },
  { value: 'newest',        label: 'Newest First' },
];

const DISCOUNT_CHIPS = [
  { label: 'All Deals', min: 1 },
  { label: '10%+', min: 10 },
  { label: '20%+', min: 20 },
  { label: '30%+', min: 30 },
  { label: '50%+', min: 50 },
  { label: '70%+', min: 70 },
];

const getRibbonClass = (pct) => {
  if (pct >= 50) return 'deals-card__ribbon deals-card__ribbon--mega';
  if (pct >= 30) return 'deals-card__ribbon deals-card__ribbon--hot';
  return 'deals-card__ribbon';
};

/* ══════════════════════════════════════════ */

const DealsPage = ({ onBack, onCartUpdate }) => {
  const [allProducts,     setAllProducts]     = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [wishlist,        setWishlist]        = useState([]);
  const [cartLoading,     setCartLoading]     = useState(null);
  const [feedback,        setFeedback]        = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [sort,           setSort]           = useState('discount_desc');
  const [minDiscount,    setMinDiscount]    = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');

  /* hide scrollbar */
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'deals-hide-scroll';
    style.textContent = 'html::-webkit-scrollbar{display:none!important}body::-webkit-scrollbar{display:none!important}';
    document.documentElement.style.scrollbarWidth = 'none';
    document.head.appendChild(style);
    return () => {
      document.getElementById('deals-hide-scroll')?.remove();
      document.documentElement.style.scrollbarWidth = '';
    };
  }, []);

  /* lock scroll on modal */
  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  /* load products */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAll();
        const discounted = (data || []).filter(
          (p) => p.discountPercent > 0 && p.discountedPrice > 0 && p.discountedPrice < p.price
        );
        setAllProducts(discounted);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* load wishlist */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    wishlistAPI.getWishlist()
      .then((d) => setWishlist((d || []).map((p) => p.id || p._id || p)))
      .catch(() => {});
  }, []);

  /* escape key */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedProduct(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleAddToCart = useCallback(async (productId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return showFeedback('Please login to add to cart');
    try {
      setCartLoading(productId);
      await cartAPI.addToCart(productId, 1);
      showFeedback('Added to cart!');
      onCartUpdate?.();
    } catch (err) {
      showFeedback(err.message);
    } finally {
      setCartLoading(null);
    }
  }, [onCartUpdate]);

  const handleWishlist = useCallback(async (productId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return showFeedback('Please login');
    try {
      if (wishlist.includes(productId)) {
        await wishlistAPI.remove(productId);
        setWishlist((p) => p.filter((id) => id !== productId));
      } else {
        await wishlistAPI.add(productId);
        setWishlist((p) => [...p, productId]);
      }
    } catch (err) {
      showFeedback(err.message);
    }
  }, [wishlist]);

  /* derived */
  const categories = ['All', ...new Set(allProducts.map((p) => p.category).filter(Boolean))].sort(
    (a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b))
  );

  const filtered = allProducts
    .filter((p) => {
      if (p.discountPercent < minDiscount) return false;
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      return true;
    })
    .sort((a, b) => {
      const pa = a.discountedPrice, pb = b.discountedPrice;
      if (sort === 'discount_desc') return b.discountPercent - a.discountPercent;
      if (sort === 'price_asc')     return pa - pb;
      if (sort === 'price_desc')    return pb - pa;
      if (sort === 'rating')        return (b.ratings || 0) - (a.ratings || 0);
      if (sort === 'savings')       return (b.price - b.discountedPrice) - (a.price - a.discountedPrice);
      if (sort === 'newest')        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });

  const maxDiscount = allProducts.length ? Math.max(...allProducts.map((p) => p.discountPercent)) : 0;
  const avgDiscount = allProducts.length
    ? Math.round(allProducts.reduce((s, p) => s + p.discountPercent, 0) / allProducts.length)
    : 0;

  /* ── Render ── */
  return (
    <div className="deals-page">
      {feedback && <div className="deals-toast" role="status" aria-live="polite">{feedback}</div>}

      {/* Breadcrumb */}
      {onBack && (
        <div className="deals-breadcrumb">
          <button className="deals-breadcrumb__btn" onClick={onBack}>
            <IconArrowLeft size={13} />
            Home
          </button>
          <span className="deals-breadcrumb__sep">/</span>
          <span className="deals-breadcrumb__current">Deals</span>
        </div>
      )}

      {/* Banner */}
      <div className="deals-banner">
        <div className="deals-banner__left">
          <div className="deals-banner__eyebrow">Limited Time Offers</div>
          <h1 className="deals-banner__title">
            Today's Best <span>Deals</span>
          </h1>
          <p className="deals-banner__sub">Handpicked discounts across all categories</p>
        </div>
        {!loading && allProducts.length > 0 && (
          <div className="deals-banner__stats">
            <div className="deals-banner__stat">
              <span className="deals-banner__stat-val">{allProducts.length}</span>
              <span className="deals-banner__stat-label">Deals Live</span>
            </div>
            <div className="deals-banner__stat">
              <span className="deals-banner__stat-val">{maxDiscount}%</span>
              <span className="deals-banner__stat-label">Max Off</span>
            </div>
            <div className="deals-banner__stat">
              <span className="deals-banner__stat-val">{avgDiscount}%</span>
              <span className="deals-banner__stat-label">Avg Discount</span>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="deals-cats" role="tablist" aria-label="Product categories">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`deals-cat ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="deals-toolbar">
        <div className="deals-toolbar__left">
          <div className="deals-toolbar__count">
            <strong>{filtered.length}</strong> deal{filtered.length !== 1 ? 's' : ''} found
          </div>
          <div className="deals-chips-wrap">
            <div className="deals-chips" role="group" aria-label="Discount filter">
              {DISCOUNT_CHIPS.map((chip) => (
                <button
                  key={chip.min}
                  className={`deals-chip ${minDiscount === chip.min ? 'active' : ''}`}
                  onClick={() => setMinDiscount(chip.min)}
                  aria-pressed={minDiscount === chip.min}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="deals-sort">
          <label className="deals-sort__label" htmlFor="deals-sort-select">Sort:</label>
          <select
            id="deals-sort-select"
            className="deals-sort__select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="deals-state" aria-live="polite">
          <div className="deals-spinner" role="status" aria-label="Loading deals" />
          <p>Loading deals…</p>
        </div>
      )}

      {!loading && error && (
        <div className="deals-state deals-state--error" role="alert">
          <IconWarning size={32} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="deals-state">
          <IconSearch size={36} style={{ opacity: 0.4 }} />
          <p>No deals match your filters.</p>
          <button
            className="deals-clear-btn"
            onClick={() => { setMinDiscount(1); setActiveCategory('All'); }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="deals-grid">
          {filtered.map((p) => {
            const savings = p.price - p.discountedPrice;
            const isMega = p.discountPercent >= 50;
            return (
              <div
                key={p.id}
                className="deals-card"
                onClick={() => setSelectedProduct(p)}
                role="button"
                tabIndex={0}
                aria-label={`${p.name}, ${p.discountPercent}% off, ₹${p.discountedPrice.toLocaleString()}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProduct(p); } }}
              >
                <div className={getRibbonClass(p.discountPercent)} aria-hidden="true">
                  {isMega && <IconFire size={11} style={{ marginRight: 2, verticalAlign: 'middle' }} />}
                  -{p.discountPercent}%
                </div>

                <div className="deals-card__img-wrap">
                  {!p.inStock && <div className="deals-card__oos">Out of Stock</div>}
                  <button
                    className="deals-card__wish"
                    onClick={(e) => handleWishlist(p.id, e)}
                    aria-label={wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <IconHeart filled={wishlist.includes(p.id)} size={14} />
                  </button>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} className="deals-card__img" onError={(e) => { e.target.style.display = 'none'; }} loading="lazy" />
                    : <div className="deals-card__img-placeholder"><IconTag size={40} style={{ opacity: 0.3 }} /></div>}
                </div>

                <div className="deals-card__body">
                  {p.brand && <div className="deals-card__brand">{p.brand}</div>}
                  <div className="deals-card__name">{p.name}</div>
                  <div className="deals-card__stars" aria-label={`${p.ratings} out of 5 stars`}>
                    <span className="deals-card__stars-val" aria-hidden="true">{renderStars(p.ratings)}</span>
                    <span className="deals-card__stars-count">({p.numReviews || 0})</span>
                  </div>
                  <div className="deals-card__pricing">
                    <span className="deals-card__price">₹{p.discountedPrice.toLocaleString()}</span>
                    <span className="deals-card__original">₹{p.price.toLocaleString()}</span>
                    <span className="deals-card__saving">{p.discountPercent}% off</span>
                  </div>
                  <div className="deals-card__save-amount">You save ₹{savings.toLocaleString()}</div>
                  {p.inStock
                    ? <div className="deals-card__stock--in">✓ In Stock</div>
                    : <div className="deals-card__stock--out">✕ Out of Stock</div>}
                  <button
                    className="deals-card__add-btn"
                    disabled={!p.inStock || cartLoading === p.id}
                    onClick={(e) => handleAddToCart(p.id, e)}
                    aria-label={`Add ${p.name} to cart`}
                  >
                    {cartLoading === p.id
                      ? 'Adding…'
                      : <><IconCart size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />Add to Cart</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div
          className="deals-modal-overlay"
          onClick={() => setSelectedProduct(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedProduct.name}
        >
          <div className="deals-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="deals-modal__close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
            >
              <IconClose size={15} />
            </button>

            <div className="deals-modal__img-wrap">
              <div className="deals-modal__ribbon" aria-hidden="true">-{selectedProduct.discountPercent}%</div>
              {selectedProduct.images?.[0]
                ? <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="deals-modal__img" />
                : <IconTag size={56} style={{ opacity: 0.25 }} />}
            </div>

            <div className="deals-modal__info">
              {selectedProduct.brand && <div className="deals-modal__brand">{selectedProduct.brand}</div>}
              <h2 className="deals-modal__name">{selectedProduct.name}</h2>
              <div className="deals-modal__stars" aria-label={`${selectedProduct.ratings} out of 5 stars`}>
                <span aria-hidden="true">{renderStars(selectedProduct.ratings)}</span>
                <span>({selectedProduct.numReviews || 0} reviews)</span>
              </div>
              <div className="deals-modal__price-row">
                <span className="deals-modal__price">₹{selectedProduct.discountedPrice.toLocaleString()}</span>
                <span className="deals-modal__original">₹{selectedProduct.price.toLocaleString()}</span>
                <span className="deals-modal__badge">{selectedProduct.discountPercent}% OFF</span>
              </div>
              <div className="deals-modal__savings">
                You save ₹{(selectedProduct.price - selectedProduct.discountedPrice).toLocaleString()}
              </div>
              {selectedProduct.description && (
                <p className="deals-modal__desc">{selectedProduct.description}</p>
              )}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <table className="deals-modal__specs">
                  <tbody>
                    {Object.entries(selectedProduct.specs).map(([k, v]) => (
                      <tr key={k}>
                        <td className="deals-modal__spec-key">{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                className="deals-modal__add-btn"
                disabled={!selectedProduct.inStock || cartLoading === selectedProduct.id}
                onClick={(e) => handleAddToCart(selectedProduct.id, e)}
              >
                {cartLoading === selectedProduct.id
                  ? 'Adding…'
                  : <><IconCart size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsPage;




