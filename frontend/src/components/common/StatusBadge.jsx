import { Chip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { colors } from '../../theme/muiTheme'

const variants = {
  active: {
    bg: alpha(colors.moss, 0.15),
    color: colors.moss,
    label: 'Activo',
  },
  pending: {
    bg: alpha(colors.accent, 0.2),
    color: colors.earth,
    label: 'Pendiente',
  },
  alert: {
    bg: '#fef2f2',
    color: '#b91c1c',
    label: 'Alerta',
  },
  info: {
    bg: alpha(colors.sky, 0.15),
    color: colors.primary,
    label: 'Info',
  },
}

export default function StatusBadge({ status, label }) {
  const v = variants[status] || variants.info
  return (
    <Chip
      label={label || v.label}
      size="small"
      sx={{
        bgcolor: v.bg,
        color: v.color,
        fontWeight: 500,
        fontSize: '0.875rem',
        height: 28,
        borderRadius: 999,
        border: 'none',
        '& .MuiChip-label': { px: 1.5 },
      }}
    />
  )
}
