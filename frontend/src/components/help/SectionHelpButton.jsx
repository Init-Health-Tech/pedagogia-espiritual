import { IconButton, Tooltip } from '@mui/material'
import { CircleHelp } from 'lucide-react'
import { colors } from '../../theme/muiTheme'

/** Ícono "?" consistente para tours por sección (círculo 44×44). */
export default function SectionHelpButton({ onClick, label = 'Ver ayuda de esta sección' }) {
  return (
    <Tooltip title={label}>
      <IconButton
        onClick={onClick}
        aria-label={label}
        sx={{
          width: 44,
          height: 44,
          minWidth: 44,
          minHeight: 44,
          p: 0,
          flexShrink: 0,
          borderRadius: '50%',
          color: colors.primary,
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
          '&:hover': { bgcolor: colors.light, borderColor: colors.primary },
        }}
      >
        <CircleHelp size={22} strokeWidth={1.75} aria-hidden />
      </IconButton>
    </Tooltip>
  )
}
