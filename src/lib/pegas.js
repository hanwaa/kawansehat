// Pegas untuk gerak yang bisa disela (lembar yang ditarik, dilepas, ditangkap lagi).
// Parameternya mengikuti cara Apple, bukan massa/kekakuan/redaman fisika:
// - redaman: 1 = kritis (mengendap tanpa memantul); < 1 = sedikit memantul. Pantulan hanya dipakai bila gerakan
//   jari memang membawa momentum.
// - respons: seberapa cepat (detik) nilai mencapai target. Ini bukan durasi; pegas tidak punya durasi tetap.
// Dihitung dengan rumus tertutup, jadi posisi dan kecepatan pada waktu t bisa dibaca kapan saja. Saat gerak disela,
// gerak baru dimulai dari posisi dan kecepatan saat itu tanpa lompatan.

/**
 * @param {{ dari: number, ke: number, kecepatan?: number, redaman?: number, respons?: number }} opsi
 *   kecepatan dalam satuan/detik (px/s), respons dalam detik.
 * @returns {{ posisi(t: number): number, kecepatan(t: number): number, diam(t: number): boolean }}
 */
export function buatPegas({ dari, ke, kecepatan = 0, redaman = 1, respons = 0.3 }) {
  const w0 = (2 * Math.PI) / respons
  const d0 = dari - ke
  const v0 = kecepatan

  let posisi
  let laju
  if (redaman >= 1) {
    // Redaman kritis: x(t) = e^(−ω₀t)·(d₀ + B·t), B = v₀ + ω₀d₀
    const B = v0 + w0 * d0
    posisi = (t) => ke + Math.exp(-w0 * t) * (d0 + B * t)
    laju = (t) => Math.exp(-w0 * t) * (B - w0 * (d0 + B * t))
  } else {
    // Kurang redam: x(t) = e^(−ζω₀t)·(d₀·cos ω_d t + C·sin ω_d t), C = (v₀ + ζω₀d₀)/ω_d
    const z = redaman
    const wd = w0 * Math.sqrt(1 - z * z)
    const C = (v0 + z * w0 * d0) / wd
    posisi = (t) => ke + Math.exp(-z * w0 * t) * (d0 * Math.cos(wd * t) + C * Math.sin(wd * t))
    laju = (t) =>
      Math.exp(-z * w0 * t) * ((C * wd - z * w0 * d0) * Math.cos(wd * t) - (d0 * wd + z * w0 * C) * Math.sin(wd * t))
  }

  return {
    posisi,
    kecepatan: laju,
    diam: (t) => Math.abs(posisi(t) - ke) < 0.5 && Math.abs(laju(t)) < 10,
  }
}

/**
 * Ke mana gerakan akan berhenti bila dibiarkan meluncur, seperti gulir yang melambat (fungsi proyeksi Apple).
 * Dipakai untuk memilih tujuan dari arah dan kuatnya kibasan, bukan dari posisi saat jari dilepas.
 * @param {number} kecepatan px/s
 * @param {number} [laju] 0.998 = gulir biasa, 0.99 = lebih cepat berhenti
 */
export function proyeksi(kecepatan, laju = 0.998) {
  return ((kecepatan / 1000) * laju) / (1 - laju)
}

/**
 * Tahanan karet di batas: makin jauh ditarik melewati batas, makin sedikit elemen ikut bergerak, dan tidak pernah
 * melewati `dimensi`.
 * @param {number} lewat jarak tarikan melewati batas (≥ 0)
 * @param {number} dimensi jarak maksimum yang bisa dicapai
 */
export function karet(lewat, dimensi, konstanta = 0.55) {
  return (lewat * dimensi * konstanta) / (dimensi + konstanta * Math.abs(lewat))
}
