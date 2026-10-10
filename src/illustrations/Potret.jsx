import { useId } from 'react'
import './ilustrasi.css'

// Potret empat profil untuk layar pembuka. Semua digambar sendiri (SVG flat).
const KULIT = { a: '#c98b5f', b: '#a86b45', c: '#e0a77f', d: '#8d5a3b' }

function Bingkai({ latar, children, label }) {
  const id = useId()
  return (
    <svg viewBox="0 0 160 160" className="il" role="img" aria-label={label} focusable="false">
      <defs>
        <clipPath id={id}>
          <circle cx="80" cy="80" r="76" />
        </clipPath>
      </defs>
      <circle cx="80" cy="80" r="76" fill={latar} />
      <g clipPath={`url(#${id})`}>{children}</g>
    </svg>
  )
}

function Wajah() {
  return (
    <>
      <circle cx="70" cy="74" r="3.2" fill="#1c2420" />
      <circle cx="90" cy="74" r="3.2" fill="#1c2420" />
      <ellipse cx="63" cy="84" rx="5" ry="3" fill="#f08f7a" opacity="0.55" />
      <ellipse cx="97" cy="84" rx="5" ry="3" fill="#f08f7a" opacity="0.55" />
      <ellipse cx="80" cy="80" rx="2.5" ry="2" fill="#000" opacity="0.15" />
      <path d="M71 86 Q80 94 89 86" stroke="#5a2a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
}

export function PotretAnak() {
  const k = KULIT.c
  return (
    <Bingkai latar="#cdebff" label="Ilustrasi anak laki-laki tersenyum memakai tas sekolah">
      <path d="M26 170 C 30 126, 54 112, 80 112 C 106 112, 130 126, 134 170 Z" fill="#ffb03a" />
      <path d="M58 116 L 52 170 M102 116 L 108 170" stroke="#0a64b4" strokeWidth="8" strokeLinecap="round" />
      <rect x="72" y="92" width="16" height="22" rx="6" fill={k} />
      <ellipse cx="80" cy="72" rx="27" ry="28" fill={k} />
      <ellipse cx="53" cy="76" rx="5" ry="7" fill={k} />
      <ellipse cx="107" cy="76" rx="5" ry="7" fill={k} />
      <path d="M53 66 C 52 44, 70 38, 82 40 C 98 40, 110 50, 107 66 C 100 56, 92 52, 84 56 C 76 50, 62 56, 53 66 Z" fill="#2b2422" />
      <Wajah />
    </Bingkai>
  )
}

export function PotretRemaja() {
  const k = KULIT.a
  return (
    <Bingkai latar="#e6ddff" label="Ilustrasi remaja dengan headphone di leher dan alat bantu dengar">
      <path d="M26 170 C 30 126, 54 112, 80 112 C 106 112, 130 126, 134 170 Z" fill="#5b2bc4" />
      <path d="M66 116 L 80 132 L 94 116" stroke="#16c2b0" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <rect x="72" y="92" width="16" height="22" rx="6" fill={k} />
      <path d="M54 112 C 50 96, 110 96, 106 112" stroke="#17132b" strokeWidth="5" fill="none" />
      <rect x="46" y="104" width="12" height="16" rx="5" fill="#17132b" />
      <rect x="102" y="104" width="12" height="16" rx="5" fill="#17132b" />
      <ellipse cx="80" cy="72" rx="26" ry="28" fill={k} />
      <ellipse cx="54" cy="76" rx="5" ry="7" fill={k} />
      <ellipse cx="106" cy="76" rx="5" ry="7" fill={k} />
      <path d="M50 74 C 46 70, 47 64, 51 62" stroke="#f2c7a5" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M54 62 C 50 36, 78 34, 90 38 C 104 42, 112 52, 106 64 C 96 52, 74 58, 60 52 C 58 56, 56 60, 54 62 Z" fill="#2b2422" />
      <Wajah />
    </Bingkai>
  )
}

export function PotretDewasa() {
  const k = KULIT.b
  return (
    <Bingkai latar="#dcefe3" label="Ilustrasi perempuan dewasa berhijab tersenyum">
      <path d="M22 170 C 28 124, 52 108, 80 108 C 108 108, 132 124, 138 170 Z" fill="#1f6f4a" />
      <path d="M48 80 C 46 46, 64 36, 80 36 C 96 36, 114 46, 112 80 C 114 104, 100 118, 80 122 C 60 118, 46 104, 48 80 Z" fill="#e0a526" />
      <path d="M56 98 C 64 112, 96 112, 104 98 L 106 118 C 96 124, 64 124, 54 118 Z" fill="#c98f1a" />
      <ellipse cx="80" cy="76" rx="21" ry="24" fill={k} />
      <Wajah />
    </Bingkai>
  )
}

export function PotretLansia() {
  const k = KULIT.d
  return (
    <Bingkai latar="#fcefc7" label="Ilustrasi kakek berpeci dan berkacamata tersenyum">
      <path d="M24 170 C 30 126, 54 110, 80 110 C 106 110, 130 126, 136 170 Z" fill="#7a4a2a" />
      <g fill="#e0a526">
        <path d="M44 132 l6 -6 6 6 -6 6 Z M68 126 l6 -6 6 6 -6 6 Z M92 126 l6 -6 6 6 -6 6 Z M114 134 l6 -6 6 6 -6 6 Z M56 150 l6 -6 6 6 -6 6 Z M80 146 l6 -6 6 6 -6 6 Z M104 152 l6 -6 6 6 -6 6 Z" />
      </g>
      <rect x="72" y="92" width="16" height="22" rx="6" fill={k} />
      <ellipse cx="80" cy="74" rx="26" ry="28" fill={k} />
      <ellipse cx="54" cy="78" rx="5" ry="7" fill={k} />
      <ellipse cx="106" cy="78" rx="5" ry="7" fill={k} />
      <path d="M54 70 C 52 80, 56 86, 58 88 M106 70 C 108 80, 104 86, 102 88" stroke="#eeeeee" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M55 58 L 57 40 C 70 35, 90 35, 103 40 L 105 58 Z" fill="#1c1c1c" />
      <circle cx="70" cy="74" r="8" fill="none" stroke="#2b2422" strokeWidth="2.5" />
      <circle cx="90" cy="74" r="8" fill="none" stroke="#2b2422" strokeWidth="2.5" />
      <path d="M78 74 h4" stroke="#2b2422" strokeWidth="2.5" />
      <circle cx="70" cy="74" r="2.6" fill="#1c2420" />
      <circle cx="90" cy="74" r="2.6" fill="#1c2420" />
      <path d="M68 88 C 74 84, 86 84, 92 88 C 86 90, 74 90, 68 88 Z" fill="#eeeeee" />
      <path d="M72 94 Q80 99 88 94" stroke="#5a2a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Bingkai>
  )
}

export const POTRET = {
  anak: PotretAnak,
  remaja: PotretRemaja,
  dewasa: PotretDewasa,
  lansia: PotretLansia,
}
