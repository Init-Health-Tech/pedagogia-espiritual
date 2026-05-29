import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { contentAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'

const emptyForm = { titulo: '', descripcion: '', tipo: 'video', url_externa: '', es_publico: false }

export default function AdminContenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)

  const load = () => contentAPI.list().then((r) => setItems(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await contentAPI.create(form)
    setForm(emptyForm)
    load()
  }

  const eliminar = async (id) => {
    if (confirm('¿Eliminar contenido?')) {
      await contentAPI.delete(id)
      load()
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Gestión de contenidos" subtitle="Videos, documentos, presentaciones y esquemas" />
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo contenido</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}><TextField label="Título" fullWidth required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField select label="Tipo" fullWidth value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                {['video', 'documento', 'presentacion', 'esquema'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}><TextField label="Descripción" multiline rows={2} fullWidth value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></Grid>
            <Grid size={12}><TextField label="URL externa" fullWidth value={form.url_externa} onChange={(e) => setForm({ ...form, url_externa: e.target.value })} /></Grid>
          </Grid>
          <FormControlLabel control={<Checkbox checked={form.es_publico} onChange={(e) => setForm({ ...form, es_publico: e.target.checked })} />} label="Público" sx={{ mt: 1 }} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Crear</Button>
        </CardContent>
      </Card>
      <Card>
        <TableContainer>
          <Table>
            <TableHead><TableRow><TableCell>Título</TableCell><TableCell>Tipo</TableCell><TableCell>Público</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.titulo}</TableCell>
                  <TableCell>{c.tipo}</TableCell>
                  <TableCell>{c.es_publico ? 'Sí' : 'No'}</TableCell>
                  <TableCell align="right"><Button size="small" color="error" onClick={() => eliminar(c.id)}>Eliminar</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
}
