import { useEffect, useState } from 'react'
import { groupsAPI } from '../../services/api'

export default function Grupos() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    groupsAPI.misGrupos().then((r) => setGrupos(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header">
        <h1>Grupos de Pastoreo</h1>
        <p>Tu comunidad de formación y acompañamiento</p>
      </header>
      {grupos.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">☘</div><p>Aún no perteneces a un grupo de pastoreo.</p></div>
      ) : (
        <div className="grid-2">
          {grupos.map((g) => (
            <div key={g.id} className="card">
              <h3 className="card-title">{g.nombre}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{g.descripcion}</p>
              <p><strong>Coordinador:</strong> {g.coordinador_nombre || '—'}</p>
              <p><strong>Reunión:</strong> {g.horario_reunion || 'Por definir'}</p>
              <p style={{ marginTop: '0.5rem' }}><span className="badge badge-sage">{g.total_miembros} miembros</span></p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
