export const DAFTAR_PROFIL = ['anak', 'remaja', 'dewasa', 'lansia']

export const PROFIL = {
  anak: { label: 'Anak-anak', rentang: '6–12 tahun', umurContoh: 9 },
  remaja: { label: 'Remaja', rentang: '13–18 tahun', umurContoh: 15 },
  dewasa: { label: 'Dewasa', rentang: '19–59 tahun', umurContoh: 30 },
  lansia: { label: 'Lansia', rentang: '60 tahun ke atas', umurContoh: 65 },
}

export const PREFS_AWAL = {
  profil: null,
  teks: 'normal',
  kontras: false,
  suara: false,
  isyarat: false,
  sederhana: false,
  gerak: false,
  turSelesai: false,
}

// Pengaturan bawaan saat sebuah profil dipilih. Semuanya tetap bisa diubah pengguna.
export const PRESET = {
  anak: { teks: 'normal', suara: false, sederhana: false },
  remaja: { teks: 'normal', suara: false, sederhana: false },
  dewasa: { teks: 'normal', suara: false, sederhana: false },
  lansia: { teks: 'besar', suara: true, sederhana: true },
}

export const UKURAN_TEKS = [
  { id: 'normal', label: 'Normal' },
  { id: 'besar', label: 'Besar' },
  { id: 'sangat-besar', label: 'Sangat besar' },
]
