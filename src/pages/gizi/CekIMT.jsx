import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from 'react-aria-components'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { KolomAngka, PilihanRadio, PILIHAN_JK } from '../../components/Kolom.jsx'
import Gelembung from '../../components/Gelembung.jsx'
import ListenButton from '../../components/ListenButton.jsx'
import Sumber from '../../components/Sumber.jsx'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import {
  bacaAngka,
  KATEGORI_IMT_DEWASA,
  KATEGORI_IMT_U,
  nilaiStatusGizi,
  rentangBeratNormal,
} from '../../lib/gizi.js'
import { bacakan } from '../../lib/suara.js'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import { useDataDiri } from './dataDiri.js'
import './gizi.css'

const angka = (n) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 })

function validasi(f) {
  const g = {}
  const umur = bacaAngka(f.umurTahun)
  const bulan = f.umurBulan === '' ? 0 : bacaAngka(f.umurBulan)
  const berat = bacaAngka(f.berat)
  const tinggi = bacaAngka(f.tinggi)
  const perut = f.perut === '' ? null : bacaAngka(f.perut)
  if (!f.jk) g.jk = 'Pilih jenis kelamin.'
  if (!Number.isInteger(umur) || umur < 1 || umur > 120) g.umurTahun = 'Isi umur dalam tahun, angka bulat 1–120.'
  if (umur < 19 && (!Number.isInteger(bulan) || bulan < 0 || bulan > 11)) g.umurBulan = 'Isi bulan 0–11.'
  if (!(berat >= 2 && berat <= 300)) g.berat = 'Isi berat badan 2–300 kg. Gunakan koma untuk desimal, misalnya 52,5.'
  if (!(tinggi >= 50 && tinggi <= 250)) g.tinggi = 'Isi tinggi badan 50–250 cm.'
  if (perut !== null && !(perut >= 30 && perut <= 250)) g.perut = 'Isi lingkar perut 30–250 cm, atau kosongkan.'
  return { g, nilai: { umurTahun: umur, umurBulan: umur < 19 ? bulan : 0, beratKg: berat, tinggiCm: tinggi, lingkarPerutCm: perut, jk: f.jk } }
}

// Kalimat hasil disesuaikan dengan profil; bahasa tidak menghakimi dan selalu mengarah ke tenaga kesehatan.
function kalimatHasil(hasil, profil) {
  if (hasil.metode === 'balita') {
    return {
      judul: 'Untuk balita, pakai Buku KIA di posyandu',
      teks: 'Pertumbuhan anak di bawah 5 tahun dipantau dengan grafik khusus balita di Buku KIA. Timbang dan ukur rutin di posyandu.',
      nada: 'baik',
    }
  }
  const tabel = hasil.metode === 'imt-u' ? KATEGORI_IMT_U : KATEGORI_IMT_DEWASA
  const k = tabel[hasil.kategori]
  const subjek = { anak: 'Anak', remaja: 'Kamu', dewasa: 'Anda', lansia: 'Bapak/Ibu' }[profil]
  const judul =
    profil === 'lansia'
      ? `Berat badan Bapak/Ibu termasuk ${k.label.toLowerCase()}`
      : profil === 'remaja' && hasil.metode === 'imt-u'
        ? `Status gizimu menurut umur: ${k.label.toLowerCase()}`
        : `${k.label} · ${k.arti}`
  let teks
  if (k.nada === 'baik') {
    teks = `${subjek} bisa mempertahankannya dengan makan sesuai Isi Piringku, aktif bergerak, dan menimbang berat badan secara rutin.`
  } else if (hasil.kategori.includes('kurang') || hasil.kategori.includes('kurus') || hasil.kategori === 'gizi-buruk') {
    teks = 'Sebaiknya periksa ke puskesmas untuk mengetahui penyebabnya dan cara menaikkan berat badan dengan aman.'
  } else {
    teks = 'Sebaiknya konsultasi ke puskesmas. Mulai dari kebiasaan kecil: perbanyak sayur dan buah, batasi minuman manis, dan aktif bergerak setiap hari.'
  }
  if (profil === 'remaja' && k.nada !== 'baik') teks = `Ini bukan penilaian tentang dirimu. ${teks}`
  return { judul, teks, nada: k.nada }
}

