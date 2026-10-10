// Ikon makanan sederhana untuk game "Susun Isi Piringku" (digambar sendiri).
const ISI = {
  nasi: (
    <>
      <path d="M10 34 h44 c 0 14 -10 22 -22 22 s -22 -8 -22 -22 z" fill="#4fb3ff" />
      <path d="M14 34 c 0 -12 8 -18 18 -18 s 18 6 18 18 z" fill="#fff" stroke="#d7d2c6" strokeWidth="2" />
      <path d="M24 26 h3 M33 22 h3 M38 29 h3 M28 31 h3" stroke="#d7d2c6" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  jagung: (
    <>
      <path d="M32 6 c 10 0 14 14 14 28 s -6 24 -14 24 s -14 -10 -14 -24 s 4 -28 14 -28 z" fill="#ffc93c" />
      <path d="M26 16 h12 M24 26 h16 M24 36 h16 M26 46 h12" stroke="#e0a526" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 34 c -6 10 0 22 14 24 c -8 -6 -12 -14 -14 -24 z M46 34 c 6 10 0 22 -14 24 c 8 -6 12 -14 14 -24 z" fill="#3dba6f" />
    </>
  ),
  ubi: (
    <>
      <path d="M8 38 c 0 -16 18 -24 32 -20 s 18 16 12 26 s -22 14 -32 10 s -12 -10 -12 -16 z" fill="#a0522d" />
      <path d="M22 30 q 4 2 2 6 M36 26 q 4 2 2 6 M40 40 q 4 2 2 6" stroke="#6b3418" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  tempe: (
    <>
      <rect x="10" y="18" width="44" height="30" rx="5" fill="#e8c98a" stroke="#b8924e" strokeWidth="2" />
      <g fill="#fff6dc">
        <circle cx="20" cy="27" r="3" />
        <circle cx="30" cy="35" r="3" />
        <circle cx="42" cy="26" r="3" />
        <circle cx="46" cy="39" r="3" />
        <circle cx="22" cy="40" r="3" />
        <circle cx="34" cy="24" r="2.5" />
      </g>
    </>
  ),
  telur: (
    <>
      <path d="M8 36 c 0 -12 10 -20 20 -18 c 8 -8 26 -4 28 8 c 4 12 -4 24 -18 24 c -12 4 -30 0 -30 -14 z" fill="#fff" stroke="#d7d2c6" strokeWidth="2" />
      <circle cx="32" cy="34" r="10" fill="#ffb03a" />
      <circle cx="29" cy="31" r="3" fill="#ffd27a" />
    </>
  ),
  ikan: (
    <>
      <path d="M6 32 c 10 -14 30 -16 42 0 c -12 16 -32 14 -42 0 z" fill="#4f86c6" />
      <path d="M46 32 l 12 -10 v 20 z" fill="#3b6ea8" />
      <circle cx="16" cy="29" r="3" fill="#fff" />
      <circle cx="16" cy="29" r="1.5" fill="#1c2420" />
      <path d="M26 24 q 4 8 0 16 M34 24 q 4 8 0 16" stroke="#9cc3ec" strokeWidth="2" fill="none" />
    </>
  ),
  tahu: (
    <>
      <path d="M12 26 l 20 -10 l 20 10 l -20 10 z" fill="#fff3c4" stroke="#d9c37a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 26 v 20 l 20 10 v -20 z" fill="#f5df90" stroke="#d9c37a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M52 26 v 20 l -20 10 v -20 z" fill="#ead07a" stroke="#d9c37a" strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  bayam: (
    <>
      <path d="M32 58 V 30" stroke="#2e8a57" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 34 c -18 -2 -24 -18 -18 -28 c 12 2 20 14 18 28 z" fill="#3dba6f" />
      <path d="M32 38 c 18 -2 24 -18 18 -28 c -12 2 -20 14 -18 28 z" fill="#2e8a57" />
      <path d="M32 46 c -14 0 -22 -8 -20 -16 c 10 0 18 6 20 16 z" fill="#4cb97a" />
    </>
  ),
  wortel: (
    <>
      <path d="M22 18 l 24 4 c -4 14 -14 30 -28 38 c 2 -14 2 -28 4 -42 z" fill="#ff8a3d" />
      <path d="M26 26 l 8 2 M24 36 l 8 2 M22 46 l 6 2" stroke="#d96a1f" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 20 c -2 -10 4 -16 10 -16 c 0 8 -4 14 -10 16 z M30 19 c -8 -6 -8 -14 -4 -16 c 4 4 6 10 4 16 z" fill="#3dba6f" />
    </>
  ),
  brokoli: (
    <>
      <path d="M28 58 l 2 -18 h 6 l 2 18 z" fill="#8bc58f" />
      <circle cx="22" cy="30" r="11" fill="#2e8a57" />
      <circle cx="42" cy="30" r="11" fill="#2e8a57" />
      <circle cx="32" cy="20" r="12" fill="#3dba6f" />
      <circle cx="32" cy="34" r="9" fill="#3dba6f" />
    </>
  ),
  pisang: (
    <>
      <path d="M10 22 c 4 24 28 34 46 24 c -4 -2 -6 -4 -6 -6 c -16 6 -30 -2 -34 -20 z" fill="#ffd23f" stroke="#c99a00" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 22 l -2 -6 l 6 2 z" fill="#6b4a00" />
    </>
  ),
  jeruk: (
    <>
      <circle cx="32" cy="36" r="20" fill="#ff9f1c" />
      <circle cx="26" cy="30" r="4" fill="#ffc46b" />
      <path d="M32 16 c 0 -6 4 -10 10 -10 c 0 6 -4 10 -10 10 z" fill="#3dba6f" />
    </>
  ),
  pepaya: (
    <>
      <path d="M6 30 c 0 16 12 26 26 26 s 26 -10 26 -26 z" fill="#ff8a3d" />
      <path d="M6 30 h 52" stroke="#3dba6f" strokeWidth="4" strokeLinecap="round" />
      <path d="M14 34 c 0 10 8 16 18 16 s 18 -6 18 -16 z" fill="#ffad6b" />
      <g fill="#2b2422">
        <circle cx="24" cy="38" r="2" />
        <circle cx="30" cy="42" r="2" />
        <circle cx="36" cy="38" r="2" />
        <circle cx="42" cy="41" r="2" />
      </g>
    </>
  ),
}

export const IKON_MAKANAN = Object.keys(ISI)

export default function IkonMakanan({ nama, ukuran = 56 }) {
  return (
    <svg viewBox="0 0 64 64" width={ukuran} height={ukuran} aria-hidden="true" focusable="false">
      {ISI[nama]}
    </svg>
  )
}
