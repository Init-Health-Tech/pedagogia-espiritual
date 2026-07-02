import { alpha } from '@mui/material/styles'
import { Box, Grid, Stack, Typography } from '@mui/material'
import ContactSection from '../../components/landing/ContactSection'
import SectionHeading from '../../components/landing/SectionHeading'
import ScrollSection, { SectionDivider } from '../../components/landing/ScrollSection'
import {
  JUSTIFICACION_PROYECTO,
  LANDING_IMAGES,
  MISION,
  NUESTRO_EQUIPO,
  VALORES,
  VISION,
} from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'
import { HEADER_HEIGHT } from '../../utils/marketingNav'

const VALUE_ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent, colors.moss]

const ESPIRITUALIDAD_FRANCISCANA = [
  { title: 'Paz y bien', desc: 'Saludar la vida con gratitud y proclamar la paz en cada encuentro.', accent: colors.primary },
  { title: 'Pobreza evangélica', desc: 'Desprenderse de lo superfluo para abrazar lo esencial.', accent: colors.blue },
  { title: 'Fraternidad universal', desc: 'Reconocer a todo ser creado como hermano y hermana.', accent: colors.secondary },
  { title: 'Contemplación y acción', desc: 'Orar y servir como dos alas de una misma vida.', accent: colors.accent },
]

function FranciscanCircle({ title, desc, accent }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Box
        sx={{
          width: { xs: 100, sm: 120, md: 132 },
          height: { xs: 100, sm: 120, md: 132 },
          borderRadius: '50%',
          border: `2px solid ${accent}`,
          bgcolor: colors.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1.5,
          mb: 1.5,
          boxShadow: `0 8px 24px ${alpha(accent, 0.16)}`,
        }}
      >
        <Typography
          variant="overline"
          className="font-display"
          sx={{
            fontSize: { xs: '0.58rem', sm: '0.65rem', md: '0.72rem' },
            color: accent,
            lineHeight: 1.3,
            letterSpacing: '0.03em',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: { xs: '0.75rem', md: '0.875rem' }, maxWidth: 200 }}>
        {desc}
      </Typography>
    </Box>
  )
}

function EquipoStat({ value, label, accent }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
        height: '100%',
      }}
    >
      <Typography
        className="font-display"
        sx={{ fontSize: { xs: '2.25rem', md: '2.75rem' }, color: accent, lineHeight: 1, mb: 0.75 }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
        {label}
      </Typography>
    </Box>
  )
}

