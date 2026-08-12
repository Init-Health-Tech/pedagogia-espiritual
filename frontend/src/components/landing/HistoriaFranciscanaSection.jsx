import { Box, Grid, Stack, Typography } from '@mui/material'
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
      <Box
        sx={{
          mb: { xs: 3, md: 3.5 },
          p: { xs: 2.25, md: 2.75 },
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          borderLeft: `4px solid ${accent}`,
          bgcolor: index % 2 === 0 ? colors.surface : 'rgba(255,255,255,0.45)',
        }}
      >
        <Typography
          variant="h3"
          className="font-display"
          sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' }, mb: 1.5, color: colors.dark }}
        >
          {chapter.title}
        </Typography>
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
      </Box>
    </Reveal>
  )
}

function TimelineItem({ item, index, isLast }) {
  const accent = ACCENTS[index % ACCENTS.length]

  return (
    <Reveal y={18} delay={Math.min(index * 0.02, 0.2)}>
      <Box sx={{ display: 'flex', gap: { xs: 2, md: 2.5 }, position: 'relative' }}>
        <Stack alignItems="center" sx={{ width: { xs: 72, md: 96 }, flexShrink: 0 }}>
          <Typography
            className="font-display"
            sx={{
              fontSize: { xs: '0.8rem', md: '0.875rem' },
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
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.75,
              fontSize: { xs: '0.9875rem', md: '1.0625rem' },
              textAlign: { md: 'justify' },
              p: { xs: 1.75, md: 2 },
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
              bgcolor: index % 2 === 0 ? 'rgba(255,255,255,0.55)' : colors.light,
            }}
          >
            {item.text}
          </Typography>
        </Box>
      </Box>
    </Reveal>
  )
}

export default function HistoriaFranciscanaSection() {
  const { chapters, identidad, timeline } = HISTORIA_FRANCISCANA

  return (
    <ScrollSection
      id="historia-franciscana"
      alt
      size="content"
      contentMaxWidth={{ xs: 720, md: 820 }}
      sx={{ px: { xs: 3, md: 4, lg: 6 } }}
    >
      <SectionHeading
        overline="El Movimiento"
        title="Historia franciscana"
        subtitle="Desde San Francisco de Asís hasta la Tercera Orden Regular (TOR): un camino de fraternidad, minoridad y penitencia."
      />

      {chapters.map((chapter, index) => (
        <ChapterBlock key={chapter.title} chapter={chapter} index={index} />
      ))}

      <Reveal y={16}>
        <Typography variant="overline" className="section-overline" display="block" sx={{ mt: 1, mb: 2 }}>
          Elementos identitarios
        </Typography>
      </Reveal>

      <RevealStagger sx={{ width: '100%', mb: { xs: 4, md: 5 } }}>
        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
          {identidad.map((item, index) => (
            <Grid key={item.title} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
              <RevealStaggerItem sx={{ width: '100%', display: 'flex' }}>
                <Box
                  sx={{
                    flex: 1,
                    p: 2.25,
                    borderRadius: 2,
                    border: `1px solid ${colors.border}`,
                    borderTop: `3px solid ${ACCENTS[index % ACCENTS.length]}`,
                    bgcolor: colors.surface,
                  }}
                >
                  <Typography variant="h3" className="font-display" sx={{ fontSize: '1.1rem', mb: 1, color: colors.dark }}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, fontSize: '0.9875rem', textAlign: { md: 'justify' } }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </RevealStaggerItem>
            </Grid>
          ))}
        </Grid>
      </RevealStagger>

      <Reveal y={16}>
        <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 0.75 }}>
          Línea del tiempo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.0625rem', lineHeight: 1.8 }}>
          Hitos que marcan el nacimiento y la consolidación de la familia franciscana y de la TOR.
        </Typography>
      </Reveal>

      <Stack spacing={0}>
        {timeline.map((item, index) => (
          <TimelineItem
            key={`${item.year}-${item.text.slice(0, 24)}`}
            item={item}
            index={index}
            isLast={index === timeline.length - 1}
          />
        ))}
      </Stack>
    </ScrollSection>
  )
}
