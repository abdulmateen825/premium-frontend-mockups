import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Pause, Play,
  Compass, Globe2, HeartPulse, Menu, Radio, ShieldCheck, Sparkles, X, Sun, Moon,
} from 'lucide-react'
import { createMarsScene } from './scene.js'
import { mountMotion } from './motion.js'

const facts = [
  { name: 'Olympus Mons', tag: '01 / THE GIANT', variant: 'mons', copy: 'A shield volcano nearly three times the height of Everest. Its broad slopes make a landmark visible from orbit.' },
  { name: 'Valles Marineris', tag: '02 / THE CANYON', variant: 'canyon', copy: 'A 4,000-kilometre rift system that stretches across a quarter of the planet and descends deep beneath the plains.' },
  { name: 'Jezero Crater', tag: '03 / THE LANDING SITE', variant: 'jezero', copy: 'An ancient lake basin, chosen for its layered delta and the clues it holds about Mars’ wetter past.' },
  { name: 'Polar ice caps', tag: '04 / WATER RESERVE', variant: 'ice', copy: 'Seasonal caps of water ice and frozen carbon dioxide expand and retreat with the Martian year.' },
  { name: 'Red dust storms', tag: '05 / PLANETARY WEATHER', variant: 'storm', copy: 'Fine iron-rich dust can travel far beyond the horizon. Habitats and suits are designed for the long view.' },
  { name: 'Phobos & Deimos', tag: '06 / TWO MOONS', variant: 'moons', copy: 'Two small, irregular moons cross the sky quickly—quiet companions for a very distant home.' },
]

const journey = [
  ['01', 'Selection & training', '2039 — 2041', 'A global call opens. Selected crew train in high-altitude terrain, isolation habitats and mission simulations.'],
  ['02', 'Launch from Sriharikota', '18 OCT 2042', 'The crew vehicle lifts from the east coast of India into a low Earth orbit assembly sequence.'],
  ['03', 'Earth departure burn', '24 OCT 2042', 'A precisely timed translunar-style injection places the transfer vehicle on its heliocentric arc.'],
  ['04', 'Seven-month cruise', 'OCT 2042 — MAY 2043', 'Crew live, work and exercise in transit while the spacecraft trims its course across interplanetary space.'],
  ['05', 'Mars orbit insertion', '22 MAY 2043', 'A critical capture burn slows the vehicle into a stable high orbit above the red planet.'],
  ['06', 'Landing', 'JUN 2043', 'A robotic cargo lander confirms the site before the crew descends to the surface habitat.'],
  ['07', 'Surface life', 'JUN 2043 — APR 2044', 'A ten-month science campaign studies geology, weather and the systems humans need to live well.'],
  ['08', 'Return window', 'APR 2044', 'The ascent vehicle meets the return craft in orbit, beginning the journey home to Earth.'],
]

const services = [
  { icon: Compass, title: 'Astronaut training', copy: 'Field science, EVA rehearsal and calm decision-making in remote terrain.' },
  { icon: HeartPulse, title: 'Medical screening', copy: 'A staged health review, with personal support through every checkpoint.' },
  { icon: Sparkles, title: 'Life support', copy: 'Closed-loop air, water and food systems designed for dependable routines.' },
  { icon: Globe2, title: 'Habitat living', copy: 'Private rest, shared work and a considered rhythm for a small crew.' },
  { icon: Radio, title: 'Communication link', copy: 'A thoughtful connection plan for the long signal delay between worlds.' },
  { icon: ShieldCheck, title: 'Cover & counsel', copy: 'Clear mission terms, risk briefings and independent guidance before commitment.' },
]

const milestones = [
  ['112', 'orbital launches'], ['42', 'spacecraft deployed'], ['03', 'Mars-class missions'], ['28', 'years of flight heritage'],
]

