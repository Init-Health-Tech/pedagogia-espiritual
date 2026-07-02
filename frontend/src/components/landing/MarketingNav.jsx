import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
import { navigateToMarketingHref, HEADER_HEIGHT } from '../../utils/marketingNav'

const navLinkSx = {
  fontWeight: 400,
  fontSize: '0.8125rem',
  color: 'rgba(255,255,255,0.75)',
  minHeight: 36,
  px: 1.5,
  '&:hover': { color: colors.cream, bgcolor: 'transparent' },
}

function NavDropdown({ item, onNavigate }) {
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState(null)
  const open = Boolean(anchor)

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={0}>
        <Button
          component={RouterLink}
          to={item.route}
          color="inherit"
          onClick={() => onNavigate?.()}
          sx={navLinkSx}
        >
          {item.label}
        </Button>
        <IconButton
          size="small"
          aria-label={`Submenú ${item.label}`}
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ color: 'rgba(255,255,255,0.75)', '&:hover': { color: colors.cream } }}
        >
          <ExpandMoreIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { mt: 0.5, minWidth: 220, borderRadius: 1, border: `1px solid ${colors.border}`, boxShadow: 'none' } } }}
      >
        {item.children.map((child) => (
          <MenuItem
            key={child.href}
            onClick={() => {
              navigateToMarketingHref(navigate, child.href)
              setAnchor(null)
              onNavigate?.()
            }}
            sx={{ py: 1, fontSize: '0.875rem' }}
          >
            {child.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

function MobileNavGroup({ item, onNavigate }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!item.children?.length) {
    return (
      <ListItemButton
        onClick={() => {
          navigate(item.route)
          onNavigate()
        }}
        sx={{ py: 1.25 }}
      >
        <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9375rem', fontWeight: 600 }} />
      </ListItemButton>
    )
  }

  return (
    <>
      <ListItemButton
        onClick={() => {
          navigate(item.route)
          onNavigate()
        }}
        sx={{ py: 1.25 }}
      >
        <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9375rem', fontWeight: 600 }} />
        <IconButton
          edge="end"
          size="small"
          aria-label={`Subsecciones de ${item.label}`}
          onClick={(e) => {
            e.stopPropagation()
            setOpen(!open)
          }}
        >
          {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </ListItemButton>
      <Collapse in={open}>
        <List disablePadding sx={{ pl: 2 }}>
          {item.children.map((child) => (
            <ListItemButton
              key={child.href}
              onClick={() => {
                navigateToMarketingHref(navigate, child.href)
                onNavigate()
              }}
              sx={{ py: 1 }}
            >
              <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: '0.875rem', color: colors.primary }} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}

export default function MarketingNav() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(3, 14, 48, 0.96)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: HEADER_HEIGHT, gap: 1.5, px: { xs: 2, md: 3 } }}>
          <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <TorLogo size="sm" light />
          </Box>

          {!isMobile && (
            <Stack direction="row" alignItems="center" sx={{ flex: 1, ml: 1 }}>
              {NAV_ITEMS.map((item) => (
                <NavDropdown key={item.label} item={item} />
              ))}
            </Stack>
          )}

          <Box sx={{ flex: isMobile ? 1 : undefined }} />

          {!isMobile && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Button component={RouterLink} to="/login" variant="text" className="landing-btn" sx={{ color: 'rgba(255,255,255,0.85)', minHeight: 36 }}>Iniciar sesión</Button>
              <Button component={RouterLink} to="/registro" variant="contained" className="landing-btn" sx={{ minHeight: 36, bgcolor: colors.blue, '&:hover': { bgcolor: colors.cream, color: colors.primary } }}>Registrarse</Button>
            </Stack>
          )}

          {isMobile && (
            <IconButton edge="end" onClick={() => setDrawerOpen(true)} aria-label="menú" size="small" sx={{ color: '#fff' }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: colors.cream,
            borderLeft: `1px solid ${colors.border}`,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: `1px solid ${colors.border}` }}>
          <Typography variant="body2" color="text.secondary">Menú</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
        <List sx={{ py: 0.5 }}>
          <ListItemButton component={RouterLink} to="/" onClick={() => setDrawerOpen(false)} sx={{ py: 1.25 }}>
            <ListItemText primary="Inicio" primaryTypographyProps={{ fontSize: '0.9375rem' }} />
          </ListItemButton>
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

export { HEADER_HEIGHT }
