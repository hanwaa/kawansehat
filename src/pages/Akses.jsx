import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from 'react-aria-components'
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react'
import AksesKontrol from '../components/AksesKontrol.jsx'
import ListenButton from '../components/ListenButton.jsx'
import SignVideo from '../components/SignVideo.jsx'
import Maskot from '../illustrations/Maskot.jsx'
import { useJudulHalaman } from '../components/useJudulHalaman.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import { PROFIL } from '../prefs/presets.js'
import './akses.css'

const CONTOH = {
  anak: { judul: 'Minum air putih, yuk!', teks: 'Air putih bikin badan segar dan tetap semangat belajar.' },
  remaja: { judul: 'Tetap fokus seharian', teks: 'Minum air putih yang cukup membantu kamu tetap konsentrasi saat belajar.' },
  dewasa: { judul: 'Cukupi cairan tubuh', teks: 'Penuhi kebutuhan cairan harian Anda, terutama dari air putih.' },
  lansia: { judul: 'Jangan lupa minum', teks: 'Bapak/Ibu, minum air putih sedikit-sedikit tapi sering.' },
}

export default function Akses() {
  const { profil, pilih } = usePrefs()
  const navigate = useNavigate()
  const pratinjau = useRef(null)
  useJudulHalaman('Atur kenyamanan')
  const contoh = CONTOH[profil]

  return (
    <div className="wadah akses">
      <div className="judul-halaman">
        <p className="label-kecil">Langkah 2 dari 2 · Profil {PROFIL[profil].label}</p>
        <h1>
          {pilih({
            anak: 'Atur supaya nyaman, yuk!',
            remaja: 'Atur tampilan sesukamu',
            dewasa: 'Atur kenyamanan tampilan',
            lansia: 'Atur supaya mudah dibaca',
          })}
        </h1>
        <p>Semua pilihan bisa dipadukan. Hasilnya langsung terlihat di contoh.</p>
      </div>

      <div className="akses__isi">
        <section aria-labelledby="judul-pengaturan">
          <h2 id="judul-pengaturan" className="visual-tersembunyi">
            Pengaturan
          </h2>
          <AksesKontrol />
        </section>

        <section className="akses__pratinjau" aria-labelledby="judul-pratinjau">
          <h2 id="judul-pratinjau" className="label-kecil">
            <Eye aria-hidden="true" width="18" height="18" /> Contoh tampilan
          </h2>
          <div className="kartu" ref={pratinjau}>
            <div className="baris" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <Maskot pose="jempol" ukuran={72} />
              <div>
                <h3>{contoh.judul}</h3>
                <p>{contoh.teks}</p>
              </div>
            </div>
            <ListenButton target={pratinjau} />
            <SignVideo transkrip={`${contoh.judul}. ${contoh.teks}`} />
          </div>
        </section>
      </div>

      <div className="baris akses__aksi">
        <Button
          className="tombol tombol--utama tombol--besar"
          onPress={() => navigate('/beranda', { state: { tawarTur: true } })}
        >
          Simpan dan mulai <ArrowRight aria-hidden="true" />
        </Button>
        <Link to="/" className="tombol tombol--teks">
          <ArrowLeft aria-hidden="true" /> Ganti profil
        </Link>
      </div>
    </div>
  )
}
