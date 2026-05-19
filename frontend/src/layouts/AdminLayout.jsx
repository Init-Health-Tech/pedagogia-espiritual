import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/admin', icon: '⌂', label: 'Panel', end: true },
  { to: '/admin/usuarios', icon: '👥', label: 'Usuarios y accesos' },
  { to: '/admin/contenidos', icon: '📚', label: 'Contenidos' },
  { to: '/admin/grupos', icon: '☘', label: 'Grupos' },
  { to: '/admin/pagos', icon: '💳', label: 'Pagos' },
  { to: '/admin/anuncios', icon: '📢', label: 'Anuncios' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = (user?.first_name?.[0] || user?.username?.[0] || 'A').toUpperCase()

  return (
    <div className="app-layout">
      <aside className="sidebar sidebar-admin">
        <div className="sidebar-header">
          <h2>Administración</h2>
          <span>MFST — Panel de control</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/app" className="sidebar-link">
            <span className="icon">↩</span>
            Vista de miembro
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.full_name || user?.username}</div>
              <div className="sidebar-user-role">Administrador</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', color: 'var(--color-cream)', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => { logout(); navigate('/') }}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="main-content">
        <div className="main-content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
