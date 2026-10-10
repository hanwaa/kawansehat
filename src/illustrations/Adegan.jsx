import { useId } from 'react'
import './ilustrasi.css'

// Adegan flat untuk beranda dewasa/lansia: puskesmas yang ramah difabel.
export function AdeganPuskesmas({ className = '' }) {
  const klip = useId()
  return (
    <svg viewBox="0 0 480 300" className={`il ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={klip}>
          <rect x="0" y="0" width="480" height="300" rx="24" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${klip})`}>
      <rect x="0" y="0" width="480" height="300" rx="24" className="il-utama-lembut" />
      <circle cx="400" cy="64" r="28" className="il-aksen" opacity="0.8" />
      <path d="M40 80 q 20 -24 44 -8 q 22 -14 36 8 z" className="il-permukaan" opacity="0.9" />
      <rect x="0" y="246" width="480" height="54" className="il-hias4" />
      {/* Pohon */}
      <rect x="78" y="190" width="14" height="60" rx="5" fill="#7a5233" />
      <circle cx="85" cy="176" r="40" className="il-hias1" />
      <circle cx="62" cy="196" r="22" className="il-hias1" />
      {/* Gedung */}
      <rect x="150" y="116" width="230" height="134" rx="6" className="il-permukaan il-garis" strokeWidth="3" />
      <path d="M136 120 L 265 62 L 394 120 Z" className="il-utama" />
      <rect x="253" y="80" width="24" height="24" rx="6" className="il-aksen" />
      <path d="M265 85 v14 M258 92 h14" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <rect x="196" y="128" width="138" height="26" rx="5" className="il-utama" />
      <g fill="#fff">
        <rect x="214" y="138" width="34" height="5" rx="2.5" />
        <rect x="256" y="138" width="22" height="5" rx="2.5" />
        <rect x="286" y="138" width="30" height="5" rx="2.5" />
      </g>
      <rect x="168" y="168" width="40" height="34" rx="4" className="il-utama-lembut il-garis" strokeWidth="2.5" />
      <rect x="322" y="168" width="40" height="34" rx="4" className="il-utama-lembut il-garis" strokeWidth="2.5" />
      <rect x="244" y="176" width="44" height="74" rx="4" className="il-aksen-lembut il-garis" strokeWidth="2.5" />
      {/* Ram untuk kursi roda */}
      <path d="M288 250 L 288 240 L 372 250 Z" className="il-latar2 il-garis" strokeWidth="2" />
      <path d="M292 228 L 372 238" className="il-garis" strokeWidth="3" strokeLinecap="round" />
      {/* Pengguna kursi roda */}
      <circle cx="414" cy="236" r="20" fill="none" stroke="#2b2b2b" strokeWidth="5" />
      <circle cx="414" cy="236" r="3" fill="#2b2b2b" />
      <path d="M396 214 h26 v-30" stroke="#2b2b2b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M402 212 h28 l 6 22" stroke="#0a64b4" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M408 210 v-28" stroke="#0a64b4" strokeWidth="14" strokeLinecap="round" />
      <circle cx="408" cy="168" r="12" fill="#a86b45" />
      <path d="M396 166 c 0 -14 22 -16 24 -2 c -8 -4 -16 -4 -24 2 z" fill="#2b2422" />
      {/* Ibu berhijab menggandeng anak */}
      <path d="M200 250 L 206 200 C 208 188, 228 188, 230 200 L 236 250 Z" fill="#1f6f4a" />
      <circle cx="218" cy="180" r="13" fill="#a86b45" />
      <path d="M203 182 c -2 -22 32 -22 30 0 c 2 12 -6 18 -15 20 c -9 -2 -17 -8 -15 -20 z" fill="#e0a526" />
      <circle cx="218" cy="182" r="9" fill="#a86b45" />
      <path d="M232 214 L 246 222" stroke="#a86b45" strokeWidth="6" strokeLinecap="round" />
      <path d="M244 250 L 246 226 C 248 216, 262 216, 264 226 L 266 250 Z" fill="#ffb03a" />
      <circle cx="255" cy="208" r="10" fill="#e0a77f" />
      <path d="M245 206 c 0 -14 20 -14 20 0 c -6 -5 -14 -5 -20 0 z" fill="#2b2422" />
      </g>
    </svg>
  )
}

