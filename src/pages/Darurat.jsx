import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { HandHelping, Phone, PhoneCall, X } from 'lucide-react'
import Sumber from '../components/Sumber.jsx'
import { useJudulHalaman } from '../components/useJudulHalaman.js'
import { usePrefs } from '../prefs/PrefsProvider.jsx'
import './darurat.css'

export default function Darurat() {
  const { pilih } = usePrefs()
  useJudulHalaman('Darurat medis')

  return (
    <div className="wadah wadah--sempit darurat">
      <header className="judul-halaman">
        <h1>Darurat medis</h1>
        <p>
          {pilih({
            anak: 'Kalau ada yang sakit parah atau terluka, panggil orang dewasa terdekat dan telepon 119 bersama.',
            lansia: 'Tekan tombol merah untuk menelepon bantuan.',
            semua: 'Telepon 119 untuk layanan gawat darurat medis. Panggilan bebas biaya.',
          })}
        </p>
      </header>

      <a href="tel:119" className="tombol tombol--bahaya tombol-telepon">
        <PhoneCall aria-hidden="true" />
        <span>
          Telepon <strong>119</strong>
        </span>
      </a>
      <p className="bantuan darurat__ket">Layanan gawat darurat medis Kementerian Kesehatan. Bisa dari HP atau telepon rumah, bebas biaya.</p>

      <section className="kartu" aria-labelledby="judul-sampaikan">
        <h2 id="judul-sampaikan">Yang perlu disampaikan ke petugas</h2>
        <ol>
          <li>Nama Anda dan alamat lengkap, beserta patokan yang mudah dicari.</li>
          <li>Apa yang terjadi dan kapan.</li>
          <li>Kondisi orang yang sakit: sadar atau tidak, bernapas atau tidak.</li>
          <li>Nomor telepon yang bisa dihubungi kembali.</li>
        </ol>
        <p>Petugas 119 akan memandu tindakan awal sambil menunggu bantuan datang. Tetap tenang dan jangan tutup telepon sebelum diminta.</p>
      </section>

      <section className="kartu kartu--lembut" aria-labelledby="judul-kartu-bantuan">
        <h2 id="judul-kartu-bantuan">
          <HandHelping aria-hidden="true" /> Sulit bicara atau Tuli?
        </h2>
        <p>Tunjukkan kartu bantuan ke orang di dekat Anda supaya mereka meneleponkan 119.</p>
        <DialogTrigger>
          <Button className="tombol tombol--utama">Tampilkan kartu bantuan</Button>
          <ModalOverlay className="lapisan-dialog kartu-bantuan-lapisan" isDismissable>
            <Modal className="kartu-bantuan">
              <Dialog className="dialog">
                {({ close }) => (
                  <>
                    <Heading slot="title" className="kartu-bantuan__judul">
                      Saya butuh bantuan medis.
                    </Heading>
                    <p className="kartu-bantuan__teks">Tolong teleponkan 119.</p>
                    <p className="kartu-bantuan__teks kartu-bantuan__teks--kecil">
                      Saya Tuli atau sulit bicara. Mohon tulis pesan untuk saya.
                    </p>
                    <Button className="tombol tombol--besar" onPress={close}>
                      <X aria-hidden="true" /> Tutup kartu
                    </Button>
                  </>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      </section>

      <section className="kartu" aria-labelledby="judul-bukan-darurat">
        <h2 id="judul-bukan-darurat">
          <Phone aria-hidden="true" /> Bukan darurat?
        </h2>
        <p>
          Untuk pertanyaan atau pengaduan kesehatan, hubungi Halo Kemkes di <a href="tel:1500567">1500-567</a>.
        </p>
      </section>

      <Sumber ids={['layanan119']} />
    </div>
  )
}
