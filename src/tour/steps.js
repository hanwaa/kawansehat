// Langkah tur Si Kawal per profil. `target` cocok dengan atribut data-tour di halaman beranda.

export const SAPAAN_TUR = {
  anak: { judul: 'Halo! Aku Si Kawal.', teks: 'Mau aku ajak jalan-jalan keliling Kawal Sehat? Cuma sebentar, kok!' },
  remaja: { judul: 'Hai, aku Si Kawal!', teks: 'Mau tur kilat 3 langkah biar langsung paham cara pakainya?' },
  dewasa: { judul: 'Selamat datang di Kawal Sehat', teks: 'Saya Si Kawal. Mau saya tunjukkan cara memakai website ini dalam 4 langkah singkat?' },
  lansia: { judul: 'Selamat datang, Bapak/Ibu', teks: 'Saya Si Kawal. Mau saya tunjukkan cara memakainya? Hanya 3 langkah, pelan-pelan saja.' },
}

export const LANGKAH_TUR = {
  anak: [
    { target: 'menu', pose: 'tunjuk', judul: 'Ini menu petualanganmu', teks: 'Pilih Belajar, Piringku, atau Kuis untuk mulai main sambil belajar.' },
    { target: 'dengarkan', pose: 'lambai', judul: 'Aku bisa membacakan', teks: 'Ketuk tombol Dengarkan, nanti aku bacakan isinya untukmu.' },
    { target: 'darurat', pose: 'pikir', judul: 'Tombol merah 119', teks: 'Ini khusus keadaan darurat. Kalau ada yang sakit parah, panggil orang dewasa, lalu tekan bersama.' },
    { target: 'aksi-utama', pose: 'jempol', judul: 'Yuk, main kuis!', teks: 'Jawab kuisnya dan kumpulkan lencana. Kamu sudah dapat lencana Penjelajah!' },
  ],
  remaja: [
    { target: 'ganti-tampilan', pose: 'tunjuk', judul: 'Atur tampilan sesukamu', teks: 'Ganti ukuran huruf, kontras, atau nyalakan bahasa isyarat di sini. Bisa kapan saja.' },
    { target: 'aksi-utama', pose: 'jempol', judul: 'Mulai dari sini', teks: 'Cek mitos vs fakta kesehatan, gizi jajananmu, dan IMT sesuai umur.' },
    { target: 'darurat', pose: 'pikir', judul: 'Darurat? Tekan 119', teks: 'Tombol merah ini selalu ada di atas untuk menelepon layanan gawat darurat medis.' },
  ],
  dewasa: [
    { target: 'menu', pose: 'tunjuk', judul: 'Menu utama', teks: 'Beranda, Info kesehatan, Cek Gizi, dan Layanan. Posisinya selalu sama di setiap halaman.' },
    { target: 'ganti-tampilan', pose: 'tunjuk', judul: 'Ganti tampilan', teks: 'Ubah profil, ukuran teks, kontras, suara, atau bahasa isyarat kapan saja dari tombol ini.' },
    { target: 'aksi-utama', pose: 'jempol', judul: 'Ambil antrean puskesmas', teks: 'Pesan antrean atau konsultasi online, termasuk juru bahasa isyarat dan kursi roda bila perlu.' },
    { target: 'darurat', pose: 'pikir', judul: 'Tombol darurat 119', teks: 'Selalu ada di bagian atas. Tekan untuk menelepon layanan gawat darurat medis.' },
  ],
  lansia: [
    { target: 'aksi-utama', pose: 'tunjuk', judul: 'Pilih salah satu tombol besar', teks: 'Bapak/Ibu cukup menekan salah satu tombol besar ini. Misalnya Ambil Antrean.' },
    { target: 'dengarkan', pose: 'lambai', judul: 'Tombol Dengarkan', teks: 'Tekan tombol ini, nanti tulisan di layar saya bacakan.' },
    { target: 'darurat', pose: 'pikir', judul: 'Tombol merah 119', teks: 'Kalau keadaan darurat, tekan tombol merah ini untuk menelepon bantuan.' },
  ],
}
