// Diagram Isi Piringku (Kemenkes): setengah piring sayur + buah, setengah piring makanan pokok + lauk pauk.
export const SEKTOR_PIRING = [
  { id: 'sayur', mulai: -90, akhir: 30, warna: '#7cc68d' },
  { id: 'buah', mulai: 30, akhir: 90, warna: '#ffae7a' },
  { id: 'pokok', mulai: 90, akhir: 210, warna: '#f5d58a' },
  { id: 'lauk', mulai: 210, akhir: 270, warna: '#e8a87c' },
]

const rad = (d) => (d * Math.PI) / 180

export function titikSektor(id, r = 60, cx = 100, cy = 100) {
  const s = SEKTOR_PIRING.find((x) => x.id === id)
  const tengah = rad((s.mulai + s.akhir) / 2)
  return { x: cx + r * Math.cos(tengah), y: cy + r * Math.sin(tengah) }
}

function busur(cx, cy, r, mulai, akhir) {
  const x1 = cx + r * Math.cos(rad(mulai))
  const y1 = cy + r * Math.sin(rad(mulai))
  const x2 = cx + r * Math.cos(rad(akhir))
  const y2 = cy + r * Math.sin(rad(akhir))
  const besar = akhir - mulai > 180 ? 1 : 0
  return `M${cx} ${cy} L${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${besar} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
}

export default function PiringDiagram({ terisi, children, className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="98" fill="#ffffff" stroke="#1c2420" strokeWidth="3" />
      <circle cx="100" cy="100" r="90" fill="#f4f1ea" />
      {SEKTOR_PIRING.map((s) => (
        <path
          key={s.id}
          d={busur(100, 100, 86, s.mulai, s.akhir)}
          fill={s.warna}
          opacity={terisi && !terisi[s.id] ? 0.35 : 1}
          stroke="#ffffff"
          strokeWidth="3"
        />
      ))}
      {children}
    </svg>
  )
}
