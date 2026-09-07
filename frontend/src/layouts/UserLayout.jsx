import { useState } from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Users,
  MessageCircle,
} from 'lucide-react'
import { useMediaQuery, useTheme } from '@mui/material'
import PageTransitionOutlet from '../components/layout/PageTransitionOutlet'
import HubShell from '../components/layout/HubShell'
import HelpFab from '../components/help/HelpFab'
import MemberGuidedTour from '../components/help/MemberGuidedTour'
import { NAV_TOUR_STEPS } from '../components/help/tourSteps'

export const userNavItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Inicio', shortLabel: 'Inicio', tourId: 'inicio', end: true },
  { to: '/app/ficha', icon: ClipboardList, label: 'Mi camino', shortLabel: 'Camino', tourId: 'camino' },
  { to: '/app/contenidos', icon: BookOpen, label: 'Contenidos', shortLabel: 'Contenidos', tourId: 'contenidos' },
  { to: '/app/grupos', icon: Users, label: 'Grupos de pastoreo', shortLabel: 'Grupos', tourId: 'grupos' },
  { to: '/app/comunicacion', icon: MessageCircle, label: 'Comunicación', shortLabel: 'Mensajes', tourId: 'mensajes' },
]

export default function UserLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [tourOpen, setTourOpen] = useState(false)

  return (
    <HubShell navItems={userNavItems}>
      <PageTransitionOutlet />
      <HelpFab
        variant="member"
        aboveDock={isMobile}
        onStartTour={() => setTourOpen(true)}
      />
      <MemberGuidedTour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={NAV_TOUR_STEPS}
      />
    </HubShell>
  )
}
