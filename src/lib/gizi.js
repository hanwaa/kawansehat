import { AKG, TAMBAHAN } from '../data/akg-2019.js'
import { LMS_IMT_U, UMUR_BULAN_MIN, UMUR_BULAN_MAX } from '../data/who-imt-u.js'

const bulat = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d

// Menerima "65,5" maupun "65.5". Mengembalikan NaN bila bukan angka.
export function bacaAngka(teks) {
  if (typeof teks === 'number') return teks
  const bersih = String(teks ?? '').trim().replace(',', '.')
  if (bersih === '' || !/^\d+(\.\d+)?$/.test(bersih)) return NaN
  return Number(bersih)
}

export function hitungIMT(beratKg, tinggiCm) {
  const m = tinggiCm / 100
  return bulat(beratKg / (m * m), 1)
}

// Kategori IMT dewasa (Pedoman Gizi Seimbang, Permenkes 41/2014).
export const KATEGORI_IMT_DEWASA = {
  'sangat-kurus': { label: 'Sangat kurus', arti: 'Kekurangan berat badan tingkat berat', nada: 'perhatian' },
  kurus: { label: 'Kurus', arti: 'Kekurangan berat badan tingkat ringan', nada: 'perhatian' },
  normal: { label: 'Normal', arti: 'Berat badan sesuai', nada: 'baik' },
  gemuk: { label: 'Gemuk', arti: 'Kelebihan berat badan tingkat ringan', nada: 'perhatian' },
  obesitas: { label: 'Obesitas', arti: 'Kelebihan berat badan tingkat berat', nada: 'perhatian' },
}

export function kategoriIMTDewasa(imt) {
  const v = bulat(imt, 1)
  if (v < 17.0) return 'sangat-kurus'
  if (v < 18.5) return 'kurus'
  if (v <= 25.0) return 'normal'
  if (v <= 27.0) return 'gemuk'
  return 'obesitas'
}

// z-score metode LMS dengan penyesuaian WHO untuk |z| > 3 (berlaku untuk IMT menurut umur).
export function zScoreLMS(y, L, M, S) {
  const sd = (z) => M * Math.pow(1 + L * S * z, 1 / L)
  let z = (Math.pow(y / M, L) - 1) / (L * S)
  if (z > 3) {
    const sd3 = sd(3)
    z = 3 + (y - sd3) / (sd3 - sd(2))
  } else if (z < -3) {
    const sd3n = sd(-3)
    z = -3 + (y - sd3n) / (sd(-2) - sd3n)
  }
  return z
}

// Kategori IMT/U anak 5–18 tahun (Permenkes 2/2020).
export const KATEGORI_IMT_U = {
  'gizi-buruk': { label: 'Gizi buruk', arti: 'Sangat kurus untuk umurnya', nada: 'perhatian' },
  'gizi-kurang': { label: 'Gizi kurang', arti: 'Kurus untuk umurnya', nada: 'perhatian' },
  'gizi-baik': { label: 'Gizi baik', arti: 'Sesuai untuk umurnya', nada: 'baik' },
  'gizi-lebih': { label: 'Gizi lebih', arti: 'Berat berlebih untuk umurnya', nada: 'perhatian' },
  obesitas: { label: 'Obesitas', arti: 'Berat sangat berlebih untuk umurnya', nada: 'perhatian' },
}

export function kategoriIMTU(z) {
  const v = bulat(z, 2)
  if (v < -3) return 'gizi-buruk'
  if (v < -2) return 'gizi-kurang'
  if (v <= 1) return 'gizi-baik'
  if (v <= 2) return 'gizi-lebih'
  return 'obesitas'
}

export function zScoreIMTU(imt, umurBulan, jk) {
  const tabel = LMS_IMT_U[jk]
  if (!tabel) throw new Error(`Jenis kelamin tidak dikenal: ${jk}`)
  if (umurBulan < UMUR_BULAN_MIN || umurBulan > UMUR_BULAN_MAX) return null
  const [L, M, S] = tabel[umurBulan - UMUR_BULAN_MIN]
  return zScoreLMS(imt, L, M, S)
}

// Batas lingkar perut obesitas sentral (Kemenkes): > 90 cm laki-laki, > 80 cm perempuan.
export const BATAS_LINGKAR_PERUT = { laki: 90, perempuan: 80 }

export function obesitasSentral(lingkarCm, jk) {
  return lingkarCm > BATAS_LINGKAR_PERUT[jk]
}

/**
 * Menilai status gizi sesuai umur:
 * - di bawah 5 tahun: arahkan ke KMS/buku KIA (standar balita tidak dihitung di sini),
 * - 5 tahun 1 bulan s.d. 18 tahun 11 bulan: IMT menurut umur (z-score WHO 2007),
 * - 19 tahun ke atas: kategori IMT dewasa.
 */
export function nilaiStatusGizi({ beratKg, tinggiCm, umurTahun, umurBulan = 0, jk, lingkarPerutCm }) {
  const imt = hitungIMT(beratKg, tinggiCm)
  const totalBulan = umurTahun * 12 + umurBulan
  if (totalBulan < UMUR_BULAN_MIN) {
    return { metode: 'balita', imt }
  }
  if (umurTahun < 19) {
    const z = zScoreIMTU(imt, totalBulan, jk)
    return { metode: 'imt-u', imt, z: bulat(z, 2), kategori: kategoriIMTU(z) }
  }
  const hasil = { metode: 'dewasa', imt, kategori: kategoriIMTDewasa(imt) }
  if (lingkarPerutCm) {
    hasil.lingkarPerut = { nilai: lingkarPerutCm, batas: BATAS_LINGKAR_PERUT[jk], berisiko: obesitasSentral(lingkarPerutCm, jk) }
  }
  return hasil
}

// Rentang berat badan normal untuk tinggi tertentu (IMT 18,5–25,0), untuk saran ramah.
export function rentangBeratNormal(tinggiCm) {
  const m2 = (tinggiCm / 100) ** 2
  return { min: bulat(18.5 * m2, 1), max: bulat(25.0 * m2, 1) }
}

export function cariAKG(umurTahun, jk) {
  if (umurTahun < 1) return null
  return (
    AKG.find((k) => (k.jk === null || k.jk === jk) && umurTahun >= k.umurMin && umurTahun <= k.umurMax) ?? null
  )
}

export function akgDenganTambahan(akg, tambahanId) {
  if (!akg) return null
  const t = TAMBAHAN[tambahanId]
  if (!t) return akg
  const hasil = { ...akg, label: `${akg.label} · ${t.label}` }
  for (const k of ['energi', 'protein', 'lemak', 'karbo', 'serat', 'air']) hasil[k] = bulat(akg[k] + t[k], 1)
  return hasil
}

// Menjumlahkan gizi dari daftar { makanan, porsi }.
export function totalGizi(daftar) {
  const total = { energi: 0, protein: 0, lemak: 0, karbo: 0, gula: 0, natrium: 0 }
  for (const { makanan, porsi } of daftar) {
    for (const k of Object.keys(total)) total[k] += (makanan.gizi[k] ?? 0) * porsi
  }
  for (const k of Object.keys(total)) total[k] = bulat(total[k], 1)
  return total
}

export function persen(nilai, target) {
  if (!target) return 0
  return Math.round((nilai / target) * 100)
}

// Kebutuhan air minum dalam gelas (1 gelas ≈ 250 ml), dibulatkan.
export function gelasAir(ml) {
  return Math.round(ml / 250)
}
