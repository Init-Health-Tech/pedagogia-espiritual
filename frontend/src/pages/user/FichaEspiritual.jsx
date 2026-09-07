import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { colors } from '../../theme/muiTheme'

const SLIDES = [
  {
    subtitle: 'HORARIO DE VIDA',
    text: 'Es importante tener un horario de vida',
  },
  {
    subtitle: 'PROYECTO DE VIDA',
    text: 'Es importante tener un proyecto de vida personal, familiar y comunitario.',
  },
  {
    subtitle: 'RETIRO DE DIAGNÓSTICO',
    text: 'Conviene vivir un retiro espiritual para diagnóstico humano – espiritual.',
  },
  {
    subtitle: 'GRAFICAS SOBRE EL ESTADO DEL ALMA',
    text: 'Es importante anotar puntualmente las gráficas del estado psiquico del alma.',
  },
  {
    subtitle: 'GRAFICAS SOBRE ESTADO DEL ESPIRITU',
    text: 'Es importante anotar puntualmente las graficas sobre el estado del espiritu.',
  },
]

const AUTO_ADVANCE_MS = 10000

export default function FichaEspiritual() {
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]

  const goPrev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
  const goNext = () => setIndex((i) => (i + 1) % SLIDES.length)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [index])

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography
          component={RouterLink}
          to="/app"
          variant="body2"
          sx={{
            color: colors.primary,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          ← Volver al inicio
        </Typography>
      </Box>

      <PageHeader
        title="Ficha pedagógica – espiritual"
        subtitle="Espacio de acompañamiento para el cuidado del alma y el espíritu."
      />

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 720,
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2.5, sm: 4 } }}>
            <Typography
              variant="h3"
              className="font-display"
              align="center"
              sx={{
                fontWeight: 500,
                letterSpacing: '0.06em',
                color: colors.dark,
                fontSize: { xs: '1.05rem', sm: '1.3rem' },
                mb: 3,
              }}
            >
              ATENCIÓN DEL ALMA Y DEL ESPIRITU
            </Typography>

            <Box sx={{ minHeight: 120, textAlign: 'center', px: { xs: 0, sm: 2 } }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="overline"
                    display="block"
                    sx={{ letterSpacing: '0.08em', mb: 1.5, color: colors.primary }}
                  >
                    {slide.subtitle}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {slide.text}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ mt: 3, pt: 2, borderTop: `1px solid ${colors.border}` }}
            >
              <Button
                onClick={goPrev}
                aria-label="Anterior"
                startIcon={<ChevronLeft size={18} />}
                variant="outlined"
                size="small"
              >
                Anterior
              </Button>

              <Stack direction="row" spacing={0.5} alignItems="center">
                {SLIDES.map((_, i) => (
                  <Box
                    key={SLIDES[i].subtitle}
                    component="button"
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ir a diapositiva ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                    sx={{
                      appearance: 'none',
                      border: 'none',
                      bgcolor: 'transparent',
                      p: 0,
                      m: 0,
                      minWidth: 44,
                      minHeight: 44,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:focus-visible': {
                        outline: `3px solid ${colors.primary}`,
                        outlineOffset: 2,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: i === index ? 20 : 8,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: i === index ? colors.primary : colors.border,
                        transition: 'all 0.2s',
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Button
                onClick={goNext}
                aria-label="Siguiente"
                endIcon={<ChevronRight size={18} />}
                variant="outlined"
                size="small"
              >
                Siguiente
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
