import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../animations/variants'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        mb: { xs: 2.5, md: 3 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'flex-start' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h1" component="h1" color="primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ mt: 0.5, maxWidth: 560 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          {action}
        </motion.div>
      )}
    </Box>
  )
}
