import { Box } from '@mui/material'
import FichaProgresoVista from './FichaProgresoVista'

/** Pestaña "Mi progreso" del portal miembro — reutiliza FichaProgresoVista. */
export default function MiProgresoTab({ ficha }) {
  return (
    <Box sx={{ mb: 5 }}>
      <FichaProgresoVista
        ficha={ficha}
        variant="member"
        showResumenCards
        showPerfil={false}
      />
    </Box>
  )
}
