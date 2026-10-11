import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from 'react-aria-components'
import { ArrowRight, Award, RotateCcw } from 'lucide-react'
import Gelembung from '../components/Gelembung.jsx'
import { PilihanRadio } from '../components/Kolom.jsx'
import { useJudulHalaman } from '../components/useJudulHalaman.js'
import { beriLencana } from '../lib/lencana.js'
import { bacakan } from '../lib/suara.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import './kuis.css'

// Kuis DBD untuk anak. Jawaban mengikuti Leaflet DBD 3M Plus Kemenkes.
const SOAL = [
  {
    tanya: 'Nyamuk demam berdarah suka bertelur di mana?',
    pilihan: [
      { id: 'a', label: 'Di air bersih yang diam, seperti bak mandi' },
      { id: 'b', label: 'Di got yang kotor' },
      { id: 'c', label: 'Di dalam tanah' },
    ],
    benar: 'a',
    jelas: 'Nyamuk demam berdarah bertelur di air bersih yang diam. Makanya bak mandi harus rajin dikuras!',
  },
  {
    tanya: 'Kapan nyamuk demam berdarah suka menggigit?',
    pilihan: [
      { id: 'a', label: 'Hanya tengah malam' },
      { id: 'b', label: 'Pagi sampai sore hari' },
    ],
    benar: 'b',
    jelas: 'Nyamuk ini aktif menggigit pagi sampai sore hari.',
  },
  {
    tanya: 'Apa saja 3M untuk mencegah demam berdarah?',
    pilihan: [
      { id: 'a', label: 'Makan, minum, mandi' },
      { id: 'b', label: 'Menguras, menutup, mendaur ulang' },
      { id: 'c', label: 'Melompat, menari, menyanyi' },
    ],
    benar: 'b',
    jelas: '3M artinya menguras dan menutup tempat penampungan air, serta mendaur ulang barang bekas.',
  },
]

export default function Kuis() {
  const { profil, prefs, pilih } = usePrefs()
  useJudulHalaman('Kuis Nyamuk')
  const [nomor, setNomor] = useState(0)
  const [jawab, setJawab] = useState('')
  const [diperiksa, setDiperiksa] = useState(false)
  const [skor, setSkor] = useState(0)
  const [galat, setGalat] = useState('')
  const judulSoal = useRef(null)
  const sudahTampil = useRef(false)
  const selesai = nomor >= SOAL.length
  const soal = SOAL[nomor]

  useEffect(() => {
    if (!sudahTampil.current) {
      sudahTampil.current = true
      return
    }
    judulSoal.current?.focus()
  }, [nomor])

  useEffect(() => {
    if (selesai && skor >= 2) beriLencana('pemburu-jentik')
  }, [selesai, skor])

  const periksa = () => {
    if (!jawab) {
      setGalat('Pilih salah satu jawaban dulu, ya.')
      return
    }
    setGalat('')
    const benar = jawab === soal.benar
    if (benar) setSkor((s) => s + 1)
    setDiperiksa(true)
    if (prefs.suara) bacakan(`${benar ? 'Betul!' : 'Hampir!'} ${soal.jelas}`, { profil })
  }

  const berikutnya = () => {
    setNomor((n) => n + 1)
    setJawab('')
    setDiperiksa(false)
  }

  const ulang = () => {
    setNomor(0)
    setJawab('')
    setDiperiksa(false)
    setSkor(0)
  }

  if (selesai) {
    return (
      <div className="wadah wadah--sempit kuis">
        <header className="judul-halaman">
          <h1 ref={judulSoal} tabIndex={-1}>
            Kuis selesai!
          </h1>
        </header>
        <Gelembung pose="jempol" ukuran={130} data-tour="skor">
          <p className="kuis__skor">
            Kamu menjawab benar <strong>{skor}</strong> dari {SOAL.length} soal.
          </p>
          {skor >= 2 ? (
            <p className="kuis__lencana">
              <Award aria-hidden="true" /> Kamu dapat lencana <strong>Pemburu Jentik</strong>!
            </p>
          ) : (
            <p>Yuk, baca lagi cerita nyamuknya, lalu coba lagi!</p>
          )}
        </Gelembung>
        <div className="baris" style={{ marginTop: 'var(--r5)' }} data-tour="setelah-kuis">
          <Button className="tombol" onPress={ulang}>
            <RotateCcw aria-hidden="true" /> Main lagi
          </Button>
          <Link to="/info/dbd" className="tombol">
            Baca cerita nyamuk
          </Link>
          <Link to="/beranda" className="tombol tombol--utama">
            Lihat lencanaku
          </Link>
        </div>
      </div>
    )
  }

  const benar = jawab === soal.benar
  return (
    <div className="wadah wadah--sempit kuis">
      <header className="judul-halaman">
        <h1>{pilih({ anak: 'Kuis Nyamuk Nakal', semua: 'Kuis demam berdarah' })}</h1>
        <p className="label-kecil" data-tour="nomor-soal">
          Soal {nomor + 1} dari {SOAL.length}
        </p>
      </header>
      <section className="kartu" aria-labelledby="judul-soal" data-tour="soal">
        <h2 id="judul-soal" ref={judulSoal} tabIndex={-1} className="kuis__tanya">
          {soal.tanya}
        </h2>
        {/* Setelah diperiksa pilihan dikunci (terlihat & diumumkan sebagai nonaktif, bukan diam-diam mengabaikan
            ketukan), dan jawaban benar ditandai dengan teks, bukan warna saja. */}
        <PilihanRadio
          label="Pilih jawaban"
          nilai={jawab}
          onChange={(v) => {
            setJawab(v)
            setGalat('')
          }}
          pilihan={
            diperiksa
              ? soal.pilihan.map((p) => ({
                  ...p,
                  ket: p.id === soal.benar ? 'Jawaban benar' : p.id === jawab ? 'Jawabanmu' : undefined,
                }))
              : soal.pilihan
          }
          galat={galat}
          isDisabled={diperiksa}
        />
        {diperiksa && (
          <div role="status" className="kuis__umpan">
            <Gelembung pose={benar ? 'jempol' : 'pikir'} kecil>
              <p>
                <strong>{benar ? 'Betul!' : 'Hampir!'}</strong> {soal.jelas}
              </p>
            </Gelembung>
          </div>
        )}
        <div className="baris" style={{ marginTop: 'var(--r5)' }}>
          {!diperiksa ? (
            <Button className="tombol tombol--utama tombol--besar" onPress={periksa}>
              Periksa jawaban
            </Button>
          ) : (
            <Button className="tombol tombol--utama tombol--besar" onPress={berikutnya} autoFocus>
              {nomor === SOAL.length - 1 ? 'Lihat hasil' : 'Soal berikutnya'} <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
