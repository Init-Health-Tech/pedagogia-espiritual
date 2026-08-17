import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import {
  BookOpen,
  Church,
  Compass,
  HandHeart,
  Heart,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react'
import SectionHeading from './SectionHeading'
import ScrollSection from './ScrollSection'
import StickyStory from './motion/StickyStory'
import Reveal from './motion/Reveal'
import RevealStagger, { RevealStaggerItem } from './motion/RevealStagger'
import {
  JUSTIFICACION_PROYECTO,
  LANDING_IMAGES,
  MISION,
  MODULOS_PREVIEW,
  NUESTRO_EQUIPO,
  VALORES,
  VISION,
} from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

const VALUE_ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent, colors.moss]
const VALUE_ICONS = [Heart, HandHeart, Church, RefreshCw, BookOpen, Compass, Users, Sparkles]

function EquipoStat({ value, label, accent }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography
        className="font-display"
        sx={{ fontSize: { xs: '2.25rem', md: '2.75rem' }, color: accent, lineHeight: 1, mb: 0.75 }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55, fontSize: '0.9375rem' }}>
        {label}
      </Typography>
    </Box>
  )
}

function ValorCard({ valor, index }) {
  const accent = VALUE_ACCENTS[index % VALUE_ACCENTS.length]
  const Icon = VALUE_ICONS[index % VALUE_ICONS.length]

  return (
    <Box
      className="card-hover"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        height: '100%',
        p: 2.5,
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: index % 2 === 0 ? colors.surface : 'rgba(255,255,255,0.45)',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: accent },
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          bgcolor: `${accent}14`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1.5,
        }}
      >
        <Icon size={21} color={accent} strokeWidth={1.8} />
      </Box>
      <Typography
        variant="h3"
        className="font-display"
        sx={{ fontSize: '1.125rem', mb: 1, color: colors.dark, textAlign: 'left' }}
      >
        {valor.name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.7, fontSize: '0.9375rem', textAlign: 'left' }}
      >
        {valor.description}
      </Typography>
    </Box>
  )
}

