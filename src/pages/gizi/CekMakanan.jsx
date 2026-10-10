import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button, Label, Radio, RadioGroup } from 'react-aria-components'
import { ArrowLeft, Check, Minus, Plus, Search, Trash2, X } from 'lucide-react'
import ListenButton from '../../components/ListenButton.jsx'
import Sumber from '../../components/Sumber.jsx'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import { KELOMPOK, MAKANAN, cariMakanan } from '../../data/makanan.js'
import { BATAS_GGL } from '../../data/batas-ggl.js'
import { bacaAngka, cariAKG, persen, totalGizi } from '../../lib/gizi.js'
import { baca, tulis } from '../../lib/simpan.js'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import { PROFIL } from '../../prefs/presets.js'
import SusunPiring from './SusunPiring.jsx'
import './gizi.css'

const angka = (n) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 })
const hariIni = () => new Date().toISOString().slice(0, 10)
const KUNCI = 'ks-piringku'

function muatPiringku() {
  const data = baca(KUNCI, null)
  if (!data || data.tanggal !== hariIni()) return []
  return data.isi.filter((x) => cariMakanan(x.id))
}

function BarGizi({ label, nilai, target, satuan, batas = false }) {
  const p = persen(nilai, target)
  const lewat = batas && nilai > target
  return (
    <div className={`bar-gizi ${lewat ? 'bar-gizi--lewat' : ''}`}>
      <div className="bar-gizi__teks">
        <span>{label}</span>
        <span>
          {angka(nilai)} / {angka(target)} {satuan} ({p}%){lewat && <strong> · melebihi batas</strong>}
        </span>
      </div>
      <div className="bar-gizi__jalur" aria-hidden="true">
        <span style={{ width: `${Math.min(p, 100)}%` }} />
      </div>
    </div>
  )
}

