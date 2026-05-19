import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'

export default function AdminUsuarios() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.users().then((r) => setUsers(r.data.results || r.data)).finally(() => setLoading(false))
  }, [])

  const toggle = async (id) => {
    await adminAPI.toggleActive(id)
    const r = await adminAPI.users()
    setUsers(r.data.results || r.data)
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header">
        <h1>Usuarios y accesos</h1>
        <p>Administración de miembros de la plataforma</p>
      </header>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.full_name}</td>
                <td><span className="badge badge-earth">{u.role}</span></td>
                <td>{u.is_active_member ? <span className="badge badge-sage">Activo</span> : <span className="badge badge-burgundy">Inactivo</span>}</td>
                <td><button className="btn btn-sm btn-secondary" onClick={() => toggle(u.id)}>Toggle acceso</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
