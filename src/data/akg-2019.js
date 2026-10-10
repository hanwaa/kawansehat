// Angka Kecukupan Gizi (AKG) per orang per hari.
// Sumber: Permenkes No. 28 Tahun 2019, Lampiran I Tabel 1 (Berita Negara 2019 No. 956).
// Satuan: energi kkal, protein/lemak/karbo/serat gram, air ml.

export const AKG = [
  { id: 'anak-1-3', label: 'Anak 1–3 tahun', jk: null, umurMin: 1, umurMax: 3, energi: 1350, protein: 20, lemak: 45, karbo: 215, serat: 19, air: 1150 },
  { id: 'anak-4-6', label: 'Anak 4–6 tahun', jk: null, umurMin: 4, umurMax: 6, energi: 1400, protein: 25, lemak: 50, karbo: 220, serat: 20, air: 1450 },
  { id: 'anak-7-9', label: 'Anak 7–9 tahun', jk: null, umurMin: 7, umurMax: 9, energi: 1650, protein: 40, lemak: 55, karbo: 250, serat: 23, air: 1650 },

  { id: 'l-10-12', label: 'Laki-laki 10–12 tahun', jk: 'laki', umurMin: 10, umurMax: 12, energi: 2000, protein: 50, lemak: 65, karbo: 300, serat: 28, air: 1850 },
  { id: 'l-13-15', label: 'Laki-laki 13–15 tahun', jk: 'laki', umurMin: 13, umurMax: 15, energi: 2400, protein: 70, lemak: 80, karbo: 350, serat: 34, air: 2100 },
  { id: 'l-16-18', label: 'Laki-laki 16–18 tahun', jk: 'laki', umurMin: 16, umurMax: 18, energi: 2650, protein: 75, lemak: 85, karbo: 400, serat: 37, air: 2300 },
  { id: 'l-19-29', label: 'Laki-laki 19–29 tahun', jk: 'laki', umurMin: 19, umurMax: 29, energi: 2650, protein: 65, lemak: 75, karbo: 430, serat: 37, air: 2500 },
  { id: 'l-30-49', label: 'Laki-laki 30–49 tahun', jk: 'laki', umurMin: 30, umurMax: 49, energi: 2550, protein: 65, lemak: 70, karbo: 415, serat: 36, air: 2500 },
  { id: 'l-50-64', label: 'Laki-laki 50–64 tahun', jk: 'laki', umurMin: 50, umurMax: 64, energi: 2150, protein: 65, lemak: 60, karbo: 340, serat: 30, air: 2500 },
  { id: 'l-65-80', label: 'Laki-laki 65–80 tahun', jk: 'laki', umurMin: 65, umurMax: 80, energi: 1800, protein: 64, lemak: 50, karbo: 275, serat: 25, air: 1800 },
  { id: 'l-80', label: 'Laki-laki 80 tahun ke atas', jk: 'laki', umurMin: 81, umurMax: 150, energi: 1600, protein: 64, lemak: 45, karbo: 235, serat: 22, air: 1600 },

  { id: 'p-10-12', label: 'Perempuan 10–12 tahun', jk: 'perempuan', umurMin: 10, umurMax: 12, energi: 1900, protein: 55, lemak: 65, karbo: 280, serat: 27, air: 1850 },
  { id: 'p-13-15', label: 'Perempuan 13–15 tahun', jk: 'perempuan', umurMin: 13, umurMax: 15, energi: 2050, protein: 65, lemak: 70, karbo: 300, serat: 29, air: 2100 },
  { id: 'p-16-18', label: 'Perempuan 16–18 tahun', jk: 'perempuan', umurMin: 16, umurMax: 18, energi: 2100, protein: 65, lemak: 70, karbo: 300, serat: 29, air: 2150 },
  { id: 'p-19-29', label: 'Perempuan 19–29 tahun', jk: 'perempuan', umurMin: 19, umurMax: 29, energi: 2250, protein: 60, lemak: 65, karbo: 360, serat: 32, air: 2350 },
  { id: 'p-30-49', label: 'Perempuan 30–49 tahun', jk: 'perempuan', umurMin: 30, umurMax: 49, energi: 2150, protein: 60, lemak: 60, karbo: 340, serat: 30, air: 2350 },
  { id: 'p-50-64', label: 'Perempuan 50–64 tahun', jk: 'perempuan', umurMin: 50, umurMax: 64, energi: 1800, protein: 60, lemak: 50, karbo: 280, serat: 25, air: 2350 },
  { id: 'p-65-80', label: 'Perempuan 65–80 tahun', jk: 'perempuan', umurMin: 65, umurMax: 80, energi: 1550, protein: 58, lemak: 45, karbo: 230, serat: 22, air: 1550 },
  { id: 'p-80', label: 'Perempuan 80 tahun ke atas', jk: 'perempuan', umurMin: 81, umurMax: 150, energi: 1400, protein: 58, lemak: 40, karbo: 200, serat: 20, air: 1400 },
]

// Tambahan AKG untuk ibu hamil dan menyusui (ditambahkan ke AKG kelompok umurnya).
export const TAMBAHAN = {
  'hamil-1': { label: 'Hamil trimester 1', energi: 180, protein: 1, lemak: 2.3, karbo: 25, serat: 3, air: 300 },
  'hamil-2': { label: 'Hamil trimester 2', energi: 300, protein: 10, lemak: 2.3, karbo: 40, serat: 4, air: 300 },
  'hamil-3': { label: 'Hamil trimester 3', energi: 300, protein: 30, lemak: 2.3, karbo: 40, serat: 4, air: 300 },
  'menyusui-1': { label: 'Menyusui 6 bulan pertama', energi: 330, protein: 20, lemak: 2.2, karbo: 45, serat: 5, air: 800 },
  'menyusui-2': { label: 'Menyusui 6 bulan kedua', energi: 400, protein: 15, lemak: 2.2, karbo: 55, serat: 6, air: 650 },
}

export const ZAT_GIZI = [
  { id: 'energi', label: 'Energi', satuan: 'kkal' },
  { id: 'protein', label: 'Protein', satuan: 'g' },
  { id: 'lemak', label: 'Lemak', satuan: 'g' },
  { id: 'karbo', label: 'Karbohidrat', satuan: 'g' },
  { id: 'serat', label: 'Serat', satuan: 'g' },
  { id: 'air', label: 'Air', satuan: 'ml' },
]
