import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { pedagogiaAPI, communicationsAPI, groupsAPI } from '../../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [ficha, setFicha] = useState(null)
  const [anuncios, setAnuncios] = useState([])
  const [grupos, setGrupos] = useState([])
  const [noLeidos, setNoLeidos] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      pedagogiaAPI.miFicha().catch(() => null),
      communicationsAPI.anuncios().catch(() => ({ data: { results: [] } })),
      groupsAPI.misGrupos().catch(() => ({ data: [] })),
      communicationsAPI.noLeidos().catch(() => ({ data: { count: 0 } })),
    ]).then(([fichaRes, anunciosRes, gruposRes, leidosRes]) => {
      if (fichaRes) setFicha(fichaRes.data)
      const anunciosData = anunciosRes.data.results || anunciosRes.data
      setAnuncios(Array.isArray(anunciosData) ? anunciosData.slice(0, 3) : [])
      setGrupos(gruposRes.data.results || gruposRes.data || [])
      setNoLeidos(leidosRes.data.count || 0)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header">
        <h1>Paz y bien, {user?.first_name || user?.username}</h1>
        <p>Bienvenido a tu espacio de formación espiritual</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{ficha?.progreso_general ?? 0}%</div>
          <div className="stat-label">Progreso espiritual</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{grupos.length}</div>
          <div className="stat-label">Grupos de pastoreo</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{noLeidos}</div>
          <div className="stat-label">Mensajes sin leer</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{ficha?.etapa_actual_detalle?.nombre || '—'}</div>
          <div className="stat-label">Etapa actual</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Tu Ficha Pedagógica</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Continúa tu camino de formación espiritual.
          </p>
          <div className="progress-bar" style={{ marginBottom: '1rem' }}>
            <div className="progress-bar-fill" style={{ width: `${ficha?.progreso_general || 0}%` }} />
          </div>
          <Link to="/app/ficha" className="btn btn-primary btn-sm">Ver ficha completa</Link>
        </div>
        <div className="card">
          <h3 className="card-title">Accesos rápidos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <Link to="/app/videos">▶ Videos formativos</Link>
            <Link to="/app/contenidos">📖 Biblioteca de contenidos</Link>
            <Link to="/app/grupos">☘ Mis grupos de pastoreo</Link>
            <Link to="/app/comunicacion">✉ Comunicación ({noLeidos} nuevos)</Link>
          </div>
        </div>
      </div>

      {anuncios.length > 0 && (
        <div className="card">
          <h3 className="card-title">Anuncios recientes</h3>
          {anuncios.map((a) => (
            <div key={a.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <strong>{a.titulo}</strong>
              {a.importante && <span className="badge badge-gold" style={{ marginLeft: '0.5rem' }}>Importante</span>}
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                {a.contenido.substring(0, 120)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
