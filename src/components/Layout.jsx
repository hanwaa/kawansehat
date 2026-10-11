import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { BookOpen, ClipboardList, House, Phone, Salad, Star } from 'lucide-react'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import { TourProvider } from '../tour/TourProvider.jsx'
import { PikoProvider } from '../piko/PikoProvider.jsx'
import TombolPiko from '../piko/TombolPiko.jsx'
import ModeSwitcher from './ModeSwitcher.jsx'
import './layout.css'

const MENU = {
  anak: [
    { ke: '/beranda', label: 'Beranda', Ikon: House },
    { ke: '/info', label: 'Belajar', Ikon: BookOpen },
    { ke: '/cek-gizi', label: 'Piringku', Ikon: Salad },
    { ke: '/kuis', label: 'Kuis', Ikon: Star },
  ],
  remaja: [
    { ke: '/beranda', label: 'Beranda', Ikon: House },
    { ke: '/info', label: 'Info', Ikon: BookOpen },
    { ke: '/cek-gizi', label: 'Cek Gizi', Ikon: Salad },
    { ke: '/layanan/antrean', label: 'Layanan', Ikon: ClipboardList },
  ],
  dewasa: [
    { ke: '/beranda', label: 'Beranda', Ikon: House },
    { ke: '/info', label: 'Info', Ikon: BookOpen },
    { ke: '/cek-gizi', label: 'Cek Gizi', Ikon: Salad },
    { ke: '/layanan/antrean', label: 'Layanan', Ikon: ClipboardList },
  ],
  lansia: [
    { ke: '/beranda', label: 'Beranda', Ikon: House },
    { ke: '/info', label: 'Info', Ikon: BookOpen },
    { ke: '/cek-gizi', label: 'Cek Badan', Ikon: Salad },
    { ke: '/layanan/antrean', label: 'Antrean', Ikon: ClipboardList },
  ],
}

