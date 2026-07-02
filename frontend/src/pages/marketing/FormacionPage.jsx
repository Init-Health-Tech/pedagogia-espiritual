import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import PenLine from '@mui/icons-material/EditNoteOutlined'
import ContactSection from '../../components/landing/ContactSection'
import SectionHeading from '../../components/landing/SectionHeading'
import ScrollSection, { SectionDivider } from '../../components/landing/ScrollSection'
import { LANDING_IMAGES, MODULOS_PREVIEW } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'
import { HEADER_HEIGHT } from '../../utils/marketingNav'

export default function FormacionPage() {
  return (
    <Box sx={{ pt: `${HEADER_HEIGHT + 32}px` }}>
      <ScrollSection id="camino-formativo" alt>
        <SectionHeading overline="Formación" title="Camino por etapas" subtitle="Cuatro etapas con manuales digitales interactivos. Avanzas con tu coordinador." />
        <Grid container spacing={2} id="modulos">
          {MODULOS_PREVIEW.map((m) => (
            <Grid key={m.num} size={{ xs: 12, sm: 6 }}>
              <Box className="landing-block card-hover landing-etapa-card">
                <Box component="img" src={m.imagen} alt="" className="landing-etapa-image" />
                <Typography variant="overline">Etapa {m.num}</Typography>
                <Typography variant="h3" className="font-display" sx={{ fontSize: '1.25rem', my: 0.5 }}>{m.title}</Typography>
                <Typography variant="body1" color="text.secondary">{m.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="grupos-pastoreo">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box component="img" src={LANDING_IMAGES.comunidad} alt="" sx={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeading overline="Formación" title="Grupos de pastoreo" subtitle="La formación se vive en comunidad." />
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {['Encuentros periódicos de formación', 'Coordinador que mide y acompaña tu progreso', 'Comunicación interna entre miembros', 'Esquemas y materiales de apoyo'].map((t) => (
                <Typography key={t} variant="body1" color="text.secondary">{t}</Typography>
              ))}
            </Stack>
            <Button component={RouterLink} to="/registro" variant="contained" className="landing-btn">Unirme al movimiento</Button>
          </Grid>
        </Grid>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="ficha-pedagogica" alt>
        <Box className="landing-block landing-block--filled" sx={{ textAlign: 'center', py: { xs: 3, md: 5 } }}>
          <PenLine sx={{ fontSize: 32, mb: 1.5, color: colors.primary, opacity: 0.85 }} />
          <Typography variant="h2" className="font-display" sx={{ fontSize: '1.75rem', mb: 1.5 }}>Diario semanal</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 520, mx: 'auto' }}>
            Diez entradas abiertas, una por semana. Escribe con libertad; tu coordinador lee para acompañarte, no para calificarte.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
            <Button component={RouterLink} to="/registro" variant="contained" className="landing-btn">Empezar mi diario</Button>
            <Button component={RouterLink} to="/login" variant="text" className="landing-btn" sx={{ color: colors.primary }}>Ya tengo cuenta</Button>
          </Stack>
        </Box>
      </ScrollSection>

      <SectionDivider />
      <ContactSection />
    </Box>
  )
}