function SkalaIMT({ imt }) {
  const min = 14
  const max = 32
  const posisi = ((Math.min(Math.max(imt, min), max) - min) / (max - min)) * 100
  const batas = [17, 18.5, 25, 27].map((b) => ((b - min) / (max - min)) * 100)
  return (
    <div className="skala-imt" aria-hidden="true">
      <div className="skala-imt__jalur">
        <span style={{ width: `${batas[0]}%` }} className="s1" />
        <span style={{ width: `${batas[1] - batas[0]}%` }} className="s2" />
        <span style={{ width: `${batas[2] - batas[1]}%` }} className="s3" />
        <span style={{ width: `${batas[3] - batas[2]}%` }} className="s2" />
        <span style={{ width: `${100 - batas[3]}%` }} className="s1" />
      </div>
      <div className="skala-imt__penanda" style={{ left: `${posisi}%` }}>
        <span>{angka(imt)}</span>
      </div>
      <div className="skala-imt__label">
        <span>Kurus</span>
        <span>Normal</span>
        <span>Gemuk</span>
      </div>
    </div>
  )
}

export default function CekIMT() {
  const { profil, prefs, pilih } = usePrefs()
  const [dataDiri, simpanDataDiri] = useDataDiri(profil)
  const [form, setForm] = useState({ ...dataDiri, berat: '', tinggi: '', perut: '' })
  const [galat, setGalat] = useState({})
  const [hasil, setHasil] = useState(null)
  const judulHasil = useRef(null)
  const kotakHasil = useRef(null)

  const judul = pilih({ anak: 'Cek tumbuh anak', lansia: 'Cek berat badan', semua: 'Cek IMT' })
  useJudulHalaman(judul)

  const ubah = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))
  const umurAngka = bacaAngka(form.umurTahun)
  const dewasa = umurAngka >= 19

  const hitung = (e) => {
    e.preventDefault()
    const { g, nilai } = validasi(form)
    setGalat(g)
    if (Object.keys(g).length) {
      setHasil(null)
      requestAnimationFrame(() => document.querySelector('.kolom[data-invalid] input, [aria-invalid="true"]')?.focus())
      return
    }
    simpanDataDiri({ jk: form.jk, umurTahun: form.umurTahun, umurBulan: form.umurBulan })
    const h = nilaiStatusGizi(nilai)
    const k = kalimatHasil(h, profil)
    setHasil({ ...h, ...k, tinggiCm: nilai.tinggiCm })
    requestAnimationFrame(() => judulHasil.current?.focus())
    if (prefs.suara) bacakan([k.judul, k.teks], { kecepatan: profil === 'lansia' ? 0.9 : 1 })
  }

  return (
    <div className="wadah wadah--sempit">
      <Link to="/cek-gizi" className="tombol tombol--teks topik__kembali" data-tour="kembali">
        <ArrowLeft aria-hidden="true" /> {pilih({ anak: 'Piringku', semua: 'Cek Gizi' })}
      </Link>
      <header className="judul-halaman">
        <h1>{judul}</h1>
        <p>
          {pilih({
            anak: 'Diisi bersama orang tua. Untuk anak 5–18 tahun dipakai IMT menurut umur (standar WHO 2007).',
            remaja: 'Untuk usia 5–18 tahun, IMT dibandingkan dengan anak seumuran (standar WHO 2007), bukan kategori dewasa.',
            dewasa: 'IMT dewasa memakai batas ambang Indonesia dari Pedoman Gizi Seimbang. Lingkar perut membantu melihat risiko obesitas sentral.',
            lansia: 'Isi berat dan tinggi badan Bapak/Ibu.',
          })}
        </p>
      </header>

      <form className="kartu form-gizi" onSubmit={hitung} noValidate data-tour="form-gizi">
        <PilihanRadio label="Jenis kelamin" nilai={form.jk} onChange={ubah('jk')} pilihan={PILIHAN_JK} galat={galat.jk} kisi orientasi="horizontal" />
        <div className="form-gizi__baris">
          <KolomAngka label="Umur" satuan="tahun" nilai={form.umurTahun} onChange={ubah('umurTahun')} galat={galat.umurTahun} inputMode="numeric" />
          {!dewasa && (
            <KolomAngka
              label="Lebih bulan"
              satuan="bulan"
              nilai={form.umurBulan}
              onChange={ubah('umurBulan')}
              galat={galat.umurBulan}
              bantuan="Misalnya 9 tahun 4 bulan → isi 4."
              inputMode="numeric"
            />
          )}
        </div>
        <div className="form-gizi__baris">
          <KolomAngka label="Berat badan" satuan="kg" nilai={form.berat} onChange={ubah('berat')} galat={galat.berat} />
          <KolomAngka label="Tinggi badan" satuan="cm" nilai={form.tinggi} onChange={ubah('tinggi')} galat={galat.tinggi} />
        </div>
        {dewasa && profil !== 'lansia' && (
          <KolomAngka
            label="Lingkar perut"
            satuan="cm"
            nilai={form.perut}
            onChange={ubah('perut')}
            galat={galat.perut}
            wajib={false}
            bantuan="Ukur melingkar setinggi pusar."
          />
        )}
        <Button type="submit" className="tombol tombol--utama tombol--besar">
          Hitung
        </Button>
      </form>

      {hasil && (
        <section
          className={`kartu hasil-gizi hasil-gizi--${hasil.nada}`}
          aria-labelledby="judul-hasil"
          ref={kotakHasil}
          data-tour="hasil"
        >
          <p className="label-kecil">Hasil</p>
          <h2 id="judul-hasil" tabIndex={-1} ref={judulHasil}>
            {hasil.judul}
          </h2>
          {hasil.metode !== 'balita' && (
            <p className="hasil-gizi__angka">
              IMT <strong>{angka(hasil.imt)}</strong>
              {hasil.metode === 'imt-u' && (
                <span className="teks-redup"> · z-score {hasil.z.toLocaleString('id-ID')} SD menurut umur</span>
              )}
            </p>
          )}
          {hasil.metode === 'dewasa' && <SkalaIMT imt={hasil.imt} />}
          <p>{hasil.teks}</p>
          {hasil.metode === 'dewasa' && (
            <p>
              Rentang berat normal untuk tinggi {angka(hasil.tinggiCm)} cm: {angka(rentangBeratNormal(hasil.tinggiCm).min)}–
              {angka(rentangBeratNormal(hasil.tinggiCm).max)} kg.
            </p>
          )}
          {hasil.lingkarPerut && (
            <p>
              Lingkar perut {angka(hasil.lingkarPerut.nilai)} cm{' '}
              {hasil.lingkarPerut.berisiko
                ? `melebihi batas ${hasil.lingkarPerut.batas} cm. Ini tanda obesitas sentral yang meningkatkan risiko penyakit; bicarakan dengan tenaga kesehatan.`
                : `masih di bawah batas ${hasil.lingkarPerut.batas} cm.`}
            </p>
          )}
          <div className="baris">
            <ListenButton target={kotakHasil} label="Dengarkan hasil" />
            {hasil.nada !== 'baik' && (
              <Link to="/layanan/antrean?poli=gizi" className="tombol tombol--utama">
                <ClipboardList aria-hidden="true" /> Ambil antrean Poli Gizi
              </Link>
            )}
          </div>
          {profil === 'anak' && (
            <Gelembung pose="jempol" kecil className="hasil-gizi__kawal">
              <p>Tumbuh sehat itu soal kebiasaan: makan lengkap, main aktif, dan tidur cukup!</p>
            </Gelembung>
          )}
          <div data-tidak-dibaca>
            <Sumber ids={hasil.metode === 'dewasa' ? ['pgs', 'lingkarPerut'] : ['antropometri', 'who2007']} />
          </div>
        </section>
      )}
      <p className="bantuan form-gizi__privasi" data-tour="privasi">Data hanya dihitung dan disimpan di perangkat ini.</p>
    </div>
  )
}
