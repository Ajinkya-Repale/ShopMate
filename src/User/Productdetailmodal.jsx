import { useState, useEffect, useCallback } from 'react';
import './ProductDetailModal.css';

/* ─── API helper ─── */
const BASE = import.meta.env.VITE_API_BASE_URL;

async function fetchProduct(productId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/api/products/${productId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Failed to load product (${res.status})`);
  const json = await res.json();
  return json.data ?? json;
}

/* ─── Icons ─── */
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconStar = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const IconPackage = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconTruck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconReturn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

function StarRow({ rating }) {
  return (
    <div className="pdm-stars">
      {[1,2,3,4,5].map((n) => (
        <span key={n} style={{ color: n <= Math.round(rating) ? '#f59e0b' : 'var(--border)' }}>
          <IconStar filled={n <= Math.round(rating)}/>
        </span>
      ))}
    </div>
  );
}

export default function ProductDetailModal({ productId, onClose, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [imgIdx, setImgIdx]   = useState(0);
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true); setError(null); setImgIdx(0); setQty(1);
    fetchProduct(productId)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleKey = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  const handleAddToCart = async () => {
    if (!product || added) return;
    try {
      await onAddToCart?.(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } catch (_) {}
  };

  const images     = product?.images?.length ? product.images : null;
  const salePrice  = product?.discountedPrice > 0 ? product.discountedPrice : product?.price;
  const origPrice  = product?.price;
  const hasDiscount = origPrice > salePrice;
  const discPct    = hasDiscount ? Math.round((1 - salePrice / origPrice) * 100) : 0;

  return (
    <div className="pdm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pdm-drawer">
        <button className="pdm-close" onClick={onClose} aria-label="Close"><IconX/></button>

        {loading && (
          <div className="pdm-center">
            <div className="pdm-spinner"/>
            <span>Loading product…</span>
          </div>
        )}

        {error && <div className="pdm-center pdm-error">{error}</div>}

        {product && !loading && (
          <div className="pdm-content">

            {/* Gallery */}
            <div className="pdm-gallery">
              <div className="pdm-main-img-wrap">
                {images ? (
                  <img key={imgIdx} src={images[imgIdx]} alt={product.name} className="pdm-main-img"/>
                ) : (
                  <div className="pdm-no-img"><IconPackage/></div>
                )}
                {images?.length > 1 && (
                  <>
                    <button className="pdm-img-nav pdm-img-nav--left"
                      onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}>
                      <IconChevronLeft/>
                    </button>
                    <button className="pdm-img-nav pdm-img-nav--right"
                      onClick={() => setImgIdx((i) => (i + 1) % images.length)}>
                      <IconChevronRight/>
                    </button>
                    <div className="pdm-img-dots">
                      {images.map((_, i) => (
                        <button key={i} className={`pdm-dot${i === imgIdx ? ' active' : ''}`}
                          onClick={() => setImgIdx(i)}/>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {images?.length > 1 && (
                <div className="pdm-thumbs">
                  {images.map((src, i) => (
                    <button key={i} className={`pdm-thumb${i === imgIdx ? ' active' : ''}`}
                      onClick={() => setImgIdx(i)}>
                      <img src={src} alt=""/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="pdm-info">
              <div className="pdm-tags">
                {product.brand       && <span className="pdm-tag pdm-tag--brand">{product.brand}</span>}
                {product.category    && <span className="pdm-tag pdm-tag--cat">{product.category}</span>}
                {product.subCategory && <span className="pdm-tag pdm-tag--sub">{product.subCategory}</span>}
              </div>

              <h2 className="pdm-name">{product.name}</h2>

              {product.ratings > 0 && (
                <div className="pdm-rating-row">
                  <StarRow rating={product.ratings}/>
                  <span className="pdm-rating-num">{product.ratings.toFixed(1)}</span>
                  {product.numReviews > 0 && (
                    <span className="pdm-review-count">({product.numReviews.toLocaleString()} reviews)</span>
                  )}
                </div>
              )}

              <div className="pdm-price-block">
                <span className="pdm-sale-price">₹{salePrice?.toLocaleString()}</span>
                {hasDiscount && (
                  <>
                    <span className="pdm-orig-price">₹{origPrice?.toLocaleString()}</span>
                    <span className="pdm-disc-badge">{discPct}% off</span>
                  </>
                )}
              </div>
              {hasDiscount && (
                <div className="pdm-savings-line">
                  You save ₹{(origPrice - salePrice).toLocaleString()}
                </div>
              )}

              <div className={`pdm-stock ${product.inStock ? 'in' : 'out'}`}>
                {product.inStock
                  ? <><span className="pdm-stock-dot"/>{product.quantity > 10 ? 'In Stock' : `Only ${product.quantity} left!`}</>
                  : 'Out of Stock'}
              </div>

              {product.description && (
                <p className="pdm-description">{product.description}</p>
              )}

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="pdm-specs">
                  <p className="pdm-section-label">Specifications</p>
                  <table className="pdm-specs-table">
                    <tbody>
                      {Object.entries(product.specs).map(([k, v]) => (
                        <tr key={k}>
                          <td className="pdm-spec-key">{k}</td>
                          <td className="pdm-spec-val">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pdm-highlights">
                <div className="pdm-highlight"><IconTruck/><span>Free delivery on all orders</span></div>
                <div className="pdm-highlight"><IconReturn/><span>10-day easy returns</span></div>
                <div className="pdm-highlight"><IconShield/><span>1 year brand warranty</span></div>
              </div>

              {product.inStock && (
                <div className="pdm-actions">
                  <div className="pdm-qty-row">
                    <span className="pdm-qty-label">Qty</span>
                    <div className="pdm-qty-ctrl">
                      <button className="pdm-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                      <span className="pdm-qty-num">{qty}</span>
                      <button className="pdm-qty-btn" onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}>+</button>
                    </div>
                  </div>
                  <button className={`pdm-add-btn${added ? ' added' : ''}`}
                    onClick={handleAddToCart} disabled={added}>
                    {added ? <><IconCheck/> Added to Cart</> : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}




