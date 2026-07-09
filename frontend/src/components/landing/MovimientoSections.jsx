import { Box, Grid, Typography } from '@mui/material'
import SectionHeading from './SectionHeading'
import ScrollSection from './ScrollSection'
import StickyStory from './motion/StickyStory'
import Reveal from './motion/Reveal'
import RevealStagger, { RevealStaggerItem } from './motion/RevealStagger'
import {
  JUSTIFICACION_PROYECTO,
  LANDING_IMAGES,
  MISION,
  NUESTRO_EQUIPO,
  VALORES,
  VISION,
} from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

const VALUE_ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent, colors.moss]

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

  return (
    <Box
      className="card-hover"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
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
          fontFamily: '"Libre Baskerville", Georgia, serif',
          fontWeight: 700,
          color: accent,
          opacity: 0.12,
          userSelect: 'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </Typography>
      <Box sx={{ width: 32, height: 3, bgcolor: accent, borderRadius: 1, mb: 1.5 }} />
      <Typography variant="h3" className="font-display" sx={{ fontSize: '1.125rem', mb: 1, color: colors.dark, width: '100%', textAlign: 'left' }}>
        {valor.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.9375rem', width: '100%', textAlign: 'justify' }}>
        {valor.description}
      </Typography>
    </Box>
  )
}

export default function MovimientoSections() {
  return (
    <>
      <ScrollSection
        id="quienes-somos"
        alt
        size="content"
        contentMaxWidth={{ xs: 720, md: 1100 }}
        sx={{ pt: { xs: 3.5, md: 4.5 }, pb: { xs: 5, md: 6 } }}
      >
        <SectionHeading
          overline="El Movimiento"
          title="Quiénes somos"
          subtitle="Comunidad de fe que camina junta — no un curso más, sino un proceso de vida."
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'column' },
            gap: 3,
            mb: 5,
          }}
        >
          <Reveal delay={0.05} y={24} sx={{ width: '100%', display: 'flex' }}>
            <Box
              className="landing-block"
              sx={{
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `4px solid ${colors.primary}`,
                bgcolor: colors.dark,
                color: colors.cream,
                '& .section-overline': { color: colors.accent },
              }}
            >
              <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 1.5 }}>
                Misión
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(235, 219, 178, 0.92)', lineHeight: 1.8, fontSize: '1.0625rem', textAlign: 'justify' }}>
                {MISION}
              </Typography>
            </Box>
          </Reveal>
          <Reveal delay={0.12} y={24} sx={{ width: '100%', display: 'flex' }}>
            <Box
              className="landing-block landing-block--filled"
              sx={{
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `4px solid ${colors.accent}`,
              }}
            >
              <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 1.5 }}>
                Visión
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.0625rem', textAlign: 'justify' }}>
                {VISION}
              </Typography>
            </Box>
          </Reveal>
        </Box>

        <Reveal y={18}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 0.5 }}>
              Nuestros valores
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, fontSize: '1.0625rem', lineHeight: 1.8 }}>
              Ocho principios que orientan nuestra formación, nuestra comunidad y nuestra misión evangelizadora.
            </Typography>
          </Box>
        </Reveal>

        <RevealStagger sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            {VALORES.map((valor, index) => (
              <Grid key={valor.name} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
                <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                  <ValorCard valor={valor} index={index} />
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>
      </ScrollSection>

      <ScrollSection id="historia" size="content" contentMaxWidth={{ xs: 720, md: 1100 }} sx={{ justifyContent: 'flex-start' }}>
        <StickyStory
          overline="El Movimiento"
          title="¿Por qué lo hacemos?"
          subtitle="La justificación de un movimiento de formación integral en respuesta a los desafíos de nuestro tiempo."
          imageSrc={LANDING_IMAGES.camino}
          imageAlt="Basílica de San Francisco de Asís con olivos"
          paragraphs={JUSTIFICACION_PROYECTO}
        />
      </ScrollSection>

      <ScrollSection
        id="nuestro-equipo"
        alt
        size="content"
        contentMaxWidth={{ xs: 720, md: 1100 }}
        sx={{ pb: { xs: 3.5, md: 4.5 } }}
      >
        <SectionHeading
          overline="El Movimiento"
          title="Nuestro equipo"
          subtitle="Escucha, caridad y evangelización al servicio del pueblo de Dios."
        />

        <RevealStagger sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: { md: 'stretch' } }}>
            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{ order: { xs: 2, md: 1 }, display: 'flex' }}
            >
              <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                <Box
                  className="landing-block landing-block--filled"
                  sx={{
                    flex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: { md: '100%' },
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.8, fontSize: '1.0625rem', textAlign: { md: 'justify' }, width: '100%' }}
                  >
                    {NUESTRO_EQUIPO.intro}
                  </Typography>
                </Box>
              </RevealStaggerItem>
            </Grid>

            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{ order: { xs: 1, md: 2 }, display: 'flex' }}
            >
              <Grid container spacing={2} sx={{ width: '100%', height: { md: '100%' } }}>
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
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'stretch' }}>
            {NUESTRO_EQUIPO.obrasCaridad.map((obra, index) => (
              <Grid key={obra} size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
                <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                  <Box
                    className="card-hover"
                    sx={{
                      flex: 1,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${colors.border}`,
                      borderTop: `3px solid ${VALUE_ACCENTS[index % VALUE_ACCENTS.length]}`,
                      bgcolor: index % 2 === 0 ? colors.surface : 'rgba(255,255,255,0.5)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h3" className="font-display" sx={{ fontSize: '1.05rem', color: colors.dark, lineHeight: 1.4 }}>
                      {obra}
                    </Typography>
                  </Box>
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>

        <Reveal delay={0.08} y={20} scale={0.99}>
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
            <Typography variant="body2" sx={{ color: 'rgba(235, 219, 178, 0.92)', lineHeight: 1.75, fontSize: '1rem' }}>
              {NUESTRO_EQUIPO.apoyo}
            </Typography>
          </Box>
        </Reveal>
      </ScrollSection>
    </>
  )
}
