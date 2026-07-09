import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import PenLine from '@mui/icons-material/EditNoteOutlined'
import SectionHeading from '../../components/landing/SectionHeading'
import ScrollSection from '../../components/landing/ScrollSection'
import Reveal from '../../components/landing/motion/Reveal'
import RevealStagger, { RevealStaggerItem } from '../../components/landing/motion/RevealStagger'
import { HEADER_HEIGHT } from '../../utils/marketingNav'
import { LANDING_IMAGES, MODULOS_PREVIEW } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

export default function FormacionPage() {
  return (
    <>
      <ScrollSection id="camino-formativo" alt lead size="full">
        <SectionHeading overline="Formación" title="Camino por etapas" subtitle="Cuatro etapas con manuales digitales interactivos. Avanzas con tu coordinador." />
        <RevealStagger>
          <Grid container spacing={2} id="modulos">
            {MODULOS_PREVIEW.map((m) => (
              <Grid key={m.num} size={{ xs: 12, sm: 6 }}>
                <RevealStaggerItem>
                  <Box className="landing-block card-hover landing-etapa-card">
                    <Box component="img" src={m.imagen} alt="" className="landing-etapa-image" />
                    <Typography variant="overline">Etapa {m.num}</Typography>
                    <Typography variant="h3" className="font-display" sx={{ fontSize: '1.25rem', my: 0.5 }}>{m.title}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.75 }}>{m.desc}</Typography>
                  </Box>
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>
      </ScrollSection>

      <ScrollSection id="grupos-pastoreo" size="tall">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal y={20} scale={0.99}>
              <Box
                sx={{
                  position: { md: 'sticky' },
                  top: { md: `calc(${HEADER_HEIGHT}px + 2rem)` },
                }}
              >
                <Box
                  component="img"
                  src={LANDING_IMAGES.comunidad}
                  alt="Comunidad en formación"
                  sx={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 2, border: `1px solid ${colors.border}` }}
                />
              </Box>
            </Reveal>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeading overline="Formación" title="Grupos de pastoreo" subtitle="La formación se vive en comunidad." align="left" />
            <Stack spacing={2} sx={{ mb: 3 }}>
              {['Encuentros periódicos de formación', 'Coordinador que mide y acompaña tu progreso', 'Comunicación interna entre miembros', 'Esquemas y materiales de apoyo'].map((t, index) => (
                <Reveal key={t} delay={index * 0.05} y={18}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.0625rem', lineHeight: 1.8 }}>
                    {t}
                  </Typography>
                </Reveal>
              ))}
            </Stack>
            <Reveal delay={0.15} y={16}>
              <Button component={RouterLink} to="/registro" variant="contained" className="landing-btn">Unirme al movimiento</Button>
            </Reveal>
          </Grid>
        </Grid>
      </ScrollSection>

      <ScrollSection id="ficha-pedagogica" alt size="full">
        <Reveal y={22} scale={0.99}>
          <Box className="landing-block landing-block--filled" sx={{ textAlign: 'center', py: { xs: 3, md: 5 } }}>
            <PenLine sx={{ fontSize: 32, mb: 1.5, color: colors.primary, opacity: 0.85 }} />
            <Typography variant="h2" className="font-display" sx={{ fontSize: '1.875rem', mb: 1.5 }}>Diario semanal</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 520, mx: 'auto', fontSize: '1.0625rem', lineHeight: 1.8 }}>
              Diez entradas abiertas, una por semana. Escribe con libertad; tu coordinador lee para acompañarte, no para calificarte.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
              <Button component={RouterLink} to="/registro" variant="contained" className="landing-btn">Empezar mi diario</Button>
              <Button component={RouterLink} to="/login" variant="text" className="landing-btn" sx={{ color: colors.primary }}>Ya tengo cuenta</Button>
            </Stack>
          </Box>
        </Reveal>
      </ScrollSection>
    </>
  )
}
