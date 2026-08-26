import Sparkles from './Sparkles'

export default function Hero() {
  return (
    <div className="hero15">
      <Sparkles />
      <div className="rise d1 eyebrow" style={{ fontSize: '12px', letterSpacing: '.34em', marginRight: '-.34em' }}>
        Generación 2011 · Saint George's
      </div>
      <span className="rise d2 num15" style={{ fontSize: '268px', marginTop: '18px' }}>15</span>
      <div className="rise d3" style={{
        fontFamily: 'var(--sans)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--cream)',
        fontSize: '14px', letterSpacing: '.46em', marginRight: '-.46em', marginTop: '30px'
      }}>
        Años después
      </div>
      <h1 className="rise d4 stmt" style={{ fontSize: '50px', lineHeight: .98, marginTop: '26px' }}>
        Nos <span className="italic-gold" style={{ fontWeight: 500 }}>vemos</span><br />de nuevo
      </h1>
      <div className="rise d5" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '11px', letterSpacing: '.28em', color: 'var(--gold)', textTransform: 'uppercase' }}>Fecha</span>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '32px', color: 'var(--cream)', lineHeight: 1 }}>10 de Octubre</span>
        <span style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--cream-faint)', letterSpacing: '.08em' }}>En Santiago</span>
      </div>
      <div className="rise d6" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginTop: '26px'
      }}>
        <hr className="rule-gold" style={{ width: '46px' }} />
      </div>
    </div>
  )
}
