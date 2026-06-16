import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import TopBar from './TopBar'
import PillNav from './PillNav'
import { TOP_BAR_HEIGHT, DOCK_HEIGHT } from '../../theme/muiTheme'
import { communicationsAPI } from '../../services/api'

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

  const topOffset = TOP_BAR_HEIGHT + (isMobile ? 0 : 56)
  const bottomOffset = isMobile ? DOCK_HEIGHT : 0

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <TopBar sectionTitle={sectionTitle} notificationCount={notificationCount} />

      {!isMobile && (
        <Box sx={{ position: 'fixed', top: TOP_BAR_HEIGHT, left: 0, right: 0, zIndex: (t) => t.zIndex.appBar - 1 }}>
          <PillNav items={navItems} />
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: `${topOffset + (isMobile ? 24 : 48)}px`,
          pb: `${bottomOffset + (isMobile ? 24 : 48)}px`,
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
