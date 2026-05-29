import { Card, CardContent, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'
import { staggerItem } from '../../animations/variants'

export default function StatCard({ label, value, sublabel, accent }) {
  return (
    <motion.div variants={staggerItem} style={{ height: '100%' }} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease',
          '&:hover': { boxShadow: '0 8px 28px rgba(26, 35, 50, 0.08)' },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #5B7C99, #9BA8C4)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': { opacity: 1 },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
            {label}
          </Typography>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Typography
              variant="h2"
              component="p"
              color="primary"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem' },
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                ...(accent && { color: accent }),
              }}
            >
              {value}
            </Typography>
          </motion.div>
          {sublabel && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {sublabel}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
