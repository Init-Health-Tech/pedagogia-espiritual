import { Box } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_GENTLE, REVEAL_DURATION, VIEWPORT_DEFAULT } from './scrollMotion'

export default function Reveal({
  children,
  delay = 0,
  y = 22,
  scale,
  sx,
  ...props
}) {
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
      initial={{
        opacity: 0,
        y,
        ...(scale != null ? { scale } : {}),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={VIEWPORT_DEFAULT}
      transition={{
        duration: REVEAL_DURATION,
        ease: EASE_GENTLE,
        delay,
      }}
      sx={{
        willChange: 'opacity, transform',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
