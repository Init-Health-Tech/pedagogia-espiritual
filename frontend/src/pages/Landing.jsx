import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material'
import PenLine from '@mui/icons-material/EditNoteOutlined'
import MarketingNav, { HEADER_HEIGHT } from '../components/landing/MarketingNav'
import MarketingFooter from '../components/landing/MarketingFooter'
import SectionHeading from '../components/landing/SectionHeading'
import ScrollSection, { SectionDivider, PublicContainer } from '../components/landing/ScrollSection'
import FormField from '../components/common/FormField'
import { LANDING_IMAGES, MODULOS_PREVIEW } from '../data/marketingContent'
import { colors } from '../theme/muiTheme'

function EditorialCard({ title, children, image }) {
  return (
    <Box className="landing-block card-hover landing-card-with-image">
      {image && (
        <Box
          component="img"
          src={image}
          alt=""
          className="landing-card-image"
        />
      )}
      <Typography variant="h3" className="font-display" sx={{ fontSize: '1.25rem', mb: 1 }}>{title}</Typography>
      <Typography variant="body1" color="text.secondary">{children}</Typography>
    </Box>
  )
}

export default function Landing() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: colors.light }}>
      <MarketingNav />

      {/* HERO */}
      <Box
        id="inicio"
        component="section"
        sx={{ pt: `${HEADER_HEIGHT + 56}px`, pb: { xs: 8, md: 12 }, scrollMarginTop: HEADER_HEIGHT + 16 }}
      >
        <Box className="landing-hero-image-wrap">
          <Box
            component="img"
            src={LANDING_IMAGES.hero}
            alt=""
            className="landing-hero-image"
          />
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
              <Button href="#camino-formativo" variant="text" className="landing-btn" sx={{ color: colors.primary }}>Ver las etapas</Button>
            </Stack>
          </Box>
        </PublicContainer>
      </Box>

      <SectionDivider />

      <ScrollSection id="quienes-somos" alt>
        <SectionHeading overline="El Movimiento" title="Quiénes somos" subtitle="Comunidad de fe que camina junta — no un curso más, sino un proceso de vida." />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <EditorialCard title="Misión evangelizadora" image={LANDING_IMAGES.oracion}>
              Anunciar el Evangelio con sencillez, alegría y testimonio de vida.
            </EditorialCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <EditorialCard title="Comunidad fraterna" image={LANDING_IMAGES.comunidad}>
              Grupos de pastoreo, mutuo apoyo y coordinadores que acompañan tu progreso.
            </EditorialCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <EditorialCard title="Servicio" image={LANDING_IMAGES.camino}>
              Responder al amor de Dios con obras de caridad y presencia entre los más necesitados.
            </EditorialCard>
          </Grid>
        </Grid>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="historia">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeading overline="El Movimiento" title="Nuestra historia" subtitle="Un camino de fe que continúa escribiéndose en cada generación." />
            <Typography variant="body1" color="text.secondary" paragraph>
              El Movimiento Franciscano — Pedagogía Espiritual de la Santísima Trinidad nace del deseo de ofrecer
              un proceso formativo humano y espiritual, que permita crecer en la relación con Dios Padre, Hijo y Espíritu Santo.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hoy la plataforma digital conecta etapas, diarios y grupos — sin perder el calor de lo personal.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={LANDING_IMAGES.camino}
              alt=""
              sx={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 2, border: `1px solid ${colors.border}` }}
            />
          </Grid>
        </Grid>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="espiritualidad" alt>
        <SectionHeading overline="El Movimiento" title="Espiritualidad franciscana" subtitle="Paz, sencillez, fraternidad y amor a la creación." />
        <Stack spacing={2.5} sx={{ mb: 4 }}>
          {[
            { t: 'Paz y bien', d: 'Saludar la vida con gratitud y proclamar la paz en cada encuentro.' },
            { t: 'Pobreza evangélica', d: 'Desprenderse de lo superfluo para abrazar lo esencial.' },
            { t: 'Fraternidad universal', d: 'Reconocer a todo ser creado como hermano y hermana.' },
            { t: 'Contemplación y acción', d: 'Orar y servir como dos alas de una misma vida.' },
          ].map((item) => (
            <Box key={item.t} sx={{ borderLeft: `1px solid ${colors.secondary}`, pl: 2 }}>
              <Typography variant="h3" className="font-display" sx={{ fontSize: '1.25rem', mb: 0.5 }}>{item.t}</Typography>
              <Typography variant="body1" color="text.secondary">{item.d}</Typography>
            </Box>
          ))}
        </Stack>
        <Box className="landing-block" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" className="font-display quote-text" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, mb: 1, color: colors.dark }}>
            Señor, hazme instrumento de tu paz
          </Typography>
          <Typography variant="body2" className="quote-text">Oración atribuida a San Francisco de Asís</Typography>
        </Box>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="que-es-pedagogia">
        <SectionHeading overline="Pedagogía Espiritual" title="¿Qué es la pedagogía espiritual?" subtitle="Acompañamiento personal y progresivo — medido por quienes caminan contigo." />
        <Stack spacing={2}>
          <EditorialCard title="Etapas, no exámenes">
            Cuatro módulos son etapas del camino. Administradores y coordinadores observan tu avance y te acompañan.
          </EditorialCard>
          <EditorialCard title="Manuales interactivos">
            Guías digitales con tips, imágenes y reflexiones — mucho más que un PDF estático.
          </EditorialCard>
          <EditorialCard title="Diario semanal">
            Cada semana escribes en tu ficha con respuestas abiertas, como un diario personal de fe.
          </EditorialCard>
        </Stack>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="santisima-trinidad" alt>
        <SectionHeading overline="Pedagogía Espiritual" title="La Santísima Trinidad" subtitle="Dios es comunión de amor entre Padre, Hijo y Espíritu Santo." />
        <Stack spacing={1.5}>
          {[
            { role: 'Padre', desc: 'Origen y destino de toda la vida. El Dios que nos crea y nos llama por nombre.' },
            { role: 'Hijo', desc: 'Jesucristo, camino, verdad y vida. Modelo de entrega y servicio.' },
            { role: 'Espíritu Santo', desc: 'Fuerza santificadora que guía, consuela y envía a la misión.' },
          ].map((p) => (
            <Box key={p.role} className="landing-block" sx={{ textAlign: 'center' }}>
              <Typography variant="overline">{p.role}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>{p.desc}</Typography>
            </Box>
          ))}
        </Stack>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="camino-formativo">
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

      <ScrollSection id="grupos-pastoreo" alt>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={LANDING_IMAGES.comunidad}
              alt=""
              sx={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 2 }}
            />
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

      <ScrollSection id="ficha-pedagogica">
        <Box className="landing-block landing-block--filled" sx={{ textAlign: 'center', py: { xs: 3, md: 5 } }}>
          <PenLine sx={{ fontSize: 32, mb: 1.5, color: colors.secondary, opacity: 0.85 }} />
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

      <ScrollSection id="contacto" alt>
        <SectionHeading overline="Contacto" title="Escríbenos" subtitle="¿Preguntas sobre el movimiento o la formación?" />
        <Box component="form" className="landing-block landing-block--filled" onSubmit={(e) => e.preventDefault()}>
          <FormField label="Nombre completo" required>
            <TextField required fullWidth hiddenLabel placeholder="Tu nombre completo" size="small" />
          </FormField>
          <FormField label="Correo electrónico" required helper="Te responderemos a este correo">
            <TextField type="email" required fullWidth hiddenLabel placeholder="correo@ejemplo.com" size="small" />
          </FormField>
          <FormField label="Asunto">
            <TextField fullWidth hiddenLabel placeholder="¿Sobre qué nos escribes?" size="small" />
          </FormField>
          <FormField label="Mensaje" required>
            <TextField multiline rows={4} required fullWidth hiddenLabel placeholder="Escribe tu mensaje aquí" />
          </FormField>
          <Button type="submit" variant="contained" className="landing-btn" fullWidth sx={{ mt: 0.5 }}>Enviar mensaje</Button>
        </Box>
      </ScrollSection>

      <MarketingFooter />
    </Box>
  )
}
