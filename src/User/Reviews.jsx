import { useState, useEffect, useRef } from 'react';
import { reviewAPI } from './api';
import './Reviews.css';

const STATIC_REVIEWS = [
  {
    initials: 'PR', name: 'Priya Raghavan', location: 'Mumbai · Verified Buyer',
    stars: 5, text: 'ShopMate transformed how I shop. Everything I need is in one place, and the deals are genuinely unbeatable.',
  },
  {
    initials: 'AK', name: 'Arjun Kapoor', location: 'Bangalore · Verified Buyer',
    stars: 5, text: 'The coupon system is brilliant. I saved over ₹8,000 last quarter just through their member exclusive deals.',
  },
  {
    initials: 'SM', name: 'Sneha Mehta', location: 'Pune · Verified Buyer',
    stars: 5, text: 'Fast delivery, genuine products, and the return process was totally painless. This is what online shopping should feel like.',
  },
  {
    initials: 'RV', name: 'Rohit Verma', location: 'Delhi · Verified Buyer',
    stars: 5, text: 'Absolutely love the app! The interface is smooth, products arrive on time, and customer support is top notch. Highly recommend!',
  },
  {
    initials: 'NS', name: 'Nisha Sharma', location: 'Hyderabad · Verified Buyer',
    stars: 5, text: 'I\'ve tried many shopping apps but ShopMate stands out. The price comparison feature alone saved me thousands this month.',
  },
  {
    initials: 'KP', name: 'Karan Patel', location: 'Ahmedabad · Verified Buyer',
    stars: 5, text: 'Seamless checkout, authentic products, and lightning-fast delivery. My go-to app for everything now.',
  },
  {
    initials: 'DM', name: 'Divya Menon', location: 'Chennai · Verified Buyer',
    stars: 5, text: 'The exclusive member deals are insane. Got a premium blender for half the price. ShopMate never disappoints!',
  },
  {
    initials: 'AB', name: 'Amit Bose', location: 'Kolkata · Verified Buyer',
    stars: 5, text: 'Returns are handled so efficiently. I had a minor issue and it was resolved within 24 hours. Outstanding service.',
  },
  {
    initials: 'TN', name: 'Tanvi Nair', location: 'Kochi · Verified Buyer',
    stars: 5, text: 'ShopMate\'s curated collections make it so easy to discover new products. Shopping here feels like a luxury experience.',
  },
];

const StarRow = ({ rating = 5 }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1,2,3,4,5].map((s) => (
      <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : 'var(--text3)', fontSize: '1rem' }}>★</span>
    ))}
  </div>
);

const normalise = (r) => {
  if (r.rating !== undefined) {
    const name = r.userName || r.userEmail || 'Customer';
    return {
      initials: name.split(' ').slice(0,2).map(w => w[0].toUpperCase()).join('') || 'CU',
      name,
      location: 'Verified Buyer',
      stars: r.rating,
      text: r.comment || '',
      productName: r.productName || null,
      isReal: true,
    };
  }
  return { ...r, isReal: false };
};

const ReviewCard = ({ r }) => (
  <div className="review-card">
    <div className="review-card__top">
      <div className="review-card__rating-pill">
        <span className="review-card__rating-num">{r.stars}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      {r.productName && (
        <div className="review-card__product">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          {r.productName}
        </div>
      )}
    </div>
    <p className="review-card__text">{r.text}</p>
    <div className="review-card__user">
      <div className="review-card__avatar">{r.initials}</div>
      <div className="review-card__user-info">
        <div className="review-card__name">{r.name}</div>
        <div className="review-card__loc">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:3, opacity:0.7}}>
            <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
          </svg>
          Verified Purchase
        </div>
      </div>
    </div>
  </div>
);

const Reviews = ({ productId }) => {
  const [productReviews, setProductReviews] = useState([]);
  const [allRealReviews, setAllRealReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [tab, setTab] = useState('all'); // 'all' | 'mine'
  const isLoggedIn = !!localStorage.getItem('token');

  // Load real product reviews if productId given
  useEffect(() => {
    if (productId) {
      reviewAPI.getProductReviews(productId)
        .then((d) => setProductReviews(Array.isArray(d) ? d : []))
        .catch(() => {});
    }
  }, [productId]);

  // Always load ALL real reviews for the marquee
  useEffect(() => {
    reviewAPI.getAllReviews()
      .then((d) => setAllRealReviews(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // Load user's own reviews if logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    reviewAPI.getMyReviews()
      .then((d) => setMyReviews(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // Merge real reviews + static (deduplicated by text), real reviews first
  const allDisplay = (() => {
    const real = productId
      ? productReviews.map(normalise)
      : allRealReviews.map(normalise);
    const realTexts = new Set(real.map(r => r.text));
    const staticFallback = STATIC_REVIEWS.map(normalise).filter(r => !realTexts.has(r.text));
    return [...real, ...staticFallback];
  })();

  const myDisplay = myReviews.map(normalise);

  // Calculate avg from real reviews or fallback 4.9
  const ratingSource = productId ? productReviews : allRealReviews;
  const realRatings = ratingSource.filter(r => r.rating).map(r => r.rating);
  const avgRating = realRatings.length
    ? (realRatings.reduce((a, b) => a + b, 0) / realRatings.length).toFixed(1)
    : '4.9';
  const totalLabel = realRatings.length > 0
    ? `${realRatings.length} review${realRatings.length !== 1 ? 's' : ''}`
    : '120K+ reviews';

  return (
    <section className="reviews">
      <div className="reviews__header">
        <h2 className="reviews__title">Customer<br />Reviews</h2>
        <div className="reviews__score">
          <div className="reviews__score-num">{avgRating}</div>
          <div className="reviews__score-label">out of 5 — {totalLabel}</div>
        </div>
      </div>

      {/* Tab switcher — only show if logged in */}
      {isLoggedIn && (
        <div className="reviews__tabs">
          <button
            className={`reviews__tab ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
          >
            All Reviews
          </button>
          <button
            className={`reviews__tab ${tab === 'mine' ? 'active' : ''}`}
            onClick={() => setTab('mine')}
          >
            My Reviews
            {myDisplay.length > 0 && (
              <span className="reviews__tab-count">{myDisplay.length}</span>
            )}
          </button>
        </div>
      )}

      {/* All Reviews — infinite marquee */}
      {tab === 'all' && (
        <div className="reviews__marquee-wrap">
          <div className="reviews__marquee-track">
            {[...allDisplay, ...allDisplay].map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </div>
        </div>
      )}

      {/* My Reviews */}
      {tab === 'mine' && (
        <div className="reviews__grid">
          {myDisplay.length === 0 ? (
            <div className="reviews__empty">
              <p>You haven't reviewed any products yet.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: 4 }}>
                After receiving an order, use "Rate & Review" in My Orders.
              </p>
            </div>
          ) : (
            myDisplay.map((r, i) => <ReviewCard key={i} r={r} />)
          )}
        </div>
      )}
    </section>
  );
};

export default Reviews;




