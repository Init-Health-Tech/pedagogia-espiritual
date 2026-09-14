import { Stack, Typography } from '@mui/material'
import FichaProgresoVista from './FichaProgresoVista'

/** Pestaña "Mi progreso" del portal miembro — reutiliza FichaProgresoVista. */
export default function MiProgresoTab({ ficha }) {
  return (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h3" sx={{ mb: 0.5 }}>Mi progreso</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Un vistazo a tu constancia, cómo te has percibido y tu praxis a lo largo del camino.
      </Typography>
      <FichaProgresoVista
        ficha={ficha}
        variant="member"
        showResumenCards
        showPerfil={false}
      />
    </Stack>
  )
}
