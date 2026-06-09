import { useState } from 'react';
import './ContactPage.css';

/* ─── SVG Icons ─── */
const Ico = ({ d, size = 20, fill = false, vb = "0 0 24 24" }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  chat:    <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
  phone:   <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.71 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.35 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/>,
  mail:    <Ico d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]} />,
  pin:     <Ico d={["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z","M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"]} />,
  clock:   <Ico d={["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z","M12 6v6l4 2"]} />,
  back:    <Ico d={["M19 12H5","M12 19l-7-7 7-7"]} />,
  arrow:   <Ico d={["M5 12h14","M12 5l7 7-7 7"]} size={16}/>,
  check:   <Ico d="M20 6L9 17l-5-5" />,
  chevD:   <Ico d="M6 9l6 6 6-6" size={16}/>,
  chevU:   <Ico d="M18 15l-6-6-6 6" size={16}/>,
  order:   <Ico d={["M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2","M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2","M9 12h6","M9 16h4"]} />,
  return:  <Ico d={["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8","M3 3v5h5"]} />,
  payment: <Ico d={["M2 8h20","M2 12h20M2 16h20","M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"]} />,
  account: <Ico d={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]} />,
  shield:  <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  star:    <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
};

const FAQS = [
  { cat: 'Orders', icon: icons.order, q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an SMS and email with a tracking link. You can also go to My Orders in your account and click Track for real-time updates.' },
  { cat: 'Returns', icon: icons.return, q: 'What is the return policy?', a: 'Most items can be returned within 7 days of delivery. Visit My Orders, select the item, tap Return, and our pickup agent will collect within 2 business days. Refund is processed in 5–7 days.' },
  { cat: 'Payments', icon: icons.payment, q: 'Why was my payment declined?', a: 'Payments can fail due to incorrect card details, insufficient balance, or bank security checks. Try a different payment method or contact your bank. UPI and wallets are always reliable alternatives.' },
  { cat: 'Account', icon: icons.account, q: 'How do I reset my password?', a: 'On the login screen, tap "Forgot password?" and enter your registered mobile/email. You\'ll receive an OTP to set a new password within 2 minutes.' },
  { cat: 'Delivery', icon: icons.clock, q: 'Is express delivery available?', a: 'Express delivery (1–2 days) is available for select pincodes. You\'ll see delivery options and estimated dates on the product page and at checkout.' },
];

const ContactPage = ({ onBack }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1600));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="cp-root">

      {/* ── Top bar ── */}
      <div className="cp-topbar">
        <div className="cp-topbar__inner">
          <button className="cp-back" onClick={onBack}>
            {icons.back}
            <span>Back to Shopping</span>
          </button>
          <div className="cp-breadcrumb">Home &rsaquo; <span>Help Center</span></div>
        </div>
      </div>

      <div className="cp-layout">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="cp-sidebar">

          {/* Helpline card */}
          <div className="cp-card cp-helpline">
            <div className="cp-helpline__header">
              <div className="cp-helpline__icon">{icons.phone}</div>
              <div>
                <div className="cp-helpline__title">Customer Care</div>
                <div className="cp-helpline__number">9175424672</div>
              </div>
            </div>
            <div className="cp-helpline__badge">Toll free · 24/7</div>
            <div className="cp-helpline__hours">
              {icons.clock}
              <span>Available Mon–Sat, 9am–9pm IST</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="cp-card cp-quicklinks">
            <div className="cp-quicklinks__title">Quick Help</div>
            {[
              { icon: icons.order,   label: 'Track my order' },
              { icon: icons.return,  label: 'Return or exchange' },
              { icon: icons.payment, label: 'Payment issues' },
              { icon: icons.account, label: 'Account & login' },
              { icon: icons.shield,  label: 'Report a problem' },
            ].map(({ icon, label }) => (
              <button key={label} className="cp-quicklink">
                <span className="cp-quicklink__icon">{icon}</span>
                <span>{label}</span>
                <span className="cp-quicklink__arrow">{icons.arrow}</span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="cp-card cp-stats">
            {[
              { val: '4 hrs', label: 'Avg response time' },
              { val: '97%', label: 'Satisfaction rate' },
              { val: '2.8L+', label: 'Issues resolved' },
            ].map(({ val, label }) => (
              <div key={label} className="cp-stat">
                <div className="cp-stat__val">{val}</div>
                <div className="cp-stat__label">{label}</div>
              </div>
            ))}
          </div>

        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="cp-main">

          {/* Page header */}
          <div className="cp-main__header">
            <h1 className="cp-main__title">Help Center</h1>
            <p className="cp-main__sub">How can we help you today?</p>
          </div>

          {/* Contact channels row */}
          <div className="cp-channels">
            {[
              { icon: icons.chat,  label: 'Live Chat',  sub: 'Reply in ~2 min',   color: 'blue',   active: true },
              { icon: icons.phone, label: 'Call Us',    sub: '1800-123-4567',     color: 'green',  active: false },
              { icon: icons.mail,  label: 'Email',      sub: 'Within 24 hours',   color: 'orange', active: false },
              { icon: icons.pin,   label: 'Store Visit',sub: 'MG Road, Bengaluru',color: 'purple', active: false },
            ].map(({ icon, label, sub, color, active }) => (
              <button key={label} className={`cp-channel cp-channel--${color}`}>
                <div className={`cp-channel__icon-ring cp-channel__icon-ring--${color}`}>{icon}</div>
                <div className="cp-channel__label">{label}</div>
                <div className="cp-channel__sub">{sub}</div>
                {active && <div className="cp-channel__live"><span className="cp-live-dot"/>Online now</div>}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="cp-tabs">
            <button className={`cp-tab ${activeTab === 'form' ? 'cp-tab--active' : ''}`} onClick={() => setActiveTab('form')}>Send a Message</button>
            <button className={`cp-tab ${activeTab === 'faq' ? 'cp-tab--active' : ''}`} onClick={() => setActiveTab('faq')}>FAQs</button>
          </div>

          {/* ─ FORM TAB ─ */}
          {activeTab === 'form' && (
            <div className="cp-card cp-form-card">
              {sent ? (
                <div className="cp-success">
                  <div className="cp-success__icon">{icons.check}</div>
                  <h3>Your message has been sent!</h3>
                  <p>Hi <strong>{form.name}</strong>, we've received your request and will reply to <strong>{form.email}</strong> within 24 hours. Your ticket ID is <strong>#SM{Math.floor(Math.random()*900000+100000)}</strong>.</p>
                  <div className="cp-success__actions">
                    <button className="cp-btn cp-btn--primary" onClick={() => { setSent(false); setForm({ name:'',email:'',phone:'',subject:'',message:'' }); }}>Send another</button>
                    <button className="cp-btn cp-btn--ghost" onClick={onBack}>Back to Home</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="cp-form-card__head">
                    <h2>Contact Support</h2>
                    <p>Fill in your details and we'll get back to you as soon as possible.</p>
                  </div>
                  <form className="cp-form" onSubmit={handleSubmit}>
                    <div className="cp-form__row">
                      <div className="cp-form__field">
                        <label>Full Name <span>*</span></label>
                        <input type="text" name="name" placeholder="e.g. Arjun Mehta" value={form.name} onChange={handleChange} required />
                      </div>
                      <div className="cp-form__field">
                        <label>Email Address <span>*</span></label>
                        <input type="email" name="email" placeholder="arjun@example.com" value={form.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="cp-form__row">
                      <div className="cp-form__field">
                        <label>Mobile Number</label>
                        <input type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                      </div>
                      <div className="cp-form__field">
                        <label>Issue Type</label>
                        <div className="cp-select-wrap">
                          <select name="subject" value={form.subject} onChange={handleChange}>
                            <option value="">Select a category</option>
                            <option>Order &amp; Delivery</option>
                            <option>Return &amp; Refund</option>
                            <option>Payment Issue</option>
                            <option>Product Query</option>
                            <option>Account Help</option>
                            <option>Other</option>
                          </select>
                          <span className="cp-select-caret">{icons.chevD}</span>
                        </div>
                      </div>
                    </div>
                    <div className="cp-form__field">
                      <label>Describe your issue <span>*</span></label>
                      <textarea name="message" rows={5} placeholder="Please describe your issue in detail. Include order number if applicable…" value={form.message} onChange={handleChange} required />
                      <div className="cp-form__hint">Tip: Include your order ID for faster resolution</div>
                    </div>
                    <div className="cp-form__footer">
                      <button type="submit" className={`cp-btn cp-btn--primary cp-btn--lg ${sending ? 'cp-btn--loading' : ''}`} disabled={sending}>
                        {sending ? <span className="cp-spinner" /> : <>Submit Request {icons.arrow}</>}
                      </button>
                      <div className="cp-form__assurance">
                        {icons.shield}
                        <span>Your data is secure and will never be shared</span>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}

          {/* ─ FAQ TAB ─ */}
          {activeTab === 'faq' && (
            <div className="cp-faq-list">
              {FAQS.map((faq, i) => (
                <div key={i} className={`cp-card cp-faq-item ${active === i ? 'cp-faq-item--open' : ''}`}
                  onClick={() => setActive(active === i ? null : i)}>
                  <div className="cp-faq-item__q">
                    <div className="cp-faq-item__left">
                      <span className="cp-faq-item__cat-icon">{faq.icon}</span>
                      <div>
                        <div className="cp-faq-item__cat">{faq.cat}</div>
                        <div className="cp-faq-item__question">{faq.q}</div>
                      </div>
                    </div>
                    <span className={`cp-faq-item__chevron ${active === i ? 'cp-faq-item__chevron--up' : ''}`}>
                      {active === i ? icons.chevU : icons.chevD}
                    </span>
                  </div>
                  {active === i && <div className="cp-faq-item__a">{faq.a}</div>}
                </div>
              ))}

              {/* still need help */}
              <div className="cp-card cp-still-help">
                <div className="cp-still-help__icon">{icons.star}</div>
                <div>
                  <div className="cp-still-help__title">Didn't find your answer?</div>
                  <div className="cp-still-help__sub">Our support team is ready to help you.</div>
                </div>
                <button className="cp-btn cp-btn--primary" onClick={() => setActiveTab('form')}>
                  Contact Us {icons.arrow}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ContactPage;




