import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export function mountMotion(root) {
  if (!root) return () => {}
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = window.matchMedia('(max-width: 760px)').matches
  root.classList.add('motion-ready')
  const cleanups = []
  let lenis = null
  let raf = 0

  if (!reduced) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => { lenis.raf(time); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
  }

  const context = gsap.context(() => {
    if (!reduced) {
      gsap.fromTo('.hero h1 > span', { yPercent: 115, filter: 'blur(10px)', opacity: 0 }, {
        yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: 1.1, stagger: 0.14, ease: 'power4.out', delay: 0.14,
      })
      gsap.fromTo('.hero-copy > :not(h1)', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.48 })
      gsap.fromTo('.hero-coordinate, .hero-orbit-note, .scroll-cue', { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.12, delay: 0.82 })
    }

    gsap.utils.toArray('.reveal').forEach((element, index) => {
      gsap.fromTo(element, { y: reduced ? 0 : 28, opacity: reduced ? 1 : 0, rotate: reduced ? 0 : (index % 2 ? 0.8 : -0.8), scale: reduced ? 1 : 0.985 }, {
        y: 0, opacity: 1, rotate: 0, scale: 1, duration: 0.75, delay: reduced ? 0 : (index % 3) * 0.045, ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 82%', once: true },
      })
    })

    if (reduced) gsap.set('.scroll-progress span', { scaleX: 1 })
    else gsap.to('.scroll-progress span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.2 } })

    if (!reduced && !mobile) {
      gsap.to('.timeline-progress', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 48%', end: 'bottom 55%', scrub: 0.4 } })

      const gallery = document.querySelector('[data-gallery]')
      if (gallery && gallery.scrollWidth > gallery.parentElement.clientWidth) {
        const galleryTween = gsap.to(gallery, { x: () => -Math.max(0, gallery.scrollWidth - gallery.parentElement.clientWidth), ease: 'none', scrollTrigger: { trigger: gallery, start: 'top 68%', end: () => `+=${gallery.scrollWidth - gallery.parentElement.clientWidth}`, scrub: 0.7, invalidateOnRefresh: true } })
        cleanups.push(() => galleryTween.kill())
      }
    } else {
      gsap.set('.timeline-progress', { scaleY: 1 })
    }

    gsap.utils.toArray('.count-up').forEach((element) => {
      const endValue = Number(element.dataset.value || 0)
      if (reduced) { element.textContent = String(endValue); return }
      const counter = { value: 0 }
      gsap.to(counter, { value: endValue, duration: 1.25, ease: 'power2.out', snap: { value: 1 }, scrollTrigger: { trigger: element, start: 'top 86%', once: true }, onUpdate: () => { element.textContent = String(counter.value).padStart(2, '0') } })
    })

    if (!reduced) {
      const partnerTrack = document.querySelector('.partner-track')
      if (partnerTrack) {
        const marquee = gsap.to(partnerTrack, { xPercent: -50, duration: 42, ease: 'none', repeat: -1 })
        const velocity = ScrollTrigger.create({ onUpdate: (self) => marquee.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 1600, 2.4)) })
        const slowMarquee = () => gsap.to(marquee, { timeScale: 1, duration: 1.1, ease: 'power2.out', overwrite: true })
        const toggleMarquee = (event) => event.detail ? marquee.pause() : marquee.play()
        ScrollTrigger.addEventListener('scrollEnd', slowMarquee)
        window.addEventListener('soi:marquee', toggleMarquee)
        cleanups.push(() => { marquee.kill(); velocity.kill(); ScrollTrigger.removeEventListener('scrollEnd', slowMarquee); window.removeEventListener('soi:marquee', toggleMarquee) })
      }
      gsap.utils.toArray('[data-speed]').forEach((element) => {
        const speed = Number(element.dataset.speed || 0.08)
        gsap.to(element, { y: () => (window.innerHeight * speed * -1), ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true } })
      })
      if (!mobile) {
        bindTilt(root, cleanups)
        bindMagnetics(root, cleanups)
        bindCursor(root, cleanups)
      }
    }
  }, root)

  const onResize = () => ScrollTrigger.refresh()
  window.addEventListener('resize', onResize, { passive: true })

  return () => {
    window.removeEventListener('resize', onResize)
    window.cancelAnimationFrame(raf)
    context.revert()
    cleanups.forEach((cleanup) => cleanup())
    lenis?.destroy()
    root.classList.remove('motion-ready')
  }
}

function bindTilt(root, cleanups) {
  const cards = root.querySelectorAll('[data-tilt]')
  const handlers = []
  cards.forEach((card) => {
    const move = (event) => {
      const box = card.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width
      const y = (event.clientY - box.top) / box.height
      card.style.setProperty('--shine-x', `${x * 100}%`)
      card.style.setProperty('--shine-y', `${y * 100}%`)
      gsap.to(card, { rotateX: (0.5 - y) * 4, rotateY: (x - 0.5) * 4, transformPerspective: 850, duration: 0.35, ease: 'power2.out', overwrite: true })
    }
    const leave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' })
    card.addEventListener('pointermove', move)
    card.addEventListener('pointerleave', leave)
    handlers.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave) })
  })
  cleanups.push(() => handlers.forEach((remove) => remove()))
}

function bindMagnetics(root, cleanups) {
  const buttons = root.querySelectorAll('.magnetic')
  const handlers = []
  buttons.forEach((button) => {
    const move = (event) => {
      const rect = button.getBoundingClientRect()
      gsap.to(button, { x: (event.clientX - rect.left - rect.width / 2) * 0.12, y: (event.clientY - rect.top - rect.height / 2) * 0.12, duration: 0.28, ease: 'power2.out' })
    }
    const leave = () => gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)' })
    button.addEventListener('pointermove', move)
    button.addEventListener('pointerleave', leave)
    handlers.push(() => { button.removeEventListener('pointermove', move); button.removeEventListener('pointerleave', leave) })
  })
  cleanups.push(() => handlers.forEach((remove) => remove()))
}

function bindCursor(root, cleanups) {
  if (!window.matchMedia('(pointer: fine)').matches) return
  const follower = root.querySelector('.cursor-glow')
  if (!follower) return
  const move = (event) => gsap.to(follower, { x: event.clientX, y: event.clientY, duration: 0.42, ease: 'power3.out' })
  const show = () => follower.classList.add('is-active')
  const hide = () => follower.classList.remove('is-active')
  window.addEventListener('pointermove', move, { passive: true })
  root.querySelectorAll('a, button, summary, input, select').forEach((element) => {
    element.addEventListener('pointerenter', show)
    element.addEventListener('pointerleave', hide)
  })
  cleanups.push(() => {
    window.removeEventListener('pointermove', move)
    root.querySelectorAll('a, button, summary, input, select').forEach((element) => {
      element.removeEventListener('pointerenter', show)
      element.removeEventListener('pointerleave', hide)
    })
  })
}
