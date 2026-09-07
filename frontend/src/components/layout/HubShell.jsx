import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import TopBar from './TopBar'
import PillNav from './PillNav'
import { TOP_BAR_HEIGHT_REM, DOCK_HEIGHT_REM } from '../../theme/muiTheme'
import { communicationsAPI } from '../../services/api'

/** Altura aproximada del PillNav desktop (en rem, escala con el texto) */
const DESKTOP_PILL_NAV_REM = 3.5

export default function HubShell({ navItems, children }) {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [notificationCount, setNotificationCount] = useState(0)

  const currentItem = navItems.find((item) =>
    item.end
      ? location.pathname === item.to
      : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`),
  )
  const sectionTitle = currentItem?.label || 'Inicio'

  useEffect(() => {
    communicationsAPI.noLeidos()
      .then((res) => setNotificationCount(res.data.count || 0))
      .catch(() => {})
  }, [location.pathname])

  const topPad = isMobile
    ? `calc(${TOP_BAR_HEIGHT_REM}rem + 1.5rem)`
    : `calc(${TOP_BAR_HEIGHT_REM + DESKTOP_PILL_NAV_REM}rem + 3rem)`
  const bottomPad = isMobile
    ? `calc(${DOCK_HEIGHT_REM}rem + 1.5rem)`
    : '3rem'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <TopBar sectionTitle={sectionTitle} notificationCount={notificationCount} />

      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: `${TOP_BAR_HEIGHT_REM}rem`,
            left: 0,
            right: 0,
            zIndex: (t) => t.zIndex.appBar - 1,
          }}
        >
          <PillNav items={navItems} />
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: topPad,
          pb: bottomPad,
          px: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          {children}
        </Box>
      </Box>

      {isMobile && <PillNav items={navItems} />}
    </Box>
  )
}
