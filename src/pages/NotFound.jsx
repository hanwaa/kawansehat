import { Link } from 'react-router'
import Gelembung from '../components/Gelembung.jsx'
import { useJudulHalaman } from '../components/useJudulHalaman.js'

export default function NotFound() {
  useJudulHalaman('Halaman tidak ditemukan')
  return (
    <div className="wadah wadah--sempit judul-halaman">
      <h1>Halaman tidak ditemukan</h1>
      <Gelembung pose="pikir" ukuran={120}>
        <p>Hmm, Piko tidak menemukan halaman ini. Mungkin alamatnya salah ketik.</p>
      </Gelembung>
      <p style={{ marginTop: 'var(--r5)' }}>
        <Link to="/beranda" className="tombol tombol--utama" data-tour="kembali-beranda">
          Kembali ke beranda
        </Link>
      </p>
    </div>
  )
}
