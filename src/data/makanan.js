// Daftar makanan lokal untuk fitur Cek Makanan.
// Sumber nilai gizi & ukuran rumah tangga (URT): Daftar Bahan Makanan Penukar dalam
// Pedoman Gizi Seimbang (Permenkes 41/2014). Satu "porsi" = satu satuan penukar.
// Natrium bumbu: Daftar Makanan Tinggi Natrium pada pedoman yang sama.

// Nilai gizi per satu satuan penukar (energi kkal, protein/lemak/karbo gram).
const PENUKAR = {
  pokok: { energi: 175, protein: 4, lemak: 0, karbo: 40 }, // 1 porsi nasi (100 g, ¾ gelas)
  nabati: { energi: 80, protein: 6, lemak: 3, karbo: 8 }, // 1 porsi tempe (50 g)
  hewaniRendah: { energi: 50, protein: 7, lemak: 2, karbo: 0 }, // golongan A
  hewaniSedang: { energi: 75, protein: 7, lemak: 5, karbo: 0 }, // golongan B
  hewaniTinggi: { energi: 150, protein: 7, lemak: 13, karbo: 0 }, // golongan C
  sayurB: { energi: 25, protein: 1, lemak: 0, karbo: 5 }, // per 100 g (1 gelas matang)
  sayurC: { energi: 50, protein: 3, lemak: 0, karbo: 10 },
  buah: { energi: 50, protein: 0, lemak: 0, karbo: 10 },
  gula: { energi: 37, protein: 0, lemak: 0, karbo: 9 }, // 1 sdm gula pasir (10 g)
  minyak: { energi: 50, protein: 0, lemak: 5, karbo: 0 }, // 1 sdt minyak (5 g)
}

const kosong = { gula: 0, natrium: 0 }

function item(id, nama, kelompok, urt, berat, penukar, ekstra = {}) {
  return { id, nama, kelompok, urt, berat, gizi: { ...PENUKAR[penukar], ...kosong, ...ekstra } }
}

// Gabungan dua satuan penukar, misalnya lauk + 1 porsi minyak untuk makanan yang digoreng.
function gorengan(id, nama, kelompok, urt, berat, penukar) {
  const a = PENUKAR[penukar]
  const m = PENUKAR.minyak
  return {
    id,
    nama,
    kelompok,
    urt,
    berat,
    perkiraan: true,
    gizi: {
      energi: a.energi + m.energi,
      protein: a.protein + m.protein,
      lemak: a.lemak + m.lemak,
      karbo: a.karbo + m.karbo,
      ...kosong,
    },
  }
}

export const KELOMPOK = {
  pokok: 'Makanan pokok',
  lauk: 'Lauk pauk',
  sayur: 'Sayur',
  buah: 'Buah',
  lain: 'Gula, minyak & bumbu',
}

