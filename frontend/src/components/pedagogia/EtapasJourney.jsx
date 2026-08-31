import { Box, Stack, Typography } from '@mui/material'
import { Check } from 'lucide-react'
import { colors } from '../../theme/muiTheme'

export default function EtapasJourney({ modulos = [], etapaActualId, onSelect }) {
  const sorted = [...modulos].sort((a, b) => a.orden - b.orden)
  let currentIdx = sorted.findIndex((m) => m.id === etapaActualId)
  if (currentIdx < 0 && sorted.length) currentIdx = 0

  return (
    <Box sx={{ overflowX: 'auto', pb: 1 }}>
      <Stack direction="row" spacing={0} alignItems="flex-start" sx={{ minWidth: { xs: 560, md: '100%' } }}>
        {sorted.map((mod, i) => {
          const accent = mod.color || colors.primary
          const isPast = i < currentIdx
          const isCurrent = i === currentIdx

          return (
            <Box key={mod.id} sx={{ flex: 1, position: 'relative', px: 1 }}>
              {i < sorted.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: '50%',
                    right: '-50%',
                    height: 2,
                    bgcolor: isPast || isCurrent ? accent : colors.border,
                    zIndex: 0,
                  }}
                />
              )}
              <Stack alignItems="center" spacing={0.75} sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                  onClick={() => onSelect?.(mod)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isCurrent ? colors.dark : isPast ? `${accent}33` : colors.surface,
                    border: `2px solid ${accent}`,
                    boxShadow: isCurrent ? `0 0 0 4px ${colors.cream}` : 'none',
                    color: isCurrent ? colors.cream : isPast ? accent : colors.muted,
                    cursor: onSelect ? 'pointer' : 'default',
                    transition: 'transform 0.2s',
                    '&:hover': onSelect ? { transform: 'scale(1.06)' } : {},
                  }}
                >
                  {isPast ? <Check size={18} /> : (
                    <Typography variant="caption" fontWeight={700}>{mod.orden}</Typography>
                  )}
                </Box>
                <Typography
                  variant="caption"
                  textAlign="center"
                  sx={{
                    fontWeight: isCurrent ? 600 : 400,
                    color: isCurrent ? colors.dark : 'text.secondary',
                    maxWidth: 100,
                    lineHeight: 1.3,
                  }}
                >
                  {mod.nombre.replace(/^Etapa [IVX]+ — /, '')}
                </Typography>
                {isCurrent && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.secondary,
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Estás aquí
                  </Typography>
                )}
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