function Pencarian({ onPilih, dipilih }) {
  const [kata, setKata] = useState('')
  const [kelompok, setKelompok] = useState('semua')
  const hasil = useMemo(() => {
    const q = kata.trim().toLowerCase()
    return MAKANAN.filter((m) => (kelompok === 'semua' || m.kelompok === kelompok) && (!q || m.nama.toLowerCase().includes(q)))
  }, [kata, kelompok])

  return (
    <section className="kartu cari-makanan" aria-labelledby="judul-cari">
      <h2 id="judul-cari">Cari makanan</h2>
      <div className="kolom">
        <label className="label" htmlFor="kata-makanan">
          Nama makanan
        </label>
        <div className="cari-makanan__input">
          <Search aria-hidden="true" />
          <input
            id="kata-makanan"
            type="search"
            value={kata}
            onChange={(e) => setKata(e.target.value)}
            placeholder="misalnya tempe, nasi, pisang"
            autoComplete="off"
          />
        </div>
      </div>
      <RadioGroup value={kelompok} onChange={setKelompok} orientation="horizontal" className="cari-makanan__filter">
        <Label className="visual-tersembunyi">Kelompok makanan</Label>
        {[['semua', 'Semua'], ...Object.entries(KELOMPOK)].map(([id, label]) => (
          <Radio key={id} value={id} className="chip">
            {label}
          </Radio>
        ))}
      </RadioGroup>
      <p className="bantuan" role="status">
        {hasil.length} makanan ditemukan
      </p>
      <ul className="cari-makanan__hasil" role="list">
        {hasil.map((m) => (
          <li key={m.id}>
            <Button className={`hasil-makanan ${dipilih?.id === m.id ? 'hasil-makanan--dipilih' : ''}`} onPress={() => onPilih(m)}>
              <span className="hasil-makanan__nama">{m.nama}</span>
              <span className="hasil-makanan__urt">
                1 porsi = {m.urt}
                {m.berat ? ` (${m.berat} g)` : ''}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function DetailMakanan({ makanan, onTambah, onTutup, profil }) {
  const [porsi, setPorsi] = useState(1)
  const g = makanan.gizi
  const ubahPorsi = (d) => setPorsi((p) => Math.min(10, Math.max(0.5, p + d)))
  return (
    <section className="kartu detail-makanan" aria-labelledby="judul-detail">
      <div className="dialog__kepala">
        <div>
          <p className="label-kecil">{KELOMPOK[makanan.kelompok]}</p>
          <h2 id="judul-detail" tabIndex={-1}>
            {makanan.nama}
          </h2>
        </div>
        <Button className="tombol tombol--teks" onPress={onTutup} aria-label="Tutup detail">
          <X aria-hidden="true" />
        </Button>
      </div>
      <p>
        1 porsi = <strong>{makanan.urt}</strong>
        {makanan.berat ? ` (${makanan.berat} gram)` : ''}
      </p>
      {makanan.hanyaNatrium ? (
        <p>
          Natrium: <strong>{angka(g.natrium)} mg</strong> per porsi.
        </p>
      ) : (
        <dl className="akg-daftar akg-daftar--ringkas">
          {(profil === 'remaja' ? ['protein', 'lemak', 'karbo'] : ['energi', 'protein', 'lemak', 'karbo']).map((k) => (
            <div key={k} className="akg-daftar__item">
              <dt>{{ energi: 'Energi', protein: 'Protein', lemak: 'Lemak', karbo: 'Karbohidrat' }[k]}</dt>
              <dd>
                {angka(g[k])} <span>{k === 'energi' ? 'kkal' : 'g'}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}
      {makanan.perkiraan && <p className="bantuan">Perkiraan: nilai bahan + 1 sendok teh minyak goreng.</p>}
      <div className="porsi" role="group" aria-labelledby="label-porsi">
        <span id="label-porsi" className="label">
          Jumlah porsi
        </span>
        <div className="porsi__kontrol">
          <Button className="tombol" onPress={() => ubahPorsi(-0.5)} aria-label="Kurangi setengah porsi" isDisabled={porsi <= 0.5}>
            <Minus aria-hidden="true" />
          </Button>
          <output aria-live="polite" className="porsi__nilai">
            {angka(porsi)}
          </output>
          <Button className="tombol" onPress={() => ubahPorsi(0.5)} aria-label="Tambah setengah porsi" isDisabled={porsi >= 10}>
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>
      <Button className="tombol tombol--utama tombol--besar" onPress={() => onTambah(makanan, porsi)}>
        <Plus aria-hidden="true" /> Tambahkan ke Piringku Hari Ini
      </Button>
    </section>
  )
}

function Rekap({ isi, onHapus, onKosongkan, profil }) {
  const rekap = useRef(null)
  const dataDiri = baca('ks-data-diri', null)
  const umur = bacaAngka(dataDiri?.umurTahun ?? String(PROFIL[profil].umurContoh))
  const akg = dataDiri?.jk ? cariAKG(umur, dataDiri.jk) : null
  const daftar = isi.map((x) => ({ makanan: cariMakanan(x.id), porsi: x.porsi }))
  const total = totalGizi(daftar)
  const kelompokAda = new Set(daftar.map((d) => d.makanan.kelompok))

  return (
    <section className="kartu rekap" aria-labelledby="judul-rekap" ref={rekap}>
      <h2 id="judul-rekap">Piringku Hari Ini</h2>
      {isi.length === 0 ? (
        <p>Belum ada makanan. Cari makanan lalu tekan “Tambahkan”.</p>
      ) : (
        <>
          <ul className="rekap__daftar" role="list">
            {daftar.map(({ makanan, porsi }, i) => (
              <li key={`${makanan.id}-${i}`}>
                <span>
                  {makanan.nama} <span className="teks-redup">× {angka(porsi)} porsi</span>
                </span>
                <Button className="tombol tombol--teks" onPress={() => onHapus(i)} aria-label={`Hapus ${makanan.nama}`}>
                  <Trash2 aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>

          <h3>Isi Piringku</h3>
          <ul className="ceklis" role="list">
            {['pokok', 'lauk', 'sayur', 'buah'].map((k) => (
              <li key={k} className={kelompokAda.has(k) ? 'ada' : ''}>
                {kelompokAda.has(k) ? <Check aria-hidden="true" /> : <Minus aria-hidden="true" />}
                {KELOMPOK[k]}: {kelompokAda.has(k) ? 'sudah ada' : 'belum ada'}
              </li>
            ))}
          </ul>

          <h3>Gula, garam, dan lemak</h3>
          <BarGizi label="Gula tambahan" nilai={total.gula} target={BATAS_GGL.gula.batas} satuan="g" batas />
          <BarGizi label="Natrium dari bumbu" nilai={total.natrium} target={BATAS_GGL.natrium.batas} satuan="mg" batas />
          <BarGizi label="Lemak" nilai={total.lemak} target={BATAS_GGL.lemak.batas} satuan="g" batas />

          {profil !== 'remaja' &&
            (akg ? (
              <>
                <h3>Dibanding kebutuhan harian ({akg.label})</h3>
                <BarGizi label="Energi" nilai={total.energi} target={akg.energi} satuan="kkal" />
                <BarGizi label="Protein" nilai={total.protein} target={akg.protein} satuan="g" />
                <BarGizi label="Karbohidrat" nilai={total.karbo} target={akg.karbo} satuan="g" />
              </>
            ) : (
              <p className="bantuan">
                Isi jenis kelamin dan umur di <Link to="/cek-gizi/kebutuhan">Kebutuhan gizi</Link> untuk membandingkan dengan AKG.
              </p>
            ))}
          {profil === 'remaja' && (
            <p className="bantuan">Protein hari ini: {angka(total.protein)} g. Fokus pada piring yang lengkap, bukan angka kalori.</p>
          )}
          <p className="bantuan">Natrium hanya dihitung dari garam, kecap, dan penyedap yang ditambahkan. Untuk makanan kemasan, lihat label gizinya.</p>
          <div className="baris">
            <ListenButton target={rekap} label="Dengarkan rekap" />
            <Button className="tombol tombol--teks" onPress={onKosongkan}>
              Kosongkan piring
            </Button>
          </div>
        </>
      )}
    </section>
  )
}

export default function CekMakanan() {
  const { profil, pilih } = usePrefs()
  const judul = pilih({ anak: 'Susun Isi Piringku', remaja: 'Cek jajanan & makanan', semua: 'Cek makanan' })
  useJudulHalaman(judul)
  const [dipilih, setDipilih] = useState(null)
  const [isi, setIsi] = useState(muatPiringku)
  const [pesan, setPesan] = useState('')

  const simpan = (baru) => {
    setIsi(baru)
    tulis(KUNCI, { tanggal: hariIni(), isi: baru })
  }

  const pilihMakanan = (m) => {
    setDipilih(m)
    requestAnimationFrame(() => document.getElementById('judul-detail')?.focus())
  }

  const tambah = (m, porsi) => {
    simpan([...isi, { id: m.id, porsi }])
    setPesan(`${m.nama} ${porsi.toLocaleString('id-ID')} porsi ditambahkan ke Piringku Hari Ini.`)
    setDipilih(null)
  }

  return (
    <div className="wadah">
      <Link to="/cek-gizi" className="tombol tombol--teks topik__kembali">
        <ArrowLeft aria-hidden="true" /> {pilih({ anak: 'Piringku', semua: 'Cek Gizi' })}
      </Link>
      <header className="judul-halaman">
        <h1>{judul}</h1>
        <p>
          {pilih({
            anak: 'Isi setiap bagian piring dengan makanan yang tepat.',
            remaja: 'Cek gizi makanan dan jajananmu, termasuk gula, garam, dan lemak.',
            dewasa: 'Nilai gizi per porsi dari Daftar Bahan Makanan Penukar, Pedoman Gizi Seimbang Kemenkes.',
            lansia: 'Catat makanan Bapak/Ibu hari ini. Perhatikan garam dan gula.',
          })}
        </p>
      </header>

      {profil === 'anak' ? (
        <SusunPiring />
      ) : (
        <div className="cek-makanan">
          <div className="cek-makanan__kiri">
            {dipilih ? (
              <DetailMakanan key={dipilih.id} makanan={dipilih} onTambah={tambah} onTutup={() => setDipilih(null)} profil={profil} />
            ) : (
              <Pencarian onPilih={pilihMakanan} dipilih={dipilih} />
            )}
          </div>
          <div className="cek-makanan__kanan">
            <p className="visual-tersembunyi" role="status">
              {pesan}
            </p>
            <Rekap isi={isi} profil={profil} onHapus={(i) => simpan(isi.filter((_, j) => j !== i))} onKosongkan={() => simpan([])} />
          </div>
        </div>
      )}
      <div className="bagian">
        <Sumber ids={['pgs', 'ggl', 'akg', 'isiPiringku']} />
      </div>
    </div>
  )
}
