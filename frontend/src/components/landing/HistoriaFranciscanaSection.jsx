import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { ChevronDown, Clock3, HeartHandshake, Quote, UserRound } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from './SectionHeading'
import ScrollSection from './ScrollSection'
import Reveal from './motion/Reveal'
import RevealStagger, { RevealStaggerItem } from './motion/RevealStagger'
import { HISTORIA_FRANCISCANA } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'

const ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent, colors.moss]

function ChapterBlock({ chapter, index }) {
  const accent = ACCENTS[index % ACCENTS.length]

  return (
    <Reveal y={20} delay={index * 0.04}>
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          mb: { xs: 3, md: 3.5 },
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          borderLeft: `4px solid ${accent}`,
          bgcolor: index % 2 === 0 ? colors.surface : 'rgba(255,255,255,0.45)',
          overflow: 'hidden',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ChevronDown size={20} />}
          aria-controls={`historia-capitulo-${index}`}
          id={`historia-capitulo-${index}-encabezado`}
          sx={{
            p: { xs: 2.25, md: 2.75 },
            '& .MuiAccordionSummary-content': { my: 0 },
          }}
        >
          <Box sx={{ pr: 2 }}>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' }, mb: 1, color: colors.dark }}
            >
              {chapter.title}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                fontSize: { xs: '0.9875rem', md: '1.0375rem' },
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {chapter.summary}
            </Typography>
            <Typography variant="button" sx={{ display: 'block', mt: 1.25, color: accent, textTransform: 'none' }}>
              Leer más
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails
          id={`historia-capitulo-${index}`}
          sx={{ px: { xs: 2.25, md: 2.75 }, pt: 0, pb: { xs: 2.25, md: 2.75 } }}
        >
          <Box sx={{ height: 1, bgcolor: colors.border, mb: 2 }} />
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {chapter.paragraphs.map((text) => (
            <Box key={text} component="li" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
              <Box
                aria-hidden
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: accent,
                  mt: '0.65em',
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, fontSize: { xs: '1rem', md: '1.0625rem' }, textAlign: { md: 'justify' } }}
              >
                {text}
              </Typography>
            </Box>
          ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Reveal>
  )
}

function TodayBlock({ children, dark = false }) {
  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 1.5,
        borderLeft: `4px solid ${dark ? colors.accent : colors.moss}`,
        bgcolor: dark ? 'rgba(235,219,178,0.1)' : 'rgba(74,103,65,0.08)',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
        <Clock3 size={17} aria-hidden />
        <Typography
          variant="overline"
          sx={{ color: dark ? colors.cream : colors.moss, fontWeight: 700, letterSpacing: '0.1em' }}
        >
          Así lo vivimos hoy
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        sx={{ color: dark ? 'rgba(235,219,178,0.88)' : 'text.secondary', lineHeight: 1.7 }}
      >
        {children}
      </Typography>
    </Box>
  )
}

function CarismaBlock({ content }) {
  return (
    <Reveal y={18}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
          overflow: 'hidden',
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: { xs: 150, sm: '100%' }, p: 3, bgcolor: colors.cream, color: colors.dark }}
        >
          <Typography
            aria-hidden
            sx={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: '5rem', lineHeight: 0.9 }}
          >
            T
          </Typography>
          <HeartHandshake size={28} strokeWidth={1.5} aria-hidden />
          <Typography variant="caption" sx={{ mt: 1, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Tau franciscano
          </Typography>
        </Stack>
        <Box sx={{ p: { xs: 2.5, md: 3.25 } }}>
          <Typography variant="overline" sx={{ color: colors.secondary }}>
            Carisma
          </Typography>
          <Typography variant="h2" sx={{ mt: 0.5, mb: 1.25, fontSize: { xs: '1.4rem', md: '1.65rem' } }}>
            Una forma de vivir en fraternidad
          </Typography>
          <Typography color="text.secondary">{content.description}</Typography>
          <TodayBlock>{content.today}</TodayBlock>
        </Box>
      </Box>
    </Reveal>
  )
}

function EspiritualidadBlock({ content }) {
  return (
    <Reveal y={18}>
      <Box
        component="blockquote"
        sx={{
          position: 'relative',
          m: 0,
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: colors.dark,
          color: colors.cream,
        }}
      >
        <Quote
          size={92}
          strokeWidth={1}
          aria-hidden
          style={{ position: 'absolute', top: 18, right: 22, opacity: 0.14 }}
        />
        <Typography variant="overline" sx={{ color: colors.accent }}>
          Espiritualidad
        </Typography>
        <Typography
          variant="h2"
          sx={{
            maxWidth: 570,
            mt: 1.5,
            mb: 1.75,
            pl: { xs: 2, md: 3 },
            borderLeft: `4px solid ${colors.accent}`,
            color: colors.cream,
            fontSize: { xs: '1.65rem', md: '2rem' },
            fontStyle: 'italic',
          }}
        >
          “{content.quote}”
        </Typography>
        <Typography sx={{ maxWidth: 650, color: 'rgba(235,219,178,0.88)', lineHeight: 1.75 }}>
          {content.description}
        </Typography>
        <TodayBlock dark>{content.today}</TodayBlock>
      </Box>
    </Reveal>
  )
}

