import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { CalendarDays, Check, MapPin, Printer, Video, X } from 'lucide-react'
import Gelembung from '../../components/Gelembung.jsx'
import ListenButton from '../../components/ListenButton.jsx'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import { KEBUTUHAN } from '../../data/puskesmas.js'
import { bacakan } from '../../lib/suara.js'
import { baca, tulis } from '../../lib/simpan.js'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import './layanan.css'

const KONFIRMASI = {
  jbi: 'Juru bahasa isyarat BISINDO sudah dipesan dan akan mendampingi.',
  'kursi-roda': 'Kursi roda disiapkan di pintu masuk.',
  pendamping: 'Pendamping boleh ikut masuk ke ruang periksa.',
  prioritas: 'Anda masuk antrean prioritas.',
  teks: 'Teks percakapan (subtitle) aktif saat video call.',
  pembaca: 'Petugas akan membacakan dokumen untuk Anda.',
}

export default function Tiket() {
  const { profil, prefs } = usePrefs()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [tiket, setTiket] = useState(() => baca('ks-tiket', null))
  const [pengumuman, setPengumuman] = useState('')
  const kotak = useRef(null)
  useJudulHalaman(tiket ? `Tiket ${tiket.nomor}` : 'Tiket antrean')

  // Nomor antrean baru diumumkan ke pembaca layar dan dibacakan bila "Bacakan teks" aktif.
  useEffect(() => {
    if (!tiket || !state?.baru) return
    const kalimat = `Nomor antrean ${tiket.nomor.replace('-', '').split('').join(' ')}. ${tiket.tanggalLabel}, sesi ${tiket.sesi.label}.`
    const t = setTimeout(() => setPengumuman(kalimat), 600)
    if (prefs.suara) bacakan(kalimat, { kecepatan: profil === 'lansia' ? 0.9 : 1 })
    return () => clearTimeout(t)
  }, [tiket, state, prefs.suara, profil])

  if (!tiket) {
    return (
      <div className="wadah wadah--sempit">
        <header className="judul-halaman">
          <h1>Belum ada tiket antrean</h1>
          <p>Ambil antrean puskesmas atau pesan konsultasi online terlebih dahulu.</p>
        </header>
        <Link to="/layanan/antrean" className="tombol tombol--utama" data-tour="ambil-antrean">
          Ambil antrean
        </Link>
      </div>
    )
  }

  const batalkan = () => {
    try {
      localStorage.removeItem('ks-tiket')
    } catch {
      tulis('ks-tiket', null)
    }
    setTiket(null)
    navigate('/beranda')
  }

  const online = tiket.jenis === 'online'
  return (
    <div className="wadah wadah--sempit tiket-halaman">
      <header className="judul-halaman">
        <h1>{online ? 'Konsultasi berhasil dipesan' : 'Nomor antrean Anda'}</h1>
      </header>
      <div className="visual-tersembunyi" role="status">
        {pengumuman}
      </div>

      <section className="tiket" ref={kotak} aria-label="Tiket antrean" data-tour="tiket">
        <p className="tiket__label">Nomor antrean</p>
        <p className="tiket__nomor">{tiket.nomor}</p>
        <p className="tiket__nama">{tiket.nama}</p>
        <ul className="tiket__detail" role="list">
          <li>
            {online ? <Video aria-hidden="true" /> : <MapPin aria-hidden="true" />}
            <span>
              {tiket.puskesmas} · {tiket.layanan}
            </span>
          </li>
          <li>
            <CalendarDays aria-hidden="true" />
            <span>
              {tiket.tanggalLabel}, sesi {tiket.sesi.label.toLowerCase()} ({tiket.sesi.ket})
            </span>
          </li>
        </ul>
        {(tiket.kebutuhan.length > 0 || tiket.lainnya) && (
          <ul className="tiket__kebutuhan" role="list">
            {tiket.kebutuhan.map((id) => (
              <li key={id}>
                <Check aria-hidden="true" /> {KONFIRMASI[id] ?? KEBUTUHAN.find((k) => k.id === id)?.label}
              </li>
            ))}
            {tiket.lainnya && (
              <li>
                <Check aria-hidden="true" /> Catatan untuk petugas: {tiket.lainnya}
              </li>
            )}
          </ul>
        )}
        <p className="tiket__catatan">
          {online
            ? 'Tautan video call akan dikirim lewat SMS 15 menit sebelum jadwal.'
            : 'Datang 15 menit sebelum sesi dimulai dan tunjukkan nomor ini di loket.'}
        </p>
      </section>

      <Gelembung pose="jempol" kecil className="tiket__piko">
        <p>{profil === 'lansia' ? 'Sudah beres, Bapak/Ibu. Semoga lekas sehat!' : 'Beres! Simpan nomor ini, ya.'}</p>
      </Gelembung>

      <div className="baris tidak-dicetak">
        <div data-tour="dengarkan">
          <ListenButton target={kotak} label="Dengarkan tiket" />
        </div>
        <Button className="tombol" onPress={() => window.print()} data-tour="cetak">
          <Printer aria-hidden="true" /> Cetak / simpan PDF
        </Button>
        <DialogTrigger>
          <Button className="tombol tombol--teks" data-tour="batalkan">
            Batalkan antrean
          </Button>
          <ModalOverlay className="lapisan-dialog" isDismissable>
            <Modal className="modal">
              <Dialog className="dialog" role="alertdialog">
                {({ close }) => (
                  <>
                    <Heading slot="title">Batalkan antrean {tiket.nomor}?</Heading>
                    <p>Nomor ini akan diberikan ke orang lain dan tidak bisa dikembalikan.</p>
                    <div className="baris">
                      <Button className="tombol tombol--bahaya" onPress={batalkan}>
                        <X aria-hidden="true" /> Ya, batalkan
                      </Button>
                      <Button className="tombol" onPress={close} autoFocus>
                        Tidak jadi
                      </Button>
                    </div>
                  </>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      </div>
      <p className="bantuan">Prototipe: nomor antrean dan pesan tidak dikirim ke puskesmas sungguhan.</p>
    </div>
  )
}
