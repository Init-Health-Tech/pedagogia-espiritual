import { Box } from '@mui/material'
import { motion } from 'framer-motion'

const blobs = [
  { size: 420, x: '10%', y: '15%', color: 'rgba(91, 124, 153, 0.18)', delay: 0 },
  { size: 360, x: '70%', y: '25%', color: 'rgba(155, 168, 196, 0.15)', delay: 2 },
  { size: 300, x: '55%', y: '65%', color: 'rgba(184, 149, 107, 0.1)', delay: 4 },
]

export default function MeshBackground({ subtle = false }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: subtle ? 0.6 : 1,
      }}
    >
      {blobs.map((blob, i) => (
        <Box
          key={i}
          component={motion.div}
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
          sx={{
            position: 'absolute',
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </Box>
  )
}
