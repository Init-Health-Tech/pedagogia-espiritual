import { useEffect, useState } from 'react'
import { groupsAPI } from '../../services/api'

export default function AdminGrupos() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nombre: '', descripcion: '', horario_reunion: '' })

  const load = () => groupsAPI.list().then((r) => setGrupos(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await groupsAPI.create(form)
    setForm({ nombre: '', descripcion: '', horario_reunion: '' })
    load()
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header"><h1>Grupos de Pastoreo</h1></header>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Nuevo grupo</h3>
        <form onSubmit={crear}>
          <div className="form-group"><label>Nombre</label><input className="form-control" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></div>
          <div className="form-group"><label>Descripción</label><textarea className="form-control" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></div>
          <div className="form-group"><label>Horario</label><input className="form-control" value={form.horario_reunion} onChange={(e) => setForm({ ...form, horario_reunion: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary">Crear grupo</button>
        </form>
      </div>
      <div className="grid-2">
        {grupos.map((g) => (
          <div key={g.id} className="card">
            <h3>{g.nombre}</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>{g.descripcion}</p>
            <p><strong>Miembros:</strong> {g.total_miembros}</p>
            <p><strong>Horario:</strong> {g.horario_reunion}</p>
          </div>
        ))}
      </div>
    </>
  )
}
