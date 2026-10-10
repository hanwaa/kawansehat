// Elemen yang ditunjuk sebuah langkah tur: [data-tour="nama"] yang benar-benar tampil di layar.
export function cariTarget(nama) {
  const el = document.querySelector(`[data-tour="${nama}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 ? el : null
}
