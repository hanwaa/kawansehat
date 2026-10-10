import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button, Checkbox, CheckboxGroup, Label } from 'react-aria-components'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Pencil } from 'lucide-react'
import Gelembung from '../../components/Gelembung.jsx'
import { PilihanRadio } from '../../components/Kolom.jsx'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import { hariLayanan, KEBUTUHAN, LAYANAN_ONLINE, POLI, PUSKESMAS, SESI } from '../../data/puskesmas.js'
import { tulis } from '../../lib/simpan.js'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import './layanan.css'

const LANGKAH = ['Jenis layanan', 'Tempat & poli', 'Jadwal', 'Kebutuhan khusus', 'Data diri', 'Periksa ulang']

// Tips Si Kawal per langkah, disesuaikan dengan cara bicara tiap profil.
const TIPS = [
  { semua: 'Datang langsung atau konsultasi lewat video call. Keduanya bisa memakai juru bahasa isyarat.', lansia: 'Kalau ragu, pilih “Datang ke puskesmas”.' },
  { semua: 'Pilih puskesmas yang paling dekat dulu, ya. Fasilitas aksesibelnya tertulis di setiap pilihan.', lansia: 'Pilih puskesmas yang paling dekat, Bapak/Ibu.' },
  { semua: 'Sesi pagi biasanya lebih ramai. Pilih yang paling nyaman.', lansia: 'Pilih hari dan jam yang Bapak/Ibu bisa datang.' },
  { semua: 'Centang semua yang dibutuhkan. Petugas akan menyiapkannya sebelum kamu datang.', dewasa: 'Centang semua yang dibutuhkan. Petugas akan menyiapkannya sebelum Anda datang.', lansia: 'Antrean prioritas sudah saya centang untuk Bapak/Ibu.' },
  { semua: 'Nomor HP dipakai untuk mengirim pengingat jadwal.' },
  { semua: 'Periksa sekali lagi. Tekan “Ubah” kalau ada yang keliru.' },
]

function formAwal(params, profil) {
  const jenis = params.get('jenis')
  const poli = params.get('poli')
  return {
    jenis: jenis === 'online' || jenis === 'datang' ? jenis : '',
    puskesmas: profil === 'lansia' ? PUSKESMAS[0].id : '',
    poli: POLI.some((p) => p.id === poli) ? poli : profil === 'lansia' ? 'lansia' : '',
    layananOnline: poli === 'gizi' ? 'gizi' : '',
    tanggal: '',
    sesi: '',
    kebutuhan: profil === 'lansia' ? ['prioritas'] : [],
    lainnya: '',
    nama: '',
    hp: '',
  }
}

function validasiLangkah(langkah, f) {
  const g = {}
  if (langkah === 0 && !f.jenis) g.jenis = 'Pilih jenis layanan.'
  if (langkah === 1) {
    if (f.jenis === 'datang') {
      if (!f.puskesmas) g.puskesmas = 'Pilih puskesmas.'
      if (!f.poli) g.poli = 'Pilih poli.'
    } else if (!f.layananOnline) g.layananOnline = 'Pilih layanan konsultasi.'
  }
  if (langkah === 2) {
    if (!f.tanggal) g.tanggal = 'Pilih hari.'
    if (!f.sesi) g.sesi = 'Pilih sesi.'
  }
  if (langkah === 4) {
    if (f.nama.trim().length < 2) g.nama = 'Tulis nama lengkap.'
    if (!/^(\+62|62|0)8\d{8,11}$/.test(f.hp.replace(/[\s-]/g, ''))) g.hp = 'Tulis nomor HP yang benar, misalnya 0812 3456 7890.'
  }
  return g
}

