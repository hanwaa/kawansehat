import { useId } from 'react'
import { FieldError, Label, Radio, RadioGroup } from 'react-aria-components'
import { AlertCircle, Check } from 'lucide-react'

// Kolom isian angka dengan label, satuan, bantuan, dan pesan galat yang terhubung ke input.
export function KolomAngka({ label, satuan, nilai, onChange, galat, bantuan, wajib = true, ...rest }) {
  const id = useId()
  const idBantuan = `${id}-bantuan`
  const idGalat = `${id}-galat`
  const dijelaskan = [bantuan && idBantuan, galat && idGalat].filter(Boolean).join(' ') || undefined
  return (
    <div className="kolom">
      <label className="label" htmlFor={id}>
        {label}
        {!wajib && <span className="teks-redup"> (boleh dikosongkan)</span>}
      </label>
      {bantuan && (
        <p className="bantuan" id={idBantuan}>
          {bantuan}
        </p>
      )}
      <div className="input-satuan">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={nilai}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={galat ? true : undefined}
          aria-describedby={dijelaskan}
          aria-required={wajib || undefined}
          {...rest}
        />
        {satuan && <span aria-hidden="true">{satuan}</span>}
      </div>
      {galat && (
        <p className="galat" id={idGalat}>
          <AlertCircle aria-hidden="true" width="18" height="18" /> {galat}
        </p>
      )}
    </div>
  )
}

export function PilihanRadio({ label, nilai, onChange, pilihan, galat, kisi = false, orientasi = 'vertical', isDisabled = false }) {
  return (
    <RadioGroup
      value={nilai || null}
      onChange={onChange}
      isInvalid={Boolean(galat)}
      isDisabled={isDisabled}
      orientation={orientasi}
      className="kolom"
    >
      <Label className="label">{label}</Label>
      <div className={`pilihan-grup ${kisi ? 'pilihan-grup--kisi' : ''}`}>
        {pilihan.map((p) => (
          <Radio key={p.id} value={p.id} className="pilihan">
            <span className="pilihan__tanda" aria-hidden="true">
              <Check />
            </span>
            <span className="pilihan__isi">
              {p.label}
              {p.ket && <small>{p.ket}</small>}
            </span>
          </Radio>
        ))}
      </div>
      <FieldError className="galat">
        <AlertCircle aria-hidden="true" width="18" height="18" /> {galat}
      </FieldError>
    </RadioGroup>
  )
}

export const PILIHAN_JK = [
  { id: 'laki', label: 'Laki-laki' },
  { id: 'perempuan', label: 'Perempuan' },
]
