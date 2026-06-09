import { useState, useEffect } from 'react';
import './User/Variables.css';

import Navbar from './User/Navbar';
import Hero from './User/Hero';
import Categories from './User/Categories';
import Products from './User/Products';
import MemberStrip from './User/Memberstrip';
import Reviews from './User/Reviews';
import Footer from './User/Footer';
import CartPage from './User/CartPage';
import MyOrdersPage from './User/MyOrdersPage';
import ProfilePage from './User/ProfilePage';
import CollectionsPage from './User/CollectionsPage';
import DealsPage from './User/DealsPage';
import BrandsPage from './User/BrandsPage';
import DiscoverPage from './User/DiscoverPage';
import AdminApp from './Admin/AdminApp';
import AboutPage from './User/AboutPage';
import ContactPage from './User/ContactPage';
import { cartAPI } from './User/api';
import LoginPage from './User/LoginPage';
import SignupPage from './User/SignupPage';

const isAdminRoute = () => window.location.pathname.startsWith('/admin');

const App = () => {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home'); // 'home' | 'cart' | 'orders' | 'profile' | 'login' | 'signup'
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [collectionTab, setCollectionTab] = useState('All');
  const [collectionSubcategory, setCollectionSubcategory] = useState(null);
  const [collectionLabel, setCollectionLabel] = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [page]);

  const goToCollection = (tab, keywords = null, label = null) => {
    setCollectionTab(tab);
    setCollectionSubcategory(keywords);
    setCollectionLabel(label || 'All Electronics');
    setPage('collections');
  };

  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    if (token && name) setUser({ name, role, email });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const refreshCartCount = async () => {
    try {
      const cart = await cartAPI.getCart();
      setCartCount(cart?.items?.length ?? 0);
    } catch { setCartCount(0); }
  };

  const handleLogin = (userData) => { setUser(userData); refreshCartCount(); setPage('home'); };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setUser(null);
    setCartCount(0);
    setPage('home');
  };

  const navbarProps = {
    theme, toggleTheme, user,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onGoSignup: () => setPage('signup'),
    onGoLogin: () => setPage('login'),
    onCartOpen: () => setPage('cart'),
    onOrdersOpen: () => setPage('orders'),
    onProfileOpen: () => setPage('profile'),
    onCollectionsOpen: () => goToCollection('Electronics', null, 'All Electronics'),
    onDealsOpen: () => setPage('deals'),
    onBrandsOpen: () => setPage('brands'),
    onDiscoverOpen: () => setPage('discover'),
    isCollections: page === 'collections',
    isDeals: page === 'deals',
    isBrands: page === 'brands',
    isDiscover: page === 'discover',
    cartCount,
  };

  if (isAdminRoute()) return <AdminApp />;

  if (page === 'login') return (
    <LoginPage
      onLogin={handleLogin}
      onGoSignup={() => setPage('signup')}
      onGoHome={() => setPage('home')}
      registeredSuccess={registeredSuccess}
    />
  );

  if (page === 'signup') return (
    <SignupPage
      onGoLogin={(opts) => { setRegisteredSuccess(opts?.registered ?? false); setPage('login'); }}
      onGoHome={() => setPage('home')}
    />
  );

  if (page === 'discover') return (
    <div>
      <Navbar {...navbarProps} />
      <DiscoverPage onBack={() => setPage('home')} onCartUpdate={refreshCartCount} />
    </div>
  );

  if (page === 'brands') return (
    <div>
      <Navbar {...navbarProps} />
      <BrandsPage onBack={() => setPage('home')} onCartUpdate={refreshCartCount} />
    </div>
  );

  if (page === 'deals') return (
    <div>
      <Navbar {...navbarProps} onCollectionsOpen={() => goToCollection('Electronics', null, 'All Electronics')} />
      <DealsPage
        onBack={() => setPage('home')}
        onCartUpdate={refreshCartCount}
      />
    </div>
  );

  if (page === 'collections') return (
    <div>
      <Navbar {...navbarProps} onCollectionsOpen={() => goToCollection('Electronics', null, 'All Electronics')} />
      <CollectionsPage
        key={`${collectionTab}-${JSON.stringify(collectionSubcategory)}`}
        initialKeywords={collectionSubcategory}
        collectionLabel={collectionLabel}
        onBack={() => setPage('home')}
        onCartUpdate={refreshCartCount}
      />
    </div>
  );

  if (page === 'profile') return (
    <div>
      <Navbar {...navbarProps} />
      <ProfilePage
        onBack={() => setPage('home')}
        onLogout={handleLogout}
        onOrdersOpen={() => setPage('orders')}
      />
    </div>
  );

  if (page === 'about') return (
    <div>
      <Navbar {...navbarProps} />
      <AboutPage onBack={() => setPage('home')} />
    </div>
  );

  if (page === 'contact') return (
    <div>
      <Navbar {...navbarProps} />
      <ContactPage onBack={() => setPage('home')} />
    </div>
  );

  if (page === 'orders') return (
    <div>
      <Navbar {...navbarProps} />
      <MyOrdersPage onBack={() => setPage('home')} />
    </div>
  );

  if (page === 'cart') return (
    <div>
      <Navbar {...navbarProps} />
      <CartPage onBack={() => { setPage('home'); refreshCartCount(); }} />
    </div>
  );

  return (
    <div>
      <Navbar {...navbarProps} />
      <main>
        <Hero onExplore={() => goToCollection('Electronics', null, 'All Electronics')} />
        <Categories onCategoryClick={goToCollection} />
        <div id="products-section">
          <Products
            key={`${collectionTab}-${JSON.stringify(collectionSubcategory)}`}
            onCartUpdate={refreshCartCount}
            initialTab={collectionTab}
            initialSubcategory={collectionSubcategory}
            collectionLabel={collectionLabel}
          />
        </div>
        <MemberStrip onSignUp={() => setPage('signup')} />
        <Reviews />
      </main>
      <Footer onDiscoverOpen={() => setPage('discover')} onDealsOpen={() => setPage('deals')} onBrandsOpen={() => setPage('brands')} onOrdersOpen={() => setPage('orders')} onAboutOpen={() => setPage('about')} onContactOpen={() => setPage('contact')} user={user} />
    </div>
  );
};

export default App;




