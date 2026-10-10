import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-aria-components'
import { Square, Volume2 } from 'lucide-react'
import { adaSuaraIndonesia, bacakan, hentikan, suaraDidukung } from '../lib/suara.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import './listen-button.css'

const SELEKTOR = 'h1, h2, h3, p, li, [data-baca]'

function ambilElemen(wadah) {
  return [...wadah.querySelectorAll(SELEKTOR)].filter(
    (el) =>
      el.offsetParent !== null &&
      !el.closest('[data-tidak-dibaca]') &&
      // Hindari membaca dua kali: lewati elemen yang berada di dalam elemen lain yang sudah dibaca.
      !el.parentElement.closest(SELEKTOR),
  )
}

/**
 * Tombol "Dengarkan": membacakan isi `target` paragraf demi paragraf sambil menyorotnya.
 */
export default function ListenButton({ target, label = 'Dengarkan', className = '', ...rest }) {
  const { profil, prefs } = usePrefs()
  const [membaca, setMembaca] = useState(false)
  const [pesan, setPesan] = useState('')
  const sorot = useRef(null)

  useEffect(() => () => hentikan(), [])

  const bersihkanSorot = () => {
    sorot.current?.classList.remove('sedang-dibaca')
    sorot.current = null
  }

  const tekan = () => {
    if (!suaraDidukung()) {
      setPesan('Maaf, browser ini belum bisa membacakan teks.')
      return
    }
    if (membaca) {
      hentikan()
      bersihkanSorot()
      setMembaca(false)
      return
    }
    const wadah = typeof target === 'function' ? target() : target?.current
    if (!wadah) return
    const elemen = ambilElemen(wadah)
    setPesan(adaSuaraIndonesia() ? '' : 'Suara bahasa Indonesia tidak ditemukan di perangkat ini, jadi dibacakan dengan suara bawaan.')
    setMembaca(true)
    // Opsi `behavior` di JS mengalahkan `scroll-behavior` di CSS, jadi preferensi gerak dicek di sini.
    const gulir = prefs.gerak || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    bacakan(
      elemen.map((el) => el.innerText),
      {
        kecepatan: profil === 'lansia' ? 0.9 : 1,
        onMulai: (i) => {
          bersihkanSorot()
          sorot.current = elemen[i]
          elemen[i].classList.add('sedang-dibaca')
          elemen[i].scrollIntoView({ block: 'nearest', behavior: gulir })
        },
        onSelesai: () => {
          bersihkanSorot()
          setMembaca(false)
        },
      },
    )
  }

  return (
    <span className="dengarkan" data-tidak-dibaca>
      <Button className={`tombol ${className}`} onPress={tekan} {...rest}>
        {membaca ? <Square aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        {membaca ? 'Berhenti membacakan' : label}
      </Button>
      {pesan && (
        <span className="bantuan" role="status">
          {pesan}
        </span>
      )}
    </span>
  )
}
