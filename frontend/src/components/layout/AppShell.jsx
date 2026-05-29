import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useAuth } from '../../context/AuthContext'
import { DRAWER_WIDTH } from '../../theme/muiTheme'

function NavItem({ item, onNavigate }) {
  const location = useLocation()
  const active = item.end
    ? location.pathname === item.to
    : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={item.to}
        selected={active}
        onClick={onNavigate}
        sx={{
          color: 'rgba(255,255,255,0.85)',
          '& .MuiListItemIcon-root': { color: active ? '#fff' : 'rgba(255,255,255,0.55)', minWidth: 40 },
          '&.Mui-selected': { color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 400 }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default function AppShell({
  navItems,
  footerItems = [],
  title,
  subtitle,
  variant = 'user',
  children,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = (user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()

  const drawerBg = variant === 'admin' ? '#2C3A4D' : '#1A2332'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const closeMobile = () => setMobileOpen(false)

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: drawerBg }}>
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, lineHeight: 1.3 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', display: 'block', mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>
      <List sx={{ flex: 1, py: 1.5 }}>
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={closeMobile} />
        ))}
        {footerItems.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={closeMobile} />
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }} noWrap>
              {user?.full_name || user?.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {variant === 'admin' ? 'Administrador' : 'Miembro'}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          startIcon={<LogoutOutlinedIcon />}
          onClick={handleLogout}
          sx={{
            color: 'rgba(255,255,255,0.9)',
            borderColor: 'rgba(255,255,255,0.25)',
            '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.06)' },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: 'none' },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="abrir menú">
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobile}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          pt: { xs: '64px', md: 0 },
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1280, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
