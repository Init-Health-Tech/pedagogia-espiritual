import { Box, CircularProgress, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export default function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 280,
        gap: 2,
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        <CircularProgress size={36} color="secondary" thickness={3} />
      </motion.div>
      <Typography
        component={motion.p}
        variant="body2"
        color="text.secondary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        {message}
      </Typography>
    </Box>
  )
}
