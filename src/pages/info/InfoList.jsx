import { Link } from 'react-router'
import { Clock, Salad } from 'lucide-react'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import { NyamukNakal } from '../../illustrations/Adegan.jsx'
import { DBD } from '../../content/topik/dbd.jsx'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import './info.css'

const SEGERA = {
  anak: ['Cuci tangan pakai sabun', 'Gosok gigi yang benar'],
  remaja: ['Kesehatan mental & stres ujian', 'Pubertas'],
  dewasa: ['Hipertensi', 'Imunisasi anak'],
  lansia: ['Tekanan darah tinggi', 'Kencing manis'],
}

export default function InfoList() {
  const { profil, pilih } = usePrefs()
  const judul = pilih({ anak: 'Ayo belajar!', remaja: 'Info kesehatan', dewasa: 'Info kesehatan', lansia: 'Info kesehatan' })
  useJudulHalaman(judul)

  return (
    <div className={`wadah ${profil === 'lansia' ? 'wadah--sempit' : ''}`}>
      <header className="judul-halaman">
        <h1>{judul}</h1>
        <p>
          {pilih({
            anak: 'Pilih cerita yang mau kamu baca.',
            remaja: 'Singkat, jelas, dan dari sumber resmi.',
            dewasa: 'Disusun dari sumber resmi Kementerian Kesehatan dan disesuaikan dengan tampilan Anda.',
            lansia: 'Pilih topik. Semua bisa dibacakan.',
          })}
        </p>
      </header>
      <ul className="kisi kisi--2" role="list" data-tour="daftar-topik">
        <li>
          <Link to="/info/dbd" className="kartu kartu--tautan topik-kartu">
            <NyamukNakal className="topik-kartu__gambar" />
            <h2>{DBD.judul[profil]}</h2>
            <p>{DBD.ringkasan[profil]}</p>
            <span className="kartu__aksi">Baca</span>
          </Link>
        </li>
        <li>
          <Link to="/cek-gizi" className="kartu kartu--tautan topik-kartu">
            <span className="ikon-bulat topik-kartu__ikon">
              <Salad aria-hidden="true" />
            </span>
            <h2>{pilih({ anak: 'Isi Piringku', lansia: 'Makan sehat', semua: 'Gizi seimbang & Isi Piringku' })}</h2>
            <p>
              {pilih({
                anak: 'Susun piring makan yang sehat dan lengkap.',
                lansia: 'Cek berat badan dan anjuran makan.',
                semua: 'Cek IMT, kebutuhan gizi harian, dan nilai gizi makananmu.',
              })}
            </p>
            <span className="kartu__aksi">Buka</span>
          </Link>
        </li>
      </ul>
      <section className="bagian" aria-labelledby="judul-segera" data-tour="segera-hadir">
        <h2 id="judul-segera" className="label-kecil">
          <Clock aria-hidden="true" width="16" height="16" /> Segera hadir
        </h2>
        <ul className="segera" role="list">
          {SEGERA[profil].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
