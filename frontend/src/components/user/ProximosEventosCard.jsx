import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { CalendarDays } from 'lucide-react'
import { eventsAPI } from '../../services/api'
import { colors } from '../../theme/muiTheme'

function formatEventoFecha(fecha, hora) {
  if (!fecha) return '—'
  const iso = hora ? `${fecha}T${String(hora).slice(0, 8)}` : fecha
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return hora ? `${fecha} · ${String(hora).slice(0, 5)}` : fecha
  }
  const fechaTxt = d.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const horaTxt = hora
    ? d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : null
  return horaTxt ? `${fechaTxt} · ${horaTxt}` : fechaTxt
}

function EventoRsvpRow({ evento, onRespond, busyId }) {
  const mi = evento.mi_respuesta
  const busy = busyId === evento.id

  return (
    <Box
      sx={{
        py: 2,
        borderTop: `1px solid ${colors.border}`,
        '&:first-of-type': { borderTop: 'none', pt: 0 },
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} sx={{ color: colors.dark, mb: 0.25 }}>
        {evento.titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formatEventoFecha(evento.fecha, evento.hora)}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {evento.ubicacion}
      </Typography>
      {evento.descripcion ? (
        <Typography variant="body2" sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>
          {evento.descripcion}
        </Typography>
      ) : null}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button
          variant={mi === 'voy' ? 'contained' : 'outlined'}
          color="secondary"
          disabled={busy}
          onClick={() => onRespond(evento.id, 'voy')}
          sx={{ minHeight: 44, minWidth: 44 }}
        >
          Voy
        </Button>
        <Button
          variant={mi === 'no' ? 'contained' : 'outlined'}
          color={mi === 'no' ? 'inherit' : 'inherit'}
          disabled={busy}
          onClick={() => onRespond(evento.id, 'no')}
          sx={{
            minHeight: 44,
            minWidth: 44,
            ...(mi === 'no'
              ? { bgcolor: colors.dark, color: '#fff', '&:hover': { bgcolor: colors.dark } }
              : {}),
          }}
        >
          No puedo asistir
        </Button>
      </Stack>
    </Box>
  )
}

export default function ProximosEventosCard({ eventos = [], onUpdated }) {
  const [openAll, setOpenAll] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const preview = eventos.slice(0, 2)
  const hasMore = eventos.length > 2

  const respond = async (eventoId, respuesta) => {
    setBusyId(eventoId)
    try {
      await eventsAPI.rsvp(eventoId, respuesta)
      if (onUpdated) await onUpdated()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <Paper
        sx={{
          p: { xs: 2.5, sm: 3 },
          mb: 4,
          borderRadius: 4,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: `${colors.primary}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary,
              flexShrink: 0,
            }}
          >
            <CalendarDays size={20} strokeWidth={1.75} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" sx={{ display: 'block', lineHeight: 1.2 }}>
              Próximos eventos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirma si puedes asistir
            </Typography>
          </Box>
          {hasMore && (
            <Button onClick={() => setOpenAll(true)} sx={{ minHeight: 44, flexShrink: 0 }}>
              Ver todos
            </Button>
          )}
        </Stack>

        {eventos.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No hay eventos próximos por ahora.
          </Typography>
        ) : (
          <Box>
            {preview.map((ev) => (
              <EventoRsvpRow
                key={ev.id}
                evento={ev}
                onRespond={respond}
                busyId={busyId}
              />
            ))}
          </Box>
        )}
      </Paper>

      <Dialog open={openAll} onClose={() => setOpenAll(false)} fullWidth maxWidth="sm">
        <DialogTitle>Próximos eventos</DialogTitle>
        <DialogContent dividers>
          {eventos.map((ev) => (
            <EventoRsvpRow
              key={ev.id}
              evento={ev}
              onRespond={respond}
              busyId={busyId}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenAll(false)} sx={{ minHeight: 44 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
