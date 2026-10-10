import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useJudulHalaman } from '../../components/useJudulHalaman.js'
import { usePrefs } from '../../prefs/PrefsProvider.jsx'
import { useTur } from '../../tour/TourProvider.jsx'
import BerandaAnak from './BerandaAnak.jsx'
import BerandaRemaja from './BerandaRemaja.jsx'
import BerandaDewasa from './BerandaDewasa.jsx'
import BerandaLansia from './BerandaLansia.jsx'
import './beranda.css'

const VARIAN = { anak: BerandaAnak, remaja: BerandaRemaja, dewasa: BerandaDewasa, lansia: BerandaLansia }

export default function Beranda() {
  const { profil, prefs } = usePrefs()
  const tur = useTur()
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  useJudulHalaman('Beranda')

  // Setelah pembuka, Piko menawarkan tur (tidak pernah memaksa, dan hanya sekali).
  useEffect(() => {
    if (state?.tawarTur && !prefs.turSelesai) {
      tur.tawarkan()
      navigate(pathname, { replace: true, state: null })
    }
  }, [state, prefs.turSelesai, tur, navigate, pathname])

  const Varian = VARIAN[profil]
  return <Varian />
}
