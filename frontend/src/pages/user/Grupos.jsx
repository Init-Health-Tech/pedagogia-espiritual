import { useEffect, useState } from 'react'
import { Card, CardContent, Chip, Grid, Typography } from '@mui/material'
import { groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'

export default function Grupos() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    groupsAPI.misGrupos().then((r) => setGrupos(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Grupos de pastoreo" subtitle="Tu comunidad de formación y acompañamiento" />
      {grupos.length === 0 ? (
        <EmptyState title="Sin grupos asignados" description="Aún no perteneces a un grupo de pastoreo." />
      ) : (
        <Grid container spacing={2}>
          {grupos.map((g) => (
            <Grid key={g.id} size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>{g.nombre}</Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>{g.descripcion}</Typography>
                  <Typography variant="body2"><strong>Coordinador:</strong> {g.coordinador_nombre || '—'}</Typography>
                  <Typography variant="body2"><strong>Reunión:</strong> {g.horario_reunion || 'Por definir'}</Typography>
                  <Chip label={`${g.total_miembros} miembros`} size="small" sx={{ mt: 1.5 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
