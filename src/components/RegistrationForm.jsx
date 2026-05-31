import { useState } from 'react'

// Replace this URL after deploying your Google Apps Script
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export default function RegistrationForm() {
  const [form, setForm] = useState({ nombre: '', email: '', celular: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Ingresa tu nombre'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email inválido'
    if (!form.celular.trim()) e.celular = 'Ingresa tu celular'
    return e
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setStatus('loading')
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, timestamp: new Date().toISOString() }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="animate-fade-up flex flex-col items-center gap-4 py-6 text-center">
        <span className="text-4xl">🔔</span>
        <p className="text-lg font-medium text-gold-400">¡Listo!</p>
        <p className="text-sm text-gray-400 max-w-xs">
          Te contactaremos con los detalles pronto.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Nombre completo
        </label>
        <input
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Pablo Abara"
          className={`bg-transparent border-b py-2 text-sm outline-none transition-colors placeholder-gray-600
            ${errors.nombre ? 'border-red-500' : 'border-gray-700 focus:border-gold-400'}`}
        />
        {errors.nombre && (
          <span className="text-xs text-red-400">{errors.nombre}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Email
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="pablo@ejemplo.com"
          className={`bg-transparent border-b py-2 text-sm outline-none transition-colors placeholder-gray-600
            ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-gold-400'}`}
        />
        {errors.email && (
          <span className="text-xs text-red-400">{errors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Celular
        </label>
        <input
          name="celular"
          type="tel"
          value={form.celular}
          onChange={handleChange}
          placeholder="+56 9 1234 5678"
          className={`bg-transparent border-b py-2 text-sm outline-none transition-colors placeholder-gray-600
            ${errors.celular ? 'border-red-500' : 'border-gray-700 focus:border-gold-400'}`}
        />
        {errors.celular && (
          <span className="text-xs text-red-400">{errors.celular}</span>
        )}
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-400">
          Algo salió mal. Intenta de nuevo.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-2 flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500
          text-black font-semibold text-sm py-3 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>🔔</span>
        <span>{status === 'loading' ? 'Enviando...' : 'Anótame'}</span>
      </button>
    </form>
  )
}