function Logo() {
  return (
    <svg viewBox="0 0 64 64" width="36" height="36" aria-hidden="true" focusable="false">
      <path d="M32 14c-6-8-16-8-18-2 6 0 12 2 18 8z" fill="#3fa36b" />
      <path d="M32 14c6-8 16-8 18-2-6 0-12 2-18 8z" fill="#2e8a57" />
      <ellipse cx="32" cy="40" rx="22" ry="20" fill="#1f6f4a" />
      <circle cx="24" cy="38" r="3.5" fill="#fff" />
      <circle cx="40" cy="38" r="3.5" fill="#fff" />
      <path d="M25 47q7 6 14 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="44" y="46" width="12" height="12" rx="3" fill="#e0a526" />
      <path d="M50 49v6M47 52h6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

// Saat berpindah halaman: gulir ke atas, pindahkan fokus ke judul, umumkan judul halaman.
function usePengumumanHalaman() {
  const { pathname } = useLocation()
  const [pengumuman, setPengumuman] = useState('')
  const pertama = useRef(true)
  useEffect(() => {
    if (pertama.current) {
      pertama.current = false
      return
    }
    window.scrollTo(0, 0)
    const judul = document.querySelector('main h1') ?? document.querySelector('main')
    if (judul) {
      judul.setAttribute('tabindex', '-1')
      judul.focus({ preventScroll: true })
    }
    setPengumuman(document.title.replace(' · Kawan Sehat', ''))
  }, [pathname])
  return pengumuman
}

// Header harus satu baris: bila logo dan tombol tidak muat (bergantung lebar layar, ukuran teks,
// dan font profil), sembunyikan nama situs. Diukur ulang saat layar diubah, font selesai dimuat,
// atau preferensi tampilan berganti.
function useHeaderRapat(ref, ...pemicu) {
  useLayoutEffect(() => {
    const isi = ref.current
    if (!isi) return
    const terbungkus = () => {
      const logo = isi.querySelector('.logo').getBoundingClientRect()
      const aksi = isi.querySelector('.kepala-situs__aksi').getBoundingClientRect()
      return Math.abs(logo.top + logo.height / 2 - (aksi.top + aksi.height / 2)) > 4
    }
    const cek = () => {
      isi.classList.remove('kepala-situs__isi--rapat', 'kepala-situs__isi--dua-baris')
      if (!terbungkus()) return
      // 1) Coba muat satu baris dengan menyembunyikan nama situs.
      isi.classList.add('kepala-situs__isi--rapat')
      if (!terbungkus()) return
      // 2) Teks sangat besar di layar sempit: dua baris yang rapi (logo + nama, lalu tombol selebar layar).
      isi.classList.replace('kepala-situs__isi--rapat', 'kepala-situs__isi--dua-baris')
    }
    cek()
    window.addEventListener('resize', cek)
    document.fonts?.ready.then(cek)
    return () => window.removeEventListener('resize', cek)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...pemicu])
}

// Tinggi menu bawah (HP) disimpan di --tinggi-nav supaya ruang bawah halaman selalu cukup untuk menu dan Piko
// yang menonjol di atasnya, berapa pun ukuran teksnya.
function useTinggiNavBawah(ref, aktif) {
  useLayoutEffect(() => {
    const akar = document.documentElement
    const nav = ref.current
    if (!aktif || !nav) {
      akar.style.removeProperty('--tinggi-nav')
      return
    }
    const ukur = () => {
      const menempelDiBawah = getComputedStyle(nav).position === 'fixed'
      akar.style.setProperty('--tinggi-nav', menempelDiBawah ? `${nav.offsetHeight}px` : '0px')
    }
    ukur()
    const pengamat = new ResizeObserver(ukur)
    pengamat.observe(nav)
    window.addEventListener('resize', ukur)
    return () => {
      pengamat.disconnect()
      window.removeEventListener('resize', ukur)
    }
  }, [ref, aktif])
}

// Tinggi header (sticky) disimpan di --tinggi-kepala supaya elemen sticky di halaman menempel tepat di bawahnya,
// berapa pun ukuran teks dan jumlah baris header. Di HP landscape header tidak sticky (layout.css), jadi nilainya 0.
function useTinggiKepala(ref) {
  useLayoutEffect(() => {
    const kepala = ref.current
    if (!kepala) return
    const ukur = () => {
      const menempel = getComputedStyle(kepala).position === 'sticky'
      document.documentElement.style.setProperty('--tinggi-kepala', menempel ? `${kepala.offsetHeight}px` : '0px')
    }
    ukur()
    const pengamat = new ResizeObserver(ukur)
    pengamat.observe(kepala)
    window.addEventListener('resize', ukur)
    return () => {
      pengamat.disconnect()
      window.removeEventListener('resize', ukur)
    }
  }, [ref])
}

// Header diberi data-tergulir saat konten mulai bergulir di bawahnya, untuk garis tepi yang baru muncul saat itu.
function useTepiGulir(ref) {
  useEffect(() => {
    const kepala = ref.current
    if (!kepala) return
    const cek = () => kepala.toggleAttribute('data-tergulir', window.scrollY > 4)
    cek()
    window.addEventListener('scroll', cek, { passive: true })
    return () => window.removeEventListener('scroll', cek)
  }, [ref])
}

// Lebar yang sama dengan titik pecah menu bawah di layout.css. Di bawahnya Piko berdiri di tengah menu bawah;
// di atasnya menu pindah ke header dan Piko mengambang di kanan bawah.
const HP = '(max-width: 899px)'
const pantauLayar = (ubah) => {
  const mq = window.matchMedia(HP)
  mq.addEventListener('change', ubah)
  return () => mq.removeEventListener('change', ubah)
}
const useLayarSempit = () => useSyncExternalStore(pantauLayar, () => window.matchMedia(HP).matches)

export default function Layout() {
  const { prefs, profil } = usePrefs()
  const { pathname } = useLocation()
  const pengumuman = usePengumumanHalaman()
  const diPembuka = pathname === '/' || pathname === '/akses'
  const menu = MENU[profil]
  const isiKepala = useRef(null)
  useHeaderRapat(isiKepala, profil, prefs.teks, diPembuka)
  const layarSempit = useLayarSempit()
  const navUtama = useRef(null)
  useTinggiNavBawah(navUtama, !diPembuka && layarSempit)
  const kepala = useRef(null)
  useTinggiKepala(kepala)
  useTepiGulir(kepala)

  const menuUtama = !diPembuka && (
    <nav aria-label="Menu utama" className="navigasi-utama" data-tour="menu" ref={navUtama}>
      <ul>
        {menu.map(({ ke, label, Ikon }, i) => (
          <Fragment key={ke}>
            {layarSempit && i === 2 && (
              <li className="navigasi-utama__piko">
                <TombolPiko />
              </li>
            )}
            <li>
              <NavLink to={ke} end={ke === '/beranda'}>
                <Ikon aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          </Fragment>
        ))}
      </ul>
    </nav>
  )

  return (
    <TourProvider>
      <PikoProvider>
        <a className="lewati-ke-konten" href="#konten">
          Langsung ke konten utama
        </a>
        <header className="kepala-situs" ref={kepala}>
          <div className="wadah kepala-situs__isi" ref={isiKepala}>
            <Link to={prefs.profil ? '/beranda' : '/'} className="logo">
              <Logo />
              <span>Kawan Sehat</span>
            </Link>
            {!layarSempit && menuUtama}
            <div className="kepala-situs__aksi">
              {!diPembuka && <ModeSwitcher />}
              <Link to="/darurat" className="tombol tombol--bahaya tombol--kepala" data-tour="darurat">
                <Phone aria-hidden="true" />
                <span>
                  <span className="visual-tersembunyi">Darurat </span>119
                </span>
              </Link>
            </div>
          </div>
        </header>
        {/* Di HP menu bawah (position: fixed) berada di luar header sticky. Bila bersarang di dalamnya, iOS Safari
            kadang menggambar konten di atas menu saat momentum scroll. */}
        {layarSempit && menuUtama}
        <main id="konten" className={diPembuka ? '' : 'ada-navigasi'}>
          <Outlet />
        </main>
        {!diPembuka && !layarSempit && <TombolPiko mengambang />}
        <footer className="kaki-situs">
          <div className="wadah">
            <p>
              <strong>Kawan Sehat</strong> adalah prototipe untuk UI/UX Competition IT CAS 2026. Informasi di sini tidak
              menggantikan pemeriksaan oleh tenaga kesehatan.
            </p>
            <p>
              Dokumen desain: <a href="/docs/user-flow.html">User flow</a> · <a href="/docs/wireframe.html">Wireframe</a>
            </p>
          </div>
        </footer>
        <div className="visual-tersembunyi" aria-live="polite" aria-atomic="true">
          {pengumuman}
        </div>
      </PikoProvider>
    </TourProvider>
  )
}
