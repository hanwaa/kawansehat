// Jawaban Tanya Piko, versi contoh: belum memakai AI. Pertanyaan dicocokkan dengan kata kunci lalu diarahkan ke
// halaman Kawan Sehat yang sudah mengutip sumber resmi; Piko tidak pernah menyebut angka kesehatan sendiri.
// Nanti isi tanyaPiko() diganti panggilan ke /api/tanya-piko dengan masukan dan keluaran yang sama, sehingga
// antarmuka obrolan tidak perlu diubah.
// Teks, poin, dan daftar boleh berupa nilai biasa atau varian per profil: { anak, remaja, dewasa, lansia, semua }.
//
// Bentuk jawaban: { id, topik, teks, poin, tautan, lanjutan, darurat? }
// - poin: daftar singkat yang ditampilkan di bawah teks;
// - lanjutan: pertanyaan berikutnya yang bisa langsung diketuk, supaya obrolan bisa digali
//   (Apa itu DBD → Cara mencegah → Dampak) tanpa mengetik.

const pilihVarian = (varian, profil) =>
  typeof varian === 'string' || Array.isArray(varian) ? varian : (varian[profil] ?? varian.semua ?? varian.dewasa)

// Huruf kecil, tanda baca menjadi spasi, diapit spasi: kata kunci bisa dicari dengan includes biasa.
const rapikan = (teks) => ` ${teks.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `
const memuat = (teks, kunci) => kunci.some((k) => teks.includes(k))

