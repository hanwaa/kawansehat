import { useEffect, useId, useLayoutEffect, useState } from 'react'
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import Maskot from '../illustrations/Maskot.jsx'
import { IsyaratContoh } from '../illustrations/Adegan.jsx'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import { bacakan, hentikan } from '../lib/suara.js'
import { beriLencana } from '../lib/lencana.js'
import { LANGKAH_TUR, SAPAAN_TUR } from './steps.js'
import './tour.css'

const JARAK = 14

function cariTarget(nama) {
  const el = document.querySelector(`[data-tour="${nama}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 ? el : null
}

function hitungPosisi(rect) {
  const lebarLayar = window.innerWidth
  const tinggiLayar = window.innerHeight
  if (!rect) return { gaya: {}, kelas: 'tur-balon--tengah' }
  // Di layar kecil, balon menempel di bawah (atau di atas bila target ada di bagian bawah).
  if (lebarLayar < 640) {
    const targetDiBawah = rect.top + rect.height / 2 > tinggiLayar * 0.55
    return { gaya: {}, kelas: targetDiBawah ? 'tur-balon--atas' : 'tur-balon--bawah' }
  }
  // Perkiraan tinggi balon ikut membesar bersama ukuran teks pengguna.
  const skala = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16
  const tinggiBalon = 300 * skala
  const lebar = Math.min(400 * Math.min(skala, 1.25), lebarLayar - 32)
  const left = Math.min(Math.max(rect.left + rect.width / 2 - lebar / 2, 16), lebarLayar - lebar - 16)
  if (rect.bottom + JARAK + tinggiBalon < tinggiLayar) {
    return { gaya: { top: rect.bottom + JARAK, left, width: lebar }, kelas: 'tur-balon--melayang' }
  }
  if (rect.top - JARAK - tinggiBalon > 0) {
    return { gaya: { top: rect.top - JARAK, left, width: lebar, transform: 'translateY(-100%)' }, kelas: 'tur-balon--melayang' }
  }
  // Target terlalu besar: letakkan di samping bila muat, kalau tidak di bawah tengah layar.
  if (lebarLayar - rect.right - JARAK > lebar + 16) {
    return { gaya: { top: Math.max(16, Math.min(rect.top, tinggiLayar - tinggiBalon - 16)), left: rect.right + JARAK, width: lebar }, kelas: 'tur-balon--melayang' }
  }
  if (rect.left - JARAK > lebar + 16) {
    return { gaya: { top: Math.max(16, Math.min(rect.top, tinggiLayar - tinggiBalon - 16)), left: rect.left - JARAK - lebar, width: lebar }, kelas: 'tur-balon--melayang' }
  }
  return { gaya: { bottom: 16, left: (lebarLayar - lebar) / 2, width: lebar }, kelas: 'tur-balon--melayang' }
}

export default function MascotTour({ status, setStatus, onTutup }) {
  const { profil, prefs, pilih } = usePrefs()
  const idTeks = useId()
  const [target, setTarget] = useState({ kunci: null, rect: null })

  const langkah = LANGKAH_TUR[profil]
  const diTawar = status.tahap === 'tawar'
  const sekarang = diTawar ? null : langkah[status.indeks]
  const terakhir = !diTawar && status.indeks === langkah.length - 1
  const isi = diTawar ? SAPAAN_TUR[profil] : sekarang
  const kunci = status.terbuka && sekarang ? `${profil}-${status.indeks}` : null

  // Cari & ukur target setiap langkah berganti, juga saat layar di-scroll atau diubah ukurannya.
  useLayoutEffect(() => {
    if (!kunci) return
    const el = cariTarget(sekarang.target)
    if (!el) return
    el.scrollIntoView({ block: 'center', behavior: 'instant' })
    const ukur = () => setTarget({ kunci, rect: el.getBoundingClientRect() })
    const bingkai = requestAnimationFrame(ukur)
    window.addEventListener('resize', ukur)
    window.addEventListener('scroll', ukur, true)
    return () => {
      cancelAnimationFrame(bingkai)
      window.removeEventListener('resize', ukur)
      window.removeEventListener('scroll', ukur, true)
    }
  }, [kunci, sekarang])
  const rect = target.kunci === kunci ? target.rect : null

  // Bila "Bacakan teks" aktif, Si Kawal membacakan setiap langkah.
  useEffect(() => {
    if (!status.terbuka || !prefs.suara || !isi) return
    bacakan([isi.judul, isi.teks], { kecepatan: profil === 'lansia' ? 0.9 : 1 })
    return () => hentikan()
  }, [status.terbuka, status.tahap, status.indeks, prefs.suara, isi, profil])

  const ke = (indeks) => setStatus((s) => ({ ...s, tahap: 'langkah', indeks }))
  const selesai = () => {
    if (profil === 'anak') beriLencana('penjelajah')
    onTutup()
  }

  const posisi = hitungPosisi(diTawar ? null : rect)
  const pad = 8

  return (
    <ModalOverlay
      isOpen={status.terbuka}
      onOpenChange={(buka) => !buka && onTutup()}
      isDismissable={false}
      className="tur-lapisan"
    >
      {rect && !diTawar ? (
        <div
          className="tur-sorot"
          aria-hidden="true"
          style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
        />
      ) : (
        <div className="tur-redup" aria-hidden="true" />
      )}
      <Modal className={`tur-balon ${posisi.kelas}`} style={posisi.gaya}>
        <Dialog key={`${status.tahap}-${status.indeks}`} className="tur-dialog" aria-describedby={idTeks}>
          <div className="tur-dialog__isi">
            <Maskot pose={diTawar ? 'lambai' : sekarang.pose} ukuran={diTawar ? 112 : 84} />
            <div>
              {!diTawar && (
                <p className="tur-dialog__langkah">
                  Langkah {status.indeks + 1} dari {langkah.length}
                </p>
              )}
              <Heading slot="title" className="tur-dialog__judul">
                {isi.judul}
              </Heading>
              <p id={idTeks} className="tur-dialog__teks">
                {isi.teks}
              </p>
            </div>
          </div>
          {(diTawar || terakhir) && (
            <p className="tur-dialog__petunjuk">
              {pilih({
                anak: 'Mau jalan-jalan lagi? Ketuk aku di pojok kanan bawah, ya!',
                remaja: 'Butuh panduan lagi? Tekan tombol Si Kawal di pojok kanan bawah.',
                dewasa: 'Panduan bisa dibuka lagi kapan saja lewat tombol Si Kawal di pojok kanan bawah.',
                lansia: 'Bapak/Ibu bisa membuka panduan ini lagi lewat tombol Si Kawal di pojok kanan bawah.',
              })}
            </p>
          )}
          {prefs.isyarat && (
            <div className="tur-dialog__isyarat">
              <IsyaratContoh />
              <span>Video BISINDO (contoh)</span>
            </div>
          )}
          {diTawar ? (
            <div className="tur-dialog__aksi">
              <Button className="tombol tombol--utama" onPress={() => ke(0)} autoFocus>
                Ya, tunjukkan
              </Button>
              <Button className="tombol" onPress={onTutup}>
                Nanti saja
              </Button>
            </div>
          ) : (
            <div className="tur-dialog__aksi">
              {status.indeks > 0 && (
                <Button className="tombol" onPress={() => ke(status.indeks - 1)}>
                  <ArrowLeft aria-hidden="true" /> Kembali
                </Button>
              )}
              <Button className="tombol tombol--utama" onPress={terakhir ? selesai : () => ke(status.indeks + 1)} autoFocus>
                {terakhir ? (
                  <>
                    <Check aria-hidden="true" /> Selesai
                  </>
                ) : (
                  <>
                    Lanjut <ArrowRight aria-hidden="true" />
                  </>
                )}
              </Button>
              {!terakhir && (
                <Button className="tombol tombol--teks tur-dialog__lewati" onPress={onTutup}>
                  <X aria-hidden="true" /> Lewati tur
                </Button>
              )}
            </div>
          )}
          <div className="tur-dialog__titik" aria-hidden="true">
            {!diTawar && langkah.map((_, i) => <span key={i} className={i === status.indeks ? 'aktif' : ''} />)}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
