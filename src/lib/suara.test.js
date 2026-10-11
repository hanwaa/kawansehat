import { describe, expect, it } from 'vitest'
import { KARAKTER_SUARA, pilihSuara } from './suara.js'

const ARDI = { name: 'Microsoft Ardi Online (Natural) - Indonesian (Indonesia)', lang: 'id-ID' }
const GADIS = { name: 'Microsoft Gadis Online (Natural) - Indonesian (Indonesia)', lang: 'id-ID' }
const INGGRIS = { name: 'Google US English', lang: 'en-US' }

describe('pilihSuara', () => {
  it('anak dan remaja mengutamakan suara perempuan', () => {
    expect(pilihSuara([INGGRIS, ARDI, GADIS], 'anak')).toBe(GADIS)
    expect(pilihSuara([INGGRIS, ARDI, GADIS], 'remaja')).toBe(GADIS)
  })

  it('dewasa dan lansia memakai suara Indonesia pertama', () => {
    expect(pilihSuara([INGGRIS, ARDI, GADIS], 'dewasa')).toBe(ARDI)
    expect(pilihSuara([INGGRIS, ARDI, GADIS], 'lansia')).toBe(ARDI)
  })

  it('anak tetap mendapat suara Indonesia bila tidak ada suara perempuan', () => {
    expect(pilihSuara([INGGRIS, ARDI], 'anak')).toBe(ARDI)
  })

  it('mendahulukan id-ID, lalu kode Indonesia lain termasuk kode lama "in"', () => {
    const android = { name: 'Bahasa Indonesia', lang: 'in_ID' }
    expect(pilihSuara([android, ARDI], 'dewasa')).toBe(ARDI)
    expect(pilihSuara([INGGRIS, android], 'dewasa')).toBe(android)
  })

  it('mengembalikan null bila tidak ada suara Indonesia', () => {
    expect(pilihSuara([INGGRIS], 'anak')).toBeNull()
    expect(pilihSuara([], 'dewasa')).toBeNull()
  })
})

describe('KARAKTER_SUARA', () => {
  it('nada anak > remaja > dewasa, dan lansia lebih lambat', () => {
    const { anak, remaja, dewasa, lansia } = KARAKTER_SUARA
    expect(anak.nada).toBeGreaterThan(remaja.nada)
    expect(remaja.nada).toBeGreaterThan(dewasa.nada)
    expect(lansia.nada).toBe(dewasa.nada)
    expect(lansia.kecepatan).toBeLessThan(dewasa.kecepatan)
  })
})
