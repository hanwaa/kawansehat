import { Link } from 'react-router'
import { AlertTriangle, Bug, CalendarCheck, Droplets, Hospital, ShieldCheck, Thermometer } from 'lucide-react'
import { IkonDaurUlang, IkonKuras, IkonTutup, NyamukNakal } from '../../illustrations/Adegan.jsx'

// Topik Demam Berdarah Dengue (DBD) dalam empat cara bicara.
// Isi medis mengikuti Leaflet DBD 3M Plus Kemenkes (ayosehat.kemkes.go.id).

export const DBD = {
  id: 'dbd',
  sumber: ['dbd'],
  ditinjau: 'Oktober 2026',
  judul: {
    anak: 'Cerita Nyamuk Nakal',
    remaja: 'DBD: Mitos vs Fakta',
    dewasa: 'Demam Berdarah Dengue (DBD)',
    lansia: 'Waspada Demam Berdarah',
  },
  ringkasan: {
    anak: 'Kenalan dengan nyamuk demam berdarah dan cara mengusirnya.',
    remaja: 'Bongkar mitos soal DBD dan kenali tanda bahayanya.',
    dewasa: 'Gejala, tanda bahaya, pertolongan pertama, dan pencegahan 3M Plus.',
    lansia: 'Hal penting tentang demam berdarah, singkat dan jelas.',
  },
  transkrip: {
    anak: 'Nyamuk demam berdarah berwarna hitam dengan belang putih. Ia bertelur di air bersih yang diam. Ayo kuras, tutup, dan daur ulang. Kalau badanmu panas tinggi, bilang ke orang tua.',
    remaja: 'Nyamuk DBD menggigit pagi sampai sore dan bertelur di air bersih. Kenali gejala dan tanda bahaya, lalu cegah dengan 3M Plus setiap minggu.',
    dewasa: 'DBD disebabkan virus dengue yang ditularkan nyamuk Aedes aegypti. Kenali gejala awal dan tanda bahaya. Segera ke fasilitas kesehatan bila muncul tanda bahaya. Cegah dengan 3M Plus setiap minggu.',
    lansia: 'Kalau panas tinggi tidak turun, segera ke puskesmas. Kuras dan tutup tempat air setiap minggu.',
  },
}

const TIGA_M = [
  { Ikon: IkonKuras, judul: 'Menguras', teks: 'tempat-tempat penampungan air' },
  { Ikon: IkonTutup, judul: 'Menutup', teks: 'rapat semua tempat penampungan air' },
  { Ikon: IkonDaurUlang, judul: 'Mendaur ulang', teks: 'barang bekas yang bisa menampung air' },
]

const PLUS = [
  'Memelihara ikan pemakan jentik nyamuk',
  'Menggunakan obat anti nyamuk',
  'Memasang kawat kasa pada jendela dan ventilasi',
  'Tidak menggantung pakaian di dalam kamar',
  'Menaburkan bubuk larvasida pada penampungan air',
]

function TigaM({ judulLevel = 'h3' }) {
  const H = judulLevel
  return (
    <ul className="tiga-m" role="list">
      {TIGA_M.map(({ Ikon, judul, teks }) => (
        <li key={judul} className="tiga-m__item">
          <Ikon className="tiga-m__gambar" />
          <H>{judul}</H>
          <p>{teks}</p>
        </li>
      ))}
    </ul>
  )
}

export function DBDAnak() {
  return (
    <>
      <ol className="komik" role="list">
        <li className="komik__panel komik__panel--biru">
          <NyamukNakal className="komik__gambar" />
          <p>
            Ini <strong>Nyamuk Nakal</strong>. Badannya hitam dengan belang-belang putih.
          </p>
        </li>
        <li className="komik__panel komik__panel--kuning">
          <Droplets aria-hidden="true" className="komik__ikon" />
          <p>Ia suka bertelur di air bersih yang diam, seperti di bak mandi, ember, dan vas bunga.</p>
        </li>
        <li className="komik__panel komik__panel--merah">
          <Thermometer aria-hidden="true" className="komik__ikon" />
          <p>Kalau menggigit, bisa bikin demam berdarah. Badan jadi panas tinggi dan lemas.</p>
        </li>
      </ol>
      <h2>Ayo usir dengan 3M!</h2>
      <TigaM />
      <div className="catatan">
        <AlertTriangle aria-hidden="true" />
        <p>
          <strong>Kalau badanmu panas tinggi, segera bilang ke orang tua atau guru, ya!</strong>
        </p>
      </div>
      <Link to="/kuis" className="tombol tombol--utama tombol--besar">
        Main kuis nyamuk
      </Link>
    </>
  )
}

const MITOS = [
  {
    mitos: 'DBD cuma muncul pas musim hujan.',
    fakta: 'Nyamuk DBD bisa berkembang biak selama ada air bersih yang tergenang, misalnya di bak mandi, vas bunga, atau botol bekas. Jadi tetap waspada sepanjang tahun.',
  },
  { mitos: 'Nyamuk DBD menggigit malam hari.', fakta: 'Nyamuk Aedes aegypti aktif menggigit pagi sampai sore hari.' },
  {
    mitos: 'Nyamuk DBD bertelur di got yang kotor.',
    fakta: 'Justru di air bersih. Nyamuk DBD tidak berkembang biak di selokan, got, atau kolam yang airnya langsung berhubungan dengan tanah.',
  },
]