// Nyamuk kartun untuk cerita anak tentang DBD.
export function NyamukNakal({ className = '' }) {
  return (
    <svg viewBox="0 0 240 180" className={`il ${className}`} aria-hidden="true" focusable="false">
      <ellipse cx="96" cy="58" rx="40" ry="18" fill="#bfe3ff" opacity="0.9" transform="rotate(-24 96 58)" />
      <ellipse cx="146" cy="56" rx="40" ry="18" fill="#bfe3ff" opacity="0.9" transform="rotate(20 146 56)" />
      <g stroke="#2b2b2b" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M110 112 L 80 150 L 64 168" />
        <path d="M122 116 L 116 156 L 108 176" />
        <path d="M134 112 L 160 150 L 180 166" />
      </g>
      <g stroke="#fff" strokeWidth="4" strokeLinecap="round">
        <path d="M84 145 l 6 4 M72 160 l 6 4 M117 148 l 6 2 M112 166 l 6 2 M156 145 l -6 4 M170 158 l -6 4" />
      </g>
      <ellipse cx="122" cy="100" rx="30" ry="22" fill="#2b2b2b" />
      <path d="M100 92 h44 M98 104 h48" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="166" cy="84" r="22" fill="#3a3a3a" />
      <circle cx="160" cy="80" r="9" fill="#fff" />
      <circle cx="176" cy="80" r="9" fill="#fff" />
      <circle cx="162" cy="82" r="4" fill="#1c2420" />
      <circle cx="178" cy="82" r="4" fill="#1c2420" />
      <path d="M154 70 l 12 6 M186 70 l -12 6" stroke="#1c2420" strokeWidth="3" strokeLinecap="round" />
      <path d="M186 94 L 222 116" stroke="#2b2b2b" strokeWidth="4" strokeLinecap="round" />
      <path d="M160 96 q 8 6 14 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="160" rx="44" ry="10" fill="#4fb3ff" opacity="0.45" />
    </svg>
  )
}

const ikonPanel = (isi) =>
  function IkonPanel({ className = '' }) {
    return (
      <svg viewBox="0 0 120 100" className={`il ${className}`} aria-hidden="true" focusable="false">
        <rect x="0" y="0" width="120" height="100" rx="18" className="il-aksen-lembut" />
        {isi}
      </svg>
    )
  }

export const IkonKuras = ikonPanel(
  <>
    <path d="M30 40 h50 l -6 44 h-38 z" className="il-utama" />
    <path d="M30 40 h50" stroke="#1c2420" strokeWidth="3" />
    <path d="M86 46 q 14 6 12 22" stroke="#4fb3ff" strokeWidth="6" fill="none" strokeLinecap="round" />
    <circle cx="98" cy="78" r="4" fill="#4fb3ff" />
    <circle cx="92" cy="88" r="3" fill="#4fb3ff" />
    <path d="M40 58 h30 M42 70 h26" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
  </>,
)

export const IkonTutup = ikonPanel(
  <>
    <path d="M32 46 h56 l -6 40 h-44 z" className="il-utama" />
    <rect x="26" y="34" width="68" height="12" rx="6" className="il-aksen" stroke="#1c2420" strokeWidth="2.5" />
    <rect x="52" y="26" width="16" height="10" rx="4" className="il-aksen" stroke="#1c2420" strokeWidth="2.5" />
    <path d="M48 64 l 8 8 16 -16" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>,
)

export const IkonDaurUlang = ikonPanel(
  <>
    <rect x="46" y="30" width="22" height="50" rx="8" fill="#4fb3ff" opacity="0.8" />
    <rect x="51" y="22" width="12" height="10" rx="3" className="il-utama" />
    <g stroke="#1f6f4a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M84 40 a 26 26 0 0 1 4 30" />
      <path d="M90 64 l -2 8 -8 -2" />
      <path d="M30 70 a 26 26 0 0 1 -2 -30" />
      <path d="M24 46 l 4 -7 7 3" />
    </g>
  </>,
)

// Placeholder video BISINDO: jelas berlabel contoh, bukan video asli.
export function IsyaratContoh({ className = '' }) {
  return (
    <svg viewBox="0 0 160 120" className={`il ${className}`} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="160" height="120" rx="14" fill="#1c2420" />
      <path d="M40 120 C 44 92, 60 84, 80 84 C 100 84, 116 92, 120 120 Z" fill="#2f8f5b" />
      <circle cx="80" cy="58" r="18" fill="#c98b5f" />
      <path d="M62 54 c 0 -24 36 -24 36 0 c -10 -8 -26 -8 -36 0 z" fill="#2b2422" />
      <path d="M58 92 L 44 62" stroke="#c98b5f" strokeWidth="9" strokeLinecap="round" />
      <path d="M102 92 L 116 64" stroke="#c98b5f" strokeWidth="9" strokeLinecap="round" />
      <circle cx="43" cy="56" r="8" fill="#c98b5f" />
      <circle cx="117" cy="58" r="8" fill="#c98b5f" />
      <path d="M36 44 q -6 -6 0 -12 M124 46 q 6 -6 0 -12" stroke="#e0a526" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Stiker dekoratif remaja (neo-brutalism).
export function StikerBintang({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={`il ${className}`} aria-hidden="true" focusable="false">
      <path
        d="M40 4 L 49 28 L 75 30 L 54 46 L 62 72 L 40 57 L 18 72 L 26 46 L 5 30 L 31 28 Z"
        className="il-hias3"
        stroke="#17132b"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StikerPetir({ className = '' }) {
  return (
    <svg viewBox="0 0 60 80" className={`il ${className}`} aria-hidden="true" focusable="false">
      <path d="M34 2 L 6 46 h 20 L 20 78 L 54 30 H 33 Z" className="il-hias1" stroke="#17132b" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}
