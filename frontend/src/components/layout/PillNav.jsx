import { Link, useLocation } from 'react-router-dom'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { DOCK_HEIGHT, colors } from '../../theme/muiTheme'

function NavLink({ item, mobile }) {
  const location = useLocation()
  const active = item.end
    ? location.pathname === item.to
    : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)

  const Icon = item.icon
  const label = item.shortLabel || item.label

  return (
    <Box
      component={Link}
      to={item.to}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.35,
        px: mobile ? 1.25 : 2,
        py: mobile ? 0.75 : 1,
        borderRadius: 999,
        textDecoration: 'none',
        minWidth: mobile ? 64 : 80,
        flexShrink: 0,
        transition: 'background-color 200ms ease-out',
        bgcolor: active ? colors.primary : 'transparent',
        '&:hover': { bgcolor: active ? colors.blue : alpha(colors.primary, 0.08) },
      }}
    >
      <Icon size={20} strokeWidth={1.75} color={active ? '#fff' : colors.muted} />
      <Typography
        variant="caption"
        sx={{
          fontSize: mobile ? '0.6875rem' : '0.75rem',
          fontWeight: active ? 600 : 400,
          color: active ? '#fff' : colors.muted,
          lineHeight: 1.2,
          textAlign: 'center',
          maxWidth: 72,
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

export default function PillNav({ items }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (isMobile) {
    return (
      <Box
        component="nav"
        aria-label="Navegación principal"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: DOCK_HEIGHT,
          bgcolor: colors.light,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 0.25,
          px: 0.5,
          py: 0.5,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          zIndex: (t) => t.zIndex.appBar,
          pb: 'calc(8px + env(safe-area-inset-bottom))',
        }}
      >
        {items.map((item) => (
          <NavLink key={item.to} item={item} mobile />
        ))}
      </Box>
    )
  }

  return (
    <Box
      component="nav"
      aria-label="Navegación principal"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        py: 1.5,
        px: 2,
        bgcolor: colors.light,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          bgcolor: '#fff',
          border: `1px solid ${colors.border}`,
          borderRadius: 999,
          p: 0.5,
          maxWidth: 640,
          width: '100%',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {items.map((item) => (
          <NavLink key={item.to} item={item} mobile={false} />
        ))}
      </Box>
    </Box>
  )
}
