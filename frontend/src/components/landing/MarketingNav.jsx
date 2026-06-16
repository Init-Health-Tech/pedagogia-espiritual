import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { NAV_ITEMS } from '../../data/marketingContent'
import TorLogo from '../common/TorLogo'
import { colors } from '../../theme/muiTheme'

const HEADER_HEIGHT = 64

function scrollTo(href) {
  if (!href.startsWith('#')) return
  const el = document.querySelector(href)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

function NavDropdown({ item, onNavigate }) {
  const [anchor, setAnchor] = useState(null)
  const open = Boolean(anchor)

  return (
    <>
      <Button
        color="inherit"
        endIcon={<ExpandMoreIcon sx={{ fontSize: 16, opacity: 0.6 }} />}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ fontWeight: 400, fontSize: '0.8125rem', color: colors.muted, minHeight: 36, px: 1.5, '&:hover': { color: colors.primary, bgcolor: 'transparent' } }}
      >
        {item.label}
      </Button>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { mt: 0.5, minWidth: 220, borderRadius: 1, border: `1px solid ${colors.border}`, boxShadow: 'none' } } }}
      >
        {item.children.map((child) => (
          <MenuItem key={child.href} onClick={() => { scrollTo(child.href); setAnchor(null); onNavigate?.() }} sx={{ py: 1, fontSize: '0.875rem' }}>
            {child.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

function MobileNavGroup({ item, onNavigate }) {
  const [open, setOpen] = useState(false)
  if (!item.children) {
    return (
      <ListItemButton onClick={() => { scrollTo(item.href); onNavigate() }} sx={{ py: 1.25 }}>
        <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9375rem' }} />
      </ListItemButton>
    )
  }
  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)} sx={{ py: 1.25 }}>
        <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9375rem' }} />
        {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
      </ListItemButton>
      <Collapse in={open}>
        <List disablePadding sx={{ pl: 2 }}>
          {item.children.map((child) => (
            <ListItemButton key={child.href} onClick={() => { scrollTo(child.href); onNavigate() }} sx={{ py: 1 }}>
              <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: '0.875rem', color: colors.muted }} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}

export default function MarketingNav() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(250, 246, 239, 0.92)',
          backdropFilter: 'blur(8px)',
          color: 'text.primary',
          borderBottom: `1px solid ${colors.border}`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: HEADER_HEIGHT, gap: 1.5, px: { xs: 2, md: 3 } }}>
          <Box component="a" href="#inicio" onClick={(e) => { e.preventDefault(); scrollTo('#inicio') }} sx={{ textDecoration: 'none', color: 'inherit' }}>
            <TorLogo size="sm" />
          </Box>

          {!isMobile && (
            <Stack direction="row" alignItems="center" sx={{ flex: 1, ml: 1 }}>
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <NavDropdown key={item.label} item={item} />
                ) : (
                  <Button key={item.label} color="inherit" onClick={() => scrollTo(item.href)} sx={{ fontWeight: 400, fontSize: '0.8125rem', color: colors.muted, minHeight: 36, px: 1.5, '&:hover': { color: colors.primary, bgcolor: 'transparent' } }}>
                    {item.label}
                  </Button>
                ),
              )}
            </Stack>
          )}

          <Box sx={{ flex: isMobile ? 1 : undefined }} />

          {!isMobile && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Button component={RouterLink} to="/login" variant="text" className="landing-btn" sx={{ color: colors.muted, minHeight: 36 }}>Iniciar sesión</Button>
              <Button component={RouterLink} to="/registro" variant="contained" className="landing-btn" sx={{ minHeight: 36 }}>Registrarse</Button>
            </Stack>
          )}

          {isMobile && (
            <IconButton edge="end" onClick={() => setDrawerOpen(true)} aria-label="menú" size="small">
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 280, borderLeft: `1px solid ${colors.border}` } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: `1px solid ${colors.border}` }}>
          <Typography variant="body2" color="text.secondary">Menú</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
        <List sx={{ py: 0.5 }}>
          {NAV_ITEMS.map((item) => (
            <MobileNavGroup key={item.label} item={item} onNavigate={() => setDrawerOpen(false)} />
          ))}
        </List>
        <Stack spacing={1} sx={{ p: 2, mt: 'auto', borderTop: `1px solid ${colors.border}` }}>
          <Button component={RouterLink} to="/login" fullWidth variant="text" className="landing-btn" onClick={() => setDrawerOpen(false)}>Iniciar sesión</Button>
          <Button component={RouterLink} to="/registro" fullWidth variant="contained" className="landing-btn" onClick={() => setDrawerOpen(false)}>Registrarse</Button>
        </Stack>
      </Drawer>
    </>
  )
}

export { HEADER_HEIGHT, scrollTo }
