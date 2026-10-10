// Jawaban Tanya Piko, versi contoh: belum memakai AI. Pertanyaan dicocokkan dengan kata kunci lalu diarahkan ke
// halaman Kawan Sehat yang sudah mengutip sumber resmi; Piko tidak pernah menyebut angka kesehatan sendiri.
// Nanti isi tanyaPiko() diganti panggilan ke /api/tanya-piko dengan masukan dan keluaran yang sama, sehingga
// antarmuka obrolan tidak perlu diubah.
// Teks boleh berupa teks biasa atau varian per profil: { anak, remaja, dewasa, lansia, semua }.

const pilihVarian = (varian, profil) =>
  typeof varian === 'string' ? varian : (varian[profil] ?? varian.semua ?? varian.dewasa)

// Huruf kecil, tanda baca menjadi spasi, diapit spasi: kata kunci bisa dicari dengan includes biasa.
const rapikan = (teks) => ` ${teks.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `
const memuat = (teks, kunci) => kunci.some((k) => teks.includes(k))

// Tombol pertanyaan siap pakai. Anak hanya bertanya lewat tombol ini (tanpa mengetik bebas).
export const SARAN = {
  anak: ['Nyamuk DBD itu apa?', 'Makanan apa yang bikin kuat?', 'Kenapa harus cuci tangan?', 'Ayo main kuis!'],
  remaja: ['Gejala DBD apa saja?', 'Gimana cara cek status gizi?', 'Jajan sehat itu yang kayak apa?', 'Cara ambil antrean puskesmas'],
  dewasa: ['Bagaimana mencegah DBD?', 'Berapa kebutuhan kalori saya?', 'Cara ambil antrean puskesmas', 'Pasang pengingat obat'],
  lansia: ['Cara ambil nomor antrean', 'Cara pasang pengingat minum obat', 'Cara memperbesar tulisan', 'Cek berat badan ideal'],
}

// ---------- Gawat darurat: selalu dicek paling awal ----------

const KUNCI_DARURAT = [
  'sesak napas', 'sesak nafas', 'susah napas', 'susah nafas', 'sulit bernapas', 'sulit bernafas', 'tidak bisa bernapas',
  'tidak bisa napas', 'pingsan', 'tidak sadar', 'tak sadarkan diri', 'kejang', 'nyeri dada', 'sakit dada', 'dada sakit',
  'dada nyeri', 'pendarahan', 'perdarahan', 'berdarah banyak', 'darah banyak', 'muntah darah', 'keracunan', 'overdosis',
  'tersedak', 'kecelakaan', 'bicara pelo', 'wajah mencong', 'mulut mencong', 'lumpuh mendadak', 'digigit ular',
]
const KUNCI_MENYAKITI_DIRI = ['bunuh diri', 'ingin mati', 'mau mati', 'pengen mati', 'menyakiti diri', 'melukai diri']

export function cekDarurat(teks) {
  const t = rapikan(teks)
  return memuat(t, KUNCI_DARURAT) || memuat(t, KUNCI_MENYAKITI_DIRI)
}

const TAUTAN_DARURAT = [{ ke: '/darurat', label: 'Lihat langkah darurat' }]

const JAWAB_DARURAT = {
  anak: 'Ini keadaan darurat! Segera panggil orang dewasa di dekatmu, lalu minta mereka menelepon 119.',
  remaja: 'Ini bisa jadi keadaan gawat darurat. Segera telepon 119 atau minta orang di sekitarmu membantu. Jangan menunggu jawaban Piko.',
  lansia: 'Ini bisa jadi keadaan darurat, Bapak/Ibu. Segera tekan tombol merah untuk menelepon 119, atau minta keluarga membantu.',
  semua: 'Ini bisa jadi keadaan gawat darurat. Segera telepon 119 atau minta orang di sekitar Anda membantu. Jangan menunggu jawaban Piko.',
}

const JAWAB_MENYAKITI_DIRI = {
  anak: 'Terima kasih sudah bercerita. Segera bilang ke ayah, ibu, guru, atau orang dewasa yang kamu percaya, ya. Kamu tidak sendirian.',
  remaja: 'Terima kasih sudah mau bercerita. Kamu tidak sendirian. Kalau kamu merasa dalam bahaya sekarang, telepon 119 atau minta orang terdekat menemanimu.',
  lansia: 'Terima kasih sudah bercerita, Bapak/Ibu. Bapak/Ibu tidak sendirian. Bila merasa dalam bahaya sekarang, tekan tombol merah 119 atau minta keluarga menemani.',
  semua: 'Terima kasih sudah mau bercerita. Anda tidak sendirian. Bila Anda merasa dalam bahaya sekarang, telepon 119 atau minta orang terdekat menemani.',
}