export const MAKANAN = [
  // Makanan pokok
  item('nasi-putih', 'Nasi putih', 'pokok', '¾ gelas', 100, 'pokok'),
  item('nasi-merah', 'Nasi merah', 'pokok', '¾ gelas', 100, 'pokok'),
  item('mi-basah', 'Mi basah', 'pokok', '2 gelas', 200, 'pokok'),
  item('roti-putih', 'Roti putih', 'pokok', '3 iris', 70, 'pokok'),
  item('kentang', 'Kentang', 'pokok', '2 buah sedang', 210, 'pokok'),
  item('singkong', 'Singkong', 'pokok', '1½ potong', 120, 'pokok'),
  item('ubi-jalar', 'Ubi jalar kuning', 'pokok', '1 biji sedang', 135, 'pokok'),
  item('jagung', 'Jagung segar', 'pokok', '3 buah sedang', 125, 'pokok'),
  item('biskuit', 'Biskuit', 'pokok', '4 buah besar', 40, 'pokok'),
  item('kerupuk', 'Kerupuk udang/ikan', 'pokok', '3 biji sedang', 30, 'pokok'),

  // Lauk nabati
  item('tempe', 'Tempe', 'lauk', '2 potong sedang', 50, 'nabati'),
  item('tahu', 'Tahu', 'lauk', '2 potong sedang', 100, 'nabati'),
  item('oncom', 'Oncom', 'lauk', '2 potong besar', 50, 'nabati'),
  item('kacang-hijau', 'Kacang hijau', 'lauk', '2½ sendok makan', 25, 'nabati'),
  item('kacang-tanah', 'Kacang tanah kupas', 'lauk', '2 sendok makan', 20, 'nabati'),
  gorengan('tempe-goreng', 'Tempe goreng', 'lauk', '2 potong sedang + 1 sdt minyak', 55, 'nabati'),
  gorengan('tahu-goreng', 'Tahu goreng', 'lauk', '2 potong sedang + 1 sdt minyak', 105, 'nabati'),

  // Lauk hewani
  item('ikan-segar', 'Ikan segar', 'lauk', '1 potong sedang', 40, 'hewaniRendah'),
  item('ikan-lele', 'Ikan lele', 'lauk', '⅓ ekor sedang', 40, 'hewaniRendah'),
  item('ikan-kembung', 'Ikan kembung', 'lauk', '⅓ ekor sedang', 30, 'hewaniRendah'),
  item('ikan-teri', 'Ikan teri kering', 'lauk', '1 sendok makan', 20, 'hewaniRendah'),
  item('udang', 'Udang segar', 'lauk', '5 ekor sedang', 35, 'hewaniRendah'),
  item('cumi', 'Cumi-cumi', 'lauk', '1 ekor kecil', 45, 'hewaniRendah'),
  item('ayam-tanpa-kulit', 'Daging ayam (tanpa kulit)', 'lauk', '1 potong sedang', 40, 'hewaniRendah'),
  item('telur-ayam', 'Telur ayam', 'lauk', '1 butir', 55, 'hewaniSedang'),
  item('telur-puyuh', 'Telur puyuh', 'lauk', '5 butir', 55, 'hewaniSedang'),
  item('daging-sapi', 'Daging sapi', 'lauk', '1 potong sedang', 35, 'hewaniSedang'),
  item('bakso', 'Bakso', 'lauk', '10 biji sedang', 170, 'hewaniSedang'),
  item('hati-ayam', 'Hati ayam', 'lauk', '1 buah sedang', 30, 'hewaniSedang'),
  item('ayam-kulit', 'Daging ayam dengan kulit', 'lauk', '1 potong sedang', 40, 'hewaniTinggi'),
  item('sosis', 'Sosis', 'lauk', '½ potong', 50, 'hewaniTinggi'),
  item('kornet', 'Kornet daging sapi', 'lauk', '3 sendok makan', 45, 'hewaniTinggi'),
  gorengan('telur-ceplok', 'Telur ceplok/dadar', 'lauk', '1 butir + 1 sdt minyak', 60, 'hewaniSedang'),
  gorengan('ayam-goreng', 'Ayam goreng dengan kulit', 'lauk', '1 potong sedang + 1 sdt minyak', 45, 'hewaniTinggi'),
  gorengan('ikan-goreng', 'Ikan goreng', 'lauk', '1 potong sedang + 1 sdt minyak', 45, 'hewaniRendah'),

  // Sayur (1 porsi ≈ 1 gelas setelah dimasak dan ditiriskan, 100 g)
  item('bayam', 'Bayam', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('kangkung', 'Kangkung', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('sawi', 'Sawi', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('wortel', 'Wortel', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('buncis', 'Buncis', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('kacang-panjang', 'Kacang panjang', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('brokoli', 'Brokoli', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('kol', 'Kol', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('taoge', 'Taoge', 'sayur', '1 gelas matang', 100, 'sayurB'),
  item('daun-singkong', 'Daun singkong', 'sayur', '1 gelas matang', 100, 'sayurC'),
  item('daun-katuk', 'Daun katuk', 'sayur', '1 gelas matang', 100, 'sayurC'),
  item('nangka-muda', 'Nangka muda', 'sayur', '1 gelas matang', 100, 'sayurC'),

  // Buah (berat bersih tanpa kulit dan biji)
  item('pisang-ambon', 'Pisang ambon', 'buah', '1 buah sedang', 50, 'buah'),
  item('pisang-kepok', 'Pisang kepok', 'buah', '1 buah', 45, 'buah'),
  item('jeruk-manis', 'Jeruk manis', 'buah', '2 buah sedang', 100, 'buah'),
  item('pepaya', 'Pepaya', 'buah', '1 potong besar', null, 'buah'),
  item('apel', 'Apel merah', 'buah', '1 buah kecil', 85, 'buah'),
  item('mangga', 'Mangga', 'buah', '¾ buah besar', 90, 'buah'),
  item('semangka', 'Semangka', 'buah', '2 potong sedang', 180, 'buah'),
  item('salak', 'Salak', 'buah', '2 buah sedang', 65, 'buah'),
  item('rambutan', 'Rambutan', 'buah', '8 buah', 75, 'buah'),
  item('jambu-biji', 'Jambu biji', 'buah', '1 buah besar', 100, 'buah'),
  item('melon', 'Melon', 'buah', '1 potong', 90, 'buah'),

  // Gula, minyak, bumbu
  item('gula-pasir', 'Gula pasir', 'lain', '1 sendok makan', 10, 'gula', { gula: 10 }),
  item('gula-aren', 'Gula aren', 'lain', '1 sendok makan', 10, 'gula', { gula: 10 }),
  item('minyak-goreng', 'Minyak goreng', 'lain', '1 sendok teh', 5, 'minyak'),
  item('santan', 'Santan (peras)', 'lain', '⅓ gelas', 40, 'minyak'),
  { id: 'garam', nama: 'Garam dapur', kelompok: 'lain', urt: '1 sendok teh', berat: null, hanyaNatrium: true, gizi: { energi: 0, protein: 0, lemak: 0, karbo: 0, gula: 0, natrium: 2000 } },
  { id: 'kecap', nama: 'Kecap', kelompok: 'lain', urt: '1 sendok teh', berat: null, hanyaNatrium: true, gizi: { energi: 0, protein: 0, lemak: 0, karbo: 0, gula: 0, natrium: 343 } },
  { id: 'msg', nama: 'Penyedap (MSG)', kelompok: 'lain', urt: '1 sendok teh', berat: null, hanyaNatrium: true, gizi: { energi: 0, protein: 0, lemak: 0, karbo: 0, gula: 0, natrium: 492 } },
]

export function cariMakanan(id) {
  return MAKANAN.find((m) => m.id === id)
}
