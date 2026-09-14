import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FormField from '../../components/common/FormField'
import StatusBadge from '../../components/common/StatusBadge'

const emptyForm = { texto: '', orden: 1, etapa: '', ayuda: '', activa: true }

function PreguntaFormFields({ form, setForm, etapas }) {
  return (
    <>
      <FormField label="Pregunta de reflexión" required helper="Esta pregunta aparecerá en la ficha pedagógica de cada miembro">
        <TextField
          multiline
          rows={2}
          required
          fullWidth
          value={form.texto}
          onChange={(e) => setForm({ ...form, texto: e.target.value })}
          hiddenLabel
        />
      </FormField>
      <FormField label="Orden" helper="Número del 1 al 10">
        <TextField
          type="number"
          fullWidth
          value={form.orden}
          onChange={(e) => setForm({ ...form, orden: +e.target.value })}
          hiddenLabel
          inputProps={{ min: 1, max: 20 }}
        />
      </FormField>
      <FormField label="Etapa relacionada">
        <TextField
          select
          fullWidth
          value={form.etapa}
          onChange={(e) => setForm({ ...form, etapa: e.target.value })}
          hiddenLabel
        >
          <MenuItem value="">Sin etapa específica</MenuItem>
          {etapas.map((et) => (
            <MenuItem key={et.id} value={et.id}>{et.nombre}</MenuItem>
          ))}
        </TextField>
      </FormField>
      <FormField label="Texto de ayuda" helper="Orientación breve para quien responde">
        <TextField
          fullWidth
          value={form.ayuda}
          onChange={(e) => setForm({ ...form, ayuda: e.target.value })}
          hiddenLabel
        />
      </FormField>
      <FormControlLabel
        control={<Checkbox checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} />}
        label="Pregunta activa en el checklist"
        sx={{ mt: 1 }}
      />
    </>
  )
}

export default function AdminPreguntas() {
  const [preguntas, setPreguntas] = useState([])
  const [etapas, setEtapas] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)

  const load = () =>
    Promise.all([pedagogiaAPI.preguntas(), pedagogiaAPI.etapas()]).then(([p, e]) => {
      setPreguntas(p.data.results || p.data)
      setEtapas(e.data.results || e.data)
    })

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    const payload = { ...form, etapa: form.etapa ? parseInt(form.etapa, 10) : null }
    await pedagogiaAPI.createPregunta(payload)
    setForm(emptyForm)
    load()
  }

  const abrirEditar = (p) => {
    setEditing(p)
    setEditForm({
      texto: p.texto || '',
      orden: p.orden ?? 1,
      etapa: p.etapa || '',
      ayuda: p.ayuda || '',
      activa: Boolean(p.activa),
    })
  }

  const cerrarEditar = () => {
    setEditing(null)
    setEditForm(emptyForm)
  }

  const guardarEditar = async (e) => {
    e.preventDefault()
    if (!editing) return
    setSavingEdit(true)
    try {
      const payload = {
        ...editForm,
        etapa: editForm.etapa ? parseInt(editForm.etapa, 10) : null,
      }
      await pedagogiaAPI.updatePregunta(editing.id, payload)
      cerrarEditar()
      load()
    } finally {
      setSavingEdit(false)
    }
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
      <Alert severity="info" sx={{ mb: 2 }}>
        Se recomienda mantener exactamente 10 preguntas activas para el cálculo del avance.
      </Alert>
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nueva pregunta</Typography>
          <PreguntaFormFields form={form} setForm={setForm} etapas={etapas} />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">Agregar pregunta</Button>
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
                  {p.etapa_nombre && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {p.etapa_nombre}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button size="small" variant="outlined" onClick={() => abrirEditar(p)}>
                    Editar
                  </Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(p.id)}>
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={Boolean(editing)} onClose={cerrarEditar} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={guardarEditar}>
          <DialogTitle sx={{ fontWeight: 400 }}>Editar pregunta</DialogTitle>
          <DialogContent dividers>
            <PreguntaFormFields form={editForm} setForm={setEditForm} etapas={etapas} />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
            <Button onClick={cerrarEditar} disabled={savingEdit}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={savingEdit}>
              {savingEdit ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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
