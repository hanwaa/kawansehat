import { useEffect, useState } from 'react'
import { Button } from 'react-aria-components'
import Maskot from '../illustrations/Maskot.jsx'
import { useTur } from '../tour/TourProvider.jsx'
import './tombol-panduan.css'

// Saat halaman digulir ke bawah, balon menyusut sehingga tinggal Si Kawal yang tidak banyak menutupi konten;
// balon muncul lagi saat menggulir ke atas atau kembali ke puncak halaman.
function useRingkasSaatGulir() {
  const [ringkas, setRingkas] = useState(false)
  useEffect(() => {
    let terakhir = window.scrollY
    const cek = () => {
      const y = window.scrollY
      if (Math.abs(y - terakhir) < 8) return
      setRingkas(y > terakhir && y > 120)
      terakhir = y
    }
    window.addEventListener('scroll', cek, { passive: true })
    return () => window.removeEventListener('scroll', cek)
  }, [])
  return ringkas
}

// Tombol mengambang di kanan bawah: balon chat "Lihat Panduan" di atas Si Kawal.
// Satu tombol utuh (balon + maskot) supaya target sentuhnya besar; memutar ulang tur dari halaman mana pun.
export default function TombolPanduan() {
  const tur = useTur()
  const ringkas = useRingkasSaatGulir()
  return (
    <Button
      className="fab-panduan"
      onPress={tur.mulai}
      aria-label="Lihat Panduan Si Kawal"
      data-tour="panduan"
      data-ringkas={ringkas || undefined}
    >
      <span className="fab-panduan__balon">Lihat Panduan</span>
      <span className="fab-panduan__maskot">
        <Maskot pose="lambai" ukuran={64} />
      </span>
    </Button>
  )
}
