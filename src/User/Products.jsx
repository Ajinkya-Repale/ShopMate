import { useState, useEffect, useCallback } from 'react';
import { productAPI, cartAPI, wishlistAPI } from './api';
import './components.css';

const TABS = ['All', 'Electronics'];

const renderStars = (rating = 0) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
const IconBag = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const IconHeartOutline = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const IconHeartFilled = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const IconCart = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19.4a2 2 0 001.98-1.71L23 6H6"/>
  </svg>
);

const IconPlus = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconClose = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconWarning = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconPackage = ({ size = 40, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconCheckCircle = ({ size = 14, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconXCircle = ({ size = 14, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─────────────────────────────────────────
   ProductDetail Modal
───────────────────────────────────────── */
const ProductDetail = ({ product: p, onClose, onAddToCart, onWishlist, wishlist, cartLoading }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const isWished = wishlist.includes(p.id);
  const price = p.discountedPrice > 0 ? p.discountedPrice : p.price;
  const savings = p.discountedPrice > 0 && p.discountedPrice < p.price
    ? p.price - p.discountedPrice : 0;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(p.id);
  };

  const handleWishClick = (e) => {
    e.stopPropagation();
    onWishlist(p.id);
  };

  const images = p.images && p.images.length > 0 ? p.images : [];

  return (
    <div className="pd-overlay" onClick={handleOverlayClick}>
      <div className="pd-modal" role="dialog" aria-modal="true" aria-label={p.name}>
        <button className="pd-close" onClick={onClose} title="Close">
          <IconClose size={16} />
        </button>

        <div className="pd-body">
          {/* ── Left: Images ── */}
          <div className="pd-images">
            <div className="pd-main-img">
              {images[imgIdx]
                ? <img src={images[imgIdx]} alt={p.name} onError={(e) => { e.target.style.display = 'none'; }} />
                : <span className="pd-img-placeholder"><IconPackage size={48} /></span>
              }
              {p.discountPercent > 0 && (
                <span className="pd-discount-badge">-{p.discountPercent}%</span>
              )}
              {!p.inStock && <div className="pd-out-badge">Out of Stock</div>}
            </div>

            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${imgIdx === i ? 'pd-thumb--active' : ''}`}
                    onClick={() => setImgIdx(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} onError={(e) => { e.target.style.display = 'none'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="pd-info">
            <span className="pd-category">{p.category}</span>
            <h2 className="pd-name">{p.name}</h2>
            <p className="pd-brand">by <strong>{p.brand}</strong></p>

            <div className="pd-stars">
              <span>{renderStars(p.ratings)}</span>
              <span>{p.ratings?.toFixed(1)} ({p.numReviews || 0} reviews)</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">₹{price.toLocaleString()}</span>
              {savings > 0 && (
                <>
                  <span className="pd-old">₹{p.price.toLocaleString()}</span>
                  <span className="pd-save">Save ₹{savings.toLocaleString()}</span>
                </>
              )}
            </div>

            {p.description && <p className="pd-desc">{p.description}</p>}

            {/* Meta table */}
            <div className="pd-meta">
              {p.brand && (
                <div className="pd-meta-row">
                  <span>Brand</span>
                  <span>{p.brand}</span>
                </div>
              )}
              {p.category && (
                <div className="pd-meta-row">
                  <span>Category</span>
                  <span>{p.category}</span>
                </div>
              )}
              {p.numReviews > 0 && (
                <div className="pd-meta-row">
                  <span>Reviews</span>
                  <span>{p.numReviews}</span>
                </div>
              )}
              <div className="pd-meta-row">
                <span>Availability</span>
                <span className={p.inStock ? 'pd-in-stock' : 'pd-no-stock'}>
                  {p.inStock
                    ? <><IconCheckCircle size={13} /> In Stock</>
                    : <><IconXCircle size={13} /> Out of Stock</>
                  }
                </span>
              </div>
            </div>

            {/* Specs if available */}
            {p.specs && Object.keys(p.specs).length > 0 && (
              <div className="pd-specs">
                <p className="pd-specs-title">Specifications</p>
                <div className="pd-meta">
                  {Object.entries(p.specs).map(([k, v]) => (
                    <div className="pd-meta-row" key={k}>
                      <span>{k}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pd-actions">
              <button
                className={`pd-btn-wish ${isWished ? 'pd-btn-wish--active' : ''}`}
                onClick={handleWishClick}
                title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isWished ? <IconHeartFilled size={18} /> : <IconHeartOutline size={18} />}
              </button>
              <button
                className="pd-btn-cart"
                onClick={handleCartClick}
                disabled={!p.inStock || cartLoading === p.id}
              >
                <IconCart size={16} />
                {cartLoading === p.id ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Products
───────────────────────────────────────── */
const Products = ({ onCartUpdate, initialTab = 'All', initialSubcategory = null, collectionLabel = null }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch all products on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = initialTab !== 'All'
          ? await productAPI.getByCategory(initialTab)
          : await productAPI.getAll();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Re-fetch when tab changes to a category
  useEffect(() => {
    if (activeTab === 'All') return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productAPI.getByCategory(activeTab);
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      setLoading(true);
      productAPI.getAll()
        .then((data) => setProducts(data || []))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleAddToCart = useCallback(async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return showFeedback('Please login to add to cart');
    try {
      setCartLoading(productId);
      await cartAPI.addToCart(productId, 1);
      showFeedback('Added to cart');
    } catch (err) {
      showFeedback(err.message);
    } finally {
      setCartLoading(null);
    }
  }, []);

  const handleWishlist = useCallback(async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return showFeedback('Please login to use wishlist');
    const isWished = wishlist.includes(productId);
    try {
      if (isWished) {
        await wishlistAPI.remove(productId);
        setWishlist((prev) => prev.filter((id) => id !== productId));
        showFeedback('Removed from wishlist');
      } else {
        await wishlistAPI.add(productId);
        setWishlist((prev) => [...prev, productId]);
        showFeedback('Added to wishlist');
      }
    } catch (err) {
      showFeedback(err.message);
    }
  }, [wishlist]);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCardButtonClick = (e) => {
    e.stopPropagation();
  };

  // subcategory can be string or array of keyword aliases
  const displayedProducts = subcategory
    ? products.filter((p) => {
        const sub  = (p.subCategory || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        const keywords = Array.isArray(subcategory)
          ? subcategory.map(k => k.toLowerCase())
          : [subcategory.toLowerCase()];
        return keywords.some((k) => {
          if (sub === k || sub.startsWith(k)) return true;
          const re = new RegExp(`(^|\\s)${k}`, 'i');
          return re.test(sub) || re.test(name);
        });
      })
    : products;

  return (
    <section className="products">
      {/* Toast feedback */}
      {feedback && <div className="products__toast">{feedback}</div>}

      <div className="products__header">
        <h2 className="products__title">
          {subcategory
            ? <>{collectionLabel || activeTab} <em>Collection</em></>
            : <>Trending <em>Right Now</em></>}
        </h2>
        <div className="products__tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'tab-btn--active' : ''}`}
              onClick={() => { setSubcategory(null); handleTabChange(tab); }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="products__state">
          <div className="products__spinner" />
          <p>Loading products…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="products__state products__state--error">
          <p><IconWarning size={16} /> {error}</p>
          <button className="btn--warm" onClick={() => handleTabChange(activeTab)}>
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && displayedProducts.length === 0 && (
        <div className="products__state">
          <p>No products found{subcategory ? ` for "${subcategory}"` : ` in ${activeTab}`}.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && displayedProducts.length > 0 && (
        <div className="products__grid">
          {displayedProducts.map((p) => (
            <div
              className="prod-card"
              key={p.id}
              onClick={() => handleCardClick(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(p); }}
              aria-label={`View details for ${p.name}`}
            >
              <div className="prod-card__img">
                {p.discountPercent > 0 && (
                  <span className="prod-card__tag prod-card__tag--hot">
                    -{p.discountPercent}%
                  </span>
                )}
                {p.discountPercent === 0 && p.inStock && (
                  <span className="prod-card__tag prod-card__tag--new">New</span>
                )}

                <button
                  className="prod-card__wish"
                  onClick={(e) => { handleCardButtonClick(e); handleWishlist(p.id); }}
                  title={wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlist.includes(p.id)
                    ? <IconHeartFilled size={16} />
                    : <IconHeartOutline size={16} />
                  }
                </button>

                {p.images && p.images.length > 0 ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="prod-card__photo"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className="prod-card__img-placeholder"><IconPackage size={36} /></span>
                )}

                {!p.inStock && (
                  <div className="prod-card__out-of-stock">Out of Stock</div>
                )}
              </div>

              <div className="prod-card__category">{p.category}</div>
              <div className="prod-card__name">{p.name}</div>
              <div className="prod-card__brand">{p.brand}</div>

              <div className="prod-card__stars">
                {renderStars(p.ratings)} <span>({p.numReviews || 0})</span>
              </div>

              <div className="prod-card__footer">
                <div>
                  <span className="prod-card__price">
                    ₹{(p.discountedPrice > 0 ? p.discountedPrice : p.price).toLocaleString()}
                  </span>
                  {p.discountedPrice > 0 && p.discountedPrice < p.price && (
                    <span className="prod-card__old">₹{p.price.toLocaleString()}</span>
                  )}
                </div>
                <button
                  className="prod-card__add"
                  onClick={(e) => { handleCardButtonClick(e); handleAddToCart(p.id); }}
                  disabled={!p.inStock || cartLoading === p.id}
                  title={!p.inStock ? 'Out of stock' : 'Add to cart'}
                >
                  {cartLoading === p.id ? '…' : <IconPlus size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
          wishlist={wishlist}
          cartLoading={cartLoading}
        />
      )}
    </section>
  );
};

export default Products;




