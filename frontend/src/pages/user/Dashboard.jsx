import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Divider,
} from '@mui/material'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useAuth } from '../../context/AuthContext'
import { pedagogiaAPI, communicationsAPI, groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import LoadingScreen from '../../components/common/LoadingScreen'
import AnimatedProgress from '../../components/common/AnimatedProgress'
import { staggerContainer, staggerItem } from '../../animations/variants'

const quickLinks = [
  { to: '/app/ficha', label: 'Ficha pedagógica y checklist' },
  { to: '/app/videos', label: 'Videos formativos' },
  { to: '/app/contenidos', label: 'Biblioteca de contenidos' },
  { to: '/app/grupos', label: 'Grupos de pastoreo' },
  { to: '/app/comunicacion', label: 'Comunicación interna' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [ficha, setFicha] = useState(null)
  const [anuncios, setAnuncios] = useState([])
  const [grupos, setGrupos] = useState([])
  const [noLeidos, setNoLeidos] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      pedagogiaAPI.miFicha().catch(() => null),
      communicationsAPI.anuncios().catch(() => ({ data: { results: [] } })),
      groupsAPI.misGrupos().catch(() => ({ data: [] })),
      communicationsAPI.noLeidos().catch(() => ({ data: { count: 0 } })),
    ]).then(([fichaRes, anunciosRes, gruposRes, leidosRes]) => {
      if (fichaRes) setFicha(fichaRes.data)
      const anunciosData = anunciosRes.data.results || anunciosRes.data
      setAnuncios(Array.isArray(anunciosData) ? anunciosData.slice(0, 3) : [])
      setGrupos(gruposRes.data.results || gruposRes.data || [])
      setNoLeidos(leidosRes.data.count || 0)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen />

  const progreso = ficha?.progreso_general ?? 0
  const checklist = ficha?.checklist || []
  const completadas = checklist.filter((c) => c.completada).length

  return (
    <>
      <PageHeader
        title={`Bienvenido, ${user?.first_name || user?.username}`}
        subtitle="Resumen de tu formación y actividad en la plataforma"
      />

      <Box component={motion.div} variants={staggerContainer} initial="initial" animate="animate">
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard label="Progreso pedagógico" value={`${progreso}%`} sublabel={`${completadas} de ${checklist.length || 10} preguntas`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard label="Grupos de pastoreo" value={grupos.length} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard label="Mensajes sin leer" value={noLeidos} accent={noLeidos > 0 ? '#5B7C99' : undefined} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              label="Módulo actual"
              value={ficha?.modulo_actual_detalle?.nombre?.split('—').pop()?.trim() || '—'}
              sublabel="Manual en curso"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div variants={staggerItem}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h3" gutterBottom>
                    Ficha pedagógica
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Avance global del checklist de reflexión espiritual
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1 }}>
                    <Typography variant="overline" color="text.secondary">
                      Completado
                    </Typography>
                    <Typography variant="h3" color="secondary.main">
                      {progreso}%
                    </Typography>
                  </Stack>
                  <AnimatedProgress value={progreso} sx={{ mb: 2.5 }} />
                  <Button
                    component={RouterLink}
                    to="/app/ficha"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    className="btn-glow"
                  >
                    Continuar ficha
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div variants={staggerItem}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h3" gutterBottom>
                    Accesos directos
                  </Typography>
                  <List dense disablePadding>
                    {quickLinks.map((link, i) => (
                      <Box key={link.to} component={motion.div} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        {i > 0 && <Divider />}
                        <ListItem
                          component={RouterLink}
                          to={link.to}
                          sx={{
                            px: 0,
                            py: 1.25,
                            color: 'text.primary',
                            textDecoration: 'none',
                            '&:hover': { color: 'secondary.main' },
                          }}
                        >
                          <ListItemText
                            primary={link.label}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          />
                          <ArrowForwardIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {anuncios.length > 0 && (
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Typography variant="h3" gutterBottom>
                  Anuncios institucionales
                </Typography>
                <Stack divider={<Divider />} spacing={0}>
                  {anuncios.map((a, i) => (
                    <Box
                      key={a.id}
                      component={motion.div}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.35 }}
                      sx={{ py: 2 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle1">{a.titulo}</Typography>
                        {a.importante && <Chip label="Importante" size="small" color="warning" variant="outlined" />}
                      </Stack>
                      <Typography variant="body2">{a.contenido.substring(0, 160)}…</Typography>
                    </Box>
                  ))}
                </Stack>
                <Link component={RouterLink} to="/app/comunicacion" variant="body2" sx={{ mt: 1, display: 'inline-block' }}>
                  Ver todos los anuncios
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Box>
    </>
  )
}
