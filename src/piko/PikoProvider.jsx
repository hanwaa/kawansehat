import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import { bacakan, hentikan } from '../lib/suara.js'
import { tanyaPiko } from './jawab.js'
import TanyaPiko from './TanyaPiko.jsx'

const PikoContext = createContext(null)

const GAGAL = {
  teks: 'Maaf, Piko sedang tidak bisa menjawab. Coba lagi sebentar lagi, ya.',
  tautan: [],
}

// Obrolan Tanya Piko. Riwayatnya hanya di memori: tetap ada saat berpindah halaman, hilang saat halaman dimuat
// ulang, dan tidak pernah ditulis ke penyimpanan perangkat.
export function PikoProvider({ children }) {
  const { prefs, profil } = usePrefs()
  const [terbuka, setTerbuka] = useState(false)
  const [pesan, setPesan] = useState([])
  const [menunggu, setMenunggu] = useState(false)
  // Naik setiap obrolan dihapus, supaya jawaban yang masih ditunggu tidak muncul di obrolan yang baru.
  const sesi = useRef(0)
  const nomor = useRef(0)
  // Topik jawaban terakhir, supaya pertanyaan susulan ("cara mencegahnya?") tetap tersambung.
  const topikTerakhir = useRef(undefined)

  const kirim = useCallback(
    async (teks) => {
      const isi = teks.trim()
      if (!isi || menunggu) return
      const sesiIni = sesi.current
      setPesan((p) => [...p, { id: ++nomor.current, dari: 'kamu', teks: isi }])
      setMenunggu(true)
      let jawaban
      try {
        jawaban = await tanyaPiko({ teks: isi, profil, topik: topikTerakhir.current })
      } catch {
        jawaban = { ...GAGAL, galat: true }
      }
      if (sesiIni !== sesi.current) return
      topikTerakhir.current = jawaban.topik
      setPesan((p) => [...p, { id: ++nomor.current, dari: 'piko', ...jawaban }])
      setMenunggu(false)
    },
    [menunggu, profil],
  )

  const hapus = useCallback(() => {
    sesi.current += 1
    topikTerakhir.current = undefined
    hentikan()
    setPesan([])
    setMenunggu(false)
  }, [])

  const buka = useCallback(() => setTerbuka(true), [])
  const tutup = useCallback(() => {
    hentikan()
    setTerbuka(false)
  }, [])

  // Bila "Bacakan teks" aktif, setiap jawaban baru (beserta poinnya) dibacakan sekali, tidak diulang saat panel
  // dibuka lagi.
  const terakhirDibaca = useRef(0)
  useEffect(() => {
    const akhir = pesan.at(-1)
    if (!terbuka || !prefs.suara || akhir?.dari !== 'piko' || akhir.id === terakhirDibaca.current) return
    terakhirDibaca.current = akhir.id
    bacakan([akhir.teks, ...(akhir.poin ?? [])], { profil })
  }, [pesan, terbuka, prefs.suara, profil])

  const nilai = useMemo(() => ({ buka }), [buka])

  return (
    <PikoContext.Provider value={nilai}>
      {children}
      <TanyaPiko terbuka={terbuka} onTutup={tutup} pesan={pesan} menunggu={menunggu} onKirim={kirim} onHapus={hapus} />
    </PikoContext.Provider>
  )
}

export function usePiko() {
  const ctx = useContext(PikoContext)
  if (!ctx) throw new Error('usePiko harus dipakai di dalam PikoProvider')
  return ctx
}
