import { useMemo } from 'react'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { BookOpen, Image as ImageIcon, PenLine, Route } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import ItinerarioProgressNav from '../../components/landing/itinerario/ItinerarioProgressNav'
import SectionHeading from '../../components/landing/SectionHeading'
import ScrollSection from '../../components/landing/ScrollSection'
import Reveal from '../../components/landing/motion/Reveal'
import { DESARROLLO_SESION } from '../../data/marketingContent'
import useSectionSpy, { sesionSectionId } from '../../hooks/useSectionSpy'
import { HEADER_HEIGHT } from '../../utils/marketingNav'
import { colors } from '../../theme/muiTheme'

const PEDAGOGIA_PILARES = [
  {
    id: 'etapas',
    icon: Route,
    title: 'Etapas, no exámenes',
    desc: 'Cuatro módulos son etapas del camino. Administradores y coordinadores observan tu avance y te acompañan.',
    accent: colors.primary,
  },
  {
    id: 'manuales',
    icon: BookOpen,
    title: 'Manuales interactivos',
    desc: 'Guías digitales con tips, imágenes y reflexiones — mucho más que un PDF estático.',
    accent: colors.blue,
  },
  {
    id: 'diario',
    icon: PenLine,
    title: 'Diario semanal',
    desc: 'Cada semana escribes en tu ficha con respuestas abiertas, como un diario personal de fe.',
    accent: colors.accent,
  },
]

const SESSION_ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent, colors.moss]

