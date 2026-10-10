import { useRef } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, Lock } from 'lucide-react'
import ListenButton from '../../components/ListenButton.jsx'
import { StikerBintang, StikerPetir } from '../../illustrations/Adegan.jsx'

const KARTU = [
  { ke: '/info/dbd', label: 'Mitos vs Fakta', judul: 'DBD cuma muncul pas musim hujan?', ket: 'Cek faktanya dan cara cegahnya.', durasi: '2 menit baca', warna: 'ungu' },
  { ke: '/cek-gizi/makanan', label: 'Gizi', judul: 'Jajananmu hari ini aman?', ket: 'Hitung gula, garam, dan lemak dari makananmu.', durasi: '1 menit', warna: 'tosca' },
  { ke: '/cek-gizi/imt', label: 'Tubuh', judul: 'IMT sesuai umurmu', ket: 'Remaja pakai standar khusus, bukan rumus dewasa.', durasi: '1 menit', warna: 'kuning' },
  { ke: '/layanan/antrean', label: 'Layanan', judul: 'Perlu ke puskesmas?', ket: 'Ambil antrean sendiri, termasuk juru bahasa isyarat.', durasi: '3 menit', warna: 'koral' },
]

export default function BerandaRemaja() {
  const isi = useRef(null)
  return (
    <div className="wadah beranda beranda--remaja" ref={isi}>
      <header className="beranda-remaja__kepala">
        <div>
          <p className="label-kecil">Kawan Sehat · Remaja</p>
          <h1>Hai! Mau cek apa hari ini?</h1>
          <p>Info kesehatan singkat, jelas, tanpa ribet.</p>
          <div data-tour="dengarkan">
            <ListenButton target={isi} />
          </div>
        </div>
        <div className="beranda-remaja__stiker" data-tambahan aria-hidden="true">
          <StikerBintang />
          <StikerPetir />
        </div>
      </header>

      <ul className="umpan" role="list" data-tour="aksi-utama">
        {KARTU.map((k) => (
          <li key={k.ke}>
            <Link to={k.ke} className={`kartu kartu--tautan umpan__kartu umpan__kartu--${k.warna}`}>
              <span className="umpan__label">{k.label}</span>
              <h2>{k.judul}</h2>
              <p>{k.ket}</p>
              <span className="kartu__aksi">
                {k.durasi} <ArrowUpRight aria-hidden="true" width="18" height="18" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="catatan">
        <Lock aria-hidden="true" />
        <span>Privasi aman: semua cek dihitung di perangkatmu dan tidak dikirim ke mana pun.</span>
      </p>
    </div>
  )
}
