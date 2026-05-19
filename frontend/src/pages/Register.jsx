import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password_confirm: '',
    first_name: '', last_name: '', phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/accounts/register/', form)
      navigate('/login', { state: { message: 'Cuenta creada. Inicia sesión.' } })
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'object') {
        const msgs = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        setError(msgs.join(' | '))
      } else {
        setError('Error al registrar. Verifique los datos.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <h1>Registro</h1>
        <p className="auth-subtitle">Únete al camino de formación espiritual</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input className="form-control" name="first_name" value={form.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input className="form-control" name="last_name" value={form.last_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Usuario</label>
            <input className="form-control" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input className="form-control" type="password" name="password_confirm" value={form.password_confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
