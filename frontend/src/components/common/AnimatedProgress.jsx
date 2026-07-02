import { Box, LinearProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { colors } from '../../theme/muiTheme'

export default function AnimatedProgress({ value, sx }) {
  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: colors.border,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            bgcolor: colors.primary,
            transition: 'transform 1s cubic-bezier(0.22, 1, 0.36, 1) !important',
          },
          ...sx,
        }}
      />
    </Box>
  )
}
