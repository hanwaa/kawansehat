import { Label, Radio, RadioGroup, Switch } from 'react-aria-components'
import { Contrast, Hand, LayoutList, Sparkles, Volume2 } from 'lucide-react'
import { UKURAN_TEKS } from '../prefs/presets.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import './akses-kontrol.css'

const SAKLAR = [
  { id: 'kontras', Ikon: Contrast, label: 'Kontras tinggi', ket: 'Warna lebih tegas, mudah dibaca' },
  { id: 'suara', Ikon: Volume2, label: 'Bacakan teks', ket: 'Panduan dan hasil penting dibacakan otomatis' },
  { id: 'isyarat', Ikon: Hand, label: 'Bahasa isyarat (BISINDO)', ket: 'Tampilkan video isyarat dan transkrip' },
  { id: 'sederhana', Ikon: LayoutList, label: 'Tampilan sederhana', ket: 'Sembunyikan hiasan dan info tambahan' },
  { id: 'gerak', Ikon: Sparkles, label: 'Kurangi animasi', ket: 'Matikan gerakan dan efek' },
]

export function Saklar({ nilai, onChange, Ikon, label, ket }) {
  return (
    <Switch className="saklar" isSelected={nilai} onChange={onChange}>
      {({ isSelected }) => (
        <>
          <span className="saklar__isi">
            <Ikon aria-hidden="true" />
            <span>
              {label}
              <small>{ket}</small>
            </span>
          </span>
          <span className="baris" style={{ flexWrap: 'nowrap', gap: 'var(--r2)', marginLeft: 'auto' }}>
            <span className="saklar__status" aria-hidden="true">
              {isSelected ? 'Aktif' : 'Mati'}
            </span>
            <span className="saklar__jalur" aria-hidden="true" />
          </span>
        </>
      )}
    </Switch>
  )
}

export default function AksesKontrol() {
  const { prefs, ubah } = usePrefs()
  return (
    <div className="akses-kontrol">
      <RadioGroup
        value={prefs.teks}
        onChange={(teks) => ubah({ teks })}
        orientation="horizontal"
        className="akses-kontrol__teks"
      >
        <Label className="label">Ukuran teks</Label>
        <div className="akses-kontrol__ukuran">
          {UKURAN_TEKS.map((u, i) => (
            <Radio key={u.id} value={u.id} className="pilihan ukuran-teks">
              <span aria-hidden="true" className="ukuran-teks__contoh" style={{ fontSize: `${1 + i * 0.3}em` }}>
                Aa
              </span>
              {u.label}
            </Radio>
          ))}
        </div>
      </RadioGroup>
      <div className="akses-kontrol__saklar" role="group" aria-label="Kenyamanan">
        {SAKLAR.map((s) => (
          <Saklar key={s.id} {...s} nilai={prefs[s.id]} onChange={(v) => ubah({ [s.id]: v })} />
        ))}
      </div>
    </div>
  )
}
