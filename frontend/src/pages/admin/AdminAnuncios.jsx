import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AdminAnuncios() {
  const [anuncios, setAnuncios] = useState([])
  const [form, setForm] = useState({ titulo: '', contenido: '', es_global: true, importante: false })
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/communications/anuncios/').then((r) => setAnuncios(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await api.post('/communications/anuncios/', form)
    setForm({ titulo: '', contenido: '', es_global: true, importante: false })
    load()
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header"><h1>Anuncios</h1><p>Comunicación interna del movimiento</p></header>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Nuevo anuncio</h3>
        <form onSubmit={crear}>
          <div className="form-group"><label>Título</label><input className="form-control" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required /></div>
          <div className="form-group"><label>Contenido</label><textarea className="form-control" rows={4} value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} required /></div>
          <label style={{ marginRight: '1rem' }}><input type="checkbox" checked={form.es_global} onChange={(e) => setForm({ ...form, es_global: e.target.checked })} /> Global</label>
          <label><input type="checkbox" checked={form.importante} onChange={(e) => setForm({ ...form, importante: e.target.checked })} /> Importante</label>
          <div style={{ marginTop: '1rem' }}><button type="submit" className="btn btn-primary">Publicar</button></div>
        </form>
      </div>
      <div className="message-list">
        {anuncios.map((a) => (
          <div key={a.id} className="message-item">
            <strong>{a.titulo}</strong> {a.importante && <span className="badge badge-gold">Importante</span>}
            <p>{a.contenido}</p>
          </div>
        ))}
      </div>
    </>
  )
}
