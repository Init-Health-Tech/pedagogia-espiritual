import { useEffect, useState } from 'react'
import { pedagogiaAPI } from '../../services/api'

export default function FichaPedagogica() {
  const [ficha, setFicha] = useState(null)
  const [etapas, setEtapas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([pedagogiaAPI.miFicha(), pedagogiaAPI.etapas()])
      .then(([f, e]) => { setFicha(f.data); setEtapas(e.data.results || e.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header">
        <h1>Ficha Pedagógica</h1>
        <p>Tu camino de formación y avance espiritual</p>
      </header>
      <div className="card">
        <div className="ficha-progress">
          <div className="ficha-progress-header">
            <h3>Progreso general</h3>
            <span>{ficha?.progreso_general || 0}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${ficha?.progreso_general || 0}%` }} />
          </div>
        </div>
        {ficha?.etapa_actual_detalle && (
          <p style={{ marginTop: '1rem' }}>Etapa actual: <strong>{ficha.etapa_actual_detalle.nombre}</strong></p>
        )}
        <div className="etapas-timeline">
          {etapas.map((etapa) => (
            <div key={etapa.id} className={`etapa-item${ficha?.etapa_actual === etapa.id ? ' active' : ''}`}>
              <div className="etapa-name">{etapa.nombre}</div>
            </div>
          ))}
        </div>
      </div>
      {ficha?.compromisos_espirituales && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 className="card-title">Compromisos espirituales</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{ficha.compromisos_espirituales}</p>
        </div>
      )}
      {ficha?.avances?.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 className="card-title">Historial de avances</h3>
          {ficha.avances.map((a) => (
            <div key={a.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <strong>{a.titulo}</strong> — {a.porcentaje}%
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{a.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
