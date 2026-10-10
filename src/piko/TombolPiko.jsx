import { useEffect, useRef } from 'react'
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'
import { BookOpen, MessageCircle } from 'lucide-react'
import Maskot from '../illustrations/Maskot.jsx'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import { useTur } from '../tour/TourProvider.jsx'
import { usePiko } from './PikoProvider.jsx'
import './tombol-piko.css'

// Piko: di HP berdiri di tengah menu bawah, di desktop mengambang di kanan bawah. Mengetuknya memunculkan dua
// balon yang tumbuh dari Piko: "Lihat Panduan" (panduan halaman ini) dan "Tanya Piko" (obrolan).
export default function TombolPiko({ mengambang = false }) {
  const tur = useTur()
  const piko = usePiko()
  const { pilih } = usePrefs()
  const label = pilih({ lansia: 'Bantuan', semua: 'Piko' })

  // Panduan dan obrolan baru dibuka setelah balon selesai menutup dan React Aria mengembalikan fokus ke Piko.
  // Dengan begitu, saat panduan atau obrolan ditutup, fokus kembali ke Piko, bukan hilang bersama balon yang
  // sudah dilepas. Bila fokus tidak kembali (misalnya diambil alih elemen lain), aksi tetap dijalankan.
  const tertunda = useRef(null)
  const cadangan = useRef(0)
  const jalankan = () => {
    clearTimeout(cadangan.current)
    const aksi = tertunda.current
    tertunda.current = null
    if (aksi === 'panduan') tur.mulai()
    if (aksi === 'tanya') piko.buka()
  }
  const pilihAksi = (aksi) => {
    tertunda.current = aksi
    cadangan.current = setTimeout(jalankan, 400)
  }
  useEffect(() => () => clearTimeout(cadangan.current), [])

  return (
    <MenuTrigger>
      <Button
        className={`piko ${mengambang ? 'piko--mengambang' : ''}`}
        aria-label={`${label}: panduan dan tanya jawab`}
        data-tour="piko"
        onFocus={() => tertunda.current && jalankan()}
      >
        <span className="piko__piring">
          <Maskot pose="lambai" ukuran={52} />
        </span>
        <span className="piko__label">{label}</span>
      </Button>
      <Popover
        className={`piko-pilihan ${mengambang ? 'piko-pilihan--mengambang' : ''}`}
        placement={mengambang ? 'top end' : 'top'}
        offset={10}
        shouldFlip={false}
      >
        <Menu className="piko-pilihan__menu" aria-label={label} onAction={pilihAksi}>
          <MenuItem id="panduan" className="piko-pilihan__balon" textValue="Lihat Panduan">
            <BookOpen aria-hidden="true" /> Lihat Panduan
          </MenuItem>
          <MenuItem id="tanya" className="piko-pilihan__balon" textValue="Tanya Piko">
            <MessageCircle aria-hidden="true" /> Tanya Piko
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}
