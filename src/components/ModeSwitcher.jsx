import { useState } from 'react'
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { Type, X } from 'lucide-react'
import AksesKontrol from './AksesKontrol.jsx'
import ProfilPilihan from './ProfilPilihan.jsx'
import { useLembar } from './useLembar.js'

// Tombol "Ganti tampilan" di header: profil + preferensi akses.
// Di HP dialognya menjadi lembar yang bisa ditarik turun; Tutup, Selesai, dan Esc juga menutup lewat pegas.
export default function ModeSwitcher() {
  const [buka, setBuka] = useState(false)
  const { pasang: pasangLembar, onOpenChange: gantiBuka } = useLembar({ onOpenChange: setBuka })

  return (
    <DialogTrigger isOpen={buka} onOpenChange={gantiBuka}>
      <Button className="tombol tombol--kepala" data-tour="ganti-tampilan" aria-label="Ganti tampilan">
        <Type aria-hidden="true" />
        <span>Tampilan</span>
      </Button>
      <ModalOverlay className="lapisan-dialog" isDismissable>
        <Modal ref={pasangLembar} className="modal">
          <Dialog className="dialog">
            {({ close }) => (
              <>
                <div className="dialog__kepala" data-pegangan>
                  <Heading slot="title">Ganti tampilan</Heading>
                  <Button className="tombol tombol--teks" onPress={close} aria-label="Tutup">
                    <X aria-hidden="true" />
                  </Button>
                </div>
                <p className="teks-redup">Perubahan langsung terlihat dan tersimpan di perangkat ini.</p>
                <div className="tumpuk">
                  <ProfilPilihan ringkas label="Siapa yang memakai?" />
                  <AksesKontrol />
                </div>
                <div className="dialog__kaki">
                  <Button className="tombol tombol--utama" onPress={close}>
                    Selesai
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
