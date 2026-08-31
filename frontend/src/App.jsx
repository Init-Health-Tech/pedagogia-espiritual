import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { getHomeRoute } from './utils/routes'
import LoadingScreen from './components/common/LoadingScreen'
import CambiarContrasena from './pages/CambiarContrasena'
import MarketingLayout from './layouts/MarketingLayout'
import HomePage from './pages/marketing/HomePage'
import ContactPage from './pages/marketing/ContactPage'
import PedagogiaPage from './pages/marketing/PedagogiaPage'
import FormacionPage from './pages/marketing/FormacionPage'
import ItinerarioPage from './pages/marketing/ItinerarioPage'
import NuestraHistoriaPage from './pages/marketing/NuestraHistoriaPage'
import Login from './pages/Login'
import Register from './pages/Register'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import CoordinatorLayout from './layouts/CoordinatorLayout'
import Dashboard from './pages/user/Dashboard'
import FichaPedagogica from './pages/user/FichaPedagogica'
import FichaEspiritual from './pages/user/FichaEspiritual'
import Contenidos from './pages/user/Contenidos'
import Grupos from './pages/user/Grupos'
import Comunicacion from './pages/user/Comunicacion'
import Perfil from './pages/user/Perfil'
import CoordinatorSeguimiento from './pages/coordinator/Seguimiento'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminUsuarioProgreso from './pages/admin/AdminUsuarioProgreso'
import AdminContenidos from './pages/admin/AdminContenidos'
import AdminPagos from './pages/admin/AdminPagos'
import AdminGrupos from './pages/admin/AdminGrupos'
import AdminAnuncios from './pages/admin/AdminAnuncios'
import AdminModulos from './pages/admin/AdminModulos'
import AdminPreguntas from './pages/admin/AdminPreguntas'

function PrivateRoute({ children, adminOnly = false, coordinatorOnly = false }) {
  const { user, loading, isAdmin, isCoordinator } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (user.must_change_password && location.pathname !== '/cambiar-contrasena') {
    return <Navigate to="/cambiar-contrasena" replace />
  }
  if (adminOnly && !isAdmin) return <Navigate to={getHomeRoute(user)} replace />
  if (coordinatorOnly && !isCoordinator && !isAdmin) return <Navigate to={getHomeRoute(user)} replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user?.must_change_password) return <Navigate to="/cambiar-contrasena" replace />
  if (user) return <Navigate to={getHomeRoute(user)} replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/nuestra-historia" element={<NuestraHistoriaPage />} />
        <Route path="/movimiento" element={<Navigate to="/" replace />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/pedagogia-espiritual" element={<PedagogiaPage />} />
        <Route path="/formacion" element={<FormacionPage />} />
        <Route path="/itinerario" element={<ItinerarioPage />} />
      </Route>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/registro" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/cambiar-contrasena" element={<PrivateRoute><CambiarContrasena /></PrivateRoute>} />

      <Route path="/app" element={<PrivateRoute><UserLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="ficha" element={<FichaPedagogica />} />
        <Route path="ficha-espiritual" element={<FichaEspiritual />} />
        <Route path="contenidos" element={<Contenidos />} />
        <Route path="grupos" element={<Grupos />} />
        <Route path="comunicacion" element={<Comunicacion />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      <Route path="/coord" element={<PrivateRoute coordinatorOnly><CoordinatorLayout /></PrivateRoute>}>
        <Route index element={<CoordinatorSeguimiento />} />
        <Route path="diarios" element={<CoordinatorSeguimiento />} />
      </Route>

      <Route path="/admin" element={<PrivateRoute adminOnly><AdminLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/admin/usuarios" replace />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="usuarios/:userId" element={<AdminUsuarioProgreso />} />
        <Route path="contenidos" element={<AdminContenidos />} />
        <Route path="pagos" element={<AdminPagos />} />
        <Route path="grupos" element={<AdminGrupos />} />
        <Route path="anuncios" element={<AdminAnuncios />} />
        <Route path="modulos" element={<AdminModulos />} />
        <Route path="preguntas" element={<AdminPreguntas />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
