# Kawan Sehat
### Ruang digital kesehatan yang menyesuaikan diri dengan penggunanya

**UI/UX Competition IT CAS 2026** · Tema: *Inovasi Cerdas untuk Indonesia Emas*, "Membangun Ruang Digital yang Bermanfaat bagi Masyarakat"

> *"Website yang menyesuaikan diri dengan penggunanya, bukan pengguna yang harus menyesuaikan diri."*

---

## 1. Ringkasan

Kawan Sehat adalah website kesehatan responsif. Saat pertama dibuka, pengguna ditanya **siapa yang memakai**: anak-anak, remaja, dewasa, atau lansia. Setelah itu, seluruh tampilan berubah: gaya ilustrasi, warna, bahasa, tata letak, dan fitur yang ditonjolkan. Informasi kesehatannya sama, tetapi **cara menyampaikannya berbeda**, sesuai siapa yang membaca.

Di atas profil usia, ada lapisan kedua yang terpisah, yaitu **preferensi akses**: teks besar, kontras tinggi, teks dibacakan, bahasa isyarat (BISINDO), tampilan sederhana, dan kurangi animasi. Lapisan ini bisa dipadukan dengan profil mana pun, karena disabilitas tidak mengenal usia.

Maskot **Piko** (*Pemandu Informasi Kesehatan Optimal*) memandu pengguna yang baru pertama kali memakai website lewat tur singkat, dan menjawab pertanyaan lewat **Tanya Piko**. Kawan Sehat juga menyediakan layanan nyata:
- ambil antrean puskesmas dan konsultasi online, dengan pilihan juru bahasa isyarat;
- cek gizi dan tubuh berdasarkan standar Kemenkes dan WHO;
- pengingat obat;
- tombol darurat 119.

## 2. Latar belakang masalah

Layanan kesehatan digital di Indonesia umumnya dirancang **"satu ukuran untuk semua"**: satu tampilan, satu gaya bahasa, dan satu cara interaksi untuk semua orang. Padahal penggunanya sangat beragam.

| Fakta | Data | Sumber |
|---|---|---|
| Penduduk Indonesia menua | Sekitar **12%** penduduk adalah lansia (60+) pada 2024 | BPS, *Statistik Penduduk Lanjut Usia 2024* (dikutip GoodStats) [1] |
| Banyak penyandang disabilitas | Sekitar **22,97 juta** orang (±8,5% penduduk) pada 2023 | Data BPS/Kemenko PMK (dikutip Kompas) [2] |
| Internet sudah menjangkau mayoritas, tapi belum semua | Penetrasi internet **80,66%** (229,43 juta jiwa) pada 2025. Hampir 20% masyarakat belum menikmati internet | APJII 2025 (dikutip detikInet & Bisnis.com) [3] |
| Informasi kesehatan rawan hoaks | Komdigi mengidentifikasi 1.923 konten hoaks sepanjang 2024, **163 di antaranya bertema kesehatan**. Pada Agustus 2018–Oktober 2020, isu kesehatan di urutan kedua (1.397 konten) | Komdigi (dikutip Antara) [4], Jurnal Komdigi [5] |
| Penyakit yang bisa dicegah masih tinggi | **244.409 kasus DBD** dan **1.430 kematian** sepanjang 2024 | Kemenkes (dikutip jurnal) [6] |
| Masalah gizi ganda | Stunting balita **19,8%** (SSGI 2024). Kelebihan berat badan dan obesitas pada remaja 13–15 tahun **16,2%** (SKI 2023) | Kemenkes BKPK [7], SKI 2023 (dikutip) [8] |

**Akibatnya:**
- **Anak-anak** sulit memahami informasi kesehatan yang ditulis untuk orang dewasa, padahal kebiasaan sehat paling efektif dibentuk sejak kecil.
- **Remaja** butuh informasi yang singkat dan relevan (gizi, jajanan, mitos kesehatan), tetapi sering mendapatkannya dari media sosial yang rawan hoaks.
- **Lansia** kesulitan dengan huruf kecil, menu yang rumit, dan istilah asing, sehingga bergantung pada keluarga untuk hal sederhana seperti mengambil antrean.
- **Penyandang disabilitas** jarang dipertimbangkan sejak awal desain. Contohnya: teman Tuli tidak tahu apakah puskesmas menyediakan juru bahasa isyarat, dan pengguna tunanetra menemui tombol tanpa label.

