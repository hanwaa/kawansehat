import { useRef, useState } from 'react'
import { Button, Checkbox, CheckboxGroup, Dialog, Heading, Label, Modal, ModalOverlay } from 'react-aria-components'
import { AlertCircle, BellRing, Check, Moon, Plus, Sun, Sunrise, Trash2 } from 'lucide-react'
import Gelembung from '../components/Gelembung.jsx'
import { PilihanRadio } from '../components/Kolom.jsx'
import ListenButton from '../components/ListenButton.jsx'
import PesanUrungkan from '../components/PesanUrungkan.jsx'
import { useJudulHalaman } from '../components/useJudulHalaman.js'
import { bacakan, hentikan } from '../lib/suara.js'
import { baca, tulis } from '../lib/simpan.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import './pengingat.css'

const WAKTU = [
  { id: 'pagi', label: 'Pagi', jam: '07.00', Ikon: Sunrise },
  { id: 'siang', label: 'Siang', jam: '12.00', Ikon: Sun },
  { id: 'malam', label: 'Malam', jam: '19.00', Ikon: Moon },
]

const WARNA_OBAT = [
  { id: 'putih', label: 'Putih', hex: '#ffffff' },
  { id: 'kuning', label: 'Kuning', hex: '#ffd23f' },
  { id: 'merah', label: 'Merah muda', hex: '#f59e8b' },
  { id: 'biru', label: 'Biru', hex: '#7fb8ff' },
]

const BENTUK = [
  { id: 'tablet', label: 'Tablet' },
  { id: 'kapsul', label: 'Kapsul' },
  { id: 'sirup', label: 'Sirup', ket: 'Diminum dengan sendok takar' },
]

const hariIni = () => new Date().toISOString().slice(0, 10)