export default function Antrean() {
  const { profil, pilih } = usePrefs()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [orangTua, setOrangTua] = useState(false)
  const [langkah, setLangkah] = useState(() => (params.get('jenis') ? 1 : 0))
  const [form, setForm] = useState(() => formAwal(params, profil))
  const [galat, setGalat] = useState({})
  const judulLangkah = useRef(null)
  const sudahTampil = useRef(false)
  const [hari] = useState(hariLayanan)
  useJudulHalaman(form.jenis === 'online' ? 'Konsultasi online' : 'Ambil antrean')

  useEffect(() => {
    if (!sudahTampil.current) {
      sudahTampil.current = true
      return
    }
    judulLangkah.current?.focus()
  }, [langkah])

  const ubah = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setGalat((g) => ({ ...g, [k]: undefined }))
  }

  const lanjut = () => {
    const g = validasiLangkah(langkah, form)
    setGalat(g)
    if (Object.keys(g).length) {
      requestAnimationFrame(() => document.querySelector('.antrean [data-invalid] input, .antrean [aria-invalid="true"]')?.focus())
      return
    }
    setLangkah((l) => l + 1)
  }

  const ambilNomor = () => {
    const poli = form.jenis === 'datang' ? POLI.find((p) => p.id === form.poli) : LAYANAN_ONLINE.find((p) => p.id === form.layananOnline)
    const nomor = `${poli.kode}-${String(Math.floor(Math.random() * 40) + 1).padStart(3, '0')}`
    const tiket = {
      nomor,
      jenis: form.jenis,
      puskesmas: form.jenis === 'datang' ? PUSKESMAS.find((p) => p.id === form.puskesmas).nama : 'Konsultasi online',
      layanan: poli.label,
      tanggalLabel: hari.find((h) => h.id === form.tanggal).label,
      sesi: SESI.find((s) => s.id === form.sesi),
      kebutuhan: form.kebutuhan,
      lainnya: form.lainnya.trim(),
      nama: form.nama.trim(),
    }
    tulis('ks-tiket', tiket)
    navigate('/layanan/tiket', { state: { baru: true } })
  }

  if (profil === 'anak' && !orangTua) {
    return (
      <div className="wadah wadah--sempit antrean">
        <header className="judul-halaman">
          <h1>Ambil antrean puskesmas</h1>
        </header>
        <Gelembung pose="pikir" ukuran={120}>
          <p>
            <strong>Halaman ini untuk orang tua atau wali, ya.</strong> Kalau kamu merasa sakit, bilang ke orang tua atau
            gurumu supaya mereka yang mendaftarkan.
          </p>
        </Gelembung>
        <div className="baris" style={{ marginTop: 'var(--r5)' }}>
          <Button className="tombol tombol--utama" onPress={() => setOrangTua(true)}>
            Saya orang tua/wali, lanjutkan
          </Button>
          <Button className="tombol" onPress={() => navigate('/beranda')}>
            Kembali ke beranda
          </Button>
        </div>
      </div>
    )
  }

  const kebutuhanTampil = KEBUTUHAN.filter((k) => !k.hanya || k.hanya === form.jenis)
  const ringkasan = [
    { langkah: 0, label: 'Jenis layanan', isi: form.jenis === 'online' ? 'Konsultasi online (video call)' : 'Datang ke puskesmas' },
    form.jenis === 'datang'
      ? { langkah: 1, label: 'Tempat & poli', isi: `${PUSKESMAS.find((p) => p.id === form.puskesmas)?.nama ?? '-'} · ${POLI.find((p) => p.id === form.poli)?.label ?? '-'}` }
      : { langkah: 1, label: 'Layanan', isi: LAYANAN_ONLINE.find((p) => p.id === form.layananOnline)?.label ?? '-' },
    { langkah: 2, label: 'Jadwal', isi: `${hari.find((h) => h.id === form.tanggal)?.label ?? '-'} · ${SESI.find((s) => s.id === form.sesi)?.ket ?? ''}` },
    {
      langkah: 3,
      label: 'Kebutuhan khusus',
      isi: [...form.kebutuhan.map((id) => KEBUTUHAN.find((k) => k.id === id)?.label), form.lainnya.trim()].filter(Boolean).join(', ') || 'Tidak ada',
    },
    { langkah: 4, label: 'Data diri', isi: `${form.nama} · ${form.hp}` },
  ]

  return (
    <div className="wadah wadah--sempit antrean">
      <header className="judul-halaman">
        <h1>{form.jenis === 'online' ? 'Konsultasi online' : 'Ambil antrean puskesmas'}</h1>
        <p>{pilih({ lansia: 'Ikuti langkah satu per satu. Bisa kembali kapan saja.', semua: 'Enam langkah singkat. Kamu bisa kembali dan mengubah pilihan kapan saja.', dewasa: 'Enam langkah singkat. Anda bisa kembali dan mengubah pilihan kapan saja.' })}</p>
      </header>

      <nav aria-label="Langkah pendaftaran" className="langkah-langkah">
        <div className="langkah-langkah__bar" aria-hidden="true">
          <span style={{ width: `${((langkah + 1) / LANGKAH.length) * 100}%` }} />
        </div>
        <ol>
          {LANGKAH.map((nama, i) => (
            <li key={nama} aria-current={i === langkah ? 'step' : undefined} className={i < langkah ? 'selesai' : i === langkah ? 'aktif' : ''}>
              <span className="langkah-langkah__nomor" aria-hidden="true">
                {i < langkah ? <Check /> : i + 1}
              </span>
              <span className="langkah-langkah__nama">
                {nama}
                {i < langkah && <span className="visual-tersembunyi"> (selesai)</span>}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <section className="kartu antrean__langkah" aria-labelledby="judul-langkah">
        <p className="label-kecil">
          Langkah {langkah + 1} dari {LANGKAH.length}
        </p>
        <h2 id="judul-langkah" tabIndex={-1} ref={judulLangkah}>
          {LANGKAH[langkah]}
        </h2>
        <Gelembung kecil pose={langkah === 5 ? 'jempol' : 'tunjuk'} className="antrean__tip">
          <p>{pilih(TIPS[langkah])}</p>
        </Gelembung>

        {langkah === 0 && (
          <PilihanRadio
            label="Mau dilayani dengan cara apa?"
            nilai={form.jenis}
            onChange={ubah('jenis')}
            galat={galat.jenis}
            pilihan={[
              { id: 'datang', label: 'Datang ke puskesmas', ket: 'Ambil nomor antrean, datang sesuai jadwal' },
              { id: 'online', label: 'Konsultasi online', ket: 'Video call dari rumah' },
            ]}
          />
        )}

        {langkah === 1 && form.jenis === 'datang' && (
          <div className="tumpuk">
            <PilihanRadio
              label="Puskesmas"
              nilai={form.puskesmas}
              onChange={ubah('puskesmas')}
              galat={galat.puskesmas}
              pilihan={PUSKESMAS.map((p) => ({ id: p.id, label: `${p.nama} · ${p.jarak}`, ket: p.fasilitas.join(' · ') }))}
            />
            <PilihanRadio label="Poli" nilai={form.poli} onChange={ubah('poli')} galat={galat.poli} pilihan={POLI} kisi />
          </div>
        )}
        {langkah === 1 && form.jenis === 'online' && (
          <PilihanRadio
            label="Konsultasi dengan"
            nilai={form.layananOnline}
            onChange={ubah('layananOnline')}
            galat={galat.layananOnline}
            pilihan={LAYANAN_ONLINE}
            kisi
          />
        )}

        {langkah === 2 && (
          <div className="tumpuk">
            <PilihanRadio label="Hari" nilai={form.tanggal} onChange={ubah('tanggal')} galat={galat.tanggal} pilihan={hari} kisi />
            <PilihanRadio label="Sesi" nilai={form.sesi} onChange={ubah('sesi')} galat={galat.sesi} pilihan={SESI} kisi orientasi="horizontal" />
          </div>
        )}

        {langkah === 3 && (
          <div className="tumpuk">
            <CheckboxGroup value={form.kebutuhan} onChange={ubah('kebutuhan')} className="kolom">
              <Label className="label">Pilih semua yang dibutuhkan (boleh dikosongkan)</Label>
              <div className="pilihan-grup">
                {kebutuhanTampil.map((k) => (
                  <Checkbox key={k.id} value={k.id} className="pilihan pilihan--kotak">
                    <span className="pilihan__tanda" aria-hidden="true">
                      <Check />
                    </span>
                    <span className="pilihan__isi">
                      {k.label}
                      <small>{k.ket}</small>
                    </span>
                  </Checkbox>
                ))}
              </div>
            </CheckboxGroup>
            <div className="kolom">
              <label className="label" htmlFor="kebutuhan-lain">
                Kebutuhan lain <span className="teks-redup">(boleh dikosongkan)</span>
              </label>
              <textarea id="kebutuhan-lain" rows={3} value={form.lainnya} onChange={(e) => ubah('lainnya')(e.target.value)} />
            </div>
          </div>
        )}

        {langkah === 4 && (
          <div className="tumpuk">
            <div className="kolom">
              <label className="label" htmlFor="nama">
                Nama lengkap pasien
              </label>
              <input
                id="nama"
                autoComplete="name"
                value={form.nama}
                onChange={(e) => ubah('nama')(e.target.value)}
                aria-invalid={galat.nama ? true : undefined}
                aria-describedby={galat.nama ? 'galat-nama' : undefined}
              />
              {galat.nama && (
                <p className="galat" id="galat-nama">
                  <AlertCircle aria-hidden="true" width="18" height="18" /> {galat.nama}
                </p>
              )}
            </div>
            <div className="kolom">
              <label className="label" htmlFor="hp">
                Nomor HP
              </label>
              <p className="bantuan" id="bantuan-hp">
                Contoh: 0812 3456 7890. Prototipe ini tidak mengirim pesan sungguhan.
              </p>
              <input
                id="hp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.hp}
                onChange={(e) => ubah('hp')(e.target.value)}
                aria-invalid={galat.hp ? true : undefined}
                aria-describedby={galat.hp ? 'bantuan-hp galat-hp' : 'bantuan-hp'}
              />
              {galat.hp && (
                <p className="galat" id="galat-hp">
                  <AlertCircle aria-hidden="true" width="18" height="18" /> {galat.hp}
                </p>
              )}
            </div>
          </div>
        )}

        {langkah === 5 && (
          <dl className="ringkasan">
            {ringkasan.map((r) => (
              <div key={r.label} className="ringkasan__baris">
                <dt>{r.label}</dt>
                <dd>
                  <span>{r.isi}</span>
                  <Button className="tombol tombol--teks" onPress={() => setLangkah(r.langkah)} aria-label={`Ubah ${r.label.toLowerCase()}`}>
                    <Pencil aria-hidden="true" /> Ubah
                  </Button>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="antrean__aksi">
          {langkah > 0 && (
            <Button className="tombol" onPress={() => setLangkah((l) => l - 1)}>
              <ArrowLeft aria-hidden="true" /> Kembali
            </Button>
          )}
          {langkah < 5 ? (
            <Button className="tombol tombol--utama tombol--besar" onPress={lanjut}>
              Lanjut <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button className="tombol tombol--utama tombol--besar" onPress={ambilNomor}>
              <Check aria-hidden="true" /> {form.jenis === 'online' ? 'Pesan konsultasi' : 'Ambil antrean'}
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
