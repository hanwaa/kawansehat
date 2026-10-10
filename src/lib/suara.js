// Pembacaan teks dengan Web Speech API (bahasa Indonesia).

export function suaraDidukung() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

let suaraIndonesia = null

function cariSuara() {
  const semua = window.speechSynthesis.getVoices()
  suaraIndonesia = semua.find((v) => v.lang === 'id-ID') ?? semua.find((v) => v.lang?.toLowerCase().startsWith('id')) ?? null
  return suaraIndonesia
}

export function adaSuaraIndonesia() {
  if (!suaraDidukung()) return false
  return Boolean(suaraIndonesia ?? cariSuara())
}

if (suaraDidukung()) {
  cariSuara()
  window.speechSynthesis.addEventListener?.('voiceschanged', cariSuara)
}

export function hentikan() {
  if (suaraDidukung()) window.speechSynthesis.cancel()
}

/**
 * Membacakan daftar potongan teks satu per satu.
 * onMulai(i) / onSelesai() dipakai untuk menyorot paragraf yang sedang dibaca.
 */
export function bacakan(potongan, { kecepatan = 1, onMulai, onSelesai } = {}) {
  if (!suaraDidukung()) return false
  const daftar = (Array.isArray(potongan) ? potongan : [potongan]).filter((t) => t && t.trim())
  window.speechSynthesis.cancel()
  const suara = suaraIndonesia ?? cariSuara()
  daftar.forEach((teks, i) => {
    const u = new SpeechSynthesisUtterance(teks)
    u.lang = 'id-ID'
    if (suara) u.voice = suara
    u.rate = kecepatan
    u.onstart = () => onMulai?.(i)
    if (i === daftar.length - 1) {
      u.onend = () => onSelesai?.()
      u.onerror = () => onSelesai?.()
    }
    window.speechSynthesis.speak(u)
  })
  return true
}