function MarsArt({ variant }) {
  const art = {
    mons: <><path d="M0 160 45 144 82 132 116 115 145 105 170 52 195 105 232 118 269 145 320 160Z" fill="var(--art-mons)"/><path d="M151 101q19-13 38 0" fill="none" stroke="var(--art-line)" strokeWidth="5"/><path d="M0 161q82-20 160 0t160 0" fill="none" stroke="var(--art-rust-light)" strokeWidth="2"/></>,
    canyon: <><path d="M0 110q62-22 110 10t102-2q53-29 108 0v60H0Z" fill="var(--art-canyon)"/><path d="M0 137q59-29 108 0t104-4q53-27 108-2" fill="none" stroke="var(--art-canyon-light)" strokeWidth="18"/><path d="M0 142q60-25 107 1t108-4q50-26 105-2" fill="none" stroke="var(--art-canyon-shadow)" strokeWidth="7"/></>,
    jezero: <><path d="M0 152q72-48 144 0t176 0v28H0Z" fill="var(--art-jezero)"/><ellipse cx="172" cy="129" rx="62" ry="23" fill="var(--art-lake)"/><path d="M118 126q52 17 105 0M126 137q42 13 87 0" fill="none" stroke="var(--art-lake-line)" strokeWidth="3"/><circle cx="172" cy="124" r="74" fill="none" stroke="var(--art-ring)" strokeWidth="3"/></>,
    ice: <><path d="M0 133q80-22 160 0t160 0v47H0Z" fill="var(--art-ice)"/><path d="M0 133q80-22 160 0t160 0" fill="none" stroke="var(--art-ice-cap)" strokeWidth="24"/><path d="M20 133q70-17 140 0t140 0" fill="none" stroke="var(--art-ice-blue)" strokeWidth="11"/></>,
    storm: <><path d="M0 145q83-30 160 0t160 0v35H0Z" fill="var(--art-storm)"/><path d="M-20 89q80-42 157-6t157-8M-12 108q80-40 156-4t155-7M0 127q79-36 158-1t160-8" fill="none" stroke="var(--art-storm-line)" strokeWidth="11" opacity=".8"/><circle cx="245" cy="46" r="20" fill="var(--mars)" opacity=".7"/></>,
    moons: <><path d="M0 151q80-28 160 0t160 0v29H0Z" fill="var(--art-moon-ground)"/><circle cx="92" cy="88" r="15" fill="var(--art-moon)"/><circle cx="92" cy="88" r="20" fill="none" stroke="var(--art-moon-ring)" strokeWidth="2" opacity=".8"/><circle cx="232" cy="55" r="9" fill="var(--art-moon-light)"/><path d="M0 151q80-28 160 0t160 0" fill="none" stroke="var(--art-moon-ridge)" strokeWidth="3"/></>,
  }[variant]
  return <svg className={`mars-art mars-art--${variant}`} viewBox="0 0 320 180" role="img" aria-label={`${variant} inspired illustration of the Martian landscape`}>
    <defs><linearGradient id={`sky-${variant}`} x2="0" y2="1"><stop stopColor="var(--art-sky-top)"/><stop offset="1" stopColor="var(--art-sky-bottom)"/></linearGradient><radialGradient id={`sun-${variant}`}><stop stopColor="var(--art-sun-center)"/><stop offset="1" stopColor="var(--art-sun-edge)" stopOpacity="0"/></radialGradient></defs>
    <rect width="320" height="180" fill={`url(#sky-${variant})`}/><circle cx="240" cy="57" r="54" fill={`url(#sun-${variant})`}/>{art}
    <path d="M0 166q76-15 157 0t163 0v14H0Z" fill="var(--art-horizon)" opacity=".16"/><g fill="none" stroke="var(--art-contour)" opacity=".55"><path d="M15 171q72-12 143 0t147 0"/><path d="M32 175q66-9 130 0t129 0"/></g>
  </svg>
}

function Mark({ compact = false }) {
  return <a className={`brand${compact ? ' brand--compact' : ''}`} href="#top" aria-label="SOI, back to top"><span className="brand-seal" aria-hidden="true"><span /></span><span className="brand-name"><b>SOI</b><small>SPACE ORGANISATION<br />OF INDIA</small></span></a>
}

