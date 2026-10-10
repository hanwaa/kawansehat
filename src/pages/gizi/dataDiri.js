import { useState } from 'react'
import { baca, tulis } from '../../lib/simpan.js'
import { PROFIL } from '../../prefs/presets.js'

// Data diri untuk perhitungan gizi. Hanya tersimpan di perangkat pengguna.
const KUNCI = 'ks-data-diri'

export function useDataDiri(profil) {
  const [data, setData] = useState(() => baca(KUNCI, null) ?? { jk: '', umurTahun: String(PROFIL[profil].umurContoh), umurBulan: '0' })
  const simpan = (baru) => {
    setData(baru)
    tulis(KUNCI, baru)
  }
  return [data, simpan]
}
