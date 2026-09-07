import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Link,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { MessageCircle, Phone } from 'lucide-react'
import { DOCK_HEIGHT_REM, colors } from '../../theme/muiTheme'
import { useA11y } from '../../context/A11yContext'

/** Placeholders — reemplazar cuando haya datos reales */
export const HELP_CONTACT = {
  phoneDisplay: '+52 55 0000 0000',
  phoneTel: '+525500000000',
  whatsappDisplay: '+52 55 0000 0000',
  whatsappUrl: 'https://wa.me/525500000000',
}

/**
 * @param {'member' | 'public'} variant
 * @param {() => void} [onStartTour]
 * @param {boolean} [aboveDock]
 */
export default function HelpFab({
  variant = 'public',
  onStartTour,
  aboveDock = false,
}) {
  const [open, setOpen] = useState(false)
  const showMemberActions = variant === 'member'
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    textSizeOptions,
  } = useA11y()

  const cerrar = () => setOpen(false)

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        aria-label="Abrir opciones de ayuda y contacto"
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 24 },
          bottom: aboveDock
            ? `calc(${DOCK_HEIGHT_REM}rem + 1rem + env(safe-area-inset-bottom))`
            : { xs: 24, md: 28 },
          zIndex: (t) => t.zIndex.snackbar,
          borderRadius: 999,
          px: 2.5,
          minHeight: 48,
          bgcolor: colors.primary,
          color: '#fff',
          boxShadow: '0 4px 16px rgba(3, 14, 48, 0.2)',
          '&:hover': { bgcolor: colors.blue },
        }}
      >
        ¿Necesitas ayuda?
      </Button>

      <Dialog
        open={open}
        onClose={cerrar}
        fullWidth
        maxWidth="xs"
        aria-labelledby="ayuda-titulo"
      >
        <DialogTitle id="ayuda-titulo" sx={{ fontWeight: 400 }}>
          ¿Necesitas ayuda?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
            Estamos para acompañarte. Elige una opción:
          </Typography>

          {showMemberActions && (
            <Stack spacing={1.5} sx={{ mb: 2.5 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  cerrar()
                  onStartTour?.()
                }}
              >
                Ver recorrido guiado
              </Button>
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography
            id="ayuda-tamano-label"
            variant="subtitle1"
            sx={{ mb: 1.5, fontWeight: 500 }}
          >
            Tamaño de texto
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            role="radiogroup"
            aria-labelledby="ayuda-tamano-label"
            sx={{ mb: 1 }}
          >
            {textSizeOptions.map((opt) => {
              const selected = textSize === opt.id
              return (
                <Button
                  key={opt.id}
                  role="radio"
                  aria-checked={selected}
                  aria-label={`Tamaño de texto ${opt.label}`}
                  variant={selected ? 'contained' : 'outlined'}
                  onClick={() => setTextSize(opt.id)}
                  sx={{
                    minHeight: 44,
                    minWidth: 44,
                    flex: '1 1 auto',
                    px: 1.5,
                  }}
                >
                  {opt.label}
                </Button>
              )
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Contraste
          </Typography>
          <FormControlLabel
            sx={{
              mx: 0,
              width: '100%',
              justifyContent: 'space-between',
              minHeight: 48,
            }}
            labelPlacement="start"
            label={(
              <Typography variant="body1" sx={{ pr: 2 }}>
                Modo alto contraste
              </Typography>
            )}
            control={(
              <Switch
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                inputProps={{
                  'aria-label': 'Activar o desactivar modo alto contraste',
                }}
                color="primary"
              />
            )}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
            Contacto directo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Si prefieres hablar con alguien del equipo:
          </Typography>

          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Phone size={18} color={colors.primary} aria-hidden />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Teléfono
                </Typography>
                <Link href={`tel:${HELP_CONTACT.phoneTel}`} underline="hover" color="primary">
                  {HELP_CONTACT.phoneDisplay}
                </Link>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <MessageCircle size={18} color={colors.primary} aria-hidden />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  WhatsApp
                </Typography>
                <Link
                  href={HELP_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  color="primary"
                >
                  {HELP_CONTACT.whatsappDisplay}
                </Link>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 2 }}>
          <Button onClick={cerrar} variant="outlined">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
