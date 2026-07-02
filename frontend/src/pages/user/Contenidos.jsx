import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Link, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { staggerContainer, staggerItem } from '../../animations/variants'
import { contentAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { colors } from '../../theme/muiTheme'

const tipoLabel = { video: 'Video', documento: 'Documento', presentacion: 'Presentación', esquema: 'Esquema', audio: 'Audio' }

export default function Contenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contentAPI.list().then((r) => setItems(r.data.results || r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen rows={3} />

  return (
    <>
      <PageHeader title="Biblioteca de contenidos" subtitle="Documentos, esquemas, presentaciones y materiales de formación" />
      {items.length === 0 ? (
        <EmptyState
          title="La biblioteca está vacía por ahora"
          description="Los manuales y materiales de tu módulo aparecerán aquí cuando estén disponibles."
          actionLabel="Ver mi ficha pedagógica"
          onAction={() => { window.location.href = '/app/ficha' }}
        />
      ) : (
        <Grid container spacing={2.5} component={motion.div} variants={staggerContainer} initial="initial" animate="animate">
          {items.map((c) => (
            <Grid key={c.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <motion.div variants={staggerItem} style={{ height: '100%' }}>
                <Card className="card-hover" sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <BookOpen size={20} color={colors.primary} />
                      <StatusBadge status="info" label={tipoLabel[c.tipo] || c.tipo} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 400, mb: 1 }}>{c.titulo}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, flex: 1 }}>{c.descripcion}</Typography>
                    {c.url_externa && (
                      <Button component={Link} href={c.url_externa} target="_blank" rel="noreferrer" variant="contained" fullWidth>
                        Abrir material
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
