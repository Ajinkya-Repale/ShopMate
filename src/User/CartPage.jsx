import { useState, useEffect } from 'react';
import { cartAPI, orderAPI, couponAPI, addressAPI, buildAddress } from './api';
import ProductDetailModal from './ProductDetailModal';
import './CartPage.css';

/* ─── SVG Icons ─── */
const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const IconCart = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const IconPackage = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IconMinus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconPlus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconCheck = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconStar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconTag = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

/* ─── Component ─── */
const CartPage = ({ onBack }) => {
  const [cart, setCart]                         = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [ordering, setOrdering]                 = useState(false);
  const [orderSuccess, setOrderSuccess]         = useState(null);
  const [error, setError]                       = useState(null);
  const [address, setAddress]                   = useState('');
  const [payment, setPayment]                   = useState('COD');

  // ── Saved addresses ──
  const [savedAddresses, setSavedAddresses]     = useState([]);
  const [selectedAddrIdx, setSelectedAddrIdx]   = useState(null); // index into savedAddresses, or null = custom
  const [showCustomAddr, setShowCustomAddr]     = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // ── Coupon state ──
  const [couponInput, setCouponInput]           = useState('');
  const [couponCode, setCouponCode]             = useState('');      // applied code
  const [couponDiscount, setCouponDiscount]     = useState(0);
  const [couponMsg, setCouponMsg]               = useState('');
  const [couponSuccess, setCouponSuccess]       = useState(false);
  const [couponLoading, setCouponLoading]       = useState(false);

  const loadCart = async () => {
    try {
      setLoading(true);
      const [data, addrs] = await Promise.all([
        cartAPI.getCart(),
        addressAPI.getAll().catch(() => []),
      ]);
      setCart(data);
      setSavedAddresses(addrs || []);
      // Pre-select default address
      const defIdx = (addrs || []).findIndex((a) => a.isDefault);
      if (defIdx >= 0) { setSelectedAddrIdx(defIdx); setShowCustomAddr(false); }
      else if ((addrs || []).length > 0) { setSelectedAddrIdx(0); setShowCustomAddr(false); }
      else { setShowCustomAddr(true); }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const updateQty = async (productId, qty) => {
    try {
      qty < 1 ? await cartAPI.removeItem(productId) : await cartAPI.updateItem(productId, qty);
      // reset coupon when cart changes
      resetCoupon();
      await loadCart();
    } catch (e) { setError(e.message); }
  };

  const removeItem = async (productId) => {
    try { await cartAPI.removeItem(productId); resetCoupon(); await loadCart(); }
    catch (e) { setError(e.message); }
  };

  const clearCart = async () => {
    try { await cartAPI.clearCart(); resetCoupon(); await loadCart(); }
    catch (e) { setError(e.message); }
  };

  const resetCoupon = () => {
    setCouponCode('');
    setCouponInput('');
    setCouponDiscount(0);
    setCouponMsg('');
    setCouponSuccess(false);
  };

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponMsg('Enter a coupon code.'); setCouponSuccess(false); return; }
    setCouponLoading(true);
    setCouponMsg('');
    try {
      const discount = await couponAPI.apply(code, discounted);
      setCouponDiscount(discount);
      setCouponCode(code);
      setCouponSuccess(true);
      setCouponMsg(`Coupon applied! You save ₹${discount.toLocaleString()}`);
    } catch (e) {
      setCouponDiscount(0);
      setCouponCode('');
      setCouponSuccess(false);
      setCouponMsg(e.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    resetCoupon();
  };

  const placeOrder = async () => {
    let shippingAddress;
    if (!showCustomAddr && selectedAddrIdx !== null && savedAddresses[selectedAddrIdx]) {
      shippingAddress = savedAddresses[selectedAddrIdx];
    } else {
      if (!address.trim()) { setError('Please enter a shipping address.'); return; }
      shippingAddress = buildAddress(address);
    }
    setError(null);
    setOrdering(true);
    try {
      const result = await orderAPI.placeOrder(shippingAddress, payment, couponCode || null);
      setOrderSuccess(result);
      await loadCart();
    } catch (e) { setError(e.message); }
    finally { setOrdering(false); }
  };

  const items      = cart?.items ?? [];
  const itemCount  = items.length;
  const total      = cart?.totalPrice ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discounted = (cart?.totalDiscountedPrice != null && cart?.totalDiscountedPrice > 0)
    ? cart.totalDiscountedPrice
    : items.reduce((s, i) => s + ((i.discountedPrice > 0 ? i.discountedPrice : i.price) * i.quantity), 0);
  const savings    = total - discounted;
  const finalTotal = discounted - couponDiscount;

  /* ── Success Screen ── */
  if (orderSuccess) {
    return (
      <div className="cart-page">
        <div className="cart-success-box">
          <div className="cart-success-icon"><IconCheck /></div>
          <h2 className="cart-success-title">Order Placed!</h2>
          <p className="cart-success-sub">
            Order #{orderSuccess.id ?? orderSuccess._id ?? '—'} confirmed.<br />
            We'll notify you when it ships.
          </p>
          <button className="cart-primary-btn" style={{ width: 'auto', padding: '14px 40px' }} onClick={onBack}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <button className="cart-back-btn" onClick={onBack}>
          <IconArrowLeft /><span>Back</span>
        </button>
        <h1 className="cart-title">
          Your Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </h1>
      </div>

      {error && (
        <div className="cart-error-banner"><IconAlert />{error}</div>
      )}

      {loading ? (
        <div className="cart-center">Loading cart…</div>
      ) : !items.length ? (
        <div className="cart-empty-box">
          <IconCart />
          <p className="cart-empty-text">Your cart is empty</p>
          <button className="cart-primary-btn" style={{ width: 'auto', padding: '13px 36px' }} onClick={onBack}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">

          {/* ── Items Column ── */}
          <div className="cart-items-col">
            <div className="cart-items-header">
              <span className="cart-section-label">Items ({itemCount})</span>
              <button className="cart-clear-btn" onClick={clearCart}>
                <IconTrash /> Clear All
              </button>
            </div>

            {items.map((item) => {
              const id          = item.productId;
              const name        = item.productName || item.name || 'Product';
              const origPrice   = item.price ?? 0;
              const salePrice   = item.discountedPrice > 0 ? item.discountedPrice : origPrice;
              const hasDiscount = origPrice > salePrice;
              const discPct     = hasDiscount ? Math.round((1 - salePrice / origPrice) * 100) : 0;
              const img         = item.image || null;
              const cat         = item.category  ?? null;
              const brand       = item.brand     ?? null;
              const ratings     = item.ratings   ?? null;

              return (
                <div key={id} className="cart-item-card"
                  onClick={() => setSelectedProductId(id)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view product details"
                >
                  <div className="cart-item-img">
                    {img ? <img src={img} alt={name} /> : <IconPackage />}
                  </div>

                  <div className="cart-item-info">
                    <p className="cart-item-name" title={name}>{name}</p>

                    {(cat || brand || ratings) && (
                      <div className="cart-item-meta">
                        {cat    && <span className="cart-item-category">{cat}</span>}
                        {brand  && <span className="cart-item-brand">{brand}</span>}
                        {ratings > 0 && (
                          <span className="cart-item-rating">
                            <IconStar />{ratings.toFixed(1)}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="cart-item-price-row">
                      <p className="cart-item-discounted-price">₹{salePrice.toLocaleString()}</p>
                      {hasDiscount && (
                        <>
                          <p className="cart-item-original-price">₹{origPrice.toLocaleString()}</p>
                          <span className="cart-item-discount-badge">{discPct}% off</span>
                        </>
                      )}
                    </div>

                    <div className="cart-item-view-hint">
                      <IconEye /> View full details
                    </div>
                  </div>

                  <div className="cart-qty-control" onClick={(e) => e.stopPropagation()}>
                    <button className="cart-qty-btn" onClick={() => updateQty(id, item.quantity - 1)} aria-label="Decrease">
                      <IconMinus />
                    </button>
                    <span className="cart-qty-num">{item.quantity}</span>
                    <button className="cart-qty-btn" onClick={() => updateQty(id, item.quantity + 1)} aria-label="Increase">
                      <IconPlus />
                    </button>
                  </div>

                  <div>
                    <div className="cart-item-total">₹{(salePrice * item.quantity).toLocaleString()}</div>
                    {hasDiscount && (
                      <div className="cart-item-total-orig">₹{(origPrice * item.quantity).toLocaleString()}</div>
                    )}
                  </div>

                  <button className="cart-remove-btn" onClick={(e) => { e.stopPropagation(); removeItem(id); }} aria-label="Remove">
                    <IconX />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Summary Column ── */}
          <div className="cart-summary-col">
            <p className="cart-section-label">Order Summary</p>

            <div className="cart-summary-row">
              <span>MRP ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            {savings > 0 && (
              <div className="cart-summary-row savings">
                <span>Product discount</span>
                <span>− ₹{savings.toLocaleString()}</span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="cart-summary-row savings">
                <span>Coupon ({couponCode})</span>
                <span>− ₹{couponDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="cart-shipping-free">Free</span>
            </div>

            <div className="cart-divider" />

            <div className="cart-summary-row total">
              <span>Total</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>

            {(savings > 0 || couponDiscount > 0) && (
              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                You save ₹{(savings + couponDiscount).toLocaleString()} on this order!
              </div>
            )}

            <div className="cart-divider" />

            {/* ── Coupon Section ── */}
            <p className="cart-field-label">
              <IconTag style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Coupon Code
            </p>

            {couponSuccess ? (
              <div className="cart-coupon-applied">
                <div className="cart-coupon-applied-info">
                  <span className="cart-coupon-badge">{couponCode}</span>
                  <span className="cart-coupon-success-text">− ₹{couponDiscount.toLocaleString()} off</span>
                </div>
                <button className="cart-coupon-remove-btn" onClick={removeCoupon} title="Remove coupon">
                  <IconX />
                </button>
              </div>
            ) : (
              <div className="cart-coupon-row">
                <input
                  className="cart-coupon-input"
                  type="text"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                  maxLength={30}
                />
                <button
                  className="cart-coupon-apply-btn"
                  onClick={applyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading ? '…' : 'Apply'}
                </button>
              </div>
            )}

            {couponMsg && !couponSuccess && (
              <div className="cart-coupon-error">
                <IconAlert /> {couponMsg}
              </div>
            )}

            <div className="cart-divider" />

            <p className="cart-field-label">Shipping Address</p>

            {savedAddresses.length > 0 && (
              <div className="cart-addr-list">
                {savedAddresses.map((a, idx) => (
                  <label key={idx} className={`cart-addr-option ${selectedAddrIdx === idx && !showCustomAddr ? 'cart-addr-option--selected' : ''}`}>
                    <input
                      type="radio"
                      name="shippingAddr"
                      checked={selectedAddrIdx === idx && !showCustomAddr}
                      onChange={() => { setSelectedAddrIdx(idx); setShowCustomAddr(false); }}
                    />
                    <span className="cart-addr-option__text">
                      {[a.street, a.city, a.state, a.pincode].filter(Boolean).join(', ')}
                      {a.isDefault && <span className="cart-addr-default-chip">Default</span>}
                    </span>
                  </label>
                ))}
                <label className={`cart-addr-option ${showCustomAddr ? 'cart-addr-option--selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingAddr"
                    checked={showCustomAddr}
                    onChange={() => { setShowCustomAddr(true); setSelectedAddrIdx(null); }}
                  />
                  <span className="cart-addr-option__text">+ Use a different address</span>
                </label>
              </div>
            )}

            {(showCustomAddr || savedAddresses.length === 0) && (
              <textarea
                className="cart-textarea"
                placeholder="Enter your full shipping address…"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            )}

            <p className="cart-field-label">Payment Method</p>
            <div className="cart-payment-group">
              {['COD', 'UPI', 'Card'].map((m) => (
                <label key={m} className="cart-radio-label">
                  <input type="radio" name="payment" value={m} checked={payment === m} onChange={() => setPayment(m)} />
                  {m === 'COD' ? 'Cash on Delivery' : m}
                </label>
              ))}
            </div>

            <button className="cart-primary-btn" onClick={placeOrder} disabled={ordering}>
              {ordering ? 'Placing Order…' : 'Place Order →'}
            </button>
          </div>

        </div>
      )}

      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onAddToCart={async (productId, qty) => {
            await cartAPI.addItem(productId, qty);
            await loadCart();
          }}
        />
      )}
    </div>
  );
};

export default CartPage;




