import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { colors } from '../../theme/muiTheme'

/**
 * Banner reutilizable del patrón Fase D (sugerencia + confirmación).
 * - mode="member": aviso informativo sin botones
 * - mode="coordinator": mensaje + Confirmar / Aún no
 */
export default function SugerenciaBanner({
  mode = 'member',
  children,
  confirmLabel = 'Confirmar',
  postponeLabel = 'Aún no',
  onConfirm,
  onPostpone,
  busy = false,
  sx = {},
}) {
  if (mode === 'member') {
    return (
      <Card
        sx={{
          mb: 2,
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
          ...sx,
        }}
      >
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {children}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.cream,
        ...sx,
      }}
    >
      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.65 }}>
        {children}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button variant="contained" disabled={busy} onClick={onConfirm}>
          {busy ? 'Guardando…' : confirmLabel}
        </Button>
        <Button
          variant="outlined"
          disabled={busy}
          onClick={onPostpone}
          sx={{ borderColor: colors.border, color: colors.dark }}
        >
          {postponeLabel}
        </Button>
      </Stack>
    </Box>
  )
}
