import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'

const emptyForm = { texto: '', orden: 1, modulo: '', ayuda: '', activa: true }

export default function AdminPreguntas() {
  const [preguntas, setPreguntas] = useState([])
  const [modulos, setModulos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () =>
    Promise.all([pedagogiaAPI.preguntas(), pedagogiaAPI.modulos()]).then(([p, m]) => {
      setPreguntas(p.data.results || p.data)
      setModulos(m.data.results || m.data)
    })

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, modulo: form.modulo ? parseInt(form.modulo, 10) : null }
    if (editId) await pedagogiaAPI.updatePregunta(editId, payload)
    else await pedagogiaAPI.createPregunta(payload)
    setForm(emptyForm)
    setEditId(null)
    load()
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Checklist de la ficha" subtitle="Diez preguntas de reflexión — el progreso se calcula automáticamente" />
      <Alert severity="info" sx={{ mb: 2 }}>Se recomienda mantener exactamente 10 preguntas activas para el cálculo del avance.</Alert>
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={handleSubmit}>
          <Typography variant="h3" gutterBottom>{editId ? 'Editar pregunta' : 'Nueva pregunta'}</Typography>
          <Stack spacing={2}>
            <TextField label="Pregunta" multiline rows={2} required fullWidth value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Orden" type="number" fullWidth value={form.orden} onChange={(e) => setForm({ ...form, orden: +e.target.value })} inputProps={{ min: 1, max: 20 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField select label="Módulo" fullWidth value={form.modulo} onChange={(e) => setForm({ ...form, modulo: e.target.value })}>
                  <MenuItem value="">Sin módulo</MenuItem>
                  {modulos.map((m) => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
            <TextField label="Texto de ayuda" fullWidth value={form.ayuda} onChange={(e) => setForm({ ...form, ayuda: e.target.value })} />
            <FormControlLabel control={<Checkbox checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} />} label="Activa" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained">{editId ? 'Guardar' : 'Agregar'}</Button>
              {editId && <Button variant="outlined" onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancelar</Button>}
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={1}>
        {preguntas.map((p) => (
          <Card key={p.id} variant="outlined" sx={{ opacity: p.activa ? 1 : 0.6 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="overline">#{p.orden} {p.modulo_nombre && `· ${p.modulo_nombre}`}</Typography>
                <Typography variant="body1">{p.texto}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button size="small" onClick={() => { setEditId(p.id); setForm({ texto: p.texto, orden: p.orden, modulo: p.modulo || '', ayuda: p.ayuda || '', activa: p.activa }) }}>Editar</Button>
                <Button size="small" color="error" onClick={async () => { if (confirm('¿Eliminar?')) { await pedagogiaAPI.deletePregunta(p.id); load() } }}>Eliminar</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  )
}
