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

const HEADER_HEIGHT = 72

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
        endIcon={<ExpandMoreIcon sx={{ fontSize: 18, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          fontWeight: 500,
          fontSize: '0.9rem',
          color: 'text.primary',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        {item.label}
      </Button>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: { mt: 1, minWidth: 240, borderRadius: 2, border: 1, borderColor: 'divider' },
          },
        }}
      >
        {item.children.map((child) => (
          <MenuItem
            key={child.href}
            onClick={() => {
              scrollTo(child.href)
              setAnchor(null)
              onNavigate?.()
            }}
            sx={{ py: 1.25, fontSize: '0.9rem' }}
          >
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
      <ListItemButton
        onClick={() => {
          scrollTo(item.href)
          onNavigate()
        }}
      >
        <ListItemText primary={item.label} />
      </ListItemButton>
    )
  }

  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open}>
        <List disablePadding sx={{ pl: 2 }}>
          {item.children.map((child) => (
            <ListItemButton
              key={child.href}
              onClick={() => {
                scrollTo(child.href)
                onNavigate()
              }}
            >
              <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
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
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(14px)',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: HEADER_HEIGHT, gap: 2 }}>
          <Box
            component="a"
            href="#inicio"
            onClick={(e) => { e.preventDefault(); scrollTo('#inicio') }}
            sx={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}
          >
            <Typography variant="subtitle1" fontWeight={700} color="primary" lineHeight={1.2}>
              Movimiento Franciscano
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Pedagogía Espiritual — SST
            </Typography>
          </Box>

          {!isMobile && (
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 1, ml: 2 }}>
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <NavDropdown key={item.label} item={item} />
                ) : (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={() => scrollTo(item.href)}
                    sx={{ fontWeight: 500, fontSize: '0.9rem', color: 'text.primary' }}
                  >
                    {item.label}
                  </Button>
                ),
              )}
            </Stack>
          )}

          <Box sx={{ flex: isMobile ? 1 : undefined }} />

          {!isMobile && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button component={RouterLink} to="/login" color="inherit" sx={{ fontWeight: 500 }}>
                Iniciar sesión
              </Button>
              <Button component={RouterLink} to="/registro" variant="contained" className="btn-glow">
                Registrarse
              </Button>
            </Stack>
          )}

          {isMobile && (
            <IconButton edge="end" onClick={() => setDrawerOpen(true)} aria-label="menú">
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600}>Menú</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <List sx={{ py: 1 }}>
          {NAV_ITEMS.map((item) => (
            <MobileNavGroup key={item.label} item={item} onNavigate={() => setDrawerOpen(false)} />
          ))}
        </List>
        <Stack spacing={1} sx={{ p: 2, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
          <Button component={RouterLink} to="/login" fullWidth variant="outlined" onClick={() => setDrawerOpen(false)}>
            Iniciar sesión
          </Button>
          <Button component={RouterLink} to="/registro" fullWidth variant="contained" className="btn-glow" onClick={() => setDrawerOpen(false)}>
            Registrarse
          </Button>
        </Stack>
      </Drawer>
    </>
  )
}

export { HEADER_HEIGHT, scrollTo }
