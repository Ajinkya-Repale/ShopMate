import { useState } from 'react';
import { authAPI } from './api';
import './AuthPages.css';

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SignupPage = ({ onGoLogin, onGoHome }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authAPI.register(form.name, form.email, form.password, form.phone);
      // Signup success → redirect to login
      onGoLogin({ registered: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-logo" onClick={onGoHome}>ShopMate<sup>®</sup></button>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join ShopMate — it's free</p>

        <form className="auth-form" onSubmit={submit}>
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={set('name')}
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Phone</label>
            <input
              className="auth-input"
              type="tel"
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={form.password}
                onChange={set('password')}
                required
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                {showPassword ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>
          </div>

          {error && <p className="auth-error">⚠ {error}</p>}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <span className="auth-switch-link" onClick={onGoLogin}>Sign in</span>
          <p style={{ textAlign: 'center', margin: '0.25rem 0 0' }}>
            <span
              onClick={onGoHome}
              style={{
                color: 'var(--text3)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--warm)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
            >
              ← Back to Home
            </span>
          </p>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;




