// Lencana (badge) mode anak, disimpan hanya di browser pengguna.
const KUNCI = 'ks-lencana'

export const LENCANA = {
  penjelajah: { nama: 'Penjelajah Kawan Sehat', ket: 'Selesai jalan-jalan bersama Piko' },
  'pemburu-jentik': { nama: 'Pemburu Jentik', ket: 'Lulus kuis demam berdarah' },
  'piring-sehat': { nama: 'Jagoan Piring Sehat', ket: 'Berhasil menyusun Isi Piringku' },
}

export function ambilLencana() {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI) || '[]')
    return Array.isArray(data) ? data.filter((id) => LENCANA[id]) : []
  } catch {
    return []
  }
}

export function beriLencana(id) {
  const ada = ambilLencana()
  if (ada.includes(id)) return false
  try {
    localStorage.setItem(KUNCI, JSON.stringify([...ada, id]))
  } catch {
    // Penyimpanan tidak tersedia: lencana hanya berlaku sampai halaman ditutup.
  }
  return true
}
