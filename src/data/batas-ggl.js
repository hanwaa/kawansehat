// Batas konsumsi gula, natrium (garam), dan lemak per orang per hari.
// Sumber: Permenkes No. 30 Tahun 2013, sebagaimana dikutip Pedoman Gizi Seimbang (Permenkes 41/2014):
// "konsumsi gula lebih dari 50 g, natrium lebih dari 2000 mg (1 sendok teh) dan lemak/minyak total
// lebih dari 67 g per orang per hari akan meningkatkan risiko hipertensi, stroke, diabetes, dan serangan jantung."

export const BATAS_GGL = {
  gula: { label: 'Gula', batas: 50, satuan: 'g' },
  natrium: { label: 'Natrium (garam)', batas: 2000, satuan: 'mg' },
  lemak: { label: 'Lemak', batas: 67, satuan: 'g' },
}

// Proporsi Isi Piringku (Kemenkes): setengah piring makanan pokok + lauk pauk,
// setengah piring sayur + buah.
export const ISI_PIRINGKU = [
  { id: 'pokok', label: 'Makanan pokok', porsi: '2/3 dari setengah piring', fungsi: 'sumber karbohidrat (tenaga)' },
  { id: 'lauk', label: 'Lauk pauk', porsi: '1/3 dari setengah piring', fungsi: 'sumber protein (pertumbuhan)' },
  { id: 'sayur', label: 'Sayur', porsi: '2/3 dari setengah piring', fungsi: 'sumber vitamin dan mineral' },
  { id: 'buah', label: 'Buah', porsi: '1/3 dari setengah piring', fungsi: 'sumber vitamin dan mineral' },
]
