import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Stack, Typography } from '@mui/material'
import MovimientoSections from '../../components/landing/MovimientoSections'
import Reveal from '../../components/landing/motion/Reveal'
import { HEADER_HEIGHT } from '../../utils/marketingNav'
import ScrollSection, { PublicContainer } from '../../components/landing/ScrollSection'
import { LANDING_IMAGES } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

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
                Cuando la fe se siente vacía, hay un camino de vuelta
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 540, fontSize: '1.0625rem', lineHeight: 1.8 }}>
                Formación espiritual estructurada en cuatro etapas, acompañada por quienes ya vivieron
                este proceso. Menos aula, más vida compartida.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button component={RouterLink} to="/formacion#modulos" variant="contained" className="landing-btn">
                  Conoce el camino formativo
                </Button>
                <Button component={RouterLink} to="/registro" variant="text" className="landing-btn" sx={{ color: colors.primary }}>
                  Empieza tu formación
                </Button>
              </Stack>
            </Box>
          </Reveal>
        </PublicContainer>
      </Box>

      <MovimientoSections />

      <ScrollSection
        id="comienza"
        size="content"
        contentMaxWidth={860}
        sx={{
          py: { xs: 4, md: 5.5 },
          px: { xs: 3, md: 4, lg: 6 },
          bgcolor: colors.dark,
          justifyContent: 'center',
          minHeight: 'auto',
        }}
      >
        <Reveal y={22} scale={0.99} sx={{ width: '100%' }}>
          <Box sx={{ textAlign: 'center', color: colors.cream }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.6rem' },
                lineHeight: 1.25,
                color: colors.cream,
                maxWidth: 680,
                mx: 'auto',
                mb: 1.25,
              }}
            >
              Da el primer paso
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 560,
                mx: 'auto',
                mb: 1,
                color: 'rgba(235,219,178,0.95)',
                fontSize: { xs: '1.05rem', md: '1.15rem' },
              }}
            >
              No tienes que recorrer este camino en soledad
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 540,
                mx: 'auto',
                mb: 2.75,
                color: 'rgba(235,219,178,0.78)',
              }}
            >
              Únete a una comunidad que escucha, acompaña y camina contigo desde la búsqueda hasta la misión.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1.5,
                width: '100%',
                mx: 'auto',
              }}
            >
              <Button component={RouterLink} to="/registro" variant="contained" color="secondary" className="landing-btn">
                Empieza tu formación
              </Button>
              <Button
                component={RouterLink}
                to="/contacto"
                variant="contained"
                className="landing-btn"
                sx={{
                  bgcolor: colors.cream,
                  color: colors.dark,
                  '&:hover': { bgcolor: '#F5EBD4' },
                }}
              >
                Habla con nosotros
              </Button>
            </Box>
          </Box>
        </Reveal>
      </ScrollSection>
    </>
  )
}
