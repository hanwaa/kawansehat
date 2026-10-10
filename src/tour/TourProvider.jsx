import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import MascotTour from './MascotTour.jsx'
import { halamanPanduan, langkahPanduan, SAPAAN_TUR } from './steps.js'
import { cariTarget } from './target.js'

const TourContext = createContext(null)

export function TourProvider({ children }) {
  // `sesi` bertambah setiap tur dibuka, supaya posisi sorotan dari tur sebelumnya tidak dipakai lagi.
  // `langkah` disusun saat tur dibuka, dari halaman yang sedang tampil.
  const [status, setStatus] = useState({ terbuka: false, tahap: 'tawar', indeks: 0, sesi: 0, langkah: [], sapaan: null })
  const { ubah, profil, pilih } = usePrefs()
  const { pathname } = useLocation()

  // Panduan untuk halaman yang sedang dibuka: teks sesuai profil, dan hanya langkah yang elemennya ada di layar.
  const susunLangkah = useCallback(() => {
    const teks = (x) => (typeof x === 'string' ? x : pilih(x))
    return langkahPanduan(halamanPanduan(pathname), profil)
      .filter((l) => cariTarget(l.target))
      .map((l) => ({ target: l.target, pose: l.pose, judul: teks(l.judul), teks: teks(l.teks) }))
  }, [pathname, profil, pilih])

  // Ditawarkan sekali setelah pembuka, di beranda.
  const tawarkan = useCallback(() => {
    const langkah = susunLangkah()
    const sapaan = SAPAAN_TUR[profil]
    setStatus((s) => ({
      terbuka: true,
      tahap: 'tawar',
      indeks: 0,
      sesi: s.sesi + 1,
      langkah,
      sapaan: { judul: sapaan.judul, teks: sapaan.teks(langkah.length) },
    }))
  }, [susunLangkah, profil])

  // Tombol "Lihat Panduan": langsung mulai dari langkah pertama, di halaman ini (tanpa berpindah halaman).
  const mulai = useCallback(() => {
    const langkah = susunLangkah()
    if (!langkah.length) return
    setStatus((s) => ({ terbuka: true, tahap: 'langkah', indeks: 0, sesi: s.sesi + 1, langkah, sapaan: null }))
  }, [susunLangkah])

  const tutup = useCallback(() => {
    setStatus((s) => ({ ...s, terbuka: false }))
    ubah({ turSelesai: true })
  }, [ubah])

  const nilai = useMemo(() => ({ tawarkan, mulai, tutup }), [tawarkan, mulai, tutup])

  return (
    <TourContext.Provider value={nilai}>
      {children}
      <MascotTour status={status} setStatus={setStatus} onTutup={tutup} />
    </TourContext.Provider>
  )
}

export function useTur() {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('useTur harus dipakai di dalam TourProvider')
  return ctx
}
