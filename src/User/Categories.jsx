import './Categories.css';

const SmartphoneIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="2" width="18" height="32" rx="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="15" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="18" cy="29" r="1.5" fill="currentColor"/>
  </svg>
);

const LaptopIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="7" width="26" height="17" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <line x1="11" y1="25" x2="3" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="25" y1="25" x2="33" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="3" y1="30" x2="33" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 20V18C7 11.925 11.925 7 18 7C24.075 7 29 11.925 29 18V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <rect x="4" y="19" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="26" y="19" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const TVIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="30" height="20" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <line x1="13" y1="28" x2="23" y2="28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="18" y1="26" x2="18" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const CATEGORIES = [
  { Icon: SmartphoneIcon, name: 'Smartphones',       count: '3,200 products', variant: '',                tab: 'Electronics', keywords: ['mobile', 'smartphone', 'phone'] },
  { Icon: LaptopIcon,     name: 'Laptops & PCs',     count: '1,800 products', variant: 'cat-block--warm', tab: 'Electronics', keywords: ['laptop', 'pc', 'computer', 'notebook'] },
  { Icon: HeadphonesIcon, name: 'Audio & Wearables', count: '4,100 products', variant: 'cat-block--warm', tab: 'Electronics', keywords: ['headphones', 'audio', 'earphones', 'wearable', 'earbuds', 'speaker'] },
  { Icon: TVIcon,         name: 'TV & Displays',     count: '980 products',   variant: '',                tab: 'Electronics', keywords: ['tv', 'television', 'display', 'monitor'] },
];

const Categories = ({ onCategoryClick }) => (
  <section className="categories">
    <div className="categories__left">
      <p className="categories__overline">Browse</p>
      <h2 className="categories__title">
        Shop by<br />
        <em>Category</em>
      </h2>
      <p className="categories__body">
        Every device, every brand — curated for the tech-forward shopper.
        From pocket to desk to living room.
      </p>
      <button className="btn--warm" style={{ width: 'fit-content' }} onClick={() => onCategoryClick?.('Electronics')}>
        View All →
      </button>
    </div>

    <div className="categories__grid">
      {CATEGORIES.map(({ Icon, name, count, variant, tab, keywords }) => (
        <div
          key={name}
          className={`cat-block ${variant}`}
          onClick={() => onCategoryClick?.(tab, keywords, name)}
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCategoryClick?.(tab, keywords, name); }}
          aria-label={`Browse ${name}`}
        >
          <span className="cat-block__icon"><Icon /></span>
          <div>
            <div className="cat-block__name">{name}</div>
            <div className="cat-block__count">{count}</div>
          </div>
          <span className="cat-block__arrow">↗</span>
        </div>
      ))}
    </div>
  </section>
);

export default Categories;




