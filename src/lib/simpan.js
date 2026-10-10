// Penyimpanan lokal yang aman: tidak pernah melempar galat bila localStorage diblokir.
export function baca(kunci, awal) {
  try {
    const teks = localStorage.getItem(kunci)
    return teks === null ? awal : JSON.parse(teks)
  } catch {
    return awal
  }
}

export function tulis(kunci, nilai) {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai))
    return true
  } catch {
    return false
  }
}
