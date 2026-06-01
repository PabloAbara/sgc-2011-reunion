export default function Sparkles() {
  const sp = [
    { t: '1%',  l: '9%',  g: '✦', s: 1    },
    { t: '9%',  l: '87%', g: '✧', s: .7   },
    { t: '29%', l: '3%',  g: '✦', s: .8   },
    { t: '24%', l: '93%', g: '✦', s: 1.1  },
    { t: '53%', l: '8%',  g: '✧', s: .6   },
    { t: '47%', l: '91%', g: '✦', s: .85  },
    { t: '71%', l: '15%', g: '✦', s: .7   },
    { t: '77%', l: '85%', g: '✧', s: .95  },
  ]
  const dt = [
    { t: '15%', l: '24%' },
    { t: '38%', l: '89%' },
    { t: '66%', l: '21%' },
    { t: '7%',  l: '62%' },
    { t: '87%', l: '58%', c: true },
  ]
  return (
    <>
      {sp.map((x, i) => (
        <span key={'s' + i}
          className={'spark' + (i % 3 === 0 ? ' cream' : '')}
          style={{ top: x.t, left: x.l, fontSize: 22 * x.s + 'px', animationDelay: i * .35 + 's' }}>
          {x.g}
        </span>
      ))}
      {dt.map((x, i) => (
        <span key={'d' + i}
          className={'dot' + (x.c ? ' cream' : '')}
          style={{ top: x.t, left: x.l, width: '6px', height: '6px', animationDelay: i * .5 + 's' }} />
      ))}
    </>
  )
}
