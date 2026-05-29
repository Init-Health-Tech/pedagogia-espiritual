import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'

const emptyForm = { nombre: '', descripcion: '', orden: 1, color: '#5B7C99', manual_url: '', activo: true }

export default function AdminModulos() {
  const [modulos, setModulos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => pedagogiaAPI.modulos().then((r) => setModulos(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editId) await pedagogiaAPI.updateModulo(editId, form)
    else await pedagogiaAPI.createModulo(form)
    setForm(emptyForm)
    setEditId(null)
    load()
  }

  const editar = (m) => {
    setEditId(m.id)
    setForm({ nombre: m.nombre, descripcion: m.descripcion, orden: m.orden, color: m.color, manual_url: m.manual_url || '', activo: m.activo })
  }

  const eliminar = async (id) => {
    if (confirm('¿Eliminar este módulo?')) {
      await pedagogiaAPI.deleteModulo(id)
      load()
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Módulos (manuales)" subtitle="Gestión de los módulos formativos del camino pedagógico" />
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={handleSubmit}>
          <Typography variant="h3" gutterBottom>{editId ? 'Editar módulo' : 'Nuevo módulo'}</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}><TextField label="Nombre" fullWidth required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Orden" type="number" fullWidth value={form.orden} onChange={(e) => setForm({ ...form, orden: +e.target.value })} /></Grid>
            <Grid size={12}><TextField label="Descripción" multiline rows={2} fullWidth value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 8 }}><TextField label="URL del manual" fullWidth value={form.manual_url} onChange={(e) => setForm({ ...form, manual_url: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Color" type="color" fullWidth value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></Grid>
          </Grid>
          <FormControlLabel control={<Checkbox checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />} label="Activo" sx={{ mt: 1 }} />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained">{editId ? 'Guardar' : 'Crear módulo'}</Button>
            {editId && <Button variant="outlined" onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancelar</Button>}
          </Box>
        </CardContent>
      </Card>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Orden</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Manual</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modulos.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.orden}</TableCell>
                  <TableCell>{m.nombre}</TableCell>
                  <TableCell>{m.manual_url ? 'Enlace' : '—'}</TableCell>
                  <TableCell>{m.activo ? 'Activo' : 'Inactivo'}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => editar(m)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => eliminar(m.id)}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
}
