import { useState } from 'react'
import { Button } from 'react-aria-components'
import { RotateCcw } from 'lucide-react'
import Gelembung from '../../components/Gelembung.jsx'
import IkonMakanan from '../../illustrations/IkonMakanan.jsx'
import PiringDiagram, { SEKTOR_PIRING, titikSektor } from '../../illustrations/PiringDiagram.jsx'
import { beriLencana } from '../../lib/lencana.js'
import { bacakan } from '../../lib/suara.js'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'

// Game anak: ketuk makanan untuk memasukkannya ke bagian piring yang tepat (tanpa angka kalori, tanpa drag).
const MAKANAN_GAME = [
  { id: 'nasi', nama: 'Nasi', kelompok: 'pokok' },
  { id: 'jagung', nama: 'Jagung', kelompok: 'pokok' },
  { id: 'ubi', nama: 'Ubi', kelompok: 'pokok' },
  { id: 'tempe', nama: 'Tempe', kelompok: 'lauk' },
  { id: 'telur', nama: 'Telur', kelompok: 'lauk' },
  { id: 'ikan', nama: 'Ikan', kelompok: 'lauk' },
  { id: 'tahu', nama: 'Tahu', kelompok: 'lauk' },
  { id: 'bayam', nama: 'Bayam', kelompok: 'sayur' },
  { id: 'wortel', nama: 'Wortel', kelompok: 'sayur' },
  { id: 'brokoli', nama: 'Brokoli', kelompok: 'sayur' },
  { id: 'pisang', nama: 'Pisang', kelompok: 'buah' },
  { id: 'jeruk', nama: 'Jeruk', kelompok: 'buah' },
  { id: 'pepaya', nama: 'Pepaya', kelompok: 'buah' },
]

const PENJELASAN = {
  pokok: 'makanan pokok, sumber tenaga',
  lauk: 'lauk pauk, sumber protein untuk tumbuh',
  sayur: 'sayur, penuh vitamin dan mineral',
  buah: 'buah, penuh vitamin dan mineral',
}

const NAMA_BAGIAN = { pokok: 'Makanan pokok', lauk: 'Lauk pauk', sayur: 'Sayur', buah: 'Buah' }
const NAMA_PENDEK = { pokok: 'Pokok', lauk: 'Lauk', sayur: 'Sayur', buah: 'Buah' }
const WARNA_SEKTOR = Object.fromEntries(SEKTOR_PIRING.map((s) => [s.id, s.warna]))

export default function SusunPiring() {
  const { profil, prefs } = usePrefs()
  const [piring, setPiring] = useState({ pokok: null, lauk: null, sayur: null, buah: null })
  const [pesan, setPesan] = useState('Ketuk makanan di bawah untuk mengisi piringmu!')
  const lengkap = Object.values(piring).every(Boolean)

  const ketuk = (m) => {
    const baru = { ...piring, [m.kelompok]: m }
    setPiring(baru)
    const selesai = Object.values(baru).every(Boolean)
    const kalimat = selesai
      ? `Hore! Piringmu sudah lengkap. Kamu dapat lencana Jagoan Piring Sehat!`
      : `${m.nama} masuk ke bagian ${PENJELASAN[m.kelompok]}.`
    setPesan(kalimat)
    if (selesai) beriLencana('piring-sehat')
    if (prefs.suara) bacakan(kalimat, { profil })
  }

  const ulang = () => {
    setPiring({ pokok: null, lauk: null, sayur: null, buah: null })
    setPesan('Piring kosong lagi. Ayo susun ulang!')
  }

  return (
    <div className="susun-piring">
      <div className="susun-piring__atas">
        <div className="susun-piring__piring" data-tour="piring">
          <PiringDiagram terisi={piring}>
            {Object.entries(piring).map(([k, m]) => {
              if (!m) return null
              const t = titikSektor(k, k === 'pokok' || k === 'sayur' ? 52 : 60)
              return (
                <foreignObject key={`${k}-${m.id}`} x={t.x - 24} y={t.y - 24} width="48" height="48">
                  <IkonMakanan nama={m.id} ukuran={48} />
                </foreignObject>
              )
            })}
          </PiringDiagram>
        </div>
        <div>
          <Gelembung pose={lengkap ? 'jempol' : 'tunjuk'} kecil>
            <p role="status">{pesan}</p>
          </Gelembung>
          <h2 className="susun-piring__judul-daftar">Isi piringmu</h2>
          <ul className="susun-piring__bagian" role="list">
            {Object.entries(piring).map(([k, m]) => (
              <li key={k} className={m ? 'terisi' : ''}>
                <strong>{NAMA_BAGIAN[k]}:</strong> {m ? m.nama : 'belum diisi'}
              </li>
            ))}
          </ul>
          {lengkap && (
            <Button className="tombol" onPress={ulang}>
              <RotateCcw aria-hidden="true" /> Main lagi
            </Button>
          )}
        </div>
      </div>

      <div className="susun-piring__pilih">
        <h2>Pilih makanan</h2>
        {/* Piring mini yang menempel saat daftar makanan digulir: di HP piring besar sudah di luar layar, jadi
            hasil setiap ketukan tetap terlihat di dekat jari. Hanya visual, isinya sama dengan daftar "Isi piringmu". */}
        <ol className="piring-mini" aria-hidden="true">
          {Object.entries(piring).map(([k, m]) => (
            <li key={k} className={m ? 'terisi' : ''}>
              <span className="piring-mini__wadah" style={m ? { background: WARNA_SEKTOR[k] } : undefined}>
                {m && <IkonMakanan key={m.id} nama={m.id} ukuran={32} />}
              </span>
              <span>{NAMA_PENDEK[k]}</span>
            </li>
          ))}
        </ol>
        <ul className="susun-piring__makanan" role="list" data-tour="pilih-makanan">
          {MAKANAN_GAME.map((m) => (
            <li key={m.id}>
              <Button
                className="makanan-tombol"
                onPress={() => ketuk(m)}
                aria-pressed={piring[m.kelompok]?.id === m.id}
              >
                <IkonMakanan nama={m.id} ukuran={56} />
                <span>{m.nama}</span>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