export default function MovimientoSections() {
  return (
    <>
      <ScrollSection
        id="historia"
        size="content"
        contentMaxWidth={{ xs: 720, md: 900 }}
        sx={{ justifyContent: 'flex-start', px: { xs: 3, md: 4, lg: 6 } }}
      >
        <StickyStory
          overline="Esto es para ti"
          title="¿Por qué lo hacemos?"
          subtitle="Porque los vacíos, la ansiedad y la falta de sentido también pueden convertirse en el inicio de un camino nuevo."
          imageSrc={LANDING_IMAGES.camino}
          imageAlt="Basílica de San Francisco de Asís con olivos"
          paragraphs={JUSTIFICACION_PROYECTO}
        />
      </ScrollSection>

      <ScrollSection
        id="quienes-somos"
        alt
        size="content"
        contentMaxWidth={{ xs: 720, md: 860 }}
        sx={{ px: { xs: 3, md: 4, lg: 6 } }}
      >
        <SectionHeading
          overline="El Movimiento"
          title="Quiénes somos"
          subtitle="Una comunidad franciscana que acompaña procesos reales de vida, fe y conversión."
        />
        <Reveal y={20}>
          <Box
            className="landing-block landing-block--filled"
            sx={{ maxWidth: 760, mx: 'auto', borderTop: `4px solid ${colors.primary}` }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.9, fontSize: '1.0625rem', textAlign: { md: 'center' } }}
            >
              No ofrecemos un curso aislado. Caminamos contigo mediante formación estructurada,
              acompañamiento cercano y vida comunitaria, integrando la dimensión humana y espiritual
              para que la fe vuelva a tocar la vida cotidiana.
            </Typography>
          </Box>
        </Reveal>
      </ScrollSection>

      <ScrollSection
        id="como-lo-hacemos"
        size="content"
        contentMaxWidth={{ xs: 720, md: 980 }}
        sx={{ px: { xs: 3, md: 4, lg: 6 } }}
      >
        <SectionHeading
          overline="Cómo lo hacemos"
          title="Un camino formativo en cuatro etapas"
          subtitle="Avanzas a tu ritmo con manuales digitales, diario semanal y el acompañamiento de quienes ya recorrieron el camino."
        />
        <RevealStagger>
          <Grid container spacing={2}>
            {MODULOS_PREVIEW.map((modulo) => (
              <Grid key={modulo.num} size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: 'flex' }}>
                <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                  <Box className="landing-block card-hover landing-etapa-card" sx={{ flex: 1 }}>
                    <Box component="img" src={modulo.imagen} alt="" className="landing-etapa-image" />
                    <Typography variant="overline">Etapa {modulo.num}</Typography>
                    <Typography
                      variant="h3"
                      className="font-display"
                      sx={{ fontSize: '1.2rem', my: 0.5 }}
                    >
                      {modulo.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>
                      {modulo.desc}
                    </Typography>
                  </Box>
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>

        <Reveal delay={0.08} y={18}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ md: 'center' }}
            sx={{
              mt: 3,
              p: { xs: 2.5, md: 3 },
              borderRadius: 2,
              bgcolor: colors.dark,
              color: colors.cream,
            }}
          >
            <Box>
              <Typography className="font-display" sx={{ fontSize: '1.2rem', mb: 0.5 }}>
                Formación continua, no contenido suelto
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(235,219,178,0.9)', lineHeight: 1.7 }}>
                Al registrarte podrás elegir el plan de formación que mejor se adapte a tu camino.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ flexShrink: 0 }}>
              <Button
                component={RouterLink}
                to="/formacion#modulos"
                variant="contained"
                sx={{
                  bgcolor: colors.cream,
                  color: colors.dark,
                  '&:hover': { bgcolor: '#F5EBD4' },
                }}
              >
                Conoce las etapas
              </Button>
              <Button component={RouterLink} to="/registro" variant="contained" color="secondary">
                Empieza tu formación
              </Button>
            </Stack>
          </Stack>
        </Reveal>
      </ScrollSection>

      <ScrollSection
        id="nuestro-equipo"
        alt
        size="content"
        contentMaxWidth={{ xs: 720, md: 860 }}
        sx={{ px: { xs: 3, md: 4, lg: 6 } }}
      >
        <SectionHeading
          overline="Confianza y acompañamiento"
          title="Nuestro equipo"
          subtitle="Personas preparadas para escuchar, acompañar y servir con una mirada humana y espiritual."
        />

        <RevealStagger sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: { md: 'stretch' } }}>
            <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 1 }, display: 'flex' }}>
              <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                <Box
                  className="landing-block landing-block--filled"
                  sx={{ flex: 1, display: 'flex', alignItems: 'center' }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.8, fontSize: '1.0625rem', textAlign: { md: 'justify' } }}
                  >
                    {NUESTRO_EQUIPO.intro}
                  </Typography>
                </Box>
              </RevealStaggerItem>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 2 }, display: 'flex' }}>
              <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 6, md: 12 }} sx={{ display: 'flex' }}>
                  <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                    <EquipoStat value="30" label="Hermanos dedicados a la escucha" accent={colors.primary} />
                  </RevealStaggerItem>
                </Grid>
                <Grid size={{ xs: 6, md: 12 }} sx={{ display: 'flex' }}>
                  <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                    <EquipoStat value="10" label="Psicólogos en el equipo" accent={colors.blue} />
                  </RevealStaggerItem>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </RevealStagger>

        <Reveal y={16}>
          <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 2 }}>
            Obras de caridad
          </Typography>
        </Reveal>
        <RevealStagger sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {NUESTRO_EQUIPO.obrasCaridad.map((obra, index) => (
              <Grid key={obra} size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
                <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                  <Box
                    className="card-hover"
                    sx={{
                      flex: 1,
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${colors.border}`,
                      borderTop: `3px solid ${VALUE_ACCENTS[index % VALUE_ACCENTS.length]}`,
                      bgcolor: colors.surface,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h3" className="font-display" sx={{ fontSize: '1.05rem' }}>
                      {obra}
                    </Typography>
                  </Box>
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>
        <Reveal delay={0.08} y={18}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: colors.dark,
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
              sx={{ width: { xs: '100%', md: 200 }, height: { xs: 160, md: 120 }, objectFit: 'cover', borderRadius: 1.5 }}
            />
            <Typography variant="body2" sx={{ color: 'rgba(235,219,178,0.92)', lineHeight: 1.75 }}>
              {NUESTRO_EQUIPO.apoyo}
            </Typography>
          </Box>
        </Reveal>
      </ScrollSection>

      <ScrollSection
        id="mision-vision"
        size="content"
        contentMaxWidth={{ xs: 720, md: 860 }}
        sx={{ px: { xs: 3, md: 4, lg: 6 } }}
      >
        <SectionHeading
          overline="Nuestra identidad"
          title="Misión y visión"
          subtitle="Lo que orienta nuestro servicio y la comunidad que queremos construir."
        />
        <Stack spacing={3}>
          <Reveal delay={0.05} y={20}>
            <Box
              className="landing-block"
              sx={{ borderTop: `4px solid ${colors.primary}`, bgcolor: colors.dark, color: colors.cream }}
            >
              <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 1.5, color: colors.accent }}>
                Misión
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(235,219,178,0.92)', lineHeight: 1.8, textAlign: 'justify' }}>
                {MISION}
              </Typography>
            </Box>
          </Reveal>
          <Reveal delay={0.1} y={20}>
            <Box className="landing-block landing-block--filled" sx={{ borderTop: `4px solid ${colors.accent}` }}>
              <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 1.5 }}>
                Visión
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                {VISION}
              </Typography>
            </Box>
          </Reveal>
        </Stack>
      </ScrollSection>

      <ScrollSection
        id="valores"
        alt
        size="content"
        contentMaxWidth={{ xs: 720, md: 980 }}
        sx={{ px: { xs: 3, md: 4, lg: 6 } }}
      >
        <SectionHeading
          overline="Lo que nos sostiene"
          title="Nuestros valores"
          subtitle="Ocho principios que orientan nuestra formación, nuestra comunidad y nuestra misión."
        />
        <RevealStagger sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            {VALORES.map((valor, index) => (
              <Grid key={valor.name} size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: 'flex' }}>
                <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                  <ValorCard valor={valor} index={index} />
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>
      </ScrollSection>
    </>
  )
}
