import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button, Dialog, Form, Heading, Input, Label, Modal, ModalOverlay, TextField } from 'react-aria-components'
import { ChevronRight, Phone, SendHorizontal, X } from 'lucide-react'
import Maskot from '../illustrations/Maskot.jsx'
import { IsyaratContoh } from '../illustrations/Adegan.jsx'
import { useLembar } from '../components/useLembar.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import { SARAN } from './jawab.js'
import './tanya-piko.css'

const SAPAAN = {
  anak: 'Halo! Aku Piko. Pilih pertanyaan di bawah, nanti aku jawab!',
  remaja: 'Hai, aku Piko! Mau tanya soal kesehatan atau cara pakai Kawan Sehat? Ketik aja, atau pilih salah satu di bawah.',
  dewasa: 'Halo, saya Piko. Silakan bertanya soal kesehatan atau cara memakai Kawan Sehat, atau pilih salah satu pertanyaan berikut.',
  lansia: 'Selamat datang, Bapak/Ibu. Saya Piko. Silakan pilih pertanyaan di bawah, atau tulis pertanyaan Bapak/Ibu.',
}

const CATATAN = {
  anak: 'Piko bukan dokter. Kalau ada yang sakit parah, segera panggil orang dewasa.',
  remaja: 'Piko bukan dokter. Darurat? Tekan 119. Jangan tulis nama, NIK, atau alamatmu.',
  semua: 'Piko bukan dokter. Keadaan darurat? Tekan 119. Jangan tulis nama, NIK, atau alamat.',
}

// Ikuti pilihan "Kurangi animasi" di aplikasi maupun setelan sistem.
const gerakDikurangi = () =>
  !!document.documentElement.dataset.gerak || window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Jawaban Piko: teks, poin, tombol 119 bila darurat, lalu tautan sebagai baris di kaki bubble. Avatar memakai satu
