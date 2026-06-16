import { Box, Typography } from '@mui/material'

export default function FormField({ label, helper, required, children }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        component="label"
        variant="body2"
        fontWeight={500}
        color="text.primary"
        sx={{ display: 'block', mb: 1, fontSize: '0.875rem' }}
      >
        {label}{required ? ' *' : ''}
      </Typography>
      {children}
      {helper && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block', fontSize: '0.75rem' }}>
          {helper}
        </Typography>
      )}
    </Box>
  )
}
