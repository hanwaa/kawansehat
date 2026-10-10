import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { Type, X } from 'lucide-react'
import AksesKontrol from './AksesKontrol.jsx'
import ProfilPilihan from './ProfilPilihan.jsx'

// Tombol "Ganti tampilan" di header: profil + preferensi akses.
export default function ModeSwitcher() {
  return (
    <DialogTrigger>
      <Button className="tombol tombol--kepala" data-tour="ganti-tampilan" aria-label="Ganti tampilan">
        <Type aria-hidden="true" />
        <span>Tampilan</span>
      </Button>
      <ModalOverlay className="lapisan-dialog" isDismissable>
        <Modal className="modal">
          <Dialog className="dialog">
            {({ close }) => (
              <>
                <div className="dialog__kepala">
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
