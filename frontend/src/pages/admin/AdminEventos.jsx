import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { eventsAPI, groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { colors } from '../../theme/muiTheme'

const emptyForm = {
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  ubicacion: '',
  destino: 'todos',
  grupos: [],
}

function formatFechaHora(fecha, hora) {
  if (!fecha) return '—'
  const iso = hora ? `${fecha}T${hora}` : fecha
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return hora ? `${fecha} ${hora}` : fecha
  }
  return d.toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: hora ? 'short' : undefined,
  })
}

function eventoToForm(evento, gruposCatalogo) {
  const ids = Array.isArray(evento.grupos) ? evento.grupos : []
  return {
    titulo: evento.titulo || '',
    descripcion: evento.descripcion || '',
    fecha: evento.fecha || '',
    hora: (evento.hora || '').slice(0, 5),
    ubicacion: evento.ubicacion || '',
    destino: evento.es_global ? 'todos' : 'grupos',
    grupos: ids
      .map((id) => gruposCatalogo.find((g) => g.id === id))
      .filter(Boolean),
  }
}

function formToPayload(form) {
  const esGlobal = form.destino === 'todos'
  return {
    titulo: form.titulo,
    descripcion: form.descripcion,
    fecha: form.fecha,
    hora: form.hora.length === 5 ? `${form.hora}:00` : form.hora,
    ubicacion: form.ubicacion,
    es_global: esGlobal,
    grupos: esGlobal ? [] : form.grupos.map((g) => g.id),
  }
}

function EventoFormFields({ form, setForm, grupos }) {
  return (
    <>
      <TextField
        label="Título"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={form.titulo}
        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
      />
      <TextField
        label="Descripción"
        multiline
        rows={3}
        fullWidth
        sx={{ mb: 2 }}
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Fecha"
          type="date"
          fullWidth
          required
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />
        <TextField
          label="Hora"
          type="time"
          fullWidth
          required
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.hora}
          onChange={(e) => setForm({ ...form, hora: e.target.value })}
        />
      </Stack>
      <TextField
        label="Ubicación"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={form.ubicacion}
        onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
      />

      <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
        <FormLabel component="legend" sx={{ mb: 1, color: colors.dark, fontWeight: 500 }}>
          Destinatario
        </FormLabel>
        <RadioGroup
          value={form.destino}
          onChange={(e) => setForm({
            ...form,
            destino: e.target.value,
            grupos: e.target.value === 'todos' ? [] : form.grupos,
          })}
        >
          <FormControlLabel value="todos" control={<Radio />} label="Para todos" />
          <FormControlLabel value="grupos" control={<Radio />} label="Seleccionar grupos" />
        </RadioGroup>
      </FormControl>

      {form.destino === 'grupos' && (
        <Autocomplete
          multiple
          options={grupos}
          value={form.grupos}
          onChange={(_, value) => setForm({ ...form, grupos: value })}
          getOptionLabel={(g) => g.nombre}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option.id} label={option.nombre} size="small" />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Grupos"
              required={form.destino === 'grupos'}
              helperText="Elige uno o más grupos que verán este evento"
              sx={{ mb: 2 }}
            />
          )}
          noOptionsText="No hay grupos disponibles"
        />
      )}
    </>
  )
}

