// Panduan Si Kawal per halaman. Tombol "Lihat Panduan" menjelaskan halaman yang sedang dibuka, tanpa berpindah
// halaman. Setiap langkah menunjuk elemen [data-tour="..."] di halaman itu; langkah yang elemennya tidak ada di
// layar (varian profil lain, hasil yang belum dihitung, tiket yang belum diambil) otomatis dilewati.
// `judul` dan `teks` boleh berupa teks biasa atau varian per profil: { anak, remaja, dewasa, lansia, semua }.
// `profil` (opsional) membatasi langkah untuk profil tertentu saja.

// Sapaan saat tur ditawarkan setelah pembuka (hanya di beranda). `n` = jumlah langkah yang tersedia.
export const SAPAAN_TUR = {
  anak: { judul: 'Halo! Aku Si Kawal.', teks: () => 'Mau aku ajak jalan-jalan keliling Kawal Sehat? Cuma sebentar, kok!' },
  remaja: { judul: 'Hai, aku Si Kawal!', teks: (n) => `Mau tur kilat ${n} langkah biar langsung paham cara pakainya?` },
  dewasa: {
    judul: 'Selamat datang di Kawal Sehat',
    teks: (n) => `Saya Si Kawal. Mau saya tunjukkan cara memakai website ini dalam ${n} langkah singkat?`,
  },
  lansia: {
    judul: 'Selamat datang, Bapak/Ibu',
    teks: (n) => `Saya Si Kawal. Mau saya tunjukkan cara memakainya? Hanya ${n} langkah, pelan-pelan saja.`,
  },
}

// ---------- Langkah umum: ada di setiap halaman ----------

const MENU = {
  target: 'menu',
  pose: 'tunjuk',
  judul: { anak: 'Ini menu petualanganmu', semua: 'Menu utama' },
  teks: {
    anak: 'Pilih Belajar, Piringku, atau Kuis untuk mulai main sambil belajar.',
    remaja: 'Beranda, Info, Cek Gizi, dan Layanan. Selalu ada di sini, di halaman mana pun.',
    dewasa: 'Beranda, Info kesehatan, Cek Gizi, dan Layanan. Posisinya selalu sama di setiap halaman.',
    lansia: 'Menu ini selalu ada di setiap halaman. Tekan Beranda untuk kembali ke halaman awal.',
  },
}

const TAMPILAN = {
  target: 'ganti-tampilan',
  pose: 'tunjuk',
  judul: { anak: 'Tombol Tampilan', remaja: 'Atur tampilan sesukamu', dewasa: 'Ganti tampilan', lansia: 'Tulisan kurang besar?' },
  teks: {
    anak: 'Di sini huruf bisa dibuat lebih besar atau suara dinyalakan. Minta bantuan orang tua, ya.',
    remaja: 'Ganti ukuran huruf, kontras, atau nyalakan bahasa isyarat di sini. Bisa kapan saja.',
    dewasa: 'Ubah profil, ukuran teks, kontras, suara, atau bahasa isyarat kapan saja dari tombol ini.',
    lansia: 'Tekan tombol Tampilan untuk memperbesar tulisan atau menyalakan suara.',
  },
}

const DARURAT = {
  target: 'darurat',
  pose: 'pikir',
  judul: { anak: 'Tombol merah 119', remaja: 'Darurat? Tekan 119', dewasa: 'Tombol darurat 119', lansia: 'Tombol merah 119' },
  teks: {
    anak: 'Ini khusus keadaan darurat. Kalau ada yang sakit parah, panggil orang dewasa, lalu tekan bersama.',
    remaja: 'Tombol merah ini selalu ada di atas untuk menelepon layanan gawat darurat medis.',
    dewasa: 'Selalu ada di bagian atas. Tekan untuk menelepon layanan gawat darurat medis.',
    lansia: 'Kalau keadaan darurat, tekan tombol merah ini untuk menelepon bantuan.',
  },
}

const UMUM = [MENU, TAMPILAN, DARURAT]

