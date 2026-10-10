// Token & gaya dasar dimuat lebih dulu supaya gaya halaman bisa menimpanya.
import './styles/tokens.css'
import './styles/base.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { PrefsProvider } from './prefs/PrefsProvider.jsx'
import { router } from './router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrefsProvider>
      <RouterProvider router={router} />
    </PrefsProvider>
  </StrictMode>,
)
