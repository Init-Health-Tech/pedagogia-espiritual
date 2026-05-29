import { motion } from 'framer-motion'
import { Card } from '@mui/material'
import { staggerItem } from '../../animations/variants'

export default function AnimatedCard({ children, sx, variants = staggerItem, ...props }) {
  return (
    <motion.div
      variants={variants}
      style={{ height: '100%' }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
    >
      <Card
        sx={{
          height: '100%',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(26, 35, 50, 0.1)',
            borderColor: 'secondary.light',
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  )
}
