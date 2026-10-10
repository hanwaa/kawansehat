import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { DAFTAR_PROFIL, PREFS_AWAL, PRESET, UKURAN_TEKS } from './presets.js'

const KUNCI = 'ks-prefs'
const PrefsContext = createContext(null)

function muat() {
  let tersimpan = {}
  try {
    tersimpan = JSON.parse(localStorage.getItem(KUNCI) || '{}') || {}
  } catch {
    tersimpan = {}
  }
  let prefs = { ...PREFS_AWAL, ...tersimpan }
  // Tautan demo, misalnya /beranda?profil=lansia&kontras=ya&teks=sangat-besar, langsung memasang tampilan itu.
  const q = new URLSearchParams(window.location.search)
  const profil = q.get('profil')
  if (DAFTAR_PROFIL.includes(profil)) prefs = { ...prefs, ...PRESET[profil], profil }
  if (UKURAN_TEKS.some((u) => u.id === q.get('teks'))) prefs.teks = q.get('teks')
  for (const kunci of ['kontras', 'suara', 'isyarat', 'sederhana', 'gerak']) {
    if (q.get(kunci) === 'ya') prefs[kunci] = true
    if (q.get(kunci) === 'tidak') prefs[kunci] = false
  }
  return prefs
}

function pasangAtribut(nama, aktif, nilai = 'ya') {
  const h = document.documentElement
  if (aktif) h.dataset[nama] = nilai
  else delete h.dataset[nama]
}

function terapkan(prefs) {
  const h = document.documentElement
  h.dataset.profil = prefs.profil ?? 'dewasa'
  h.dataset.teks = prefs.teks
  pasangAtribut('kontras', prefs.kontras)
  pasangAtribut('sederhana', prefs.sederhana)
  pasangAtribut('isyarat', prefs.isyarat)
  pasangAtribut('gerak', prefs.gerak, 'kurang')
}

// Crossfade ganti profil hanya mengubah opasitas (tidak memicu pusing), jadi tetap dipakai saat sistem meminta
// "kurangi gerakan" (durasinya dipersingkat di base.css). Hanya pilihan "Kurangi animasi" di aplikasi yang mematikannya;
// dibaca dari atribut <html> supaya selalu sesuai preferensi yang sedang berlaku.
function bolehAnimasi() {
  return !document.documentElement.dataset.gerak && typeof document.startViewTransition === 'function'
}

// Preferensi yang mengubah wujud seluruh halaman. Perubahannya ikut crossfade seperti ganti profil, supaya latar,
// kartu, dan teks berganti bersama, bukan sebagian memudar dan sebagian melompat.
const UBAH_WUJUD = ['teks', 'kontras', 'sederhana', 'isyarat']

// Mencatat posisi layar elemen jangkar; fungsi yang dikembalikan menggulir wadahnya supaya elemen itu tetap
// di tempat setelah tampilan berubah (misalnya teks membesar saat memilih Lansia), tidak lari dari bawah jari.
function tahanPosisi(el) {
  if (!el) return () => {}
  const sebelum = el.getBoundingClientRect().top
  return () => {
    const selisih = el.getBoundingClientRect().top - sebelum
    if (Math.abs(selisih) < 1) return
    let wadah = el.parentElement
    while (wadah && wadah !== document.body && !/(auto|scroll)/.test(getComputedStyle(wadah).overflowY)) {
      wadah = wadah.parentElement
    }
    ;(wadah && wadah !== document.body ? wadah : window).scrollBy(0, selisih)
  }
}

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(muat)

  useLayoutEffect(() => {
    terapkan(prefs)
    try {
      localStorage.setItem(KUNCI, JSON.stringify(prefs))
    } catch {
      // Penyimpanan diblokir (mode privat): preferensi tetap berlaku selama halaman terbuka.
    }
  }, [prefs])

  // Transisi yang sedang berjalan & perubahan yang menunggu untuk diterapkan di dalamnya.
  const transisi = useRef({ aktif: false, menunggu: null })

  // Menerapkan perubahan tampilan di dalam transisi "berubah wujud" bila animasi diizinkan. Perubahan baru di
  // tengah transisi tidak membatalkannya (itu membuat tampilan melompat): perubahan langsung diterapkan dan ikut
  // tampil di gambar "baru" transisi yang masih hidup. `perbarui` harus memakai flushSync supaya DOM sudah
  // berubah saat transisi mengambil gambar barunya.
  const denganTransisi = useCallback((perbarui) => {
    const t = transisi.current
    if (t.menunggu) {
      // Transisi belum sempat menerapkan perubahan sebelumnya: keduanya diterapkan berurutan di dalamnya.
      const sebelumnya = t.menunggu
      t.menunggu = () => {
        sebelumnya()
        perbarui()
      }
    } else if (t.aktif || !bolehAnimasi()) {
      perbarui()
    } else {
      t.aktif = true
      t.menunggu = perbarui
      const vt = document.startViewTransition(() => {
        const terapkan = t.menunggu
        t.menunggu = null
        terapkan()
      })
      vt.finished.finally(() => {
        t.aktif = false
        t.menunggu = null
      })
    }
  }, [])

  const ubah = useCallback(
    (perubahan) => {
      if (Object.keys(perubahan).some((k) => UBAH_WUJUD.includes(k))) {
        denganTransisi(() => flushSync(() => setPrefs((p) => ({ ...p, ...perubahan }))))
      } else {
        setPrefs((p) => ({ ...p, ...perubahan }))
      }
    },
    [denganTransisi],
  )

  // Mengganti profil. `jangkar` = elemen yang harus tetap di posisinya, biasanya kartu profil yang baru diketuk.
  const pilihProfil = useCallback(
    (profil, { pakaiPreset = true, jangkar } = {}) => {
      const tahan = tahanPosisi(jangkar)
      denganTransisi(() => {
        flushSync(() => setPrefs((p) => ({ ...p, ...(pakaiPreset ? PRESET[profil] : {}), profil })))
        tahan()
      })
    },
    [denganTransisi],
  )

  const nilai = useMemo(() => {
    const profil = prefs.profil ?? 'dewasa'
    // pilih({ anak, remaja, dewasa, lansia, semua }) → teks sesuai profil aktif.
    const pilih = (varian) => varian[profil] ?? varian.semua ?? varian.dewasa
    return { prefs, profil, ubah, pilihProfil, pilih }
  }, [prefs, ubah, pilihProfil])

  return <PrefsContext.Provider value={nilai}>{children}</PrefsContext.Provider>
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs harus dipakai di dalam PrefsProvider')
  return ctx
}
