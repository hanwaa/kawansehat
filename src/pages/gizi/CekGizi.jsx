import { Link } from 'react-router'
import { Calculator, Salad, Scale, Search, Users } from 'lucide-react'
import ForProfile from '../../components/ForProfile.jsx'
import Gelembung from '../../components/Gelembung.jsx'
import Sumber from '../../components/Sumber.jsx'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import PiringDiagram, { SEKTOR_PIRING } from '../../illustrations/PiringDiagram.jsx'
import { ISI_PIRINGKU } from '../../data/batas-ggl.js'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import './gizi.css'

function IsiPiringku() {
  const warna = Object.fromEntries(SEKTOR_PIRING.map((s) => [s.id, s.warna]))
  return (
    <section className="kartu isi-piringku" aria-labelledby="judul-piringku" data-tour="isi-piringku">
      <PiringDiagram className="isi-piringku__gambar" />
      <div>
        <h2 id="judul-piringku">Isi Piringku</h2>
        <p>Panduan porsi sekali makan dari Kementerian Kesehatan.</p>
        <ul className="isi-piringku__daftar" role="list">
          {ISI_PIRINGKU.map((k) => (
            <li key={k.id}>
              <span className="isi-piringku__warna" style={{ background: warna[k.id] }} aria-hidden="true" />
              <span>
                <strong>{k.label}</strong>: {k.porsi}
                <small>{k.fungsi}</small>
              </span>
            </li>
          ))}
        </ul>
        <Sumber ids={['isiPiringku']} />
      </div>
    </section>
  )
}

export default function CekGizi() {
  const { profil, pilih } = usePrefs()
  const judul = pilih({ anak: 'Piringku', lansia: 'Cek Badan & Makan Sehat', semua: 'Cek Gizi & Tubuh' })
  useJudulHalaman(judul)

  return (
    <div className={`wadah ${profil === 'lansia' ? 'wadah--sempit' : ''}`}>
      <header className="judul-halaman">
        <h1>{judul}</h1>
        <p>
          {pilih({
            anak: 'Yuk, belajar makan sehat sambil main!',
            remaja: 'Cek tubuh dan makananmu. Semua dihitung di perangkatmu, tidak dikirim ke mana pun.',
            dewasa: 'Hitung IMT, kebutuhan gizi harian, dan nilai gizi makanan keluarga Anda berdasarkan standar Kemenkes.',
            lansia: 'Pilih yang ingin Bapak/Ibu periksa.',
          })}
        </p>
      </header>

      <ForProfile only={['anak']}>
        <Link to="/cek-gizi/makanan" className="kartu kartu--tautan kartu--aksen gizi-utama" data-tour="main-piring">
          <Gelembung pose="jempol" kecil>
            <p>
              <strong>Main “Susun Isi Piringku”!</strong> Ketuk makanan dan isi piringmu sampai lengkap.
            </p>
          </Gelembung>
          <span className="kartu__aksi">Mulai main</span>
        </Link>
        <Link to="/cek-gizi/imt" className="kartu kartu--tautan gizi-ortu" data-tour="untuk-ortu">
          <span className="baris">
            <Users aria-hidden="true" />
            <strong>Untuk orang tua: cek tumbuh anak</strong>
          </span>
          <span className="teks-redup">IMT menurut umur dengan standar WHO yang dipakai Kemenkes.</span>
        </Link>
      </ForProfile>

      <ForProfile only={['remaja', 'dewasa', 'lansia']}>
        <ul className="kisi gizi-alat" role="list" data-tour="alat-gizi">
          <li>
            <Link to="/cek-gizi/imt" className="kartu kartu--tautan">
              <span className="ikon-bulat">
                <Scale aria-hidden="true" />
              </span>
              <h2>{pilih({ lansia: 'Cek berat badan', semua: 'Cek IMT' })}</h2>
              <p className="teks-redup">
                {pilih({
                  remaja: 'IMT menurut umur, standar khusus remaja.',
                  lansia: 'Berat badan Bapak/Ibu sehat atau tidak.',
                  semua: 'Indeks massa tubuh dan lingkar perut.',
                })}
              </p>
            </Link>
          </li>
          <li>
            <Link to="/cek-gizi/kebutuhan" className="kartu kartu--tautan">
              <span className="ikon-bulat">
                <Calculator aria-hidden="true" />
              </span>
              <h2>Kebutuhan gizi</h2>
              <p className="teks-redup">Angka Kecukupan Gizi harian sesuai umur dan jenis kelamin.</p>
            </Link>
          </li>
          <li>
            <Link to="/cek-gizi/makanan" className="kartu kartu--tautan">
              <span className="ikon-bulat">
                <Search aria-hidden="true" />
              </span>
              <h2>{pilih({ remaja: 'Cek jajanan & makanan', semua: 'Cek makanan' })}</h2>
              <p className="teks-redup">Nilai gizi makanan lokal dan rekap Piringku Hari Ini.</p>
            </Link>
          </li>
        </ul>
      </ForProfile>

      <div className="bagian">
        <IsiPiringku />
      </div>

      <p className="catatan" data-tambahan>
        <Salad aria-hidden="true" />
        <span>Hasil cek bersifat edukasi. Untuk saran yang sesuai kondisi Anda, konsultasikan ke puskesmas atau ahli gizi.</span>
      </p>
    </div>
  )
}
