import { useEffect, useState } from 'react'
import { Card, CardContent, Chip, Grid, Link, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../animations/variants'
import { contentAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'

const tipoLabel = { video: 'Video', documento: 'Documento', presentacion: 'Presentación', esquema: 'Esquema', audio: 'Audio' }

export default function Contenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentAPI.list().then((r) => setItems(r.data.results || r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Biblioteca de contenidos" subtitle="Documentos, esquemas, presentaciones y materiales de formación" />
      {items.length === 0 ? (
        <EmptyState title="Sin contenidos" description="No hay materiales disponibles en este momento." />
      ) : (
        <Grid container spacing={2} component={motion.div} variants={staggerContainer} initial="initial" animate="animate">
          {items.map((c) => (
            <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Box component={motion.div} variants={staggerItem} whileHover={{ y: -4 }} style={{ height: '100%' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Chip label={tipoLabel[c.tipo] || c.tipo} size="small" sx={{ mb: 1.5 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>{c.titulo}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{c.descripcion}</Typography>
                  {c.url_externa && <Link href={c.url_externa} target="_blank" rel="noreferrer" variant="body2">Abrir recurso</Link>}
                </CardContent>
              </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
