import { useState } from 'react';
import './Footer.css';

const Footer = ({ onDiscoverOpen, onDealsOpen, onBrandsOpen, onOrdersOpen, onAboutOpen, onContactOpen, user }) => {
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleLink = (label) => {
    switch (label) {
      case 'About Us': return onAboutOpen?.();
      case 'Contact': return onContactOpen?.();
      case 'FAQs': return onContactOpen?.('faq');
      case 'New Arrivals': return onDiscoverOpen?.();
      case 'Flash Sales': return onDealsOpen?.();
      case 'Top Brands': return onBrandsOpen?.();
      case 'Track Order':
        if (user) onOrdersOpen?.();
        else showToast('Please login first to track your orders');
        return;
      default: return;
    }
  };

  const LINKS = {
    Shop: ['New Arrivals', 'Flash Sales', 'Top Brands', 'Clearance'],
    Help: ['Track Order', 'Returns', 'FAQs', 'Contact'],
    Company: ['About Us', 'Careers', 'Press', 'Privacy'],
  };

  const ACTIONABLE = new Set(['New Arrivals', 'Flash Sales', 'Top Brands', 'Track Order', 'About Us', 'Contact', 'FAQs']);

  return (
    <footer className="footer">
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1c1b18',
          color: '#fff',
          padding: '0.65rem 1.4rem',
          borderRadius: '100px',
          fontSize: '0.85rem',
          fontWeight: 500,
          zIndex: 9999,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {toast}
        </div>
      )}

      <div className="footer__grid">
        <div>
          <a href="/" className="footer__logo">
            ShopMate<sup>&reg;</sup>
          </a>
          <p className="footer__about">
            India's most loved shopping companion. Quality products, trusted
            sellers, unbeatable prices since 2022.
          </p>
        </div>

        {Object.entries(LINKS).map(([heading, links]) => (
          <div className="footer__col" key={heading}>
            <div className="footer__col-head">{heading}</div>
            {links.map((l) => (
              ACTIONABLE.has(l) ? (
                <a
                  key={l}
                  href="#/"
                  onClick={(e) => { e.preventDefault(); handleLink(l); }}
                  style={{ cursor: 'pointer' }}
                >
                  {l}
                </a>
              ) : (
                <a key={l} href="#/">{l}</a>
              )
            ))}
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <span>&copy; 2026 ShopMate. All rights reserved.</span>
        <span>Designed &amp; built in India</span>
      </div>
    </footer>
  );
};

export default Footer;