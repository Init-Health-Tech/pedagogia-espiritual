import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { CalendarDays, CreditCard, Info, X } from 'lucide-react'
import { notificationsAPI } from '../../services/api'
import { colors } from '../../theme/muiTheme'

function iconForTipo(tipo) {
  if (tipo === 'pago') return CreditCard
  if (tipo === 'evento') return CalendarDays
  return Info
}

function formatWhen(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function NotificationsDrawer({ open, onClose, onChanged }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = () => {
    setLoading(true)
    return notificationsAPI.list()
      .then((res) => {
        const data = res.data.results || res.data
        setItems(Array.isArray(data) ? data : [])
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (open) load()
  }, [open])

  const marcarUna = async (n) => {
    if (!n.leida) {
      try {
        await notificationsAPI.marcarLeida(n.id)
        if (onChanged) onChanged()
      } catch { /* ignore */ }
    }
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x)))
  }

  const marcarTodas = async () => {
    try {
      await notificationsAPI.marcarTodasLeidas()
      setItems((prev) => prev.map((x) => ({ ...x, leida: true })))
      if (onChanged) onChanged()
    } catch { /* ignore */ }
  }

  const pendientes = items.filter((n) => !n.leida).length

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h3" sx={{ flex: 1, fontWeight: 400 }}>
          Notificaciones
        </Typography>
        {pendientes > 0 && (
          <Button size="small" onClick={marcarTodas} sx={{ minHeight: 44 }}>
            Marcar todas
          </Button>
        )}
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ minWidth: 44, minHeight: 44 }}>
          <X size={20} />
        </IconButton>
      </Box>
      <Divider />

      {loading ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>
          Cargando…
        </Typography>
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>
          No tienes notificaciones por ahora.
        </Typography>
      ) : (
        <List disablePadding sx={{ overflow: 'auto' }}>
          {items.map((n) => {
            const Icon = iconForTipo(n.tipo)
            return (
              <ListItemButton
                key={n.id}
                onClick={() => marcarUna(n)}
                alignItems="flex-start"
                sx={{
                  py: 1.75,
                  px: 2,
                  bgcolor: n.leida ? 'transparent' : `${colors.primary}0A`,
                  borderBottom: `1px solid ${colors.border}`,
                  minHeight: 64,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: colors.light,
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5,
                    mt: 0.25,
                    flexShrink: 0,
                    color: colors.primary,
                  }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                </Box>
                <ListItemText
                  primary={(
                    <Stack direction="row" spacing={1} alignItems="baseline">
                      <Typography variant="subtitle2" fontWeight={n.leida ? 500 : 600} sx={{ flex: 1 }}>
                        {n.titulo}
                      </Typography>
                      {!n.leida && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: colors.blue,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Stack>
                  )}
                  secondary={(
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                        {n.cuerpo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
                        {formatWhen(n.created_at)}
                      </Typography>
                    </>
                  )}
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </ListItemButton>
            )
          })}
        </List>
      )}
    </Drawer>
  )
}
