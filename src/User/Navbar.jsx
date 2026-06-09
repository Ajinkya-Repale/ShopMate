import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const OrdersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="12" y2="16"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const ProfileIcon2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const CollectionsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const DealsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);

const BrandsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
  </svg>
);

const DiscoverIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const ProfileDropdown = ({ user, onLogout, onOrdersOpen, onProfileOpen, onClose }) => {
  const initials = user.name.split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  return (
    <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="profile-dropdown__header">
        <div className="profile-dropdown__avatar">{initials}</div>
        <div>
          <p className="profile-dropdown__name">{user.name}</p>
          <p className="profile-dropdown__email">{user.email || localStorage.getItem('userEmail') || 'Member'}</p>
        </div>
      </div>
      <div className="profile-dropdown__divider" />
      <button className="profile-dropdown__item" onClick={() => { onClose(); onProfileOpen(); }}>
        <ProfileIcon2 /> My Profile
      </button>
      <button className="profile-dropdown__item" onClick={() => { onClose(); onOrdersOpen(); }}>
        <OrdersIcon /> My Orders
      </button>
      <div className="profile-dropdown__divider" />
      <button className="profile-dropdown__item profile-dropdown__item--logout" onClick={() => { onClose(); onLogout(); }}>
        <LogoutIcon /> Sign Out
      </button>
    </div>
  );
};

// ── Navbar ────────────────────────────────────────────────
const Navbar = ({
  theme, toggleTheme, user, onLogin, onLogout,
  onCartOpen, onOrdersOpen, onProfileOpen,
  onCollectionsOpen, onDealsOpen, onBrandsOpen, onDiscoverOpen,
  onGoSignup, onGoLogin,
  isCollections = false, isDeals = false, isBrands = false, isDiscover = false,
  cartCount = 0,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  const navLinks = [
    { label: 'Collections', active: isCollections, onClick: onCollectionsOpen, icon: <CollectionsIcon /> },
    { label: 'Deals',       active: isDeals,       onClick: onDealsOpen,       icon: <DealsIcon /> },
    { label: 'Brands',      active: isBrands,      onClick: onBrandsOpen,      icon: <BrandsIcon /> },
    { label: 'Discover',    active: isDiscover,    onClick: onDiscoverOpen,    icon: <DiscoverIcon /> },
  ];

  const initials = user ? user.name.split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join('') : '';

  return (
    <>
      <nav className="navbar">
        <a href="/" className="navbar__logo">ShopMate<sup>®</sup></a>

        {/* Desktop links */}
        <ul className="navbar__links">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a href="#/" className={l.active ? 'navbar__link--active' : ''}
                onClick={(e) => { e.preventDefault(); l.onClick?.(); }}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar__end">
          <button className="navbar__icon-btn navbar__theme-hide" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {user && (
            <button className="navbar__icon-btn" aria-label="Cart" style={{ position: 'relative' }} onClick={onCartOpen}>
              <CartIcon />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--warm)', color: '#fff', borderRadius: '50%', fontSize: '0.65rem', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {user ? (
            <div className="profile-wrapper" ref={dropdownRef}>
              <button className="navbar__icon-btn profile-trigger" onClick={() => setShowDropdown((v) => !v)} aria-label="Profile menu" aria-expanded={showDropdown}>
                <ProfileIcon />
              </button>
              {showDropdown && (
                <ProfileDropdown
                  user={user}
                  onLogout={onLogout}
                  onOrdersOpen={onOrdersOpen}
                  onProfileOpen={onProfileOpen}
                  onClose={() => setShowDropdown(false)}
                />
              )}
            </div>
          ) : (
            <button className="navbar__join-btn" onClick={onGoSignup}>Join Free</button>
          )}

          <button
            className={`navbar__hamburger${drawerOpen ? ' is-open' : ''}`}
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={drawerOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={`navbar__drawer-overlay${drawerOpen ? ' is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav className={`navbar__drawer${drawerOpen ? ' is-open' : ''}`} aria-label="Mobile menu">

        {/* Header */}
        <div className="navbar__drawer-header">
          <a href="/" className="navbar__drawer-logo">ShopMate<sup style={{ fontSize: '0.5rem', color: 'var(--warm)', verticalAlign: 'super' }}>®</sup></a>
          <button className="navbar__drawer-close" onClick={closeDrawer} aria-label="Close menu">✕</button>
        </div>

        {/* User card — shown when logged in */}
        {user && (
          <div className="navbar__drawer-user">
            <div className="navbar__drawer-user__avatar">{initials}</div>
            <div className="navbar__drawer-user__info">
              <p className="navbar__drawer-user__name">{user.name}</p>
              <p className="navbar__drawer-user__email">{user.email || localStorage.getItem('userEmail') || 'Member'}</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div className="navbar__drawer-section-label">Navigate</div>
        <ul className="navbar__drawer-links">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a href="#/" className={l.active ? 'navbar__link--active' : ''}
                onClick={(e) => { e.preventDefault(); l.onClick?.(); closeDrawer(); }}>
                <span className="navbar__drawer-link-icon">{l.icon}</span>
                <span className="navbar__drawer-link-label">{l.label}</span>
                <span className="navbar__drawer-link-arrow"><ChevronRight /></span>
              </a>
            </li>
          ))}
        </ul>

        {/* Account links — shown when logged in */}
        {user && (
          <>
            <div className="navbar__drawer-section-label">Account</div>
            <ul className="navbar__drawer-links navbar__drawer-links--account">
              <li>
                <a href="#/" onClick={(e) => { e.preventDefault(); onProfileOpen?.(); closeDrawer(); }}>
                  <span className="navbar__drawer-link-icon"><ProfileIcon2 /></span>
                  <span className="navbar__drawer-link-label">My Profile</span>
                  <span className="navbar__drawer-link-arrow"><ChevronRight /></span>
                </a>
              </li>
              <li>
                <a href="#/" onClick={(e) => { e.preventDefault(); onOrdersOpen?.(); closeDrawer(); }}>
                  <span className="navbar__drawer-link-icon"><OrdersIcon /></span>
                  <span className="navbar__drawer-link-label">My Orders</span>
                  <span className="navbar__drawer-link-arrow"><ChevronRight /></span>
                </a>
              </li>
              {cartCount > 0 && (
                <li>
                  <a href="#/" onClick={(e) => { e.preventDefault(); onCartOpen?.(); closeDrawer(); }}>
                    <span className="navbar__drawer-link-icon"><CartIcon /></span>
                    <span className="navbar__drawer-link-label">My Cart</span>
                    <span className="navbar__drawer-link-badge">{cartCount}</span>
                    <span className="navbar__drawer-link-arrow"><ChevronRight /></span>
                  </a>
                </li>
              )}
            </ul>
          </>
        )}

        {/* Footer */}
        <div className="navbar__drawer-footer">
          <button className="navbar__drawer-theme-btn" onClick={toggleTheme}>
            <span className="navbar__drawer-theme-icon">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            <span className="navbar__drawer-theme-pill">{theme === 'dark' ? 'ON' : 'OFF'}</span>
          </button>

          {user ? (
            <button className="navbar__drawer-logout-btn" onClick={() => { onLogout(); closeDrawer(); }}>
              <LogoutIcon /> Sign Out
            </button>
          ) : (
            <button className="navbar__join-btn" onClick={() => { onGoSignup(); closeDrawer(); }}>
              Join Free — It's Free
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;




