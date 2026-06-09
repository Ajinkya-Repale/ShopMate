import { useState, useEffect, useCallback, useMemo } from 'react';
import { productAPI, cartAPI, wishlistAPI } from './api';
import './Discoverpage.css';

const PER_PAGE = 24;

const renderStars = (rating = 0) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

const SORT_OPTIONS = [
  { value: 'relevance',    label: 'Relevance' },
  { value: 'newest',       label: 'Newest First' },
  { value: 'price_asc',    label: 'Price: Low to High' },
  { value: 'price_desc',   label: 'Price: High to Low' },
  { value: 'rating',       label: 'Avg. Customer Review' },
  { value: 'discount',     label: 'Biggest Discount' },
  { value: 'popularity',   label: 'Most Reviewed' },
];

const isNew = (createdAt) => {
  if (!createdAt) return false;
  return (Date.now() - new Date(createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000;
};

const IconArrowLeft = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconCart = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const IconBag = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const IconSearch = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconHeartFilled = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconHeartEmpty = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconCheck = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const DiscoverPage = ({ onBack, onCartUpdate }) => {
  const [allProducts,     setAllProducts]     = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [wishlist,        setWishlist]        = useState([]);
  const [cartLoading,     setCartLoading]     = useState(null);
  const [feedback,        setFeedback]        = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [searchQ,         setSearchQ]         = useState('');
  const [searchInput,     setSearchInput]     = useState('');
  const [activeCategory,  setActiveCategory]  = useState('All');
  const [priceMin,        setPriceMin]        = useState('');
  const [priceMax,        setPriceMax]        = useState('');
  const [minRating,       setMinRating]       = useState(0);
  const [inStockOnly,     setInStockOnly]     = useState(false);
  const [selectedBrands,  setSelectedBrands]  = useState([]);
  const [onlyDiscounted,  setOnlyDiscounted]  = useState(false);
  const [sort,            setSort]            = useState('newest');
  const [page,            setPage]            = useState(1);
  const [sidebarOpen,     setSidebarOpen]     = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollbarWidth = 'none';
    document.documentElement.style.overflow = 'auto';
    const style = document.createElement('style');
    style.id = 'disc-hide-scroll';
    style.textContent = 'html::-webkit-scrollbar { display: none !important; } body::-webkit-scrollbar { display: none !important; }';
    document.head.appendChild(style);
    return () => {
      document.getElementById('disc-hide-scroll')?.remove();
      document.documentElement.style.scrollbarWidth = '';
    };
  }, []);

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    wishlistAPI.getWishlist()
      .then((d) => setWishlist((d || []).map((p) => p.id || p._id || p)))
      .catch(() => {});
  }, []);

  useEffect(() => { setPage(1); }, [searchQ, activeCategory, priceMin, priceMax, minRating, inStockOnly, selectedBrands, onlyDiscounted, sort]);

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2200);
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

  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category).filter(Boolean))].sort();
    return ['All', ...cats];
  }, [allProducts]);

  const allBrands = useMemo(() =>
    [...new Set(allProducts.map((p) => p.brand).filter(Boolean))].sort(),
  [allProducts]);

  const catCounts = useMemo(() => {
    const map = {};
    allProducts.forEach((p) => {
      if (p.category) map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [allProducts]);

  const filtered = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (activeCategory !== 'All' && p.category !== activeCategory) return false;
        if (searchQ) {
          const q = searchQ.toLowerCase();
          const name = (p.name || '').toLowerCase();
          const brand = (p.brand || '').toLowerCase();
          const cat = (p.category || '').toLowerCase();
          const sub = (p.subCategory || '').toLowerCase();
          if (!name.includes(q) && !brand.includes(q) && !cat.includes(q) && !sub.includes(q)) return false;
        }
        const price = p.discountedPrice > 0 ? p.discountedPrice : p.price;
        if (priceMin !== '' && price < Number(priceMin)) return false;
        if (priceMax !== '' && price > Number(priceMax)) return false;
        if (minRating > 0 && (p.ratings || 0) < minRating) return false;
        if (inStockOnly && !p.inStock) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
        if (onlyDiscounted && !(p.discountPercent > 0)) return false;
        return true;
      })
      .sort((a, b) => {
        const pa = a.discountedPrice > 0 ? a.discountedPrice : a.price;
        const pb = b.discountedPrice > 0 ? b.discountedPrice : b.price;
        if (sort === 'price_asc')  return pa - pb;
        if (sort === 'price_desc') return pb - pa;
        if (sort === 'rating')     return (b.ratings || 0) - (a.ratings || 0);
        if (sort === 'discount')   return (b.discountPercent || 0) - (a.discountPercent || 0);
        if (sort === 'popularity') return (b.numReviews || 0) - (a.numReviews || 0);
        if (sort === 'newest')     return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return 0;
      });
  }, [allProducts, activeCategory, searchQ, priceMin, priceMax, minRating, inStockOnly, selectedBrands, onlyDiscounted, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleBrand = (brand) =>
    setSelectedBrands((p) => p.includes(brand) ? p.filter((b) => b !== brand) : [...p, brand]);

  const clearFilters = () => {
    setSearchQ(''); setSearchInput('');
    setActiveCategory('All');
    setPriceMin(''); setPriceMax('');
    setMinRating(0); setInStockOnly(false);
    setSelectedBrands([]); setOnlyDiscounted(false);
    setSort('newest');
  };

  const activeChips = [
    ...(activeCategory !== 'All' ? [{ label: activeCategory, clear: () => setActiveCategory('All') }] : []),
    ...(searchQ ? [{ label: `"${searchQ}"`, clear: () => { setSearchQ(''); setSearchInput(''); } }] : []),
    ...(priceMin ? [{ label: `Min ₹${priceMin}`, clear: () => setPriceMin('') }] : []),
    ...(priceMax ? [{ label: `Max ₹${priceMax}`, clear: () => setPriceMax('') }] : []),
    ...(minRating ? [{ label: `${minRating}★ & above`, clear: () => setMinRating(0) }] : []),
    ...(inStockOnly ? [{ label: 'In Stock', clear: () => setInStockOnly(false) }] : []),
    ...(onlyDiscounted ? [{ label: 'On Sale', clear: () => setOnlyDiscounted(false) }] : []),
    ...selectedBrands.map((b) => ({ label: b, clear: () => toggleBrand(b) })),
  ];

  const pageButtons = () => {
    const btns = [];
    const start = Math.max(1, page - 2);
    const end   = Math.min(totalPages, page + 2);
    if (start > 1) btns.push(1);
    if (start > 2) btns.push('...');
    for (let i = start; i <= end; i++) btns.push(i);
    if (end < totalPages - 1) btns.push('...');
    if (end < totalPages) btns.push(totalPages);
    return btns;
  };

  return (
    <div className="disc-page">
      {feedback && <div className="disc-toast">{feedback}</div>}

      {/* ── Search Bar ── */}
      <div className="disc-searchbar">
        {onBack && (
          <div className="brands-breadcrumb" style={{ marginBottom: 0, flexShrink: 0 }}>
            <button className="brands-breadcrumb__btn" onClick={onBack}>
              <IconArrowLeft size={13} />
              Home
            </button>
            <span className="brands-breadcrumb__sep">/</span>
            <span className="brands-breadcrumb__current">Discover</span>
          </div>
        )}

        <div className="disc-searchbar__wrap">
          <span className="disc-searchbar__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="disc-searchbar__input"
            placeholder="Search products, brands, categories…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') setSearchQ(searchInput.trim()); }}
          />
          {searchInput && (
            <button
              className="disc-searchbar__clear"
              onClick={() => { setSearchInput(''); setSearchQ(''); }}
              title="Clear"
            >
              <IconX size={14} />
            </button>
          )}
          <button
            className="disc-searchbar__btn"
            onClick={() => setSearchQ(searchInput.trim())}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search
          </button>
        </div>
        {!loading && (
          <span className="disc-searchbar__count">{allProducts.length} products</span>
        )}
      </div>

      <div className="disc-layout">
        {/* ── Mobile filter toggle ── */}
        <button
          className="disc-filter-toggle"
          onClick={() => setSidebarOpen(o => !o)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
          {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
          {activeChips.length > 0 && <span className="disc-filter-toggle__badge">{activeChips.length}</span>}
        </button>

        {/* ── Sidebar ── */}
        <aside className={`disc-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="disc-sidebar__head">
            <span>Filters</span>
            {activeChips.length > 0 && (
              <button className="disc-sidebar__clear" onClick={clearFilters}>Clear all</button>
            )}
          </div>

          {/* Category */}
          <div className="disc-filter-section">
            <div className="disc-filter-section__title">Category</div>
            {categories.map((cat) => (
              <label
                key={cat}
                className={`disc-filter-option ${activeCategory === cat ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="category"
                  checked={activeCategory === cat}
                  onChange={() => setActiveCategory(cat)}
                />
                {cat}
                <span className="disc-filter-option__count">
                  {cat === 'All' ? allProducts.length : (catCounts[cat] || 0)}
                </span>
              </label>
            ))}
          </div>

          {/* Price */}
          <div className="disc-filter-section">
            <div className="disc-filter-section__title">Price Range (₹)</div>
            <div className="disc-price-row">
              <input
                className="disc-price-input"
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <span>–</span>
              <input
                className="disc-price-input"
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>

          {/* Rating */}
          <div className="disc-filter-section">
            <div className="disc-filter-section__title">Avg. Customer Review</div>
            {[4, 3, 2, 1].map((r) => (
              <label
                key={r}
                className={`disc-rating-option ${minRating === r ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(minRating === r ? 0 : r)}
                />
                <span className="disc-rating-stars">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                &nbsp;& above
              </label>
            ))}
          </div>

          {/* Availability + Deals */}
          <div className="disc-filter-section">
            <div className="disc-filter-section__title">Availability</div>
            <label className="disc-filter-option">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              In Stock Only
            </label>
            <label className="disc-filter-option" style={{ marginTop: '4px' }}>
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
              />
              On Sale / Discounted
            </label>
          </div>

          {/* Brands */}
          {allBrands.length > 0 && (
            <div className="disc-filter-section">
              <div className="disc-filter-section__title">Brand</div>
              <div className="disc-brand-list">
                {allBrands.map((brand) => (
                  <label
                    key={brand}
                    className={`disc-filter-option ${selectedBrands.includes(brand) ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Main ── */}
        <main className="disc-main">
          {/* Toolbar */}
          <div className="disc-toolbar">
            <div className="disc-toolbar__left">
              <h1 className="disc-toolbar__title">
                {activeCategory === 'All' ? 'All Products' : activeCategory}
              </h1>
              {!loading && (
                <span className="disc-toolbar__count">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="disc-sort">
              <label className="disc-sort__label">Sort by:</label>
              <select
                className="disc-sort__select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="disc-active-filters">
              {activeChips.map((chip, i) => (
                <div key={i} className="disc-active-chip">
                  {chip.label}
                  <button className="disc-active-chip__remove" onClick={chip.clear}>
                    <IconX size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="disc-state">
              <div className="disc-spinner" />
              <p>Loading products…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="disc-state" style={{ color: '#ef4444' }}>
              <p>⚠ {error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="disc-state">
              <div style={{ color: 'var(--text2)', marginBottom: '0.4rem' }}>
                <IconSearch size={48} />
              </div>
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>No products found</p>
              <p style={{ fontSize: '0.85rem' }}>Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                style={{ marginTop: '0.75rem', padding: '0.5rem 1.25rem', background: 'var(--warm)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && paginated.length > 0 && (
            <>
              <div className="disc-grid">
                {paginated.map((p) => {
                  const price       = p.discountedPrice > 0 ? p.discountedPrice : p.price;
                  const hasDiscount = p.discountedPrice > 0 && p.discountedPrice < p.price;
                  const newProduct  = isNew(p.createdAt);

                  return (
                    <div
                      key={p.id}
                      className="disc-card"
                      onClick={() => setSelectedProduct(p)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') setSelectedProduct(p); }}
                    >
                      {hasDiscount && (
                        <div className="disc-card__badge">-{p.discountPercent}%</div>
                      )}
                      {!hasDiscount && newProduct && (
                        <div className="disc-card__badge disc-card__badge--new">NEW</div>
                      )}

                      <div className="disc-card__img-wrap">
                        {!p.inStock && <div className="disc-card__oos">Out of Stock</div>}
                        <button
                          className="disc-card__wish"
                          onClick={(e) => handleWishlist(p.id, e)}
                          title={wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          {wishlist.includes(p.id)
                            ? <IconHeartFilled size={16} />
                            : <IconHeartEmpty size={16} />}
                        </button>
                        {p.images?.[0]
                          ? <img
                              src={p.images[0]}
                              alt={p.name}
                              className="disc-card__img"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          : <span className="disc-card__img-placeholder"><IconBag size={40} /></span>}
                      </div>

                      <div className="disc-card__body">
                        <div className="disc-card__meta">
                          {[p.brand, p.subCategory || p.category].filter(Boolean).join(' · ')}
                        </div>
                        <div className="disc-card__name">{p.name}</div>
                        <div className="disc-card__stars">
                          <span className="disc-card__stars-val">{renderStars(p.ratings)}</span>
                          <span className="disc-card__stars-count">({p.numReviews || 0})</span>
                        </div>
                        <div className="disc-card__pricing">
                          <span className="disc-card__price">₹{price.toLocaleString()}</span>
                          {hasDiscount && <span className="disc-card__original">₹{p.price.toLocaleString()}</span>}
                          {hasDiscount && <span className="disc-card__off">{p.discountPercent}% off</span>}
                        </div>
                        {p.inStock
                          ? <div className="disc-card__stock--in"><IconCheck size={12} /> In Stock</div>
                          : <div className="disc-card__stock--out"><IconX size={12} /> Out of Stock</div>}
                        <button
                          className="disc-card__add-btn"
                          disabled={!p.inStock || cartLoading === p.id}
                          onClick={(e) => handleAddToCart(p.id, e)}
                        >
                          {cartLoading === p.id
                            ? 'Adding…'
                            : <><IconCart size={14} /> Add to Cart</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="disc-pagination">
                  <button
                    className="disc-page-btn"
                    disabled={page === 1}
                    onClick={() => { setPage(page - 1); window.scrollTo({ top: 70, behavior: 'smooth' }); }}
                  >
                    ← Prev
                  </button>

                  {pageButtons().map((btn, i) =>
                    btn === '...'
                      ? <span key={`dots-${i}`} className="disc-page-info">…</span>
                      : <button
                          key={btn}
                          className={`disc-page-btn ${page === btn ? 'active' : ''}`}
                          onClick={() => { setPage(btn); window.scrollTo({ top: 70, behavior: 'smooth' }); }}
                        >
                          {btn}
                        </button>
                  )}

                  <button
                    className="disc-page-btn"
                    disabled={page === totalPages}
                    onClick={() => { setPage(page + 1); window.scrollTo({ top: 70, behavior: 'smooth' }); }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Quick View Modal ── */}
      {selectedProduct && (
        <div className="disc-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="disc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="disc-modal__close" onClick={() => setSelectedProduct(null)}>
              <IconX size={16} />
            </button>

            <div className="disc-modal__img-wrap">
              {selectedProduct.images?.[0]
                ? <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="disc-modal__img" />
                : <span style={{ color: 'var(--text2)' }}><IconBag size={64} /></span>}
            </div>

            <div className="disc-modal__info">
              {selectedProduct.brand && <div className="disc-modal__brand">{selectedProduct.brand}</div>}
              <h2 className="disc-modal__name">{selectedProduct.name}</h2>
              <div className="disc-modal__stars">
                {renderStars(selectedProduct.ratings)}
                <span>({selectedProduct.numReviews || 0} reviews)</span>
              </div>
              <div className="disc-modal__price-row">
                <span className="disc-modal__price">
                  ₹{(selectedProduct.discountedPrice > 0 ? selectedProduct.discountedPrice : selectedProduct.price).toLocaleString()}
                </span>
                {selectedProduct.discountedPrice > 0 && selectedProduct.discountedPrice < selectedProduct.price && (
                  <>
                    <span className="disc-modal__original">₹{selectedProduct.price.toLocaleString()}</span>
                    <span className="disc-modal__badge">{selectedProduct.discountPercent}% OFF</span>
                  </>
                )}
              </div>
              {selectedProduct.discountedPrice > 0 && selectedProduct.discountedPrice < selectedProduct.price && (
                <div className="disc-modal__savings">
                  You save ₹{(selectedProduct.price - selectedProduct.discountedPrice).toLocaleString()}
                </div>
              )}
              {selectedProduct.description && (
                <p className="disc-modal__desc">{selectedProduct.description}</p>
              )}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <table className="disc-modal__specs">
                  <tbody>
                    {Object.entries(selectedProduct.specs).map(([k, v]) => (
                      <tr key={k}>
                        <td className="disc-modal__spec-key">{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                className="disc-modal__add-btn"
                disabled={!selectedProduct.inStock || cartLoading === selectedProduct.id}
                onClick={(e) => handleAddToCart(selectedProduct.id, e)}
              >
                {cartLoading === selectedProduct.id
                  ? 'Adding…'
                  : <><IconCart size={15} /> Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;