### Rumusan masalah
> Bagaimana merancang ruang digital kesehatan yang **mudah dipahami dan dipakai oleh semua kelompok usia dan kemampuan**, tanpa membuat banyak aplikasi terpisah?

## 3. Persona

| Persona | Profil & akses | Kebutuhan | Hambatan hari ini | Bagaimana Kawan Sehat membantu |
|---|---|---|---|---|
| **Dimas, 9 th**, siswa SD | Anak | Belajar kebiasaan sehat dengan cara yang menyenangkan | Bacaan kesehatan terlalu panjang dan kaku | Mode anak: cerita komik "Nyamuk Nakal", game *Susun Isi Piringku*, kuis, dan lencana |
| **Sinta, 15 th**, siswi SMP | Remaja | Tahu apakah jajanannya sehat, dan mana info yang benar | Info dari media sosial bercampur mitos | Kartu *Mitos vs Fakta*, cek gula/garam/lemak, IMT sesuai umur (bukan rumus dewasa) |
| **Raka, 17 th**, pelajar Tuli | Remaja + bahasa isyarat | Berobat tanpa bergantung pada orang lain untuk menerjemahkan | Tidak tahu apakah puskesmas punya juru bahasa isyarat | Slot video BISINDO + transkrip di setiap info, pemesanan juru bahasa isyarat saat ambil antrean, subtitle saat konsultasi online |
| **Bu Ratna, 34 th**, ibu rumah tangga | Dewasa | Mengurus kesehatan keluarga dengan cepat | Antre lama di puskesmas, bingung soal gizi anak | Antrean online, cek IMT anak dengan standar Kemenkes/WHO, rekap *Piringku Hari Ini* |
| **Mas Yoga, 28 th**, tunanetra | Dewasa + pembaca layar | Website yang bisa dipakai sepenuhnya dengan pembaca layar | Tombol tanpa label, gambar tanpa keterangan, popup yang menjebak fokus | Struktur semantik, label lengkap, fokus terkelola saat pindah halaman, pilihan "dokumen dibacakan" di antrean |
| **Mbah Sumarni, 67 th**, lansia, darah tinggi | Lansia (teks besar + suara) | Minum obat tepat waktu dan periksa rutin | Huruf kecil, terlalu banyak pilihan, takut salah tekan | Empat tombol besar, tombol "Dengarkan halaman ini", pengingat obat bergambar, antrean prioritas otomatis |

## 4. Solusi: satu sistem, empat cara bicara

### 4.1 Dua lapisan adaptasi

```
Lapisan 1 · PROFIL USIA            Lapisan 2 · PREFERENSI AKSES
(gaya konten)                      (bisa dipadukan dengan profil mana pun)
┌───────────┬───────────┐          ┌──────────────────────────────┐
│ Anak      │ Remaja    │    +     │ Teks besar / sangat besar    │
│ Dewasa    │ Lansia    │          │ Kontras tinggi               │
└───────────┴───────────┘          │ Bacakan teks (suara)         │
                                   │ Bahasa isyarat BISINDO       │
                                   │ Tampilan sederhana           │
                                   │ Kurangi animasi              │
                                   └──────────────────────────────┘
```

Profil lansia hanya berupa **pengaturan bawaan** (teks besar, suara, tampilan sederhana) yang tetap bisa diubah. Remaja Tuli bisa memakai profil remaja dengan bahasa isyarat, dan anak low vision bisa memakai profil anak dengan teks besar.

### 4.2 Fitur

