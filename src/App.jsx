import RegistrationForm from './components/RegistrationForm'

export default function App() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-16">

      {/* Header */}
      <div className="w-full max-w-md mb-12 text-center">
        <p className="animate-fade-up delay-100 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400 mb-4">
          Saint George College · Generación 2011
        </p>
        <h1 className="animate-fade-up delay-200 text-5xl font-bold leading-tight mb-4">
          15 años<br />después.
        </h1>
        <p className="animate-fade-up delay-300 text-sm text-gray-400 leading-relaxed">
          Muchas cosas cambiaron. Otras no tanto.<br />
          Octubre 2026 · Santiago.
        </p>
      </div>

      {/* Divider */}
      <div className="animate-fade-up delay-400 w-px h-8 bg-gold-400 mb-12 opacity-40" />

      {/* Form card */}
      <div className="animate-fade-up delay-500 w-full max-w-md">
        <div className="border border-gray-800 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400 mb-6">
            Preinscripción
          </p>
          <RegistrationForm />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-700 text-center">
        Gen 2011 · Saint George College
      </p>

    </main>
  )
}