// Tombol pertanyaan siap pakai. Anak hanya bertanya lewat tombol ini dan lewat pertanyaan lanjutan.
export const SARAN = {
  anak: ['Nyamuk DBD itu apa?', 'Makanan apa yang bikin kuat?', 'Kenapa harus cuci tangan?', 'Ayo main kuis!'],
  remaja: ['Gejala DBD apa saja?', 'Gimana cara cek status gizi?', 'Jajan sehat itu yang kayak apa?', 'Cara ambil antrean puskesmas'],
  dewasa: ['Apa itu DBD?', 'Berapa kebutuhan kalori saya?', 'Cara ambil antrean puskesmas', 'Pasang pengingat obat'],
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

const LANJUTAN_DIAGNOSIS = {
  anak: [],
  lansia: ['Cara ambil nomor antrean'],
  semua: ['Cara ambil antrean puskesmas'],
}

// ---------- DBD: pertanyaan lanjutan ----------
// Diringkas dari src/content/topik/dbd.jsx (Leaflet DBD 3M Plus Kemenkes), tanpa angka: rinciannya tetap di
// halaman DBD yang mengutip sumbernya. Sub dicocokkan berurutan, jadi yang lebih khusus ditaruh lebih dulu
// ("tanda bahaya" sebelum "berbahaya", "yang dilakukan bila muncul gejala" sebelum "gejala").

const TAUTAN_DBD = [{ ke: '/info/dbd', label: { anak: 'Baca cerita nyamuk', semua: 'Baca info DBD' } }]
const TAUTAN_ANTREAN = { anak: [], semua: [{ ke: '/layanan/antrean', label: { lansia: 'Ambil nomor antrean', semua: 'Ambil antrean' } }] }

const SUB_DBD = [
  {
    id: 'bahaya',
    kunci: ['tanda bahaya', ' bahaya ', 'rumah sakit', ' igd '],
    teks: {
      anak: 'Kalau badanmu panas tinggi atau terasa sangat lemas, segera bilang ke orang tua atau guru, ya!',
      remaja: 'Ini tanda bahaya DBD. Kalau muncul, langsung ke puskesmas atau IGD dan kasih tahu orang tua atau wali:',
      lansia: 'Segera ke rumah sakit bila muncul salah satu tanda bahaya demam berdarah ini, Bapak/Ibu:',
      semua: 'Ini tanda bahaya DBD. Bila muncul, segera bawa ke fasilitas kesehatan:',
    },
    poin: {
      anak: [],
      remaja: ['Mimisan atau perdarahan di bawah kulit', 'Muntah atau buang air besar berdarah', 'Gelisah, tangan dan kaki dingin, berkeringat'],
      lansia: ['Mimisan', 'Muntah darah', 'Tangan dan kaki dingin'],
      semua: [
        'Perdarahan di hidung (mimisan) atau di bawah kulit',
        'Muntah darah atau buang air besar berdarah',
        'Gelisah, tangan dan kaki dingin, serta berkeringat',
      ],
    },
    tautan: { anak: TAUTAN_DBD, semua: [...TAUTAN_DARURAT, ...TAUTAN_DBD] },
    lanjutan: {
      anak: ['Gimana cara mengusir nyamuk?', 'Ayo main kuis!'],
      remaja: ['Kalau kena DBD harus apa?', 'Gimana cara cegah DBD?'],
      lansia: ['Apa yang dilakukan saat demam berdarah?', 'Cara ambil nomor antrean'],
      semua: ['Apa yang dilakukan bila muncul gejala DBD?', 'Bagaimana mencegah DBD?'],
    },
  },
  {
    id: 'dampak',
    kunci: ['dampak', 'akibat', 'berbahaya', 'bahayanya', 'komplikasi', 'kematian', 'meninggal', 'mematikan', 'parah'],
    teks: {
      anak: 'Demam berdarah bisa bikin badan panas tinggi dan lemas. Kalau tidak cepat ditolong, bisa berbahaya. Makanya, segera bilang ke orang tua kalau badanmu panas, ya!',
      remaja: 'DBD bukan penyakit sepele. Kalau terlambat ditangani, DBD bisa menyebabkan kematian. Makanya penting kenal tanda bahayanya dan cepat ke puskesmas atau IGD.',
      lansia: 'Bila terlambat ditangani, demam berdarah dapat menyebabkan kematian. Karena itu, segera ke puskesmas bila panas tinggi tidak turun.',
      semua: 'Bila tidak segera ditolong, DBD dapat menyebabkan kematian. Karena itu, kenali tanda bahayanya dan segera ke fasilitas kesehatan bila tanda itu muncul.',
    },
    lanjutan: {
      anak: ['Kalau badanku panas gimana?', 'Gimana cara mengusir nyamuk?'],
      remaja: ['Tanda bahaya DBD apa?', 'Gimana cara cegah DBD?'],
      lansia: ['Kapan harus ke rumah sakit?', 'Cara mencegah demam berdarah'],
      semua: ['Apa tanda bahaya DBD?', 'Bagaimana mencegah DBD?'],
    },
  },
  {
    id: 'pertolongan',
    kunci: [
      'pertolongan', 'harus apa', 'yang dilakukan', 'saat demam', 'sudah demam', 'udah demam', 'sedang demam',
      'badan panas', 'badanku panas', 'badannya panas', 'merawat', 'perawatan',
    ],
    teks: {
      anak: 'Kalau badanmu panas, segera bilang ke ayah, ibu, atau guru, ya. Mereka yang akan merawat dan membawamu ke dokter. Jangan lupa minum air yang banyak.',
      remaja: 'Kalau muncul gejala awal DBD:',
      lansia: 'Bila Bapak/Ibu demam:',
      semua: 'Bila muncul gejala awal DBD:',
    },
    poin: {
      anak: [],
      remaja: [
        'Minum sebanyak mungkin',
        'Kompres supaya panas turun',
        'Minum obat penurun panas hanya sesuai anjuran tenaga kesehatan',
        'Periksa ke puskesmas, apalagi kalau panas tinggi tidak turun',
      ],
      lansia: ['Minum air yang banyak', 'Kompres agar panas turun', 'Bila panas tinggi tidak turun, segera ke puskesmas'],
      semua: [
        'Beri minum sebanyak mungkin',
        'Kompres agar panas turun',
        'Berikan obat penurun panas sesuai anjuran tenaga kesehatan',
        'Periksakan ke puskesmas, terutama bila panas tinggi tidak turun',
      ],
    },
    tautan: TAUTAN_ANTREAN,
    lanjutan: {
      anak: ['Gimana cara mengusir nyamuk?', 'Ayo main kuis!'],
      remaja: ['Tanda bahaya DBD apa?', 'Cara ambil antrean puskesmas'],
      lansia: ['Kapan harus ke rumah sakit?', 'Cara ambil nomor antrean'],
      semua: ['Apa tanda bahaya DBD?', 'Cara ambil antrean puskesmas'],
    },
  },
  {
    id: 'gejala',
    kunci: ['gejala', 'ciri', 'tanda awal', 'tandanya'],
    teks: {
      anak: 'Kalau digigit nyamuk demam berdarah, badan bisa jadi panas tinggi dan lemas. Segera bilang ke orang tua, ya!',
      remaja: 'Gejala awal DBD:',
      lansia: 'Gejala awal demam berdarah:',
      semua: 'Gejala awal DBD:',
    },
    poin: {
      anak: [],
      remaja: ['Panas tinggi mendadak', 'Lemas dan lesu', 'Bintik-bintik merah di kulit', 'Nyeri di ulu hati'],
      lansia: ['Panas tinggi mendadak', 'Badan lemas', 'Bintik merah di kulit'],
      semua: ['Mendadak panas tinggi', 'Tampak lemah dan lesu', 'Timbul bintik-bintik merah pada kulit', 'Sering terasa nyeri di ulu hati'],
    },
    lanjutan: {
      anak: ['Gimana cara mengusir nyamuk?', 'Ayo main kuis!'],
      remaja: ['Tanda bahaya DBD apa?', 'Kalau kena DBD harus apa?'],
      lansia: ['Kapan harus ke rumah sakit?', 'Apa yang dilakukan saat demam berdarah?'],
      semua: ['Apa tanda bahaya DBD?', 'Apa yang dilakukan bila muncul gejala DBD?'],
    },
  },
  {
    id: 'cegah',
    kunci: ['cegah', 'pencegahan', '3m', 'usir', 'hindari', 'basmi', 'berantas'],
    teks: {
      anak: 'Ayo usir nyamuk dengan 3M!',
      remaja: 'Cegah DBD dengan 3M Plus setiap minggu:',
      lansia: 'Cegah demam berdarah setiap minggu:',
      semua: 'Cegah DBD dengan 3M Plus setiap minggu:',
    },
    poin: {
      anak: ['Menguras bak mandi dan ember', 'Menutup rapat tempat air', 'Mendaur ulang barang bekas'],
      remaja: [
        'Menguras tempat penampungan air',
        'Menutup rapat tempat penampungan air',
        'Mendaur ulang barang bekas yang bisa menampung air',
        'Plus: pakai obat anti nyamuk dan jangan menggantung pakaian di kamar',
      ],
      lansia: ['Kuras bak mandi', 'Tutup tempat air', 'Buang atau daur ulang barang bekas'],
      semua: [
        'Menguras tempat penampungan air',
        'Menutup rapat tempat penampungan air',
        'Mendaur ulang barang bekas yang bisa menampung air',
        'Plus: pelihara ikan pemakan jentik, pakai obat anti nyamuk, pasang kawat kasa, dan jangan menggantung pakaian di kamar',
      ],
    },
    lanjutan: {
      anak: ['Nyamuk suka bertelur di mana?', 'Ayo main kuis!'],
      remaja: ['Nyamuk DBD bertelur di mana?', 'Dampak DBD apa aja?'],
      lansia: ['Kapan harus ke rumah sakit?', 'Apa yang dilakukan saat demam berdarah?'],
      semua: ['Di mana nyamuk DBD bertelur?', 'Apa dampak DBD?'],
    },
  },
  {
    id: 'sarang',
    kunci: ['bertelur', 'telur', 'berkembang biak', 'jentik', 'sarang', 'tempat nyamuk'],
    teks: {
      anak: 'Nyamuk suka bertelur di air bersih yang diam, seperti di bak mandi, ember, dan vas bunga. Makanya tempat air harus dikuras dan ditutup!',
      remaja: 'Nyamuk DBD bertelur di air bersih yang tergenang, bukan di got. Contohnya:',
      lansia: 'Nyamuk demam berdarah bertelur di air bersih, misalnya:',
      semua: 'Nyamuk DBD berkembang biak di air bersih yang tergenang, misalnya di:',
    },
    poin: {
      anak: [],
      remaja: ['Bak mandi dan ember', 'Vas bunga', 'Botol dan barang bekas'],
      lansia: ['Bak mandi', 'Tempayan dan ember', 'Vas bunga'],
      semua: [
        'Bak mandi/WC, tempayan, dan drum',
        'Tempat minum burung, vas bunga, dan pot tanaman air',
        'Kaleng, ban, dan botol bekas',
        'Talang air yang rusak dan saluran air hujan yang tidak lancar',
      ],
    },
    lanjutan: {
      anak: ['Gimana cara mengusir nyamuk?', 'Ayo main kuis!'],
      remaja: ['Nyamuk DBD gigit jam berapa?', 'Gimana cara cegah DBD?'],
      lansia: ['Cara mencegah demam berdarah', 'Kapan harus ke rumah sakit?'],
      semua: ['Kapan nyamuk DBD menggigit?', 'Bagaimana mencegah DBD?'],
    },
  },
  {
    id: 'gigit',
    kunci: ['gigit', 'kapan nyamuk', 'jam berapa'],
    teks: {
      anak: 'Nyamuk demam berdarah suka menggigit dari pagi sampai sore. Jadi tetap waspada walau hari masih terang, ya!',
      remaja: 'Nyamuk Aedes aegypti aktif menggigit pagi sampai sore hari, bukan malam hari. Jadi tetap waspada di siang hari.',
      semua: 'Nyamuk Aedes aegypti, pembawa virus DBD, aktif menggigit pada pagi sampai sore hari.',
    },
    lanjutan: {
      anak: ['Gimana cara mengusir nyamuk?', 'Ayo main kuis!'],
      remaja: ['Nyamuk DBD bertelur di mana?', 'Gejala DBD apa aja?'],
      lansia: ['Cara mencegah demam berdarah', 'Kapan harus ke rumah sakit?'],
      semua: ['Di mana nyamuk DBD bertelur?', 'Apa saja gejala DBD?'],
    },
  },
]

// ---------- Topik yang dipahami Piko, dicocokkan berurutan (yang lebih khusus lebih dulu) ----------

const TOPIK = [
  {
    id: 'dbd',
    kunci: ['dbd', 'demam berdarah', 'dengue', 'nyamuk', 'jentik', '3m'],
    teks: {
      anak: 'Nyamuk demam berdarah badannya hitam dengan belang putih. Kalau menggigit, ia bisa bikin demam berdarah: badan panas tinggi dan lemas. Yuk, baca ceritanya!',
      remaja: 'DBD itu penyakit karena virus dengue yang dibawa nyamuk Aedes aegypti. Nyamuknya menggigit pagi sampai sore dan bertelur di air bersih, bukan di got.',
      lansia: 'Demam berdarah adalah penyakit yang menular lewat gigitan nyamuk. Bila terlambat ditangani, penyakit ini bisa berbahaya.',
      semua: 'DBD (demam berdarah dengue) adalah penyakit yang disebabkan virus dengue dan ditularkan lewat gigitan nyamuk Aedes aegypti. Bila terlambat ditangani, DBD dapat menyebabkan kematian.',
    },
    tautan: TAUTAN_DBD,
    lanjutan: {
      anak: ['Kenapa nyamuknya berbahaya?', 'Gimana cara mengusir nyamuk?', 'Nyamuk suka bertelur di mana?'],
      remaja: ['Gejala DBD apa aja?', 'Gimana cara cegah DBD?', 'Dampak DBD apa aja?'],
      lansia: ['Kapan harus ke rumah sakit?', 'Apa yang dilakukan saat demam berdarah?', 'Cara mencegah demam berdarah'],
      semua: ['Apa saja gejala DBD?', 'Bagaimana mencegah DBD?', 'Apa dampak DBD?'],
    },
    sub: SUB_DBD,
  },
  {
    id: 'kalori',
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
    lanjutan: {
      anak: ['Kenapa harus cuci tangan?', 'Ayo main kuis!'],
      remaja: ['Gimana cara cek status gizi?', 'Jajan sehat itu yang kayak apa?'],
      lansia: ['Cek berat badan ideal', 'Cara ambil nomor antrean'],
      semua: ['Cara cek IMT', 'Apa itu Isi Piringku?'],
    },
  },
  {
    id: 'imt',
    kunci: ['imt', 'bmi', 'berat badan', 'tinggi badan', 'gemuk', 'kurus', 'status gizi', 'obesitas', 'cek gizi'],
    teks: {
      anak: 'Tumbuh kembang anak dicek bersama orang tua. Minta ayah atau ibu membuka halaman Cek tumbuh anak, ya.',
      remaja: 'Status gizi remaja dinilai dengan IMT menurut umur, bukan IMT orang dewasa. Masukkan umur, berat, dan tinggi badanmu di Cek IMT, nanti hasilnya dijelaskan.',
      lansia: 'Bapak/Ibu bisa memeriksa berat badan ideal di halaman Cek berat badan. Cukup isi umur, berat, dan tinggi badan.',
      semua: 'Anda bisa menghitung IMT di halaman Cek IMT. Kategorinya mengikuti standar Kemenkes untuk orang dewasa Indonesia.',
    },
    tautan: [{ ke: '/cek-gizi/imt', label: { anak: 'Cek tumbuh anak', lansia: 'Cek berat badan', semua: 'Buka Cek IMT' } }],
    lanjutan: {
      anak: ['Makanan apa yang bikin kuat?', 'Ayo main kuis!'],
      remaja: ['Jajan sehat itu yang kayak apa?', 'Gejala DBD apa aja?'],
      lansia: ['Cara ambil nomor antrean', 'Cara pasang pengingat minum obat'],
      semua: ['Berapa kebutuhan kalori saya?', 'Apa itu Isi Piringku?'],
    },
  },
  {
    id: 'makan',
    kunci: ['makan', 'piring', 'sayur', 'buah', 'gula', 'garam', 'lemak', 'minyak', 'jajan', 'camilan', 'sarapan', 'gizi seimbang', 'kuat'],
    teks: {
      anak: 'Makanan sehat itu beragam: ada nasi atau sumber tenaga, lauk, sayur, dan buah. Coba susun piringmu di Piringku!',
      remaja: 'Jajan sehat itu yang tidak berlebihan gula, garam, dan lemak. Di Cek jajanan, kamu bisa melihat kandungan jajanan favoritmu.',
      semua: 'Panduan Isi Piringku membagi piring menjadi makanan pokok, lauk pauk, sayur, dan buah. Di Cek makanan, Anda bisa menyusun piring dan melihat kandungan gula, garam, dan lemaknya.',
    },
    tautan: [{ ke: '/cek-gizi/makanan', label: { anak: 'Susun Isi Piringku', remaja: 'Cek jajanan & makanan', semua: 'Buka Cek makanan' } }],
    lanjutan: {
      anak: ['Kenapa harus cuci tangan?', 'Ayo main kuis!'],
      remaja: ['Gimana cara cek status gizi?', 'Gejala DBD apa aja?'],
      lansia: ['Cek berat badan ideal', 'Cara mencegah demam berdarah'],
      semua: ['Cara cek IMT', 'Berapa kebutuhan kalori saya?'],
    },
  },
  {
    id: 'cuci-tangan',
    kunci: ['cuci tangan', 'kuman', 'sabun'],
    teks: {
      anak: 'Tangan kita membawa kuman yang tidak terlihat. Cuci tangan pakai sabun dan air mengalir, terutama sebelum makan dan sesudah dari toilet, supaya kita tidak gampang sakit.',
      semua: 'Mencuci tangan dengan sabun dan air mengalir, terutama sebelum makan dan sesudah dari toilet, membantu mencegah penyakit menular.',
    },
    tautan: [],
    lanjutan: {
      anak: ['Makanan apa yang bikin kuat?', 'Nyamuk DBD itu apa?'],
      semua: ['Apa itu DBD?', 'Apa itu Isi Piringku?'],
    },
  },
  {
    id: 'antrean',
    kunci: ['antre', 'antri', 'puskesmas', 'daftar', 'berobat', 'dokter', 'poli', 'periksa', 'klinik', 'konsultasi'],
    teks: {
      anak: 'Kalau merasa sakit, bilang ke ayah, ibu, atau guru, ya. Mereka yang akan mengantarmu ke dokter.',
      remaja: 'Kamu bisa ambil nomor antrean puskesmas atau pilih konsultasi online dari sini. Ikuti langkahnya satu per satu, lalu simpan tiketnya.',
      lansia: 'Bapak/Ibu bisa mengambil nomor antrean puskesmas dari sini. Puskesmas terdekat dan antrean prioritas lansia sudah dipilihkan, dan tetap bisa diubah.',
      semua: 'Anda bisa mengambil nomor antrean puskesmas atau memilih konsultasi online. Ikuti langkahnya satu per satu, lalu simpan tiketnya.',
    },
    tautan: TAUTAN_ANTREAN,
    lanjutan: {
      anak: ['Kenapa harus cuci tangan?', 'Ayo main kuis!'],
      remaja: ['Gimana cara cek status gizi?', 'Gejala DBD apa aja?'],
      lansia: ['Cara pasang pengingat minum obat', 'Cara memperbesar tulisan'],
      semua: ['Pasang pengingat obat', 'Apa itu DBD?'],
    },
  },
  {
    id: 'obat',
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
    lanjutan: {
      anak: ['Kenapa harus cuci tangan?', 'Ayo main kuis!'],
      lansia: ['Cara ambil nomor antrean', 'Cara memperbesar tulisan'],
      semua: ['Cara ambil antrean puskesmas', 'Apa itu DBD?'],
    },
  },
  {
    id: 'tampilan',
    kunci: ['tulisan', 'huruf', 'ukuran teks', 'suara', 'dibacakan', 'kontras', 'isyarat', 'bisindo', 'tampilan', 'animasi'],
    teks: {
      anak: 'Tombol Tampilan ada di bagian atas. Di sana huruf bisa dibesarkan atau suara dinyalakan. Minta bantuan orang tua, ya.',
      lansia: 'Tekan tombol Tampilan di bagian atas layar. Di sana Bapak/Ibu bisa memperbesar tulisan dan menyalakan suara yang membacakan isi halaman.',
      semua: 'Tekan tombol Tampilan di bagian atas untuk memperbesar tulisan, menyalakan suara, menaikkan kontras, menampilkan bahasa isyarat, atau mengurangi animasi.',
    },
    tautan: [],
    lanjutan: {
      anak: ['Nyamuk DBD itu apa?', 'Ayo main kuis!'],
      lansia: ['Cara ambil nomor antrean', 'Cek berat badan ideal'],
      semua: ['Cara ambil antrean puskesmas', 'Apa itu DBD?'],
    },
  },
  {
    id: 'kuis',
    kunci: ['kuis', 'main', 'game', 'permainan', 'lencana'],
    teks: {
      anak: 'Ayo main Kuis Nyamuk! Jawab pertanyaannya dan kumpulkan lencananya.',
      semua: 'Ada Kuis Nyamuk tentang DBD untuk anak-anak. Cocok dimainkan bersama keluarga.',
    },
    tautan: [{ ke: '/kuis', label: 'Main Kuis Nyamuk' }],
    lanjutan: {
      anak: ['Nyamuk DBD itu apa?', 'Kenapa harus cuci tangan?'],
      semua: ['Apa itu DBD?'],
    },
  },
  {
    // Tanpa pertanyaan lanjutan: perhatian tetap pada tombol 119.
    id: '119',
    kunci: ['119', 'darurat', 'ambulans', 'gawat'],
    teks: {
      anak: 'Tombol merah 119 hanya untuk keadaan darurat. Kalau ada yang sakit parah, panggil orang dewasa dulu, ya.',
      semua: 'Untuk keadaan gawat darurat medis, tekan tombol merah 119 di bagian atas layar. Langkah yang perlu dilakukan sambil menunggu bantuan ada di halaman Darurat.',
    },
    tautan: TAUTAN_DARURAT,
    lanjutan: [],
  },
  {
    id: 'terima-kasih',
    kunci: ['terima kasih', 'makasih', 'thanks', 'thank you'],
    teks: {
      anak: 'Sama-sama! Tetap sehat dan ceria, ya!',
      remaja: 'Sama-sama! Kalau ada yang mau ditanyakan lagi, Piko di sini.',
      semua: 'Sama-sama. Semoga sehat selalu!',
    },
    tautan: [],
    lanjutan: SARAN,
  },
  {
    id: 'salam',
    kunci: [' halo ', ' hai ', ' hi ', ' hello ', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'assalamualaikum'],
    teks: {
      anak: 'Halo juga! Mau tanya apa hari ini?',
      remaja: 'Hai juga! Mau tanya soal apa?',
      semua: 'Halo! Ada yang bisa Piko bantu?',
    },
    tautan: [],
    lanjutan: SARAN,
  },
]

const JAWAB_LAIN = {
  anak: 'Hmm, Piko belum tahu jawabannya. Coba pilih pertanyaan di bawah, ya!',
  remaja: 'Maaf, Piko belum bisa menjawab itu. Untuk sekarang Piko paham soal DBD, gizi dan jajanan, antrean puskesmas, dan pengaturan tampilan.',
  lansia: 'Mohon maaf, Piko belum bisa menjawab pertanyaan itu. Piko bisa membantu soal antrean puskesmas, pengingat obat, berat badan, DBD, dan cara memperbesar tulisan.',
  semua: 'Maaf, Piko belum bisa menjawab pertanyaan itu. Untuk sekarang Piko paham soal DBD, gizi dan makanan, antrean puskesmas, pengingat obat, dan pengaturan tampilan.',
}

// Tautan bisa berupa daftar tetap atau varian per profil; labelnya juga boleh bervarian.
const susunTautan = (tautan, profil) =>
  pilihVarian(tautan, profil).map((t) => ({ ke: t.ke, label: pilihVarian(t.label, profil) }))

// Satu topik (atau satu sub-pertanyaannya) menjadi jawaban. Sub memakai tautan topiknya bila tidak punya sendiri.
function jawabTopik(topik, sub, profil) {
  const isi = sub ?? topik
  return {
    id: sub ? `${topik.id}/${sub.id}` : topik.id,
    topik: topik.id,
    teks: pilihVarian(isi.teks, profil),
    poin: isi.poin ? pilihVarian(isi.poin, profil) : [],
    tautan: susunTautan(isi.tautan ?? topik.tautan, profil),
    lanjutan: isi.lanjutan ? (pilihVarian(isi.lanjutan, profil) ?? []) : [],
  }
}

const cariSub = (topik, t) => topik.sub?.find((s) => memuat(t, s.kunci))

/**
 * Jawaban untuk satu pertanyaan, tanpa jeda. Dipisah supaya mudah diuji.
 * `topik` adalah topik jawaban Piko sebelumnya: pertanyaan susulan tanpa nama topik ("cara mencegahnya?")
 * tetap dijawab dalam topik itu. Teks sub selalu menyebut topiknya, jadi tidak ada salah paham.
 */
export function jawab(teks, profil, { topik: konteks } = {}) {
  const t = rapikan(teks)
  if (memuat(t, KUNCI_MENYAKITI_DIRI)) {
    return { id: 'darurat', teks: pilihVarian(JAWAB_MENYAKITI_DIRI, profil), poin: [], tautan: TAUTAN_DARURAT, lanjutan: [], darurat: true }
  }
  if (memuat(t, KUNCI_DARURAT)) {
    return { id: 'darurat', teks: pilihVarian(JAWAB_DARURAT, profil), poin: [], tautan: TAUTAN_DARURAT, lanjutan: [], darurat: true }
  }
  if (memuat(t, KUNCI_DIAGNOSIS)) {
    const tautan = profil === 'anak' ? [] : [{ ke: '/layanan/antrean', label: 'Daftar periksa' }]
    return { id: 'diagnosis', teks: pilihVarian(JAWAB_DIAGNOSIS, profil), poin: [], tautan, lanjutan: pilihVarian(LANJUTAN_DIAGNOSIS, profil) }
  }
  const topik = TOPIK.find((x) => memuat(t, x.kunci))
  if (topik) return jawabTopik(topik, cariSub(topik, t), profil)
  const sebelumnya = TOPIK.find((x) => x.id === konteks)
  const sub = sebelumnya && cariSub(sebelumnya, t)
  if (sub) return jawabTopik(sebelumnya, sub, profil)
  return { id: 'lain', teks: pilihVarian(JAWAB_LAIN, profil), poin: [], tautan: [], lanjutan: SARAN[profil] }
}

// Titik sambung ke AI nanti. Jeda kecil meniru waktu berpikir supaya alur antarmukanya (indikator mengetik,
// pengumuman pembaca layar) sudah teruji sebelum AI tersambung.
export async function tanyaPiko({ teks, profil, topik, jeda = 700 }) {
  if (jeda > 0) await new Promise((selesai) => setTimeout(selesai, jeda))
  return jawab(teks, profil, { topik })
}
