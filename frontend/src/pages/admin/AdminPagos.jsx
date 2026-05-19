import { useEffect, useState } from 'react'
import { paymentsAPI } from '../../services/api'

export default function AdminPagos() {
  const [pagos, setPagos] = useState([])
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([paymentsAPI.pagos(), paymentsAPI.planes()])
      .then(([p, pl]) => { setPagos(p.data.results || p.data); setPlanes(pl.data.results || pl.data) })
      .finally(() => setLoading(false))
  }, [])

  const confirmar = async (id) => {
    await paymentsAPI.confirmarPago(id)
    const r = await paymentsAPI.pagos()
    setPagos(r.data.results || r.data)
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header"><h1>Pagos y suscripciones</h1></header>
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {planes.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.nombre}</h3>
            <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>${p.precio}</p>
            <p style={{ color: 'var(--color-text-muted)' }}>{p.duracion_meses} meses</p>
          </div>
        ))}
      </div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Usuario</th><th>Monto</th><th>Método</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id}>
                <td>{p.usuario_detalle?.full_name || p.usuario}</td>
                <td>${p.monto}</td><td>{p.metodo}</td>
                <td><span className={`badge badge-${p.estado === 'completado' ? 'sage' : 'gold'}`}>{p.estado}</span></td>
                <td>{p.estado === 'pendiente' && <button className="btn btn-sm btn-primary" onClick={() => confirmar(p.id)}>Confirmar</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
