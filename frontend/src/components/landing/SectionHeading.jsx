import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../animations/variants'

export default function SectionHeading({ overline, title, subtitle, align = 'center', id }) {
  return (
    <Box
      id={id}
      component={motion.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeInUp}
      sx={{
        textAlign: align,
        mb: { xs: 3, md: 5 },
        scrollMarginTop: 88,
      }}
    >
      {overline && (
        <Typography variant="overline" color="secondary.main" display="block" gutterBottom>
          {overline}
        </Typography>
      )}
      <Typography variant="h2" component="h2" color="primary" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: subtitle ? 1.5 : 0 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: align === 'center' ? 640 : 560, mx: align === 'center' ? 'auto' : 0 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}
