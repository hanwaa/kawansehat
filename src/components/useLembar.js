import { useCallback, useLayoutEffect, useRef } from 'react'
import { buatPegas, karet, proyeksi } from '../lib/pegas.js'

// Lembar dari bawah (bottom sheet) yang bisa ditarik turun untuk ditutup, seperti lembar iOS.
// - Lembar menempel di jari selama ditarik (1:1), dan saat dilepas meneruskan kecepatan jari ke pegas.
// - Tutup atau kembali dipilih dari ke mana kibasan akan berhenti (proyeksi), bukan dari posisi saat dilepas.
// - Ditarik ke atas melewati posisinya: tertahan seperti karet.
// - Setiap gerak bisa ditangkap lagi kapan saja, termasuk saat lembar sedang meluncur turun setelah Tutup/Esc.
//   React Aria baru diberi tahu dialog tertutup setelah lembar keluar layar.
// Hanya aktif selama `media` cocok (lebar HP); di luar itu dialog berperilaku seperti biasa. Area tarik hanya
// elemen [data-pegangan] (pegangan + kepala lembar) supaya isi yang bergulir tetap memakai gulir bawaan.
// Tombol Tutup, Esc, dan ketuk di luar tetap ada sebagai cara menutup tanpa gerakan tarik (WCAG 2.5.1).

const PEGAS_TENANG = { redaman: 1, respons: 0.3 }
// Sedikit memantul hanya bila jari memang melempar lembar.
const PEGAS_MOMENTUM = { redaman: 0.8, respons: 0.3 }
const BATAS_MOMENTUM = 300 // px/s
const KARET_ATAS = 80 // px; sama dengan perpanjangan bayangan di bawah lembar (CSS)
const JENDELA_KECEPATAN = 100 // ms terakhir yang dipakai menghitung kecepatan
const BUKAN_PEGANGAN = 'button, a, input, textarea, select, [role="button"]'

