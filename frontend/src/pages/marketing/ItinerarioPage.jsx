import { Box, Stack, Typography } from '@mui/material'
import ContactSection from '../../components/landing/ContactSection'
import SectionHeading from '../../components/landing/SectionHeading'
import ScrollSection, { SectionDivider } from '../../components/landing/ScrollSection'
import { ITINERARIO_FORMATIVO } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'
import { HEADER_HEIGHT } from '../../utils/marketingNav'

const STEP_ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent, colors.moss]

function EjeTimelineItem({ item, index, isLast }) {
  const accent = STEP_ACCENTS[index % STEP_ACCENTS.length]

  return (
    <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, position: 'relative' }}>
      <Stack alignItems="center" sx={{ width: { xs: 44, md: 52 }, flexShrink: 0 }}>
        <Box
          sx={{
            width: { xs: 40, md: 48 },
            height: { xs: 40, md: 48 },
            borderRadius: '50%',
            bgcolor: accent,
            color: colors.cream,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Playfair Display", serif',
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            fontWeight: 700,
            zIndex: 1,
            boxShadow: `0 0 0 4px ${colors.light}`,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              minHeight: 32,
              bgcolor: colors.border,
              my: 0.75,
            }}
          />
        )}
      </Stack>

      <Box
        sx={{
          flex: 1,
          pb: isLast ? 0 : { xs: 3, md: 4 },
          pt: 0.5,
        }}
      >
        <Box
          className="card-hover"
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 2,
            border: `1px solid ${colors.border}`,
            bgcolor: index % 2 === 0 ? colors.surface : 'rgba(255,255,255,0.5)',
            borderLeft: `4px solid ${accent}`,
            transition: 'box-shadow 0.2s',
          }}
        >
          <Typography
            variant="h3"
            className="font-display"
            sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' }, mb: 1, color: colors.dark }}
          >
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {item.desc}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default function ItinerarioPage() {
  return (
    <Box sx={{ pt: `${HEADER_HEIGHT + 32}px` }}>
      <ScrollSection id="itinerario-formativo" alt>
        <SectionHeading
          overline="Formación"
          title="Itinerario formativo"
          subtitle="Diez ejes de formación que integran teología, pedagogía, pastoral y vida franciscana."
        />

        <Box
          sx={{
            mt: 1,
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            bgcolor: colors.dark,
            color: colors.cream,
            mb: 4,
            textAlign: { xs: 'left', md: 'center' },
          }}
        >
          <Typography variant="body1" sx={{ color: 'rgba(235, 219, 178, 0.9)', maxWidth: 720, mx: 'auto', lineHeight: 1.7 }}>
            Un camino progresivo de diez etapas que articula la formación integral del movimiento — desde la antropología hasta la liturgia.
          </Typography>
        </Box>

        <Stack spacing={0}>
          {ITINERARIO_FORMATIVO.map((item, index) => (
            <EjeTimelineItem
              key={item.title}
              item={item}
              index={index}
              isLast={index === ITINERARIO_FORMATIVO.length - 1}
            />
          ))}
        </Stack>
      </ScrollSection>

      <SectionDivider />
      <ContactSection />
    </Box>
  )
}
