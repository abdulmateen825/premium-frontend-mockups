import { useEffect, useState, type CSSProperties } from 'react'
export type Roommate = { name: string; color: string; label: string; shape: string; eye: string }
export const roommates: Roommate[] = [
  { name: 'Pip', color: 'tomato', label: '#FF6B5B', shape: 'M17 53C16 31 30 16 51 17c8-12 25-12 32 1 18 4 24 20 21 38-1 20-14 33-38 32-28 4-48-10-49-35Z', eye: 'M34 48a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm31 0a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z' },
  { name: 'Moss', color: 'mint', label: '#4FD1A5', shape: 'M14 54C12 33 26 19 42 20c10-11 29-8 34 5 20-1 31 14 26 34-2 18-17 31-40 28-24 4-46-9-48-33Z', eye: 'M33 48a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm31 0a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z' },
  { name: 'Dot', color: 'sky', label: '#5BB8FF', shape: 'M16 54c-1-18 12-33 30-33 9-13 27-10 32 4 18 1 29 17 24 36-4 20-18 29-39 25-27 3-45-10-47-32Z', eye: 'M34 48a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm31 0a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z' },
  { name: 'Sunny', color: 'sunflower', label: '#FFC933', shape: 'M15 53c-2-20 13-34 31-32 9-12 27-9 32 4 18 0 29 16 25 35-3 20-18 31-39 27-25 4-47-10-49-34Z', eye: 'M34 48a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm31 0a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z' },
]
export function Character({ person, size = 120, className = '' }: { person: Roommate; size?: number; className?: string }) {
  const [blinking,setBlinking]=useState(false)
  useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;let timer:number; let pulse:number; const next=()=>{timer=window.setTimeout(()=>{setBlinking(true);pulse=window.setTimeout(()=>setBlinking(false),140);next()},3000+Math.random()*2000)};next();return()=>{window.clearTimeout(timer);window.clearTimeout(pulse)}},[])
  return <svg className={`character character--${person.name.toLowerCase()} ${className} ${blinking?'is-blinking':''}`} style={{ '--char': `var(--${person.color})`, width: size } as CSSProperties} viewBox="0 0 112 112" role="img" aria-label={`${person.name}, a ${person.color} roommate character`}>
    <defs><linearGradient id={`shine-${person.name}`} x1="0" y1="0" x2="0.8" y2="1"><stop stopColor="white" stopOpacity=".46"/><stop offset=".45" stopColor="white" stopOpacity="0"/></linearGradient></defs>
    <path d={person.shape} fill="var(--char)" stroke="color-mix(in srgb, var(--char) 70%, black)" strokeWidth="2" />
    <path d={person.shape} fill={`url(#shine-${person.name})`} />
    <path d={person.eye} fill="var(--ink)" />
    <path d="M49 56q7 7 14 0" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="27" cy="54" rx="7" ry="3.5" fill="white" opacity=".28" />
  </svg>
}
