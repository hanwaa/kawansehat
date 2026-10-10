import { Hand } from 'lucide-react'
import { IsyaratContoh } from '../illustrations/Adegan.jsx'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import './sign-video.css'

// Slot video Bahasa Isyarat Indonesia (BISINDO). Di prototipe ini berupa contoh berlabel jelas + transkrip.
export default function SignVideo({ transkrip, judul = 'Penjelasan dalam BISINDO' }) {
  const { prefs } = usePrefs()
  if (!prefs.isyarat) return null
  return (
    <figure className="isyarat" data-tidak-dibaca data-tour="isyarat">
      <div className="isyarat__video">
        <IsyaratContoh />
        <span className="isyarat__label">Contoh</span>
      </div>
      <figcaption>
        <strong>
          <Hand aria-hidden="true" /> {judul}
        </strong>
        <p className="bantuan">
          Di versi akhir, bagian ini berisi video juru bahasa isyarat BISINDO yang direkam bersama komunitas Tuli.
        </p>
        <details>
          <summary>Baca transkrip</summary>
          <p>{transkrip}</p>
        </details>
      </figcaption>
    </figure>
  )
}
