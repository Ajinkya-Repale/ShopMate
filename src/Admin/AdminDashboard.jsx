import { useState, useEffect, useRef } from 'react';
import './Admin.css';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

/* ─── SVG Icons ─── */
const Icon = ({ name, size = 16, className = '' }) => {
  const icons = {
    products: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    coupons: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    returns: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.6"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    image: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    toggle_on: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3" fill="currentColor"/></svg>,
    toggle_off: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="3" fill="currentColor"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6.06 6.06l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.92 18l.08-1.08z"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    mappin: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    spinner: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  };
  return icons[name] || null;
};

/* ─── API helpers ─── */
const adminProductAPI = {
  getAll: () => fetch(`${BASE_URL}/admin/products`, { headers: getHeaders() }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
  create: (body) => fetch(`${BASE_URL}/admin/products`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
  update: (id, body) => fetch(`${BASE_URL}/admin/products/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
  delete: (id) => fetch(`${BASE_URL}/admin/products/${id}`, { method: 'DELETE', headers: getHeaders() }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
};
const adminReturnAPI = {
  getAll: () => fetch(`${BASE_URL}/admin/returns`, { headers: getHeaders() }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
  updateStatus: (id, status, adminNote = '') => fetch(`${BASE_URL}/admin/returns/${id}/status`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status, adminNote }) }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
};
const adminUserAPI = {
  getAll: () => fetch(`${BASE_URL}/admin/users`, { headers: getHeaders() }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
};
const adminCouponAPI = {
  getAll: () => fetch(`${BASE_URL}/coupon/admin/all`, { headers: getHeaders() }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
  create: (body) => fetch(`${BASE_URL}/coupon/admin/create`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
  toggle: (id) => fetch(`${BASE_URL}/coupon/admin/${id}/toggle`, { method: 'PUT', headers: getHeaders() }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
  delete: (id) => fetch(`${BASE_URL}/coupon/admin/${id}`, { method: 'DELETE', headers: getHeaders() }).then((r) => r.json()).then((d) => { if (!d.success) throw new Error(d.message); return d.data; }),
};

/* ─── FIX: Upload image file to backend, return URL ─── */
const uploadImageFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/admin/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    // NOTE: do NOT set Content-Type here — browser sets it with boundary for multipart
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Upload failed');
  return data.data; // this is the image URL string returned by backend
};

const EMPTY_PRODUCT = { name: '', description: '', brand: '', category: '', subCategory: '', price: '', discountedPrice: '', discountPercent: '', quantity: '', images: '' };
const EMPTY_COUPON  = { code: '', discountPercent: '', minOrderValue: '', maxDiscount: '', expiryDate: '' };
const RETURN_STATUS_COLORS = {
  PENDING:  { color: '#92400e', bg: '#fef3c7' },
  APPROVED: { color: '#065f46', bg: '#d1fae5' },
  REJECTED: { color: '#991b1b', bg: '#fee2e2' },
};
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

/* ─── Product Modal ─── */
const ProductModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || EMPTY_PRODUCT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // FIX: store pending File objects (not base64) + their local preview URLs
  const [pendingFiles, setPendingFiles] = useState([]); // [{ file: File, preview: string }]
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef(null);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  // FIX: on file pick, generate local preview only — do NOT upload yet
  const handleFilePick = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const preview = URL.createObjectURL(file);
      setPendingFiles((prev) => [...prev, { file, preview }]);
    });
    e.target.value = '';
  };

  // Cleanup object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => { pendingFiles.forEach((pf) => URL.revokeObjectURL(pf.preview)); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    setError(null);
    setLoading(true);
    try {
      // FIX: upload all pending local files to backend first, collect URLs
      let uploadedUrls = [];
      if (pendingFiles.length > 0) {
        setUploadingCount(pendingFiles.length);
        uploadedUrls = await Promise.all(pendingFiles.map((pf) => uploadImageFile(pf.file)));
        setUploadingCount(0);
      }

      // Merge manually-typed URLs + newly uploaded URLs
      const urlImages = form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [];
      const allImages = [...urlImages, ...uploadedUrls];

      await onSave({
        ...form,
        price: parseFloat(form.price) || 0,
        discountedPrice: parseFloat(form.discountedPrice) || 0,
        discountPercent: parseInt(form.discountPercent) || 0,
        quantity: parseInt(form.quantity) || 0,
        images: allImages,
      });
      onClose();
    } catch (err) {
      setError(err.message);
      setUploadingCount(0);
    } finally {
      setLoading(false);
    }
  };

  const urlPreviews = form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const removeUrlImage = (idx) => {
    setForm((p) => ({ ...p, images: urlPreviews.filter((_, i) => i !== idx).join(', ') }));
  };

  const removePendingFile = (idx) => {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const isBusy = loading || uploadingCount > 0;

  return (
    <div className="admin-modal-bg" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__title">{initial ? 'Edit Product' : 'Add New Product'}</div>
        <div><label className="admin-form__label">Product Name</label><input className="admin-form__input" placeholder="e.g. Wireless Headphones" value={form.name} onChange={set('name')} /></div>
        <div><label className="admin-form__label">Description</label><textarea className="admin-form__input admin-form__textarea" placeholder="Product description…" value={form.description} onChange={set('description')} /></div>
        <div className="admin-form__row">
          <div><label className="admin-form__label">Brand</label><input className="admin-form__input" placeholder="e.g. Sony" value={form.brand} onChange={set('brand')} /></div>
          <div><label className="admin-form__label">Category</label>
            <select className="admin-form__input" value={form.category} onChange={set('category')}>
              <option value="">Select…</option>
              {['Fashion','Electronics','Home','Beauty'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div><label className="admin-form__label">Sub-Category</label><input className="admin-form__input" placeholder="e.g. Headphones" value={form.subCategory} onChange={set('subCategory')} /></div>
        <div className="admin-form__row">
          <div><label className="admin-form__label">Price (₹)</label><input className="admin-form__input" type="number" placeholder="0" value={form.price} onChange={set('price')} /></div>
          <div><label className="admin-form__label">Discounted Price (₹)</label><input className="admin-form__input" type="number" placeholder="0" value={form.discountedPrice} onChange={set('discountedPrice')} /></div>
        </div>
        <div className="admin-form__row">
          <div><label className="admin-form__label">Discount %</label><input className="admin-form__input" type="number" placeholder="0" value={form.discountPercent} onChange={set('discountPercent')} /></div>
          <div><label className="admin-form__label">Stock Qty</label><input className="admin-form__input" type="number" placeholder="0" value={form.quantity} onChange={set('quantity')} /></div>
        </div>
        <div>
          <label className="admin-form__label">Images</label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleFilePick} />
          <button type="button" className="admin-btn admin-btn--ghost admin-btn--icon-label" style={{ width:'100%', marginBottom:8 }} onClick={() => fileInputRef.current.click()} disabled={isBusy}>
            <Icon name="upload" size={15} /> Choose Images from Device
          </button>

          {/* URL image previews */}
          {(urlPreviews.length > 0 || pendingFiles.length > 0) && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
              {urlPreviews.map((src, idx) => (
                <div key={`url-${idx}`} style={{ position:'relative' }}>
                  <img src={src} alt="" style={{ height:80, width:80, borderRadius:8, objectFit:'cover', display:'block' }} onError={(e) => { e.target.style.display='none'; }} />
                  <button type="button" onClick={() => removeUrlImage(idx)} style={{ position:'absolute', top:-6, right:-6, background:'#e53e3e', color:'#fff', border:'none', borderRadius:'50%', width:20, height:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
                    <Icon name="x" size={11} />
                  </button>
                </div>
              ))}
              {/* FIX: pending local files shown via object URL preview — will be uploaded on Save */}
              {pendingFiles.map((pf, idx) => (
                <div key={`pending-${idx}`} style={{ position:'relative' }}>
                  <img src={pf.preview} alt="" style={{ height:80, width:80, borderRadius:8, objectFit:'cover', display:'block', opacity: isBusy ? 0.5 : 1 }} />
                  {/* "pending upload" indicator */}
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.55)', color:'#fff', fontSize:'0.6rem', textAlign:'center', borderRadius:'0 0 8px 8px', padding:'2px 0' }}>
                    {isBusy ? 'Uploading…' : 'Pending'}
                  </div>
                  {!isBusy && (
                    <button type="button" onClick={() => removePendingFile(idx)} style={{ position:'absolute', top:-6, right:-6, background:'#e53e3e', color:'#fff', border:'none', borderRadius:'50%', width:20, height:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
                      <Icon name="x" size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {pendingFiles.length > 0 && !isBusy && (
            <p style={{ fontSize:'0.75rem', color:'var(--text2)', marginTop:6 }}>
              {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''} will be uploaded when you click Save.
            </p>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal__footer">
          <button className="admin-btn admin-btn--ghost" onClick={onClose} disabled={isBusy}>Cancel</button>
          <button className="admin-btn" onClick={save} disabled={isBusy}>
            {uploadingCount > 0 ? `Uploading ${uploadingCount} image${uploadingCount > 1 ? 's' : ''}…` : loading ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Coupon Modal ─── */
const CouponModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState(EMPTY_COUPON);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.code.trim()) { setError('Coupon code required'); return; }
    if (!form.discountPercent) { setError('Discount % required'); return; }
    setError(null); setLoading(true);
    try {
      await onSave({ code: form.code.toUpperCase().trim(), discountPercent: parseInt(form.discountPercent)||0, minOrderValue: parseFloat(form.minOrderValue)||0, maxDiscount: parseFloat(form.maxDiscount)||0, expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString().replace('Z','') : null, active: true });
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="admin-modal-bg" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__title">Create Coupon</div>
        <div><label className="admin-form__label">Coupon Code *</label><input className="admin-form__input" placeholder="e.g. SAVE20" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} style={{ letterSpacing:'0.08em', fontWeight:600 }} /></div>
        <div className="admin-form__row">
          <div><label className="admin-form__label">Discount % *</label><input className="admin-form__input" type="number" min="1" max="100" placeholder="e.g. 20" value={form.discountPercent} onChange={set('discountPercent')} /></div>
          <div><label className="admin-form__label">Max Discount (₹)</label><input className="admin-form__input" type="number" min="0" placeholder="0 = no cap" value={form.maxDiscount} onChange={set('maxDiscount')} /></div>
        </div>
        <div className="admin-form__row">
          <div><label className="admin-form__label">Min Order Value (₹)</label><input className="admin-form__input" type="number" min="0" placeholder="0 = no min" value={form.minOrderValue} onChange={set('minOrderValue')} /></div>
          <div><label className="admin-form__label">Expiry Date</label><input className="admin-form__input" type="datetime-local" value={form.expiryDate} onChange={set('expiryDate')} /></div>
        </div>
        {form.discountPercent && form.minOrderValue && (
          <div style={{ background:'var(--bg2)', borderRadius:8, padding:'10px 14px', fontSize:'0.82rem', color:'var(--text2)' }}>
            Preview: {form.discountPercent}% off on orders ≥ ₹{form.minOrderValue}{form.maxDiscount ? `, max ₹${form.maxDiscount} off` : ''}
          </div>
        )}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-modal__footer">
          <button className="admin-btn admin-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="admin-btn" onClick={save} disabled={loading}>{loading ? 'Creating…' : 'Create Coupon'}</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Coupons Panel ─── */
const CouponsPanel = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => { setLoading(true); setError(null); try { setCoupons(await adminCouponAPI.getAll()||[]); } catch(err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const isExpired = (d) => d && new Date(d) < new Date();

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Coupons</h1>
        <div style={{ display:'flex', gap:8 }}>
          <button className="admin-btn admin-btn--ghost admin-btn--icon-label" onClick={load}><Icon name="refresh" size={14} /> Refresh</button>
          <button className="admin-btn admin-btn--icon-label" onClick={() => setModal(true)}><Icon name="plus" size={14} /> Create Coupon</button>
        </div>
      </div>
      {loading && <div className="admin-state">Loading coupons…</div>}
      {!loading && error && <div className="admin-state"><p style={{ color:'var(--warm)', marginBottom:'1rem' }}>{error}</p><button className="admin-btn" onClick={load}>Retry</button></div>}
      {!loading && !error && coupons.length === 0 && <div className="admin-state">No coupons yet. Create your first one!</div>}
      {!loading && !error && coupons.length > 0 && (
        <>
          <div className="admin-table-wrap hide-mobile">
            <table className="admin-table">
              <thead><tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Max Off</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {coupons.map((c) => {
                  const expired = isExpired(c.expiryDate);
                  return (
                    <tr key={c.id}>
                      <td><span className="admin-code">{c.code}</span></td>
                      <td style={{ fontWeight:600, color:'#16a34a' }}>{c.discountPercent}% off</td>
                      <td>{c.minOrderValue > 0 ? `₹${c.minOrderValue.toLocaleString()}` : '—'}</td>
                      <td>{c.maxDiscount > 0 ? `₹${c.maxDiscount.toLocaleString()}` : 'No cap'}</td>
                      <td style={{ fontSize:'0.82rem', color: expired ? '#dc2626' : 'var(--text2)' }}>{formatDate(c.expiryDate)}{expired && ' (Expired)'}</td>
                      <td><span className={`admin-badge ${c.active && !expired ? 'admin-badge--green' : 'admin-badge--red'}`}>{c.active && !expired ? 'Active' : expired ? 'Expired' : 'Inactive'}</span></td>
                      <td>
                        <div className="admin-actions">
                          <button className={`admin-btn admin-btn--sm ${c.active ? 'admin-btn--ghost' : ''}`} title={c.active ? 'Deactivate' : 'Activate'} onClick={() => { setToggling(c.id); adminCouponAPI.toggle(c.id).then((u) => setCoupons((p) => p.map((x) => x.id===c.id ? u : x))).catch((e) => alert(e.message)).finally(() => setToggling(null)); }} disabled={toggling===c.id}>
                            {toggling===c.id ? '…' : <Icon name={c.active ? 'toggle_on' : 'toggle_off'} size={16} />}
                          </button>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" title="Delete" onClick={() => { if(!window.confirm('Delete this coupon?')) return; setDeleting(c.id); adminCouponAPI.delete(c.id).then(() => setCoupons((p) => p.filter((x) => x.id!==c.id))).catch((e) => alert(e.message)).finally(() => setDeleting(null)); }} disabled={deleting===c.id}>
                            {deleting===c.id ? '…' : <Icon name="trash" size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="admin-cards show-mobile">
            {coupons.map((c) => {
              const expired = isExpired(c.expiryDate);
              return (
                <div key={c.id} className="admin-card">
                  <div className="admin-card__row">
                    <span className="admin-code">{c.code}</span>
                    <span className={`admin-badge ${c.active && !expired ? 'admin-badge--green' : 'admin-badge--red'}`}>{c.active && !expired ? 'Active' : expired ? 'Expired' : 'Inactive'}</span>
                  </div>
                  <div style={{ fontSize:'0.9rem', fontWeight:600, color:'#16a34a', marginTop:4 }}>{c.discountPercent}% off</div>
                  <div className="admin-card__meta">
                    {c.minOrderValue > 0 && `Min ₹${c.minOrderValue.toLocaleString()} · `}
                    {c.maxDiscount > 0 ? `Max ₹${c.maxDiscount.toLocaleString()} off` : 'No cap'}
                    {c.expiryDate && ` · Expires ${formatDate(c.expiryDate)}`}
                  </div>
                  <div className="admin-card__actions">
                    <button className={`admin-btn admin-btn--icon-label ${c.active ? 'admin-btn--ghost' : ''}`} style={{ flex:1 }} onClick={() => { setToggling(c.id); adminCouponAPI.toggle(c.id).then((u) => setCoupons((p) => p.map((x) => x.id===c.id ? u : x))).catch((e) => alert(e.message)).finally(() => setToggling(null)); }} disabled={toggling===c.id}>
                      <Icon name={c.active ? 'toggle_on' : 'toggle_off'} size={15} />{toggling===c.id ? '…' : c.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="admin-btn admin-btn--danger admin-btn--icon-label" onClick={() => { if(!window.confirm('Delete this coupon?')) return; setDeleting(c.id); adminCouponAPI.delete(c.id).then(() => setCoupons((p) => p.filter((x) => x.id!==c.id))).catch((e) => alert(e.message)).finally(() => setDeleting(null)); }} disabled={deleting===c.id}>
                      <Icon name="trash" size={14} />{deleting===c.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {modal && <CouponModal onSave={async (p) => { const c = await adminCouponAPI.create(p); setCoupons((prev) => [c, ...prev]); }} onClose={() => setModal(false)} />}
    </div>
  );
};

/* ─── Return Requests Panel ─── */
const ReturnRequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [noteMap, setNoteMap] = useState({});
  const [filterStatus, setFilterStatus] = useState('ALL');

  const load = async () => { setLoading(true); setError(null); try { setRequests(await adminReturnAPI.getAll()||[]); } catch(err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try { const u = await adminReturnAPI.updateStatus(id, status, noteMap[id]||''); setRequests((prev) => prev.map((r) => r.id===id ? u : r)); }
    catch (err) { alert(err.message); }
    finally { setUpdating(null); }
  };

  const filtered = filterStatus === 'ALL' ? requests : requests.filter((r) => r.status === filterStatus);

  const ReturnCard = ({ r }) => {
    const sc = RETURN_STATUS_COLORS[r.status] || RETURN_STATUS_COLORS.PENDING;
    const isPending = r.status === 'PENDING';
    return (
      <div className="admin-card">
        <div className="admin-card__row">
          <span className={`admin-badge ${r.type==='RETURN' ? 'admin-badge--red' : 'admin-badge--purple'}`}>{r.type==='RETURN' ? 'Return' : 'Exchange'}</span>
          <span className="admin-badge" style={{ background:sc.bg, color:sc.color }}>{r.status}</span>
          <span style={{ fontSize:'0.78rem', color:'var(--text3)', marginLeft:'auto' }}>{formatDate(r.createdAt)}</span>
        </div>
        <div className="admin-card__name">{r.productName} <span style={{ fontWeight:400, color:'var(--text2)' }}>×{r.quantity}</span></div>
        <div className="admin-card__meta"><Icon name="mail" size={12} /> {r.userEmail}</div>
        <div className="admin-card__meta">{r.reason}</div>
        {isPending && (
          <>
            <input className="admin-note-input" placeholder="Optional note…" value={noteMap[r.id]||''} onChange={(e) => setNoteMap((p) => ({ ...p, [r.id]: e.target.value }))} />
            <div className="admin-card__actions">
              <button className="admin-btn admin-btn--approve admin-btn--icon-label" style={{ flex:1 }} onClick={() => handleStatus(r.id,'APPROVED')} disabled={updating===r.id}><Icon name="check" size={14} />{updating===r.id ? '…' : 'Approve'}</button>
              <button className="admin-btn admin-btn--danger admin-btn--icon-label" style={{ flex:1 }} onClick={() => handleStatus(r.id,'REJECTED')} disabled={updating===r.id}><Icon name="x" size={14} />{updating===r.id ? '…' : 'Reject'}</button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Returns &amp; Exchanges</h1>
        <button className="admin-btn admin-btn--ghost admin-btn--icon-label" onClick={load}><Icon name="refresh" size={14} /> Refresh</button>
      </div>
      <div className="admin-filter-bar">
        {['ALL','PENDING','APPROVED','REJECTED'].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`admin-filter-btn ${filterStatus===s ? 'active' : ''}`}>
            {s}{s!=='ALL' && <span className="admin-filter-count">{requests.filter((r) => r.status===s).length}</span>}
          </button>
        ))}
      </div>
      {loading && <div className="admin-state">Loading requests…</div>}
      {!loading && error && <div className="admin-state"><p style={{ color:'var(--warm)', marginBottom:'1rem' }}>{error}</p><button className="admin-btn" onClick={load}>Retry</button></div>}
      {!loading && !error && filtered.length === 0 && <div className="admin-state">No {filterStatus!=='ALL' ? filterStatus.toLowerCase() : ''} requests found.</div>}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="admin-table-wrap hide-mobile">
            <table className="admin-table">
              <thead><tr><th>Date</th><th>User</th><th>Product</th><th>Type</th><th>Reason</th><th>Status</th><th>Admin Note</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((r) => {
                  const sc = RETURN_STATUS_COLORS[r.status] || RETURN_STATUS_COLORS.PENDING;
                  const isPending = r.status === 'PENDING';
                  return (
                    <tr key={r.id}>
                      <td style={{ whiteSpace:'nowrap', fontSize:'0.8rem' }}>{formatDate(r.createdAt)}</td>
                      <td style={{ fontSize:'0.82rem' }}>{r.userEmail}</td>
                      <td style={{ fontWeight:500, fontSize:'0.85rem' }}>{r.productName}<div style={{ fontSize:'0.75rem', color:'var(--text2)' }}>Qty: {r.quantity}</div></td>
                      <td><span className={`admin-badge ${r.type==='RETURN' ? 'admin-badge--red' : 'admin-badge--purple'}`}>{r.type==='RETURN' ? 'Return' : 'Exchange'}</span></td>
                      <td style={{ fontSize:'0.82rem', maxWidth:160 }}>{r.reason}</td>
                      <td><span className="admin-badge" style={{ background:sc.bg, color:sc.color }}>{r.status}</span></td>
                      <td>{isPending ? <input className="admin-note-input" placeholder="Optional note…" value={noteMap[r.id]||''} onChange={(e) => setNoteMap((p) => ({ ...p, [r.id]: e.target.value }))} /> : <span style={{ fontSize:'0.8rem', color:'var(--text2)' }}>{r.adminNote||'—'}</span>}</td>
                      <td>{isPending ? <div className="admin-actions"><button className="admin-btn admin-btn--sm admin-btn--approve" onClick={() => handleStatus(r.id,'APPROVED')} disabled={updating===r.id}>{updating===r.id ? '…' : <Icon name="check" size={14} />}</button><button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleStatus(r.id,'REJECTED')} disabled={updating===r.id}>{updating===r.id ? '…' : <Icon name="x" size={14} />}</button></div> : <span style={{ fontSize:'0.8rem', color:'var(--text3)' }}>Done</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="admin-cards show-mobile">{filtered.map((r) => <ReturnCard key={r.id} r={r} />)}</div>
        </>
      )}
    </div>
  );
};

/* ─── Users Panel ─── */
const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => { setLoading(true); setError(null); try { setUsers(await adminUserAPI.getAll()||[]); } catch(err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q);
  });

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Registered Users</h1>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <div className="admin-search-wrap">
            <Icon name="search" size={14} className="admin-search-icon" />
            <input className="admin-search-input" placeholder="Name, email or phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="admin-btn admin-btn--ghost admin-btn--icon-label" onClick={load}><Icon name="refresh" size={14} /> Refresh</button>
        </div>
      </div>
      {!loading && !error && (
        <div className="admin-stat-strip">
          <div className="admin-stat"><div className="admin-stat__label">Total Users</div><div className="admin-stat__value">{users.length}</div></div>
          <div className="admin-stat"><div className="admin-stat__label">Showing</div><div className="admin-stat__value admin-stat__value--accent">{filtered.length}</div></div>
        </div>
      )}
      {loading && <div className="admin-state">Loading users…</div>}
      {!loading && error && <div className="admin-state"><p style={{ color:'var(--warm)', marginBottom:'1rem' }}>{error}</p><button className="admin-btn" onClick={load}>Retry</button></div>}
      {!loading && !error && filtered.length === 0 && <div className="admin-state">{search ? 'No users match your search.' : 'No registered users yet.'}</div>}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="admin-table-wrap hide-mobile">
            <table className="admin-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Addresses</th><th>Joined</th></tr></thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color:'var(--text3)', fontSize:'0.78rem' }}>{i+1}</td>
                    <td><div className="admin-user-cell"><div className="admin-avatar">{(u.name||'?')[0].toUpperCase()}</div><span style={{ fontWeight:600 }}>{u.name||'—'}</span></div></td>
                    <td style={{ fontSize:'0.85rem' }}>{u.email}</td>
                    <td style={{ fontSize:'0.85rem' }}>{u.phone||'—'}</td>
                    <td><span className={`admin-badge ${u.role==='ADMIN' ? 'admin-badge--amber' : 'admin-badge--purple'}`}>{u.role||'USER'}</span></td>
                    <td style={{ fontSize:'0.82rem', color:'var(--text2)' }}>{u.addresses?.length > 0 ? `${u.addresses.length} saved` : '—'}</td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text2)', whiteSpace:'nowrap' }}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-cards show-mobile">
            {filtered.map((u) => (
              <div key={u.id} className="admin-card">
                <div className="admin-card__row">
                  <div className="admin-avatar admin-avatar--lg">{(u.name||'?')[0].toUpperCase()}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="admin-card__name">{u.name||'—'}</div>
                    <div className="admin-card__meta"><Icon name="mail" size={12} /> {u.email}</div>
                  </div>
                  <span className={`admin-badge ${u.role==='ADMIN' ? 'admin-badge--amber' : 'admin-badge--purple'}`}>{u.role||'USER'}</span>
                </div>
                <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:4 }}>
                  {u.phone && <div className="admin-card__meta"><Icon name="phone" size={12} /> {u.phone}</div>}
                  {u.addresses?.length > 0 && <div className="admin-card__meta"><Icon name="mappin" size={12} /> {u.addresses.length} address{u.addresses.length>1?'es':''}</div>}
                  <div className="admin-card__meta"><Icon name="calendar" size={12} /> {formatDate(u.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Admin Dashboard ─── */
const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => { setLoading(true); setError(null); try { setProducts(await adminProductAPI.getAll()||[]); } catch(err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleSave = async (payload) => {
    if (modal === 'add') {
      const c = await adminProductAPI.create(payload);
      setProducts((p) => [c, ...p]);
    } else {
      const u = await adminProductAPI.update(modal.id, payload);
      // FIX: images already merged upstream (uploadedUrls + urlImages) — trust payload.images
      const merged = { ...u, images: (u.images && u.images.length) ? u.images : payload.images };
      setProducts((p) => p.map((x) => x.id === merged.id ? merged : x));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try { await adminProductAPI.delete(id); setProducts((p) => p.filter((x) => x.id!==id)); }
    catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  const editForm = (p) => ({ name:p.name||'', description:p.description||'', brand:p.brand||'', category:p.category||'', subCategory:p.subCategory||'', price:p.price||'', discountedPrice:p.discountedPrice||'', discountPercent:p.discountPercent||'', quantity:p.quantity||'', images:(p.images||[]).join(', ') });

  const TABS = [
    { key:'products', label:'Products', icon:'products' },
    { key:'coupons',  label:'Coupons',  icon:'coupons'  },
    { key:'returns',  label:'Returns',  icon:'returns'  },
    { key:'users',    label:'Users',    icon:'users'    },
  ];

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <div className="admin-topbar__logo">ShopMate <span>ADMIN</span></div>
        <div className="admin-topbar__right">
          <div className="admin-topbar__user"><Icon name="user" size={15} /><span className="admin-topbar__username">{admin.name}</span></div>
          <button className="admin-topbar__logout" onClick={onLogout} title="Sign Out"><Icon name="logout" size={15} /><span className="admin-topbar__logout-label">Sign Out</span></button>
        </div>
      </div>

      {/* Tab nav — desktop/tablet */}
      <div className="admin-tabnav">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`admin-tab ${activeTab===t.key ? 'active' : ''}`}>
            <Icon name={t.icon} size={15} /><span className="admin-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      <nav className="admin-bottomnav">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`admin-bottomnav__item ${activeTab===t.key ? 'active' : ''}`}>
            <Icon name={t.icon} size={22} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {activeTab === 'products' && (
        <div className="admin-dashboard">
          <div className="admin-dashboard__header">
            <h1 className="admin-dashboard__title">Products</h1>
            <button className="admin-btn admin-btn--icon-label" onClick={() => setModal('add')}><Icon name="plus" size={14} /> Add Product</button>
          </div>
          {loading && <div className="admin-state">Loading products…</div>}
          {!loading && error && <div className="admin-state"><p style={{ color:'var(--warm)', marginBottom:'1rem' }}>{error}</p><button className="admin-btn" onClick={load}>Retry</button></div>}
          {!loading && !error && products.length === 0 && <div className="admin-state">No products yet. Add your first one!</div>}
          {!loading && !error && products.length > 0 && (
            <>
              <div className="admin-table-wrap hide-mobile">
                <table className="admin-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Disc. Price</th><th>Qty</th><th>Stock</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.images?.[0] ? <img className="admin-table__img" src={p.images[0]} alt={p.name} onError={(e) => { e.target.style.display='none'; }} /> : <div className="admin-table__img-placeholder"><Icon name="image" size={20} /></div>}</td>
                        <td style={{ fontWeight:500 }}>{p.name}<div style={{ fontSize:'0.75rem', color:'var(--text2)', marginTop:2, display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>{p.category && <span>{p.category}</span>}{p.brand && <span>· {p.brand}</span>}<span>· ₹{(p.discountedPrice>0?p.discountedPrice:p.price)?.toLocaleString()}</span>{p.quantity!=null && <span>· Qty {p.quantity}</span>}</div></td>
                        <td>{p.category}</td><td>{p.brand}</td>
                        <td>₹{p.price?.toLocaleString()}</td>
                        <td>{p.discountedPrice>0 ? `₹${p.discountedPrice?.toLocaleString()}` : '—'}</td>
                        <td>{p.quantity}</td>
                        <td><span className={`admin-stock ${p.inStock ? 'admin-stock--yes' : 'admin-stock--no'}`}>{p.inStock ? 'In Stock' : 'Out'}</span></td>
                        <td><div className="admin-actions"><button className="admin-btn admin-btn--sm admin-btn--ghost" title="Edit" onClick={() => setModal({ ...editForm(p), id:p.id })}><Icon name="edit" size={14} /></button><button className="admin-btn admin-btn--sm admin-btn--danger" title="Delete" onClick={() => handleDelete(p.id)} disabled={deleting===p.id}>{deleting===p.id ? '…' : <Icon name="trash" size={14} />}</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="admin-cards show-mobile">
                {products.map((p) => (
                  <div key={p.id} className="admin-card">
                    <div className="admin-card__row">
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="admin-card__img" onError={(e) => { e.target.style.display='none'; }} /> : <div className="admin-card__img-placeholder"><Icon name="image" size={18} /></div>}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="admin-card__name">{p.name}</div>
                        <div className="admin-card__meta">{p.brand && `${p.brand} · `}{p.category}</div>
                        <div style={{ display:'flex', gap:8, marginTop:4, alignItems:'center', flexWrap:'wrap' }}>
                          <span style={{ fontWeight:700, color:'var(--warm)', fontSize:'0.9rem' }}>₹{(p.discountedPrice>0?p.discountedPrice:p.price)?.toLocaleString()}</span>
                          {p.discountedPrice>0 && <span style={{ textDecoration:'line-through', color:'var(--text3)', fontSize:'0.8rem' }}>₹{p.price?.toLocaleString()}</span>}
                          <span className={`admin-stock ${p.inStock ? 'admin-stock--yes' : 'admin-stock--no'}`}>{p.inStock ? 'In Stock' : 'Out'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="admin-card__actions">
                      <button className="admin-btn admin-btn--ghost admin-btn--icon-label" style={{ flex:1 }} onClick={() => setModal({ ...editForm(p), id:p.id })}><Icon name="edit" size={14} /> Edit</button>
                      <button className="admin-btn admin-btn--danger admin-btn--icon-label" style={{ flex:1 }} onClick={() => handleDelete(p.id)} disabled={deleting===p.id}><Icon name="trash" size={14} />{deleting===p.id ? '…' : 'Delete'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'coupons'  && <CouponsPanel />}
      {activeTab === 'returns'  && <ReturnRequestsPanel />}
      {activeTab === 'users'    && <UsersPanel />}

      {modal && <ProductModal initial={modal==='add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

export default AdminDashboard;




