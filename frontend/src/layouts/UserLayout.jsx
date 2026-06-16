import {
  LayoutDashboard,
  ClipboardList,
  PlayCircle,
  BookOpen,
  Users,
  MessageCircle,
} from 'lucide-react'
import PageTransitionOutlet from '../components/layout/PageTransitionOutlet'
import HubShell from '../components/layout/HubShell'

export const userNavItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Inicio', shortLabel: 'Inicio', end: true },
  { to: '/app/ficha', icon: ClipboardList, label: 'Mi camino', shortLabel: 'Camino' },
  { to: '/app/videos', icon: PlayCircle, label: 'Videos', shortLabel: 'Videos' },
  { to: '/app/contenidos', icon: BookOpen, label: 'Contenidos', shortLabel: 'Contenidos' },
  { to: '/app/grupos', icon: Users, label: 'Grupos de pastoreo', shortLabel: 'Grupos' },
  { to: '/app/comunicacion', icon: MessageCircle, label: 'Comunicación', shortLabel: 'Mensajes' },
]

export default function UserLayout() {
  return (
    <HubShell navItems={userNavItems}>
      <PageTransitionOutlet />
    </HubShell>
  )
}
