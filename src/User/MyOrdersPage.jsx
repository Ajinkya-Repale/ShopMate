import { useState, useEffect } from 'react';
import { orderAPI, returnAPI } from './api';
import './MyOrdersPage.css';

const STATUS_CONFIG = {
  PENDING:   { color: '#f59e0b', bg: '#fef3c7', label: 'Pending',   step: 1 },
  CONFIRMED: { color: '#3b82f6', bg: '#dbeafe', label: 'Confirmed', step: 2 },
  SHIPPED:   { color: '#8b5cf6', bg: '#ede9fe', label: 'Shipped',   step: 3 },
  DELIVERED: { color: '#10b981', bg: '#d1fae5', label: 'Delivered', step: 4 },
  CANCELLED: { color: '#ef4444', bg: '#fee2e2', label: 'Cancelled', step: 0 },
};

const STEPS = ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'];

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s ease' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const CancelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const PaymentIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ── Progress Tracker ──────────────────────────────────
const ProgressTracker = ({ status }) => {
  const cfg = STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.PENDING;
  if (cfg.step === 0) return (
    <div className="orders-progress orders-progress--cancelled">
      <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem' }}>✕ Order Cancelled</span>
    </div>
  );
  return (
    <div className="orders-progress">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const done = cfg.step >= stepNum;
        const active = cfg.step === stepNum;
        return (
          <div key={step} className="orders-progress__step">
            <div className={`orders-progress__circle ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              {done ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : stepNum}
            </div>
            <span className={`orders-progress__label ${done ? 'done' : ''}`}>{step}</span>
            {i < STEPS.length - 1 && (
              <div className={`orders-progress__line ${cfg.step > stepNum ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Review Form ───────────────────────────────────────
const ReviewForm = ({ item, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!rating) { setError('Please select a rating'); return; }
    setSubmitting(true); setError(null);
    try {
      const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${BASE_URL}/reviews/${item.productId}?rating=${rating}&comment=${encodeURIComponent(comment)}&productName=${encodeURIComponent(item.productName || item.name || '')}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed');
      setDone(true);
      onSubmitted && onSubmitted(item.productId, rating, comment);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="review-form review-form--done">
      ✅ Review submitted! Thank you.
    </div>
  );

  return (
    <div className="review-form">
      <p className="review-form__title">Rate this product</p>
      <div className="review-form__stars">
        {[1,2,3,4,5].map((s) => (
          <button key={s} className="review-star-btn"
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(s)}
          >
            <StarIcon filled={s <= (hover || rating)} />
          </button>
        ))}
        {rating > 0 && <span className="review-form__rating-label">
          {['','Poor','Fair','Good','Very Good','Excellent'][rating]}
        </span>}
      </div>
      <textarea
        className="review-form__textarea"
        placeholder="Share your experience (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '4px 0 0' }}>⚠ {error}</p>}
      <button className="review-form__submit" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </div>
  );
};

// ── Return / Exchange Form ────────────────────────────
const RETURN_REASONS = [
  'Defective / Not working',
  'Wrong item delivered',
  'Item not as described',
  'Size / fit issue',
  'Changed my mind',
  'Other',
];

const ReturnForm = ({ item, orderId, onSubmitted, onClose }) => {
  const [type, setType] = useState('RETURN');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!reason) { setError('Please select a reason'); return; }
    setSubmitting(true); setError(null);
    try {
      await returnAPI.submit(
        orderId,
        item.productId,
        item.productName || item.name,
        item.quantity,
        type,
        reason
      );
      onSubmitted(item.productId, type);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="return-form">
      <div className="return-form__header">
        <p className="return-form__title">Return / Exchange Request</p>
        <button className="return-form__close" onClick={onClose}>✕</button>
      </div>
      <p className="return-form__product">{item.productName || item.name}</p>

      <div className="return-form__type-row">
        {['RETURN', 'EXCHANGE'].map((t) => (
          <button
            key={t}
            className={`return-form__type-btn ${type === t ? 'active' : ''}`}
            onClick={() => setType(t)}
          >
            {t === 'RETURN' ? '↩ Return' : '🔄 Exchange'}
          </button>
        ))}
      </div>

      <label className="return-form__label">Reason</label>
      <select
        className="return-form__select"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">Select a reason…</option>
        {RETURN_REASONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '4px 0 0' }}>⚠ {error}</p>}

      <button
        className="return-form__submit"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Submitting…' : `Submit ${type === 'RETURN' ? 'Return' : 'Exchange'} Request`}
      </button>

      <p className="return-form__note">
        Our team will review and respond within 2–3 business days.
      </p>
    </div>
  );
};

// ── Return status tag with estimated date ─────────────
const ReturnStatusTag = ({ info }) => {
  // estimated pickup/resolution = createdAt + 3 days
  const estDate = info.createdAt
    ? new Date(new Date(info.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const statusColors = {
    PENDING:  { bg: '#fef3c7', color: '#92400e' },
    APPROVED: { bg: '#d1fae5', color: '#065f46' },
    REJECTED: { bg: '#fee2e2', color: '#991b1b' },
  };
  const sc = statusColors[info.status] || statusColors.PENDING;

  const typeLabel = info.type === 'RETURN' ? '↩ Return' : '🔄 Exchange';

  return (
    <div className="return-status-tag" style={{ background: sc.bg, color: sc.color }}>
      <span style={{ fontWeight: 600 }}>{typeLabel} · {info.status}</span>
      {info.status === 'PENDING' && estDate && (
        <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>
          {' '}— Pickup expected by {estDate}
        </span>
      )}
      {info.status === 'APPROVED' && estDate && (
        <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>
          {' '}— {info.type === 'RETURN' ? 'Refund' : 'Replacement'} by {estDate}
        </span>
      )}
      {info.status === 'REJECTED' && (
        <span style={{ fontSize: '0.75rem', opacity: 0.85 }}> — Request not approved</span>
      )}
    </div>
  );
};

// ── Single Order Card ─────────────────────────────────
const OrderCard = ({ order, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [returningId, setReturningId] = useState(null);
  // Map of productId → submitted review { rating, comment }
  const [reviewedMap, setReviewedMap] = useState({});
  // Map productId → { type, status, createdAt } — ANY existing request blocks re-submit
  const [returnMap, setReturnMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // fetch existing reviews
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/my-reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const map = {};
        list.forEach((r) => { if (r.productId) map[r.productId] = { rating: r.rating, comment: r.comment }; });
        setReviewedMap(map);
      })
      .catch(() => {});

    // fetch existing return requests — block re-submit for ANY status
    returnAPI.getMyRequests()
      .then((list) => {
        const map = {};
        const orderId = order.id || order._id;
        (list || []).forEach((r) => {
          if (r.orderId === orderId) {
            map[r.productId] = { type: r.type, status: r.status, createdAt: r.createdAt };
          }
        });
        setReturnMap(map);
      })
      .catch(() => {});
  }, []);

  // normalize field names
  const status = order.orderStatus || order.status || 'PENDING';
  const id = order.id || order._id;
  const shortId = id?.toString().slice(-8).toUpperCase();
  const cfg = STATUS_CONFIG[status.toUpperCase()] || STATUS_CONFIG.PENDING;
  const canCancel = ['PENDING', 'CONFIRMED'].includes(status.toUpperCase());
  const isDelivered = status.toUpperCase() === 'DELIVERED';

  // FIX 1: use correct price fields
  // totalPrice = MRP, totalDiscountedPrice = amount user pays, discount = savings
  const mrpTotal = order.totalPrice ?? order.items?.reduce((s, i) => s + (i.price * i.quantity), 0) ?? 0;
  const payableTotal = order.totalDiscountedPrice ?? order.totalDiscountedPrice ?? mrpTotal;
  const discountAmount = order.discount ?? (mrpTotal - payableTotal);

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true); setCancelError(null);
    try {
      await orderAPI.cancelOrder(id);
      onCancel(id);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="order-card">
      <div className="order-card__header" onClick={() => setExpanded((v) => !v)}>
        <div className="order-card__meta">
          <span className="order-card__id">Order #{shortId}</span>
          <span className="order-card__date">{formatDate(order.createdAt)}</span>
        </div>
        <div className="order-card__right">
          <span className="order-card__status" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
          {/* Show payable amount in header */}
          <span className="order-card__total">₹{payableTotal.toLocaleString('en-IN')}</span>
          <ChevronIcon open={expanded} />
        </div>
      </div>

      <div className="order-card__preview">
        {order.items?.slice(0, 3).map((item, i) => (
          <div key={i} className="order-card__preview-item">
            {item.imageUrl || item.image ? (
              <img src={item.imageUrl || item.image} alt={item.productName || item.name} className="order-card__preview-img" />
            ) : (
              <div className="order-card__preview-img order-card__preview-img--placeholder"><PackageIcon /></div>
            )}
            <div className="order-card__preview-info">
              <p className="order-card__preview-name">{item.productName || item.name}</p>
              {/* FIX 1: show discountedPrice in preview */}
              <p className="order-card__preview-qty">
                Qty: {item.quantity} · ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
        {order.items?.length > 3 && (
          <p className="order-card__more">+{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}</p>
        )}
      </div>

      <ProgressTracker status={status} />

      {expanded && (
        <div className="order-card__details">
          <h4 className="order-card__section-title">Items Ordered</h4>
          <div className="order-card__items">
            {order.items?.map((item, i) => (
              <div key={i} className="order-item">
                {item.imageUrl || item.image ? (
                  <img src={item.imageUrl || item.image} alt={item.productName || item.name} className="order-item__img" />
                ) : (
                  <div className="order-item__img order-item__img--placeholder"><PackageIcon /></div>
                )}
                <div className="order-item__info">
                  <p className="order-item__name">{item.productName || item.name}</p>
                  {item.brand && <p className="order-item__brand">{item.brand}</p>}
                  {item.category && <p className="order-item__category">{item.category}</p>}

                  {/* FIX 1: show MRP strikethrough + discounted price */}
                  <div className="order-item__price-row">
                    {item.discountedPrice && item.discountedPrice < item.price ? (
                      <>
                        <span className="order-item__price order-item__price--mrp">₹{item.price?.toLocaleString('en-IN')}</span>
                        <span className="order-item__price order-item__price--discounted">₹{item.discountedPrice?.toLocaleString('en-IN')}</span>
                      </>
                    ) : (
                      <span className="order-item__price">₹{item.price?.toLocaleString('en-IN')}</span>
                    )}
                    <span className="order-item__x">×</span>
                    <span className="order-item__qty">{item.quantity}</span>
                    <span className="order-item__subtotal">
                      = ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Rate & Review — only for DELIVERED orders */}
                  {isDelivered && item.productId && !reviewedMap[item.productId] && (
                    <button
                      className="review-trigger-btn"
                      onClick={() => {
                        setReviewingId(reviewingId === item.productId ? null : item.productId);
                        setReturningId(null);
                      }}
                    >
                      ⭐ {reviewingId === item.productId ? 'Close' : 'Rate & Review'}
                    </button>
                  )}
                  {reviewedMap[item.productId] && (
                    <div className="review-done-tag">
                      <span>✅ Reviewed — </span>
                      {'★'.repeat(reviewedMap[item.productId].rating)}
                      {reviewedMap[item.productId].comment && (
                        <span className="review-done-comment"> "{reviewedMap[item.productId].comment}"</span>
                      )}
                    </div>
                  )}
                  {reviewingId === item.productId && (
                    <ReviewForm
                      item={item}
                      onSubmitted={(pid, rating, comment) => {
                        setReviewedMap((p) => ({ ...p, [pid]: { rating, comment } }));
                        setReviewingId(null);
                      }}
                    />
                  )}

                  {/* FIX 2 + 3: Return/Exchange — show status tag if exists, else button */}
                  {isDelivered && item.productId && (
                    returnMap[item.productId] ? (
                      // FIX 2: show note with estimated date; FIX 3: no re-submit
                      <ReturnStatusTag info={returnMap[item.productId]} />
                    ) : (
                      <>
                        <button
                          className="return-trigger-btn"
                          onClick={() => {
                            setReturningId(returningId === item.productId ? null : item.productId);
                            setReviewingId(null);
                          }}
                        >
                          ↩ {returningId === item.productId ? 'Close' : 'Return / Exchange'}
                        </button>
                        {returningId === item.productId && (
                          <ReturnForm
                            item={item}
                            orderId={id}
                            onSubmitted={(pid, type) => {
                              // FIX 3: immediately add to returnMap so button disappears
                              setReturnMap((prev) => ({
                                ...prev,
                                [pid]: { type, status: 'PENDING', createdAt: new Date().toISOString() },
                              }));
                              setReturningId(null);
                            }}
                            onClose={() => setReturningId(null)}
                          />
                        )}
                      </>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <h4 className="order-card__section-title">Price Details</h4>
          <div className="order-card__price-box">
            {/* FIX 1: show MRP, discount, and payable correctly */}
            <div className="order-card__price-row">
              <span>MRP ({order.items?.length} item{order.items?.length !== 1 ? 's' : ''})</span>
              <span>₹{mrpTotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="order-card__price-row order-card__price-row--green">
                <span>Discount</span>
                <span>− ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="order-card__price-row">
              <span>Delivery</span>
              <span className="order-card__free">FREE</span>
            </div>
            <div className="order-card__price-divider" />
            <div className="order-card__price-row order-card__price-row--total">
              <span>Total Amount</span>
              <span>₹{payableTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="order-card__meta-grid">
            {order.shippingAddress && (
              <div className="order-card__meta-box">
                <p className="order-card__meta-label"><LocationIcon /> Delivery Address</p>
                <p className="order-card__meta-value">
                  {typeof order.shippingAddress === 'object'
                    ? [order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.pincode, order.shippingAddress.country].filter(Boolean).join(', ')
                    : order.shippingAddress}
                </p>
              </div>
            )}
            {order.paymentMethod && (
              <div className="order-card__meta-box">
                <p className="order-card__meta-label"><PaymentIcon /> Payment Method</p>
                <p className="order-card__meta-value">{order.paymentMethod}</p>
              </div>
            )}
          </div>

          {canCancel && (
            <div style={{ marginTop: '1rem' }}>
              <button className="order-card__cancel-btn" onClick={handleCancel} disabled={cancelling}>
                <CancelIcon />
                {cancelling ? 'Cancelling…' : 'Cancel Order'}
              </button>
              {cancelError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 6 }}>⚠ {cancelError}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────
const MyOrdersPage = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    orderAPI.getMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id || o._id === id)
        ? { ...o, orderStatus: 'CANCELLED', status: 'CANCELLED' }
        : o)
    );
  };

  const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const getStatus = (o) => (o.orderStatus || o.status || '').toUpperCase();

  const filtered = filter === 'ALL'
    ? orders
    : orders.filter((o) => getStatus(o) === filter);

  return (
    <div className="orders-page">
      <div className="orders-page__topbar">
        <button className="orders-page__back" onClick={onBack}><BackIcon /> Back</button>
        <h1 className="orders-page__title">My Orders</h1>
        <span className="orders-page__count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="orders-page__filters">
        {FILTERS.map((f) => (
          <button key={f} className={`orders-filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? 'All Orders' : STATUS_CONFIG[f]?.label || f}
            {f !== 'ALL' && (
              <span className="orders-filter-chip__count">
                {orders.filter((o) => getStatus(o) === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="orders-page__content">
        {loading && (
          <div className="orders-page__empty">
            <div className="orders-spinner" />
            <p>Loading your orders…</p>
          </div>
        )}
        {!loading && error && (
          <div className="orders-page__empty">
            <p style={{ color: '#ef4444' }}>⚠ {error}</p>
            <button className="orders-retry-btn" onClick={() => { setLoading(true); setError(null); orderAPI.getMyOrders().then(setOrders).catch((e) => setError(e.message)).finally(() => setLoading(false)); }}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="orders-page__empty">
            <div style={{ color: 'var(--text3)', marginBottom: '1rem' }}><PackageIcon /></div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              {filter === 'ALL' ? 'No orders yet' : `No ${STATUS_CONFIG[filter]?.label || filter} orders`}
            </p>
            <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>
              {filter === 'ALL' ? 'Your orders will appear here once you shop.' : 'Try a different filter.'}
            </p>
          </div>
        )}
        {!loading && !error && filtered.map((order) => (
          <OrderCard key={order.id || order._id} order={order} onCancel={handleCancel} />
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;




