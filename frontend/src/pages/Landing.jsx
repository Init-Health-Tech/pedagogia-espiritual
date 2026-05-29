import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import MeshBackground from '../components/common/MeshBackground'
import { fadeInUp, staggerContainer, staggerItem } from '../animations/variants'

const features = [
  {
    icon: AssignmentOutlinedIcon,
    title: 'Ficha pedagógica',
    text: 'Checklist de diez preguntas y seguimiento de tu avance espiritual por módulos.',
  },
  {
    icon: MenuBookOutlinedIcon,
    title: 'Contenidos formativos',
    text: 'Videos, presentaciones, documentos y esquemas para tu formación.',
  },
  {
    icon: GroupsOutlinedIcon,
    title: 'Grupos de pastoreo',
    text: 'Comunidad, esquemas de sesión y acompañamiento en grupo.',
  },
  {
    icon: MailOutlinedIcon,
    title: 'Comunicación interna',
    text: 'Anuncios y mensajería para mantenerte conectado con el movimiento.',
  },
]

export default function Landing() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <MeshBackground />
      <AppBar
        position="static"
        elevation={0}
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="primary">
              Movimiento Franciscano
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pedagogía Espiritual — SST
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/login" color="inherit">
              Iniciar sesión
            </Button>
            <Button
              component={RouterLink}
              to="/registro"
              variant="contained"
              className="btn-glow"
            >
              Registrarse
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="section"
        sx={{
          flex: 1,
          py: { xs: 6, md: 10 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="md">
          <Box
            component={motion.div}
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            textAlign="center"
          >
            <motion.div variants={staggerItem}>
              <Typography
                variant="h1"
                component="h2"
                className="gradient-text"
                sx={{ fontSize: { xs: '2rem', md: '2.85rem' }, mb: 2, fontWeight: 600 }}
              >
                Camino de formación espiritual
              </Typography>
            </motion.div>
            <motion.div variants={staggerItem}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 560, mx: 'auto' }}
              >
                Plataforma académica para el crecimiento en la fe, el seguimiento pedagógico
                y la formación en comunidad del Movimiento Franciscano.
              </Typography>
            </motion.div>
            <motion.div variants={staggerItem}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  component={RouterLink}
                  to="/registro"
                  variant="contained"
                  size="large"
                  className="btn-glow"
                  sx={{ px: 4 }}
                >
                  Comenzar formación
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  color="primary"
                  sx={{ px: 4 }}
                >
                  Acceder a la plataforma
                </Button>
              </Stack>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8, position: 'relative', zIndex: 1 }}>
        <Box
          component={motion.div}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <Grid container spacing={2}>
            {features.map(({ icon: Icon, title, text }) => (
              <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      textAlign: 'center',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover': { boxShadow: '0 16px 48px rgba(26,35,50,0.1)' },
                    }}
                  >
                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: 'primary.main',
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {title}
                    </Typography>
                    <Typography variant="body2">{text}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Box
        component={motion.footer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        sx={{ py: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          © {new Date().getFullYear()} Movimiento Franciscano — Pedagogía Espiritual de la Santísima Trinidad
        </Typography>
      </Box>
    </Box>
  )
}