function Nav({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="site-header" onKeyDown={(event) => { if (event.key === 'Escape') close() }}><nav className="nav glass" aria-label="Main navigation"><Mark /><button className="nav-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="nav-links">{open ? <X /> : <Menu />}</button><div id="nav-links" className={`nav-links${open ? ' is-open' : ''}`}>
    <a href="#mars" onClick={close}>Why Mars</a><a href="#journey" onClick={close}>The journey</a><a href="#heritage" onClick={close}>Our heritage</a><a href="#support" onClick={close}>Crew support</a>
  </div><button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={theme === 'dark'}><Sun size={15} aria-hidden="true" /><span className="theme-toggle-thumb" /><Moon size={14} aria-hidden="true" /></button><a className="button button--nav" href="#reserve">Reserve your seat <ArrowUpRight size={15} /></a></nav></header>
}

function SectionHeading({ index, eyebrow, title, copy, light = false }) {
  return <div className={`section-heading reveal${light ? ' section-heading--light' : ''}`}><p className="eyebrow"><span>[ {index} / 06 ]</span>{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-intro">{copy}</p>}</div>
}

function Hero() {
  return <section className="hero content-width" aria-labelledby="hero-title">
    <div className="hero-copy"><p className="eyebrow hero-eyebrow"><span>SOI / CREWED EXPLORATION</span><span className="live-dot" /> MISSION CONCEPT · 2042</p>
      <h1 id="hero-title"><span>WE GO</span><span>FARTHER</span><span><em>TOGETHER.</em></span></h1>
      <p className="hero-deck">A new horizon for human curiosity. Join the first crew imagined for <strong>Mangalyaan-X</strong>, India’s journey to the red planet.</p>
      <div className="hero-actions"><a className="button button--clay magnetic" href="#reserve">Explore your seat <ArrowRight size={17} /></a><a className="button button--glass" href="#journey">Follow the journey <ArrowDown size={15} /></a></div>
      <div className="hero-stats"><div><b>225M km</b><span>average distance</span></div><i /><div><b>07 months</b><span>outbound cruise</span></div><i /><div><b>2042</b><span>first launch window</span></div></div>
    </div>
    <div className="hero-coordinate" aria-hidden="true"><span>18.4°N&nbsp; 77.4°E</span><span>J E Z E R O&nbsp; C R A T E R</span></div>
    <a className="scroll-cue" href="#mars"><span className="scroll-cue-line" />Scroll to explore</a>
    <div className="hero-orbit-note" aria-hidden="true">MARS<br /><b>04:38:21</b><br />LOCAL SOL</div>
  </section>
}

function WhyMars() {
  return <section id="mars" className="section section--mars" aria-labelledby="mars-title"><div className="content-width">
    <SectionHeading index="01" eyebrow="A world worth knowing" title="Not a destination. A new perspective." copy="Mars is close enough to imagine, distant enough to change how we see home. Meet the places that make it extraordinary." />
    <div className="fact-grid">{facts.map((fact, i) => <article className="fact-card glass reveal" key={fact.name} data-tilt>
      <div className="fact-art"><MarsArt variant={fact.variant} /><span className="art-index">0{i + 1}</span></div><div className="fact-copy"><p className="micro-label">{fact.tag}</p><h3>{fact.name}</h3><p>{fact.copy}</p><a href="#journey" className="text-arrow" aria-label={`See how the mission explores ${fact.name}`}>EXPLORE <ArrowUpRight size={13} /></a></div>
    </article>)}</div>
  </div></section>
}

function Marquee() {
  const [paused, setPaused] = useState(false)
  const names = ['SOI Mission Design', 'Pune Materials Lab', 'Orbital Health Group', 'Bengaluru Crew Operations', 'Sriharikota Launch Range']
  const toggle = () => {
    const next = !paused
    setPaused(next)
    window.dispatchEvent(new CustomEvent('soi:marquee', { detail: next }))
  }
  return <div className={`partner-band${paused ? ' is-paused' : ''}`} role="region" aria-label="Illustrative mission partners"><div className="partner-label">A SHARED HORIZON</div><div className="partner-window"><div className="partner-track">{[...names, ...names].map((name, i) => <span key={`${name}-${i}`} aria-hidden={i >= names.length}>{name}<i aria-hidden="true">✳</i></span>)}</div></div><button className="partner-toggle" type="button" onClick={toggle} aria-label={paused ? 'Resume partner ticker' : 'Pause partner ticker'} aria-pressed={paused} hidden={window.matchMedia('(prefers-reduced-motion: reduce)').matches}>{paused ? <Play size={13} /> : <Pause size={13} />}</button></div>
}

function Journey() {
  return <section id="journey" className="section section--journey" aria-labelledby="journey-title"><div className="content-width journey-layout">
    <div className="journey-intro"><SectionHeading index="02" eyebrow="A decade in the making" title="From first training to first footsteps." copy="One crew. One careful sequence. Every milestone earns the next." /><div className="journey-note clay"><span className="note-icon"><Clock3 size={18} /></span><div><b>THE MISSION CLOCK</b><p>T−{new Date('2042-10-18T00:00:00Z').getUTCFullYear() - new Date().getUTCFullYear()} YEARS TO LAUNCH</p></div></div><p className="journey-legend"><span className="legend-dot" /> Mission sequence · Illustrative planning dates</p></div>
    <div className="timeline" aria-label="Mangalyaan-X mission timeline"><div className="timeline-rail"><span className="timeline-progress" /></div>{journey.map(([number, title, date, copy]) => <article className="timeline-step reveal" key={number}>
      <span className="timeline-node">{number}</span><div className="timeline-card glass"><p className="micro-label">{date}</p><h3>{title}</h3><p>{copy}</p></div>
    </article>)}</div>
  </div></section>
}

function Heritage() {
  return <section id="heritage" className="section section--heritage"><div className="content-width">
    <SectionHeading index="03" eyebrow="Built on patient progress" title="A heritage of reaching further." copy="Mangalyaan-X is a fictional future programme built on an imagined foundation of Indian engineering milestones." />
    <div className="stat-row">{milestones.map(([value, label], i) => <div className="stat-dial clay reveal" key={label}><span className="dial-orbit" aria-hidden="true" /><b className="count-up" data-value={value}>0</b><span className="stat-label">{label}</span><span className="dial-index">0{i + 1}</span></div>)}</div>
    <div className="heritage-strip glass"><div className="heritage-label"><span className="micro-label">FLIGHT LOG / 1980—2042</span><h3>Every first makes<br />the next possible.</h3><p>Illustrative heritage milestones for this concept mission.</p></div><div className="heritage-track" data-gallery>
      <article className="heritage-card"><span>1980</span><b>First orbital step</b><p>A small satellite opens a long view of home.</p><i>01 / FLIGHT HERITAGE</i></article>
      <article className="heritage-card"><span>2014</span><b>First Mars arrival</b><p>An interplanetary mission finds its way to Mars orbit.</p><i>02 / DEEP SPACE</i></article>
      <article className="heritage-card"><span>2023</span><b>Southern lunar landing</b><p>Precision navigation turns a difficult landing into a new beginning.</p><i>03 / SURFACE SCIENCE</i></article>
      <article className="heritage-card"><span>2042</span><b>Human horizon</b><p>A new generation prepares to carry the journey farther.</p><i>04 / MANGALYAAN-X</i></article>
    </div></div>
    <p className="fiction-note">Concept artwork · All SOI programme statistics and future mission details shown here are fictional.</p>
  </div></section>
}

function Support() {
  const [checked, setChecked] = useState([])
  const toggle = (id) => setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const requirements = ['I am 21 years or older', 'I can complete a medical assessment', 'I have a STEM or field-science background', 'I am ready for a multi-year training path']
  return <section id="support" className="section section--support"><div className="content-width">
    <SectionHeading index="04" eyebrow="The whole mission, supported" title="Space for people. Systems for life." copy="A crew journey is built from more than a spacecraft. Explore the support that helps people prepare, travel and live well." />
    <div className="support-layout"><div className="service-grid">{services.map(({ icon: Icon, title, copy }, i) => <article className="service-tile glass reveal" key={title}><span className="service-icon clay"><Icon size={20} strokeWidth={1.7} /></span><span className="service-number">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <aside className="requirements clay reveal"><p className="micro-label">A FIRST SELF-CHECK</p><h3>Curiosity is the first requirement.</h3><p>These are conversation starters, not final eligibility criteria.</p><div className="check-list">{requirements.map((item, i) => <label className="check-item" key={item}><input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} /><span className="check-ui"><Check size={13} /></span><span>{item}</span></label>)}</div><p className="check-progress" aria-live="polite">{checked.length} of {requirements.length} considered</p><a className="text-arrow" href="#reserve">ASK ABOUT ELIGIBILITY <ArrowRight size={14} /></a></aside>
    </div>
  </div></section>
}

function Reservation() {
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus({ type: 'idle', message: '' })
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form))
    try {
      const response = await fetch('/api/reserve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json().catch(() => ({ message: 'The reservation service is offline. Start it with npm run server, then try again.' }))
      if (!response.ok) throw new Error(result.message || 'We could not save your request. Please check the form and try again.')
      setStatus({ type: 'success', message: 'Your interest is on the mission list. We’ll be in touch with next steps.' })
      form.reset()
    } catch (error) {
      setStatus({ type: 'error', message: error.message === 'Failed to fetch' ? 'The reservation service is offline. Start the local backend with npm run server, then try again.' : error.message })
    } finally { setSubmitting(false) }
  }
  return <section id="reserve" className="section section--reserve"><div className="content-width reserve-layout">
    <div className="reserve-copy"><SectionHeading index="05" eyebrow="Your next step" title="The future has room for you." copy="Tell us what draws you to Mars. This concept form records interest only; it does not reserve a real seat or create a purchase." /><div className="reserve-coordinate"><span>MISSION DESK / BENGALURU</span><b>12°58′N&nbsp; 77°35′E</b></div></div>
    <form className="reserve-form glass" onSubmit={onSubmit}>
      <div className="form-heading"><span className="micro-label">CREW INTEREST / FORM 01</span><span className="form-live"><i /> OPEN</span></div>
      <label className="field"><span>Full name</span><input name="name" autoComplete="name" required minLength="2" maxLength="80" placeholder="e.g. Aditi Rao" /></label>
      <label className="field"><span>Email address</span><input type="email" name="email" autoComplete="email" required maxLength="254" placeholder="you@example.com" /></label>
      <div className="field-row"><label className="field"><span>Country / region</span><input name="country" autoComplete="country-name" required maxLength="80" placeholder="India" /></label><label className="field"><span>What interests you?</span><span className="select-wrap"><select name="interest" required defaultValue=""><option value="" disabled>Select a path</option><option>Astronaut pathway</option><option>Science & research</option><option>Engineering & systems</option><option>Mission support</option><option>Just exploring</option></select><ChevronDown size={15} /></span></label></div>
      <label className="consent"><input type="checkbox" name="conceptConsent" value="on" required /><span className="check-ui"><Check size={12} /></span><span>I understand this is a fictional concept enquiry, not a real booking.</span></label>
      <button className="button button--clay button--submit magnetic" type="submit" disabled={submitting}>{submitting ? 'Sending interest…' : 'Send my interest'} <ArrowRight size={16} /></button>
      <p className={`form-status form-status--${status.type}`} role="status" aria-live="polite">{status.message || 'Your details stay in this local demo unless you run the included backend.'}</p>
    </form>
  </div></section>
}

function FAQ() {
  const questions = [
    ['Is Mangalyaan-X a real mission?', 'No. SOI and Mangalyaan-X are fictional names for this hackathon concept. This page is not affiliated with a government space agency.'],
    ['Does this reserve an actual seat?', 'No. The form demonstrates a local interest workflow only. There is no real seat, payment, selection process or mission contract.'],
    ['When would training begin?', 'In this imagined timeline, crew selection opens in 2039, with the first launch window in October 2042. Those dates are illustrative.'],
    ['Can I join without a science degree?', 'The self-check is not an eligibility decision. Real crew programmes publish their own criteria; this concept simply invites interest from many disciplines.'],
  ]
  return <section className="section section--faq"><div className="content-width faq-layout"><SectionHeading index="06" eyebrow="Clear answers, early" title="Before you look up." copy="A few good questions deserve plain answers." /><div className="faq-list">{questions.map(([question, answer]) => <details className="faq-item glass" key={question}><summary>{question}<span className="faq-plus" aria-hidden="true"><ChevronDown size={17} /></span></summary><p>{answer}</p></details>)}</div></div></section>
}

function Footer() {
  return <footer className="footer"><div className="content-width footer-main"><Mark /><p className="footer-thought">Somewhere between a question<br />and a world, there is a way.</p><div className="footer-links"><a href="#mars">Mars guide</a><a href="#journey">Mission timeline</a><a href="#reserve">Contact mission desk</a></div></div><div className="content-width footer-bottom"><span>© 2042 · SOI / MANGALYAAN-X · CONCEPT PROJECT</span><span>FICTIONAL PROGRAMME · NOT A REAL BOOKING</span><a href="#top">BACK TO TOP ↑</a></div></footer>
}

function SceneCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => createMarsScene(canvasRef.current), [])
  return <div className="scene-layer" aria-hidden="true"><canvas ref={canvasRef} className="scene-canvas" /><div className="scene-wash" /></div>
}

export default function App() {
  const appRef = useRef(null)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    setTheme(next)
    try { localStorage.setItem('soi-theme', next) } catch { /* Storage can be disabled by the browser. */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#07090F' : '#F4F1EC')
    window.dispatchEvent(new CustomEvent('soi:theme', { detail: next }))
  }
  useEffect(() => mountMotion(appRef.current), [])
  return <div id="top" ref={appRef}>
    <SceneCanvas />
    <div className="scroll-progress" aria-hidden="true"><span /></div><div className="cursor-glow" aria-hidden="true" />
    <a className="skip-link" href="#main-content">Skip to content</a><Nav theme={theme} onToggleTheme={toggleTheme} />
    <main id="main-content"><Hero /><WhyMars /><Marquee /><Journey /><Heritage /><Support /><Reservation /><FAQ /></main>
    <Footer />
  </div>
}
