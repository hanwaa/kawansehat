// Pembacaan teks dengan Web Speech API (bahasa Indonesia).

export function suaraDidukung() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

// Karakter suara per profil. Browser tidak menyediakan suara anak atau remaja berbahasa Indonesia,
// jadi karakternya dibentuk dari nada (pitch, 0–2) dan kecepatan di atas suara Indonesia yang ada.
// Anak dan remaja mengutamakan suara perempuan karena nadanya paling mendekati suara anak saat dinaikkan.
export const KARAKTER_SUARA = {
  anak: { nada: 1.45, kecepatan: 1, utamakan: 'perempuan' },
  remaja: { nada: 1.2, kecepatan: 1.05, utamakan: 'perempuan' },
  dewasa: { nada: 1, kecepatan: 1 },
  lansia: { nada: 1, kecepatan: 0.9 },
}

// Nama suara Indonesia perempuan yang umum: Gadis (Edge/Windows), Damayanti (Apple),
// dan "Google Bahasa Indonesia" (Chrome) yang juga bersuara perempuan.
const SUARA_PEREMPUAN = /gadis|damayanti|google|female|perempuan|wanita/i

// Sebagian Android masih melaporkan kode lama "in" untuk bahasa Indonesia.
const KODE_INDONESIA = /^(id|in)([-_]|$)/i

/** Memilih suara Indonesia yang paling cocok untuk profil dari daftar `speechSynthesis.getVoices()`. */
export function pilihSuara(semua, profil) {
  const indonesia = [
    ...semua.filter((v) => v.lang === 'id-ID'),
    ...semua.filter((v) => v.lang !== 'id-ID' && KODE_INDONESIA.test(v.lang ?? '')),
  ]
  if (KARAKTER_SUARA[profil]?.utamakan === 'perempuan') {
    const perempuan = indonesia.find((v) => SUARA_PEREMPUAN.test(v.name ?? ''))
    if (perempuan) return perempuan
  }
  return indonesia[0] ?? null
}

let daftarSuara = []

function muatSuara() {
  daftarSuara = window.speechSynthesis.getVoices()
  return daftarSuara
}

// Chrome mengisi daftar suara secara asinkron, jadi daftar kosong dimuat ulang saat dibutuhkan.
function suaraTersedia() {
  return daftarSuara.length ? daftarSuara : muatSuara()
}

export function adaSuaraIndonesia() {
  if (!suaraDidukung()) return false
  return Boolean(pilihSuara(suaraTersedia()))
}

if (suaraDidukung()) {
  muatSuara()
  window.speechSynthesis.addEventListener?.('voiceschanged', muatSuara)
}

export function hentikan() {
  if (suaraDidukung()) window.speechSynthesis.cancel()
}

/**
 * Membacakan daftar potongan teks satu per satu dengan karakter suara sesuai `profil`.
 * onMulai(i) / onSelesai() dipakai untuk menyorot paragraf yang sedang dibaca.
 */
export function bacakan(potongan, { profil, onMulai, onSelesai } = {}) {
  if (!suaraDidukung()) return false
  const daftar = (Array.isArray(potongan) ? potongan : [potongan]).filter((t) => t && t.trim())
  window.speechSynthesis.cancel()
  const karakter = KARAKTER_SUARA[profil] ?? KARAKTER_SUARA.dewasa
  const suara = pilihSuara(suaraTersedia(), profil)
  daftar.forEach((teks, i) => {
    const u = new SpeechSynthesisUtterance(teks)
    u.lang = 'id-ID'
    if (suara) u.voice = suara
    u.pitch = karakter.nada
    u.rate = karakter.kecepatan
    u.onstart = () => onMulai?.(i)
    if (i === daftar.length - 1) {
      u.onend = () => onSelesai?.()
      u.onerror = () => onSelesai?.()
    }
    window.speechSynthesis.speak(u)
  })
  return true
}
