import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/user/Dashboard'
import FichaPedagogica from './pages/user/FichaPedagogica'
import Contenidos from './pages/user/Contenidos'
import Videos from './pages/user/Videos'
import Grupos from './pages/user/Grupos'
import Comunicacion from './pages/user/Comunicacion'
import Perfil from './pages/user/Perfil'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminContenidos from './pages/admin/AdminContenidos'
import AdminPagos from './pages/admin/AdminPagos'
import AdminGrupos from './pages/admin/AdminGrupos'
import AdminAnuncios from './pages/admin/AdminAnuncios'
import './styles/layout.css'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/app" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/registro" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/app" element={<PrivateRoute><UserLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="ficha" element={<FichaPedagogica />} />
        <Route path="contenidos" element={<Contenidos />} />
        <Route path="videos" element={<Videos />} />
        <Route path="grupos" element={<Grupos />} />
        <Route path="comunicacion" element={<Comunicacion />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      <Route path="/admin" element={<PrivateRoute adminOnly><AdminLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="contenidos" element={<AdminContenidos />} />
        <Route path="pagos" element={<AdminPagos />} />
        <Route path="grupos" element={<AdminGrupos />} />
        <Route path="anuncios" element={<AdminAnuncios />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
