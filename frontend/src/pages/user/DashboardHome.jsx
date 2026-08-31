import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { BookOpen, ClipboardList, MessageCircle, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import HubActionCard from '../../components/common/HubActionCard'
import AnimatedProgress from '../../components/common/AnimatedProgress'
import { staggerContainer, staggerItem } from '../../animations/variants'
import { colors } from '../../theme/muiTheme'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const DAYS_FOR_FREQUENT = 7
const INTERACTIONS_FOR_FREQUENT = 3

const shortcutCards = [
  {
    icon: ClipboardList,
    title: 'Mi camino',
    description: 'Diario semanal y manuales interactivos por etapa.',
    to: '/app/ficha',
  },
  {
    icon: BookOpen,
    title: 'Contenidos',
    description: 'Videos, manuales y materiales de cada módulo.',
    to: '/app/contenidos',
  },
  {
    icon: Users,
    title: 'Grupos de pastoreo',
    description: 'Tu comunidad de camino y encuentro.',
    to: '/app/grupos',
  },
  {
    icon: MessageCircle,
    title: 'Mensajes',
    description: 'Comunícate con tu coordinador y tu grupo.',
    to: '/app/comunicacion',
  },
]

function daysSince(isoDate) {
  if (!isoDate) return 0
  const then = new Date(isoDate)
  if (Number.isNaN(then.getTime())) return 0
  return Math.floor((Date.now() - then.getTime()) / (1000 * 60 * 60 * 24))
}

export default function DashboardHome({ ficha, anuncios = [], grupos = [] }) {
  const { user } = useAuth()
  const progreso = ficha?.progreso_general ?? 0
  const nombre = user?.first_name || user?.username || 'hermano/a'
  const isNew = progreso === 0

  const completedItems = (ficha?.checklist || []).filter((item) => item.completada).length
  const hasRepeatedUse = completedItems >= INTERACTIONS_FOR_FREQUENT
    || (progreso > 0 && daysSince(user?.date_joined) >= DAYS_FOR_FREQUENT)

  const continueTo = ficha?.modulo_actual ? '/app/ficha' : '/app/ficha-espiritual'
  const continueLabel = ficha?.modulo_actual_detalle?.nombre
    ? `Continúa: ${ficha.modulo_actual_detalle.nombre}`
    : 'Ficha pedagógica – Espiritual'

  const actividad = [
    ...anuncios.map((a) => ({
      id: `anuncio-${a.id}`,
      texto: `Nuevo anuncio: ${a.titulo}`,
      tiempo: 'Reciente',
    })),
    ...grupos.slice(0, 2).map((g) => ({
      id: `grupo-${g.id}`,
      texto: `Perteneces al grupo ${g.nombre}`,
      tiempo: 'Tu comunidad',
    })),
  ]

  return (
    <Box component={motion.div} variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <Typography variant="h2" component="h1" sx={{ mb: 0.5, fontWeight: 300, color: colors.dark }}>
          {getGreeting()}, {nombre}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Este es tu espacio de formación. Elige por dónde continuar hoy.
        </Typography>
      </motion.div>

      {ficha && (
        <motion.div variants={staggerItem}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: `1px solid ${colors.border}` }}>
            {isNew ? (
              <Stack spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
                <Typography variant="h3" sx={{ fontWeight: 400, color: colors.dark }}>
                  Estás por comenzar tu camino de formación
                </Typography>
                <Button
                  component={RouterLink}
                  to={continueTo}
                  variant="contained"
                  color="secondary"
                >
                  Da el primer paso →
                </Button>
              </Stack>
            ) : (
              <>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ sm: 'center' }}
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Typography variant="overline">Tu progreso</Typography>
                    <Typography variant="body1">Diario semanal y etapas de formación</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: colors.primary, fontWeight: 500 }}>{progreso}%</Typography>
                </Stack>
                <AnimatedProgress value={progreso} />
              </>
            )}
          </Paper>
        </motion.div>
      )}

      <motion.div variants={staggerItem}>
        <Typography variant="overline" sx={{ display: 'block', mb: 2 }}>
          {hasRepeatedUse ? 'Acciones frecuentes' : 'Continúa aquí'}
        </Typography>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Box
          component={RouterLink}
          to={continueTo}
          sx={{
            display: 'block',
            mb: 2.5,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Paper
            className="card-hover"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              overflow: 'visible',
              transition: 'border-color 0.2s, transform 0.2s',
              '&:hover': {
                borderColor: colors.primary,
                transform: 'scale(1.005)',
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                minWidth: 48,
                minHeight: 48,
                borderRadius: 2,
                bgcolor: `${colors.moss}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.moss,
                flexShrink: 0,
                overflow: 'visible',
                '& svg': { display: 'block', overflow: 'visible' },
              }}
            >
              <BookOpen size={22} strokeWidth={1.75} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h3"
                className="font-display"
                sx={{
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  color: colors.dark,
                }}
              >
                {continueLabel.toUpperCase()}
              </Typography>
              {!hasRepeatedUse && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Retoma donde lo dejaste, o empieza por el primer contenido de tu etapa.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </motion.div>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {shortcutCards.map((card) => (
          <Grid key={card.to} size={{ xs: 12, sm: 6 }}>
            <motion.div variants={staggerItem} style={{ height: '100%' }}>
              <HubActionCard {...card} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div variants={staggerItem}>
        <Typography variant="overline" sx={{ display: 'block', mb: 2 }}>Actividad reciente</Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
          {actividad.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Aún no hay actividad reciente.{' '}
                <Box component={RouterLink} to="/app/ficha" sx={{ color: colors.primary, textDecoration: 'none', fontWeight: 500 }}>
                  Comienza tu ficha pedagógica
                </Box>
              </Typography>
            </Box>
          ) : (
            actividad.map((item, i) => (
              <Box
                key={item.id}
                sx={{
                  px: 3,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderTop: i > 0 ? `1px solid ${colors.border}` : 'none',
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary, flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1">{item.texto}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.tiempo}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Paper>
      </motion.div>
    </Box>
  )
}