export default function AdminEventos() {
  const [eventos, setEventos] = useState([])
  const [grupos, setGrupos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [respuestas, setRespuestas] = useState(null)
  const [loadingRespuestas, setLoadingRespuestas] = useState(false)

  const load = () =>
    Promise.all([eventsAPI.list(), groupsAPI.list()]).then(([e, g]) => {
      setEventos(e.data.results || e.data)
      setGrupos(g.data.results || g.data)
    })

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await eventsAPI.create(formToPayload(form))
      setForm(emptyForm)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const abrirEditar = (evento) => {
    setEditing(evento)
    setEditForm(eventoToForm(evento, grupos))
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
      await eventsAPI.update(editing.id, formToPayload(editForm))
      cerrarEditar()
      await load()
    } finally {
      setSavingEdit(false)
    }
  }

  const eliminar = async (id) => {
    await eventsAPI.delete(id)
    setConfirmId(null)
    await load()
  }

  const verRespuestas = async (evento) => {
    setLoadingRespuestas(true)
    setRespuestas({ titulo: evento.titulo, voy: [], no: [], conteo_voy: 0, conteo_no: 0 })
    try {
      const { data } = await eventsAPI.respuestas(evento.id)
      setRespuestas(data)
    } finally {
      setLoadingRespuestas(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Eventos" subtitle="Encuentros y actividades con confirmación de asistencia" />
      <Card sx={{ mb: 3, maxWidth: 720 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo evento</Typography>
          <EventoFormFields form={form} setForm={setForm} grupos={grupos} />
          <Box sx={{ mt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || (form.destino === 'grupos' && form.grupos.length === 0)}
            >
              {saving ? 'Guardando…' : 'Crear evento'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h3">Eventos programados</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            Revisa destinatarios, asistencia confirmada y edita o elimina cuando haga falta.
          </Typography>
        </CardContent>

        {eventos.length === 0 ? (
          <CardContent>
            <EmptyState
              title="Sin eventos todavía"
              description="Los eventos que crees aparecerán aquí con el conteo de respuestas."
            />
          </CardContent>
        ) : (
          <Stack spacing={1.5} sx={{ px: 2, pb: 2.5 }}>
            {eventos.map((ev) => (
              <Card key={ev.id} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                    {ev.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {formatFechaHora(ev.fecha, ev.hora)} · {ev.ubicacion}
                  </Typography>
                  {ev.descripcion && (
                    <Typography variant="body2" sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>
                      {ev.descripcion}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    <strong>Destino:</strong>{' '}
                    {ev.es_global
                      ? 'Todos'
                      : (ev.grupos_nombres || []).length
                        ? ev.grupos_nombres.join(', ')
                        : 'Sin grupos asignados'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    <strong>Respuestas:</strong>{' '}
                    {ev.conteo_voy ?? 0} van · {ev.conteo_no ?? 0} no pueden
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Button size="small" variant="outlined" onClick={() => verRespuestas(ev)}>
                      Ver respuestas
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => abrirEditar(ev)}>
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => setConfirmId(ev.id)}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Card>

      <Dialog open={Boolean(editing)} onClose={cerrarEditar} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={guardarEditar}>
          <DialogTitle>Editar evento</DialogTitle>
          <DialogContent dividers>
            <EventoFormFields form={editForm} setForm={setEditForm} grupos={grupos} />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
            <Button onClick={cerrarEditar}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingEdit || (editForm.destino === 'grupos' && editForm.grupos.length === 0)}
            >
              {savingEdit ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={Boolean(respuestas)}
        onClose={() => setRespuestas(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Respuestas{respuestas?.titulo ? `: ${respuestas.titulo}` : ''}
        </DialogTitle>
        <DialogContent dividers>
          {loadingRespuestas ? (
            <Typography variant="body2" color="text.secondary">Cargando…</Typography>
          ) : (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Van ({respuestas?.conteo_voy ?? 0})
                </Typography>
                {(respuestas?.voy || []).length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Nadie ha confirmado aún.</Typography>
                ) : (
                  <Stack spacing={0.5}>
                    {respuestas.voy.map((r) => (
                      <Typography key={r.id} variant="body2">
                        {r.usuario_nombre || r.usuario_username}
                      </Typography>
                    ))}
                  </Stack>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  No pueden asistir ({respuestas?.conteo_no ?? 0})
                </Typography>
                {(respuestas?.no || []).length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Nadie ha declinado aún.</Typography>
                ) : (
                  <Stack spacing={0.5}>
                    {respuestas.no.map((r) => (
                      <Typography key={r.id} variant="body2">
                        {r.usuario_nombre || r.usuario_username}
                      </Typography>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRespuestas(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="¿Eliminar este evento?"
        message="Se borrará el evento y todas las respuestas de asistencia."
        confirmLabel="Sí, eliminar"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}
