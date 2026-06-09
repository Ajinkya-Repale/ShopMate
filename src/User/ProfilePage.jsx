import { useState, useEffect } from 'react';
import { userAPI, orderAPI, addressAPI } from './api';
import './ProfilePage.css';

// ── Icons ─────────────────────────────────────────────
const BackIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const EditIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const SaveIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const UserIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const PhoneIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.21 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const MailIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const CalendarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const ShieldIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const OrdersIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></svg>);
const LogoutIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const MapPinIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const PlusIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const TrashIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>);
const StarIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);

const EMPTY_ADDR = { street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false };

// ── Address Form Modal ─────────────────────────────────
const AddressModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState(EMPTY_ADDR);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.street.trim()) { setError('Street address required'); return; }
    if (!form.city.trim())   { setError('City required'); return; }
    if (!form.pincode.trim()){ setError('Pincode required'); return; }
    setError(null); setSaving(true);
    try { await onSave(form); onClose(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="profile-modal-bg" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="profile-modal__title">Add New Address</h3>

        <div className="profile-modal__field">
          <label className="profile-field__label">Street / Flat / Area *</label>
          <input className="profile-field__input" placeholder="e.g. 101, Green Apartments, MG Road" value={form.street} onChange={set('street')} />
        </div>

        <div className="profile-modal__row">
          <div className="profile-modal__field">
            <label className="profile-field__label">City *</label>
            <input className="profile-field__input" placeholder="e.g. Pune" value={form.city} onChange={set('city')} />
          </div>
          <div className="profile-modal__field">
            <label className="profile-field__label">State</label>
            <input className="profile-field__input" placeholder="e.g. Maharashtra" value={form.state} onChange={set('state')} />
          </div>
        </div>

        <div className="profile-modal__row">
          <div className="profile-modal__field">
            <label className="profile-field__label">Pincode *</label>
            <input className="profile-field__input" placeholder="6-digit pincode" value={form.pincode} onChange={set('pincode')} maxLength={6} />
          </div>
          <div className="profile-modal__field">
            <label className="profile-field__label">Country</label>
            <input className="profile-field__input" placeholder="India" value={form.country} onChange={set('country')} />
          </div>
        </div>

        <label className="profile-modal__checkbox">
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))} />
          Set as default address
        </label>

        {error && <p className="profile-save-msg error">⚠ {error}</p>}

        <div className="profile-modal__footer">
          <button className="profile-edit-btn profile-edit-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="profile-edit-btn profile-edit-btn--save" onClick={save} disabled={saving}>
            <SaveIcon /> {saving ? 'Saving…' : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Addresses Tab ──────────────────────────────────────
const AddressesTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const [settingDefault, setSettingDefault] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setAddresses(await addressAPI.getAll() || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (addr) => {
    const updated = await addressAPI.add(addr);
    setAddresses(updated);
  };

  const handleDelete = async (idx) => {
    setDeleting(idx);
    try { setAddresses(await addressAPI.delete(idx)); }
    catch (e) { alert(e.message); }
    finally { setDeleting(null); }
  };

  const handleSetDefault = async (idx) => {
    setSettingDefault(idx);
    try { setAddresses(await addressAPI.setDefault(idx)); }
    catch (e) { alert(e.message); }
    finally { setSettingDefault(null); }
  };

  const formatAddr = (a) => [a.street, a.city, a.state, a.pincode, a.country].filter(Boolean).join(', ');

  if (loading) return <div className="profile-card"><p style={{ color: 'var(--text3)', padding: '1rem' }}>Loading addresses…</p></div>;

  return (
    <div className="profile-card">
      <div className="profile-card__header">
        <div>
          <h3 className="profile-card__title">Saved Addresses</h3>
          <p className="profile-card__sub">Used at checkout — no re-typing needed</p>
        </div>
        <button className="profile-edit-btn profile-edit-btn--save" onClick={() => setShowModal(true)}>
          <PlusIcon /> Add Address
        </button>
      </div>

      {error && <p className="profile-save-msg error">⚠ {error}</p>}

      {addresses.length === 0 ? (
        <div className="profile-addr-empty">
          <MapPinIcon />
          <p>No saved addresses yet</p>
          <span>Add one to speed up checkout</span>
        </div>
      ) : (
        <div className="profile-addr-list">
          {addresses.map((addr, idx) => (
            <div key={idx} className={`profile-addr-card ${addr.isDefault ? 'profile-addr-card--default' : ''}`}>
              <div className="profile-addr-card__left">
                <MapPinIcon />
              </div>
              <div className="profile-addr-card__body">
                <p className="profile-addr-card__text">{formatAddr(addr)}</p>
                {addr.isDefault && (
                  <span className="profile-addr-default-badge"><StarIcon /> Default</span>
                )}
              </div>
              <div className="profile-addr-card__actions">
                {!addr.isDefault && (
                  <button
                    className="profile-addr-btn"
                    onClick={() => handleSetDefault(idx)}
                    disabled={settingDefault === idx}
                    title="Set as default"
                  >
                    {settingDefault === idx ? '…' : 'Set Default'}
                  </button>
                )}
                <button
                  className="profile-addr-btn profile-addr-btn--delete"
                  onClick={() => handleDelete(idx)}
                  disabled={deleting === idx}
                  title="Delete address"
                >
                  {deleting === idx ? '…' : <TrashIcon />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <AddressModal onSave={handleAdd} onClose={() => setShowModal(false)} />}
    </div>
  );
};

// ── Profile Page ──────────────────────────────────────
const ProfilePage = ({ onBack, onLogout, onOrdersOpen }) => {
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [editing, setEditing]     = useState(false);
  const [form, setForm]           = useState({ name: '', phone: '' });
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    Promise.all([
      userAPI.getProfile(),
      orderAPI.getMyOrders().catch(() => []),
    ]).then(([prof, orders]) => {
      setProfile(prof);
      setForm({ name: prof.name || '', phone: prof.phone || '' });
      setOrderCount(Array.isArray(orders) ? orders.length : 0);
    }).catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveMsg(null);
    try {
      const updated = await userAPI.updateProfile(form);
      setProfile(updated);
      localStorage.setItem('userName', updated.name);
      setEditing(false);
      setSaveMsg('Profile updated!');
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e) {
      setSaveMsg('⚠ ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const initials = profile?.name
    ? profile.name.split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join('')
    : '?';

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—';

  if (loading) return (
    <div className="profile-page">
      <div className="profile-page__loading">
        <div className="profile-spinner" />
        <p>Loading profile…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="profile-page">
      <div className="profile-page__loading">
        <p style={{ color: '#ef4444' }}>⚠ {error}</p>
        <button className="profile-back-btn" onClick={onBack} style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-page__topbar">
        <button className="profile-back-btn" onClick={onBack}><BackIcon /> Back</button>
        <h1 className="profile-page__title">My Account</h1>
        <div style={{ width: 80 }} />
      </div>

      <div className="profile-page__layout">
        {/* ── Sidebar ── */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar__card profile-sidebar__avatar-card">
            <div className="profile-avatar">{initials}</div>
            <h2 className="profile-sidebar__name">{profile.name}</h2>
            <p className="profile-sidebar__email">{profile.email}</p>
            <div className="profile-sidebar__badge">
              <ShieldIcon />
              {profile.role === 'ADMIN' ? 'Admin' : 'Member'}
            </div>
          </div>

          <div className="profile-sidebar__card profile-sidebar__stats">
            <div className="profile-stat">
              <span className="profile-stat__num">{orderCount ?? '—'}</span>
              <span className="profile-stat__label">Orders</span>
            </div>
            <div className="profile-stat__divider" />
            <div className="profile-stat">
              <span className="profile-stat__num">{memberSince.split(' ')[1]}</span>
              <span className="profile-stat__label">Member since</span>
            </div>
          </div>

          <div className="profile-sidebar__card profile-sidebar__nav">
            <button className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <UserIcon /> Personal Info
            </button>
            <button className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
              <MapPinIcon /> My Addresses
            </button>
            <button className="profile-nav-item" onClick={onOrdersOpen}>
              <OrdersIcon /> My Orders
            </button>
            <div className="profile-nav-divider" />
            <button className="profile-nav-item profile-nav-item--logout" onClick={onLogout}>
              <LogoutIcon /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-card">
              <div className="profile-card__header">
                <div>
                  <h3 className="profile-card__title">Personal Information</h3>
                  <p className="profile-card__sub">Manage your name and contact details</p>
                </div>
                {!editing ? (
                  <button className="profile-edit-btn" onClick={() => setEditing(true)}><EditIcon /> Edit</button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="profile-edit-btn profile-edit-btn--cancel" onClick={() => { setEditing(false); setForm({ name: profile.name, phone: profile.phone || '' }); }}>Cancel</button>
                    <button className="profile-edit-btn profile-edit-btn--save" onClick={handleSave} disabled={saving}><SaveIcon /> {saving ? 'Saving…' : 'Save'}</button>
                  </div>
                )}
              </div>

              {saveMsg && <div className={`profile-save-msg ${saveMsg.startsWith('⚠') ? 'error' : 'success'}`}>{saveMsg}</div>}

              <div className="profile-fields">
                <div className="profile-field">
                  <label className="profile-field__label"><UserIcon /> Full Name</label>
                  {editing ? (
                    <input className="profile-field__input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
                  ) : (
                    <p className="profile-field__value">{profile.name || '—'}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-field__label"><MailIcon /> Email Address</label>
                  <p className="profile-field__value profile-field__value--muted">
                    {profile.email}
                    <span className="profile-field__lock">🔒 Cannot be changed</span>
                  </p>
                </div>

                <div className="profile-field">
                  <label className="profile-field__label"><PhoneIcon /> Phone Number</label>
                  {editing ? (
                    <input className="profile-field__input" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile number" maxLength={15} />
                  ) : (
                    <p className="profile-field__value">{profile.phone || <span style={{ color: 'var(--text3)' }}>Not added</span>}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-field__label"><CalendarIcon /> Member Since</label>
                  <p className="profile-field__value">{memberSince}</p>
                </div>

                <div className="profile-field">
                  <label className="profile-field__label"><ShieldIcon /> Account Type</label>
                  <p className="profile-field__value">
                    <span className="profile-role-badge">{profile.role === 'ADMIN' ? '⚡ Admin' : '👤 Customer'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && <AddressesTab />}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;




