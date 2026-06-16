import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { Users } from 'lucide-react'
import { groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { colors } from '../../theme/muiTheme'

export default function Grupos() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    groupsAPI.misGrupos().then((r) => setGrupos(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Grupos de pastoreo" subtitle="Tu comunidad de formación y acompañamiento" />
      {grupos.length === 0 ? (
        <EmptyState
          title="Aún no tienes un grupo asignado"
          description="Tu coordinador te asignará un grupo de pastoreo pronto. Mientras tanto, puedes continuar con tu ficha pedagógica."
          actionLabel="Ir a mi ficha"
          onAction={() => { window.location.href = '/app/ficha' }}
        />
      ) : (
        <Grid container spacing={2.5}>
          {grupos.map((g) => (
            <Grid key={g.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card className="card-hover" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${colors.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Users size={24} color={colors.primary} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 400, mb: 1 }}>{g.nombre}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{g.descripcion}</Typography>
                  <Typography variant="body1" sx={{ mb: 0.5 }}><strong>Coordinador:</strong> {g.coordinador_nombre || 'Por asignar'}</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}><strong>Reunión:</strong> {g.horario_reunion || 'Horario por confirmar'}</Typography>
                  <StatusBadge status="active" label={`${g.total_miembros} miembros`} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
