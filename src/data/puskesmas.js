// Data contoh untuk prototipe. Nama puskesmas FIKTIF, bukan layanan sungguhan.

export const PUSKESMAS = [
  {
    id: 'melati',
    nama: 'Puskesmas Melati (contoh)',
    jarak: '1,2 km',
    fasilitas: ['Ram kursi roda', 'Toilet difabel', 'Juru bahasa isyarat sesuai jadwal'],
  },
  {
    id: 'cempaka',
    nama: 'Puskesmas Cempaka (contoh)',
    jarak: '2,5 km',
    fasilitas: ['Ram kursi roda', 'Loket prioritas lansia'],
  },
  {
    id: 'kenanga',
    nama: 'Puskesmas Kenanga (contoh)',
    jarak: '3,8 km',
    fasilitas: ['Ram kursi roda', 'Toilet difabel', 'Jalur pemandu tunanetra'],
  },
]

export const POLI = [
  { id: 'umum', label: 'Poli Umum', kode: 'U' },
  { id: 'gigi', label: 'Poli Gigi', kode: 'G' },
  { id: 'kia', label: 'Poli KIA', ket: 'Ibu hamil, bayi, dan anak', kode: 'K' },
  { id: 'lansia', label: 'Poli Lansia', kode: 'L' },
  { id: 'gizi', label: 'Poli Gizi', ket: 'Konsultasi berat badan dan pola makan', kode: 'Z' },
]

export const LAYANAN_ONLINE = [
  { id: 'umum', label: 'Dokter umum', kode: 'O' },
  { id: 'gizi', label: 'Ahli gizi', kode: 'O' },
  { id: 'psikolog', label: 'Psikolog', kode: 'O' },
]

export const SESI = [
  { id: 'pagi', label: 'Pagi', ket: '08.00–10.00' },
  { id: 'siang', label: 'Siang', ket: '10.00–12.00' },
]

export const KEBUTUHAN = [
  { id: 'jbi', label: 'Juru bahasa isyarat (BISINDO)', ket: 'Untuk teman Tuli atau sulit mendengar' },
  { id: 'kursi-roda', label: 'Kursi roda', ket: 'Disiapkan di pintu masuk', hanya: 'datang' },
  { id: 'pendamping', label: 'Datang dengan pendamping', ket: 'Keluarga atau pendamping boleh ikut masuk' },
  { id: 'prioritas', label: 'Antrean prioritas', ket: 'Lansia, ibu hamil, atau penyandang disabilitas', hanya: 'datang' },
  { id: 'teks', label: 'Teks percakapan (subtitle)', ket: 'Saat video call', hanya: 'online' },
  { id: 'pembaca', label: 'Dokumen dibacakan', ket: 'Untuk teman tunanetra atau low vision' },
]

// Lima hari layanan berikutnya (Senin–Sabtu).
export function hariLayanan(dari = new Date()) {
  const hasil = []
  const d = new Date(dari)
  while (hasil.length < 5) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) hasil.push(new Date(d))
  }
  return hasil.map((t) => ({
    id: t.toISOString().slice(0, 10),
    label: t.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }),
  }))
}
