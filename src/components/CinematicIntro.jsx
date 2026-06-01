import { useState, useEffect, useRef } from 'react'

const WORLD_W  = 360
const ARRIVE_S = 1.3
const DWELL_S  = 1.3
const FADE_MS  = 1600

const ANCH = [
  [180,   90],   // origen ✦
  [262,  470],   // 2011
  [104,  900],   // 2016
  [262, 1330],   // 2020
  [108, 1660],   // 2021
  [206, 1990],   // 2026
  [180, 2170],   // punta final
]
const WORLD_H = 2260

const MILESTONES = [
  { year: '2011', side: 'r', line: 'Último día con uniforme.',  photo: '/milestones/hito-2011.jpg',  focus: 'center 32%' },
  { year: '2016', side: 'l', line: 'Carrete 5 años.',           photo: '/milestones/hito-2016.jpg',  focus: 'center 38%' },
  { year: '2020', side: 'r', line: 'Pandemia.',                 photo: '/milestones/hito-2020.webp', focus: 'center 35%' },
  { year: '2021', side: 'l', line: '10 años de egreso.',        photo: '/milestones/hito-2021.gif',  focus: 'center 45%' },
  { year: '2026', side: 'r', line: 'El reencuentro.' },
]

function catmullRomPath(pts, k = 1) {
  const d = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6 * k, c1y = p1[1] + (p2[1] - p0[1]) / 6 * k
    const c2x = p2[0] - (p3[0] - p1[0]) / 6 * k, c2y = p2[1] - (p3[1] - p1[1]) / 6 * k
    d.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`)
  }
  return d.join(' ')
}
const PATH_D = catmullRomPath(ANCH)

function PlaceholderBg() {
  return (
    <div className="ph-bg">
      <div className="ph-stripes" />
    </div>
  )
}

function IntroSparkles() {
  const sp = [
    { t: '10%', l: '14%', g: '✦', s: 1.0,  d: 0   },
    { t: '18%', l: '83%', g: '✧', s: .7,   d: .6  },
    { t: '44%', l: '7%',  g: '✧', s: .6,   d: 1.1 },
    { t: '36%', l: '90%', g: '✦', s: .95,  d: .3  },
    { t: '66%', l: '15%', g: '✦', s: .8,   d: .8  },
    { t: '60%', l: '88%', g: '✧', s: .6,   d: 1.4 },
    { t: '80%', l: '46%', g: '✧', s: .55,  d: 1.7 },
  ]
  return (
    <>
      {sp.map((x, i) => (
        <span key={i} className={'spark' + (i % 3 === 1 ? ' cream' : '')}
          style={{ top: x.t, left: x.l, fontSize: 22 * x.s + 'px', animationDelay: x.d + 's' }}>
          {x.g}
        </span>
      ))}
    </>
  )
}

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
function easeInOut(u) {
  return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
}
function lenAt(kf, sec) {
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1]
    if (sec <= b.t) {
      const u = b.t === a.t ? 1 : (sec - a.t) / (b.t - a.t)
      return a.len + (b.len - a.len) * easeInOut(u)
    }
  }
  return kf[kf.length - 1].len
}

export default function CinematicIntro({ onDone }) {
  const trailRef   = useRef(null)
  const geomRef    = useRef(null)
  const startRef   = useRef(null)
  const intervalRef = useRef(null)
  const finishedRef = useRef(false)

  const [ready,     setReady]     = useState(false)
  const [st,        setSt]        = useState({ elapsed: 0, len: 0, x: ANCH[0][0], y: ANCH[0][1] })
  const [finishing, setFinishing] = useState(false)
  const [stageH,    setStageH]    = useState(window.innerHeight)

  // medir el camino SVG una vez montado
  useEffect(() => {
    const p = trailRef.current
    if (!p) return
    const total = p.getTotalLength()
    const S = 700, samples = []
    for (let i = 0; i <= S; i++) {
      const l = total * i / S, pt = p.getPointAtLength(l)
      samples.push({ l, x: pt.x, y: pt.y })
    }
    const lens = ANCH.map(a => {
      let best = 0, bd = Infinity
      for (const s of samples) {
        const d = (s.x - a[0]) ** 2 + (s.y - a[1]) ** 2
        if (d < bd) { bd = d; best = s.l }
      }
      return best
    })
    let t = 0
    const kf = [{ t: 0, len: 0 }]
    const N = MILESTONES.length
    for (let i = 1; i <= N; i++) {
      t += ARRIVE_S; kf.push({ t, len: lens[i] })
      t += DWELL_S;  kf.push({ t, len: lens[i] })
    }
    t += ARRIVE_S; kf.push({ t, len: lens[N + 1] })
    geomRef.current = { total, lens, kf, TOTAL: t }
    setReady(true)
  }, [])

  // bloquear scroll mientras está la intro
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onR = () => setStageH(window.innerHeight)
    window.addEventListener('resize', onR)
    return () => { document.body.style.overflow = prev; window.removeEventListener('resize', onR) }
  }, [])

  // reloj principal
  useEffect(() => {
    if (!ready) return
    startRef.current = performance.now()
    intervalRef.current = setInterval(() => {
      const { kf, TOTAL } = geomRef.current
      const sec = (performance.now() - startRef.current) / 1000
      const len = lenAt(kf, Math.min(TOTAL, sec))
      const pt  = trailRef.current.getPointAtLength(len)
      setSt({ elapsed: Math.min(TOTAL, sec), len, x: pt.x, y: pt.y })
      if (sec >= TOTAL) finish()
    }, 30)
    return () => clearInterval(intervalRef.current)
  }, [ready]) // eslint-disable-line

  function finish() {
    if (finishedRef.current) return
    finishedRef.current = true
    clearInterval(intervalRef.current)
    setFinishing(true)
    setTimeout(() => onDone && onDone(), FADE_MS)
  }
  function skip() {
    const g = geomRef.current
    if (g) setSt(s => ({ ...s, elapsed: g.TOTAL }))
    finish()
  }

  const g        = geomRef.current
  const total    = g ? g.total : 1
  const TOTAL    = g ? g.TOTAL : 1
  const progress = Math.min(1, st.elapsed / TOTAL)

  const centerY = stageH * 0.46
  const camX    = (WORLD_W / 2) - st.x
  const camY    = centerY - st.y

  return (
    <div className={'cine' + (finishing ? ' cine--out' : '')}>
      <div className="cine-stage" style={{ '--stageH': stageH + 'px' }}>

        <div className="world" style={{ transform: `translate(${camX}px, ${camY}px)` }}>

          {/* camino tenue por venir */}
          <svg className="track track--ghost" width={WORLD_W} height={WORLD_H}
            viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} fill="none">
            <path d={PATH_D} stroke="rgba(201,161,74,.16)" strokeWidth="1.5"
              strokeDasharray="2 7" strokeLinecap="round" />
          </svg>

          {/* postales ancladas al camino */}
          {MILESTONES.map((m, i) => {
            const li = g ? g.lens[i + 1] : 0
            const op = g
              ? smoothstep(li - 320, li - 90, st.len) * (1 - smoothstep(li + 300, li + 640, st.len))
              : 0
            const sc = 0.92 + 0.08 * (g ? smoothstep(li - 300, li - 40, st.len) : 0)
            const a  = ANCH[i + 1]
            return (
              <div key={i} className={'mst mst--' + m.side}
                style={{ left: a[0], top: a[1], opacity: op, transform: `translate(-50%,-50%) scale(${sc})` }}>
                <div className="mst-card" style={{ transform: `rotate(${m.side === 'r' ? 2.5 : -2.5}deg)` }}>
                  {m.photo
                    ? <div className="mst-photo" style={{ backgroundImage: `url(${m.photo})`, backgroundPosition: m.focus || 'center' }} />
                    : <PlaceholderBg />}
                  <div className="mst-card-veil" />
                </div>
                <div className="mst-year">{m.year}</div>
                {m.line && <div className="mst-cap">{m.line}</div>}
              </div>
            )
          })}

          {/* estela dorada que se va dibujando */}
          <svg className="track track--draw" width={WORLD_W} height={WORLD_H}
            viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} fill="none">
            <defs>
              <linearGradient id="goldTrail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(201,161,74,.15)" />
                <stop offset="1" stopColor="#c9a14a" />
              </linearGradient>
              <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path ref={trailRef} d={PATH_D}
              stroke="url(#goldTrail)" strokeWidth="2.4" strokeLinecap="round"
              filter="url(#trailGlow)"
              strokeDasharray={`${st.len} ${total}`} />
          </svg>

          {/* estrella de origen */}
          <span className="origin-star" style={{ left: ANCH[0][0], top: ANCH[0][1] }}>✦</span>

          {/* cometa — punta que avanza */}
          <div className={'comet' + (finishing ? ' comet--fly' : '')} style={{ left: st.x, top: st.y }}>
            <span className="comet-halo" />
            <span className="comet-core">✦</span>
          </div>
        </div>

        <div className="cine-grain" />
        <IntroSparkles />

        <button className="cine-skip" onClick={skip}>Saltar intro →</button>

        <div className="cine-timeline">
          <div className="tl-rail">
            <div className="tl-fill" style={{ width: progress * 100 + '%' }} />
          </div>
          <div className="tl-years">
            <span>{MILESTONES[0].year}</span>
            <span>{MILESTONES[MILESTONES.length - 1].year}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
