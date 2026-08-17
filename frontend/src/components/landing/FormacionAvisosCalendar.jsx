import { useMemo, useState } from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { AVISOS_EVENTOS } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const TYPE_COLORS = {
  formacion: colors.primary,
  oracion: colors.blue,
  comunidad: colors.secondary,
  caridad: colors.accent,
  celebracion: colors.moss,
}

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

function buildMonthCells(year, month) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Monday-first: Sun=0 -> 6, Mon=1 -> 0, ...
  const startOffset = (first.getDay() + 6) % 7
  const cells = []

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null)
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day)
  }
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }
  return cells
}

function EventCard({ event, active }) {
  const accent = TYPE_COLORS[event.type] || colors.primary

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${active ? accent : colors.border}`,
        borderLeft: `4px solid ${accent}`,
        bgcolor: active ? colors.surface : 'rgba(255,255,255,0.55)',
      }}
    >
      <Typography
        variant="overline"
        sx={{ display: 'block', color: accent, mb: 0.5, letterSpacing: '0.08em' }}
      >
        {event.time}
      </Typography>
      <Typography variant="h3" className="font-display" sx={{ fontSize: '1.1rem', mb: 0.75, color: colors.dark }}>
        {event.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.9875rem' }}>
        {event.description}
      </Typography>
      {event.place && (
        <Typography variant="body2" sx={{ mt: 1, color: colors.muted, fontSize: '0.875rem' }}>
          {event.place}
        </Typography>
      )}
    </Box>
  )
}

export default function FormacionAvisosCalendar() {
  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedKey, setSelectedKey] = useState(() => toKey(today.getFullYear(), today.getMonth(), today.getDate()))

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const cells = useMemo(() => buildMonthCells(year, month), [year, month])

  const eventsByDay = useMemo(() => {
    const map = new Map()
    AVISOS_EVENTOS.forEach((event) => {
      const list = map.get(event.date) || []
      list.push(event)
      map.set(event.date, list)
    })
    return map
  }, [])

  const selectedEvents = eventsByDay.get(selectedKey) || []
  const selectedDate = parseKey(selectedKey)
  const selectedLabel = selectedDate.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const goMonth = (delta) => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  const selectDay = (day) => {
    if (!day) return
    setSelectedKey(toKey(year, month, day))
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
        gap: { xs: 3, md: 3.5 },
        alignItems: 'start',
      }}
    >
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <IconButton
            aria-label="Mes anterior"
            onClick={() => goMonth(-1)}
            sx={{
              color: colors.primary,
              border: `1px solid ${colors.border}`,
              width: 44,
              height: 44,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography className="font-display" sx={{ fontSize: { xs: '1.25rem', md: '1.4rem' }, color: colors.dark }}>
            {MONTHS[month]} {year}
          </Typography>
          <IconButton
            aria-label="Mes siguiente"
            onClick={() => goMonth(1)}
            sx={{
              color: colors.primary,
              border: `1px solid ${colors.border}`,
              width: 44,
              height: 44,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.75,
            mb: 0.75,
          }}
        >
          {WEEKDAYS.map((label) => (
            <Typography
              key={label}
              variant="overline"
              sx={{
                textAlign: 'center',
                color: colors.muted,
                fontSize: '0.65rem',
                letterSpacing: '0.06em',
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.75,
          }}
        >
          {cells.map((day, index) => {
            if (!day) {
              return <Box key={`empty-${index}`} sx={{ aspectRatio: '1', minHeight: 44 }} />
            }

            const key = toKey(year, month, day)
            const hasEvents = eventsByDay.has(key)
            const isSelected = key === selectedKey
            const isToday = sameDay(new Date(year, month, day), today)
            const dayEvents = eventsByDay.get(key) || []
            const dotColor = TYPE_COLORS[dayEvents[0]?.type] || colors.accent

            return (
              <Box
                key={key}
                component="button"
                type="button"
                onClick={() => selectDay(day)}
                aria-label={`${day} de ${MONTHS[month]}${hasEvents ? ', con avisos' : ''}`}
                aria-pressed={isSelected}
                sx={{
                  aspectRatio: '1',
                  minHeight: 44,
                  borderRadius: 1.5,
                  border: `1px solid ${isSelected ? colors.primary : isToday ? colors.accent : 'transparent'}`,
                  bgcolor: isSelected ? colors.primary : hasEvents ? 'rgba(255,255,255,0.7)' : 'transparent',
                  color: isSelected ? colors.cream : colors.dark,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.35,
                  font: 'inherit',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    bgcolor: isSelected ? colors.blue : colors.light,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: isToday || isSelected ? 600 : 400,
                    lineHeight: 1,
                  }}
                >
                  {day}
                </Typography>
                {hasEvents && (
                  <Box
                    aria-hidden
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: isSelected ? colors.accent : dotColor,
                    }}
                  />
                )}
              </Box>
            )
          })}
        </Box>

        <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap sx={{ mt: 2.5 }}>
          {[
            { label: 'Formación', color: TYPE_COLORS.formacion },
            { label: 'Oración', color: TYPE_COLORS.oracion },
            { label: 'Comunidad', color: TYPE_COLORS.comunidad },
            { label: 'Caridad', color: TYPE_COLORS.caridad },
            { label: 'Celebración', color: TYPE_COLORS.celebracion },
          ].map((item) => (
            <Stack key={item.label} direction="row" spacing={0.75} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
              <Typography variant="caption" sx={{ color: colors.muted, fontSize: '0.75rem' }}>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 1 }}>
          Avisos del día
        </Typography>
        <Typography
          className="font-display"
          sx={{ fontSize: '1.25rem', mb: 2, color: colors.dark, textTransform: 'capitalize' }}
        >
          {selectedLabel}
        </Typography>

        <Stack spacing={1.5}>
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => (
              <EventCard
                key={`${event.date}-${event.title}`}
                event={event}
                active
              />
            ))
          ) : (
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              Sin eventos
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