// ---------- Hal yang tidak boleh dijawab Piko: diagnosis, resep, dosis ----------

const KUNCI_DIAGNOSIS = [
  'sakit apa', 'penyakit apa', 'kena apa', 'diagnosis', 'diagnosa', 'resep', 'obat apa', 'obatnya apa', 'dosis',
  'berapa mg', 'berapa tablet', 'berapa kali minum', 'boleh minum',
]

const JAWAB_DIAGNOSIS = {
  anak: 'Piko bukan dokter, jadi tidak bisa memeriksa atau memberi obat. Bilang ke ayah atau ibu kalau kamu merasa sakit, ya.',
  remaja: 'Piko bukan dokter, jadi tidak bisa mendiagnosis atau memberi resep dan dosis obat. Ceritakan keluhanmu ke dokter atau apoteker, ya.',
  lansia: 'Mohon maaf, Piko bukan dokter. Piko tidak bisa memeriksa atau memberi resep dan dosis obat. Bapak/Ibu bisa mendaftar periksa ke puskesmas di sini.',
  semua: 'Piko bukan dokter, jadi tidak bisa mendiagnosis atau memberi resep dan dosis obat. Sampaikan keluhan Anda ke dokter atau apoteker.',
}

// ---------- Topik yang dipahami Piko, dicocokkan berurutan (yang lebih khusus lebih dulu) ----------

