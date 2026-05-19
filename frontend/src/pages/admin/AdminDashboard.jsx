import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, contentAPI, paymentsAPI } from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, contenidos: 0, pagos: 0 })

  useEffect(() => {
    Promise.all([
      adminAPI.users(),
      contentAPI.list(),
      paymentsAPI.pagos(),
    ]).then(([u, c, p]) => {
      setStats({
        users: (u.data.results || u.data).length,
        contenidos: (c.data.results || c.data).length,
        pagos: (p.data.results || p.data).length,
      })
    })
  }, [])

  return (
    <>
      <header className="page-header">
        <h1>Panel de Administración</h1>
        <p>Gestión integral de la plataforma MFST</p>
      </header>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{stats.users}</div><div className="stat-label">Usuarios</div></div>
        <div className="stat-card"><div className="stat-value">{stats.contenidos}</div><div className="stat-label">Contenidos</div></div>
        <div className="stat-card"><div className="stat-value">{stats.pagos}</div><div className="stat-label">Pagos registrados</div></div>
      </div>
      <div className="grid-2">
        <Link to="/admin/usuarios" className="card" style={{ textDecoration: 'none' }}><h3>👥 Usuarios y accesos</h3><p style={{ color: 'var(--color-text-muted)' }}>Gestionar miembros y permisos</p></Link>
        <Link to="/admin/contenidos" className="card" style={{ textDecoration: 'none' }}><h3>📚 Contenidos</h3><p style={{ color: 'var(--color-text-muted)' }}>Videos, documentos y presentaciones</p></Link>
        <Link to="/admin/pagos" className="card" style={{ textDecoration: 'none' }}><h3>💳 Pagos</h3><p style={{ color: 'var(--color-text-muted)' }}>Suscripciones y pagos</p></Link>
        <Link to="/admin/grupos" className="card" style={{ textDecoration: 'none' }}><h3>☘ Grupos</h3><p style={{ color: 'var(--color-text-muted)' }}>Grupos de pastoreo</p></Link>
        <Link to="/admin/anuncios" className="card" style={{ textDecoration: 'none' }}><h3>📢 Anuncios</h3><p style={{ color: 'var(--color-text-muted)' }}>Comunicación interna</p></Link>
      </div>
    </>
  )
}
