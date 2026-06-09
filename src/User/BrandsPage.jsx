import { useState, useEffect, useCallback } from 'react';
import { productAPI, cartAPI, wishlistAPI } from './api';
import './Brandspage.css';

// ── SVG Icons ──
const IconTag = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconBox = ({ size = 48, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
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

const IconWarning = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconArrowLeft = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const renderStars = (rating = 0) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Relevance' },
  { value: 'price_asc',   label: 'Price: Low to High' },
  { value: 'price_desc',  label: 'Price: High to Low' },
  { value: 'rating',      label: 'Avg. Customer Review' },
  { value: 'discount',    label: 'Biggest Discount' },
  { value: 'newest',      label: 'Newest First' },
];

const BrandsPage = ({ onBack, onCartUpdate }) => {
  const [allProducts,      setAllProducts]      = useState([]);
  const [brandProducts,    setBrandProducts]    = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [productsLoading,  setProductsLoading]  = useState(false);
  const [error,            setError]            = useState(null);
  const [wishlist,         setWishlist]         = useState([]);
  const [cartLoading,      setCartLoading]      = useState(null);
  const [feedback,         setFeedback]         = useState(null);
  const [selectedProduct,  setSelectedProduct]  = useState(null);
  const [activeBrand,      setActiveBrand]      = useState(null);
  const [sort,             setSort]             = useState('relevance');

  // ── Hide body scrollbar on mount ──
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'brands-hide-scroll';
    style.textContent = 'html::-webkit-scrollbar{display:none!important}body::-webkit-scrollbar{display:none!important}';
    document.documentElement.style.scrollbarWidth = 'none';
    document.head.appendChild(style);
    return () => {
      document.getElementById('brands-hide-scroll')?.remove();
      document.documentElement.style.scrollbarWidth = '';
    };
  }, []);

  // ── Load all products once to derive brand list ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAll();
        setAllProducts(data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Load wishlist ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    wishlistAPI.getWishlist()
      .then((d) => setWishlist((d || []).map((p) => p.id || p._id || p)))
      .catch(() => {});
  }, []);

  // ── Fetch products when brand selected ──
  useEffect(() => {
    if (!activeBrand) { setBrandProducts([]); return; }
    const load = async () => {
      try {
        setProductsLoading(true);
        const data = await productAPI.getByBrand(activeBrand);
        setBrandProducts(data || []);
      } catch (e) {
        setFeedback('Failed to load brand products');
        setBrandProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    load();
  }, [activeBrand]);

  // ── Derive brands with product counts ──
  const brandMap = allProducts.reduce((acc, p) => {
    if (p.brand) acc[p.brand] = (acc[p.brand] || 0) + 1;
    return acc;
  }, {});
  const brands = Object.entries(brandMap)
    .sort((a, b) => b[1] - a[1]) // sort by product count desc
    .map(([name, count]) => ({ name, count }));

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

  // ── Apply sort to brandProducts ──
  const sorted = [...brandProducts].sort((a, b) => {
    const pa = a.discountedPrice > 0 ? a.discountedPrice : a.price;
    const pb = b.discountedPrice > 0 ? b.discountedPrice : b.price;
    if (sort === 'price_asc')  return pa - pb;
    if (sort === 'price_desc') return pb - pa;
    if (sort === 'rating')     return (b.ratings || 0) - (a.ratings || 0);
    if (sort === 'discount')   return (b.discountPercent || 0) - (a.discountPercent || 0);
    if (sort === 'newest')     return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return 0;
  });

  return (
    <div className="brands-page">
      {feedback && <div className="brands-toast">{feedback}</div>}

      {/* ── Breadcrumb ── */}
      {onBack && (
        <div className="brands-breadcrumb">
          <button className="brands-breadcrumb__btn" onClick={onBack}>
            <IconArrowLeft size={13} />
            Home
          </button>
          <span className="brands-breadcrumb__sep">/</span>
          <span className="brands-breadcrumb__current">Brands</span>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="brands-banner">
        <div className="brands-banner__eyebrow">Shop by Brand</div>
        <h1 className="brands-banner__title">
          Top <span>Brands</span>
        </h1>
        <p className="brands-banner__sub">
          {brands.length > 0
            ? `${brands.length} brands · ${allProducts.length} products`
            : 'Discover products from your favourite brands'}
        </p>
      </div>

      {/* ── Loading all brands ── */}
      {loading && (
        <div className="brands-state">
          <div className="brands-spinner" />
          <p>Loading brands…</p>
        </div>
      )}

      {!loading && error && (
        <div className="brands-state" style={{ color: '#ef4444' }}>
          <p><IconWarning size={18} style={{verticalAlign:'middle',marginRight:6}} />{error}</p>
        </div>
      )}

      {/* ── Brand Selector ── */}
      {!loading && !error && brands.length > 0 && (
        <div className="brands-selector">
          <div className="brands-selector__title">Select a brand</div>
          <div className="brands-selector__grid">
            {brands.map(({ name, count }) => (
              <button
                key={name}
                className={`brands-selector__btn ${activeBrand === name ? 'active' : ''}`}
                onClick={() => { setActiveBrand(name); setSort('relevance'); }}
              >
                {name}
                <span className="brands-selector__count">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Products for selected brand ── */}
      {activeBrand && (
        <>
          {/* Toolbar */}
          <div className="brands-toolbar">
            <div className="brands-toolbar__info">
              <h2 className="brands-toolbar__brand-name">{activeBrand}</h2>
              {!productsLoading && (
                <span className="brands-toolbar__count">
                  {sorted.length} product{sorted.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="brands-sort">
              <label className="brands-sort__label">Sort by:</label>
              <select
                className="brands-sort__select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products loading */}
          {productsLoading && (
            <div className="brands-state">
              <div className="brands-spinner" />
              <p>Loading {activeBrand} products…</p>
            </div>
          )}

          {/* Empty */}
          {!productsLoading && sorted.length === 0 && (
            <div className="brands-state">
              <IconBox size={48} style={{opacity:0.4}} />
              <p>No products found for {activeBrand}.</p>
            </div>
          )}

          {/* Grid */}
          {!productsLoading && sorted.length > 0 && (
            <div className="brands-grid">
              {sorted.map((p) => {
                const price = p.discountedPrice > 0 ? p.discountedPrice : p.price;
                const hasDiscount = p.discountedPrice > 0 && p.discountedPrice < p.price;
                return (
                  <div
                    key={p.id}
                    className="brands-card"
                    onClick={() => setSelectedProduct(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSelectedProduct(p); }}
                  >
                    {hasDiscount && (
                      <div className="brands-card__discount">-{p.discountPercent}%</div>
                    )}

                    <div className="brands-card__img-wrap">
                      {!p.inStock && <div className="brands-card__oos">Out of Stock</div>}
                      <button
                        className="brands-card__wish"
                        onClick={(e) => handleWishlist(p.id, e)}
                        title={wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <IconHeart filled={wishlist.includes(p.id)} size={14} />
                      </button>
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name} className="brands-card__img" onError={(e) => { e.target.style.display = 'none'; }} />
                        : <span className="brands-card__img-placeholder"><IconTag size={40} style={{opacity:0.3}} /></span>}
                    </div>

                    <div className="brands-card__body">
                      {p.subCategory && <div className="brands-card__cat">{p.subCategory}</div>}
                      <div className="brands-card__name">{p.name}</div>
                      <div className="brands-card__stars">
                        <span className="brands-card__stars-val">{renderStars(p.ratings)}</span>
                        <span className="brands-card__stars-count">({p.numReviews || 0})</span>
                      </div>
                      <div className="brands-card__pricing">
                        <span className="brands-card__price">₹{price.toLocaleString()}</span>
                        {hasDiscount && <span className="brands-card__original">₹{p.price.toLocaleString()}</span>}
                        {hasDiscount && <span className="brands-card__saving">{p.discountPercent}% off</span>}
                      </div>
                      {p.inStock
                        ? <div className="brands-card__stock--in">✓ In Stock</div>
                        : <div className="brands-card__stock--out">✕ Out of Stock</div>}
                      <button
                        className="brands-card__add-btn"
                        disabled={!p.inStock || cartLoading === p.id}
                        onClick={(e) => handleAddToCart(p.id, e)}
                      >
                        {cartLoading === p.id ? 'Adding…' : <><IconCart size={13} style={{verticalAlign:'middle',marginRight:5}} />Add to Cart</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Prompt when no brand selected ── */}
      {!loading && !error && !activeBrand && brands.length > 0 && (
        <div className="brands-state">
          <IconTag size={40} style={{opacity:0.4,marginBottom:'0.5rem'}} />
          <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>Pick a brand above</p>
          <p style={{ fontSize: '0.85rem' }}>to browse their products</p>
        </div>
      )}

      {/* ── Quick View Modal ── */}
      {selectedProduct && (
        <div className="brands-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="brands-modal" onClick={(e) => e.stopPropagation()}>
            <button className="brands-modal__close" onClick={() => setSelectedProduct(null)}>✕</button>

            <div className="brands-modal__img-wrap">
              {selectedProduct.images?.[0]
                ? <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="brands-modal__img" />
                : <IconTag size={64} style={{opacity:0.3}} />}
            </div>

            <div className="brands-modal__info">
              {selectedProduct.brand && <div className="brands-modal__brand">{selectedProduct.brand}</div>}
              <h2 className="brands-modal__name">{selectedProduct.name}</h2>
              <div className="brands-modal__stars">
                {renderStars(selectedProduct.ratings)}
                <span>({selectedProduct.numReviews || 0} reviews)</span>
              </div>
              <div className="brands-modal__price-row">
                <span className="brands-modal__price">
                  ₹{(selectedProduct.discountedPrice > 0 ? selectedProduct.discountedPrice : selectedProduct.price).toLocaleString()}
                </span>
                {selectedProduct.discountedPrice > 0 && selectedProduct.discountedPrice < selectedProduct.price && (
                  <>
                    <span className="brands-modal__original">₹{selectedProduct.price.toLocaleString()}</span>
                    <span className="brands-modal__badge">{selectedProduct.discountPercent}% OFF</span>
                  </>
                )}
              </div>
              {selectedProduct.description && (
                <p className="brands-modal__desc">{selectedProduct.description}</p>
              )}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <table className="brands-modal__specs">
                  <tbody>
                    {Object.entries(selectedProduct.specs).map(([k, v]) => (
                      <tr key={k}>
                        <td className="brands-modal__spec-key">{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                className="brands-modal__add-btn"
                disabled={!selectedProduct.inStock || cartLoading === selectedProduct.id}
                onClick={(e) => handleAddToCart(selectedProduct.id, e)}
              >
                {cartLoading === selectedProduct.id ? 'Adding…' : <><IconCart size={14} style={{verticalAlign:'middle',marginRight:6}} />Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandsPage;




