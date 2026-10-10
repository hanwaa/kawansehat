import { useEffect } from 'react'

// Setiap halaman memberi judul sendiri; Layout memakai judul ini untuk pengumuman pindah halaman.
export function useJudulHalaman(judul) {
  useEffect(() => {
    document.title = judul ? `${judul} · Kawal Sehat` : 'Kawal Sehat'
  }, [judul])
}
