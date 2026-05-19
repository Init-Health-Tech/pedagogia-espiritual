#!/usr/bin/env python3
import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'pages')

PAGES = {
'user/Videos.jsx': r'''import { useEffect, useState } from 'react'
import { contentAPI } from '../../services/api'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentAPI.videos().then((r) => setVideos(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header">
        <h1>Videos formativos</h1>
        <p>Material audiovisual para tu formación espiritual</p>
      </header>
      {videos.length === 0 ? (
        <DIV className="empty-state"><DIV className="empty-state-icon">▶</DIV><p>No hay videos disponibles.</p></DIV>
      ) : (
        <DIV className="grid-2">
          {videos.map((v) => (
            <article key={v.id} className="content-card">
              <DIV className="content-card-thumb">▶</DIV>
              <DIV className="content-card-body">
                <h3>{v.titulo}</h3>
                <p>{v.descripcion}</p>
                {v.url_externa && (
                  <DIV style={{ marginTop: '1rem', position: 'relative', paddingBottom: '56.25%' }}>
                    <iframe
                      title={v.titulo}
                      src={v.url_externa}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                      allowFullScreen
                    />
                  </DIV>
                )}
              </DIV>
            </article>
          ))}
        </DIV>
      )}
    </>
  )
}
''',

'user/Contenidos.jsx': r'''import { useEffect, useState } from 'react'
import { contentAPI } from '../../services/api'

const tipoIcon = { video: '▶', documento: '📄', presentacion: '📊', esquema: '📋', audio: '🎵' }

export default function Contenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentAPI.list().then((r) => setItems(r.data.results || r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header">
        <h1>Biblioteca de contenidos</h1>
        <p>Documentos, esquemas, presentaciones y materiales de formación</p>
      </header>
      {items.length === 0 ? (
        <DIV className="empty-state"><DIV className="empty-state-icon">📖</DIV><p>No hay contenidos disponibles.</p></DIV>
      ) : (
        <DIV className="grid-2">
          {items.map((c) => (
            <article key={c.id} className="content-card">
              <DIV className="content-card-thumb">{tipoIcon[c.tipo] || '📖'}</DIV>
              <DIV className="content-card-body">
                <h3>{c.titulo}</h3>
                <p>{c.descripcion}</p>
                <span className="badge badge-earth">{c.tipo}</span>
                {c.url_externa && <p style={{ marginTop: '0.5rem' }}><a href={c.url_externa} target="_blank" rel="noreferrer">Abrir →</a></p>}
              </DIV>
            </article>
          ))}
        </DIV>
      )}
    </>
  )
}
''',

'user/Grupos.jsx': r'''import { useEffect, useState } from 'react'
import { groupsAPI } from '../../services/api'

export default function Grupos() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    groupsAPI.misGrupos().then((r) => setGrupos(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header">
        <h1>Grupos de Pastoreo</h1>
        <p>Tu comunidad de formación y acompañamiento</p>
      </header>
      {grupos.length === 0 ? (
        <DIV className="empty-state"><DIV className="empty-state-icon">☘</DIV><p>Aún no perteneces a un grupo de pastoreo.</p></DIV>
      ) : (
        <DIV className="grid-2">
          {grupos.map((g) => (
            <DIV key={g.id} className="card">
              <h3 className="card-title">{g.nombre}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{g.descripcion}</p>
              <p><strong>Coordinador:</strong> {g.coordinador_nombre || '—'}</p>
              <p><strong>Reunión:</strong> {g.horario_reunion || 'Por definir'}</p>
              <p style={{ marginTop: '0.5rem' }}><span className="badge badge-sage">{g.total_miembros} miembros</span></p>
            </DIV>
          ))}
        </DIV>
      )}
    </>
  )
}
''',

'user/Comunicacion.jsx': r'''import { useEffect, useState } from 'react'
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

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header">
        <h1>Comunicación interna</h1>
        <p>Anuncios y mensajes del movimiento</p>
      </header>
      <DIV style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button className={`btn ${tab === 'anuncios' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('anuncios')}>Anuncios</button>
        <button className={`btn ${tab === 'mensajes' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('mensajes')}>Mensajes</button>
        <button className="btn btn-gold" onClick={() => setShowForm(true)}>Nuevo mensaje</button>
      </DIV>
      {tab === 'anuncios' && (
        <DIV className="message-list">
          {anuncios.map((a) => (
            <DIV key={a.id} className="message-item">
              <DIV className="message-item-header">
                <strong>{a.titulo}</strong>
                {a.importante && <span className="badge badge-gold">Importante</span>}
              </DIV>
              <p>{a.contenido}</p>
              <small style={{ color: 'var(--color-text-muted)' }}>Por {a.autor_nombre}</small>
            </DIV>
          ))}
        </DIV>
      )}
      {tab === 'mensajes' && (
        <DIV className="message-list">
          {recibidos.map((m) => (
            <DIV key={m.id} className={`message-item${!m.leido ? ' unread' : ''}`}>
              <DIV className="message-item-header">
                <strong>{m.asunto}</strong>
                <time>{new Date(m.created_at).toLocaleDateString('es')}</time>
              </DIV>
              <p>De: {m.remitente_detalle?.full_name || m.remitente_detalle?.username}</p>
              <p>{m.cuerpo}</p>
            </DIV>
          ))}
        </DIV>
      )}
      {showForm && (
        <DIV className="modal-overlay" onClick={() => setShowForm(false)}>
          <DIV className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Enviar mensaje</h2>
            <form onSubmit={enviar}>
              <DIV className="form-group">
                <label>ID destinatario</label>
                <input className="form-control" value={form.destinatario} onChange={(e) => setForm({ ...form, destinatario: e.target.value })} required />
              </DIV>
              <DIV className="form-group">
                <label>Asunto</label>
                <input className="form-control" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} required />
              </DIV>
              <DIV className="form-group">
                <label>Mensaje</label>
                <textarea className="form-control" rows={4} value={form.cuerpo} onChange={(e) => setForm({ ...form, cuerpo: e.target.value })} required />
              </DIV>
              <DIV className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Enviar</button>
              </DIV>
            </form>
          </DIV>
        </DIV>
      )}
    </>
  )
}
''',

'user/Perfil.jsx': r'''import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'

export default function Perfil() {
  const { user, fetchUser } = useAuth()
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.updateMe(form)
      await fetchUser()
      setMsg('Perfil actualizado correctamente')
    } catch {
      setMsg('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>Mi Perfil</h1>
        <p>Datos personales de tu cuenta</p>
      </header>
      {msg && <DIV className="alert alert-success">{msg}</DIV>}
      <DIV className="card" style={{ maxWidth: '560px' }}>
        <form onSubmit={handleSubmit}>
          <DIV className="form-group">
            <label>Nombre</label>
            <input className="form-control" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </DIV>
          <DIV className="form-group">
            <label>Apellido</label>
            <input className="form-control" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </DIV>
          <DIV className="form-group">
            <label>Correo</label>
            <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </DIV>
          <DIV className="form-group">
            <label>Teléfono</label>
            <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </DIV>
          <DIV className="form-group">
            <label>Biografía</label>
            <textarea className="form-control" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </DIV>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </DIV>
    </>
  )
}
''',

'admin/AdminDashboard.jsx': r'''import { useEffect, useState } from 'react'
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
      <DIV className="stats-grid">
        <DIV className="stat-card"><DIV className="stat-value">{stats.users}</DIV><DIV className="stat-label">Usuarios</DIV></DIV>
        <DIV className="stat-card"><DIV className="stat-value">{stats.contenidos}</DIV><DIV className="stat-label">Contenidos</DIV></DIV>
        <DIV className="stat-card"><DIV className="stat-value">{stats.pagos}</DIV><DIV className="stat-label">Pagos registrados</DIV></DIV>
      </DIV>
      <DIV className="grid-2">
        <Link to="/admin/usuarios" className="card" style={{ textDecoration: 'none' }}><h3>👥 Usuarios y accesos</h3><p style={{ color: 'var(--color-text-muted)' }}>Gestionar miembros y permisos</p></Link>
        <Link to="/admin/contenidos" className="card" style={{ textDecoration: 'none' }}><h3>📚 Contenidos</h3><p style={{ color: 'var(--color-text-muted)' }}>Videos, documentos y presentaciones</p></Link>
        <Link to="/admin/pagos" className="card" style={{ textDecoration: 'none' }}><h3>💳 Pagos</h3><p style={{ color: 'var(--color-text-muted)' }}>Suscripciones y pagos</p></Link>
        <Link to="/admin/grupos" className="card" style={{ textDecoration: 'none' }}><h3>☘ Grupos</h3><p style={{ color: 'var(--color-text-muted)' }}>Grupos de pastoreo</p></Link>
        <Link to="/admin/anuncios" className="card" style={{ textDecoration: 'none' }}><h3>📢 Anuncios</h3><p style={{ color: 'var(--color-text-muted)' }}>Comunicación interna</p></Link>
      </DIV>
    </>
  )
}
''',

'admin/AdminUsuarios.jsx': r'''import { useEffect, useState } from 'react'
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

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header">
        <h1>Usuarios y accesos</h1>
        <p>Administración de miembros de la plataforma</p>
      </header>
      <DIV className="card table-wrap">
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
      </DIV>
    </>
  )
}
''',

'admin/AdminContenidos.jsx': r'''import { useEffect, useState } from 'react'
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

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header"><h1>Gestión de contenidos</h1></header>
      <DIV className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Nuevo contenido</h3>
        <form onSubmit={crear}>
          <DIV className="grid-2">
            <DIV className="form-group"><label>Título</label><input className="form-control" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required /></DIV>
            <DIV className="form-group"><label>Tipo</label>
              <select className="form-control" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                <option value="video">Video</option><option value="documento">Documento</option>
                <option value="presentacion">Presentación</option><option value="esquema">Esquema</option>
              </select>
            </DIV>
          </DIV>
          <DIV className="form-group"><label>Descripción</label><textarea className="form-control" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></DIV>
          <DIV className="form-group"><label>URL externa</label><input className="form-control" value={form.url_externa} onChange={(e) => setForm({ ...form, url_externa: e.target.value })} /></DIV>
          <label><input type="checkbox" checked={form.es_publico} onChange={(e) => setForm({ ...form, es_publico: e.target.checked })} /> Público</label>
          <DIV style={{ marginTop: '1rem' }}><button type="submit" className="btn btn-primary">Crear</button></DIV>
        </form>
      </DIV>
      <DIV className="card table-wrap">
        <table>
          <thead><tr><th>Título</th><th>Tipo</th><th>Público</th><th>Acciones</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}><td>{c.titulo}</td><td>{c.tipo}</td><td>{c.es_publico ? 'Sí' : 'No'}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => eliminar(c.id)}>Eliminar</button></td></tr>
            ))}
          </tbody>
        </table>
      </DIV>
    </>
  )
}
''',

'admin/AdminPagos.jsx': r'''import { useEffect, useState } from 'react'
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

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header"><h1>Pagos y suscripciones</h1></header>
      <DIV className="grid-3" style={{ marginBottom: '2rem' }}>
        {planes.map((p) => (
          <DIV key={p.id} className="card">
            <h3>{p.nombre}</h3>
            <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>${p.precio}</p>
            <p style={{ color: 'var(--color-text-muted)' }}>{p.duracion_meses} meses</p>
          </DIV>
        ))}
      </DIV>
      <DIV className="card table-wrap">
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
      </DIV>
    </>
  )
}
''',

'admin/AdminGrupos.jsx': r'''import { useEffect, useState } from 'react'
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

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header"><h1>Grupos de Pastoreo</h1></header>
      <DIV className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Nuevo grupo</h3>
        <form onSubmit={crear}>
          <DIV className="form-group"><label>Nombre</label><input className="form-control" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></DIV>
          <DIV className="form-group"><label>Descripción</label><textarea className="form-control" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></DIV>
          <DIV className="form-group"><label>Horario</label><input className="form-control" value={form.horario_reunion} onChange={(e) => setForm({ ...form, horario_reunion: e.target.value })} /></DIV>
          <button type="submit" className="btn btn-primary">Crear grupo</button>
        </form>
      </DIV>
      <DIV className="grid-2">
        {grupos.map((g) => (
          <DIV key={g.id} className="card">
            <h3>{g.nombre}</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>{g.descripcion}</p>
            <p><strong>Miembros:</strong> {g.total_miembros}</p>
            <p><strong>Horario:</strong> {g.horario_reunion}</p>
          </DIV>
        ))}
      </DIV>
    </>
  )
}
''',

'admin/AdminAnuncios.jsx': r'''import { useEffect, useState } from 'react'
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

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header"><h1>Anuncios</h1><p>Comunicación interna del movimiento</p></header>
      <DIV className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Nuevo anuncio</h3>
        <form onSubmit={crear}>
          <DIV className="form-group"><label>Título</label><input className="form-control" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required /></DIV>
          <DIV className="form-group"><label>Contenido</label><textarea className="form-control" rows={4} value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} required /></DIV>
          <label style={{ marginRight: '1rem' }}><input type="checkbox" checked={form.es_global} onChange={(e) => setForm({ ...form, es_global: e.target.checked })} /> Global</label>
          <label><input type="checkbox" checked={form.importante} onChange={(e) => setForm({ ...form, importante: e.target.checked })} /> Importante</label>
          <DIV style={{ marginTop: '1rem' }}><button type="submit" className="btn btn-primary">Publicar</button></DIV>
        </form>
      </DIV>
      <DIV className="message-list">
        {anuncios.map((a) => (
          <DIV key={a.id} className="message-item">
            <strong>{a.titulo}</strong> {a.importante && <span className="badge badge-gold">Importante</span>}
            <p>{a.contenido}</p>
          </DIV>
        ))}
      </DIV>
    </>
  )
}
''',

'user/FichaPedagogica.jsx': r'''import { useEffect, useState } from 'react'
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

  if (loading) return <DIV className="loading"><DIV className="spinner" /></DIV>

  return (
    <>
      <header className="page-header">
        <h1>Ficha Pedagógica</h1>
        <p>Tu camino de formación y avance espiritual</p>
      </header>
      <DIV className="card">
        <DIV className="ficha-progress">
          <DIV className="ficha-progress-header">
            <h3>Progreso general</h3>
            <span>{ficha?.progreso_general || 0}%</span>
          </DIV>
          <DIV className="progress-bar">
            <DIV className="progress-bar-fill" style={{ width: `${ficha?.progreso_general || 0}%` }} />
          </DIV>
        </DIV>
        {ficha?.etapa_actual_detalle && (
          <p style={{ marginTop: '1rem' }}>Etapa actual: <strong>{ficha.etapa_actual_detalle.nombre}</strong></p>
        )}
        <DIV className="etapas-timeline">
          {etapas.map((etapa) => (
            <DIV key={etapa.id} className={`etapa-item${ficha?.etapa_actual === etapa.id ? ' active' : ''}`}>
              <DIV className="etapa-name">{etapa.nombre}</DIV>
            </DIV>
          ))}
        </DIV>
      </DIV>
      {ficha?.compromisos_espirituales && (
        <DIV className="card" style={{ marginTop: '1.5rem' }}>
          <h3 className="card-title">Compromisos espirituales</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{ficha.compromisos_espirituales}</p>
        </DIV>
      )}
      {ficha?.avances?.length > 0 && (
        <DIV className="card" style={{ marginTop: '1.5rem' }}>
          <h3 className="card-title">Historial de avances</h3>
          {ficha.avances.map((a) => (
            <DIV key={a.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <strong>{a.titulo}</strong> — {a.porcentaje}%
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{a.descripcion}</p>
            </DIV>
          ))}
        </DIV>
      )}
    </>
  )
}
''',
}

for rel, content in PAGES.items():
    content = content.replace('DIV', 'div')
    path = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print('wrote', rel)
