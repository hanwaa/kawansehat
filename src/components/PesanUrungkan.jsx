import { Button } from 'react-aria-components'
import { Undo2 } from 'lucide-react'
import './pesan-urungkan.css'

// Pesan setelah sebuah aksi (misalnya menghapus), dengan tombol Urungkan bila aksinya bisa dibalik. Kesalahan
// kecil lebih ramah diurungkan daripada dikonfirmasi dulu; dialog konfirmasi disimpan untuk aksi yang tidak bisa
// dibalik. Region status selalu ada supaya pembaca layar mengumumkannya; kotaknya tampil hanya saat ada pesan.
export default function PesanUrungkan({ kabar, onUrungkan, refTombol }) {
  return (
    <div className={kabar ? 'pesan-urungkan' : 'visual-tersembunyi'} data-tidak-dibaca>
      <p role="status" className="pesan-urungkan__teks">
        {kabar?.pesan}
      </p>
      {kabar?.bisaUrungkan && (
        <Button ref={refTombol} className="tombol tombol--teks" onPress={onUrungkan}>
          <Undo2 aria-hidden="true" /> Urungkan
        </Button>
      )}
    </div>
  )
}
