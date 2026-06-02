import { useState, useEffect, useRef } from 'react'

const TARGET = new Date('2026-10-10T20:00:00-03:00') // 10 oct 2026, Santiago

function getTimeLeft() {
  const diff = TARGET - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

function Unit({ value, label, prev }) {
  const [flip, setFlip] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current !== value) {
      setFlip(true)
      const t = setTimeout(() => setFlip(false), 400)
      prevRef.current = value
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <span style={{
        fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '28px', lineHeight: 1,
        color: flip ? 'var(--gold)' : 'var(--cream)',
        transition: 'color .35s ease',
        minWidth: '36px', textAlign: 'center',
        display: 'block',
      }}>
        {String(value).padStart(2, '0')}
      </span>
      <span style={{
        fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '8px',
        letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--cream-faint)'
      }}>
        {label}
      </span>
    </div>
  )
}

function Sep() {
  return (
    <span style={{
      fontFamily: 'var(--serif)', fontSize: '22px', color: 'var(--gold)',
      opacity: .4, lineHeight: 1, marginBottom: '14px', alignSelf: 'flex-end'
    }}>·</span>
  )
}

export default function Countdown() {
  const [t, setT] = useState(getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
      margin: '18px 0',
    }}>
      <span style={{
        fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '9px',
        letterSpacing: '.26em', textTransform: 'uppercase', color: 'var(--gold)', opacity: .8
      }}>
        Faltan
      </span>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
        <Unit value={t.d} label="días" />
        <Sep />
        <Unit value={t.h} label="hrs" />
        <Sep />
        <Unit value={t.m} label="min" />
        <Sep />
        <Unit value={t.s} label="seg" />
      </div>
    </div>
  )
}