export function DBDRemaja() {
  return (
    <>
      <ul className="mitos-daftar" role="list">
        {MITOS.map((m) => (
          <li key={m.mitos} className="kartu mitos">
            <p className="mitos__baris">
              <span className="mitos__label mitos__label--mitos">Mitos</span>
              <span>{m.mitos}</span>
            </p>
            <p className="mitos__baris">
              <span className="mitos__label mitos__label--fakta">Fakta</span>
              <span>{m.fakta}</span>
            </p>
          </li>
        ))}
      </ul>
      <div className="kisi kisi--2">
        <section className="kartu">
          <h2>
            <Thermometer aria-hidden="true" /> Gejala awal
          </h2>
          <ul>
            <li>Panas tinggi mendadak selama 2–7 hari</li>
            <li>Lemas dan lesu</li>
            <li>Bintik-bintik merah di kulit</li>
            <li>Nyeri di ulu hati</li>
          </ul>
        </section>
        <section className="kartu kartu--bahaya">
          <h2>
            <AlertTriangle aria-hidden="true" /> Tanda bahaya
          </h2>
          <ul>
            <li>Mimisan atau perdarahan di bawah kulit</li>
            <li>Muntah atau buang air besar berdarah</li>
            <li>Gelisah, tangan dan kaki dingin, berkeringat</li>
          </ul>
          <p>
            <strong>Langsung ke puskesmas atau IGD.</strong> Kasih tahu orang tua atau wali.
          </p>
        </section>
      </div>
      <h2>Cegah dengan 3M Plus, setiap minggu</h2>
      <TigaM />
    </>
  )
}

export function DBDDewasa() {
  return (
    <>
      <section>
        <h2>
          <Bug aria-hidden="true" /> Apa itu DBD?
        </h2>
        <p>
          Demam berdarah dengue adalah penyakit yang disebabkan virus dengue dan ditularkan melalui gigitan nyamuk{' '}
          <em>Aedes aegypti</em>. Penyakit ini dapat menyebabkan kematian bila terlambat ditangani.
        </p>
      </section>
      <div className="kisi kisi--2">
        <section className="kartu">
          <h2>
            <Thermometer aria-hidden="true" /> Gejala awal
          </h2>
          <ul>
            <li>Mendadak panas tinggi selama 2–7 hari</li>
            <li>Tampak lemah dan lesu</li>
            <li>Timbul bintik-bintik merah pada kulit</li>
            <li>Sering terasa nyeri di ulu hati</li>
          </ul>
        </section>
        <section className="kartu kartu--bahaya">
          <h2>
            <AlertTriangle aria-hidden="true" /> Tanda bahaya
          </h2>
          <ul>
            <li>Perdarahan di hidung (mimisan) atau di bawah kulit</li>
            <li>Muntah darah atau buang air besar berdarah</li>
            <li>Gelisah, tangan dan kaki dingin, serta berkeringat</li>
          </ul>
          <p>
            <strong>Segera bawa ke fasilitas kesehatan.</strong> Bila tidak segera ditolong, DBD dapat menyebabkan
            kematian.
          </p>
        </section>
      </div>
      <section>
        <h2>
          <Hospital aria-hidden="true" /> Bila muncul gejala awal
        </h2>
        <ul>
          <li>Beri minum sebanyak mungkin.</li>
          <li>Kompres agar panas turun.</li>
          <li>Berikan obat penurun panas sesuai anjuran tenaga kesehatan.</li>
          <li>Periksakan ke puskesmas, terutama bila panas tinggi tidak turun.</li>
        </ul>
      </section>
      <section>
        <h2>
          <ShieldCheck aria-hidden="true" /> Pencegahan: 3M Plus setiap minggu
        </h2>
        <TigaM judulLevel="h3" />
        <h3>Plus</h3>
        <ul>
          {PLUS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>
          <Droplets aria-hidden="true" /> Tempat nyamuk berkembang biak
        </h2>
        <ul>
          <li>Bak mandi/WC, tempayan, drum</li>
          <li>Tempat minum burung, vas bunga, pot tanaman air</li>
          <li>Kaleng, ban, dan botol bekas, tempurung kelapa, plastik yang dibuang sembarangan</li>
          <li>Talang air yang rusak, saluran air hujan yang tidak lancar</li>
          <li>Pagar atau potongan bambu yang berlubang</li>
        </ul>
      </section>
    </>
  )
}

const POIN_LANSIA = [
  { Ikon: Bug, teks: 'Demam berdarah menular lewat gigitan nyamuk.' },
  { Ikon: Thermometer, teks: 'Kalau panas tinggi tidak turun, segera ke puskesmas.' },
  { Ikon: AlertTriangle, teks: 'Segera ke rumah sakit bila mimisan, muntah darah, atau tangan dan kaki dingin.', bahaya: true },
  { Ikon: Droplets, teks: 'Saat demam, minum air yang banyak.' },
  { Ikon: CalendarCheck, teks: 'Setiap minggu: kuras bak mandi, tutup tempat air, dan buang atau daur ulang barang bekas.' },
]

export function DBDLansia() {
  return (
    <ul className="poin-besar" role="list">
      {POIN_LANSIA.map(({ Ikon, teks, bahaya }) => (
        <li key={teks} className={`poin-besar__item ${bahaya ? 'poin-besar__item--bahaya' : ''}`}>
          <Ikon aria-hidden="true" />
          <p>{teks}</p>
        </li>
      ))}
    </ul>
  )
}

export const VARIAN_DBD = { anak: DBDAnak, remaja: DBDRemaja, dewasa: DBDDewasa, lansia: DBDLansia }
