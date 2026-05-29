import PageTransitionOutlet from '../components/layout/PageTransitionOutlet'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import AppShell from '../components/layout/AppShell'

const navItems = [
  { to: '/admin', icon: <DashboardOutlinedIcon />, label: 'Panel', end: true },
  { to: '/admin/usuarios', icon: <PeopleOutlinedIcon />, label: 'Usuarios y accesos' },
  { to: '/admin/modulos', icon: <LibraryBooksOutlinedIcon />, label: 'Módulos (manuales)' },
  { to: '/admin/preguntas', icon: <ChecklistOutlinedIcon />, label: 'Checklist' },
  { to: '/admin/contenidos', icon: <VideoLibraryOutlinedIcon />, label: 'Contenidos' },
  { to: '/admin/grupos', icon: <GroupsOutlinedIcon />, label: 'Grupos' },
  { to: '/admin/pagos', icon: <PaymentsOutlinedIcon />, label: 'Pagos' },
  { to: '/admin/anuncios', icon: <CampaignOutlinedIcon />, label: 'Anuncios' },
]

const footerItems = [
  { to: '/app', icon: <ArrowBackOutlinedIcon />, label: 'Vista de miembro' },
]

export default function AdminLayout() {
  return (
    <AppShell
      variant="admin"
      title="Administración"
      subtitle="Panel de control MFST"
      navItems={navItems}
      footerItems={footerItems}
    >
      <PageTransitionOutlet />
    </AppShell>
  )
}
