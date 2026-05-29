import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import { groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'

export default function AdminGrupos() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nombre: '', descripcion: '', horario_reunion: '' })

  const load = () => groupsAPI.list().then((r) => setGrupos(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await groupsAPI.create(form)
    setForm({ nombre: '', descripcion: '', horario_reunion: '' })
    load()
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Grupos de pastoreo" subtitle="Comunidades de formación y coordinación" />
      <Card sx={{ mb: 3, maxWidth: 560 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo grupo</Typography>
          <TextField label="Nombre" fullWidth required sx={{ mb: 2 }} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <TextField label="Descripción" multiline rows={2} fullWidth sx={{ mb: 2 }} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          <TextField label="Horario" fullWidth sx={{ mb: 2 }} value={form.horario_reunion} onChange={(e) => setForm({ ...form, horario_reunion: e.target.value })} />
          <Button type="submit" variant="contained">Crear grupo</Button>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {grupos.map((g) => (
          <Grid key={g.id} size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>{g.nombre}</Typography>
                <Typography variant="body2" sx={{ my: 1 }}>{g.descripcion}</Typography>
                <Typography variant="body2">Miembros: {g.total_miembros}</Typography>
                <Typography variant="body2">Horario: {g.horario_reunion || '—'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
