import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)
export function useMotion() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 800px)').matches
    const cleanups: Array<() => void> = []
    const lenis = reduced ? null : new Lenis({ duration: 1.1, smoothWheel: true })
    lenis?.on('scroll', ScrollTrigger.update)
    let raf = 0
    const tick = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(tick) }
    if (lenis) raf = requestAnimationFrame(tick)
    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>('.reveal')
      reveals.forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => el.classList.add('is-visible') }))
      if (!reduced && !mobile) {
        gsap.to('.wheel-disc', { rotation: 720, ease: 'none', scrollTrigger: { trigger: '.chores-section', start: 'top top', end: '+=1600', scrub: 1, pin: '.wheel-stage', onUpdate: self => window.dispatchEvent(new CustomEvent('burrow:chore-step', { detail: Math.min(3, Math.floor(self.progress * 4)) })) } })
        gsap.to('.bill-phone-screen', { '--step-progress': 1, ease: 'none', scrollTrigger: { trigger: '.bill-section', start: 'top top', end: '+=1400', scrub: 1, pin: '.bill-pin', onUpdate: self => window.dispatchEvent(new CustomEvent('burrow:bill-step', { detail: Math.min(2, Math.floor(self.progress * 3)) })) } })
        gsap.fromTo('.highlight-word', { scale: .65, opacity: .45 }, { scale: 1, opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: '.problem-copy', start: 'top 78%', end: 'bottom 38%', scrub: 1 } })
        gsap.to('.floater', { y: (i, el) => Number((el as HTMLElement).dataset.depth || 1) * -38, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      } else {
        gsap.set('.highlight-word', { opacity: 1, scale: 1 })
        gsap.set('.wheel-disc', { rotation: 360 })
      }
      gsap.utils.toArray<HTMLElement>('.count-up').forEach((el) => {
        const end = Number(el.dataset.value || 0)
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => { const counter = { value: 0 }; gsap.to(counter, { value: end, duration: 1.1, snap: { value: 1 }, onUpdate: () => { el.textContent = `${el.dataset.prefix || ''}${counter.value}` } }) } })
      })
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>('.note').forEach((el, i) => gsap.fromTo(el, { y: 35, opacity: 0, rotation: 0 }, { y: 0, opacity: 1, rotation: Number(el.dataset.rotate), duration: .8, delay: i * .14, ease: 'back.out(1.4)', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }))
      }
    }, root)
    return () => { cleanups.forEach(cleanup => cleanup()); ctx.revert(); cancelAnimationFrame(raf); lenis?.destroy() }
  }, [])
  return root
}

