import './AboutPage.css';

/* ── SVG Icons ── */
const Ico = ({ d, size = 20, vb = "0 0 24 24" }) => (
  <svg width={size} height={size} viewBox={vb} fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  back:     ["M19 12H5","M12 19l-7-7 7-7"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  truck:    ["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z","M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"],
  star:     ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  users:    ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"],
  package:  ["M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z","M3.27 6.96L12 12.01l8.73-5.05","M12 22.08V12"],
  check:    ["M20 6L9 17l-5-5"],
  map:      ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z","M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  linkedin: ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z","M2 9h4v12H2z","M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  arrow:    ["M5 12h14","M12 5l7 7-7 7"],
};

const STATS = [
  { val: '3.2M+', label: 'Happy Customers' },
  { val: '1,80,000+', label: 'Products Listed' },
  { val: '28,000+', label: 'Trusted Sellers' },
  { val: '99.1%', label: 'On-time Delivery' },
];

const VALUES = [
  { icon: I.shield,  title: 'Trust First',       desc: 'Every seller is verified. Every product quality-checked. We stand behind what we sell.' },
  { icon: I.truck,   title: 'Speed Matters',      desc: 'From warehouse to doorstep in 24–48 hours across 500+ cities in India.' },
  { icon: I.heart,   title: 'Customer First',     desc: 'No questions asked returns, 24/7 support, and a promise to always make it right.' },
  { icon: I.package, title: 'Seller Success',     desc: 'We help small businesses and independent sellers reach millions of customers nationwide.' },
];

const TEAM = [
  { name: 'Priya Sharma',   role: 'Chief Executive Officer',       init: 'PS' },
  { name: 'Rahul Gupta',    role: 'Chief Technology Officer',      init: 'RG' },
  { name: 'Ananya Mehta',   role: 'Head of Customer Experience',   init: 'AM' },
  { name: 'Vikram Singh',   role: 'VP — Seller Relations',         init: 'VS' },
  { name: 'Deepika Nair',   role: 'Head of Logistics',             init: 'DN' },
  { name: 'Arjun Reddy',    role: 'Chief Marketing Officer',       init: 'AR' },
];

const MILESTONES = [
  { year: '2022', title: 'Founded',              desc: 'ShopMate launched from a garage in Bengaluru with 12 sellers and a big dream.' },
  { year: '2023', title: 'Series A — ₹80 Cr',    desc: 'Raised Series A funding. Expanded to 50 cities and crossed 1 lakh orders.' },
  { year: '2024', title: 'Category Expansion',   desc: 'Added Electronics, Fashion, and Home categories. Hit 10 lakh registered users.' },
  { year: '2025', title: '3M Customers',          desc: 'Crossed 3 million customers, launched express delivery, and ShopMate Pro.' },
  { year: '2026', title: 'Pan-India Coverage',   desc: 'Now serving 500+ cities with same-day delivery in 12 metros.' },
];

const AboutPage = ({ onBack }) => (
  <div className="ab-root">

    {/* ── Top bar ── */}
    <div className="ab-topbar">
      <div className="ab-topbar__inner">
        <button className="ab-back" onClick={onBack}>
          <Ico d={I.back} size={16} /> Back to Shopping
        </button>
        <div className="ab-breadcrumb">Home &rsaquo; <span>About Us</span></div>
      </div>
    </div>

    {/* ── Hero Banner ── */}
    <div className="ab-hero">
      <div className="ab-hero__inner">
        <div className="ab-hero__tag">Our Story</div>
        <h1 className="ab-hero__title">India's most loved<br />shopping companion</h1>
        <p className="ab-hero__sub">
          Founded in 2022 in Bengaluru, ShopMate is built on a simple belief — every Indian deserves access to quality products at honest prices, delivered fast and backed by real support.
        </p>
        <div className="ab-hero__cta-row">
          <button className="ab-btn ab-btn--primary" onClick={onBack}>
            Start Shopping <Ico d={I.arrow} size={16} />
          </button>
          <a href="#ab-mission" className="ab-btn ab-btn--ghost">Our Mission</a>
        </div>
      </div>
      <div className="ab-hero__graphic">
        <div className="ab-hero__ring ab-hero__ring--1" />
        <div className="ab-hero__ring ab-hero__ring--2" />
        <div className="ab-hero__ring ab-hero__ring--3" />
        <div className="ab-hero__shield"><Ico d={I.shield} size={40} /></div>
      </div>
    </div>

    {/* ── Stats bar ── */}
    <div className="ab-stats-bar">
      {STATS.map(({ val, label }) => (
        <div key={label} className="ab-stat">
          <div className="ab-stat__val">{val}</div>
          <div className="ab-stat__label">{label}</div>
        </div>
      ))}
    </div>

    <div className="ab-body">

      {/* ── Mission ── */}
      <section className="ab-section" id="ab-mission">
        <div className="ab-section__label">Mission</div>
        <div className="ab-mission">
          <div className="ab-mission__text">
            <h2>Why we exist</h2>
            <p>
              India is a nation of 1.4 billion people and millions of small businesses. Yet for decades, quality shopping was limited to big cities and big budgets. ShopMate was built to change that.
            </p>
            <p>
              We connect local sellers with customers across every corner of India — from metro apartments to small-town homes — making world-class products accessible, affordable, and delivered fast.
            </p>
            <ul className="ab-mission__list">
              {[
                'Zero compromise on product quality',
                'Transparent pricing — no hidden charges',
                'Support for 28,000+ small businesses',
                'Carbon-neutral deliveries by 2027',
              ].map(pt => (
                <li key={pt}><span className="ab-check"><Ico d={I.check} size={14}/></span>{pt}</li>
              ))}
            </ul>
          </div>
          <div className="ab-mission__card">
            <div className="ab-mission__card-head">Our Promise</div>
            <div className="ab-mission__card-body">
              <p>"We exist to make quality shopping a right for every Indian — not a privilege for a few."</p>
              <div className="ab-mission__sig">— Priya Sharma, CEO &amp; Co-founder</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="ab-section">
        <div className="ab-section__label">Values</div>
        <h2 className="ab-section__title">What we stand for</h2>
        <div className="ab-values">
          {VALUES.map(({ icon, title, desc }) => (
            <div key={title} className="ab-value-card">
              <div className="ab-value-card__icon"><Ico d={icon} size={22} /></div>
              <div className="ab-value-card__title">{title}</div>
              <div className="ab-value-card__desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="ab-section">
        <div className="ab-section__label">Journey</div>
        <h2 className="ab-section__title">How we got here</h2>
        <div className="ab-timeline">
          {MILESTONES.map(({ year, title, desc }, i) => (
            <div key={year} className={`ab-milestone ${i % 2 === 0 ? 'ab-milestone--left' : 'ab-milestone--right'}`}>
              <div className="ab-milestone__year">{year}</div>
              <div className="ab-milestone__dot" />
              <div className="ab-milestone__card">
                <div className="ab-milestone__title">{title}</div>
                <div className="ab-milestone__desc">{desc}</div>
              </div>
            </div>
          ))}
          <div className="ab-timeline__line" />
        </div>
      </section>

      {/* ── Team ── */}
      <section className="ab-section">
        <div className="ab-section__label">Leadership</div>
        <h2 className="ab-section__title">Meet the team</h2>
        <div className="ab-team">
          {TEAM.map(({ name, role, init }) => (
            <div key={name} className="ab-team-card">
              <div className="ab-team-card__avatar">{init}</div>
              <div className="ab-team-card__name">{name}</div>
              <div className="ab-team-card__role">{role}</div>
              <button className="ab-team-card__link">
                <Ico d={I.linkedin} size={15} /> LinkedIn
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="ab-section">
        <div className="ab-section__label">Presence</div>
        <h2 className="ab-section__title">Where we operate</h2>
        <div className="ab-locations">
          {[
            { city: 'Bengaluru', tag: 'Headquarters', detail: '42, MG Road, Bengaluru 560001' },
            { city: 'Mumbai',    tag: 'West Hub',     detail: 'BKC, Bandra East, Mumbai 400051' },
            { city: 'Delhi NCR', tag: 'North Hub',    detail: 'Cyber City, Gurugram 122002' },
            { city: 'Hyderabad', tag: 'Tech Centre',  detail: 'HITEC City, Hyderabad 500081' },
          ].map(({ city, tag, detail }) => (
            <div key={city} className="ab-location-card">
              <div className="ab-location-card__icon"><Ico d={I.map} size={20} /></div>
              <div className="ab-location-card__city">{city}</div>
              <div className="ab-location-card__tag">{tag}</div>
              <div className="ab-location-card__detail">{detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ab-cta-band">
        <div className="ab-cta-band__inner">
          <div className="ab-cta-band__text">
            <h2>Ready to shop smarter?</h2>
            <p>Join 3.2 million happy customers across India.</p>
          </div>
          <div className="ab-cta-band__actions">
            <button className="ab-btn ab-btn--white" onClick={onBack}>
              Browse Products <Ico d={I.arrow} size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
);

export default AboutPage;