// "Kurangi animasi" di aplikasi mematikan semua gerak; setelan sistem hanya menghilangkan gerak spasial.
const geraknyaMati = () => document.documentElement.dataset.gerak === 'kurang'
const sistemKurangiGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function pasangLembar(el, media, ubah) {
  const lapisan = el.closest('.lapisan-dialog') ?? el.parentElement
  let y = 0
  let tinggi = el.getBoundingClientRect().height
  let gerak = null // { pegas, mulai, raf }
  let tarik = null // { id, awalY, awalPosisi, riwayat }
  let menutup = false

  const aktif = () => window.matchMedia(media).matches

  function tulis(nilai) {
    y = nilai
    el.style.translate = nilai ? `0 ${nilai}px` : ''
    // Peredupan mengikuti seberapa banyak lembar masih terlihat.
    lapisan.style.setProperty('--lembar-terlihat', String(Math.min(1, Math.max(0, 1 - nilai / tinggi))))
  }

  function hentikanGerak() {
    if (gerak) cancelAnimationFrame(gerak.raf)
    gerak = null
  }

  // Mulai dari nilai yang sedang tampil di layar: posisi pegas yang berjalan, atau keyframe masuk CSS yang belum
  // selesai. Keyframe di-finish() (bukan cancel()) supaya React Aria tetap melepas data-entering.
  function ambilAlih() {
    let kecepatan = 0
    if (gerak) {
      const t = Math.max(0, (performance.now() - gerak.mulai) / 1000)
      y = gerak.pegas.posisi(t)
      kecepatan = gerak.pegas.kecepatan(t)
      hentikanGerak()
    }
    const keyframe = [...el.getAnimations(), ...lapisan.getAnimations()].filter(
      (a) => a instanceof CSSAnimation && a.playState === 'running',
    )
    if (keyframe.length) {
      const transform = getComputedStyle(el).transform
      if (transform && transform !== 'none') y += new DOMMatrixReadOnly(transform).m42
      keyframe.forEach((a) => a.finish())
    }
    tinggi = el.getBoundingClientRect().height
    tulis(y)
    return kecepatan
  }

  // Pegas dari posisi sekarang ke `ke`. `cukup` menghentikan lebih awal (lembar sudah keluar layar).
  function jalankan(ke, kecepatan, opsi, { cukup, selesai } = {}) {
    hentikanGerak()
    const pegas = buatPegas({ dari: y, ke, kecepatan, ...opsi })
    const mulai = performance.now()
    const langkah = (sekarang) => {
      const t = Math.max(0, (sekarang - mulai) / 1000)
      const nilai = pegas.posisi(t)
      if (pegas.diam(t) || cukup?.(nilai)) {
        gerak = null
        tulis(cukup ? nilai : ke)
        selesai?.()
        return
      }
      tulis(nilai)
      gerak.raf = requestAnimationFrame(langkah)
    }
    gerak = { pegas, mulai, raf: requestAnimationFrame(langkah) }
  }

  function kembali(kecepatan) {
    if (geraknyaMati()) return tulis(0)
    const momentum = Math.abs(kecepatan) > BATAS_MOMENTUM && !sistemKurangiGerak()
    jalankan(0, kecepatan, momentum ? PEGAS_MOMENTUM : PEGAS_TENANG)
  }

  // kecepatan diisi saat dilepas dari tarikan; dari tombol/Esc, kecepatan diambil dari gerak yang sedang berjalan.
  function tutup(kecepatan) {
    if (menutup) return
    if (!aktif() || geraknyaMati() || sistemKurangiGerak()) return ubah(false)
    menutup = true
    const v = kecepatan ?? ambilAlih()
    // Target sedikit di bawah layar supaya lembar keluar dengan kecepatan, tidak merayap di tepi bawah.
    jalankan(tinggi + 60, v, PEGAS_TENANG, {
      cukup: (nilai) => nilai >= tinggi,
      selesai: () => {
        // Lembar sudah di luar layar: keyframe keluar CSS tidak perlu diputar, React Aria langsung melepasnya.
        el.style.animation = 'none'
        lapisan.style.animation = 'none'
        ubah(false)
      },
    })
  }

  function tekan(e) {
    if (!aktif() || e.button !== 0 || !e.isPrimary || tarik) return
    const pegangan = e.target.closest('[data-pegangan]')
    if (!pegangan || !el.contains(pegangan) || e.target.closest(BUKAN_PEGANGAN)) return
    // Menangkap lembar yang sedang meluncur turun membatalkan penutupannya.
    menutup = false
    ambilAlih()
    tarik = { id: e.pointerId, awalY: e.clientY, awalPosisi: y, riwayat: [{ y, t: e.timeStamp }] }
    el.setPointerCapture(e.pointerId)
    el.dataset.ditarik = ''
  }

  function geser(e) {
    if (!tarik || e.pointerId !== tarik.id) return
    const mentah = tarik.awalPosisi + (e.clientY - tarik.awalY)
    tulis(mentah < 0 ? -karet(-mentah, KARET_ATAS) : mentah)
    tarik.riwayat.push({ y, t: e.timeStamp })
    while (tarik.riwayat.length > 2 && e.timeStamp - tarik.riwayat[0].t > JENDELA_KECEPATAN) tarik.riwayat.shift()
  }

  function lepas(e) {
    if (!tarik || e.pointerId !== tarik.id) return
    const riwayat = tarik.riwayat.filter((r) => e.timeStamp - r.t <= JENDELA_KECEPATAN)
    tarik = null
    delete el.dataset.ditarik
    let kecepatan = 0
    if (e.type === 'pointerup' && riwayat.length >= 2) {
      const awal = riwayat[0]
      const akhir = riwayat.at(-1)
      if (akhir.t > awal.t) kecepatan = ((akhir.y - awal.y) / (akhir.t - awal.t)) * 1000
    }
    if (y + proyeksi(kecepatan) > tinggi / 2) tutup(kecepatan)
    else kembali(kecepatan)
  }

  el.addEventListener('pointerdown', tekan)
  el.addEventListener('pointermove', geser)
  el.addEventListener('pointerup', lepas)
  el.addEventListener('pointercancel', lepas)
  el.addEventListener('lostpointercapture', lepas)

  return {
    tutup: () => tutup(),
    lepaskan() {
      hentikanGerak()
      el.removeEventListener('pointerdown', tekan)
      el.removeEventListener('pointermove', geser)
      el.removeEventListener('pointerup', lepas)
      el.removeEventListener('pointercancel', lepas)
      el.removeEventListener('lostpointercapture', lepas)
    },
  }
}

/**
 * @param {{ onOpenChange: (buka: boolean) => void, media?: string }} opsi
 * @returns {{ pasang: (el: HTMLElement | null) => (() => void) | undefined, onOpenChange: (buka: boolean) => void, tutup: () => void }}
 *   `pasang` adalah callback ref untuk <Modal>; `onOpenChange` menggantikan milik ModalOverlay/DialogTrigger;
 *   `tutup` untuk tombol Tutup.
 */
export function useLembar({ onOpenChange, media = '(max-width: 640px)' }) {
  const ubah = useRef(onOpenChange)
  useLayoutEffect(() => {
    ubah.current = onOpenChange
  })
  const lembar = useRef(null)

  const pasang = useCallback(
    (el) => {
      if (!el) return
      const pasangan = pasangLembar(el, media, (buka) => ubah.current(buka))
      lembar.current = pasangan
      return () => {
        pasangan.lepaskan()
        if (lembar.current === pasangan) lembar.current = null
      }
    },
    [media],
  )

  const tutup = useCallback(() => {
    if (lembar.current) lembar.current.tutup()
    else ubah.current(false)
  }, [])

  const gantiBuka = useCallback((buka) => (buka ? ubah.current(true) : tutup()), [tutup])

  return { pasang, onOpenChange: gantiBuka, tutup }
}
