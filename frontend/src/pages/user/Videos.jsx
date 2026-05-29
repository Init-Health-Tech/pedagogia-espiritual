import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { contentAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentAPI.videos().then((r) => setVideos(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Videos formativos" subtitle="Material audiovisual para tu formación espiritual" />
      {videos.length === 0 ? (
        <EmptyState title="Sin videos" description="No hay videos disponibles en este momento." />
      ) : (
        <Grid container spacing={2}>
          {videos.map((v) => (
            <Grid key={v.id} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>{v.titulo}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>{v.descripcion}</Typography>
                  {v.url_externa && (
                    <Box sx={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover' }}>
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