function FigurasBlock({ figures }) {
  const accents = [colors.secondary, colors.blue, colors.moss]

  return (
    <Reveal y={18}>
      <Box sx={{ pt: { xs: 1, md: 1.5 } }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.75 }}>
          <UserRound size={24} color={colors.secondary} aria-hidden />
          <Typography variant="overline" sx={{ color: colors.secondary }}>
            Figuras clave
          </Typography>
        </Stack>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Rostros de una misma tradición
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2.5 }}>
          Personas que encarnaron el carisma franciscano desde vocaciones distintas.
        </Typography>
        <RevealStagger sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            {figures.map((figure, index) => (
              <Grid key={figure.name} size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
                <RevealStaggerItem sx={{ display: 'flex', width: '100%' }}>
                  <Stack
                    alignItems="center"
                    sx={{
                      width: '100%',
                      p: 2.5,
                      textAlign: 'center',
                      borderRadius: 2,
                      border: `1px solid ${colors.border}`,
                      bgcolor: index === 1 ? colors.surface : colors.light,
                    }}
                  >
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: 76,
                        height: 76,
                        mb: 1.5,
                        borderRadius: '50%',
                        bgcolor: accents[index],
                        color: '#fff',
                        boxShadow: `0 0 0 6px ${colors.surface}`,
                      }}
                    >
                      <UserRound size={25} strokeWidth={1.5} aria-hidden />
                      <Typography variant="caption" sx={{ mt: 0.25, color: 'inherit', fontSize: '0.68rem' }}>
                        {figure.initials}
                      </Typography>
                    </Stack>
                    <Typography variant="h3" sx={{ mb: 0.75, fontSize: '1rem' }}>
                      {figure.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {figure.description}
                    </Typography>
                  </Stack>
                </RevealStaggerItem>
              </Grid>
            ))}
          </Grid>
        </RevealStagger>
      </Box>
    </Reveal>
  )
}

function TimelineItem({ item, index, isLast }) {
  const accent = ACCENTS[index % ACCENTS.length]

  return (
    <Reveal y={18} delay={Math.min(index * 0.02, 0.2)}>
      <Box sx={{ display: 'flex', gap: { xs: 2, md: 2.5 }, position: 'relative' }}>
        <Stack alignItems="center" sx={{ width: { xs: 84, md: 112 }, flexShrink: 0 }}>
          <Typography
            className="font-display"
            sx={{
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              fontWeight: 700,
              color: accent,
              textAlign: 'center',
              lineHeight: 1.2,
              minHeight: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.year}
          </Typography>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: accent,
              my: 0.75,
              zIndex: 1,
              boxShadow: `0 0 0 4px ${colors.surface}`,
            }}
          />
          {!isLast && (
            <Box sx={{ width: 2, flex: 1, minHeight: 28, bgcolor: colors.border }} />
          )}
        </Stack>

        <Box sx={{ flex: 1, pb: isLast ? 0 : { xs: 2.5, md: 3 }, pt: 0.25 }}>
          <Box
            sx={{
              p: { xs: 1.75, md: 2 },
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
              bgcolor: index % 2 === 0 ? 'rgba(255,255,255,0.55)' : colors.light,
            }}
          >
            <Typography variant="h3" sx={{ fontSize: { xs: '1.05rem', md: '1.15rem' }, mb: 0.75 }}>
              {item.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.9875rem' }}>
              {item.text}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: accent, lineHeight: 1.6, fontSize: '0.85rem' }}>
              {item.detail}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Reveal>
  )
}

export default function HistoriaFranciscanaSection({ lead = false }) {
  const { chapters, identidad, timelineGroups } = HISTORIA_FRANCISCANA

  return (
    <ScrollSection
      id="historia-franciscana"
      alt
      lead={lead}
      size="content"
      contentMaxWidth={{ xs: 720, md: 820 }}
      sx={{ px: { xs: 3, md: 4, lg: 6 } }}
    >
      <SectionHeading
        overline="El Movimiento"
        title="Nuestra historia"
        subtitle="Nuestra historia no empieza con nosotros. Empieza hace más de 800 años, con un hombre que decidió vivir el Evangelio sin condiciones."
      />

      {chapters.map((chapter, index) => (
        <ChapterBlock key={chapter.title} chapter={chapter} index={index} />
      ))}

      <Reveal y={16}>
        <Typography variant="overline" className="section-overline" display="block" sx={{ mt: 1, mb: 2 }}>
          Elementos identitarios
        </Typography>
      </Reveal>

      <Stack spacing={{ xs: 3, md: 3.5 }} sx={{ mb: { xs: 4, md: 5 } }}>
        <CarismaBlock content={identidad.carisma} />
        <EspiritualidadBlock content={identidad.espiritualidad} />
        <FigurasBlock figures={identidad.figuras} />
      </Stack>

      <Reveal y={16}>
        <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 0.75 }}>
          Línea del tiempo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.0625rem', lineHeight: 1.8 }}>
          Cinco momentos que muestran cómo una intuición nacida en Asís se convirtió en un carisma vivo.
        </Typography>
      </Reveal>

      <Stack spacing={0}>
        {timelineGroups.map((item, index) => (
          <TimelineItem
            key={item.year}
            item={item}
            index={index}
            isLast={index === timelineGroups.length - 1}
          />
        ))}
      </Stack>

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
          <Typography variant="h2" sx={{ color: colors.cream, fontSize: { xs: '1.5rem', md: '1.9rem' }, mb: 1.5 }}>
            Una pregunta que sigue abierta
          </Typography>
          <Typography sx={{ maxWidth: 680, mx: 'auto', mb: 2.5, color: 'rgba(235,219,178,0.9)', lineHeight: 1.75 }}>
            Francisco dejó una pregunta abierta hace 800 años: ¿cómo vivir el Evangelio sin reservas? Nuestra comunidad
            sigue respondiendo esa pregunta cada día. ¿Te gustaría ser parte de la respuesta?
          </Typography>
          <Button
            component={RouterLink}
            to="/formacion"
            variant="contained"
            sx={{ bgcolor: colors.cream, color: colors.dark, '&:hover': { bgcolor: '#F5EBD4' } }}
          >
            Conoce el itinerario formativo →
          </Button>
        </Box>
      </Reveal>
    </ScrollSection>
  )
}
