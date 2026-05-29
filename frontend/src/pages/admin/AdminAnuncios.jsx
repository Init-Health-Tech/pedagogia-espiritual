import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import api from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'

export default function AdminAnuncios() {
  const [anuncios, setAnuncios] = useState([])
  const [form, setForm] = useState({ titulo: '', contenido: '', es_global: true, importante: false })
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/communications/anuncios/').then((r) => setAnuncios(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await api.post('/communications/anuncios/', form)
    setForm({ titulo: '', contenido: '', es_global: true, importante: false })
    load()
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Anuncios" subtitle="Comunicación institucional interna" />
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo anuncio</Typography>
          <TextField label="Título" fullWidth required sx={{ mb: 2 }} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <TextField label="Contenido" multiline rows={4} fullWidth required sx={{ mb: 2 }} value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} />
          <FormControlLabel control={<Checkbox checked={form.es_global} onChange={(e) => setForm({ ...form, es_global: e.target.checked })} />} label="Global" />
          <FormControlLabel control={<Checkbox checked={form.importante} onChange={(e) => setForm({ ...form, importante: e.target.checked })} />} label="Importante" />
          <Box sx={{ mt: 2 }}><Button type="submit" variant="contained">Publicar</Button></Box>
        </CardContent>
      </Card>
      <Stack spacing={1.5}>
        {anuncios.map((a) => (
          <Card key={a.id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>{a.titulo}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{a.contenido}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  )
}
