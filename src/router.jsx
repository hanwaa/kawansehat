import { createBrowserRouter } from 'react-router'
import Layout from './components/Layout.jsx'

// Setiap halaman dimuat saat dibutuhkan supaya muatan awal ringan di HP murah dan kuota terbatas.
const halaman = (impor) => () => impor().then((m) => ({ Component: m.default }))

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', lazy: halaman(() => import('./pages/Pembuka.jsx')) },
      { path: '/akses', lazy: halaman(() => import('./pages/Akses.jsx')) },
      { path: '/beranda', lazy: halaman(() => import('./pages/beranda/Beranda.jsx')) },
      { path: '/info', lazy: halaman(() => import('./pages/info/InfoList.jsx')) },
      { path: '/info/:topik', lazy: halaman(() => import('./pages/info/InfoTopik.jsx')) },
      { path: '/cek-gizi', lazy: halaman(() => import('./pages/gizi/CekGizi.jsx')) },
      { path: '/cek-gizi/imt', lazy: halaman(() => import('./pages/gizi/CekIMT.jsx')) },
      { path: '/cek-gizi/kebutuhan', lazy: halaman(() => import('./pages/gizi/Kebutuhan.jsx')) },
      { path: '/cek-gizi/makanan', lazy: halaman(() => import('./pages/gizi/CekMakanan.jsx')) },
      { path: '/layanan/antrean', lazy: halaman(() => import('./pages/layanan/Antrean.jsx')) },
      { path: '/layanan/tiket', lazy: halaman(() => import('./pages/layanan/Tiket.jsx')) },
      { path: '/pengingat-obat', lazy: halaman(() => import('./pages/PengingatObat.jsx')) },
      { path: '/darurat', lazy: halaman(() => import('./pages/Darurat.jsx')) },
      { path: '/kuis', lazy: halaman(() => import('./pages/Kuis.jsx')) },
      { path: '*', lazy: halaman(() => import('./pages/NotFound.jsx')) },
    ],
  },
])
