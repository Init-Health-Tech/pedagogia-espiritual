import { useEffect, useState } from 'react'
import { contentAPI } from '../../services/api'

export default function AdminContenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ titulo: '', descripcion: '', tipo: 'video', url_externa: '', es_publico: false })

  const load = () => contentAPI.list().then((r) => setItems(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await contentAPI.create(form)
    setForm({ titulo: '', descripcion: '', tipo: 'video', url_externa: '', es_publico: false })
    load()
  }

  const eliminar = async (id) => {
    if (confirm('¿Eliminar contenido?')) { await contentAPI.delete(id); load() }
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header"><h1>Gestión de contenidos</h1></header>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Nuevo contenido</h3>
        <form onSubmit={crear}>
          <div className="grid-2">
            <div className="form-group"><label>Título</label><input className="form-control" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required /></div>
            <div className="form-group"><label>Tipo</label>
              <select className="form-control" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                <option value="video">Video</option><option value="documento">Documento</option>
                <option value="presentacion">Presentación</option><option value="esquema">Esquema</option>
              </select>
            </div>
          </div>
          <div className="form-group"><label>Descripción</label><textarea className="form-control" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></div>
          <div className="form-group"><label>URL externa</label><input className="form-control" value={form.url_externa} onChange={(e) => setForm({ ...form, url_externa: e.target.value })} /></div>
          <label><input type="checkbox" checked={form.es_publico} onChange={(e) => setForm({ ...form, es_publico: e.target.checked })} /> Público</label>
          <div style={{ marginTop: '1rem' }}><button type="submit" className="btn btn-primary">Crear</button></div>
        </form>
      </div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Título</th><th>Tipo</th><th>Público</th><th>Acciones</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}><td>{c.titulo}</td><td>{c.tipo}</td><td>{c.es_publico ? 'Sí' : 'No'}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => eliminar(c.id)}>Eliminar</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
