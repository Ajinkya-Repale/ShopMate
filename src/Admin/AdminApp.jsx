import { useState, useEffect } from 'react';
import '../../src/User/Variables.css';
import './Admin.css';
import { authAPI } from '../User/api';
import AdminDashboard from './AdminDashboard';

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const AdminApp = () => {
  const [admin, setAdmin] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');
    if (token && name) setAdmin({ name });
  }, []);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      let data;
      if (mode === 'login') {
        data = await authAPI.login(form.email, form.password);
        if (data.role !== 'ADMIN') {
          throw new Error('This account does not have admin access.');
        }
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.name);
        localStorage.setItem('token', data.token);
        setAdmin({ name: data.name });
      } else {
        data = await authAPI.adminRegister(form.name, form.email, form.password, form.phone);
        setSuccess('Registered Successfully! You can now sign in.');
        setForm({ name: '', email: '', password: '', phone: '' });
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('token');
    setAdmin(null);
    setForm({ name: '', email: '', password: '', phone: '' });
    setError(null);
    setSuccess(null);
    setMode('login');
  };

  if (admin) return <AdminDashboard admin={admin} onLogout={logout} />;

  return (
    <div className="admin-wrap">
      <div className="admin-auth">
        <div className="admin-auth__card">
          <div className="admin-auth__logo">
            ShopMate<span>ADMIN</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
            {mode === 'login' ? 'Admin Sign In' : 'Create Admin Account'}
          </h2>

          {mode === 'register' && (
            <>
              <input className="admin-auth__input" placeholder="Full name" value={form.name} onChange={set('name')} />
              <input className="admin-auth__input" placeholder="Phone" value={form.phone} onChange={set('phone')} />
            </>
          )}

          <input
            className="admin-auth__input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            autoComplete="off"
          />

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              className="admin-auth__input"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
              style={{ paddingRight: '2.5rem', width: '100%', boxSizing: 'border-box' }}
            />
            <span
              onClick={() => setShowPassword((p) => !p)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: 'var(--color-text-muted, #888)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <EyeIcon open={showPassword} />
            </span>
          </div>

          {error && <p className="admin-auth__error">⚠ {error}</p>}
          {success && (
            <p style={{ color: 'green', fontSize: '0.875rem', textAlign: 'center', margin: '0.5rem 0' }}>
              ✓ {success}
            </p>
          )}

          <button className="admin-auth__btn" onClick={submit} disabled={loading}>
            {loading ? '…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="admin-auth__toggle">
            {mode === 'login' ? "Need an admin account? " : 'Already have one? '}
            <span onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
              setSuccess(null);
              setShowPassword(false);
            }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '-0.25rem' }}>
            <span
              onClick={() => (window.location.href = '/')}
              style={{ color: 'var(--text2)', cursor: 'pointer' }}
            >
              ← Back to Home
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminApp;




