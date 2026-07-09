import { Box, Typography } from '@mui/material'
import { HEADER_HEIGHT } from '../../utils/marketingNav'
import Reveal from './motion/Reveal'

export default function SectionHeading({ overline, title, subtitle, align = 'center', id, animate = true, subtitleSx = {} }) {
  const content = (
    <Box
      id={id}
      sx={{
        textAlign: align,
        mb: { xs: 4, md: 5 },
        scrollMarginTop: HEADER_HEIGHT,
      }}
    >
      {overline && (
        <Typography variant="overline" display="block" gutterBottom className="section-overline">
          {overline}
        </Typography>
      )}
      <Typography
        variant="h2"
        component="h2"
        className="font-display"
        sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 400, mb: subtitle ? 1.5 : 0, lineHeight: 1.25 }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: align === 'center' ? 580 : 520,
            mx: align === 'center' ? 'auto' : 0,
            lineHeight: 1.8,
            fontSize: { xs: '1rem', md: '1.0625rem' },
            ...subtitleSx,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  )

  if (!animate) return content

  return (
    <Reveal y={18} scale={0.99}>
      {content}
    </Reveal>
  )
}
