import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { contentAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import { colors } from '../../theme/muiTheme'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentAPI.videos().then((r) => setVideos(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Videos formativos" subtitle="Material audiovisual para acompañar tu formación espiritual" />
      {videos.length === 0 ? (
        <EmptyState
          title="Aún no hay videos disponibles"
          description="Cuando tu coordinador publique clases o reflexiones en video, las verás aquí."
          actionLabel="Volver al inicio"
          onAction={() => { window.location.href = '/app' }}
        />
      ) : (
        <Grid container spacing={2.5}>
          {videos.map((v) => (
            <Grid key={v.id} size={{ xs: 12, md: 6 }}>
              <Card className="card-hover">
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 400, mb: 1 }}>{v.titulo}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{v.descripcion}</Typography>
                  {v.url_externa && (
                    <Box sx={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 2, overflow: 'hidden', bgcolor: colors.border }}>
                      <Box component="iframe" title={v.titulo} src={v.url_externa} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
