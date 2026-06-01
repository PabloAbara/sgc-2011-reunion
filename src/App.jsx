import { useState, useEffect, useRef } from 'react'
import Hero from './components/Hero'
import RegistrationForm from './components/RegistrationForm'
import BellIcon from './components/BellIcon'
import CinematicIntro from './components/CinematicIntro'

const PHOTO = '/generacion-2011-duo.png'

export default function App() {
  const formRef = useRef(null)
  const [showSticky, setShowSticky] = useState(false)
  const [done, setDone] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const el = formRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: .12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const scrollToForm = () => {
    const y = formRef.current.getBoundingClientRect().top + window.scrollY - 24
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <>
    <div className="page warm-bg">
      <div className="grain" />

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, padding: '56px 26px 0' }}>
        <Hero />
      </div>

      {/* Form */}
      <div ref={formRef} style={{ position: 'relative', zIndex: 1, padding: '52px 22px 0' }}>
        <div className="form-card">
          <span className="tab">Pre-inscripción</span>
          <RegistrationForm onDone={() => setDone(true)} />
        </div>
      </div>

      {/* Footer with photo */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '46px', height: '196px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${PHOTO})`,
          backgroundSize: 'cover', backgroundPosition: 'center 28%',
          opacity: .42
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg,#0c0a06,rgba(12,10,6,.3) 45%,#0c0a06)'
        }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'var(--line)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="eyebrow" style={{ fontSize: '11px', letterSpacing: '.30em', marginRight: '-.30em', color: 'var(--cream-dim)' }}>
            · Generación 2011 ·
          </span>
        </div>
      </div>

      <div style={{ height: '92px' }} />

      {/* Sticky CTA */}
      <div className={'sticky-cta' + (showSticky && !done ? ' show' : '')}>
        <button onClick={scrollToForm}>
          <BellIcon s={17} shake /> Anótame
        </button>
      </div>
    </div>

    {showIntro && <CinematicIntro onDone={() => setShowIntro(false)} />}
    </>
  )
}
