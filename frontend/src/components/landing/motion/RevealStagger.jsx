import { Box } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_GENTLE, REVEAL_DURATION, STAGGER_CHILDREN, VIEWPORT_DEFAULT } from './scrollMotion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_CHILDREN,
      delayChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: EASE_GENTLE },
  },
}

export function RevealStaggerItem({ children, sx, ...props }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <Box sx={sx} {...props}>
        {children}
      </Box>
    )
  }

  return (
    <Box
      component={motion.div}
      variants={itemVariants}
      sx={{ willChange: 'opacity, transform', ...sx }}
      {...props}
    >
      {children}
    </Box>
  )
}

export default function RevealStagger({ children, sx, ...props }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <Box sx={sx} {...props}>
        {children}
      </Box>
    )
  }

  return (
    <Box
      component={motion.div}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_DEFAULT}
      variants={containerVariants}
      sx={sx}
      {...props}
    >
      {children}
    </Box>
  )
}
