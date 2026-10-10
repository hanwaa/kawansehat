import { SUMBER } from '../data/sumber.js'

export default function Sumber({ ids, judul = 'Sumber' }) {
  return (
    <div className="sumber">
      <strong>{judul}:</strong>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <a href={SUMBER[id].url} target="_blank" rel="noreferrer">
              {SUMBER[id].judul}
              <span className="visual-tersembunyi"> (membuka tab baru)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
