import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { HEADER_HEIGHT } from '../../utils/marketingNav'
import SectionHeading from '../../components/landing/SectionHeading'
import ScrollSection, { PublicContainer } from '../../components/landing/ScrollSection'
import { LANDING_IMAGES } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

const SECTION_LINKS = [
  { label: 'El Movimiento', to: '/movimiento', desc: 'Quiénes somos, propósito, equipo y espiritualidad franciscana.' },
  { label: 'Pedagogía Espiritual', to: '/pedagogia-espiritual', desc: 'Qué es, la Trinidad y el desarrollo de la sesión semanal.' },
  { label: 'Formación', to: '/formacion', desc: 'Etapas del camino, grupos de pastoreo y diario semanal.' },
  { label: 'Itinerario formativo', to: '/itinerario', desc: 'Los diez ejes del itinerario formativo del movimiento.' },
]

export default function HomePage() {
  return (
    <>
      <Box
        id="inicio"
        component="section"
        sx={{ pt: `${HEADER_HEIGHT}px`, pb: { xs: 8, md: 12 }, scrollMarginTop: HEADER_HEIGHT + 16 }}
      >
        <Box className="landing-hero-image-wrap">
          <Box component="img" src={LANDING_IMAGES.hero} alt="Basílica de San Francisco de Asís" className="landing-hero-image" />
          <Box className="landing-hero-overlay" />
        </Box>
        <PublicContainer sx={{ position: 'relative', mt: { xs: -8, md: -12 } }}>
          <Box className="landing-block landing-block--filled landing-hero-content">
            <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 2 }}>
              Movimiento Franciscano
            </Typography>
            <Typography
              variant="h1"
              className="font-display"
              sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 400, mb: 2.5, lineHeight: 1.15, color: colors.dark, maxWidth: 640 }}
            >
              Pedagogía Espiritual de la Santísima Trinidad
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 540 }}>
              Un camino personal por etapas — con manuales interactivos, diario semanal y acompañamiento
              de coordinadores. Menos aula, más vida compartida.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component={RouterLink} to="/registro" variant="contained" className="landing-btn">Comenzar mi camino</Button>
              <Button component={RouterLink} to="/formacion#modulos" variant="text" className="landing-btn" sx={{ color: colors.primary }}>Ver las etapas</Button>
            </Stack>
          </Box>
        </PublicContainer>
      </Box>

      <ScrollSection alt>
        <SectionHeading
          overline="Explora"
          title="Conoce el movimiento"
          subtitle="Cada apartado tiene su propia página con toda la información."
        />
        <Grid container spacing={2}>
          {SECTION_LINKS.map((item) => (
            <Grid key={item.to} size={{ xs: 12, sm: 6 }}>
              <Box
                component={RouterLink}
                to={item.to}
                className="landing-block card-hover"
                sx={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}
              >
                <Typography variant="h3" className="font-display" sx={{ fontSize: '1.25rem', mb: 1, color: colors.primary }}>
                  {item.label}
                </Typography>
                <Typography variant="body1" color="text.secondary">{item.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </ScrollSection>
    </>
  )
}
