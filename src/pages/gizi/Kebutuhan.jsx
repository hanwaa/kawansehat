import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from 'react-aria-components'
import { ArrowLeft, Droplets } from 'lucide-react'
import { KolomAngka, PilihanRadio, PILIHAN_JK } from '../../components/Kolom.jsx'
import ListenButton from '../../components/ListenButton.jsx'
import Sumber from '../../components/Sumber.jsx'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import { TAMBAHAN, ZAT_GIZI } from '../../data/akg-2019.js'
import { BATAS_GGL } from '../../data/batas-ggl.js'
import { akgDenganTambahan, bacaAngka, cariAKG } from '../../lib/gizi.js'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import { useDataDiri } from './dataDiri.js'
import './gizi.css'

const KONDISI = [{ id: 'tidak', label: 'Tidak ada' }, ...Object.entries(TAMBAHAN).map(([id, t]) => ({ id, label: t.label }))]

// Mode anak & remaja tidak menampilkan target energi (kalori) supaya fokus pada pola makan, bukan angka.
const TAMPIL = {
  anak: ['protein', 'serat', 'air'],
  remaja: ['protein', 'serat', 'air'],
  dewasa: ['energi', 'protein', 'lemak', 'karbo', 'serat', 'air'],
  lansia: ['energi', 'protein', 'serat', 'air'],
}

const angka = (n) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 })

export default function Kebutuhan() {
  const { profil, pilih } = usePrefs()
  const [dataDiri, simpanDataDiri] = useDataDiri(profil)
  const [form, setForm] = useState({ jk: dataDiri.jk, umurTahun: dataDiri.umurTahun, kondisi: 'tidak' })
  const [galat, setGalat] = useState({})
  const [akg, setAkg] = useState(null)
  const judulHasil = useRef(null)
  const kotakHasil = useRef(null)
  useJudulHalaman('Kebutuhan gizi harian')

  const ubah = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))
  const umur = bacaAngka(form.umurTahun)
  const bisaHamil = form.jk === 'perempuan' && umur >= 10 && umur <= 55

  const hitung = (e) => {
    e.preventDefault()
    const g = {}
    if (!form.jk) g.jk = 'Pilih jenis kelamin.'
    if (!Number.isInteger(umur) || umur < 1 || umur > 120) g.umurTahun = 'Isi umur dalam tahun, angka bulat 1–120.'
    setGalat(g)
    if (Object.keys(g).length) {
      setAkg(null)
      requestAnimationFrame(() => document.querySelector('.kolom[data-invalid] input, [aria-invalid="true"]')?.focus())
      return
    }
    simpanDataDiri({ ...dataDiri, jk: form.jk, umurTahun: form.umurTahun })
    const dasar = cariAKG(umur, form.jk)
    setAkg(bisaHamil && form.kondisi !== 'tidak' ? akgDenganTambahan(dasar, form.kondisi) : dasar)
    requestAnimationFrame(() => judulHasil.current?.focus())
  }

  return (
    <div className="wadah wadah--sempit">
      <Link to="/cek-gizi" className="tombol tombol--teks topik__kembali">
        <ArrowLeft aria-hidden="true" /> {pilih({ anak: 'Piringku', semua: 'Cek Gizi' })}
      </Link>
      <header className="judul-halaman">
        <h1>Kebutuhan gizi harian</h1>
        <p>Angka Kecukupan Gizi (AKG) rata-rata per orang per hari dari Kementerian Kesehatan.</p>
      </header>

      <form className="kartu form-gizi" onSubmit={hitung} noValidate>
        <PilihanRadio label="Jenis kelamin" nilai={form.jk} onChange={ubah('jk')} pilihan={PILIHAN_JK} galat={galat.jk} kisi orientasi="horizontal" />
        <KolomAngka label="Umur" satuan="tahun" nilai={form.umurTahun} onChange={ubah('umurTahun')} galat={galat.umurTahun} inputMode="numeric" />
        {bisaHamil && (
          <PilihanRadio label="Sedang hamil atau menyusui?" nilai={form.kondisi} onChange={ubah('kondisi')} pilihan={KONDISI} kisi />
        )}
        <Button type="submit" className="tombol tombol--utama tombol--besar">
          Lihat kebutuhan
        </Button>
      </form>

      {akg && (
        <section className="kartu hasil-gizi" aria-labelledby="judul-akg" ref={kotakHasil}>
          <p className="label-kecil">Untuk {akg.label}</p>
          <h2 id="judul-akg" tabIndex={-1} ref={judulHasil}>
            {pilih({ anak: 'Yang dibutuhkan tubuhmu setiap hari', remaja: 'Kebutuhan harianmu', lansia: 'Kebutuhan harian Bapak/Ibu', semua: 'Kebutuhan harian' })}
          </h2>
          <dl className="akg-daftar">
            {ZAT_GIZI.filter((z) => TAMPIL[profil].includes(z.id)).map((z) => (
              <div key={z.id} className="akg-daftar__item">
                <dt>{z.id === 'air' ? 'Air (dari minuman dan makanan)' : z.label}</dt>
                <dd>
                  {angka(akg[z.id])} <span>{z.satuan}</span>
                </dd>
              </div>
            ))}
          </dl>
          {umur >= 13 && (
            <p className="catatan">
              <Droplets aria-hidden="true" />
              <span>Pedoman Gizi Seimbang: remaja dan dewasa dengan kegiatan ringan butuh sekitar 8 gelas minuman sehari.</span>
            </p>
          )}
          {(profil === 'anak' || profil === 'remaja') && (
            <p className="bantuan">
              Angka energi (kalori) sengaja tidak ditampilkan di mode ini. Fokus pada pola makan lengkap sesuai Isi Piringku.
            </p>
          )}
          <h3>Batas aman per hari</h3>
          <ul className="ggl-daftar" role="list">
            {Object.entries(BATAS_GGL).map(([id, b]) => (
              <li key={id}>
                <strong>{b.label}</strong> maksimal {angka(b.batas)} {b.satuan}
              </li>
            ))}
          </ul>
          <ListenButton target={kotakHasil} label="Dengarkan" />
          <div data-tidak-dibaca>
            <Sumber ids={['akg', 'ggl', 'pgs']} />
          </div>
        </section>
      )}
    </div>
  )
}
