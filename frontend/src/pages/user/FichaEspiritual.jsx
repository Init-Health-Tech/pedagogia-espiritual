import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  IconButton,
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
            color: colors.secondary,
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
              spacing={1}
              sx={{ mt: 3, pt: 2, borderTop: `1px solid ${colors.border}` }}
            >
              <IconButton onClick={goPrev} aria-label="Anterior" size="small">
                <ChevronLeft size={22} />
              </IconButton>

              <Stack direction="row" spacing={0.75} sx={{ mx: 1 }}>
                {SLIDES.map((_, i) => (
                  <Box
                    key={SLIDES[i].subtitle}
                    onClick={() => setIndex(i)}
                    sx={{
                      width: i === index ? 20 : 8,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: i === index ? colors.secondary : colors.border,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Stack>

              <IconButton onClick={goNext} aria-label="Siguiente" size="small">
                <ChevronRight size={22} />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
