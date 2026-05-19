import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/app', icon: '⌂', label: 'Inicio', end: true },
  { to: '/app/ficha', icon: '✦', label: 'Ficha Pedagógica' },
  { to: '/app/videos', icon: '▶', label: 'Videos' },
  { to: '/app/contenidos', icon: '📖', label: 'Contenidos' },
  { to: '/app/grupos', icon: '☘', label: 'Grupos de Pastoreo' },
  { to: '/app/comunicacion', icon: '✉', label: 'Comunicación' },
  { to: '/app/perfil', icon: '👤', label: 'Mi Perfil' },
]

export default function UserLayout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const initials = (user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Movimiento Franciscano</h2>
          <span>Pedagogía Espiritual — SST</span>
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
          {isAdmin && (
            <NavLink to="/admin" className="sidebar-link">
              <span className="icon">⚙</span>
              Administración
            </NavLink>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.full_name || user?.username}</div>
              <div className="sidebar-user-role">Miembro</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => { logout(); navigate('/') }}>
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