// Tautan kembali di halaman turunan (topik, alat cek gizi). `tujuan` = nama halaman induknya.
const kembali = (tujuan) => ({
  target: 'kembali',
  pose: 'tunjuk',
  judul: 'Kembali',
  teks: {
    anak: `Ketuk ini untuk kembali ke ${tujuan.anak ?? tujuan.semua}.`,
    lansia: `Tekan tulisan ini untuk kembali ke ${tujuan.semua}.`,
    semua: `Tekan ini untuk kembali ke ${tujuan.semua}.`,
  },
})

const KE_CEK_GIZI = kembali({ anak: 'Piringku', semua: 'Cek Gizi' })

const KEMBALI_BERANDA = {
  target: 'kembali-beranda',
  pose: 'pikir',
  judul: 'Kembali ke beranda',
  teks: {
    anak: 'Halaman ini tidak ada. Ketuk tombol ini untuk kembali ke beranda.',
    semua: 'Halaman ini tidak ditemukan. Tekan tombol ini untuk kembali ke beranda.',
  },
}

// ---------- Beranda: berbeda per profil karena tata letaknya berbeda ----------

const DENGARKAN_BERANDA = {
  target: 'dengarkan',
  pose: 'lambai',
  judul: { anak: 'Aku bisa membacakan', remaja: 'Lagi malas baca?', dewasa: 'Dengarkan halaman', lansia: 'Tombol Dengarkan' },
  teks: {
    anak: 'Ketuk tombol Dengarkan, nanti aku bacakan isinya untukmu.',
    remaja: 'Tekan Dengarkan, isi halaman dibacakan sambil ditandai.',
    dewasa: 'Tekan Dengarkan untuk membacakan isi halaman. Bagian yang sedang dibaca ikut ditandai.',
    lansia: 'Tekan tombol ini, nanti tulisan di layar saya bacakan.',
  },
}

const TIKET_AKTIF = {
  target: 'tiket-aktif',
  pose: 'jempol',
  judul: { lansia: 'Antrean Bapak/Ibu', semua: 'Antrean aktif' },
  teks: {
    lansia: 'Nomor antrean yang sudah diambil tampil di sini. Tekan untuk melihat tiketnya.',
    semua: 'Antrean yang sudah Anda ambil tampil di sini. Tekan untuk membuka tiketnya.',
  },
}

const BERANDA = {
  anak: [
    MENU,
    DENGARKAN_BERANDA,
    {
      target: 'lencana',
      pose: 'jempol',
      judul: 'Lencanaku',
      teks: 'Lencana yang kamu kumpulkan dari tur, kuis, dan game piring muncul di sini.',
    },
    TAMPILAN,
    DARURAT,
    {
      target: 'aksi-utama',
      pose: 'jempol',
      judul: 'Yuk, main kuis!',
      teks: 'Jawab kuisnya dan kumpulkan lencana. Kamu sudah dapat lencana Penjelajah!',
    },
  ],
  remaja: [
    TAMPILAN,
    MENU,
    {
      target: 'aksi-utama',
      pose: 'jempol',
      judul: 'Mulai dari sini',
      teks: 'Cek mitos vs fakta kesehatan, gizi jajananmu, dan IMT sesuai umur.',
    },
    DENGARKAN_BERANDA,
    DARURAT,
  ],
  dewasa: [
    MENU,
    TAMPILAN,
    TIKET_AKTIF,
    {
      target: 'aksi-utama',
      pose: 'jempol',
      judul: 'Ambil antrean puskesmas',
      teks: 'Pesan antrean atau konsultasi online, termasuk juru bahasa isyarat dan kursi roda bila perlu.',
    },
    DENGARKAN_BERANDA,
    DARURAT,
  ],
  lansia: [
    TIKET_AKTIF,
    {
      target: 'aksi-utama',
      pose: 'tunjuk',
      judul: 'Pilih salah satu tombol besar',
      teks: 'Bapak/Ibu cukup menekan salah satu tombol besar ini. Misalnya Ambil Antrean.',
    },
    DENGARKAN_BERANDA,
    TAMPILAN,
    MENU,
    DARURAT,
  ],
}

// ---------- Halaman lain ----------

