import { useState, useEffect, useCallback, useMemo } from 'react';
import { productAPI, cartAPI, wishlistAPI } from './api';
import './CollectionsPage.css';

const renderStars = (rating = 0) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Relevance' },
  { value: 'price_asc',   label: 'Price: Low to High' },
  { value: 'price_desc',  label: 'Price: High to Low' },
  { value: 'rating',      label: 'Avg. Customer Review' },
  { value: 'newest',      label: 'Newest First' },
];

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
const IconHeartOutline = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const IconHeartFilled = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const IconCart = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19.4a2 2 0 001.98-1.71L23 6H6"/>
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

const IconClose = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconWarning = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconSearch = ({ size = 32, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconCheck = ({ size = 13, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = ({ size = 13, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconArrowLeft = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

/* ─────────────────────────────────────────
   Util: capitalise first letter of each word
───────────────────────────────────────── */
const toLabel = (str) =>
  str
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/* ─────────────────────────────────────────
   SidebarContent
   — now receives dynamic `collectionDefs`
───────────────────────────────────────── */
const SidebarContent = ({
  activeSubCategory, setActiveSubCategory, activeLabel, setActiveLabel,
  priceMin, setPriceMin, priceMax, setPriceMax,
  minRating, setMinRating, inStockOnly, setInStockOnly,
  selectedBrands, toggleBrand, allBrands, clearFilters,
  collectionDefs,
}) => (
  <>
    <div className="coll-sidebar__header">
      <span>Filters</span>
      <button className="coll-sidebar__clear" onClick={clearFilters}>Clear all</button>
    </div>

    <div className="coll-filter-group">
      <div className="coll-filter-group__title">Category</div>
      {/* All Electronics */}
      <label className={`coll-filter-option ${!activeSubCategory ? 'active' : ''}`}>
        <input type="radio" name="subcoll" checked={!activeSubCategory}
          onChange={() => { setActiveSubCategory(null); setActiveLabel('All Electronics'); }} />
        All Electronics
      </label>
      {/* Dynamic subcategories derived from products */}
      {collectionDefs.map((d) => (
        <label key={d.subCategory} className={`coll-filter-option ${activeLabel === d.label && activeSubCategory ? 'active' : ''}`}>
          <input type="radio" name="subcoll"
            checked={activeLabel === d.label && !!activeSubCategory}
            onChange={() => { setActiveSubCategory(d.subCategory); setActiveLabel(d.label); }} />
          {d.label}
        </label>
      ))}
    </div>

    <div className="coll-filter-group">
      <div className="coll-filter-group__title">Price Range (₹)</div>
      <div className="coll-price-row">
        <input className="coll-price-input" type="number" placeholder="Min" value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)} />
        <span>–</span>
        <input className="coll-price-input" type="number" placeholder="Max" value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)} />
      </div>
    </div>

    <div className="coll-filter-group">
      <div className="coll-filter-group__title">Avg. Customer Review</div>
      {[4, 3, 2, 1].map((r) => (
        <label key={r} className={`coll-filter-option ${minRating === r ? 'active' : ''}`}>
          <input type="radio" name="rating" checked={minRating === r}
            onChange={() => setMinRating(minRating === r ? 0 : r)} />
          {'★'.repeat(r)}{'☆'.repeat(5 - r)} & above
        </label>
      ))}
    </div>

    <div className="coll-filter-group">
      <label className="coll-filter-option">
        <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
        In Stock Only
      </label>
    </div>

    {allBrands.length > 0 && (
      <div className="coll-filter-group">
        <div className="coll-filter-group__title">Brand</div>
        {allBrands.map((brand) => (
          <label key={brand} className={`coll-filter-option ${selectedBrands.includes(brand) ? 'active' : ''}`}>
            <input type="checkbox" checked={selectedBrands.includes(brand)}
              onChange={() => toggleBrand(brand)} />
            {brand}
          </label>
        ))}
      </div>
    )}
  </>
);

/* ─────────────────────────────────────────
   CollectionsPage
───────────────────────────────────────── */
const CollectionsPage = ({ initialKeywords = null, collectionLabel = 'All Electronics', onBack, onCartUpdate }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [wishlist, setWishlist]       = useState([]);
  const [cartLoading, setCartLoading] = useState(null);
  const [feedback, setFeedback]       = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen]   = useState(false);

  // ── filter: now tracks exact subCategory string, not keyword array ──
  const [activeSubCategory, setActiveSubCategory] = useState(
    // If caller passed initialKeywords (legacy), try to resolve later; start null
    null
  );
  const [activeLabel, setActiveLabel] = useState(collectionLabel);
  const [priceMax, setPriceMax]       = useState('');
  const [priceMin, setPriceMin]       = useState('');
  const [minRating, setMinRating]     = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sort, setSort]               = useState('relevance');

  // ── fetch products ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getByCategory('Electronics');
        setAllProducts(data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── wishlist ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    wishlistAPI.getWishlist()
      .then((d) => setWishlist((d || []).map((p) => p.id || p._id || p)))
      .catch(() => {});
  }, []);

  // ── dynamic collectionDefs: built from actual products ──
  // Each unique subCategory becomes a filter option.
  const collectionDefs = useMemo(() => {
    const seen = new Set();
    const defs = [];
    for (const p of allProducts) {
      const sub = (p.subCategory || '').trim();
      if (sub && !seen.has(sub.toLowerCase())) {
        seen.add(sub.toLowerCase());
        defs.push({ subCategory: sub, label: toLabel(sub) });
      }
    }
    // Sort alphabetically by label
    defs.sort((a, b) => a.label.localeCompare(b.label));
    return defs;
  }, [allProducts]);

  // ── resolve initialKeywords → activeSubCategory once defs loaded ──
  useEffect(() => {
    if (!initialKeywords || collectionDefs.length === 0) return;
    const kws = Array.isArray(initialKeywords) ? initialKeywords : [initialKeywords];
    // Find first def whose subCategory matches any keyword
    const match = collectionDefs.find((d) =>
      kws.some((k) => d.subCategory.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(d.subCategory.toLowerCase()))
    );
    if (match) {
      setActiveSubCategory(match.subCategory);
      setActiveLabel(match.label);
    }
  }, [collectionDefs, initialKeywords]);

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
        await wishlistAPI.removeFromWishlist(productId);
        setWishlist((p) => p.filter((id) => id !== productId));
      } else {
        await wishlistAPI.addToWishlist(productId);
        setWishlist((p) => [...p, productId]);
      }
    } catch (err) {
      showFeedback(err.message);
    }
  }, [wishlist]);

  const allBrands = useMemo(
    () => [...new Set(allProducts.map((p) => p.brand).filter(Boolean))].sort(),
    [allProducts]
  );

  // ── filtering: exact subCategory match (case-insensitive) ──
  const filtered = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (activeSubCategory) {
          const sub = (p.subCategory || '').toLowerCase();
          if (sub !== activeSubCategory.toLowerCase()) return false;
        }
        if (inStockOnly && !p.inStock) return false;
        const price = p.discountedPrice > 0 ? p.discountedPrice : p.price;
        if (priceMin !== '' && price < Number(priceMin)) return false;
        if (priceMax !== '' && price > Number(priceMax)) return false;
        if (minRating > 0 && (p.ratings || 0) < minRating) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
        return true;
      })
      .sort((a, b) => {
        const pa = a.discountedPrice > 0 ? a.discountedPrice : a.price;
        const pb = b.discountedPrice > 0 ? b.discountedPrice : b.price;
        if (sort === 'price_asc')  return pa - pb;
        if (sort === 'price_desc') return pb - pa;
        if (sort === 'rating')     return (b.ratings || 0) - (a.ratings || 0);
        if (sort === 'newest')     return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return 0;
      });
  }, [allProducts, activeSubCategory, inStockOnly, priceMin, priceMax, minRating, selectedBrands, sort]);

  const toggleBrand = (brand) =>
    setSelectedBrands((p) => p.includes(brand) ? p.filter((b) => b !== brand) : [...p, brand]);

  const clearFilters = () => {
    setPriceMin(''); setPriceMax('');
    setMinRating(0); setInStockOnly(false);
    setSelectedBrands([]);
  };

  const activeFilterCount = [
    priceMin !== '', priceMax !== '', minRating > 0, inStockOnly, selectedBrands.length > 0
  ].filter(Boolean).length;

  const sidebarProps = {
    activeSubCategory, setActiveSubCategory, activeLabel, setActiveLabel,
    priceMin, setPriceMin, priceMax, setPriceMax,
    minRating, setMinRating, inStockOnly, setInStockOnly,
    selectedBrands, toggleBrand, allBrands, clearFilters,
    collectionDefs,
  };

  return (
    <div className="coll-page">
      {feedback && <div className="coll-toast">{feedback}</div>}

      {/* Breadcrumb */}
      <div className="coll-breadcrumb">
        <button className="coll-breadcrumb__back" onClick={onBack}>
          <IconArrowLeft size={14} /> Home
        </button>
        <span className="coll-breadcrumb__sep">/</span>
        <span className="coll-breadcrumb__current">Electronics</span>
        {activeSubCategory && (
          <>
            <span className="coll-breadcrumb__sep">/</span>
            <span className="coll-breadcrumb__current coll-breadcrumb__current--active">{activeLabel}</span>
          </>
        )}
      </div>

      {/* ── Desktop layout: sidebar + main side-by-side ── */}
      <div className="coll-layout">
        <aside className="coll-sidebar">
          <SidebarContent {...sidebarProps} />
        </aside>

        <main className="coll-main">
          {/* Mobile title row */}
          <div className="coll-mobile-title">
            <h1>{activeLabel}</h1>
            {!loading && <span className="coll-main__count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>}
          </div>

          {/* Mobile-only: filter + sort bar */}
          <div className="coll-mobile-bar">
            <button
              className={`coll-filter-toggle${drawerOpen ? ' coll-filter-toggle--open' : ''}`}
              onClick={() => setDrawerOpen((o) => !o)}
              aria-expanded={drawerOpen}
            >
              <svg className="coll-filter-toggle__icon" viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM7 15a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="coll-filter-toggle__badge">{activeFilterCount}</span>
              )}
              <svg className={`coll-filter-toggle__chevron${drawerOpen ? ' coll-filter-toggle__chevron--up' : ''}`} viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="coll-sort coll-sort--mobile">
              <select className="coll-sort__select" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Mobile collapsible filter panel */}
          {drawerOpen && (
            <div className="coll-mobile-filters">
              <SidebarContent {...sidebarProps} />
            </div>
          )}

          {/* Desktop header row */}
          <div className="coll-main__header">
            <div className="coll-main__title">
              <h1>{activeLabel}</h1>
              {!loading && <span className="coll-main__count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>}
            </div>
            <div className="coll-sort">
              <label className="coll-sort__label">Sort by:</label>
              <select className="coll-sort__select" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading && (
            <div className="coll-state">
              <div className="coll-spinner" />
              <p>Loading products…</p>
            </div>
          )}

          {!loading && error && (
            <div className="coll-state coll-state--error">
              <p><IconWarning size={16} /> {error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="coll-state">
              <IconSearch size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
              <p>No products match your filters.</p>
              <button className="coll-clear-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="coll-grid">
              {filtered.map((p) => {
                const price = p.discountedPrice > 0 ? p.discountedPrice : p.price;
                const hasDiscount = p.discountedPrice > 0 && p.discountedPrice < p.price;
                return (
                  <div className="coll-card" key={p.id} onClick={() => setSelectedProduct(p)}
                    role="button" tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSelectedProduct(p); }}>

                    <div className="coll-card__img-wrap">
                      {p.discountPercent > 0 && <span className="coll-card__badge coll-card__badge--hot">-{p.discountPercent}%</span>}
                      {!p.inStock && <div className="coll-card__oos">Out of Stock</div>}
                      <button className="coll-card__wish"
                        onClick={(e) => handleWishlist(p.id, e)}
                        title={wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}>
                        {wishlist.includes(p.id)
                          ? <IconHeartFilled size={16} />
                          : <IconHeartOutline size={16} />}
                      </button>
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name} className="coll-card__img" onError={(e) => { e.target.style.display = 'none'; }} />
                        : <span className="coll-card__img-placeholder"><IconPackage size={36} /></span>}
                    </div>

                    <div className="coll-card__body">
                      {p.brand && <div className="coll-card__brand">{p.brand}</div>}
                      <div className="coll-card__name">{p.name}</div>
                      <div className="coll-card__stars">
                        <span className="coll-card__stars-val">{renderStars(p.ratings)}</span>
                        <span className="coll-card__stars-count">({p.numReviews || 0})</span>
                      </div>
                      <div className="coll-card__pricing">
                        <span className="coll-card__price">₹{price.toLocaleString()}</span>
                        {hasDiscount && <span className="coll-card__original">₹{p.price.toLocaleString()}</span>}
                        {hasDiscount && <span className="coll-card__saving">{p.discountPercent}% off</span>}
                      </div>
                      {p.inStock
                        ? <div className="coll-card__stock coll-card__stock--in"><IconCheck size={12} /> In Stock</div>
                        : <div className="coll-card__stock coll-card__stock--out"><IconX size={12} /> Out of Stock</div>}
                      <button className="coll-card__add-btn"
                        disabled={!p.inStock || cartLoading === p.id}
                        onClick={(e) => handleAddToCart(p.id, e)}>
                        <IconCart size={15} />
                        {cartLoading === p.id ? 'Adding…' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Quick-view modal */}
      {selectedProduct && (
        <div className="coll-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="coll-modal" onClick={(e) => e.stopPropagation()}>
            <button className="coll-modal__close" onClick={() => setSelectedProduct(null)}>
              <IconClose size={16} />
            </button>
            <div className="coll-modal__img-wrap">
              {selectedProduct.images?.[0]
                ? <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="coll-modal__img" />
                : <span className="coll-modal__img-placeholder"><IconPackage size={64} /></span>}
            </div>
            <div className="coll-modal__info">
              {selectedProduct.brand && <div className="coll-modal__brand">{selectedProduct.brand}</div>}
              <h2 className="coll-modal__name">{selectedProduct.name}</h2>
              <div className="coll-modal__stars">{renderStars(selectedProduct.ratings)} <span>({selectedProduct.numReviews || 0} reviews)</span></div>
              <div className="coll-modal__price">
                ₹{(selectedProduct.discountedPrice > 0 ? selectedProduct.discountedPrice : selectedProduct.price).toLocaleString()}
                {selectedProduct.discountedPrice > 0 && selectedProduct.discountedPrice < selectedProduct.price && (
                  <span className="coll-modal__original">₹{selectedProduct.price.toLocaleString()}</span>
                )}
              </div>
              {selectedProduct.description && <p className="coll-modal__desc">{selectedProduct.description}</p>}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <table className="coll-modal__specs">
                  <tbody>
                    {Object.entries(selectedProduct.specs).map(([k, v]) => (
                      <tr key={k}><td className="coll-modal__spec-key">{k}</td><td>{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button className="coll-modal__add-btn"
                disabled={!selectedProduct.inStock || cartLoading === selectedProduct.id}
                onClick={(e) => { handleAddToCart(selectedProduct.id, e); }}>
                <IconCart size={16} />
                {cartLoading === selectedProduct.id ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;