function ValorCard({ valor, index }) {
  const accent = VALUE_ACCENTS[index % VALUE_ACCENTS.length]

  return (
    <Box
      className="card-hover"
      sx={{
        position: 'relative',
        height: '100%',
        p: 2.5,
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: index % 2 === 0 ? colors.surface : 'rgba(255,255,255,0.45)',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': { borderColor: accent },
      }}
    >
      <Typography
        aria-hidden
        sx={{
          position: 'absolute',
          top: -8,
          right: 8,
          fontSize: '4.5rem',
          lineHeight: 1,
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          color: accent,
          opacity: 0.12,
          userSelect: 'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </Typography>
      <Box sx={{ width: 32, height: 3, bgcolor: accent, borderRadius: 1, mb: 1.5 }} />
      <Typography variant="h3" className="font-display" sx={{ fontSize: '1.125rem', mb: 1, color: colors.dark }}>
        {valor.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
        {valor.description}
      </Typography>
    </Box>
  )
}

export default function MovimientoPage() {
  return (
    <Box sx={{ pt: `${HEADER_HEIGHT + 32}px` }}>
      <ScrollSection id="quienes-somos" alt>
        <SectionHeading
          overline="El Movimiento"
          title="Quiénes somos"
          subtitle="Comunidad de fe que camina junta — no un curso más, sino un proceso de vida."
        />

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              className="landing-block"
              sx={{
                height: '100%',
                borderTop: `4px solid ${colors.primary}`,
                bgcolor: colors.dark,
                color: colors.cream,
                '& .section-overline': { color: colors.accent },
              }}
            >
              <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 1.5 }}>
                Misión
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(235, 219, 178, 0.92)', lineHeight: 1.75 }}>
                {MISION}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              className="landing-block landing-block--filled"
              sx={{
                height: '100%',
                borderTop: `4px solid ${colors.accent}`,
              }}
            >
              <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 1.5 }}>
                Visión
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                {VISION}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2.5 }}>
          <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 0.5 }}>
            Nuestros valores
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
            Diez principios que orientan nuestra formación, nuestra comunidad y nuestra misión evangelizadora.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {VALORES.map((valor, index) => (
            <Grid key={valor.name} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ValorCard valor={valor} index={index} />
            </Grid>
          ))}
        </Grid>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="historia">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeading
              overline="El Movimiento"
              title="¿Por qué lo hacemos?"
              subtitle="La justificación de un movimiento de formación integral en respuesta a los desafíos de nuestro tiempo."
            />
            <Stack spacing={2}>
              {JUSTIFICACION_PROYECTO.map((parrafo) => (
                <Typography key={parrafo} variant="body1" color="text.secondary">{parrafo}</Typography>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={LANDING_IMAGES.camino}
              alt="Basílica de San Francisco de Asís con olivos"
              sx={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 2, border: `1px solid ${colors.border}` }}
            />
          </Grid>
        </Grid>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="nuestro-equipo" alt>
        <SectionHeading
          overline="El Movimiento"
          title="Nuestro equipo"
          subtitle="Escucha, caridad y evangelización al servicio del pueblo de Dios."
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <EquipoStat value="30" label="Hermanos dedicados a la escucha" accent={colors.primary} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <EquipoStat value="10" label="Psicólogos en el equipo" accent={colors.blue} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              className="landing-block landing-block--filled"
              sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                {NUESTRO_EQUIPO.intro}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 2 }}>
          Obras de caridad
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {NUESTRO_EQUIPO.obrasCaridad.map((obra, index) => (
            <Grid key={obra} size={{ xs: 12, sm: 4 }}>
              <Box
                className="card-hover"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`,
                  borderTop: `3px solid ${VALUE_ACCENTS[index % VALUE_ACCENTS.length]}`,
                  bgcolor: index % 2 === 0 ? colors.surface : 'rgba(255,255,255,0.5)',
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h3" className="font-display" sx={{ fontSize: '1.05rem', color: colors.dark }}>
                  {obra}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: colors.dark,
            color: colors.cream,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { md: 'center' },
          }}
        >
          <Box
            component="img"
            src={LANDING_IMAGES.comunidad}
            alt="Comunidad en oración y servicio"
            sx={{
              width: { xs: '100%', md: 200 },
              height: { xs: 160, md: 120 },
              objectFit: 'cover',
              borderRadius: 1.5,
              flexShrink: 0,
            }}
          />
          <Typography variant="body2" sx={{ color: 'rgba(235, 219, 178, 0.92)', lineHeight: 1.7 }}>
            {NUESTRO_EQUIPO.apoyo}
          </Typography>
        </Box>
      </ScrollSection>

      <SectionDivider />

      <ScrollSection id="espiritualidad">
        <SectionHeading overline="El Movimiento" title="Espiritualidad franciscana" subtitle="Paz, sencillez, fraternidad y amor a la creación." />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 3, md: 2 },
            mb: 4,
          }}
        >
          {ESPIRITUALIDAD_FRANCISCANA.map((item) => (
            <FranciscanCircle key={item.title} {...item} />
          ))}
        </Box>

        <Box className="landing-block" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" className="font-display quote-text" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, mb: 1, color: colors.dark }}>
            Señor, hazme instrumento de tu paz
          </Typography>
          <Typography variant="body2" className="quote-text">Oración atribuida a San Francisco de Asís</Typography>
        </Box>
      </ScrollSection>

      <SectionDivider />
      <ContactSection />
    </Box>
  )
}