// Gambar obat membantu mengenali obat tanpa harus membaca namanya.
function GambarObat({ bentuk, warna, ukuran = 44 }) {
  const hex = WARNA_OBAT.find((w) => w.id === warna)?.hex ?? '#fff'
  return (
    <svg viewBox="0 0 48 48" width={ukuran} height={ukuran} aria-hidden="true" focusable="false">
      {bentuk === 'kapsul' && (
        <g transform="rotate(-35 24 24)">
          <rect x="6" y="16" width="36" height="16" rx="8" fill={hex} stroke="#1c2420" strokeWidth="2.5" />
          <path d="M24 16 v16" stroke="#1c2420" strokeWidth="2.5" />
          <rect x="24" y="16" width="18" height="16" rx="8" fill="#fff" opacity="0.5" />
        </g>
      )}
      {bentuk === 'tablet' && (
        <>
          <circle cx="24" cy="24" r="16" fill={hex} stroke="#1c2420" strokeWidth="2.5" />
          <path d="M14 24 h20" stroke="#1c2420" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {bentuk === 'sirup' && (
        <>
          <rect x="16" y="6" width="16" height="8" rx="2" fill="#1c2420" />
          <path d="M14 16 h20 v24 a4 4 0 0 1 -4 4 h-12 a4 4 0 0 1 -4 -4 z" fill={hex} stroke="#1c2420" strokeWidth="2.5" />
          <rect x="18" y="24" width="12" height="10" rx="2" fill="#fff" opacity="0.7" />
        </>
      )}
    </svg>
  )
}

const kosong = { nama: '', dosis: '1 tablet', bentuk: 'tablet', warna: 'putih', waktu: ['pagi'], makan: 'sesudah' }

function kalimatPengingat(o) {
  return `Waktunya minum ${o.nama}, ${o.dosis}, ${o.makan} makan.`
}

export default function PengingatObat() {
  const { profil, prefs, pilih } = usePrefs()
  useJudulHalaman('Pengingat obat')
  const [obat, setObat] = useState(() => baca('ks-obat', []))
  const [minum, setMinum] = useState(() => {
    const d = baca('ks-obat-minum', null)
    return d?.tanggal === hariIni() ? d.sudah : []
  })
  const [form, setForm] = useState(null)
  const [galat, setGalat] = useState({})
  // Isi notifikasi terakhir disimpan terpisah dari status terbuka, supaya tetap tampil selama animasi keluar.
  const [notifikasi, setNotifikasi] = useState(null)
  const [notifTerbuka, setNotifTerbuka] = useState(false)
  // Kabar aksi terakhir (hapus, urungkan, tunda pengingat) untuk PesanUrungkan.
  const [kabar, setKabar] = useState(null)
  const tombolUrungkan = useRef(null)
  const jadwal = useRef(null)

  const simpanObat = (baru) => {
    setObat(baru)
    tulis('ks-obat', baru)
  }
  const tandai = (kunci, sudah) => {
    const baru = sudah ? [...new Set([...minum, kunci])] : minum.filter((k) => k !== kunci)
    setMinum(baru)
    tulis('ks-obat-minum', { tanggal: hariIni(), sudah: baru })
  }

  const simpanForm = (e) => {
    e.preventDefault()
    const g = {}
    if (form.nama.trim().length < 2) g.nama = 'Tulis nama obat.'
    if (form.dosis.trim().length < 1) g.dosis = 'Tulis dosis, misalnya 1 tablet.'
    if (form.waktu.length === 0) g.waktu = 'Pilih minimal satu waktu minum.'
    setGalat(g)
    if (Object.keys(g).length) return
    simpanObat([...obat, { ...form, id: Date.now().toString(36), nama: form.nama.trim(), dosis: form.dosis.trim() }])
    setForm(null)
    setKabar(null)
  }

  const hapusObat = (o) => {
    const indeks = obat.findIndex((x) => x.id === o.id)
    simpanObat(obat.filter((x) => x.id !== o.id))
    setKabar({ pesan: `${o.nama} dihapus dari jadwal.`, bisaUrungkan: true, obat: o, indeks })
    // Tombol hapus ikut hilang; fokus pindah ke Urungkan supaya tidak jatuh ke awal halaman.
    requestAnimationFrame(() => tombolUrungkan.current?.focus())
  }

  const urungkanHapus = () => {
    const { obat: o, indeks } = kabar
    simpanObat([...obat.slice(0, indeks), o, ...obat.slice(indeks)])
    setKabar({ pesan: `${o.nama} dikembalikan ke jadwal.` })
    requestAnimationFrame(() => document.getElementById('judul-jadwal')?.focus())
  }

  // Prototipe tidak bisa menjadwalkan notifikasi sungguhan, jadi katakan apa adanya.
  const ingatkanNanti = () => {
    const jam = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    setKabar({ pesan: `Oke, ${notifikasi.obat.nama} diingatkan lagi pukul ${jam} (simulasi).` })
    hentikan()
    setNotifTerbuka(false)
  }

  const cobaPengingat = (o, w) => {
    setNotifikasi({ obat: o, waktu: w })
    setNotifTerbuka(true)
    if (prefs.suara) bacakan(kalimatPengingat(o), { profil })
  }

  const contoh = () => {
    setKabar(null)
    simpanObat([
      { id: 'contoh1', nama: 'Obat tekanan darah (contoh)', dosis: '1 tablet', bentuk: 'tablet', warna: 'putih', waktu: ['pagi'], makan: 'sesudah' },
      { id: 'contoh2', nama: 'Vitamin (contoh)', dosis: '1 kapsul', bentuk: 'kapsul', warna: 'kuning', waktu: ['pagi', 'malam'], makan: 'sesudah' },
    ])
  }

  // Panduan Piko menunjuk tombol-tombol pada obat pertama di jadwal.
  const kunciPertama = WAKTU.flatMap((w) => obat.filter((o) => o.waktu.includes(w.id)).map((o) => `${o.id}-${w.id}`))[0]

  return (
    <div className="wadah wadah--sempit pengingat">
      <header className="judul-halaman">
        <h1>Pengingat obat</h1>
        <p>
          {pilih({
            lansia: 'Jadwal minum obat Bapak/Ibu hari ini. Keluarga juga bisa membantu mengisinya.',
            semua: 'Atur jadwal minum obat untuk diri sendiri atau anggota keluarga.',
          })}
        </p>
        <div data-tour="dengarkan">
          <ListenButton target={jadwal} label="Dengarkan jadwal" />
        </div>
      </header>

      <section ref={jadwal} aria-labelledby="judul-jadwal" data-tour="jadwal">
        <h2 id="judul-jadwal" tabIndex={-1}>
          Hari ini
        </h2>
        <PesanUrungkan kabar={kabar} onUrungkan={urungkanHapus} refTombol={tombolUrungkan} />
        {obat.length === 0 ? (
          <Gelembung pose="pikir" kecil>
            <p>Belum ada obat. Tambahkan obat dulu, atau lihat contohnya.</p>
          </Gelembung>
        ) : (
          WAKTU.map((w) => {
            const daftar = obat.filter((o) => o.waktu.includes(w.id))
            if (!daftar.length) return null
            return (
              <div key={w.id} className="jadwal-waktu">
                <h3>
                  <w.Ikon aria-hidden="true" /> {w.label} <span className="teks-redup">· {w.jam}</span>
                </h3>
                <ul className="jadwal-daftar" role="list">
                  {daftar.map((o) => {
                    const kunci = `${o.id}-${w.id}`
                    const sudah = minum.includes(kunci)
                    return (
                      <li key={kunci} className={`kartu jadwal-obat ${sudah ? 'jadwal-obat--sudah' : ''}`}>
                        <GambarObat bentuk={o.bentuk} warna={o.warna} />
                        <div className="jadwal-obat__teks">
                          <strong>{o.nama}</strong>
                          <span>
                            {o.dosis}, {o.makan} makan
                          </span>
                        </div>
                        <div
                          className="jadwal-obat__aksi"
                          data-tidak-dibaca
                          data-tour={kunci === kunciPertama ? 'aksi-obat' : undefined}
                        >
                          <Checkbox className="pilihan pilihan--kotak" isSelected={sudah} onChange={(v) => tandai(kunci, v)}>
                            <span className="pilihan__tanda" aria-hidden="true">
                              <Check />
                            </span>
                            Sudah diminum<span className="visual-tersembunyi"> {o.nama} {w.label.toLowerCase()}</span>
                          </Checkbox>
                          <Button className="tombol tombol--teks" onPress={() => cobaPengingat(o, w)}>
                            <BellRing aria-hidden="true" /> Coba pengingat
                          </Button>
                          <Button
                            className="tombol tombol--teks"
                            onPress={() => hapusObat(o)}
                            aria-label={`Hapus ${o.nama}`}
                          >
                            <Trash2 aria-hidden="true" />
                          </Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })
        )}
      </section>

      {!form && (
        <div className="baris" style={{ marginTop: 'var(--r5)' }} data-tour="tambah-obat">
          <Button className="tombol tombol--utama tombol--besar" onPress={() => setForm({ ...kosong })}>
            <Plus aria-hidden="true" /> Tambah obat
          </Button>
          {obat.length === 0 && (
            <Button className="tombol" onPress={contoh}>
              Lihat contoh
            </Button>
          )}
        </div>
      )}

      {form && (
        <form className="kartu form-obat tumpuk" onSubmit={simpanForm} noValidate aria-labelledby="judul-form-obat" data-tour="form-obat">
          <h2 id="judul-form-obat">Tambah obat</h2>
          <div className="kolom">
            <label className="label" htmlFor="nama-obat">
              Nama obat
            </label>
            <input
              id="nama-obat"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              aria-invalid={galat.nama ? true : undefined}
              aria-describedby={galat.nama ? 'galat-nama-obat' : undefined}
            />
            {galat.nama && (
              <p className="galat" id="galat-nama-obat">
                <AlertCircle aria-hidden="true" width="18" height="18" /> {galat.nama}
              </p>
            )}
          </div>
          <div className="kolom">
            <label className="label" htmlFor="dosis-obat">
              Dosis sekali minum
            </label>
            <input
              id="dosis-obat"
              value={form.dosis}
              onChange={(e) => setForm({ ...form, dosis: e.target.value })}
              aria-invalid={galat.dosis ? true : undefined}
              aria-describedby={galat.dosis ? 'galat-dosis-obat' : undefined}
            />
            {galat.dosis && (
              <p className="galat" id="galat-dosis-obat">
                <AlertCircle aria-hidden="true" width="18" height="18" /> {galat.dosis}
              </p>
            )}
          </div>
          <PilihanRadio label="Bentuk obat" nilai={form.bentuk} onChange={(v) => setForm({ ...form, bentuk: v })} pilihan={BENTUK} kisi />
          <PilihanRadio
            label="Warna obat (membantu mengenali)"
            nilai={form.warna}
            onChange={(v) => setForm({ ...form, warna: v })}
            pilihan={WARNA_OBAT.map((w) => ({ id: w.id, label: w.label }))}
            kisi
          />
          <CheckboxGroup value={form.waktu} onChange={(v) => setForm({ ...form, waktu: v })} className="kolom" isInvalid={Boolean(galat.waktu)}>
            <Label className="label">Waktu minum</Label>
            <div className="pilihan-grup pilihan-grup--kisi">
              {WAKTU.map((w) => (
                <Checkbox key={w.id} value={w.id} className="pilihan pilihan--kotak">
                  <span className="pilihan__tanda" aria-hidden="true">
                    <Check />
                  </span>
                  <span className="pilihan__isi">
                    {w.label}
                    <small>{w.jam}</small>
                  </span>
                </Checkbox>
              ))}
            </div>
            {galat.waktu && (
              <p className="galat">
                <AlertCircle aria-hidden="true" width="18" height="18" /> {galat.waktu}
              </p>
            )}
          </CheckboxGroup>
          <PilihanRadio
            label="Diminum"
            nilai={form.makan}
            onChange={(v) => setForm({ ...form, makan: v })}
            pilihan={[
              { id: 'sesudah', label: 'Sesudah makan' },
              { id: 'sebelum', label: 'Sebelum makan' },
            ]}
            kisi
          />
          <div className="baris">
            <Button type="submit" className="tombol tombol--utama">
              Simpan obat
            </Button>
            <Button className="tombol" onPress={() => setForm(null)}>
              Batal
            </Button>
          </div>
        </form>
      )}

      <p className="bantuan" style={{ marginTop: 'var(--r5)' }}>
        Ikuti dosis dari dokter atau apoteker. Pengingat di prototipe ini adalah simulasi dan tidak muncul saat website ditutup.
      </p>

      <ModalOverlay
        className="lapisan-dialog"
        isOpen={notifTerbuka}
        onOpenChange={(buka) => {
          if (!buka) {
            hentikan()
            setNotifTerbuka(false)
          }
        }}
        isDismissable
      >
        <Modal className="modal">
          <Dialog className="dialog notifikasi-obat" role="alertdialog">
            {notifikasi && (
              <>
                <div className="baris" style={{ flexWrap: 'nowrap' }}>
                  <GambarObat bentuk={notifikasi.obat.bentuk} warna={notifikasi.obat.warna} ukuran={72} />
                  <div>
                    <p className="label-kecil">
                      <BellRing aria-hidden="true" width="16" height="16" /> Pengingat {notifikasi.waktu.label.toLowerCase()} · {notifikasi.waktu.jam}
                    </p>
                    <Heading slot="title">{kalimatPengingat(notifikasi.obat)}</Heading>
                  </div>
                </div>
                <div className="baris" style={{ marginTop: 'var(--r5)' }}>
                  <Button
                    className="tombol tombol--utama tombol--besar"
                    autoFocus
                    onPress={() => {
                      tandai(`${notifikasi.obat.id}-${notifikasi.waktu.id}`, true)
                      hentikan()
                      setNotifTerbuka(false)
                    }}
                  >
                    <Check aria-hidden="true" /> Sudah diminum
                  </Button>
                  <Button className="tombol" onPress={ingatkanNanti}>
                    Ingatkan 10 menit lagi
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  )
}
