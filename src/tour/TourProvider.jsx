import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import MascotTour from './MascotTour.jsx'

const TourContext = createContext(null)

export function TourProvider({ children }) {
  // `sesi` bertambah setiap tur dibuka, supaya posisi sorotan dari tur sebelumnya tidak dipakai lagi.
  const [status, setStatus] = useState({ terbuka: false, tahap: 'tawar', indeks: 0, sesi: 0 })
  const { ubah } = usePrefs()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const tawarkan = useCallback(() => setStatus((s) => ({ terbuka: true, tahap: 'tawar', indeks: 0, sesi: s.sesi + 1 })), [])

  // Mulai langsung dari langkah pertama (lewat tombol mengambang "Panduan" dari halaman mana pun).
  const mulai = useCallback(() => {
    if (pathname !== '/beranda') navigate('/beranda')
    // Halaman dimuat lazy: tunggu sampai target tur di beranda ada (maksimal 2 detik). Bila sudah di beranda,
    // tur langsung terbuka tanpa jeda.
    const awal = Date.now()
    const tunggu = () => {
      if (document.querySelector('main [data-tour="aksi-utama"]') || Date.now() - awal > 2000) {
        setStatus((s) => ({ terbuka: true, tahap: 'langkah', indeks: 0, sesi: s.sesi + 1 }))
      } else {
        setTimeout(tunggu, 60)
      }
    }
    tunggu()
  }, [navigate, pathname])

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