// pose tetap per jenis pesan supaya percakapan tidak ramai.
function PesanPiko({ isi, pose, onTutup, isyarat }) {
  return (
    <li className="pesan pesan--piko">
      <Maskot pose={pose ?? (isi.darurat ? 'pikir' : 'jempol')} ukuran={32} />
      <div className={`pesan__balon ${isi.darurat ? 'pesan__balon--darurat' : ''}`}>
        <p>
          <span className="visual-tersembunyi">Piko: </span>
          {isi.teks}
        </p>
        {isi.poin?.length > 0 && (
          <ul className="pesan__poin">
            {isi.poin.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        {isi.darurat && (
          <a href="tel:119" className="tombol tombol--bahaya pesan__telepon">
            <Phone aria-hidden="true" /> Telepon 119
          </a>
        )}
        {isyarat && (
          <div className="pesan__isyarat">
            <IsyaratContoh />
            <span>Video BISINDO (contoh)</span>
          </div>
        )}
        {isi.tautan?.length > 0 && (
          <ul role="list" className="pesan__tautan">
            {isi.tautan.map((t) => (
              <li key={t.ke}>
                {/* Langsung ditutup, tanpa pegas: halaman tujuan memindahkan fokus ke judulnya, dan itu hanya bisa
                    terjadi bila dialog sudah tidak menahan fokus. */}
                <Link to={t.ke} className="pesan__tautan-baris" onClick={onTutup}>
                  <span>{t.label}</span>
                  <ChevronRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

// Pertanyaan siap ketuk: saran awal maupun pertanyaan lanjutan dari jawaban terakhir. Letaknya di luar role="log"
// supaya tidak ikut diumumkan sebagai isi jawaban. Mengetuknya sama dengan mengirim pertanyaan itu.
function Pilihan({ label, daftar, onPilih }) {
  const id = useId()
  return (
    <div className="obrolan__pilihan">
      <p id={id} className="obrolan__pilihan-label">
        {label}
      </p>
      <ul role="list" className="obrolan__saran" aria-labelledby={id}>
        {daftar.map((s) => (
          <li key={s}>
            <Button className="obrolan__saran-tombol" onPress={() => onPilih(s)}>
              {s}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Panel obrolan Tanya Piko. HP & tablet: lembar dari bawah, tempat Piko berdiri di menu bawah. Desktop: panel di
// kanan bawah yang tumbuh dari sudut Piko mengambang. Kepala dan kolom tulis tetap; isi percakapan bergulir.
export default function TanyaPiko({ terbuka, onTutup, pesan, menunggu, onKirim, onHapus }) {
  const { prefs, profil, pilih } = usePrefs()
  const [teks, setTeks] = useState('')
  const kolom = useRef(null)
  const gulir = useRef(null)
  const bisaMengetik = profil !== 'anak'
  const saya = pilih({ anak: 'Kamu', remaja: 'Kamu', semua: 'Anda' })
  // HP & tablet: lembar yang bisa ditarik turun. Tombol X, Esc, dan ketuk di luar juga menutup lewat pegas.
  const {
    pasang: pasangLembar,
    onOpenChange: gantiBuka,
    tutup: tutupLembar,
  } = useLembar({ onOpenChange: (buka) => !buka && onTutup(), media: '(max-width: 899px)' })

  // Pilihan di bawah percakapan: saran awal saat obrolan kosong, lalu pertanyaan lanjutan dari jawaban terakhir.
  // Disembunyikan selama Piko mengetik. Anak tidak bisa mengetik, jadi saran awal muncul lagi bila jawaban terakhir
  // tidak punya lanjutan (misalnya jawaban darurat).
  const terakhir = pesan.at(-1)
  const akhirDariPiko = terakhir?.dari === 'piko'
  const lanjutan = akhirDariPiko ? (terakhir.lanjutan ?? []) : []
  const pakaiLanjutan = lanjutan.length > 0
  const pakaiSaran = !pakaiLanjutan && (pesan.length === 0 || !bisaMengetik)
  const daftarPilihan = menunggu ? [] : pakaiLanjutan ? lanjutan : pakaiSaran ? SARAN[profil] : []
  const labelPilihan = pakaiLanjutan
    ? pilih({ anak: 'Tanya lagi', semua: 'Tanya lanjut' })
    : pilih({ anak: 'Pilih pertanyaanmu', semua: 'Pilih pertanyaan' })

  // Pesan terbaru (dan indikator mengetik) selalu terlihat; jawaban Piko yang lebih tinggi dari area gulir
  // ditampilkan dari awal kalimatnya. Obrolan kosong dimulai dari atas supaya sapaan dan catatan terbaca dulu.
  // Saat panel baru dibuka, langsung di posisinya tanpa animasi.
  const sudahTampil = useRef(false)
  useLayoutEffect(() => {
    const el = gulir.current
    if (!terbuka || !el) {
      sudahTampil.current = false
      return
    }
    let top = pesan.length ? el.scrollHeight : 0
    if (!menunggu && akhirDariPiko) {
      const jawaban = el.querySelector('.obrolan__log > li:last-child')
      const awal = jawaban.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 12
      top = Math.min(el.scrollHeight - el.clientHeight, awal)
    }
    const halus = sudahTampil.current && !gerakDikurangi()
    el.scrollTo({ top, behavior: halus ? 'smooth' : 'instant' })
    sudahTampil.current = true
  }, [terbuka, pesan.length, menunggu, akhirDariPiko])

  // Tombol pilihan hilang begitu diketuk. Fokus dipindah ke area percakapan supaya tidak jatuh ke <body>, dan
  // bukan ke kolom tulis, yang di HP akan memunculkan keyboard dan menutupi jawaban.
  const pilihSaran = (s) => {
    onKirim(s)
    gulir.current?.focus({ preventScroll: true })
  }

  const kirimTeks = () => {
    if (!teks.trim() || menunggu) return
    onKirim(teks)
    setTeks('')
    // Tombol Kirim nonaktif selama menunggu; fokus dikembalikan ke kolom supaya tidak hilang ke <body>.
    kolom.current?.focus()
  }

  return (
    <ModalOverlay
      isOpen={terbuka}
      onOpenChange={gantiBuka}
      isDismissable
      className="lapisan-dialog lapisan-obrolan"
    >
      <Modal ref={pasangLembar} className="modal obrolan">
        <Dialog className="obrolan__dialog">
          <div className="obrolan__kepala" data-pegangan>
            <Maskot pose="lambai" ukuran={44} />
            <div className="obrolan__nama">
              <Heading slot="title">Tanya Piko</Heading>
              <p>Pemandu Informasi Kesehatan Optimal</p>
            </div>
            <Button className="tombol tombol--teks" onPress={tutupLembar} aria-label="Tutup">
              <X aria-hidden="true" />
            </Button>
          </div>

          <div className="obrolan__gulir" ref={gulir} tabIndex={-1}>
            <div className="obrolan__catatan">
              <p>{pilih(CATATAN)}</p>
              <p>Versi contoh: jawaban Piko belum memakai AI.</p>
              {pesan.length > 0 && (
                <Button className="tombol tombol--teks obrolan__hapus" onPress={onHapus}>
                  Hapus obrolan
                </Button>
              )}
            </div>

            <div role="log" aria-label="Percakapan dengan Piko">
              <ol role="list" className="obrolan__log">
                <PesanPiko isi={{ teks: pilih(SAPAAN) }} pose="lambai" isyarat={prefs.isyarat} />
                {pesan.map((p) =>
                  p.dari === 'kamu' ? (
                    <li key={p.id} className="pesan pesan--kamu">
                      <p className="pesan__balon">
                        <span className="visual-tersembunyi">{saya}: </span>
                        {p.teks}
                      </p>
                    </li>
                  ) : (
                    <PesanPiko key={p.id} isi={p} onTutup={onTutup} isyarat={prefs.isyarat} />
                  ),
                )}
                {menunggu && (
                  <li className="pesan pesan--piko pesan--mengetik" aria-hidden="true">
                    <Maskot pose="pikir" ukuran={32} />
                    <div className="pesan__balon">
                      <span className="titik-mengetik">
                        <span />
                        <span />
                        <span />
                      </span>
                    </div>
                  </li>
                )}
              </ol>
            </div>
            <p className="visual-tersembunyi" role="status">
              {menunggu ? 'Piko sedang mengetik…' : ''}
            </p>

            {/* Pilihan ikut bergulir di bawah jawaban terakhir, tidak diletakkan di bagian bawah yang tetap, karena saat
                teks diperbesar tombol-tombolnya akan menutupi hampir seluruh obrolan. */}
            {daftarPilihan.length > 0 && (
              <Pilihan key={terakhir?.id ?? 'awal'} label={labelPilihan} daftar={daftarPilihan} onPilih={pilihSaran} />
            )}
          </div>

          <div className="obrolan__bawah">
            {bisaMengetik ? (
              <Form
                className="obrolan__tulis"
                onSubmit={(e) => {
                  e.preventDefault()
                  kirimTeks()
                }}
              >
                <TextField className="obrolan__kolom" value={teks} onChange={setTeks}>
                  <Label className="visual-tersembunyi">Tulis pertanyaan untuk Piko</Label>
                  <Input
                    ref={kolom}
                    className="input"
                    placeholder={pilih({ remaja: 'Tulis pertanyaanmu…', semua: 'Tulis pertanyaan…' })}
                    autoComplete="off"
                    enterKeyHint="send"
                  />
                </TextField>
                <Button type="submit" className="tombol tombol--utama" isDisabled={!teks.trim() || menunggu}>
                  <SendHorizontal aria-hidden="true" /> <span className="obrolan__kirim-label">Kirim</span>
                </Button>
              </Form>
            ) : (
              <p className="obrolan__ajak">Ajak ayah, ibu, atau guru saat bertanya, ya!</p>
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
