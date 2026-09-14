import { Box } from '@mui/material'
import { resolveLucideIcon } from './lucideIcons'
import { colors } from '../../theme/muiTheme'

/**
 * Caja de ícono consistente con Contenidos (44×44, borde suave).
 */
export default function IconBadge({
  name = 'Circle',
  accent = colors.primary,
  size = 22,
  sx = {},
}) {
  const Icon = resolveLucideIcon(name)
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        minWidth: 44,
        minHeight: 44,
        borderRadius: 2,
        bgcolor: colors.light,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...sx,
      }}
    >
      <Icon size={size} color={accent} strokeWidth={1.75} />
    </Box>
  )
}