| # | Fitur | Isi | Kriteria yang dijawab |
|---|---|---|---|
| 1 | **Mode Sesuai Usia** | Ilustrasi, warna, bahasa, tata letak, dan fitur menyesuaikan profil | Inovasi, relevansi tema |
| 2 | **Atur Akses** | Enam preferensi akses dengan pratinjau langsung | Aksesibilitas |
| 3 | **Tur & Tips Piko** | Panduan untuk setiap halaman, sesuai profil, plus tips di setiap langkah antrean | UX, pengguna awam teknologi |
| 4 | **Info Sehat Adaptif** | Satu topik (DBD) dalam 4 cara bicara, dengan sumber Kemenkes, tombol Dengarkan, dan BISINDO | Inovasi, melawan hoaks |
| 5 | **Antrean & Konsultasi Inklusif** | Juru bahasa isyarat, kursi roda, pendamping, antrean prioritas, subtitle, dokumen dibacakan | Manfaat nyata, implementasi |
| 6 | **Cek Gizi & Tubuh** | IMT dewasa, IMT menurut umur (5–18 th), AKG, nilai gizi makanan lokal, batas gula/garam/lemak | Manfaat jangka panjang, isu gizi nasional |
| 7 | **Pengingat Obat** | Jadwal bergambar (bentuk & warna obat) dan pengingat bersuara | Manfaat sehari-hari |
| 8 | **Darurat 119** | Selalu terlihat, panduan menelepon, dan **kartu bantuan** untuk orang yang sulit bicara atau Tuli | Keselamatan, inklusif |
| 9 | **Kuis & Lencana** | Gamifikasi edukasi untuk anak | Keterlibatan anak |
| 10 | **Tanya Piko** | Obrolan dengan Piko: menjawab soal kesehatan dan cara memakai website, mengarahkan ke halaman yang bersumber resmi, dan langsung menampilkan tombol 119 bila ada tanda gawat darurat. Piko tidak mendiagnosis atau memberi dosis obat. Anak cukup memilih pertanyaan siap pakai. Prototipe ini memakai jawaban contoh; AI menyusul | UX, aksesibilitas, keamanan informasi |

### 4.3 Contoh: satu informasi, empat cara bicara

| Profil | Kalimat |
|---|---|
| Anak | "Ia suka bertelur di air bersih yang diam, seperti di bak mandi, ember, dan vas bunga." |
| Remaja | "**Mitos:** Nyamuk DBD bertelur di got yang kotor. **Fakta:** Justru di air bersih." |
| Dewasa | "Tempat nyamuk berkembang biak: bak mandi/WC, tempayan, drum, vas bunga, barang bekas…" |
| Lansia | "Setiap minggu: kuras bak mandi, tutup tempat air, dan buang atau daur ulang barang bekas." |

Isi medis mengikuti Leaflet DBD 3M Plus Kementerian Kesehatan [9].

## 5. Nilai inovasi

1. **Komunikasi kesehatan adaptif.** Bukan sekadar "mode gelap" atau "ukuran huruf". Konten, bahasa, dan tata letak ikut berubah, dan semuanya digerakkan oleh **satu design system** (token warna, tipografi, bentuk), sehingga produk tetap konsisten dan mudah dirawat.
2. **Aksesibilitas yang berdiri sendiri, bukan diikat ke usia.** Lapisan akses terpisah dari profil, sehingga kombinasi seperti "remaja + bahasa isyarat" atau "anak + teks besar" tetap terlayani.
3. **Maskot sebagai pemandu yang aksesibel.** Tur Piko menawarkan, bukan memaksa. Setiap langkahnya bisa dijalankan dengan keyboard dan pembaca layar, dan tidak maju otomatis. Piko berdiri di tengah menu bawah (di desktop mengambang di kanan bawah). Mengetuknya memunculkan dua balon: **"Lihat Panduan"** membuka panduan untuk halaman yang sedang dibuka tanpa memindahkan pengguna ke halaman lain, dan **"Tanya Piko"** membuka obrolan.
4. **Kebutuhan khusus diminta sejak awal.** Juru bahasa isyarat, kursi roda, dan pendamping dipesan saat mengambil antrean, sehingga puskesmas bisa bersiap sebelum pasien datang.
5. **Kartu bantuan darurat.** Layar penuh bertuliskan besar "Saya butuh bantuan medis. Tolong teleponkan 119." untuk ditunjukkan ke orang terdekat.
6. **Cek gizi yang jujur secara ilmiah dan etis.** Usia 5–18 tahun memakai IMT menurut umur (WHO 2007, Permenkes 2/2020), bukan rumus dewasa. Mode anak dan remaja tidak menampilkan target kalori, dan bahasanya tidak menghakimi.

## 6. Keputusan desain

