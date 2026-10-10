import './maskot.css'

// Si Kawal: tunas kecil yang menjaga kesehatan. Pose: lambai | tunjuk | jempol | pikir.
const WARNA = {
  badan: '#2f8f5b',
  tangan: '#287d4f',
  perut: '#c4e8d1',
  kaki: '#21683f',
  daun1: '#4cb97a',
  daun2: '#2e8a57',
  mata: '#1c2420',
  pipi: '#f59e8b',
  lencana: '#e0a526',
}

function Lengan({ pose }) {
  const gaya = { stroke: WARNA.tangan, strokeWidth: 14, strokeLinecap: 'round', fill: 'none' }
  const kiri = <path d="M42 132 C 28 142, 24 154, 28 164" {...gaya} />
  switch (pose) {
    case 'tunjuk':
      return (
        <>
          {kiri}
          <path d="M160 128 C 176 124, 188 118, 196 112" {...gaya} />
          <path d="M196 112 l 10 -6" stroke={WARNA.tangan} strokeWidth="8" strokeLinecap="round" />
        </>
      )
    case 'jempol':
      return (
        <>
          {kiri}
          <path d="M158 134 C 170 132, 178 124, 180 114" {...gaya} />
          <circle cx="180" cy="110" r="10" fill={WARNA.tangan} />
          <path d="M182 104 v -12" stroke={WARNA.tangan} strokeWidth="7" strokeLinecap="round" />
        </>
      )
    case 'pikir':
      return (
        <>
          {kiri}
          <path d="M158 140 C 150 150, 136 150, 128 140" {...gaya} />
          <circle cx="124" cy="136" r="9" fill={WARNA.tangan} />
        </>
      )
    default:
      return (
        <>
          {kiri}
          <path d="M160 122 C 176 110, 182 94, 178 78" {...gaya} />
          <circle cx="178" cy="72" r="10" fill={WARNA.tangan} />
          <g className="maskot__lambai" stroke={WARNA.lencana} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M194 60 q 8 8 2 18" />
            <path d="M162 56 q -8 6 -4 16" />
          </g>
        </>
      )
  }
}

export default function Maskot({ pose = 'lambai', ukuran = 160, label, className = '' }) {
  const mataAtas = pose === 'pikir'
  return (
    <svg
      viewBox="0 0 220 220"
      width={ukuran}
      height={ukuran}
      className={`maskot maskot--${pose} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <ellipse cx="100" cy="208" rx="54" ry="7" fill="rgb(0 0 0 / 0.12)" />
      <g className="maskot__tubuh">
        <path d="M100 52 C 97 38, 98 28, 101 18" stroke={WARNA.daun2} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path className="maskot__garis" d="M100 30 C 84 10, 60 14, 56 24 C 70 34, 88 36, 100 30 Z" fill={WARNA.daun1} />
        <path className="maskot__garis" d="M101 26 C 116 4, 142 6, 146 16 C 132 28, 114 32, 101 26 Z" fill={WARNA.daun2} />
        <ellipse className="maskot__garis" cx="78" cy="198" rx="17" ry="9" fill={WARNA.kaki} />
        <ellipse className="maskot__garis" cx="122" cy="198" rx="17" ry="9" fill={WARNA.kaki} />
        <path
          className="maskot__garis"
          d="M100 48 C 150 48, 172 96, 168 140 C 164 182, 136 200, 100 200 C 64 200, 36 182, 32 140 C 28 96, 50 48, 100 48 Z"
          fill={WARNA.badan}
        />
        <ellipse cx="100" cy="158" rx="40" ry="33" fill={WARNA.perut} />
        <rect x="86" y="144" width="28" height="28" rx="8" fill={WARNA.lencana} />
        <path d="M100 150 v16 M92 158 h16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <g className="maskot__mata">
          <ellipse cx="80" cy="104" rx="9" ry="11" fill={WARNA.mata} />
          <ellipse cx="120" cy="104" rx="9" ry="11" fill={WARNA.mata} />
          <circle cx={mataAtas ? 82 : 83} cy={mataAtas ? 98 : 100} r="3.4" fill="#fff" />
          <circle cx={mataAtas ? 122 : 123} cy={mataAtas ? 98 : 100} r="3.4" fill="#fff" />
        </g>
        <ellipse cx="64" cy="124" rx="8" ry="5" fill={WARNA.pipi} opacity="0.85" />
        <ellipse cx="136" cy="124" rx="8" ry="5" fill={WARNA.pipi} opacity="0.85" />
        {pose === 'pikir' ? (
          <path d="M92 126 q 8 -4 16 0" stroke={WARNA.mata} strokeWidth="4" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M86 120 Q 100 136 114 120 Z" fill={WARNA.mata} stroke={WARNA.mata} strokeWidth="3" strokeLinejoin="round" />
        )}
        <Lengan pose={pose} />
      </g>
    </svg>
  )
}
