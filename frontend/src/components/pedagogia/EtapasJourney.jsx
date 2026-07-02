import { Box, Stack, Typography } from '@mui/material'
import { Check } from 'lucide-react'
import { colors } from '../../theme/muiTheme'

export default function EtapasJourney({ modulos = [], etapaActualId, onSelect }) {
  const sorted = [...modulos].sort((a, b) => a.orden - b.orden)
  const currentIdx = sorted.findIndex((m) => m.id === etapaActualId)

  return (
    <Box sx={{ overflowX: 'auto', pb: 1 }}>
      <Stack direction="row" spacing={0} alignItems="flex-start" sx={{ minWidth: { xs: 560, md: '100%' } }}>
        {sorted.map((mod, i) => {
          const isPast = currentIdx >= 0 && i < currentIdx
          const isCurrent = mod.id === etapaActualId
          const isFuture = currentIdx >= 0 && i > currentIdx

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
                    bgcolor: isPast || isCurrent ? mod.color || colors.primary : colors.border,
                    zIndex: 0,
                  }}
                />
              )}
              <Stack alignItems="center" spacing={1} sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                  onClick={() => onSelect?.(mod)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isCurrent ? mod.color || colors.primary : isPast ? `${mod.color || colors.moss}33` : colors.surface,
                    border: `2px solid ${isCurrent ? mod.color || colors.primary : isFuture ? colors.border : mod.color || colors.primary}`,
                    color: isCurrent ? '#fff' : isPast ? mod.color || colors.moss : colors.muted,
                    cursor: onSelect ? 'pointer' : 'default',
                    transition: 'transform 0.2s',
                    '&:hover': onSelect ? { transform: 'scale(1.06)' } : {},
                  }}
                >
                  {isPast ? <Check size={18} /> : (
                    <Typography variant="caption" fontWeight={600}>{mod.orden}</Typography>
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
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
