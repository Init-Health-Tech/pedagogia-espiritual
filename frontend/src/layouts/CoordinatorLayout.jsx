import { Users, ClipboardList } from 'lucide-react'
import PageTransitionOutlet from '../components/layout/PageTransitionOutlet'
import HubShell from '../components/layout/HubShell'

export const coordinatorNavItems = [
  { to: '/coord', icon: Users, label: 'Seguimiento', shortLabel: 'Seguimiento', end: true },
  { to: '/coord/diarios', icon: ClipboardList, label: 'Diarios', shortLabel: 'Diarios' },
]

export default function CoordinatorLayout() {
  return (
    <HubShell navItems={coordinatorNavItems}>
      <PageTransitionOutlet />
    </HubShell>
  )
}
