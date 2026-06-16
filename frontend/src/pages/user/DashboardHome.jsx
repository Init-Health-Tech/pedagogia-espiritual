import { Link as RouterLink } from 'react-router-dom'
import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { ClipboardList, PlayCircle, BookOpen, Users } from 'lucide-react'
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

const quickActions = [
  {
    icon: ClipboardList,
    title: 'Mi camino',
    description: 'Diario semanal y manuales interactivos por etapa.',
    to: '/app/ficha',
  },
  {
    icon: PlayCircle,
    title: 'Videos formativos',
    description: 'Clases y reflexiones en video para tu formación.',
    to: '/app/videos',
  },
  {
    icon: BookOpen,
    title: 'Biblioteca',
    description: 'Manuales y materiales de cada módulo.',
    to: '/app/contenidos',
  },
  {
    icon: Users,
    title: 'Grupos de pastoreo',
    description: 'Tu comunidad de camino y encuentro.',
    to: '/app/grupos',
  },
]

export default function DashboardHome({ ficha, anuncios = [], grupos = [] }) {
  const { user } = useAuth()
  const progreso = ficha?.progreso_general ?? 0
  const nombre = user?.first_name || user?.username || 'hermano/a'

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
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="overline">Tu progreso</Typography>
                <Typography variant="body1">Diario semanal y etapas de formación</Typography>
              </Box>
              <Typography variant="h3" sx={{ color: colors.accent, fontWeight: 500 }}>{progreso}%</Typography>
            </Stack>
            <AnimatedProgress value={progreso} />
          </Paper>
        </motion.div>
      )}

      <motion.div variants={staggerItem}>
        <Typography variant="overline" sx={{ display: 'block', mb: 2 }}>Acciones frecuentes</Typography>
      </motion.div>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid key={action.to} size={{ xs: 12, sm: 6, lg: 3 }}>
            <motion.div variants={staggerItem} style={{ height: '100%' }}>
              <HubActionCard {...action} />
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
                <Box component={RouterLink} to="/app/ficha" sx={{ color: colors.secondary, textDecoration: 'none', fontWeight: 500 }}>
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
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.accent, flexShrink: 0 }} />
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
