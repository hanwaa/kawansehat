import { describe, expect, it } from 'vitest'
import { buatPegas, karet, proyeksi } from './pegas.js'

const sampel = (pegas, sampai = 2) => Array.from({ length: sampai * 120 + 1 }, (_, i) => pegas.posisi(i / 120))

describe('buatPegas', () => {
  it.each([1, 0.8])('redaman %s mulai tepat dari posisi dan kecepatan awal', (redaman) => {
    const pegas = buatPegas({ dari: 120, ke: 0, kecepatan: -900, redaman, respons: 0.3 })
    expect(pegas.posisi(0)).toBeCloseTo(120, 6)
    expect(pegas.kecepatan(0)).toBeCloseTo(-900, 6)
  })

  it('redaman kritis dari keadaan diam tidak melewati target', () => {
    const pegas = buatPegas({ dari: 0, ke: 400, redaman: 1, respons: 0.3 })
    for (const x of sampel(pegas)) expect(x).toBeLessThanOrEqual(400 + 1e-9)
    expect(pegas.diam(1)).toBe(true)
  })

  it('redaman 0.8 memantul sedikit lalu diam', () => {
    const pegas = buatPegas({ dari: 0, ke: 400, redaman: 0.8, respons: 0.3 })
    const lewat = Math.max(...sampel(pegas)) - 400
    expect(lewat).toBeGreaterThan(0)
    expect(lewat).toBeLessThan(400 * 0.05)
    expect(pegas.diam(2)).toBe(true)
  })

  it('kecepatan awal ke arah berlawanan dibalik dengan mulus, bukan dipotong', () => {
    // Lembar dilempar ke bawah tetapi tujuannya kembali ke atas: masih turun sebentar, lalu berbalik.
    const pegas = buatPegas({ dari: 100, ke: 0, kecepatan: 800, redaman: 1, respons: 0.3 })
    expect(pegas.posisi(0.02)).toBeGreaterThan(100)
    expect(pegas.diam(1.5)).toBe(true)
  })
})

describe('proyeksi', () => {
  it('mengikuti fungsi proyeksi Apple', () => {
    expect(proyeksi(1000)).toBeCloseTo(499, 0)
    expect(proyeksi(0)).toBe(0)
    expect(proyeksi(-1000)).toBeCloseTo(-proyeksi(1000), 9)
  })
})

describe('karet', () => {
  it('monoton, mulai dengan kemiringan sebesar konstanta, dan tidak pernah melewati dimensi', () => {
    expect(karet(0, 80)).toBe(0)
    expect(karet(1, 80) / 1).toBeCloseTo(0.55, 2)
    let sebelumnya = 0
    for (const lewat of [10, 50, 100, 500, 5000]) {
      const nilai = karet(lewat, 80)
      expect(nilai).toBeGreaterThan(sebelumnya)
      expect(nilai).toBeLessThan(80)
      sebelumnya = nilai
    }
  })
})
