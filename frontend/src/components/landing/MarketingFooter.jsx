import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material'
import TorLogo from '../common/TorLogo'
import { FOOTER_COLUMNS } from '../../data/marketingContent'
import { colors } from '../../theme/muiTheme'
import { navigateToMarketingHref } from '../../utils/marketingNav'

export default function MarketingFooter() {
  const navigate = useNavigate()

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.surface,
        color: colors.dark,
        pt: 6,
        pb: 3,
        borderTop: `1px solid ${colors.border}`,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1100, mx: 'auto', px: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 2, md: 3 },
            flexDirection: { xs: 'column', md: 'row' },
            mb: 4,
          }}
        >
          <Box component={RouterLink} to="/" sx={{ display: 'inline-block', textDecoration: 'none', flexShrink: 0 }}>
            <TorLogo size="sm" />
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.7, whiteSpace: { md: 'nowrap' } }}
          >
            Pedagogía Espiritual de la Santísima Trinidad. Formación integral en la fe, la fraternidad y el servicio.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {FOOTER_COLUMNS.map((col) => (
            <Grid key={col.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="overline" sx={{ display: 'block', mb: 1.5 }}>{col.title}</Typography>
              <Stack spacing={1}>
                {col.links.map((link) =>
                  link.route ? (
                    <Link key={link.label} component={RouterLink} to={link.href} underline="hover" sx={{ color: colors.primary, fontSize: '1rem' }}>
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      underline="hover"
                      onClick={(e) => {
                        e.preventDefault()
                        navigateToMarketingHref(navigate, link.href)
                      }}
                      sx={{ color: colors.primary, fontSize: '1rem', cursor: 'pointer' }}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ borderTop: `1px solid ${colors.border}`, opacity: 0.6, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Movimiento Franciscano — Pedagogía Espiritual de la Santísima Trinidad.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
