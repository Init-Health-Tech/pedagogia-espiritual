import { useMemo } from 'react'
import { alpha } from '@mui/material/styles'
import { Box, Stack, Typography } from '@mui/material'
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
    title: 'Etapas, no exámenes',
    desc: 'Cuatro módulos son etapas del camino. Administradores y coordinadores observan tu avance y te acompañan.',
    accent: colors.primary,
  },
  {
    title: 'Manuales interactivos',
    desc: 'Guías digitales con tips, imágenes y reflexiones — mucho más que un PDF estático.',
    accent: colors.blue,
  },
  {
    title: 'Diario semanal',
    desc: 'Cada semana escribes en tu ficha con respuestas abiertas, como un diario personal de fe.',
    accent: colors.accent,
  },
]

const TRINIDAD_NODOS = [
  {
    role: 'Padre',
    desc: 'Origen y destino de toda la vida. El Dios que nos crea y nos llama por nombre.',
    accent: colors.primary,
    sx: { top: { xs: 0, md: 8 }, left: '50%', transform: 'translateX(-50%)' },
  },
  {
    role: 'Espíritu Santo',
    desc: 'Fuerza santificadora que guía, consuela y envía a la misión.',
    accent: colors.accent,
    sx: { bottom: { xs: 0, md: 4 }, left: { xs: '2%', md: '4%' } },
  },
  {
    role: 'Hijo',
    desc: 'Jesucristo, camino, verdad y vida. Modelo de entrega y servicio.',
    accent: colors.blue,
    sx: { bottom: { xs: 0, md: 4 }, right: { xs: '2%', md: '4%' } },
  },
]

function TrinidadNode({ role, desc, accent, sx }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: { xs: 108, sm: 140, md: 168 },
        zIndex: 1,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: { xs: 88, sm: 104, md: 120 },
          height: { xs: 88, sm: 104, md: 120 },
          borderRadius: '50%',
          border: `2px solid ${accent}`,
          bgcolor: colors.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 1,
          boxShadow: `0 8px 24px ${alpha(accent, 0.18)}`,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontSize: { xs: '0.58rem', sm: '0.65rem', md: '0.72rem' },
            color: accent,
            lineHeight: 1.25,
            letterSpacing: '0.04em',
          }}
        >
          {role}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1.5,
          textAlign: 'center',
          lineHeight: 1.6,
          fontSize: { xs: '0.72rem', sm: '0.8rem', md: '0.875rem' },
        }}
      >
        {desc}
      </Typography>
    </Box>
  )
}

function TrinidadTriangle() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 760,
        mx: 'auto',
        minHeight: { xs: 420, sm: 460, md: 480 },
        mt: 2,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 400 320"
        preserveAspectRatio="xMidYMid meet"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <polygon
          points="200,58 72,262 328,262"
          fill="none"
          stroke={colors.border}
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
      </Box>

      {TRINIDAD_NODOS.map((nodo) => (
        <TrinidadNode key={nodo.role} {...nodo} />
      ))}
    </Box>
  )
}

const SESSION_ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent, colors.moss]

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
      <ScrollSection id="que-es-pedagogia" alt lead size="full">
        <SectionHeading overline="Pedagogía Espiritual" title="¿Qué es la pedagogía espiritual?" subtitle="Acompañamiento personal y progresivo — medido por quienes caminan contigo." />
        <Reveal delay={0.08} y={22} scale={0.99}>
          <Box
            className="landing-block"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0,
              p: 0,
              overflow: 'hidden',
            }}
          >
            {PEDAGOGIA_PILARES.map((item, index) => (
              <Box
                key={item.title}
                sx={{
                  px: { xs: 1.5, sm: 2.5, md: 3 },
                  py: { xs: 2, md: 2.5 },
                  borderTop: `3px solid ${item.accent}`,
                  borderRight: index < 2 ? `1px solid ${colors.border}` : 'none',
                }}
              >
                <Typography variant="h3" className="font-display" sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7, fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' } }}
                >
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Reveal>
      </ScrollSection>

      <ScrollSection id="santisima-trinidad" size="full">
        <SectionHeading overline="Pedagogía Espiritual" title="La Santísima Trinidad" subtitle="Dios es comunión de amor entre Padre, Hijo y Espíritu Santo." />
        <Reveal delay={0.1} y={20}>
          <TrinidadTriangle />
        </Reveal>
      </ScrollSection>

      <ScrollSection id="desarrollo-sesion" alt size="content" contentMaxWidth={{ xs: 720, lg: 1180 }}>
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
      </ScrollSection>
    </>
  )
}
