import { useEffect, useState } from 'react'
import { Button, Card, CardContent, Checkbox, FormControlLabel, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { contentAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FormField from '../../components/common/FormField'
import StatusBadge from '../../components/common/StatusBadge'

const emptyForm = { titulo: '', descripcion: '', tipo: 'video', url_externa: '', es_publico: false }
const tipoLabel = { video: 'Video', documento: 'Documento', presentacion: 'Presentación', esquema: 'Esquema' }

export default function AdminContenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)

  const load = () => contentAPI.list().then((r) => setItems(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await contentAPI.create(form)
    setForm(emptyForm)
    load()
  }

  const eliminar = async (id) => {
    await contentAPI.delete(id)
    setConfirmId(null)
    load()
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Gestión de contenidos" subtitle="Videos, documentos, presentaciones y esquemas" />
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo contenido</Typography>
          <FormField label="Título" required>
            <TextField fullWidth required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} hiddenLabel />
          </FormField>
          <FormField label="Tipo de contenido">
            <TextField select fullWidth value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} hiddenLabel>
              {Object.entries(tipoLabel).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
            </TextField>
          </FormField>
          <FormField label="Descripción">
            <TextField multiline rows={2} fullWidth value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} hiddenLabel />
          </FormField>
          <FormField label="Enlace externo" helper="URL del video, documento o recurso">
            <TextField fullWidth value={form.url_externa} onChange={(e) => setForm({ ...form, url_externa: e.target.value })} hiddenLabel />
          </FormField>
          <FormControlLabel control={<Checkbox checked={form.es_publico} onChange={(e) => setForm({ ...form, es_publico: e.target.checked })} />} label="Visible para todos los miembros" sx={{ mt: 1 }} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Publicar contenido</Button>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="No hay contenidos todavía" description="Publica el primer video, documento o esquema usando el formulario de arriba." />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell>Título</TableCell><TableCell>Tipo</TableCell><TableCell>Visibilidad</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.titulo}</TableCell>
                    <TableCell>{tipoLabel[c.tipo] || c.tipo}</TableCell>
                    <TableCell><StatusBadge status={c.es_publico ? 'active' : 'pending'} label={c.es_publico ? 'Público' : 'Privado'} /></TableCell>
                    <TableCell align="right"><Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(c.id)}>Eliminar</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="¿Eliminar este contenido?"
        message="Los miembros ya no podrán acceder a este material. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}
