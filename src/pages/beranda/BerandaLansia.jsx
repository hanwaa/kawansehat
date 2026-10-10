import { useRef } from 'react'
import { Link } from 'react-router'
import { BookOpen, ClipboardList, Pill, Scale } from 'lucide-react'
import ListenButton from '../../components/ListenButton.jsx'
import { TiketAktif } from './BerandaDewasa.jsx'

const TOMBOL = [
  { ke: '/layanan/antrean?jenis=datang', Ikon: ClipboardList, judul: 'Ambil Antrean', ket: 'Daftar ke puskesmas' },
  { ke: '/pengingat-obat', Ikon: Pill, judul: 'Minum Obat', ket: 'Lihat jadwal obat' },
  { ke: '/info/dbd', Ikon: BookOpen, judul: 'Info Kesehatan', ket: 'Baca atau dengarkan' },
  { ke: '/cek-gizi/imt', Ikon: Scale, judul: 'Cek Badan', ket: 'Berat badan sehat atau tidak' },
]

function sapaan() {
  const jam = new Date().getHours()
  if (jam < 11) return 'Selamat pagi'
  if (jam < 15) return 'Selamat siang'
  if (jam < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export default function BerandaLansia() {
  const isi = useRef(null)
  return (
    <div className="wadah wadah--sempit beranda beranda--lansia" ref={isi}>
      <h1>{sapaan()}, Bapak/Ibu</h1>
      <p className="beranda-lansia__ket">Silakan pilih yang ingin dilakukan.</p>
      <div data-tour="dengarkan" className="beranda-lansia__dengar">
        <ListenButton target={isi} label="Dengarkan halaman ini" className="tombol--besar" />
      </div>

      <TiketAktif />

      <ul className="tombol-raksasa" role="list" data-tour="aksi-utama">
        {TOMBOL.map(({ ke, Ikon, judul, ket }) => (
          <li key={ke}>
            <Link to={ke} className="tombol-raksasa__item">
              <Ikon aria-hidden="true" />
              <span>
                <strong>{judul}</strong>
                <span>{ket}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
