import {
  LayoutDashboard,
  Users,
  BookOpen,
  ListChecks,
  Film,
  UsersRound,
  CreditCard,
  Megaphone,
} from 'lucide-react'
import PageTransitionOutlet from '../components/layout/PageTransitionOutlet'
import HubShell from '../components/layout/HubShell'

export const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Panel', shortLabel: 'Panel', end: true },
  { to: '/admin/usuarios', icon: Users, label: 'Usuarios y accesos', shortLabel: 'Usuarios' },
  { to: '/admin/modulos', icon: BookOpen, label: 'Módulos', shortLabel: 'Módulos' },
  { to: '/admin/preguntas', icon: ListChecks, label: 'Checklist', shortLabel: 'Checklist' },
  { to: '/admin/contenidos', icon: Film, label: 'Contenidos', shortLabel: 'Contenidos' },
  { to: '/admin/grupos', icon: UsersRound, label: 'Grupos', shortLabel: 'Grupos' },
  { to: '/admin/pagos', icon: CreditCard, label: 'Pagos', shortLabel: 'Pagos' },
  { to: '/admin/anuncios', icon: Megaphone, label: 'Anuncios', shortLabel: 'Anuncios' },
]

export default function AdminLayout() {
  return (
    <HubShell navItems={adminNavItems}>
      <PageTransitionOutlet />
    </HubShell>
  )
}
