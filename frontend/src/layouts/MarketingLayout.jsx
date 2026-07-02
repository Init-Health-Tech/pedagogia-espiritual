import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import MarketingNav from '../components/landing/MarketingNav'
import MarketingFooter from '../components/landing/MarketingFooter'
import { scrollToHash } from '../utils/marketingNav'
import { colors } from '../theme/muiTheme'

export default function MarketingLayout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => scrollToHash(hash), 0)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
    return undefined
  }, [pathname, hash])

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: colors.light }}>
      <MarketingNav />
      <Outlet />
      <MarketingFooter />
    </Box>
  )
}
