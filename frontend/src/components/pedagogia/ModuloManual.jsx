import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lightbulb, Sparkles } from 'lucide-react'
import { colors } from '../../theme/muiTheme'

function SectionContent({ seccion }) {
  if (seccion.tipo === 'hero') {
    return (
      <Box>
        {seccion.imagen && (
          <Box
            component="img"
            src={seccion.imagen}
            alt=""
            sx={{
              width: '100%',
              height: 220,
              objectFit: 'cover',
              borderRadius: 3,
              mb: 3,
            }}
          />
        )}
        <Typography variant="overline" color="secondary">{seccion.subtitulo}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
          {seccion.contenido}
        </Typography>
      </Box>
    )
  }

  if (seccion.tipo === 'tip') {
    return (
      <Card sx={{ bgcolor: `${colors.primary}10`, border: `1px solid ${colors.primary}33`, boxShadow: 'none' }}>
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box sx={{ color: colors.primary, mt: 0.25 }}>
              <Lightbulb size={22} />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ color: colors.primary }}>{seccion.titulo}</Typography>
              <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.8 }}>{seccion.contenido}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  if (seccion.tipo === 'reflexion') {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Sparkles size={28} color={colors.primary} style={{ marginBottom: 12 }} />
        <Typography variant="h3" className="font-display" sx={{ fontSize: '1.35rem', mb: 2 }}>
          {seccion.pregunta}
        </Typography>
        <Typography variant="body2" color="text.secondary">{seccion.contenido}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {seccion.imagen && (
        <Box
          component="img"
          src={seccion.imagen}
          alt=""
          sx={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            borderRadius: 3,
            mb: 2.5,
          }}
        />
      )}
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85 }}>
        {seccion.contenido}
      </Typography>
    </Box>
  )
}

export default function ModuloManual({ modulo, onClose }) {
  const secciones = modulo?.contenido_manual?.length
    ? modulo.contenido_manual
    : []
  const [index, setIndex] = useState(0)

  if (!secciones.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Este manual interactivo estará disponible pronto. Mientras tanto, consulta los materiales de tu etapa.
          </Typography>
          {onClose && (
            <Button onClick={onClose} sx={{ mt: 2 }}>Volver</Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const actual = secciones[index]
  const progreso = ((index + 1) / secciones.length) * 100

  return (
    <Card sx={{ overflow: 'hidden', border: `1px solid ${colors.border}` }}>
      <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="overline">Manual digital</Typography>
            <Typography variant="h3" className="font-display" sx={{ fontSize: '1.35rem' }}>
              {modulo.nombre}
            </Typography>
          </Box>
          <Chip label={`${index + 1} / ${secciones.length}`} size="small" variant="outlined" />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progreso}
          sx={{ mt: 2, height: 4, borderRadius: 2, bgcolor: colors.border }}
        />
      </Box>

      <CardContent sx={{ minHeight: 320 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={actual.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            {actual.tipo !== 'hero' && actual.tipo !== 'tip' && actual.tipo !== 'reflexion' && (
              <Typography variant="h3" className="font-display" sx={{ fontSize: '1.25rem', mb: 2 }}>
                {actual.titulo}
              </Typography>
            )}
            {actual.tipo === 'hero' && (
              <Typography variant="h3" className="font-display" sx={{ fontSize: '1.5rem', mb: 2 }}>
                {actual.titulo}
              </Typography>
            )}
            <SectionContent seccion={actual} />
          </motion.div>
        </AnimatePresence>
      </CardContent>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 2, borderTop: `1px solid ${colors.border}`, bgcolor: colors.surface }}
      >
        <IconButton
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          aria-label="Anterior"
        >
          <ChevronLeft />
        </IconButton>
        <Stack direction="row" spacing={0.75}>
          {secciones.map((s, i) => (
            <Box
              key={s.id}
              onClick={() => setIndex(i)}
              sx={{
                width: i === index ? 20 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: i === index ? colors.primary : colors.border,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </Stack>
        {index < secciones.length - 1 ? (
          <Button
            endIcon={<ChevronRight size={18} />}
            onClick={() => setIndex((i) => i + 1)}
            variant="contained"
            size="small"
          >
            Siguiente
          </Button>
        ) : (
          onClose ? (
            <Button onClick={onClose} variant="contained" size="small">Completar lectura</Button>
          ) : (
            <IconButton disabled aria-label="Fin"><ChevronRight /></IconButton>
          )
        )}
      </Stack>
    </Card>
  )
}
