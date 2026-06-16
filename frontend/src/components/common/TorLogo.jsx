import { Box, Typography } from '@mui/material'

const SIZES = {
  xs: 32,
  sm: 40,
  lg: 64,
}

export default function TorLogo({ size = 'sm', showText = true, light = false }) {
  const height = SIZES[size] || SIZES.sm
  const color = light ? '#FAF6EF' : '#6B4C2A'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
      <Box
        component="svg"
        viewBox="0 0 120 120"
        aria-hidden
        sx={{ height, width: 'auto', flexShrink: 0 }}
      >
        <circle cx="60" cy="52" r="38" stroke={color} strokeWidth="2" fill="none" />
        <path d="M60 28v48M44 44h32" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </Box>
      {showText && (
        <Box sx={{ lineHeight: 1.2, display: { xs: size === 'xs' ? 'none' : 'block', sm: 'block' } }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontFamily: '"Source Sans 3", sans-serif',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: size === 'lg' ? '0.75rem' : '0.6875rem',
              color: light ? 'rgba(255,255,255,0.95)' : 'primary.main',
            }}
          >
            Orden Franciscana TOR
          </Typography>
          {size === 'lg' && (
            <Typography
              variant="body2"
              sx={{ color: light ? 'rgba(255,255,255,0.65)' : 'text.secondary', mt: 0.25 }}
            >
              Pedagogía Espiritual — SST
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}
