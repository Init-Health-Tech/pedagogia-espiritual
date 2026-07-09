import { Box } from '@mui/material'
import { colors } from '../../theme/muiTheme'
import { HEADER_HEIGHT } from '../../utils/marketingNav'

const SECTION_SIZES = {
  full: {
    minHeight: '100svh',
    py: { xs: 6, md: 8 },
  },
  tall: {
    minHeight: { xs: 'auto', md: '90svh' },
    py: { xs: 7, md: 10 },
  },
  content: {
    minHeight: 'auto',
    py: { xs: 7, md: 10 },
  },
}

export default function ScrollSection({
  id,
  alt = false,
  lead = false,
  size = 'full',
  contentMaxWidth = 720,
  children,
  sx = {},
}) {
  const sizeStyles = SECTION_SIZES[size] ?? SECTION_SIZES.full

  return (
    <Box
      id={id}
      component="section"
      className="story-section"
      sx={{
        px: 3,
        bgcolor: alt ? colors.surface : colors.light,
        scrollMarginTop: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...(lead
          ? {
              pt: `calc(${HEADER_HEIGHT}px + 1.5rem)`,
              pb: sizeStyles.py,
              minHeight: size === 'content' ? 'auto' : sizeStyles.minHeight,
            }
          : sizeStyles),
        ...sx,
      }}
    >
      <Box sx={{ maxWidth: contentMaxWidth, mx: 'auto', width: '100%' }}>{children}</Box>
    </Box>
  )
}

export function SectionDivider() {
  return null
}

export function PublicContainer({ children, sx = {} }) {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, ...sx }}>{children}</Box>
  )
}
