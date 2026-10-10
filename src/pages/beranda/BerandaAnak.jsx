import { useRef } from 'react'
import { Link } from 'react-router'
import { Award, Star } from 'lucide-react'
import Gelembung from '../../components/Gelembung.jsx'
import ListenButton from '../../components/ListenButton.jsx'
import { NyamukNakal } from '../../illustrations/Adegan.jsx'
import IkonMakanan from '../../illustrations/IkonMakanan.jsx'
import { ambilLencana, LENCANA } from '../../lib/lencana.js'

export default function BerandaAnak() {
  const isi = useRef(null)
  const lencana = ambilLencana()

  return (
    <div className="wadah beranda beranda--anak" ref={isi}>
      <div className="beranda-anak__sapa">
        <Gelembung pose="lambai" ukuran={130}>
          <h1>Halo, teman! Mau belajar apa hari ini?</h1>
          <p>Pilih salah satu petualangan di bawah, ya.</p>
          <div data-tour="dengarkan" className="dengarkan-wadah">
            <ListenButton target={isi} label="Dengarkan" />
          </div>
        </Gelembung>
      </div>

      <ul className="petualangan" role="list">
        <li>
          <Link to="/info/dbd" className="kartu kartu--tautan petualangan__kartu petualangan__kartu--biru">
            <NyamukNakal className="petualangan__gambar" />
            <h2>Cerita Nyamuk Nakal</h2>
            <p>Kenalan dengan nyamuk demam berdarah dan cara mengusirnya.</p>
          </Link>
        </li>
        <li>
          <Link to="/cek-gizi/makanan" className="kartu kartu--tautan petualangan__kartu petualangan__kartu--hijau">
            <span className="petualangan__makanan" aria-hidden="true">
              <IkonMakanan nama="nasi" />
              <IkonMakanan nama="ikan" />
              <IkonMakanan nama="brokoli" />
              <IkonMakanan nama="pisang" />
            </span>
            <h2>Susun Isi Piringku</h2>
            <p>Isi piringmu dengan makanan sehat yang lengkap.</p>
          </Link>
        </li>
        <li data-tour="aksi-utama">
          <Link to="/kuis" className="kartu kartu--tautan petualangan__kartu petualangan__kartu--kuning">
            <span className="petualangan__bintang" aria-hidden="true">
              <Star />
              <Star />
              <Star />
            </span>
            <h2>Main Kuis</h2>
            <p>Jawab 3 pertanyaan dan dapatkan lencana Pemburu Jentik!</p>
          </Link>
        </li>
      </ul>

      <section className="kartu lencana-anak" aria-labelledby="judul-lencana">
        <h2 id="judul-lencana">
          <Award aria-hidden="true" /> Lencanaku
        </h2>
        {lencana.length === 0 ? (
          <p>Belum ada lencana. Yuk, ikut tur Si Kawal atau main kuis!</p>
        ) : (
          <ul className="lencana-anak__daftar">
            {lencana.map((id) => (
              <li key={id}>
                <span className="lencana-anak__ikon" aria-hidden="true">
                  <Award />
                </span>
                <span>
                  <strong>{LENCANA[id].nama}</strong>
                  <small>{LENCANA[id].ket}</small>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="catatan">
        <Star aria-hidden="true" />
        <p>
          Mau periksa ke dokter atau puskesmas? Ajak orang tua atau gurumu, ya.{' '}
          <Link to="/layanan/antrean">Untuk orang tua: ambil antrean</Link>
        </p>
      </div>
    </div>
  )
}
