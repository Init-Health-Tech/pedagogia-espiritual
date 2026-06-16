import { Box, Typography } from '@mui/material'

export default function SectionHeading({ overline, title, subtitle, align = 'center', id }) {
  return (
    <Box
      id={id}
      sx={{
        textAlign: align,
        mb: { xs: 4, md: 5 },
        scrollMarginTop: 88,
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
        sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' }, fontWeight: 400, mb: subtitle ? 1.5 : 0, lineHeight: 1.25 }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: align === 'center' ? 560 : 520, mx: align === 'center' ? 'auto' : 0, lineHeight: 1.75 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}
