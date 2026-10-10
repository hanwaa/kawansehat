import { Button } from 'react-aria-components'
import Maskot from '../illustrations/Maskot.jsx'
import { useTur } from '../tour/TourProvider.jsx'
import './tombol-panduan.css'

// Tombol mengambang di kanan bawah: balon chat "Lihat Panduan" di atas Si Kawal.
// Satu tombol utuh (balon + maskot) supaya target sentuhnya besar; memutar ulang tur dari halaman mana pun.
export default function TombolPanduan() {
  const tur = useTur()
  return (
    <Button className="fab-panduan" onPress={tur.mulai} aria-label="Lihat Panduan Si Kawal" data-tour="panduan">
      <span className="fab-panduan__balon">Lihat Panduan</span>
      <span className="fab-panduan__maskot">
        <Maskot pose="lambai" ukuran={64} />
      </span>
    </Button>
  )
}