### 6.1 Gaya visual: Flat Design 2.0 dengan karakter per mode

| Profil | Karakter | Font judul | Palet utama |
|---|---|---|---|
| Anak | Flat ceria, garis tebal ala stiker, sudut sangat bulat | Fredoka | Biru langit, kuning, hijau, oranye |
| Remaja | *Neo-brutalism* lembut: garis tebal, bayangan offset | Plus Jakarta Sans 800 | Ungu, tosca, koral |
| Dewasa | Clean dinamis, ruang lega, bayangan halus | Plus Jakarta Sans | Hijau daun, krem, emas |
| Lansia | Flat jelas tanpa hiasan, tombol bergaris tepi tegas | Atkinson Hyperlegible | Hijau tua di atas krem terang (kontras ≥ 7:1) |

- **Hijau daun** dipakai sebagai warna utama (sehat dan tepercaya). **Emas** menjadi aksen, simbol *Indonesia Emas*.
- **Plus Jakarta Sans** adalah font karya foundry Indonesia. **Atkinson Hyperlegible** dirancang khusus untuk pembaca low vision.
- **Gaya yang sengaja tidak dipakai:**
  - *glassmorphism*: teks di atas latar buram sulit dibaca, dan efek blur berat di HP murah;
  - *neumorphism*: kontras tombol terlalu rendah;
  - *brutalism* murni: tampilannya mengintimidasi;
  - *claymorphism*: butuh render 3D yang berat.

### 6.2 Yang sengaja dibuat sama di semua mode
Logo, posisi tombol **Ganti tampilan**, **119**, dan **Piko** di tengah menu bawah, serta urutan langkah antrean. Tujuannya supaya orang yang salah memilih mode, atau cucu yang membantu neneknya, tetap tahu harus menekan apa.

## 7. Aksesibilitas (standar WCAG 2.2 AA)

| Aspek | Penerapan |
|---|---|
| Kontras | Semua pasangan teks/latar ≥ 4,5:1, ≥ 7:1 di profil lansia dan mode kontras tinggi. Batas komponen ≥ 3:1 |
| Ukuran target | Minimal 44 px, 56–96 px di profil lansia |
| Keyboard & fokus | Semua fitur bisa dipakai tanpa mouse. Garis fokus tebal. Saat pindah halaman, fokus pindah ke judul dan judul diumumkan. Fokus tidak tertutup header (`scroll-padding`) |
| Pembaca layar | Struktur heading, landmark, label form, pesan galat yang terhubung ke kolom, `aria-live` untuk hasil cek gizi dan nomor antrean |
| Tidak hanya warna | Status selalu disertai teks atau ikon, misalnya saklar "Aktif/Mati" dan "melebihi batas" |
| Gerak | Mengikuti `prefers-reduced-motion` dan pilihan "Kurangi animasi" |
| Reflow | Tidak ada scroll horizontal di lebar 360 px, bahkan saat teks diperbesar 150% |
| Bahasa | `lang="id"`, kalimat pendek, tanpa singkatan di profil lansia |
| Tuli & sulit bicara | Slot video BISINDO + transkrip, juru bahasa isyarat saat antrean, subtitle saat konsultasi, kartu bantuan darurat |

**Hasil pengujian prototipe:**
- Audit otomatis pa11y-ci (axe + HTML_CodeSniffer, WCAG 2 AA) di **60 halaman × profil**: 0 galat. Mode kontras tinggi + bahasa isyarat: **32/32 halaman lolos**.
- ESLint `jsx-a11y`: 0 galat.
- 16 tes otomatis perhitungan gizi lulus. Nilainya dicocokkan dengan tabel WHO dan Permenkes.
- Uji alur di Chrome: pembuka → tur → antrean → tiket, cek IMT, cek makanan, game, dan kuis berjalan tanpa galat.

## 8. Relevansi dengan Indonesia Emas 2045

