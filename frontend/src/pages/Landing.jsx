import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import ChurchOutlinedIcon from '@mui/icons-material/ChurchOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import MarketingNav, { HEADER_HEIGHT } from '../components/landing/MarketingNav'
import MarketingFooter from '../components/landing/MarketingFooter'
import SectionHeading from '../components/landing/SectionHeading'
import MeshBackground from '../components/common/MeshBackground'
import { MODULOS_PREVIEW } from '../data/marketingContent'
import { staggerContainer, staggerItem } from '../animations/variants'

const sectionSx = {
  py: { xs: 6, md: 10 },
  scrollMarginTop: HEADER_HEIGHT + 16,
  position: 'relative',
  zIndex: 1,
}

const altBg = { bgcolor: 'rgba(255,255,255,0.6)' }

function FeatureCard({ icon: Icon, title, children }) {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -4 }}>
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'primary.main' }}>
          <Icon />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{children}</Typography>
      </Paper>
    </motion.div>
  )
}

export default function Landing() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <MeshBackground />
      <MarketingNav />

      {/* HERO */}
      <Box id="inicio" component="section" sx={{ ...sectionSx, pt: `${HEADER_HEIGHT + 48}px`, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box component={motion.div} initial="initial" animate="animate" variants={staggerContainer}>
                <motion.div variants={staggerItem}>
                  <Typography variant="overline" color="secondary.main">Movimiento Franciscano</Typography>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Typography variant="h1" className="gradient-text" sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' }, mb: 2, lineHeight: 1.15 }}>
                    Pedagogía Espiritual de la Santísima Trinidad
                  </Typography>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 540, fontSize: '1.05rem' }}>
                    Un camino de formación integral que acompaña a cada persona en su crecimiento en la fe,
                    la fraternidad y el servicio, desde la espiritualidad franciscana.
                  </Typography>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button component={RouterLink} to="/registro" variant="contained" size="large" className="btn-glow" sx={{ px: 4 }}>
                      Unirme al movimiento
                    </Button>
                    <Button href="#que-es-pedagogia" variant="outlined" size="large" sx={{ px: 4 }}>
                      Conocer la pedagogía
                    </Button>
                  </Stack>
                </motion.div>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.9)', border: 1, borderColor: 'divider' }}>
                  <Typography variant="overline" color="text.secondary">Plataforma formativa</Typography>
                  <Typography variant="h3" sx={{ mb: 2 }}>Tu camino, acompañado</Typography>
                  <Stack spacing={1.5}>
                    {['Ficha pedagógica con checklist de reflexión', 'Módulos formativos progresivos', 'Grupos de pastoreo y comunidad', 'Seguimiento y acompañamiento personal'].map((t) => (
                      <Stack key={t} direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main', mt: 1, flexShrink: 0 }} />
                        <Typography variant="body2">{t}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button component={RouterLink} to="/login" fullWidth variant="contained" sx={{ mt: 3 }} className="btn-glow">
                    Acceder a la plataforma
                  </Button>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* QUIÉNES SOMOS */}
      <Box id="quienes-somos" component="section" sx={{ ...sectionSx, ...altBg }}>
        <Container maxWidth="lg">
          <SectionHeading
            overline="El Movimiento"
            title="Quiénes somos"
            subtitle="Somos una comunidad de fe que promueve la formación espiritual desde la pedagogía, el acompañamiento y la vida fraterna."
          />
          <Grid container spacing={3} component={motion.div} initial="initial" whileInView="animate" viewport={{ once: true }} variants={staggerContainer}>
            <Grid size={{ xs: 12, md: 4 }}><FeatureCard icon={ChurchOutlinedIcon} title="Misión evangelizadora">Anunciar el Evangelio con sencillez, alegría y testimonio de vida.</FeatureCard></Grid>
            <Grid size={{ xs: 12, md: 4 }}><FeatureCard icon={GroupsOutlinedIcon} title="Comunidad fraterna">Caminar juntos en grupos de pastoreo, mutuo apoyo y responsabilidad compartida.</FeatureCard></Grid>
            <Grid size={{ xs: 12, md: 4 }}><FeatureCard icon={VolunteerActivismOutlinedIcon} title="Servicio">Responder al amor de Dios con obras de caridad y presencia entre los más necesitados.</FeatureCard></Grid>
          </Grid>
        </Container>
      </Box>

      {/* HISTORIA */}
      <Box id="historia" component="section" sx={sectionSx}>
        <Container maxWidth="md">
          <SectionHeading overline="El Movimiento" title="Nuestra historia" subtitle="Un camino de fe que continúa escribiéndose en cada generación." />
          <Paper sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              El Movimiento Franciscano — Pedagogía Espiritual de la Santísima Trinidad nace del deseo de ofrecer
              un proceso formativo sistemático, humano y espiritual, que permita a cada miembro crecer en su relación
              con Dios Padre, Hijo y Espíritu Santo.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Inspirados en la espiritualidad de San Francisco de Asís, hemos desarrollado una pedagogía que integra
              la oración, la reflexión, la comunidad y el servicio, con herramientas concretas de seguimiento y acompañamiento.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hoy, la plataforma digital permite extender esta formación, conectar grupos de pastoreo y registrar
              el avance espiritual de quienes caminan con nosotros.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* ESPIRITUALIDAD */}
      <Box id="espiritualidad" component="section" sx={{ ...sectionSx, ...altBg }}>
        <Container maxWidth="lg">
          <SectionHeading overline="El Movimiento" title="Espiritualidad franciscana" subtitle="Paz, sencillez, fraternidad y amor a la creación como pilares del camino." />
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                {[
                  { t: 'Paz y bien', d: 'Saludar la vida con gratitud y proclamar la paz en cada encuentro.' },
                  { t: 'Pobreza evangélica', d: 'Desprenderse de lo superfluo para abrazar lo esencial.' },
                  { t: 'Fraternidad universal', d: 'Reconocer a todo ser creado como hermano y hermana.' },
                  { t: 'Contemplación y acción', d: 'Orar y servir como dos alas de una misma vida.' },
                ].map((item) => (
                  <Box key={item.t} sx={{ borderLeft: 3, borderColor: 'secondary.main', pl: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>{item.t}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.d}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <FavoriteBorderOutlinedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ color: 'inherit', mb: 1 }}>Señor, hazme instrumento de tu paz</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Oración atribuida a San Francisco de Asís</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* QUÉ ES PEDAGOGÍA */}
      <Box id="que-es-pedagogia" component="section" sx={sectionSx}>
        <Container maxWidth="lg">
          <SectionHeading
            overline="Pedagogía Espiritual"
            title="¿Qué es la pedagogía espiritual?"
            subtitle="Un método de formación que acompaña el crecimiento en la fe de manera ordenada, personal y comunitaria."
          />
          <Grid container spacing={3}>
            {[
              { icon: AssignmentOutlinedIcon, title: 'Acompañamiento', text: 'Seguimiento personal mediante la ficha pedagógica y el checklist de reflexión.' },
              { icon: AutoStoriesOutlinedIcon, title: 'Formación progresiva', text: 'Módulos que estructuran el camino desde la búsqueda hasta la misión.' },
              { icon: MenuBookOutlinedIcon, title: 'Formación estructurada', text: 'Cada etapa del camino tiene objetivos claros y acompañamiento ordenado.' },
            ].map(({ icon: Icon, title, text }) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ color: 'secondary.main', mb: 1.5 }}><Icon sx={{ fontSize: 32 }} /></Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>{title}</Typography>
                    <Typography variant="body2" color="text.secondary">{text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TRINIDAD */}
      <Box id="santisima-trinidad" component="section" sx={{ ...sectionSx, ...altBg }}>
        <Container maxWidth="md">
          <SectionHeading
            overline="Pedagogía Espiritual"
            title="La Santísima Trinidad"
            subtitle="El misterio central de nuestra fe: Dios es comunión de amor entre Padre, Hijo y Espíritu Santo."
          />
          <Grid container spacing={2}>
            {[
              { role: 'Padre', desc: 'Origen y destino de toda la vida. El Dios que nos crea y nos llama por nombre.' },
              { role: 'Hijo', desc: 'Jesucristo, camino, verdad y vida. Modelo de entrega y servicio.' },
              { role: 'Espíritu Santo', desc: 'Fuerza santificadora que guía, consuela y envía a la misión.' },
            ].map((p) => (
              <Grid key={p.role} size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                  <Typography variant="overline" color="secondary.main">{p.role}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{p.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CAMINO FORMATIVO */}
      <Box id="camino-formativo" component="section" sx={sectionSx}>
        <Container maxWidth="lg">
          <SectionHeading overline="Formación" title="Camino formativo" subtitle="Cuatro módulos que estructuran el proceso de crecimiento espiritual." />
          <Grid container spacing={2} id="modulos">
            {MODULOS_PREVIEW.map((m, i) => (
              <Grid key={m.num} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card sx={{ height: '100%', borderTop: 3, borderColor: 'secondary.main' }}>
                    <CardContent>
                      <Typography variant="overline" color="text.secondary">Módulo {m.num}</Typography>
                      <Typography variant="h4" gutterBottom>{m.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{m.desc}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* GRUPOS PASTOREO */}
      <Box id="grupos-pastoreo" component="section" sx={{ ...sectionSx, ...altBg }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <SectionHeading align="left" overline="Formación" title="Grupos de pastoreo" subtitle="La formación se vive en comunidad. Cada grupo es un espacio de encuentro, oración y crecimiento compartido." />
              <Button component={RouterLink} to="/registro" variant="contained" className="btn-glow">Encontrar mi grupo</Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {['Reuniones periódicas de formación', 'Esquemas de sesión y materiales de apoyo', 'Coordinador y acompañante espiritual', 'Comunicación interna entre miembros'].map((t) => (
                    <Stack key={t} direction="row" spacing={1.5} alignItems="center">
                      <GroupsOutlinedIcon color="secondary" fontSize="small" />
                      <Typography variant="body2">{t}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FICHA PEDAGÓGICA */}
      <Box id="ficha-pedagogica" component="section" sx={sectionSx}>
        <Container maxWidth="md">
          <Paper sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <AssignmentOutlinedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography variant="h2" sx={{ color: 'inherit', mb: 2 }}>Ficha pedagógica</Typography>
            <Typography sx={{ opacity: 0.85, mb: 3, maxWidth: 520, mx: 'auto' }}>
              Un checklist de diez preguntas de reflexión que mide tu avance espiritual y te ayuda
              a registrar tu camino de formación en la plataforma.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button component={RouterLink} to="/registro" variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}>
                Crear mi ficha
              </Button>
              <Button component={RouterLink} to="/login" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                Ya tengo cuenta
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* CONTACTO */}
      <Box id="contacto" component="section" sx={sectionSx}>
        <Container maxWidth="sm">
          <SectionHeading overline="Contacto" title="Escríbenos" subtitle="¿Tienes preguntas sobre el movimiento o la formación? Contáctanos." />
          <Paper component="form" sx={{ p: { xs: 3, md: 4 } }} onSubmit={(e) => e.preventDefault()}>
            <Stack spacing={2}>
              <TextField label="Nombre completo" required fullWidth />
              <TextField label="Correo electrónico" type="email" required fullWidth />
              <TextField label="Asunto" fullWidth />
              <TextField label="Mensaje" multiline rows={4} required fullWidth />
              <Button type="submit" variant="contained" size="large" className="btn-glow">Enviar mensaje</Button>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                También puedes registrarte directamente para acceder a la plataforma formativa.
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <MarketingFooter />
    </Box>
  )
}
