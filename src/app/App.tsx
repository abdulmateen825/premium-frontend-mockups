import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useScroll, useTransform, type Variants } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, AudioLines, BatteryFull, Check, ChevronDown, CircleDot, Instagram, Menu, Minus, Plus, Search, ShoppingBag, UserRound, Waves, X, Youtube } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/cart/CartDrawer';
import ProductViewer, { type ProductFinish } from '../components/product/ProductViewer';

function RevealSection({ children, className, id }: { children: ReactNode; className: string; id?: string }) {
  return <motion.section className={className} id={id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.13 }} transition={{ duration: 0.62, ease: [0.2, 0.75, 0.25, 1] }}>{children}</motion.section>;
}
function Navbar() {
  const { count, setDrawerOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
    <Link to="/" className="brand" aria-label="Obsidian Audio home"><span className="brand-mark"><AudioLines size={20}/></span><span>OBSIDIAN <i>AUDIO</i></span></Link>
    <nav className={menu ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation"><a href="/#product" onClick={() => setMenu(false)}>Shop</a><a href="/#technology" onClick={() => setMenu(false)}>Technology</a><a href="/#story" onClick={() => setMenu(false)}>Our story</a></nav>
    <div className="nav-actions"><button type="button" className="icon-button" aria-label="Search" onClick={() => document.getElementById('search-notice')?.classList.toggle('visible')}><Search size={18}/></button><button type="button" className="icon-button account" aria-label="Account"><UserRound size={18}/></button><button type="button" className="bag-link" aria-label={`Shopping bag, ${count} items`} onClick={() => setDrawerOpen(true)}><ShoppingBag size={18}/><span>Bag</span><b>{count}</b></button><button type="button" className="icon-button menu-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(!menu)}>{menu ? <X size={19}/> : <Menu size={19}/>}</button></div>
    <div id="search-notice" className="search-notice" role="status">Search is coming soon.</div>
  </header>;
}
function Footer() {
  const [status, setStatus] = useState('');
  return <footer className="footer">
    <div className="footer-top"><div><Link to="/" className="brand"><span className="brand-mark"><AudioLines size={19}/></span><span>OBSIDIAN <i>AUDIO</i></span></Link><p className="footer-note">Sound for the space you make.</p></div><div><p className="eyebrow">A little more room to listen</p><form className="newsletter" onSubmit={event => { event.preventDefault(); setStatus('Newsletter sign up is a demo. No email was sent.'); }}><input type="email" aria-label="Email address" placeholder="Your email address" required/><button type="submit">Join <ArrowRight size={15}/></button></form>{status && <p className="newsletter-status" role="status">{status}</p>}</div></div>
    <div className="socials"><a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={17}/></a><a href="https://www.youtube.com/" aria-label="YouTube"><Youtube size={17}/></a></div>
    <div className="footer-bottom"><span>© 2026 Obsidian Audio</span><span>Sound, considered.</span></div>
  </footer>;
}
function HoursCount() {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(40); return; }
      const start = performance.now();
      const tick = (now: number) => { const progress = Math.min((now - start) / 900, 1); setValue(Math.round(progress * 40)); if (progress < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: .5 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref}>{value}</span>;
}
const titleLineVariants: Variants = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: .75, ease: 'easeOut' } } };
const featureItems = [
  { number: '01', title: 'Quiet, on your terms.', copy: 'Adaptive noise cancellation reads your surroundings and gives your attention back to you.', icon: <AudioLines size={25}/>, mark: <div className="waveform" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i}/>)}</div> },
  { number: '02', title: 'Sound with a sense of space.', copy: 'Spatial audio places every note with precision, so the music feels open and unforced.', icon: <Waves size={25}/>, mark: <div className="spatial-mark" aria-hidden="true"><span/><span/><span/></div> },
  { number: '03', title: 'Made for the long listen.', copy: 'Acoustically tuned 40 mm drivers meet cushions designed to disappear over time.', icon: <CircleDot size={25}/>, mark: <div className="driver-mark">40<small>MM DRIVER</small></div> },
  { number: '04', title: 'One charge. All day.', copy: <>Up to <strong><HoursCount/></strong> hours of listening, with fast charging for longer days.</>, icon: <BatteryFull size={25}/>, mark: <div className="battery-mark"><HoursCount/><span>HRS</span></div> },
];
const finishes: ProductFinish[] = ['Red', 'Cream', 'Black'];
function Home() {
  const { add, setDrawerOpen } = useCart();
  const heroRef = useRef<HTMLElement>(null);
  const [storyColor, setStoryColor] = useState<ProductFinish>('Cream');
  const [activeEngineering, setActiveEngineering] = useState('Acoustic core');
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const addToBag = (finish: ProductFinish = storyColor) => { add(finish); setDrawerOpen(true); };
  return <main>
    <section className="hero" ref={heroRef}>
      <div className="hero-backdrop" aria-hidden="true"/>
      <motion.div className="hero-copy" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .1, delayChildren: .12 } } }}>
        <motion.p className="eyebrow" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: .5 } } }}>ENGINEERED FOR IMMERSION</motion.p>
        <h1><span className="hero-line"><motion.span variants={titleLineVariants}>Silence the noise.</motion.span></span><span className="hero-line"><motion.span className="hero-highlight" variants={titleLineVariants}>Hear everything.</motion.span></span></h1>
      </motion.div>
      <ProductViewer color="Cream" angle={.38} className="hero-model"/>
      <div className="hero-specs" role="group" aria-label="Product highlights"><span className="hero-spec hero-spec-one">40 hrs battery</span><span className="hero-spec hero-spec-two">Adaptive noise canceling</span></div>
      <div className="hero-bottom"><p className="lead">Precision-engineered sound. Thoughtful materials. An entirely different listening experience.</p><div className="hero-actions"><Link to="/product/obsidian-one" className="button button-cream">Explore Obsidian One <ArrowRight size={17}/></Link><a href="#technology" className="button button-ghost">Discover the technology</a></div></div>
      <div className="marquee marquee-hero" aria-label="For the moments that matter. Sound, considered."><div className="marquee-track" aria-hidden="true">{Array.from({ length: 2 }, (_, i) => <span key={i}>For the moments that matter <b>✳</b> Sound, considered <b>✳</b> Meet Obsidian One <b>✳</b> Find your quiet <b>✳</b></span>)}</div></div>
      <a href="#features" className="scroll-cue"><span>Scroll to listen</span><ArrowDown size={16}/></a>
    </section>
    <RevealSection className="features section-pad" id="features"><div className="section-heading"><p className="eyebrow">The details make the difference</p><h2>Nothing added.<br/>Nothing missing.</h2></div><div className="feature-list">{featureItems.map(item => <article key={item.number}><div className="feature-card-top"><span className="feature-no">{item.number}</span><span className="feature-icon">{item.icon}</span></div><div><h3>{item.title}</h3><p>{item.copy}</p></div><div className="feature-mark">{item.mark}</div></article>)}</div></RevealSection>
    <RevealSection className="engineering" id="technology"><div className="engineering-visual"><ProductViewer color="Black" angle={-.28} className="engineering-model"/><div className="photo-hotspots" aria-label="Product material details"><button type="button" className={`photo-hotspot hotspot-housing ${activeEngineering==='Structural frame'?'is-active':''}`} aria-pressed={activeEngineering==='Structural frame'} onClick={()=>setActiveEngineering('Structural frame')}><i/><span>Anodized housing</span></button><button type="button" className={`photo-hotspot hotspot-driver ${activeEngineering==='Acoustic core'?'is-active':''}`} aria-pressed={activeEngineering==='Acoustic core'} onClick={()=>setActiveEngineering('Acoustic core')}><i/><span>Dynamic membrane</span></button><button type="button" className={`photo-hotspot hotspot-seal ${activeEngineering==='Contact materials'?'is-active':''}`} aria-pressed={activeEngineering==='Contact materials'} onClick={()=>setActiveEngineering('Contact materials')}><i/><span>Acoustic seal</span></button></div></div><div className="engineering-copy"><p className="eyebrow">A study in sound</p><h2>Every layer has a reason.</h2><p>From the first bend of the flexible headband to the acoustic fabric inside each cup, Obsidian One is engineered as one considered system.</p><div className="spec-list"><details open={activeEngineering==='Acoustic core'} className={activeEngineering==='Acoustic core'?'is-active':''} onToggle={event=>{if(event.currentTarget.open)setActiveEngineering('Acoustic core')}}><summary><span><small>01</small> Acoustic core</span><ChevronDown size={18}/></summary><p>40 mm dynamic drivers tuned for natural detail, supported by active noise cancellation and spatial audio.</p></details><details open={activeEngineering==='Contact materials'} className={activeEngineering==='Contact materials'?'is-active':''} onToggle={event=>{if(event.currentTarget.open)setActiveEngineering('Contact materials')}}><summary><span><small>02</small> Contact materials</span><ChevronDown size={18}/></summary><p>Soft-grain cushions and pressure-relieving memory foam make room for a long, comfortable listen.</p></details><details open={activeEngineering==='Structural frame'} className={activeEngineering==='Structural frame'?'is-active':''} onToggle={event=>{if(event.currentTarget.open)setActiveEngineering('Structural frame')}}><summary><span><small>03</small> Structural frame</span><ChevronDown size={18}/></summary><p>A light, flexible frame and low-profile hinges keep the fit secure without adding visual weight.</p></details></div><Link to="/product/obsidian-one" className="text-link">Explore the construction <ArrowRight size={16}/></Link></div></RevealSection>
    <RevealSection className="story" id="story"><div className="story-content"><p className="eyebrow">Less, but better</p><h2>Space to hear<br/>yourself think.</h2><p>A quieter commute. A deeper focus. The familiar song, heard differently.</p><div className="color-select"><div className="option-title"><span>Choose your finish</span><b>{storyColor}</b></div><div className="swatches" role="group" aria-label="Choose headphone color">{finishes.map((color,i)=><button key={color} type="button" aria-pressed={storyColor===color} onClick={() => setStoryColor(color)} className={`swatch swatch-${i} ${storyColor===color?'is-selected':''}`} aria-label={`${color} finish`} title={color}>{storyColor===color&&<Check size={15}/>}</button>)}</div></div><div className="story-actions"><Link to="/product/obsidian-one" className="button button-red">View Obsidian One <ArrowRight size={16}/></Link><button type="button" className="button button-ink" onClick={() => addToBag(storyColor)}>Add to bag <ShoppingBag size={16}/></button></div></div><div className="story-product"><ProductViewer color={storyColor} angle={.52} className="story-model"/></div></RevealSection>
    <RevealSection className="purchase"><div className="purchase-copy"><p className="eyebrow">Obsidian Audio / Studio Series</p><h2>Obsidian One</h2><p>Made to be heard. Built to be kept.</p></div><ProductViewer color="Red" angle={.3} compact interactive={false} className="purchase-model"/><div className="purchase-action"><span className="price">$349</span><button type="button" className="button button-yellow" onClick={() => addToBag('Red')}>Add to bag <ShoppingBag size={16}/></button><Link to="/product/obsidian-one" className="button button-ghost">Discover <ArrowRight size={16}/></Link></div></RevealSection>
  </main>;
}
const colors: ProductFinish[] = finishes;
const galleryAngles: Record<'Front view'|'Side profile'|'Detail',number> = { 'Front view': .38, 'Side profile': -1.08, Detail: .9 };
function ProductPage() {
  const { add, setDrawerOpen } = useCart();
  const [color, setColor] = useState<ProductFinish>('Cream');
  const [quantity, setQuantity] = useState(1);
  const [active, setActive] = useState<'Front view'|'Side profile'|'Detail'>('Front view');
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const details: Record<string,string> = { 'Specifications':'Bluetooth 5.3 · Active noise cancellation · Spatial audio · Up to 40 hours battery · USB-C fast charge · 40 mm dynamic drivers', 'Materials and construction':'Matte-finish earcups, a flexible lightweight headband, soft-grain cushions and pressure-relieving memory foam.', "What's in the box":'Obsidian One headphones, USB-C charging cable, 3.5 mm audio cable and a molded travel case.', 'Shipping and returns':'Complimentary standard shipping. Try them at home for 30 days, then return in original condition for a full refund.' };
  const addNow = () => { add(color, quantity); setAdded(true); setDrawerOpen(true); window.setTimeout(() => setAdded(false), 2200); };
  return <main className="product-page"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Obsidian One</span></div><div className="product-layout"><div className="product-gallery"><div className="gallery-main"><ProductViewer color={color} angle={galleryAngles[active]} className="gallery-model"/><span className="gallery-counter">{String(['Front view','Side profile','Detail'].indexOf(active)+1).padStart(2,'0')} / 03</span></div><div className="gallery-thumbs">{(['Front view','Side profile','Detail'] as const).map((name,i)=><button type="button" key={name} className={active===name?'thumb selected':'thumb'} onClick={()=>setActive(name)} aria-pressed={active===name}><span className="thumb-angle" aria-hidden="true">0{i+1}</span><span>{name}</span></button>)}</div><p className="gallery-note">Selected product view.</p></div><div className="product-info"><p className="eyebrow">Studio Series / 01</p><h1>Obsidian One</h1><p className="product-subtitle">Premium wireless headphones</p><div className="rating"><span>DEMO</span><small>4.9 / 5 sample rating</small></div><p className="product-price">$349 <small>USD</small></p><p className="product-description">An intimate, spacious soundstage wrapped in considered materials. Built for the daily ritual of listening.</p><div className="color-select"><div className="option-title"><span>Finish</span><b>{color}</b></div><div className="swatches" role="group" aria-label="Choose headphone color">{colors.map((c,i)=><button type="button" key={c} onClick={()=>setColor(c)} aria-pressed={color===c} className={`swatch swatch-${i} ${color===c?'is-selected':''}`} aria-label={`Select ${c} finish`} title={c}>{color===c&&<Check size={14}/>}</button>)}</div></div><div className="buy-row"><div className="quantity"><button type="button" onClick={()=>setQuantity(Math.max(1,quantity-1))} aria-label="Decrease quantity"><Minus size={14}/></button><span>{quantity}</span><button type="button" onClick={()=>setQuantity(quantity+1)} aria-label="Increase quantity"><Plus size={14}/></button></div><button type="button" className="button add-button" onClick={addNow}>{added?<><Check size={16}/> Added to bag</>:<>Add to bag <ShoppingBag size={16}/></>}</button></div><button type="button" className="button buy-now" onClick={()=>{add(color,quantity);navigate('/cart')}}>Buy now <ArrowRight size={16}/></button><div className="delivery"><span className="delivery-dot"/><div><b>In stock and ready to ship</b><small>Complimentary delivery in 3 to 5 days</small></div></div><div className="detail-accordions">{Object.entries(details).map(([title,body])=><details key={title}><summary>{title}<ChevronDown size={17}/></summary><p>{body}</p></details>)}</div></div></div><section className="product-footnote"><span>OBSIDIAN ONE</span><span>Sound, considered.</span><Link to="/">Back to the experience <ArrowRight size={15}/></Link></section></main>;
}
function CartPage() {
  const { items, count, setQuantity, remove } = useCart();
  const navigate = useNavigate();
  const item = items[0];
  const finish = item?.color === 'Red' || item?.color === 'Black' ? item.color : 'Cream';
  return <main className="cart-page"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Your bag</span></div><h1>Your bag <span>({count})</span></h1>{!item?<div className="empty-cart"><div className="empty-icon"><ShoppingBag size={28}/></div><h2>Your bag is taking a quiet moment.</h2><p>There is nothing here yet. Find a little more room in your listening.</p><Link to="/product/obsidian-one" className="button button-red">Explore Obsidian One <ArrowRight size={16}/></Link></div>:<div className="cart-grid"><div className="cart-items"><article className="cart-item"><div className="cart-product-art"><ProductViewer color={finish} compact interactive={false} className="cart-model"/></div><div className="cart-product-info"><p className="eyebrow">Studio Series</p><h2>Obsidian One</h2><p>Premium wireless headphones</p><span>Finish: {item.color}</span><div className="cart-controls"><div className="quantity"><button type="button" onClick={()=>setQuantity(item.quantity-1)} aria-label="Decrease quantity"><Minus size={14}/></button><span>{item.quantity}</span><button type="button" onClick={()=>setQuantity(item.quantity+1)} aria-label="Increase quantity"><Plus size={14}/></button></div><button type="button" className="remove-button" onClick={remove}>Remove</button></div></div><b className="cart-line-price">${(349*item.quantity).toLocaleString()}</b></article></div><aside className="order-summary"><p className="eyebrow">Order summary</p><div><span>Subtotal</span><span>${(349*item.quantity).toLocaleString()}</span></div><div><span>Shipping</span><span>Complimentary</span></div><div className="summary-total"><b>Total</b><b>${(349*item.quantity).toLocaleString()} USD</b></div><button type="button" className="button checkout-button" onClick={()=>alert('Checkout is a demo. No payment has been collected.')}>Continue to checkout <ArrowRight size={16}/></button><p className="checkout-note">Secure checkout preview. Payment is not connected.</p><button type="button" className="continue-link" onClick={()=>navigate('/product/obsidian-one')}><ArrowLeft size={14}/> Continue shopping</button></aside></div>}</main>;
}
function App() {
  const location = useLocation();
  return <MotionConfig reducedMotion="user"><div className="app-shell"><Navbar/><CartDrawer/><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.28,ease:'easeOut'}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/product/obsidian-one" element={<ProductPage/>}/><Route path="/cart" element={<CartPage/>}/><Route path="*" element={<Home/>}/></Routes><Footer/></motion.div></AnimatePresence></div></MotionConfig>;
}
export default App;
