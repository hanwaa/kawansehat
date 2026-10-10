import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, CalendarCheck } from 'lucide-react'
import ListenButton from '../../components/ListenButton.jsx'
import SignVideo from '../../components/SignVideo.jsx'
import Sumber from '../../components/Sumber.jsx'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import { DBD, VARIAN_DBD } from '../../content/topik/dbd.jsx'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import NotFound from '../NotFound.jsx'
import './info.css'

const TOPIK = { dbd: { data: DBD, varian: VARIAN_DBD } }

export default function InfoTopik() {
  const { topik } = useParams()
  const { profil } = usePrefs()
  const artikel = useRef(null)
  const ada = TOPIK[topik]
  useJudulHalaman(ada ? ada.data.judul[profil] : 'Halaman tidak ditemukan')
  if (!ada) return <NotFound />

  const { data, varian } = ada
  const Isi = varian[profil]

  return (
    <article className={`wadah ${profil === 'lansia' ? 'wadah--sempit' : ''} topik topik--${profil}`} ref={artikel}>
      <Link to="/info" className="tombol tombol--teks topik__kembali" data-tidak-dibaca>
        <ArrowLeft aria-hidden="true" /> Semua topik
      </Link>
      <header className="judul-halaman">
        <h1>{data.judul[profil]}</h1>
        <p>{data.ringkasan[profil]}</p>
        <p className="label-kecil" data-tidak-dibaca>
          <CalendarCheck aria-hidden="true" width="16" height="16" /> Ditinjau {data.ditinjau} · sumber Kemenkes
        </p>
        <div className="topik__dengar">
          <ListenButton target={artikel} label={profil === 'lansia' ? 'Dengarkan halaman ini' : 'Dengarkan'} />
        </div>
      </header>
      <SignVideo transkrip={data.transkrip[profil]} />
      <div className="topik__isi">
        <Isi />
      </div>
      <footer className="topik__kaki" data-tidak-dibaca>
        <Sumber ids={data.sumber} />
        <p className="bantuan">Informasi ini untuk edukasi dan tidak menggantikan pemeriksaan tenaga kesehatan.</p>
      </footer>
    </article>
  )
}
