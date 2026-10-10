import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'
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

function bolehAnimasi(prefs) {
  return (
    !prefs.gerak &&
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
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

  const ubah = useCallback((perubahan) => setPrefs((p) => ({ ...p, ...perubahan })), [])

  // Mengganti profil dengan transisi "berubah wujud" bila animasi diizinkan.
  const pilihProfil = useCallback(
    (profil, { pakaiPreset = true } = {}) => {
      const perbarui = () => setPrefs((p) => ({ ...p, ...(pakaiPreset ? PRESET[profil] : {}), profil }))
      if (bolehAnimasi(prefs)) {
        document.startViewTransition(() => flushSync(perbarui))
      } else {
        perbarui()
      }
    },
    [prefs],
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
