import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from 'react-aria-components'
import { ArrowRight, Info } from 'lucide-react'
import Gelembung from '../components/Gelembung.jsx'
import ProfilPilihan from '../components/ProfilPilihan.jsx'
import { useJudulHalaman } from '../components/useJudulHalaman.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import './pembuka.css'

const SETELAH_PILIH = {
  anak: 'Asyik! Tampilan ceria untuk anak-anak sudah siap.',
  remaja: 'Oke! Tampilan remaja sudah aktif.',
  dewasa: 'Tampilan dewasa sudah aktif.',
  lansia: 'Tampilan nyaman untuk Bapak/Ibu sudah aktif: huruf lebih besar dan suara dinyalakan.',
}

export default function Pembuka() {
  useJudulHalaman('Selamat datang')
  const { prefs, pilihProfil } = usePrefs()
  const navigate = useNavigate()
  const [galat, setGalat] = useState('')

  const lanjut = () => {
    if (!prefs.profil) {
      setGalat('Pilih salah satu dulu, ya. Kalau ragu, pilih "Dewasa".')
      return
    }
    navigate('/akses')
  }

  const lewati = () => {
    if (!prefs.profil) pilihProfil('dewasa', { pakaiPreset: false })
    navigate('/beranda', { state: { tawarTur: true } })
  }

  return (
    <div className="wadah pembuka">
      <Gelembung pose="lambai" ukuran={120} className="pembuka__sapa">
        <p>
          <strong>Halo! Aku Si Kawal.</strong> Kawal Sehat akan menyesuaikan tampilan, bahasa, dan gambar dengan
          siapa yang memakainya.
        </p>
      </Gelembung>

      <h1>Siapa yang memakai Kawal Sehat hari ini?</h1>
      <p className="pembuka__ket">Pilih salah satu. Tampilan langsung berubah, dan bisa diganti kapan saja.</p>

      <ProfilPilihan />

      <p className="pembuka__status" role="status">
        {prefs.profil ? SETELAH_PILIH[prefs.profil] : ''}
      </p>
      {galat && !prefs.profil && (
        <p className="galat" role="alert">
          <Info aria-hidden="true" /> {galat}
        </p>
      )}

      <div className="baris pembuka__aksi">
        <Button className="tombol tombol--utama tombol--besar" onPress={lanjut}>
          Lanjut atur kenyamanan <ArrowRight aria-hidden="true" />
        </Button>
        <Button className="tombol tombol--teks" onPress={lewati}>
          Lewati, langsung ke beranda
        </Button>
      </div>
    </div>
  )
}
