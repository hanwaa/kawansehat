import { describe, expect, it } from 'vitest'
import { cekDarurat, jawab, SARAN, tanyaPiko } from './jawab.js'

const PROFIL = ['anak', 'remaja', 'dewasa', 'lansia']

describe('cekDarurat', () => {
  it.each(['Ayah saya sesak napas!', 'adik PINGSAN di sekolah', 'nenek tiba-tiba bicara pelo', 'aku ingin mati'])(
    'mengenali "%s" sebagai darurat',
    (teks) => expect(cekDarurat(teks)).toBe(true),
  )

  it.each(['Bagaimana mencegah DBD?', 'Kenapa harus cuci tangan?', 'cara ambil antrean'])('"%s" bukan darurat', (teks) =>
    expect(cekDarurat(teks)).toBe(false),
  )
})

describe('jawab', () => {
  it('jawaban darurat selalu ditandai dan menautkan halaman Darurat, di semua profil', () => {
    for (const profil of PROFIL) {
      const hasil = jawab('ibu saya kejang', profil)
      expect(hasil.darurat).toBe(true)
      expect(hasil.tautan.map((t) => t.ke)).toContain('/darurat')
    }
  })

  it('darurat didahulukan dari topik lain', () => {
    expect(jawab('anak saya DBD dan sekarang tidak sadar', 'dewasa').darurat).toBe(true)
  })

  it('DBD diarahkan ke halaman DBD', () => {
    expect(jawab('dbd itu apa', 'remaja').tautan[0].ke).toBe('/info/dbd')
  })

  it('anak dan remaja tidak pernah diarahkan ke target kalori', () => {
    for (const profil of ['anak', 'remaja']) {
      expect(jawab('berapa kebutuhan kalori aku', profil).tautan.map((t) => t.ke)).not.toContain('/cek-gizi/kebutuhan')
    }
    expect(jawab('berapa kebutuhan kalori saya', 'dewasa').tautan[0].ke).toBe('/cek-gizi/kebutuhan')
  })

  it('pertanyaan diagnosis dan dosis ditolak dengan sopan', () => {
    const hasil = jawab('obat apa untuk demam?', 'dewasa')
    expect(hasil.teks).toMatch(/bukan dokter/)
    expect(hasil.darurat).toBeUndefined()
  })

  it('pertanyaan yang tidak dikenal mendapat jawaban cadangan tanpa tautan', () => {
    const hasil = jawab('siapa presiden pertama?', 'dewasa')
    expect(hasil.teks).toMatch(/belum bisa menjawab/)
    expect(hasil.tautan).toEqual([])
  })

  it('setiap tombol saran mendapat jawaban yang dikenali, bukan jawaban cadangan', () => {
    for (const profil of PROFIL) {
      const cadangan = jawab('qwerty', profil).teks
      for (const saran of SARAN[profil]) expect(jawab(saran, profil).teks, `${profil}: ${saran}`).not.toBe(cadangan)
    }
  })
})

describe('tanyaPiko', () => {
  it('mengembalikan jawaban yang sama dengan jawab()', async () => {
    expect(await tanyaPiko({ teks: 'cara pasang pengingat obat', profil: 'lansia', jeda: 0 })).toEqual(
      jawab('cara pasang pengingat obat', 'lansia'),
    )
  })
})
