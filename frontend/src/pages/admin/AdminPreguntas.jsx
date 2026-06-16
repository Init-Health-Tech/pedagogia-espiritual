import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Checkbox, FormControlLabel, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FormField from '../../components/common/FormField'
import StatusBadge from '../../components/common/StatusBadge'

const emptyForm = { texto: '', orden: 1, modulo: '', ayuda: '', activa: true }

export default function AdminPreguntas() {
  const [preguntas, setPreguntas] = useState([])
  const [modulos, setModulos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)

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

  const eliminar = async (id) => {
    await pedagogiaAPI.deletePregunta(id)
    setConfirmId(null)
    load()
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Checklist de la ficha" subtitle="Diez preguntas de reflexión — el progreso se calcula automáticamente" />
      <Alert severity="info" sx={{ mb: 2 }}>Se recomienda mantener exactamente 10 preguntas activas para el cálculo del avance.</Alert>
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={handleSubmit}>
          <Typography variant="h3" gutterBottom>{editId ? 'Editar pregunta' : 'Nueva pregunta'}</Typography>
          <FormField label="Pregunta de reflexión" required helper="Esta pregunta aparecerá en la ficha pedagógica de cada miembro">
            <TextField multiline rows={2} required fullWidth value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} hiddenLabel />
          </FormField>
          <FormField label="Orden" helper="Número del 1 al 10">
            <TextField type="number" fullWidth value={form.orden} onChange={(e) => setForm({ ...form, orden: +e.target.value })} hiddenLabel inputProps={{ min: 1, max: 20 }} />
          </FormField>
          <FormField label="Módulo relacionado">
            <TextField select fullWidth value={form.modulo} onChange={(e) => setForm({ ...form, modulo: e.target.value })} hiddenLabel>
              <MenuItem value="">Sin módulo específico</MenuItem>
              {modulos.map((m) => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
            </TextField>
          </FormField>
          <FormField label="Texto de ayuda" helper="Orientación breve para quien responde">
            <TextField fullWidth value={form.ayuda} onChange={(e) => setForm({ ...form, ayuda: e.target.value })} hiddenLabel />
          </FormField>
          <FormControlLabel control={<Checkbox checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} />} label="Pregunta activa en el checklist" sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button type="submit" variant="contained">{editId ? 'Guardar cambios' : 'Agregar pregunta'}</Button>
            {editId && <Button variant="outlined" onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancelar</Button>}
          </Box>
        </CardContent>
      </Card>

      {preguntas.length === 0 ? (
        <EmptyState title="No hay preguntas en el checklist" description="Agrega la primera pregunta de reflexión usando el formulario de arriba." />
      ) : (
        <Stack spacing={1.5}>
          {preguntas.map((p) => (
            <Card key={p.id} sx={{ opacity: p.activa ? 1 : 0.75 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="overline">Pregunta {p.orden}</Typography>
                    <StatusBadge status={p.activa ? 'active' : 'pending'} label={p.activa ? 'Activa' : 'Inactiva'} />
                  </Stack>
                  <Typography variant="body1">{p.texto}</Typography>
                  {p.modulo_nombre && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{p.modulo_nombre}</Typography>}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => { setEditId(p.id); setForm({ texto: p.texto, orden: p.orden, modulo: p.modulo || '', ayuda: p.ayuda || '', activa: p.activa }) }}>Editar</Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(p.id)}>Eliminar</Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="¿Eliminar esta pregunta?"
        message="Se quitará del checklist de todos los miembros. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar pregunta"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}
