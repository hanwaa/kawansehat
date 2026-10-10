import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import Maskot from '../illustrations/Maskot.jsx'
import { IsyaratContoh } from '../illustrations/Adegan.jsx'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import { bacakan, hentikan } from '../lib/suara.js'
import { beriLencana } from '../lib/lencana.js'
import { cariTarget } from './target.js'
import './tour.css'

const JARAK = 14

const batasi = (n, min, max) => Math.max(min, Math.min(n, max))

// Di bawah lebar ini balon berupa lembar selebar layar (lihat hitungPosisi).
const LEBAR_LEMBAR = 640

// `ekor` = sisi balon tempat ekor penunjuk berada dan jaraknya dari sudut, supaya balon jelas menunjuk targetnya.
function hitungPosisi(rect, tinggiTerukur) {
  const lebarLayar = window.innerWidth
  const tinggiLayar = window.innerHeight
  if (!rect) return { gaya: {}, kelas: 'tur-balon--tengah' }
  // Di layar kecil, balon menempel di bawah (atau di atas bila target ada di bagian bawah).
  if (lebarLayar < LEBAR_LEMBAR) {
    const targetDiBawah = rect.top + rect.height / 2 > tinggiLayar * 0.55
    return { gaya: {}, kelas: targetDiBawah ? 'tur-balon--atas' : 'tur-balon--bawah' }
  }
  // Tinggi balon diukur setelah tampil; sebelum itu dipakai perkiraan yang ikut membesar bersama ukuran teks.
  const skala = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16
  const tinggiBalon = tinggiTerukur || 300 * skala
  const lebar = Math.min(400 * Math.min(skala, 1.25), lebarLayar - 32)
  const left = batasi(rect.left + rect.width / 2 - lebar / 2, 16, lebarLayar - lebar - 16)
  // Ekor menunjuk ke tengah target, tetapi tidak keluar dari sudut balon yang membulat.
  const ekorX = batasi(rect.left + rect.width / 2 - left, 28, lebar - 28)
  if (rect.bottom + JARAK + tinggiBalon < tinggiLayar) {
    return {
      gaya: { top: rect.bottom + JARAK, left, width: lebar },
      kelas: 'tur-balon--melayang',
      ekor: { sisi: 'atas', posisi: ekorX },
    }
  }
  if (rect.top - JARAK - tinggiBalon > 0) {
    return {
      gaya: { top: rect.top - JARAK, left, width: lebar, transform: 'translateY(-100%)' },
      kelas: 'tur-balon--melayang',
      ekor: { sisi: 'bawah', posisi: ekorX },
    }
  }
  // Target terlalu besar: letakkan di samping bila muat, kalau tidak di bawah tengah layar.
  const top = batasi(rect.top, 16, tinggiLayar - tinggiBalon - 16)
  const ekorY = batasi(rect.top + rect.height / 2 - top, 28, tinggiBalon - 28)
  if (lebarLayar - rect.right - JARAK > lebar + 16) {
    return { gaya: { top, left: rect.right + JARAK, width: lebar }, kelas: 'tur-balon--melayang', ekor: { sisi: 'kiri', posisi: ekorY } }
  }
  if (rect.left - JARAK > lebar + 16) {
    return { gaya: { top, left: rect.left - JARAK - lebar, width: lebar }, kelas: 'tur-balon--melayang', ekor: { sisi: 'kanan', posisi: ekorY } }
  }
  return { gaya: { bottom: 16, left: (lebarLayar - lebar) / 2, width: lebar }, kelas: 'tur-balon--melayang' }
}