function PilarVisual({ type, accent }) {
  if (type === 'etapas') {
    return (
      <Box sx={{ mt: 'auto', pt: 2.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          {[1, 2, 3, 4].map((step) => (
            <Stack key={step} alignItems="center" sx={{ position: 'relative', flex: 1 }}>
              {step < 4 && (
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: '50%',
                    width: '100%',
                    height: 2,
                    bgcolor: colors.border,
                  }}
                />
              )}
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  zIndex: 1,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: step === 1 ? accent : colors.surface,
                  color: step === 1 ? '#fff' : colors.muted,
                  border: `2px solid ${step === 1 ? accent : colors.border}`,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                }}
              >
                {step}
              </Box>
              <Typography
                variant="caption"
                sx={{ mt: 0.65, color: step === 1 ? accent : colors.muted, fontSize: '0.67rem' }}
              >
                {step === 1 ? 'En curso' : `Etapa ${step}`}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    )
  }

  if (type === 'manuales') {
    return (
      <Box
        sx={{
          mt: 'auto',
          pt: 2.5,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '68px 1fr',
            gap: 1.5,
            p: 1.5,
            borderRadius: 1.5,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.light,
          }}
        >
          <Box
            sx={{
              minHeight: 66,
              borderRadius: 1,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(18,54,133,0.1)',
              color: accent,
            }}
          >
            <ImageIcon size={25} strokeWidth={1.5} aria-hidden />
          </Box>
          <Stack spacing={0.85} justifyContent="center">
            <Box sx={{ height: 7, width: '88%', borderRadius: 4, bgcolor: accent, opacity: 0.75 }} />
            <Box sx={{ height: 6, width: '100%', borderRadius: 4, bgcolor: colors.border }} />
            <Box sx={{ height: 6, width: '72%', borderRadius: 4, bgcolor: colors.border }} />
            <Box sx={{ height: 6, width: '48%', borderRadius: 4, bgcolor: colors.border }} />
          </Stack>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      component="blockquote"
      sx={{
        mt: 'auto',
        mb: 0,
        pt: 2.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          p: 1.75,
          borderRadius: 1.5,
          borderLeft: `4px solid ${accent}`,
          bgcolor: 'rgba(212,168,83,0.1)',
          color: colors.secondary,
          fontStyle: 'italic',
          lineHeight: 1.65,
        }}
      >
        “Esta semana Dios me habló a través de...”
      </Typography>
    </Box>
  )
}

function SesionTimelineItem({ momento, index, isLast, sectionId }) {
  const accent = SESSION_ACCENTS[index % SESSION_ACCENTS.length]

  return (
    <Box
      id={sectionId}
      component="article"
      aria-labelledby={`${sectionId}-title`}
      sx={{ scrollMarginTop: `calc(${HEADER_HEIGHT}px + 30svh)` }}
    >
      <Reveal y={24} delay={index * 0.04}>
        <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, position: 'relative' }}>
          <Stack alignItems="center" sx={{ width: { xs: 52, md: 60 }, flexShrink: 0, pt: 0.5 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.06em',
                color: accent,
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {momento.time}
            </Typography>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: accent,
                my: 1,
                zIndex: 1,
                boxShadow: `0 0 0 4px ${colors.light}`,
              }}
            />
            {!isLast && (
              <Box
                sx={{
                  width: 2,
                  flex: 1,
                  minHeight: 32,
                  bgcolor: colors.border,
                }}
              />
            )}
          </Stack>

          <Box sx={{ flex: 1, pb: isLast ? 0 : { xs: 3, md: 4 } }}>
            <Box
              className="card-hover"
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: 2,
                border: `1px solid ${colors.border}`,
                bgcolor: index % 2 === 0 ? colors.surface : 'rgba(255,255,255,0.5)',
                borderLeft: `4px solid ${accent}`,
              }}
            >
              <Typography
                id={`${sectionId}-title`}
                variant="h3"
                className="font-display"
                sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' }, mb: 0.75, color: colors.dark }}
              >
                {momento.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25, fontStyle: 'italic', lineHeight: 1.6 }}>
                {momento.summary}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {momento.detail}
              </Typography>
              {momento.questions && (
                <Stack
                  spacing={1}
                  component="ol"
                  sx={{
                    m: 0,
                    mt: 2,
                    pl: 0,
                    pt: 1.5,
                    borderTop: `1px solid ${colors.border}`,
                    listStyle: 'none',
                  }}
                >
                  {momento.questions.map((pregunta, qIndex) => (
                    <Typography
                      key={pregunta}
                      component="li"
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.65, listStyle: 'none' }}
                    >
                      <Box component="span" sx={{ fontWeight: 600, color: colors.accent, mr: 0.75 }}>
                        {qIndex + 1}.
                      </Box>
                      {pregunta}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      </Reveal>
    </Box>
  )
}

export default function PedagogiaPage() {
  const steps = useMemo(
    () =>
      DESARROLLO_SESION.map((momento, index) => ({
        id: sesionSectionId(index),
        num: momento.time,
        shortTitle: momento.shortTitle ?? momento.title,
      })),
    [],
  )

  const sectionIds = useMemo(() => steps.map((step) => step.id), [steps])
  const { activeId, scrollToSection } = useSectionSpy(sectionIds)

  return (
    <>
      <ScrollSection
        id="que-es-pedagogia"
        alt
        lead
        size="content"
        contentMaxWidth={{ xs: 760, sm: 860, md: 940 }}
        sx={{
          justifyContent: 'flex-start',
          pb: { xs: 3, md: 4 },
        }}
      >
        <SectionHeading overline="Pedagogía Espiritual" title="¿Qué es la pedagogía espiritual?" subtitle="Acompañamiento personal y progresivo — medido por quienes caminan contigo." />
        <Reveal y={16}>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 720,
              mx: 'auto',
              mb: 3,
              textAlign: 'center',
              color: colors.secondary,
              fontSize: { xs: '1.05rem', md: '1.125rem' },
              lineHeight: 1.75,
            }}
          >
            No se trata de acumular información, sino de caminar acompañado. Así es como lo hacemos:
          </Typography>
        </Reveal>
        <Reveal delay={0.08} y={22} scale={0.99}>
          <Grid container spacing={2}>
            {PEDAGOGIA_PILARES.map((item) => {
              const Icon = item.icon

              return (
                <Grid key={item.id} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                  <Box
                    component="article"
                    className="card-hover"
                    sx={{
                      width: '100%',
                      minHeight: { md: 345 },
                      p: { xs: 2.5, md: 3 },
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      border: `1px solid ${colors.border}`,
                      borderTop: `4px solid ${item.accent}`,
                      bgcolor: colors.surface,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        mb: 2,
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        color: item.accent,
                        bgcolor: `${item.accent}12`,
                      }}
                    >
                      <Icon size={25} strokeWidth={1.6} aria-hidden />
                    </Box>
                    <Typography variant="h3" sx={{ fontSize: { xs: '1.1rem', md: '1.2rem' }, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7, fontSize: { xs: '0.9375rem', md: '1rem' } }}
                    >
                      {item.desc}
                    </Typography>
                    <PilarVisual type={item.id} accent={item.accent} />
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Reveal>
      </ScrollSection>

      <ScrollSection
        id="desarrollo-sesion"
        alt
        size="content"
        contentMaxWidth={{ xs: 720, lg: 1180 }}
        sx={{
          justifyContent: 'flex-start',
          pt: { xs: 3, md: 4 },
        }}
      >
        <Reveal y={16}>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 760,
              mx: 'auto',
              mb: { xs: 3.5, md: 4 },
              textAlign: 'center',
              color: colors.secondary,
              fontSize: { xs: '1.05rem', md: '1.125rem' },
              lineHeight: 1.75,
            }}
          >
            Así se ve, paso a paso, una jornada real de formación. No es una promesa abstracta — es lo que vivimos
            cada semana.
          </Typography>
        </Reveal>
        <SectionHeading
          overline="Pedagogía Espiritual"
          title="Desarrollo de la sesión"
          subtitle="Ritmo semanal de oración, formación y fraternidad — de 9:00 a 14:00."
        />

        <Reveal y={18}>
          <Box
            sx={{
              mt: 1,
              mb: 4,
              p: { xs: 2, md: 2.5 },
              borderRadius: 2,
              bgcolor: colors.dark,
              color: colors.cream,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(235, 219, 178, 0.9)' }}>
              Inicio · 9:00
            </Typography>
            <Typography variant="body2" sx={{ color: colors.accent, fontWeight: 600 }}>
              Jornada semanal
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(235, 219, 178, 0.9)' }}>
              Cierre · 14:00
            </Typography>
          </Box>
        </Reveal>

        <Box sx={{ display: { lg: 'flex' }, gap: { lg: 4 }, alignItems: 'flex-start' }}>
          <ItinerarioProgressNav
            steps={steps}
            activeId={activeId}
            onSelect={scrollToSection}
            label="Horario"
            ariaLabel="Progreso del desarrollo de la sesión"
          />

          <Stack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
            {DESARROLLO_SESION.map((momento, index) => (
              <SesionTimelineItem
                key={momento.time}
                momento={momento}
                index={index}
                isLast={index === DESARROLLO_SESION.length - 1}
                sectionId={steps[index].id}
              />
            ))}
          </Stack>
        </Box>

        <Reveal y={18}>
          <Box
            sx={{
              mt: { xs: 5, md: 6 },
              p: { xs: 3, md: 4 },
              borderRadius: 2,
              bgcolor: colors.dark,
              color: colors.cream,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body1"
              sx={{ maxWidth: 720, mx: 'auto', mb: 2.5, color: 'rgba(235,219,178,0.92)', lineHeight: 1.8 }}
            >
              Sabemos que puede parecer un itinerario exigente. Por eso nunca caminas solo: cada etapa está
              acompañada por hermanos que ya recorrieron este camino.
            </Typography>
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
              Conoce las 4 etapas de tu formación →
            </Button>
          </Box>
        </Reveal>
      </ScrollSection>
    </>
  )
}
