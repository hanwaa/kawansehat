import Maskot from '../illustrations/Maskot.jsx'
import './gelembung.css'

// Si Kawal berbicara lewat balon kata. Dipakai untuk sapaan, tips inline, dan layar sukses.
export default function Gelembung({ pose = 'lambai', ukuran = 104, kecil = false, children, className = '' }) {
  return (
    <div className={`gelembung ${kecil ? 'gelembung--kecil' : ''} ${className}`}>
      {/* key = pose: maskot dipasang ulang saat pose berganti sehingga geraknya diputar lagi di momen itu. */}
      <Maskot key={pose} pose={pose} ukuran={kecil ? 64 : ukuran} />
      <div className="gelembung__isi">{children}</div>
    </div>
  )
}