- **SDM sehat dan unggul** adalah fondasi Indonesia Emas. Kawan Sehat menyasar kebiasaan sehat sejak anak-anak (gizi seimbang, pencegahan DBD) sampai lansia (minum obat teratur, periksa rutin).
- **Bonus demografi dan penuaan penduduk** terjadi bersamaan, jadi layanan digital harus bisa dipakai sekaligus oleh Gen Z dan kakek-neneknya.
- **Inklusi.** Ruang digital yang bermanfaat harus bisa dipakai penyandang disabilitas tanpa bantuan orang lain.
- **Literasi kesehatan melawan hoaks.** Setiap informasi mencantumkan sumber resmi dan tanggal ditinjau.

## 9. Potensi implementasi

**Teknologi.** Prototipe dibangun dengan teknologi web standar: React, React Aria (komponen aksesibel), dan CSS design token. Prototipe bisa langsung di-deploy sebagai website gratis (Vercel/Netlify) dan dikembangkan menjadi PWA.

**Tahap pengembangan:**
1. **Pilot di 1–3 puskesmas:**
   - integrasi jadwal poli dan nomor antrean asli;
   - perekaman video BISINDO bersama komunitas Tuli setempat;
   - uji pengguna dengan lansia, remaja, dan penyandang disabilitas.
2. **Integrasi data nasional:**
   - menghubungkan rekam kesehatan dan layanan 119 melalui ekosistem SATUSEHAT Kemenkes;
   - pengingat obat dan jadwal lewat WhatsApp/SMS untuk pengguna yang jarang membuka website.
3. **Perluasan:**
   - bahasa daerah;
   - mode offline (PWA) untuk daerah bersinyal lemah;
   - **Mode Pendamping**, supaya keluarga bisa menyiapkan pengaturan untuk orang tua atau anak.

**Calon mitra:** dinas kesehatan dan puskesmas, organisasi penyandang disabilitas (komunitas Tuli dan tunanetra), sekolah/UKS, posyandu, dan posbindu.

## 10. Batasan prototipe (dinyatakan terbuka)

- Nama puskesmas, nomor antrean, dan pesan SMS adalah **data contoh**. Prototipe tidak terhubung ke layanan sungguhan.
- Video BISINDO masih berupa **placeholder berlabel "Contoh"** + transkrip. Video asli perlu direkam bersama juru bahasa isyarat atau komunitas Tuli.
- Fitur suara memakai Web Speech API bawaan browser. Kualitas suara bahasa Indonesia bergantung pada perangkat.
- Nilai gizi makanan adalah nilai per satuan penukar dari Pedoman Gizi Seimbang. Makanan gorengan dihitung sebagai bahan + 1 sendok teh minyak (perkiraan).
- Hasil cek gizi bersifat edukasi dan **tidak menggantikan pemeriksaan tenaga kesehatan**.

## 11. Data gizi & kesehatan yang dipakai di aplikasi

| Data | Sumber resmi |
|---|---|
| Kategori IMT dewasa (Indonesia): < 17,0 · 17,0–< 18,5 · 18,5–25,0 · > 25,0–27,0 · > 27,0 | Permenkes 41/2014 Pedoman Gizi Seimbang [10] |
| IMT menurut umur 5–18 tahun (z-score, metode LMS) | WHO Growth Reference 2007 [11] + kategori Permenkes 2/2020 [12] |
| Angka Kecukupan Gizi per kelompok umur, jenis kelamin, hamil/menyusui | Permenkes 28/2019 [13] |
| Nilai gizi per porsi & ukuran rumah tangga (centong, potong, butir) | Daftar Bahan Makanan Penukar, Permenkes 41/2014 [10] |
| Batas gula 50 g, natrium 2.000 mg, lemak 67 g per hari | Permenkes 30/2013, dikutip dalam Pedoman Gizi Seimbang [10] |
| Proporsi Isi Piringku | Kemenkes [14] |
| Batas lingkar perut (> 90 cm laki-laki, > 80 cm perempuan) | Kemenkes, repositori BKPK [15] |
| DBD: gejala, tanda bahaya, 3M Plus | Leaflet DBD Kemenkes [9] |
| Layanan 119 (gawat darurat medis, bebas biaya) dan Halo Kemkes 1500-567 | Kemenkes [16] |

## Daftar pustaka

