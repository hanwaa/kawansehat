import { usePrefs } from '../prefs/PrefsProvider.jsx'

// Merender isi hanya untuk profil tertentu, misalnya <ForProfile only={['anak']}>.
export default function ForProfile({ only, children }) {
  const { profil } = usePrefs()
  return only.includes(profil) ? children : null
}
