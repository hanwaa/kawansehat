import { useEffect, useState } from 'react'
import { Button } from 'react-aria-components'
import Maskot from '../illustrations/Maskot.jsx'
import { useTur } from '../tour/TourProvider.jsx'
import './tombol-panduan.css'

// Saat halaman digulir ke bawah, balon menyusut sehingga tinggal Si Kawal yang tidak banyak menutupi konten;
// balon muncul lagi setelah menggulir ke atas sedikitnya 48px atau kembali ke puncak halaman. Ambang yang tidak
// sama ini mencegah balon berkedip saat jari sedikit goyang di tengah membaca.
function useRingkasSaatGulir() {
  const [ringkas, setRingkas] = useState(false)
  useEffect(() => {
    let sekarang = false
    // Titik terjauh yang dicapai searah keadaan sekarang: terendah saat balon tampil, terdalam saat ringkas.
    let acuan = window.scrollY
    const cek = () => {
      const y = window.scrollY
      if (sekarang) {
        acuan = Math.max(acuan, y)
        if (y > 120 && acuan - y < 48) return
      } else {
        acuan = Math.min(acuan, y)
        if (y <= 120 || y - acuan < 8) return
      }
      sekarang = !sekarang
      acuan = y
      setRingkas(sekarang)
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
