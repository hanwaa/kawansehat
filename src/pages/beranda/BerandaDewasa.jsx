import { useRef } from 'react'
import { Link } from 'react-router'
import { ClipboardList, Pill, Salad, Ticket, Video } from 'lucide-react'
import ListenButton from '../../components/ListenButton.jsx'
import { AdeganPuskesmas, NyamukNakal } from '../../illustrations/Adegan.jsx'
import { baca } from '../../lib/simpan.js'

const LAYANAN = [
  { ke: '/layanan/antrean?jenis=datang', Ikon: ClipboardList, judul: 'Ambil antrean puskesmas', ket: 'Pilih poli, jadwal, dan kebutuhan khusus.', tur: true },
  { ke: '/layanan/antrean?jenis=online', Ikon: Video, judul: 'Konsultasi online', ket: 'Video call dengan tenaga kesehatan, bisa dengan juru bahasa isyarat.' },
  { ke: '/cek-gizi', Ikon: Salad, judul: 'Cek gizi & tubuh', ket: 'IMT, kebutuhan gizi harian, dan nilai gizi makanan.' },
  { ke: '/pengingat-obat', Ikon: Pill, judul: 'Pengingat obat', ket: 'Jadwal minum obat untuk Anda atau keluarga.' },
]

export function TiketAktif() {
  const tiket = baca('ks-tiket', null)
  if (!tiket) return null
  return (
    <Link to="/layanan/tiket" className="kartu kartu--tautan kartu--aksen tiket-aktif" data-tour="tiket-aktif">
      <span className="baris">
        <Ticket aria-hidden="true" />
        <strong>Antrean aktif: {tiket.nomor}</strong>
      </span>
      <span>
        {tiket.puskesmas} · {tiket.tanggalLabel}
      </span>
      <span className="kartu__aksi">Lihat tiket</span>
    </Link>
  )
}

export default function BerandaDewasa() {
  const isi = useRef(null)
  return (
    <div className="wadah beranda beranda--dewasa" ref={isi}>
      <section className="pahlawan">
        <div className="pahlawan__teks">
          <h1>Layanan kesehatan yang mudah untuk semua</h1>
          <p>Ambil antrean puskesmas, konsultasi, dan cek gizi keluarga dalam satu tempat.</p>
          <div data-tour="dengarkan">
            <ListenButton target={isi} />
          </div>
        </div>
        <AdeganPuskesmas className="pahlawan__gambar" />
      </section>

      <TiketAktif />

      <section aria-labelledby="judul-layanan" className="bagian">
        <h2 id="judul-layanan">Layanan</h2>
        <ul className="kisi kisi--2 layanan-daftar" role="list">
          {LAYANAN.map(({ ke, Ikon, judul, ket, tur }) => (
            <li key={ke} data-tour={tur ? 'aksi-utama' : undefined}>
              <Link to={ke} className="kartu kartu--tautan layanan-kartu">
                <span className="ikon-bulat">
                  <Ikon aria-hidden="true" />
                </span>
                <div>
                  <h3>{judul}</h3>
                  <span className="teks-redup">{ket}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="judul-info">
        <h2 id="judul-info">Info untuk keluarga</h2>
        <Link to="/info/dbd" className="kartu kartu--tautan info-sorot">
          <NyamukNakal className="info-sorot__gambar" />
          <div>
            <span className="label-kecil">Waspada musim hujan</span>
            <h3>Demam berdarah: gejala, tanda bahaya, dan pencegahan</h3>
            <span className="kartu__aksi">Baca selengkapnya</span>
          </div>
        </Link>
      </section>
    </div>
  )
}
