import { useRef } from 'react'
import { Label, Radio, RadioGroup } from 'react-aria-components'
import { Check } from 'lucide-react'
import { POTRET } from '../illustrations/Potret.jsx'
import { DAFTAR_PROFIL, PROFIL } from '../prefs/presets.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import './profil-pilihan.css'

// Empat kartu profil bergambar. Memilih kartu langsung mengubah tampilan (pratinjau hidup).
export default function ProfilPilihan({ label = 'Siapa yang memakai Kawal Sehat?', ringkas = false }) {
  const { prefs, pilihProfil } = usePrefs()
  const grup = useRef(null)
  // Kartu yang diketuk dijadikan jangkar: tetap di bawah jari walau tampilan (dan ukuran teks) berubah.
  const pilih = (p) => pilihProfil(p, { jangkar: grup.current?.querySelector(`[data-profil-id="${p}"]`) })
  return (
    <RadioGroup
      ref={grup}
      value={prefs.profil}
      onChange={pilih}
      className={`profil-grup ${ringkas ? 'profil-grup--ringkas' : ''}`}
    >
      <Label className={ringkas ? 'label' : 'visual-tersembunyi'}>{label}</Label>
      <div className="profil-grup__daftar">
        {DAFTAR_PROFIL.map((id) => {
          const Potret = POTRET[id]
          return (
            <Radio key={id} value={id} className="profil-kartu" data-profil-id={id}>
              <span className="profil-kartu__gambar" aria-hidden="true">
                <Potret />
              </span>
              <span className="profil-kartu__teks">
                <span className="profil-kartu__nama">{PROFIL[id].label}</span>
                <span className="profil-kartu__rentang">{PROFIL[id].rentang}</span>
              </span>
              <span className="profil-kartu__centang" aria-hidden="true">
                <Check />
              </span>
            </Radio>
          )
        })}
      </div>
    </RadioGroup>
  )
}
