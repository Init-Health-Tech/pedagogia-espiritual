import { Box, Grid, Typography } from '@mui/material'
import SectionHeading from '../SectionHeading'
import Reveal from './Reveal'
import { colors } from '../../../theme/muiTheme'
import { HEADER_HEIGHT } from '../../../utils/marketingNav'

/**
 * Imagen y encabezado fijos mientras el texto se revela al hacer scroll.
 */
export default function StickyStory({
  id,
  overline,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  paragraphs,
}) {
  return (
    <Box
      id={id}
      sx={{
        minHeight: { xs: 'auto', md: 'auto' },
      }}
    >
      <Grid container spacing={{ xs: 4, md: 6 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              position: { md: 'sticky' },
              top: { md: `calc(${HEADER_HEIGHT}px + 2rem)` },
              alignSelf: 'flex-start',
            }}
          >
            <Reveal y={16}>
              <SectionHeading
                overline={overline}
                title={title}
                subtitle={subtitle}
                align="left"
                animate={false}
                subtitleSx={{ maxWidth: { md: 'none' }, textAlign: { md: 'justify' } }}
              />
            </Reveal>
            <Reveal delay={0.08} y={20} scale={0.98}>
              <Box
                component="img"
                src={imageSrc}
                alt={imageAlt}
                sx={{
                  width: '100%',
                  height: { xs: 260, md: 340 },
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`,
                }}
              />
            </Reveal>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            component="ul"
            sx={{
              m: 0,
              p: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {paragraphs.map((parrafo, index) => (
              <Reveal key={parrafo} delay={index * 0.04} y={24}>
                <Box
                  component="li"
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start',
                    py: { xs: 0.5, md: 1 },
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: colors.accent,
                      mt: '0.7em',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.85, fontSize: { xs: '1rem', md: '1.0625rem' }, textAlign: { md: 'justify' } }}
                  >
                    {parrafo}
                  </Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
