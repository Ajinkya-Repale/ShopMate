import './Memberstrip.css';

const IconGift = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

const IconHeart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconPackage = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconTag = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PERKS = [
  { Icon: IconGift,    title: '20% Welcome Offer', desc: 'Off your first order' },
  { Icon: IconHeart,   title: 'Wishlist Sync',      desc: 'Save & share lists' },
  { Icon: IconPackage, title: 'Live Tracking',       desc: 'Real-time updates' },
  { Icon: IconTag,     title: 'Weekly Coupons',      desc: 'Exclusive member codes' },
];

const MemberStrip = ({ onSignUp }) => {
  return (
    <section className="ms">
      {/* Left — copy + perks */}
      <div className="ms__left">
        <p className="ms__overline">Membership Benefits</p>
        <h2 className="ms__title">
          Join free.<br />
          Save <em>instantly.</em>
        </h2>
        <p className="ms__body">
          Become a ShopMate member for exclusive deals, early access to sales,
          wishlist management, order tracking, and weekly coupon drops straight
          to your inbox.
        </p>

        <div className="ms__perks">
          {PERKS.map(({ Icon, title, desc }) => (
            <div className="ms__perk" key={title}>
              <div className="ms__perk-icon"><Icon /></div>
              <div>
                <div className="ms__perk-title">{title}</div>
                <div className="ms__perk-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — CTA */}
      <div className="ms__right">
        <div className="ms__cta-card">
          <div className="ms__cta-eyebrow">Free forever</div>
          <h3 className="ms__cta-heading">Start saving today</h3>
          <p className="ms__cta-sub">
            Create your account in under 30 seconds. No credit card needed.
          </p>

          <button className="ms__btn" onClick={onSignUp}>
            Create Free Account
            <span className="ms__btn-arrow"><IconArrow /></span>
          </button>

          <div className="ms__trust">
            <span className="ms__trust-item">
              <IconShield /> Secure
            </span>
            <span className="ms__trust-sep" />
            <span className="ms__trust-item">
              <IconCheck /> No spam
            </span>
            <span className="ms__trust-sep" />
            <span className="ms__trust-item">
              <IconX /> Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberStrip;




