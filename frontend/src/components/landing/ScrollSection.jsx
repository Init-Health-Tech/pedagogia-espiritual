import { Box } from '@mui/material'
import { colors } from '../../theme/muiTheme'

export default function ScrollSection({ id, alt = false, children, sx = {} }) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: 3,
        bgcolor: alt ? colors.surface : colors.light,
        scrollMarginTop: 88,
        ...sx,
      }}
    >
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>{children}</Box>
    </Box>
  )
}

export function SectionDivider() {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 3 }}>
      <Box sx={{ borderTop: `1px solid ${colors.border}`, opacity: 0.45 }} />
    </Box>
  )
}

export function PublicContainer({ children, sx = {} }) {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, ...sx }}>{children}</Box>
  )
}
