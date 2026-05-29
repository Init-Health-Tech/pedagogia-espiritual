import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material'
import { FOOTER_COLUMNS } from '../../data/marketingContent'
import { scrollTo } from './MarketingNav'

export default function MarketingFooter() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'rgba(255,255,255,0.9)',
        pt: 6,
        pb: 3,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Movimiento Franciscano
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, maxWidth: 320, lineHeight: 1.7 }}>
              Pedagogía Espiritual de la Santísima Trinidad. Formación integral en la fe,
              la fraternidad y el servicio.
            </Typography>
          </Grid>
          {FOOTER_COLUMNS.map((col) => (
            <Grid key={col.title} size={{ xs: 6, sm: 4, md: 2.67 }}>
              <Typography variant="overline" sx={{ opacity: 0.6, display: 'block', mb: 1.5 }}>
                {col.title}
              </Typography>
              <Stack spacing={1}>
                {col.links.map((link) =>
                  link.route ? (
                    <Link
                      key={link.label}
                      component={RouterLink}
                      to={link.href}
                      underline="hover"
                      sx={{ color: 'inherit', opacity: 0.85, fontSize: '0.875rem' }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      underline="hover"
                      onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                      sx={{ color: 'inherit', opacity: 0.85, fontSize: '0.875rem', cursor: 'pointer' }}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.12)', pt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ opacity: 0.55 }}>
            © {new Date().getFullYear()} Movimiento Franciscano — Pedagogía Espiritual de la Santísima Trinidad. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
