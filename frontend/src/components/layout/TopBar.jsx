import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Bell, LogOut, User, LayoutDashboard, Shield } from 'lucide-react'
import TorLogo from '../common/TorLogo'
import { useAuth } from '../../context/AuthContext'
import { TOP_BAR_HEIGHT, colors } from '../../theme/muiTheme'

export default function TopBar({ sectionTitle, notificationCount = 0 }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [anchor, setAnchor] = useState(null)

  const isAdminArea = location.pathname.startsWith('/admin')
  const messagesPath = isAdminArea ? '/admin/anuncios' : '/app/comunicacion'
  const profilePath = '/app/perfil'

  const initials = (user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()
  const displayName = user?.full_name || user?.username || 'Usuario'

  const handleLogout = () => {
    setAnchor(null)
    logout()
    navigate('/')
  }

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: TOP_BAR_HEIGHT,
        bgcolor: colors.primary,
        color: '#fff',
        zIndex: (t) => t.zIndex.appBar,
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 3 },
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
        <TorLogo size="xs" light />
        {sectionTitle && (
          <>
            <Box sx={{ width: '1px', height: 24, bgcolor: 'rgba(255,255,255,0.2)', display: { xs: 'none', sm: 'block' } }} />
            <Typography variant="body1" noWrap sx={{ color: '#fff', fontWeight: 400 }}>
              {sectionTitle}
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
        <IconButton
          aria-label="Notificaciones"
          sx={{ color: 'rgba(255,255,255,0.85)' }}
          onClick={() => navigate(messagesPath)}
        >
          <Badge badgeContent={notificationCount || null} sx={{ '& .MuiBadge-badge': { bgcolor: colors.accent, color: colors.dark } }} max={99}>
            <Bell size={20} strokeWidth={1.75} />
          </Badge>
        </IconButton>

        <IconButton
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label="Menú de usuario"
          sx={{ p: 0.5 }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: colors.accent, color: colors.dark, fontSize: '0.875rem' }}>
            {initials}
          </Avatar>
        </IconButton>

        <Button
          onClick={handleLogout}
          startIcon={<LogOut size={16} />}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            color: 'rgba(255,255,255,0.9)',
            minHeight: 40,
            fontSize: '0.875rem',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { minWidth: 240, mt: 1, borderRadius: 2 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={500}>{displayName}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email || 'Miembro'}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { setAnchor(null); navigate(profilePath) }}>
          <ListItemIcon><User size={18} /></ListItemIcon>
          <ListItemText primary="Mi perfil" primaryTypographyProps={{ fontSize: '1rem' }} />
        </MenuItem>
        {isAdmin && isAdminArea && (
          <MenuItem onClick={() => { setAnchor(null); navigate('/app') }}>
            <ListItemIcon><LayoutDashboard size={18} /></ListItemIcon>
            <ListItemText primary="Vista de miembro" primaryTypographyProps={{ fontSize: '1rem' }} />
          </MenuItem>
        )}
        {isAdmin && !isAdminArea && (
          <MenuItem onClick={() => { setAnchor(null); navigate('/admin') }}>
            <ListItemIcon><Shield size={18} /></ListItemIcon>
            <ListItemText primary="Administración" primaryTypographyProps={{ fontSize: '1rem' }} />
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout} sx={{ display: { md: 'none' } }}>
          <ListItemIcon><LogOut size={18} /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: '1rem' }} />
        </MenuItem>
      </Menu>
    </Box>
  )
}
