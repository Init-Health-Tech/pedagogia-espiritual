import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AnimatedPage from '../common/AnimatedPage'

export default function PageTransitionOutlet() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage key={location.pathname}>
        <Outlet />
      </AnimatedPage>
    </AnimatePresence>
  )
}