const PANDUAN = {
  beranda: BERANDA,

  info: [
    {
      target: 'daftar-topik',
      pose: 'tunjuk',
      judul: { anak: 'Pilih ceritamu', lansia: 'Pilih topik', semua: 'Daftar topik' },
      teks: {
        anak: 'Ketuk salah satu cerita untuk mulai belajar.',
        remaja: 'Pilih topik yang mau kamu baca. Semuanya singkat dan dari sumber resmi.',
        dewasa: 'Pilih topik untuk dibaca. Isinya disusun dari sumber resmi Kementerian Kesehatan.',
        lansia: 'Tekan salah satu topik. Semua tulisannya bisa dibacakan.',
      },
    },
    {
      target: 'segera-hadir',
      pose: 'pikir',
      judul: 'Segera hadir',
      teks: {
        anak: 'Cerita-cerita ini sedang disiapkan. Tunggu, ya!',
        remaja: 'Topik-topik ini sedang disiapkan.',
        dewasa: 'Topik berikutnya yang sedang disiapkan untuk Anda.',
        lansia: 'Topik-topik ini sedang disiapkan.',
      },
    },
    ...UMUM,
  ],

  topik: [
    {
      target: 'dengarkan',
      pose: 'lambai',
      judul: { anak: 'Aku bisa membacakan', remaja: 'Lagi malas baca?', dewasa: 'Dengarkan', lansia: 'Tombol Dengarkan' },
      teks: {
        anak: 'Ketuk Dengarkan, nanti aku bacakan ceritanya untukmu.',
        remaja: 'Tekan Dengarkan, isinya dibacakan sambil ditandai.',
        dewasa: 'Tekan untuk membacakan seluruh isi halaman. Bagian yang sedang dibaca ikut ditandai.',
        lansia: 'Tekan tombol ini, nanti tulisan di halaman ini saya bacakan.',
      },
    },
    {
      target: 'isyarat',
      pose: 'lambai',
      judul: 'Bahasa isyarat',
      teks: {
        anak: 'Ini penjelasan dengan bahasa isyarat, lengkap dengan tulisannya.',
        semua: 'Penjelasan dalam BISINDO dan transkripnya ada di sini.',
      },
    },
    { target: 'komik', pose: 'tunjuk', judul: 'Baca ceritanya', teks: 'Baca kotak-kotak cerita ini satu per satu, berurutan.' },
    {
      target: 'mitos',
      pose: 'pikir',
      judul: 'Mitos atau fakta?',
      teks: 'Setiap kartu membongkar satu mitos yang sering beredar, lengkap dengan faktanya.',
    },
    {
      target: 'tanda-bahaya',
      pose: 'pikir',
      judul: { anak: 'Ingat ini, ya!', lansia: 'Paling penting', semua: 'Tanda bahaya' },
      teks: {
        anak: 'Kalau badanmu panas tinggi, segera bilang ke orang tua atau guru.',
        remaja: 'Kalau muncul tanda-tanda ini, langsung ke puskesmas atau IGD.',
        dewasa: 'Kotak merah berisi tanda bahaya. Bila muncul, segera bawa ke fasilitas kesehatan.',
        lansia: 'Kotak merah ini tanda bahaya. Kalau terjadi, segera ke rumah sakit.',
      },
    },
    { target: 'kuis', pose: 'jempol', judul: 'Sudah selesai membaca?', teks: 'Main kuis nyamuk dan kumpulkan lencana Pemburu Jentik!' },
    {
      target: 'sumber',
      pose: 'tunjuk',
      profil: ['remaja', 'dewasa', 'lansia'],
      judul: { lansia: 'Dari sumber resmi', semua: 'Sumber resmi' },
      teks: {
        remaja: 'Isinya dari Kemenkes. Tautan sumbernya ada di sini.',
        dewasa: 'Isi halaman ini mengikuti sumber resmi Kementerian Kesehatan. Tautannya tercantum di sini.',
        lansia: 'Isi halaman ini dari Kementerian Kesehatan.',
      },
    },
    kembali({ semua: 'semua topik' }),
    KEMBALI_BERANDA,
    ...UMUM,
  ],

  'cek-gizi': [
    {
      target: 'main-piring',
      pose: 'jempol',
      judul: 'Main Susun Isi Piringku',
      teks: 'Ketuk di sini untuk main mengisi piring dengan makanan sehat.',
    },
    {
      target: 'untuk-ortu',
      pose: 'tunjuk',
      judul: 'Untuk orang tua',
      teks: 'Bagian ini untuk orang tua: cek tumbuh anak dengan standar WHO yang dipakai Kemenkes.',
    },
    {
      target: 'alat-gizi',
      pose: 'tunjuk',
      judul: { lansia: 'Pilih yang ingin diperiksa', semua: 'Pilih alat cek' },
      teks: {
        remaja: 'Cek IMT sesuai umurmu, kebutuhan gizi harian, atau gizi jajananmu. Semua dihitung di perangkatmu.',
        dewasa: 'Hitung IMT, kebutuhan gizi harian, atau nilai gizi makanan. Semua dihitung di perangkat Anda.',
        lansia: 'Tekan salah satu kotak: cek berat badan, kebutuhan gizi, atau cek makanan.',
      },
    },
    {
      target: 'isi-piringku',
      pose: 'tunjuk',
      judul: 'Isi Piringku',
      teks: {
        anak: 'Ini piring makan yang sehat: ada makanan pokok, lauk, sayur, dan buah.',
        remaja: 'Panduan porsi sekali makan dari Kemenkes. Warnanya sama dengan diagram piring.',
        dewasa: 'Panduan porsi sekali makan dari Kementerian Kesehatan, lengkap dengan sumbernya.',
        lansia: 'Ini contoh isi piring makan yang sehat, dari Kementerian Kesehatan.',
      },
    },
    ...UMUM,
  ],

  imt: [
    {
      target: 'form-gizi',
      pose: 'tunjuk',
      judul: { anak: 'Isi bersama orang tua', lansia: 'Isi berat dan tinggi badan', semua: 'Isi data' },
      teks: {
        anak: 'Minta orang tua membantu mengisi umur, berat, dan tinggi badanmu, lalu tekan Hitung.',
        remaja: 'Isi jenis kelamin, umur, berat, dan tinggi badan, lalu tekan Hitung. Untuk remaja dipakai standar khusus sesuai umur.',
        dewasa: 'Isi jenis kelamin, umur, berat, dan tinggi badan, lalu tekan Hitung. Lingkar perut boleh dikosongkan.',
        lansia: 'Isi kotak-kotak ini, lalu tekan tombol Hitung di bawahnya.',
      },
    },
    {
      target: 'hasil',
      pose: 'jempol',
      judul: 'Hasilnya di sini',
      teks: {
        anak: 'Ini hasilnya. Tanyakan ke orang tua atau petugas puskesmas kalau ada yang belum jelas.',
        remaja: 'Hasilnya dibandingkan dengan anak seumuranmu. Tekan Dengarkan kalau mau dibacakan.',
        dewasa: 'Hasil dan artinya tampil di sini, lengkap dengan sumbernya. Bisa juga dibacakan.',
        lansia: 'Hasilnya tampil di sini. Tekan Dengarkan untuk mendengarkannya.',
      },
    },
    {
      target: 'privasi',
      pose: 'jempol',
      judul: 'Data tetap di perangkat',
      teks: {
        anak: 'Datamu tidak dikirim ke mana pun, hanya disimpan di perangkat ini.',
        semua: 'Data hanya dihitung dan disimpan di perangkat ini, tidak dikirim ke mana pun.',
      },
    },
    KE_CEK_GIZI,
    ...UMUM,
  ],

  kebutuhan: [
    {
      target: 'form-gizi',
      pose: 'tunjuk',
      judul: 'Isi data',
      teks: {
        anak: 'Pilih jenis kelamin dan isi umurmu, lalu tekan Lihat kebutuhan.',
        remaja: 'Pilih jenis kelamin dan isi umurmu, lalu tekan Lihat kebutuhan.',
        dewasa: 'Pilih jenis kelamin dan isi umur, lalu tekan Lihat kebutuhan. Data ini juga dipakai di Cek makanan.',
        lansia: 'Pilih jenis kelamin dan isi umur Bapak/Ibu, lalu tekan Lihat kebutuhan.',
      },
    },
    {
      target: 'hasil',
      pose: 'jempol',
      judul: 'Kebutuhan harian',
      teks: {
        anak: 'Ini yang dibutuhkan tubuhmu setiap hari. Makan lengkap sesuai Isi Piringku, ya!',
        remaja: 'Kebutuhan harianmu dan batas aman gula, garam, dan lemak.',
        dewasa: 'Angka Kecukupan Gizi harian dan batas aman gula, garam, dan lemak, lengkap dengan sumbernya.',
        lansia: 'Ini kebutuhan harian Bapak/Ibu. Tekan Dengarkan untuk mendengarkannya.',
      },
    },
    KE_CEK_GIZI,
    ...UMUM,
  ],

  makanan: [
    // Game anak "Susun Isi Piringku"
    {
      target: 'piring',
      pose: 'jempol',
      judul: 'Ini piringmu',
      teks: 'Makanan yang kamu pilih masuk ke bagian piring yang tepat. Kalau lengkap, kamu dapat lencana!',
    },
    {
      target: 'pilih-makanan',
      pose: 'tunjuk',
      judul: 'Pilih makanan',
      teks: 'Ketuk makanan untuk memasukkannya ke piring. Isi semua bagian sampai lengkap!',
    },
    // Profil lain
    {
      target: 'cari-makanan',
      pose: 'tunjuk',
      judul: 'Cari makanan',
      teks: {
        remaja: 'Ketik nama makanan atau jajanan, atau pilih kelompoknya, lalu tekan salah satu hasil.',
        dewasa: 'Ketik nama makanan atau pilih kelompoknya, lalu tekan salah satu hasil untuk melihat nilai gizinya.',
        lansia: 'Ketik nama makanan, lalu tekan salah satu hasil.',
      },
    },
    {
      target: 'detail-makanan',
      pose: 'tunjuk',
      judul: 'Atur porsi',
      teks: {
        lansia: 'Atur jumlah porsi, lalu tekan Tambahkan ke Piringku Hari Ini.',
        semua: 'Atur jumlah porsi dengan tombol tambah dan kurang, lalu tambahkan ke Piringku Hari Ini.',
      },
    },
    {
      target: 'rekap',
      pose: 'jempol',
      judul: 'Piringku Hari Ini',
      teks: {
        remaja: 'Semua yang kamu makan hari ini, termasuk gula, garam, dan lemaknya. Salah hapus? Bisa diurungkan.',
        dewasa: 'Rekap makanan hari ini: kelengkapan Isi Piringku serta batas gula, garam, dan lemak.',
        lansia: 'Makanan Bapak/Ibu hari ini tercatat di sini. Perhatikan garam dan gula.',
      },
    },
    KE_CEK_GIZI,
    ...UMUM,
  ],

  antrean: [
    // Profil anak: halaman ini dijaga untuk orang tua
    {
      target: 'untuk-ortu',
      pose: 'pikir',
      judul: 'Untuk orang tua',
      teks: 'Halaman ini untuk orang tua atau wali. Kalau kamu merasa sakit, bilang ke mereka, ya.',
    },
    {
      target: 'langkah-antrean',
      pose: 'tunjuk',
      judul: { lansia: 'Langkah-langkahnya', semua: 'Enam langkah singkat' },
      teks: {
        remaja: 'Bagian ini menunjukkan kamu sedang di langkah ke berapa.',
        lansia: 'Bagian ini menunjukkan Bapak/Ibu sedang di langkah ke berapa.',
        semua: 'Bagian ini menunjukkan posisi Anda di antara enam langkah pendaftaran.',
      },
    },
    {
      target: 'tips',
      pose: 'lambai',
      judul: 'Tips dari Si Kawal',
      teks: {
        anak: 'Di setiap langkah, Si Kawal memberi tips di sini.',
        remaja: 'Di setiap langkah aku kasih tips singkat di sini.',
        dewasa: 'Di setiap langkah, saya memberi tips singkat di sini.',
        lansia: 'Di setiap langkah, saya memberi petunjuk di sini.',
      },
    },
    {
      target: 'tombol-langkah',
      pose: 'jempol',
      judul: 'Lanjut atau kembali',
      teks: {
        remaja: 'Tekan Lanjut kalau sudah, atau Kembali untuk mengubah pilihan. Semua bisa dicek lagi sebelum antrean diambil.',
        lansia: 'Tekan Lanjut kalau sudah mengisi. Kalau keliru, tekan Kembali.',
        semua: 'Tekan Lanjut setelah mengisi, atau Kembali untuk mengubah. Semua pilihan bisa diperiksa ulang di langkah terakhir.',
      },
    },
    ...UMUM,
  ],

  tiket: [
    {
      target: 'ambil-antrean',
      pose: 'tunjuk',
      judul: 'Belum ada tiket',
      teks: { lansia: 'Tekan tombol ini untuk mengambil antrean.', semua: 'Ambil antrean puskesmas dulu lewat tombol ini.' },
    },
    {
      target: 'tiket',
      pose: 'jempol',
      judul: { lansia: 'Nomor antrean', semua: 'Tiket antrean' },
      teks: {
        remaja: 'Ini nomor antreanmu, lengkap dengan tempat, jadwal, dan kebutuhan khusus yang sudah disiapkan.',
        lansia: 'Ini nomor antrean Bapak/Ibu. Tunjukkan nomor ini di loket.',
        semua: 'Nomor antrean, tempat, jadwal, dan kebutuhan khusus yang sudah disiapkan petugas.',
      },
    },
    {
      target: 'dengarkan',
      pose: 'lambai',
      judul: 'Dengarkan tiket',
      teks: { lansia: 'Tekan tombol ini, nomor dan jadwalnya saya bacakan.', semua: 'Nomor dan jadwal antrean bisa dibacakan.' },
    },
    {
      target: 'cetak',
      pose: 'tunjuk',
      judul: 'Simpan tiket',
      teks: { lansia: 'Tekan ini untuk mencetak tiket.', semua: 'Cetak tiket atau simpan sebagai PDF untuk dibawa ke puskesmas.' },
    },
    {
      target: 'batalkan',
      pose: 'pikir',
      judul: 'Tidak jadi datang?',
      teks: {
        remaja: 'Batalkan antrean supaya nomornya bisa dipakai orang lain. Akan ada konfirmasi dulu.',
        lansia: 'Kalau tidak jadi datang, tekan ini. Bapak/Ibu akan ditanya sekali lagi sebelum dibatalkan.',
        semua: 'Batalkan antrean bila tidak jadi datang. Akan ada konfirmasi dulu.',
      },
    },
    ...UMUM,
  ],

  obat: [
    {
      target: 'jadwal',
      pose: 'tunjuk',
      judul: 'Jadwal hari ini',
      teks: {
        anak: 'Ini jadwal minum obat hari ini.',
        remaja: 'Obat dikelompokkan per waktu minum: pagi, siang, dan malam.',
        dewasa: 'Obat dikelompokkan per waktu minum, lengkap dengan gambar bentuk dan warnanya agar mudah dikenali.',
        lansia: 'Obat Bapak/Ibu hari ini, dikelompokkan pagi, siang, dan malam.',
      },
    },
    {
      target: 'aksi-obat',
      pose: 'jempol',
      judul: 'Sudah diminum?',
      teks: {
        lansia: 'Setelah minum obat, tekan kotak Sudah diminum. Tekan Coba pengingat untuk melihat contohnya.',
        semua: 'Centang Sudah diminum supaya obat tidak terlewat atau terminum dua kali. Coba pengingat menampilkan contoh pengingatnya.',
      },
    },
    {
      target: 'dengarkan',
      pose: 'lambai',
      judul: 'Dengarkan jadwal',
      teks: { lansia: 'Tekan tombol ini, jadwal obatnya saya bacakan.', semua: 'Jadwal obat hari ini bisa dibacakan.' },
    },
    {
      target: 'tambah-obat',
      pose: 'tunjuk',
      judul: 'Tambah obat',
      teks: {
        anak: 'Minta orang tua menambahkan obat di sini.',
        remaja: 'Tambahkan obat baru, atau lihat contohnya dulu.',
        dewasa: 'Tambahkan obat untuk Anda atau keluarga: nama, dosis, bentuk, warna, dan waktu minum.',
        lansia: 'Tekan ini untuk menambah obat. Keluarga juga bisa membantu mengisinya.',
      },
    },
    {
      target: 'form-obat',
      pose: 'tunjuk',
      judul: 'Isi data obat',
      teks: {
        lansia: 'Tulis nama dan dosis obat, pilih waktu minumnya, lalu tekan Simpan obat.',
        semua: 'Isi nama dan dosis, pilih bentuk, warna, dan waktu minum, lalu tekan Simpan obat.',
      },
    },
    ...UMUM,
  ],

  darurat: [
    {
      target: 'telepon-119',
      pose: 'pikir',
      judul: { anak: 'Telepon 119 bersama orang dewasa', semua: 'Telepon 119' },
      teks: {
        anak: 'Kalau ada yang sakit parah, panggil orang dewasa dan tekan tombol ini bersama.',
        remaja: 'Tekan untuk langsung menelepon layanan gawat darurat medis. Gratis.',
        dewasa: 'Tekan untuk langsung menelepon layanan gawat darurat medis. Panggilan bebas biaya.',
        lansia: 'Tekan tombol merah besar ini untuk menelepon bantuan.',
      },
    },
    {
      target: 'yang-disampaikan',
      pose: 'tunjuk',
      judul: 'Yang perlu disampaikan',
      teks: {
        anak: 'Ini yang perlu diceritakan ke petugas. Orang dewasa akan membantu.',
        lansia: 'Sampaikan hal-hal ini ke petugas.',
        semua: 'Siapkan hal-hal ini saat berbicara dengan petugas 119.',
      },
    },
    {
      target: 'kartu-bantuan',
      pose: 'lambai',
      judul: 'Kartu bantuan',
      teks: {
        dewasa: 'Sulit bicara atau Tuli? Tunjukkan kartu bantuan ke orang di dekat Anda supaya mereka meneleponkan 119.',
        lansia: 'Kalau sulit bicara, tunjukkan kartu ini ke orang di dekat Bapak/Ibu.',
        semua: 'Sulit bicara atau Tuli? Tunjukkan kartu bantuan ke orang di dekatmu supaya mereka meneleponkan 119.',
      },
    },
    {
      target: 'bukan-darurat',
      pose: 'tunjuk',
      judul: 'Bukan darurat?',
      teks: 'Untuk pertanyaan atau pengaduan kesehatan, hubungi Halo Kemkes.',
    },
    // Tombol 119 di header tidak dijelaskan lagi: halaman ini sudah halaman daruratnya.
    MENU,
    TAMPILAN,
  ],

  kuis: [
    {
      target: 'soal',
      pose: 'tunjuk',
      judul: 'Jawab soalnya',
      teks: { anak: 'Baca soalnya, pilih satu jawaban, lalu tekan Periksa jawaban.', semua: 'Pilih satu jawaban, lalu tekan Periksa jawaban.' },
    },
    {
      target: 'nomor-soal',
      pose: 'lambai',
      judul: 'Soal ke berapa?',
      teks: 'Di sini terlihat kamu sedang di soal ke berapa.',
    },
    {
      target: 'skor',
      pose: 'jempol',
      judul: 'Hasil kuis',
      teks: 'Lihat berapa jawabanmu yang benar. Jawab benar paling sedikit 2 soal untuk dapat lencana Pemburu Jentik.',
    },
    {
      target: 'setelah-kuis',
      pose: 'tunjuk',
      judul: 'Mau apa lagi?',
      teks: 'Main lagi, baca cerita nyamuk, atau lihat lencanamu di beranda.',
    },
    ...UMUM,
  ],

  lain: [KEMBALI_BERANDA, ...UMUM],
}

const HALAMAN = {
  '/beranda': 'beranda',
  '/info': 'info',
  '/cek-gizi': 'cek-gizi',
  '/cek-gizi/imt': 'imt',
  '/cek-gizi/kebutuhan': 'kebutuhan',
  '/cek-gizi/makanan': 'makanan',
  '/layanan/antrean': 'antrean',
  '/layanan/tiket': 'tiket',
  '/pengingat-obat': 'obat',
  '/darurat': 'darurat',
  '/kuis': 'kuis',
}

// Kunci panduan untuk sebuah alamat halaman.
export function halamanPanduan(pathname) {
  const jalur = pathname.replace(/\/+$/, '') || '/'
  if (jalur.startsWith('/info/')) return 'topik'
  return HALAMAN[jalur] ?? 'lain'
}

// Daftar langkah mentah (belum dicek ke layar) untuk halaman dan profil tertentu.
export function langkahPanduan(halaman, profil) {
  const daftar = PANDUAN[halaman] ?? PANDUAN.lain
  const langkah = Array.isArray(daftar) ? daftar : daftar[profil]
  return langkah.filter((l) => !l.profil || l.profil.includes(profil))
}
