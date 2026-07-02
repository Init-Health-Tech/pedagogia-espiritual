import { Box, Button, Typography } from '@mui/material'
import { colors } from '../../theme/muiTheme'

function TauIllustration() {
  return (
    <Box
      component="svg"
      viewBox="0 0 80 80"
      aria-hidden
      sx={{ width: 64, height: 64, mx: 'auto', mb: 2, display: 'block', opacity: 0.5 }}
    >
      <circle cx="40" cy="36" r="28" stroke={colors.border} strokeWidth="1.5" fill="none" />
      <path d="M40 18v36M28 30h24" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </Box>
  )
}

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        bgcolor: colors.surface,
      }}
    >
      <TauIllustration />
      <Typography variant="subtitle1" color="text.primary" gutterBottom fontWeight={500}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: actionLabel ? 3 : 0 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}
