import { describe, expect, it } from 'vitest'
import {
  akgDenganTambahan,
  bacaAngka,
  cariAKG,
  hitungIMT,
  kategoriIMTDewasa,
  kategoriIMTU,
  nilaiStatusGizi,
  rentangBeratNormal,
  totalGizi,
  zScoreIMTU,
  zScoreLMS,
} from './gizi.js'
import { cariMakanan } from '../data/makanan.js'
import { LMS_IMT_U } from '../data/who-imt-u.js'

describe('bacaAngka', () => {
  it('menerima koma dan titik desimal', () => {
    expect(bacaAngka('65,5')).toBe(65.5)
    expect(bacaAngka('65.5')).toBe(65.5)
    expect(bacaAngka(' 170 ')).toBe(170)
  })
  it('menolak teks bukan angka', () => {
    expect(bacaAngka('')).toBeNaN()
    expect(bacaAngka('abc')).toBeNaN()
    expect(bacaAngka('-5')).toBeNaN()
  })
})

describe('IMT dewasa (Permenkes 41/2014)', () => {
  it('menghitung IMT dengan satu desimal', () => {
    expect(hitungIMT(70, 170)).toBe(24.2)
  })
  it('memakai batas kategori yang tepat', () => {
    expect(kategoriIMTDewasa(16.9)).toBe('sangat-kurus')
    expect(kategoriIMTDewasa(17.0)).toBe('kurus')
    expect(kategoriIMTDewasa(18.4)).toBe('kurus')
    expect(kategoriIMTDewasa(18.5)).toBe('normal')
    expect(kategoriIMTDewasa(25.0)).toBe('normal')
    expect(kategoriIMTDewasa(25.1)).toBe('gemuk')
    expect(kategoriIMTDewasa(27.0)).toBe('gemuk')
    expect(kategoriIMTDewasa(27.1)).toBe('obesitas')
  })
  it('memberi rentang berat normal', () => {
    expect(rentangBeratNormal(160)).toEqual({ min: 47.4, max: 64 })
  })
})

describe('IMT menurut umur (WHO 2007, Permenkes 2/2020)', () => {
  const [L, M, S] = LMS_IMT_U.laki[0] // laki-laki 61 bulan
  const sd = (z) => M * Math.pow(1 + L * S * z, 1 / L)

  it('z = 0 di median dan ±1 di garis SD', () => {
    expect(zScoreLMS(M, L, M, S)).toBeCloseTo(0, 6)
    expect(zScoreLMS(sd(1), L, M, S)).toBeCloseTo(1, 6)
    expect(zScoreLMS(sd(-2), L, M, S)).toBeCloseTo(-2, 6)
  })

  it('cocok dengan tabel WHO laki-laki 5 tahun 1 bulan (median 15,3; +1 SD 16,6; +3 SD 20,2)', () => {
    expect(M).toBeCloseTo(15.3, 1)
    expect(sd(1)).toBeCloseTo(16.6, 1)
    expect(sd(3)).toBeCloseTo(20.2, 1)
  })

  it('memakai penyesuaian WHO di luar ±3 SD', () => {
    const y = sd(3) + (sd(3) - sd(2))
    expect(zScoreLMS(y, L, M, S)).toBeCloseTo(4, 6)
  })

  it('mengambil baris tabel sesuai umur dan jenis kelamin', () => {
    expect(zScoreIMTU(LMS_IMT_U.perempuan[228 - 61][1], 228, 'perempuan')).toBeCloseTo(0, 6)
    expect(zScoreIMTU(20, 60, 'laki')).toBeNull()
    expect(zScoreIMTU(20, 229, 'laki')).toBeNull()
  })

  it('memakai batas kategori Permenkes 2/2020', () => {
    expect(kategoriIMTU(-3.01)).toBe('gizi-buruk')
    expect(kategoriIMTU(-3)).toBe('gizi-kurang')
    expect(kategoriIMTU(-2.01)).toBe('gizi-kurang')
    expect(kategoriIMTU(-2)).toBe('gizi-baik')
    expect(kategoriIMTU(1)).toBe('gizi-baik')
    expect(kategoriIMTU(1.01)).toBe('gizi-lebih')
    expect(kategoriIMTU(2)).toBe('gizi-lebih')
    expect(kategoriIMTU(2.01)).toBe('obesitas')
  })
})

describe('nilaiStatusGizi memilih metode sesuai umur', () => {
  it('balita diarahkan ke KMS', () => {
    expect(nilaiStatusGizi({ beratKg: 15, tinggiCm: 100, umurTahun: 4, jk: 'laki' }).metode).toBe('balita')
  })
  it('anak dan remaja memakai IMT/U, bukan kategori dewasa', () => {
    const h = nilaiStatusGizi({ beratKg: 50, tinggiCm: 160, umurTahun: 15, umurBulan: 0, jk: 'perempuan' })
    expect(h.metode).toBe('imt-u')
    expect(h.kategori).toMatch(/^gizi-|obesitas/)
  })
  it('19 tahun ke atas memakai IMT dewasa dan lingkar perut', () => {
    const h = nilaiStatusGizi({ beratKg: 70, tinggiCm: 170, umurTahun: 30, jk: 'laki', lingkarPerutCm: 95 })
    expect(h).toMatchObject({ metode: 'dewasa', imt: 24.2, kategori: 'normal' })
    expect(h.lingkarPerut.berisiko).toBe(true)
  })
})

describe('AKG (Permenkes 28/2019)', () => {
  it('memilih kelompok umur dan jenis kelamin', () => {
    expect(cariAKG(25, 'perempuan')).toMatchObject({ energi: 2250, protein: 60, air: 2350 })
    expect(cariAKG(8, 'laki')).toMatchObject({ id: 'anak-7-9', energi: 1650 })
    expect(cariAKG(80, 'laki')).toMatchObject({ id: 'l-65-80' })
    expect(cariAKG(85, 'laki')).toMatchObject({ id: 'l-80' })
    expect(cariAKG(0, 'laki')).toBeNull()
  })
  it('menambahkan kebutuhan ibu hamil', () => {
    const akg = akgDenganTambahan(cariAKG(25, 'perempuan'), 'hamil-2')
    expect(akg).toMatchObject({ energi: 2550, protein: 70, air: 2650 })
  })
})

describe('totalGizi (Daftar Bahan Makanan Penukar)', () => {
  it('menjumlahkan porsi', () => {
    const total = totalGizi([
      { makanan: cariMakanan('nasi-putih'), porsi: 1 },
      { makanan: cariMakanan('tempe-goreng'), porsi: 1 },
      { makanan: cariMakanan('garam'), porsi: 0.5 },
    ])
    expect(total).toEqual({ energi: 305, protein: 10, lemak: 8, karbo: 48, gula: 0, natrium: 1000 })
  })
})
