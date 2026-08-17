import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import SectionHeading from '../../components/landing/SectionHeading'
import ScrollSection from '../../components/landing/ScrollSection'
import FormacionAvisosCalendar from '../../components/landing/FormacionAvisosCalendar'
import Reveal from '../../components/landing/motion/Reveal'
import RevealStagger, { RevealStaggerItem } from '../../components/landing/motion/RevealStagger'
import { MODULOS_PREVIEW } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

const PORQUE_CON_NOSOTROS = [
  {
    title: 'Un camino, no un curso',
    desc: 'Aquí no se trata de acumular clases. Te acompañamos por etapas, a tu ritmo, para que la fe se integre en la vida cotidiana con calma y profundidad.',
    accent: colors.primary,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    imageAlt: 'Sendero entre árboles que invita a caminar con calma',
  },
  {
    title: 'Raíz franciscana',
    desc: 'Fraternidad, sencillez y servicio a los más vulnerables. Un estilo de vida que invita a la conversión continua y a mirar el Evangelio sin complicaciones innecesarias.',
    accent: colors.secondary,
    image: 'https://images.unsplash.com/photo-1756541178978-fe09dc8d4bda?w=800&q=80',
    imageAlt: 'Basílica de San Francisco de Asís entre olivos',
  },
  {
    title: 'Acompañamiento cercano',
    desc: 'No caminas solo: coordinadores y grupos de pastoreo te escuchan, oran contigo y cuidan tu avance con mirada humana y espiritual.',
    accent: colors.blue,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    imageAlt: 'Manos unidas en gesto de acompañamiento y fraternidad',
  },
  {
    title: 'Formación que transforma',
    desc: 'Integramos lo humano, lo espiritual y lo doctrinal. Oración, estudio y caridad se encuentran para madurar la persona y fortalecer la misión en la Iglesia.',
    accent: colors.accent,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    imageAlt: 'Libros abiertos sobre una mesa, símbolo de estudio y formación',
  },
]

const ETAPA_ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent]

function EtapasStepper() {
  return (
    <Box
      id="modulos"
      component="ol"
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'flex-start' },
        width: '100%',
      }}
    >
      {MODULOS_PREVIEW.map((etapa, index) => {
        const isLast = index === MODULOS_PREVIEW.length - 1
        const accent = ETAPA_ACCENTS[index % ETAPA_ACCENTS.length]

        return (
          <Box
            key={etapa.num}
            component="li"
            sx={{
              position: 'relative',
              flex: { md: 1 },
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: { xs: 2, md: 0 },
              minWidth: 0,
            }}
          >
            {!isLast && (
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  bgcolor: colors.border,
                  top: { xs: 36, md: 18 },
                  left: { xs: 17, md: '50%' },
                  width: { xs: 2, md: '100%' },
                  height: { xs: 'calc(100% - 18px)', md: 2 },
                  zIndex: 0,
                }}
              />
            )}

            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                width: { xs: 36, md: '100%' },
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'center' },
                mb: { md: 2 },
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: accent,
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  boxShadow: `0 0 0 4px ${colors.light}`,
                }}
              >
                {etapa.num}
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                pb: { xs: isLast ? 0 : 3.5, md: 0 },
                px: { md: 1.25 },
                textAlign: { md: 'center' },
                minWidth: 0,
              }}
            >
              <Box
                component="img"
                src={etapa.imagen}
                alt=""
                sx={{
                  width: '100%',
                  height: { xs: 140, md: 120 },
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 1.5,
                  display: 'block',
                  border: `1px solid ${colors.border}`,
                }}
              />
              <Typography variant="overline" sx={{ color: accent }}>
                Etapa {etapa.num}
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.15rem', md: '1.2rem' }, my: 0.5 }}>
                {etapa.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.9875rem' }}>
                {etapa.desc}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default function FormacionPage() {
  return (
    <>
      <ScrollSection id="porque-con-nosotros" alt lead size="content" contentMaxWidth={{ xs: 720, md: 820 }}>
        <SectionHeading
          overline="Formación"
          title="¿Por qué con nosotros?"
          subtitle="Porque buscar a Dios no es un trámite: es un encuentro que se vive en comunidad, con paciencia y con el corazón abierto."
        />

        <Reveal y={18}>
          <Box
            sx={{
              mb: 4,
              p: { xs: 2.5, md: 3 },
              borderRadius: 2,
              bgcolor: colors.dark,
              color: colors.cream,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(235, 219, 178, 0.92)',
                lineHeight: 1.85,
                fontSize: { xs: '1.0625rem', md: '1.125rem' },
                textAlign: { md: 'justify' },
                maxWidth: 680,
                mx: 'auto',
              }}
            >
              Si sientes el llamado a crecer en la fe, en un ambiente sereno y fraterno, este movimiento franciscano te
              ofrece un hogar espiritual: formación sólida, vida de oración y un acompañamiento que te mira como
              persona, no como un número en una lista.
            </Typography>
          </Box>
        </Reveal>

        <RevealStagger sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ alignItems: 'stretch', mb: 4 }}>
            {PORQUE_CON_NOSOTROS.map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      borderRadius: 2,
                      border: `1px solid ${colors.border}`,
                      borderTop: `3px solid ${item.accent}`,
                      bgcolor: colors.surface,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.imageAlt}
                      sx={{
                        width: '100%',
                        height: { xs: 160, sm: 180 },
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <Box sx={{ p: 2.5, flex: 1 }}>
                      <Typography variant="h3" className="font-display" sx={{ fontSize: '1.15rem', mb: 1, color: colors.dark }}>
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.75, fontSize: '1rem', textAlign: { md: 'justify' } }}
                      >
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>

        <Reveal delay={0.08} y={16}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component={RouterLink}
              to="/registro"
              variant="contained"
              color="secondary"
              className="landing-btn"
            >
              Quiero comenzar
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              className="landing-btn"
              sx={{
                color: colors.primary,
                borderColor: colors.border,
                bgcolor: 'transparent',
                '&:hover': {
                  borderColor: colors.primary,
                  bgcolor: 'rgba(3, 14, 48, 0.04)',
                },
              }}
            >
              Ya tengo cuenta
            </Button>
          </Stack>
        </Reveal>
      </ScrollSection>

      <ScrollSection id="camino-formativo" size="content" contentMaxWidth={{ xs: 720, md: 1100 }}>
        <SectionHeading
          overline="Formación"
          title="Camino por etapas"
          subtitle="Cuatro etapas con manuales digitales interactivos. Avanzas con tu coordinador."
        />
        <Reveal y={18}>
          <EtapasStepper />
        </Reveal>
      </ScrollSection>

      <ScrollSection id="avisos" alt size="content" contentMaxWidth={{ xs: 720, md: 900 }}>
        <SectionHeading
          overline="Formación"
          title="Avisos y calendario"
          subtitle="Fechas, encuentros y celebraciones de la comunidad. Selecciona un día para ver el detalle."
        />
        <Reveal y={18}>
          <FormacionAvisosCalendar />
        </Reveal>
      </ScrollSection>
    </>
  )
}