1. GoodStats, *Statistik Penduduk Lanjut Usia 2024* (BPS). https://goodstats.id/publication/statistik-penduduk-lanjut-usia-2024-yBzWG
2. Kompas, "Tantangan inklusivitas masih hambat penyandang disabilitas masuk dunia kerja" (23 Jan 2026). https://lestari.kompas.com/read/2026/01/23/211502586/tantangan-inklusivitas-masih-hambat-penyandang-disabilitas-masuk-dunia-kerja
3. detikInet, "Survei APJII: Pengguna Internet Indonesia 2025 Tembus 229 Juta Jiwa". https://inet.detik.com/telecommunication/d-8047759/survei-apjii-pengguna-internet-indonesia-2025-tembus-229-juta-jiwa · Bisnis.com. https://teknologi.bisnis.com/read/20250806/101/1899997/data-apjii-pengguna-internet-di-indonesia-tembus-22943-juta-orang-pada-2025
4. Antara, "Kemkomdigi identifikasi 1.923 konten hoaks sepanjang 2024". https://gorontalo.antaranews.com/berita/292006/kemkomdigi-identifikasi-1923-konten-hoaks-sepanjang-2024
5. Jurnal Pekommas (Komdigi). https://jkd.komdigi.go.id/index.php/pekommas/article/view/4176/1620
6. Jurnal Kesehatan Tambusai (mengutip Kemenkes RI). https://journal.universitaspahlawan.ac.id/index.php/jkt/article/download/52737/32298/189497
7. BKPK Kemenkes, "SSGI 2024: Prevalensi Stunting Nasional Turun Menjadi 19,8%". https://www.badankebijakan.kemkes.go.id/ssgi-2024-prevalensi-stunting-nasional-turun-menjadi-198/
8. Repositori Universitas Hasanuddin (mengutip SKI 2023). https://repository.unhas.ac.id/id/eprint/55903/2/K021221038-1-2.pdf
9. Kemenkes (Ayo Sehat), Leaflet DBD 3M Plus. https://ayosehat.kemkes.go.id/pub/files/files98493Leaflet%20DBD%203M.pdf
10. Permenkes No. 41 Tahun 2014 tentang Pedoman Gizi Seimbang. https://peraturan.bpk.go.id/Details/119080
11. WHO, Growth reference data for 5–19 years: BMI-for-age. https://www.who.int/tools/growth-reference-data-for-5to19-years/indicators/bmi-for-age
12. Permenkes No. 2 Tahun 2020 tentang Standar Antropometri Anak. https://regulasi.bkpk.kemkes.go.id/detail/a5d4abac-07fd-44df-8294-37f8f4cbb2a6/unduh
13. Permenkes No. 28 Tahun 2019 tentang Angka Kecukupan Gizi. https://peraturan.bpk.go.id/Details/138621
14. Kemenkes, "Kemenkes Pecahkan Rekor Dunia Isi Piringku". https://kemkes.go.id/id/kemenkes-pecahkan-rekor-dunia-isi-piringku
15. Repositori BKPK Kemenkes. https://repository.badankebijakan.kemkes.go.id/1320/1/121-323-1-PB.pdf
16. Kemenkes, "Layanan 119, Terobosan Baru Layanan Kegawatdaruratan Medik di Indonesia". https://www.kemkes.go.id/id/layanan-119-terobosan-baru-layanan-kegawatdaruratan-medik-di-indonesia

> Catatan untuk tim: angka bertanda "dikutip" berasal dari sumber sekunder. Bila sempat, cocokkan dengan publikasi resminya (BPS, APJII, laporan SKI 2023) sebelum dikumpulkan.

---

## Lampiran: tautan demo untuk juri

Tambahkan parameter berikut di alamat website untuk langsung melihat mode tertentu:

| Tautan | Yang ditampilkan |
|---|---|
| `/beranda?profil=anak` | Beranda anak |
| `/beranda?profil=remaja` | Beranda remaja |
| `/beranda?profil=lansia&teks=sangat-besar` | Lansia dengan teks 150% |
| `/info/dbd?profil=dewasa&isyarat=ya` | Info DBD dengan slot BISINDO |
| `/beranda?profil=dewasa&kontras=ya` | Mode kontras tinggi |
| `/cek-gizi/makanan?profil=anak` | Game *Susun Isi Piringku* |
| `/docs/user-flow.html` · `/docs/wireframe.html` | User flow & wireframe |
