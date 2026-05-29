import PageTransitionOutlet from '../components/layout/PageTransitionOutlet'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AppShell from '../components/layout/AppShell'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/app', icon: <DashboardOutlinedIcon />, label: 'Inicio', end: true },
  { to: '/app/ficha', icon: <AssignmentOutlinedIcon />, label: 'Ficha pedagógica' },
  { to: '/app/videos', icon: <PlayCircleOutlinedIcon />, label: 'Videos' },
  { to: '/app/contenidos', icon: <MenuBookOutlinedIcon />, label: 'Contenidos' },
  { to: '/app/grupos', icon: <GroupsOutlinedIcon />, label: 'Grupos de pastoreo' },
  { to: '/app/comunicacion', icon: <MailOutlinedIcon />, label: 'Comunicación' },
  { to: '/app/perfil', icon: <PersonOutlinedIcon />, label: 'Mi perfil' },
]

export default function UserLayout() {
  const { isAdmin } = useAuth()
  const footerItems = isAdmin
    ? [{ to: '/admin', icon: <SettingsOutlinedIcon />, label: 'Administración' }]
    : []

  return (
    <AppShell
      variant="user"
      title="Movimiento Franciscano"
      subtitle="Pedagogía Espiritual — SST"
      navItems={navItems}
      footerItems={footerItems}
    >
      <PageTransitionOutlet />
    </AppShell>
  )
}
