import { useState } from 'react'
import BellIcon from './BellIcon'
import Countdown from './Countdown'

const errStyle = { display: 'block', marginTop: '5px', fontFamily: 'var(--sans)', fontSize: '11px', color: '#c2552f', letterSpacing: '.04em' }

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''
const FORM_TOKEN = import.meta.env.VITE_FORM_TOKEN || ''

export default function RegistrationForm({ onDone }) {
  const [data, setData] = useState({ nombre: '', mail: '', celular: '', curso: '' })
  const [err, setErr] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const set = (k) => (e) => {
    setData(prev => ({ ...prev, [k]: e.target.value }))
    if (err[k]) setErr(prev => ({ ...prev, [k]: false }))
  }

  async function submit(e) {
    e.preventDefault()
    const er = {}
    if (!data.nombre.trim()) er.nombre = true
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.mail)) er.mail = true
    if (data.celular.replace(/\D/g, '').length < 8) er.celular = true
    if (!data.curso) er.curso = true
    setErr(er)
    if (Object.keys(er).length > 0) return

    setStatus('loading')
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, timestamp: new Date().toISOString(), token: FORM_TOKEN }),
      })
      setStatus('success')
      onDone && onDone()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="success">
        <div className="seal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 6.5" />
          </svg>
        </div>
        <div className="eyebrow" style={{ fontSize: '12px', letterSpacing: '.30em', marginBottom: '14px', marginRight: '-.30em' }}>
          Te anotaste en la lista
        </div>
        <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '48px', lineHeight: 1, margin: '0 0 20px' }}>
          Listo!
        </h3>
        <Countdown />
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '20px', color: 'var(--cream-dim)', margin: '4px 0 0', lineHeight: 1.35 }}>
          Te contactaremos pronto <br /> con los detalles.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '30px', margin: '2px 0 4px', color: 'var(--cream)', textAlign: 'center' }}>
        Anótate acá
      </h2>
      <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '16px', color: 'var(--cream-faint)', margin: '0 0 4px', textAlign: 'center' }}>
        Y te avisamos los detalles pronto.
      </p>

      <div className="field">
        <input className={err.nombre ? 'invalid' : ''} value={data.nombre}
          onChange={set('nombre')} placeholder="Nombre completo" />
        {err.nombre && <span style={errStyle}>Ingresa tu nombre</span>}
      </div>
      <div className="field">
        <input className={err.mail ? 'invalid' : ''} value={data.mail}
          onChange={set('mail')} placeholder="Mail" inputMode="email" />
        {err.mail && <span style={errStyle}>Ingresa un mail válido</span>}
      </div>
      <div className="field">
        <input className={err.celular ? 'invalid' : ''} value={data.celular}
          onChange={set('celular')} placeholder="Celular" inputMode="tel" />
        {err.celular && <span style={errStyle}>Ingresa tu celular</span>}
      </div>
      <div className="field">
        <select
          value={data.curso}
          onChange={e => { setData(prev => ({ ...prev, curso: e.target.value })); if (err.curso) setErr(prev => ({ ...prev, curso: false })) }}
          style={{
            width: '100%', background: 'transparent', border: 0,
            borderBottom: `1px solid ${err.curso ? '#c2552f' : 'rgba(244,239,226,.22)'}`,
            color: data.curso ? 'var(--cream)' : 'var(--cream-faint)',
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '21px',
            padding: '8px 2px 11px', outline: 'none', appearance: 'none',
            cursor: 'pointer', transition: 'border-color .35s ease',
          }}
        >
          <option value="" disabled style={{ background: '#0c0a06' }}>¿De qué curso eras?</option>
          {['A','B','C','D','E','F'].map(c => (
            <option key={c} value={c} style={{ background: '#0c0a06', color: 'var(--cream)', fontStyle: 'normal' }}>
              {c}
            </option>
          ))}
        </select>
        {err.curso && <span style={errStyle}>Selecciona tu curso</span>}
      </div>

      {status === 'error' && (
        <p style={{ color: '#c2552f', fontSize: '13px', marginTop: '12px', fontFamily: 'var(--sans)' }}>
          Algo salió mal. Intenta de nuevo.
        </p>
      )}

      <button type="submit" className="cta cta--big" disabled={status === 'loading'}>
        <BellIcon s={18} shake />
        {status === 'loading' ? 'Enviando...' : 'Inscribirme'}
      </button>
      <p className="kicker" style={{ textAlign: 'center', fontSize: '16px', margin: '16px 0 0' }}>
        Se viene bueno.
      </p>
    </form>
  )
}
