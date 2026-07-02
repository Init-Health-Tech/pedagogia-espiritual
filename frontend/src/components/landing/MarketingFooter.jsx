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
      <Container maxWidth={false} sx={{ maxWidth: 760, mx: 'auto', px: 3 }}>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box component={RouterLink} to="/" sx={{ display: 'inline-block', mb: 2, textDecoration: 'none' }}>
              <TorLogo size="sm" />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 320, lineHeight: 1.7 }}>
              Pedagogía Espiritual de la Santísima Trinidad. Formación integral en la fe,
              la fraternidad y el servicio.
            </Typography>
          </Grid>
          {FOOTER_COLUMNS.map((col) => (
            <Grid key={col.title} size={{ xs: 6, sm: 4, md: 2.33 }}>
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
