import { useEffect, useState } from 'react'
import { contentAPI } from '../../services/api'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentAPI.videos().then((r) => setVideos(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header">
        <h1>Videos formativos</h1>
        <p>Material audiovisual para tu formación espiritual</p>
      </header>
      {videos.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">▶</div><p>No hay videos disponibles.</p></div>
      ) : (
        <div className="grid-2">
          {videos.map((v) => (
            <article key={v.id} className="content-card">
              <div className="content-card-thumb">▶</div>
              <div className="content-card-body">
                <h3>{v.titulo}</h3>
                <p>{v.descripcion}</p>
                {v.url_externa && (
                  <div style={{ marginTop: '1rem', position: 'relative', paddingBottom: '56.25%' }}>
                    <iframe
                      title={v.titulo}
                      src={v.url_externa}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
