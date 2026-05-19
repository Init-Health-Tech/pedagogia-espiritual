import { useEffect, useState } from 'react'
import { contentAPI } from '../../services/api'

const tipoIcon = { video: '▶', documento: '📄', presentacion: '📊', esquema: '📋', audio: '🎵' }

export default function Contenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentAPI.list().then((r) => setItems(r.data.results || r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header">
        <h1>Biblioteca de contenidos</h1>
        <p>Documentos, esquemas, presentaciones y materiales de formación</p>
      </header>
      {items.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📖</div><p>No hay contenidos disponibles.</p></div>
      ) : (
        <div className="grid-2">
          {items.map((c) => (
            <article key={c.id} className="content-card">
              <div className="content-card-thumb">{tipoIcon[c.tipo] || '📖'}</div>
              <div className="content-card-body">
                <h3>{c.titulo}</h3>
                <p>{c.descripcion}</p>
                <span className="badge badge-earth">{c.tipo}</span>
                {c.url_externa && <p style={{ marginTop: '0.5rem' }}><a href={c.url_externa} target="_blank" rel="noreferrer">Abrir →</a></p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