const TOPIK = [
  {
    kunci: ['dbd', 'demam berdarah', 'dengue', 'nyamuk', 'jentik', '3m'],
    teks: {
      anak: 'Demam berdarah ditularkan nyamuk. Kita bisa mengusirnya dengan 3M: menguras, menutup, dan mendaur ulang tempat air. Yuk, baca ceritanya!',
      remaja: 'Nyamuk DBD menggigit pagi sampai sore dan bertelur di air bersih. Gejala, tanda bahaya, dan cara mencegahnya dengan 3M Plus ada di halaman DBD.',
      lansia: 'DBD ditularkan nyamuk. Cegah dengan menguras dan menutup tempat air setiap minggu. Tanda bahaya yang perlu diwaspadai ada di halaman DBD.',
      semua: 'DBD disebabkan virus dengue yang ditularkan nyamuk Aedes aegypti. Gejala awal, tanda bahaya, pertolongan pertama, dan pencegahan 3M Plus ada di halaman DBD.',
    },
    tautan: [{ ke: '/info/dbd', label: { anak: 'Baca cerita nyamuk', semua: 'Baca info DBD' } }],
  },
  {
    kunci: ['kalori', 'kebutuhan gizi', 'kebutuhan energi', 'akg', 'diet'],
    teks: {
      anak: 'Kamu tidak perlu menghitung kalori. Yang penting makan beragam: ada nasi, lauk, sayur, dan buah. Yuk, susun piringmu!',
      remaja: 'Di Kawan Sehat, remaja tidak diberi target kalori. Yang penting makan beragam sesuai Isi Piringku dan tetap aktif bergerak.',
      semua: 'Kebutuhan energi dan zat gizi harian bisa Anda lihat di halaman Kebutuhan gizi harian. Angkanya mengikuti AKG 2019 Kemenkes, sesuai umur dan jenis kelamin.',
    },
    tautan: {
      anak: [{ ke: '/cek-gizi/makanan', label: 'Susun Isi Piringku' }],
      remaja: [{ ke: '/cek-gizi/makanan', label: 'Cek jajanan & makanan' }],
      semua: [{ ke: '/cek-gizi/kebutuhan', label: 'Lihat kebutuhan gizi' }],
    },
  },
  {
    kunci: ['imt', 'bmi', 'berat badan', 'tinggi badan', 'gemuk', 'kurus', 'status gizi', 'obesitas', 'cek gizi'],
    teks: {
      anak: 'Tumbuh kembang anak dicek bersama orang tua. Minta ayah atau ibu membuka halaman Cek tumbuh anak, ya.',
      remaja: 'Status gizi remaja dinilai dengan IMT menurut umur, bukan IMT orang dewasa. Masukkan umur, berat, dan tinggi badanmu di Cek IMT, nanti hasilnya dijelaskan.',
      lansia: 'Bapak/Ibu bisa memeriksa berat badan ideal di halaman Cek berat badan. Cukup isi umur, berat, dan tinggi badan.',
      semua: 'Anda bisa menghitung IMT di halaman Cek IMT. Kategorinya mengikuti standar Kemenkes untuk orang dewasa Indonesia.',
    },
    tautan: [{ ke: '/cek-gizi/imt', label: { anak: 'Cek tumbuh anak', lansia: 'Cek berat badan', semua: 'Buka Cek IMT' } }],
  },
  {
    kunci: ['makan', 'piring', 'sayur', 'buah', 'gula', 'garam', 'lemak', 'minyak', 'jajan', 'camilan', 'sarapan', 'gizi seimbang', 'kuat'],
    teks: {
      anak: 'Makanan sehat itu beragam: ada nasi atau sumber tenaga, lauk, sayur, dan buah. Coba susun piringmu di Piringku!',
      remaja: 'Jajan sehat itu yang tidak berlebihan gula, garam, dan lemak. Di Cek jajanan, kamu bisa melihat kandungan jajanan favoritmu.',
      semua: 'Panduan Isi Piringku membagi piring menjadi makanan pokok, lauk pauk, sayur, dan buah. Di Cek makanan, Anda bisa menyusun piring dan melihat kandungan gula, garam, dan lemaknya.',
    },
    tautan: [{ ke: '/cek-gizi/makanan', label: { anak: 'Susun Isi Piringku', remaja: 'Cek jajanan & makanan', semua: 'Buka Cek makanan' } }],
  },
  {
    kunci: ['cuci tangan', 'kuman', 'sabun'],
    teks: {
      anak: 'Tangan kita membawa kuman yang tidak terlihat. Cuci tangan pakai sabun dan air mengalir, terutama sebelum makan dan sesudah dari toilet, supaya kita tidak gampang sakit.',
      semua: 'Mencuci tangan dengan sabun dan air mengalir, terutama sebelum makan dan sesudah dari toilet, membantu mencegah penyakit menular.',
    },
    tautan: [],
  },
  {
    kunci: ['antre', 'antri', 'puskesmas', 'daftar', 'berobat', 'dokter', 'poli', 'periksa', 'klinik', 'konsultasi'],
    teks: {
      anak: 'Kalau merasa sakit, bilang ke ayah, ibu, atau guru, ya. Mereka yang akan mengantarmu ke dokter.',
      remaja: 'Kamu bisa ambil nomor antrean puskesmas atau pilih konsultasi online dari sini. Ikuti langkahnya satu per satu, lalu simpan tiketnya.',
      lansia: 'Bapak/Ibu bisa mengambil nomor antrean puskesmas dari sini. Puskesmas terdekat dan antrean prioritas lansia sudah dipilihkan, dan tetap bisa diubah.',
      semua: 'Anda bisa mengambil nomor antrean puskesmas atau memilih konsultasi online. Ikuti langkahnya satu per satu, lalu simpan tiketnya.',
    },
    tautan: {
      anak: [],
      semua: [{ ke: '/layanan/antrean', label: { lansia: 'Ambil nomor antrean', semua: 'Ambil antrean' } }],
    },
  },
  {
    kunci: ['obat', 'pengingat'],
    teks: {
      anak: 'Obat hanya boleh diminum bersama orang dewasa, ya. Minta ayah atau ibu yang menyiapkannya.',
      lansia: 'Bapak/Ibu bisa memasang pengingat minum obat. Setiap selesai minum, tinggal tekan tombol "Sudah diminum".',
      semua: 'Di Pengingat obat, Anda bisa mencatat jadwal minum obat dan menandai obat yang sudah diminum. Datanya hanya tersimpan di perangkat ini.',
    },
    tautan: {
      anak: [],
      semua: [{ ke: '/pengingat-obat', label: 'Buka Pengingat obat' }],
    },
  },
  {
    kunci: ['tulisan', 'huruf', 'ukuran teks', 'suara', 'dibacakan', 'kontras', 'isyarat', 'bisindo', 'tampilan', 'animasi'],
    teks: {
      anak: 'Tombol Tampilan ada di bagian atas. Di sana huruf bisa dibesarkan atau suara dinyalakan. Minta bantuan orang tua, ya.',
      lansia: 'Tekan tombol Tampilan di bagian atas layar. Di sana Bapak/Ibu bisa memperbesar tulisan dan menyalakan suara yang membacakan isi halaman.',
      semua: 'Tekan tombol Tampilan di bagian atas untuk memperbesar tulisan, menyalakan suara, menaikkan kontras, menampilkan bahasa isyarat, atau mengurangi animasi.',
    },
    tautan: [],
  },
  {
    kunci: ['kuis', 'main', 'game', 'permainan', 'lencana'],
    teks: {
      anak: 'Ayo main Kuis Nyamuk! Jawab pertanyaannya dan kumpulkan lencananya.',
      semua: 'Ada Kuis Nyamuk tentang DBD untuk anak-anak. Cocok dimainkan bersama keluarga.',
    },
    tautan: [{ ke: '/kuis', label: 'Main Kuis Nyamuk' }],
  },
  {
    kunci: ['119', 'darurat', 'ambulans', 'gawat'],
    teks: {
      anak: 'Tombol merah 119 hanya untuk keadaan darurat. Kalau ada yang sakit parah, panggil orang dewasa dulu, ya.',
      semua: 'Untuk keadaan gawat darurat medis, tekan tombol merah 119 di bagian atas layar. Langkah yang perlu dilakukan sambil menunggu bantuan ada di halaman Darurat.',
    },
    tautan: TAUTAN_DARURAT,
  },
  {
    kunci: ['terima kasih', 'makasih', 'thanks', 'thank you'],
    teks: {
      anak: 'Sama-sama! Tetap sehat dan ceria, ya!',
      remaja: 'Sama-sama! Kalau ada yang mau ditanyakan lagi, Piko di sini.',
      semua: 'Sama-sama. Semoga sehat selalu!',
    },
    tautan: [],
  },
  {
    kunci: [' halo ', ' hai ', ' hi ', ' hello ', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'assalamualaikum'],
    teks: {
      anak: 'Halo juga! Mau tanya apa hari ini?',
      remaja: 'Hai juga! Mau tanya soal apa?',
      semua: 'Halo! Ada yang bisa Piko bantu?',
    },
    tautan: [],
  },
]

