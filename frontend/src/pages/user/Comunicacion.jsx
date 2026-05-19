import { useEffect, useState } from 'react'
import { communicationsAPI } from '../../services/api'

export default function Comunicacion() {
  const [tab, setTab] = useState('anuncios')
  const [anuncios, setAnuncios] = useState([])
  const [recibidos, setRecibidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ destinatario: '', asunto: '', cuerpo: '' })

  const load = () => {
    setLoading(true)
    Promise.all([
      communicationsAPI.anuncios(),
      communicationsAPI.mensajesRecibidos(),
    ]).then(([a, m]) => {
      setAnuncios(a.data.results || a.data)
      setRecibidos(m.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const enviar = async (e) => {
    e.preventDefault()
    await communicationsAPI.enviarMensaje({ ...form, destinatario: parseInt(form.destinatario) })
    setShowForm(false)
    setForm({ destinatario: '', asunto: '', cuerpo: '' })
    load()
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <>
      <header className="page-header">
        <h1>Comunicación interna</h1>
        <p>Anuncios y mensajes del movimiento</p>
      </header>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button className={`btn ${tab === 'anuncios' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('anuncios')}>Anuncios</button>
        <button className={`btn ${tab === 'mensajes' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('mensajes')}>Mensajes</button>
        <button className="btn btn-gold" onClick={() => setShowForm(true)}>Nuevo mensaje</button>
      </div>
      {tab === 'anuncios' && (
        <div className="message-list">
          {anuncios.map((a) => (
            <div key={a.id} className="message-item">
              <div className="message-item-header">
                <strong>{a.titulo}</strong>
                {a.importante && <span className="badge badge-gold">Importante</span>}
              </div>
              <p>{a.contenido}</p>
              <small style={{ color: 'var(--color-text-muted)' }}>Por {a.autor_nombre}</small>
            </div>
          ))}
        </div>
      )}
      {tab === 'mensajes' && (
        <div className="message-list">
          {recibidos.map((m) => (
            <div key={m.id} className={`message-item${!m.leido ? ' unread' : ''}`}>
              <div className="message-item-header">
                <strong>{m.asunto}</strong>
                <time>{new Date(m.created_at).toLocaleDateString('es')}</time>
              </div>
              <p>De: {m.remitente_detalle?.full_name || m.remitente_detalle?.username}</p>
              <p>{m.cuerpo}</p>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Enviar mensaje</h2>
            <form onSubmit={enviar}>
              <div className="form-group">
                <label>ID destinatario</label>
                <input className="form-control" value={form.destinatario} onChange={(e) => setForm({ ...form, destinatario: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Asunto</label>
                <input className="form-control" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Mensaje</label>
                <textarea className="form-control" rows={4} value={form.cuerpo} onChange={(e) => setForm({ ...form, cuerpo: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
