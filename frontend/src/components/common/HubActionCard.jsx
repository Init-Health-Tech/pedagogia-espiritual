import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { colors } from '../../theme/muiTheme'

export default function HubActionCard({ icon: Icon, title, description, to, onClick, ctaLabel = 'Ir ahora' }) {
  const inner = (
    <Card
      className="card-hover"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': { transform: 'scale(1.01)', borderColor: colors.accent },
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${colors.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: colors.primary }}>
          <Icon size={24} strokeWidth={1.75} />
        </Box>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 400 }}>{title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>{description}</Typography>
        <Button variant="contained" fullWidth component={to ? 'span' : 'button'} onClick={onClick}>
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  )

  if (to) {
    return (
      <Box component={RouterLink} to={to} sx={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
        {inner}
      </Box>
    )
  }

  return <Box onClick={onClick} sx={{ height: '100%', cursor: 'pointer' }}>{inner}</Box>
}