const JAWAB_LAIN = {
  anak: 'Hmm, Piko belum tahu jawabannya. Coba pilih pertanyaan di bawah, ya!',
  remaja: 'Maaf, Piko belum bisa menjawab itu. Untuk sekarang Piko paham soal DBD, gizi dan jajanan, antrean puskesmas, dan pengaturan tampilan.',
  lansia: 'Mohon maaf, Piko belum bisa menjawab pertanyaan itu. Piko bisa membantu soal antrean puskesmas, pengingat obat, berat badan, DBD, dan cara memperbesar tulisan.',
  semua: 'Maaf, Piko belum bisa menjawab pertanyaan itu. Untuk sekarang Piko paham soal DBD, gizi dan makanan, antrean puskesmas, pengingat obat, dan pengaturan tampilan.',
}

// Tautan bisa berupa daftar tetap atau varian per profil; labelnya juga boleh bervarian.
function susunTautan(tautan, profil) {
  const daftar = Array.isArray(tautan) ? tautan : pilihVarian(tautan, profil)
  return daftar.map((t) => ({ ke: t.ke, label: pilihVarian(t.label, profil) }))
}

// Jawaban untuk satu pertanyaan, tanpa jeda. Dipisah supaya mudah diuji.
export function jawab(teks, profil) {
  const t = rapikan(teks)
  if (memuat(t, KUNCI_MENYAKITI_DIRI)) {
    return { teks: pilihVarian(JAWAB_MENYAKITI_DIRI, profil), tautan: TAUTAN_DARURAT, darurat: true }
  }
  if (memuat(t, KUNCI_DARURAT)) {
    return { teks: pilihVarian(JAWAB_DARURAT, profil), tautan: TAUTAN_DARURAT, darurat: true }
  }
  if (memuat(t, KUNCI_DIAGNOSIS)) {
    const tautan = profil === 'anak' ? [] : [{ ke: '/layanan/antrean', label: 'Daftar periksa' }]
    return { teks: pilihVarian(JAWAB_DIAGNOSIS, profil), tautan }
  }
  const topik = TOPIK.find((x) => memuat(t, x.kunci))
  if (topik) return { teks: pilihVarian(topik.teks, profil), tautan: susunTautan(topik.tautan, profil) }
  return { teks: pilihVarian(JAWAB_LAIN, profil), tautan: [] }
}

// Titik sambung ke AI nanti. Jeda kecil meniru waktu berpikir supaya alur antarmukanya (indikator mengetik,
// pengumuman pembaca layar) sudah teruji sebelum AI tersambung.
export async function tanyaPiko({ teks, profil, jeda = 700 }) {
  if (jeda > 0) await new Promise((selesai) => setTimeout(selesai, jeda))
  return jawab(teks, profil)
}