export default function MascotTour({ status, setStatus, onTutup }) {
  const { profil, prefs, pilih } = usePrefs()
  const idTeks = useId()
  const [target, setTarget] = useState({ sesi: null, rect: null })

  // Langkah & sapaan sudah disusun TourProvider untuk halaman ini (teks sesuai profil).
  const langkah = status.langkah
  const diTawar = status.tahap === 'tawar'
  const sekarang = diTawar ? null : langkah[status.indeks]
  const terakhir = !diTawar && status.indeks === langkah.length - 1
  const isi = diTawar ? status.sapaan : sekarang
  const kunci = status.terbuka && sekarang ? `${status.sesi}-${profil}-${status.indeks}` : null

  // Cari & ukur target setiap langkah berganti, juga saat layar di-scroll atau diubah ukurannya.
  useLayoutEffect(() => {
    if (!kunci) return
    const el = cariTarget(sekarang.target)
    const ukur = () => setTarget({ sesi: status.sesi, rect: el ? el.getBoundingClientRect() : null })
    const bingkai = requestAnimationFrame(ukur)
    if (!el) return () => cancelAnimationFrame(bingkai)
    // Layar lebar: target di tengah, balon di sampingnya. Di HP posisinya diatur efek berikutnya.
    if (window.innerWidth >= LEBAR_LEMBAR) el.scrollIntoView({ block: 'center', behavior: 'instant' })
    window.addEventListener('resize', ukur)
    window.addEventListener('scroll', ukur, true)
    return () => {
      cancelAnimationFrame(bingkai)
      window.removeEventListener('resize', ukur)
      window.removeEventListener('scroll', ukur, true)
    }
  }, [kunci, sekarang, status.sesi])
  // Posisi terakhir dipertahankan sampai posisi baru terukur: sorotan & balon meluncur ke target berikutnya
  // tanpa satu frame pun kosong, dan tetap di tempat selama animasi keluar. Tur baru mulai dari nol.
  const rect = target.sesi === status.sesi ? target.rect : null

  // Ukur tinggi balon yang sebenarnya (berubah bersama isi langkah dan ukuran teks). flushSync: posisi yang
  // benar sudah dipakai sebelum frame berikutnya digambar.
  const balon = useRef(null)
  const [tinggiBalon, setTinggiBalon] = useState(0)
  useLayoutEffect(() => {
    const el = balon.current
    if (!status.terbuka || !el) return
    const pengamat = new ResizeObserver(() => flushSync(() => setTinggiBalon(el.offsetHeight)))
    pengamat.observe(el)
    return () => pengamat.disconnect()
  }, [status.terbuka])

  // HP: lembar panduan menutup bagian bawah layar, jadi target digulir ke ruang kosong antara header dan lembar
  // (di tengahnya bila muat, kalau tidak bagian atasnya). Diulang saat tinggi lembar berubah, misalnya karena
  // isi langkah atau ukuran teks. Target di header dan menu bawah tidak ikut bergulir, jadi dilewati.
  useLayoutEffect(() => {
    if (!kunci || window.innerWidth >= LEBAR_LEMBAR) return
    const el = cariTarget(sekarang.target)
    if (!el || el.closest('.kepala-situs')) return
    const akar = getComputedStyle(document.documentElement)
    const atas = (parseFloat(akar.getPropertyValue('--tinggi-kepala')) || 0) + 12
    const bawah = window.innerHeight - (tinggiBalon || window.innerHeight / 2) - 20
    const r = el.getBoundingClientRect()
    const sasaran = r.height <= bawah - atas ? atas + (bawah - atas - r.height) / 2 : atas
    window.scrollBy({ top: r.top - sasaran, behavior: 'instant' })
  }, [kunci, sekarang, tinggiBalon])

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

  const posisi = hitungPosisi(diTawar ? null : rect, tinggiBalon)
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
          style={{
            transform: `translate(${rect.left - pad}px, ${rect.top - pad}px)`,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          }}
        />
      ) : (
        <div className="tur-redup" aria-hidden="true" />
      )}
      <Modal ref={balon} className={`tur-balon ${posisi.kelas}`} style={posisi.gaya}>
        {posisi.ekor && (
          <span
            className="tur-balon__ekor"
            data-sisi={posisi.ekor.sisi}
            style={{ '--ekor': `${posisi.ekor.posisi}px` }}
            aria-hidden="true"
          />
        )}
        <Dialog key={`${status.tahap}-${status.indeks}`} className="tur-dialog" aria-describedby={idTeks}>
          {/* Teks yang panjang bergulir di sini; tombol di bawahnya selalu terlihat. */}
          <div className="tur-dialog__gulir">
            <div className="tur-dialog__isi">
              <Maskot pose={diTawar ? 'lambai' : sekarang.pose} ukuran={diTawar ? 112 : 84} />
              <div>
                {!diTawar && (
                  <p className="tur-dialog__langkah">
                    Langkah {status.indeks + 1} dari {langkah.length}
                  </p>
                )}
                <Heading slot="title" className="tur-dialog__judul">
                  {isi?.judul}
                </Heading>
                <p id={idTeks} className="tur-dialog__teks">
                  {isi?.teks}
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
          </div>
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
