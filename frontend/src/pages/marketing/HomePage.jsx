import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import MovimientoSections from '../../components/landing/MovimientoSections'
import Reveal from '../../components/landing/motion/Reveal'
import RevealStagger, { RevealStaggerItem } from '../../components/landing/motion/RevealStagger'
import { HEADER_HEIGHT } from '../../utils/marketingNav'
import SectionHeading from '../../components/landing/SectionHeading'
import ScrollSection, { PublicContainer } from '../../components/landing/ScrollSection'
import { LANDING_IMAGES } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

const SECTION_LINKS = [
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
        className="story-section"
        sx={{
          position: 'relative',
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          scrollMarginTop: HEADER_HEIGHT + 16,
          pb: { xs: 3, md: 4 },
        }}
      >
        <Box
          className="landing-hero-image-wrap"
          sx={{
            position: 'absolute',
            inset: 0,
            mt: 0,
            height: '100%',
            zIndex: 0,
          }}
        >
          <Box component="img" src={LANDING_IMAGES.hero} alt="Basílica de San Francisco de Asís" className="landing-hero-image" />
          <Box className="landing-hero-overlay" />
        </Box>

        <PublicContainer sx={{ position: 'relative', zIndex: 1 }}>
          <Reveal y={28} scale={0.98}>
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
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 540, fontSize: '1.0625rem', lineHeight: 1.8 }}>
                Un camino personal por etapas — con manuales interactivos, diario semanal y acompañamiento
                de coordinadores. Menos aula, más vida compartida.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button component={RouterLink} to="/registro" variant="contained" className="landing-btn">Comenzar mi camino</Button>
                <Button component={RouterLink} to="/formacion#modulos" variant="text" className="landing-btn" sx={{ color: colors.primary }}>Ver las etapas</Button>
              </Stack>
            </Box>
          </Reveal>
        </PublicContainer>
      </Box>

      <MovimientoSections />

      <ScrollSection alt size="content" contentMaxWidth={800} sx={{ pt: { xs: 3.5, md: 4.5 }, px: { xs: 3, md: 4, lg: 6 } }}>
        <SectionHeading
          overline="Explora"
          title="Sigue conociendo"
          subtitle="Pedagogía, formación e itinerario en páginas dedicadas."
        />
        <RevealStagger sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            {SECTION_LINKS.map((item) => (
              <Grid key={item.to} size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
                <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                  <Box
                    component={RouterLink}
                    to={item.to}
                    className="landing-block card-hover"
                    sx={{
                      flex: 1,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      p: 1.5,
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <Typography variant="h3" className="font-display" sx={{ fontSize: '1.25rem', mb: 0.75, color: colors.primary, whiteSpace: { md: 'nowrap' } }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.75 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>
      </ScrollSection>
    </>
  )
}
