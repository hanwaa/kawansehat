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

// Telusuri semua pertanyaan yang bisa diketuk, mulai dari saran awal lalu mengikuti pertanyaan lanjutan,
// dengan topik jawaban sebelumnya sebagai konteks (seperti di PikoProvider).
function telusuri(profil) {
  const hasil = []
  const dikunjungi = new Set()
  const antrean = SARAN[profil].map((teks) => ({ teks, topik: undefined, dari: null }))
  while (antrean.length) {
    const { teks, topik, dari } = antrean.shift()
    const kunci = `${topik}|${teks}`
    if (dikunjungi.has(kunci)) continue
    dikunjungi.add(kunci)
    const jawaban = jawab(teks, profil, { topik })
    hasil.push({ teks, dari, jawaban })
    for (const lanjut of jawaban.lanjutan) antrean.push({ teks: lanjut, topik: jawaban.topik, dari: jawaban.id })
  }
  return hasil
}

describe('pertanyaan lanjutan', () => {
  it.each(PROFIL)('%s: setiap pertanyaan yang bisa diketuk dikenali dan tidak menunjuk ke dirinya sendiri', (profil) => {
    for (const { teks, dari, jawaban } of telusuri(profil)) {
      expect(jawaban.id, `${profil}: "${teks}"`).not.toBe('lain')
      expect(jawaban.id, `${profil}: "${teks}" dari ${dari}`).not.toBe(dari)
    }
  })

  it.each(PROFIL)('%s: jawaban tidak memuat angka kesehatan', (profil) => {
    for (const { jawaban } of telusuri(profil)) {
      for (const kalimat of [jawaban.teks, ...jawaban.poin]) {
        expect(kalimat.replace(/119|3M|AKG 2019/g, ''), kalimat).not.toMatch(/\d/)
      }
    }
  })

  it('anak dan remaja tidak pernah sampai ke target kalori lewat pertanyaan lanjutan', () => {
    for (const profil of ['anak', 'remaja']) {
      for (const { jawaban } of telusuri(profil)) {
        expect(jawaban.tautan.map((t) => t.ke)).not.toContain('/cek-gizi/kebutuhan')
      }
    }
  })

  it('anak (tanpa kolom tulis) selalu punya pertanyaan berikutnya', () => {
    for (const { teks, jawaban } of telusuri('anak')) {
      if (!jawaban.darurat) expect(jawaban.lanjutan.length, teks).toBeGreaterThan(0)
    }
  })

  it('alur DBD: apa itu → cara mencegah → dampak', () => {
    const apa = jawab('Apa itu DBD?', 'dewasa')
    expect(apa.id).toBe('dbd')
    expect(apa.lanjutan).toContain('Bagaimana mencegah DBD?')
    const cegah = jawab('Bagaimana mencegah DBD?', 'dewasa', { topik: apa.topik })
    expect(cegah.id).toBe('dbd/cegah')
    expect(cegah.poin.length).toBeGreaterThan(0)
    expect(cegah.lanjutan).toContain('Apa dampak DBD?')
    expect(jawab('Apa dampak DBD?', 'dewasa', { topik: cegah.topik }).id).toBe('dbd/dampak')
  })

  it('pertanyaan susulan tanpa nama topik memakai topik sebelumnya', () => {
    expect(jawab('terus cara mencegahnya?', 'remaja', { topik: 'dbd' }).id).toBe('dbd/cegah')
    expect(jawab('terus cara mencegahnya?', 'remaja').id).toBe('lain')
    // Topik baru yang disebut jelas tetap menang atas konteks.
    expect(jawab('cara cek imt', 'dewasa', { topik: 'dbd' }).id).toBe('imt')
  })

  it('sub yang lebih khusus dicocokkan lebih dulu', () => {
    expect(jawab('Apa yang dilakukan bila muncul gejala DBD?', 'dewasa').id).toBe('dbd/pertolongan')
    expect(jawab('Kenapa nyamuknya berbahaya?', 'anak').id).toBe('dbd/dampak')
    expect(jawab('Apa tanda bahaya DBD?', 'dewasa').id).toBe('dbd/bahaya')
  })
})

describe('tanyaPiko', () => {
  it('mengembalikan jawaban yang sama dengan jawab()', async () => {
    expect(await tanyaPiko({ teks: 'cara pasang pengingat obat', profil: 'lansia', jeda: 0 })).toEqual(
      jawab('cara pasang pengingat obat', 'lansia'),
    )
  })

  it('meneruskan topik sebelumnya sebagai konteks', async () => {
    expect((await tanyaPiko({ teks: 'apa dampaknya?', profil: 'dewasa', topik: 'dbd', jeda: 0 })).id).toBe('dbd/dampak')
  })
})
