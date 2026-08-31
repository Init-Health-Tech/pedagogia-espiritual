import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { adminAPI, groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'

const DIAS = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
]

function buildHoraOptions() {
  const options = []
  for (let h = 0; h < 24; h += 1) {
    for (const m of [0, 30]) {
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      const hour12 = h % 12 || 12
      const sufijo = h < 12 ? 'AM' : 'PM'
      options.push({ value, label: `${hour12}:${String(m).padStart(2, '0')} ${sufijo}` })
    }
  }
  return options
}

const HORAS = buildHoraOptions()

const emptyForm = {
  nombre: '',
  descripcion: '',
  dia_reunion: '',
  hora_reunion: '',
  miembros: [],
  coordinadores: [],
}

function labelUsuario(u) {
  const nombre = u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim()
  return nombre ? `${nombre} (@${u.username})` : u.username
}

function horaToInput(hora) {
  if (!hora) return ''
  return String(hora).slice(0, 5)
}

function payloadFromForm(form) {
  return {
    nombre: form.nombre,
    descripcion: form.descripcion,
    dia_reunion: form.dia_reunion || '',
    hora_reunion: form.hora_reunion || null,
    horario_reunion: '',
    miembros: form.miembros.map((u) => u.id),
    coordinadores: form.coordinadores.map((u) => u.id),
  }
}

function GrupoFields({ form, setForm, miembrosActivos, coordinadoresDisponibles }) {
  return (
    <>
      <TextField
        label="Nombre"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />
      <TextField
        label="Descripción"
        multiline
        rows={2}
        fullWidth
        sx={{ mb: 2 }}
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          label="Día de la semana"
          fullWidth
          value={form.dia_reunion}
          onChange={(e) => setForm({ ...form, dia_reunion: e.target.value })}
        >
          <MenuItem value="">Sin definir</MenuItem>
          {DIAS.map((d) => (
            <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Hora"
          fullWidth
          value={form.hora_reunion}
          onChange={(e) => setForm({ ...form, hora_reunion: e.target.value })}
        >
          <MenuItem value="">Sin definir</MenuItem>
          {HORAS.map((h) => (
            <MenuItem key={h.value} value={h.value}>{h.label}</MenuItem>
          ))}
        </TextField>
      </Stack>
      <Autocomplete
        multiple
        options={miembrosActivos}
        value={form.miembros}
        onChange={(_, value) => setForm({ ...form, miembros: value })}
        getOptionLabel={labelUsuario}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={option.full_name || option.username}
              size="small"
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Miembros"
            helperText="Solo miembros activos de la plataforma"
            sx={{ mb: 2 }}
          />
        )}
        noOptionsText="No hay miembros activos disponibles"
      />
      <Autocomplete
        multiple
        options={coordinadoresDisponibles}
        value={form.coordinadores}
        onChange={(_, value) => setForm({ ...form, coordinadores: value })}
        getOptionLabel={labelUsuario}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={option.full_name || option.username}
              size="small"
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Coordinadores"
            helperText="Uno o más coordinadores encargados del grupo"
            sx={{ mb: 2 }}
          />
        )}
        noOptionsText="No hay coordinadores registrados"
      />
    </>
  )
}

export default function AdminGrupos() {
  const [grupos, setGrupos] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const load = () =>
    Promise.all([groupsAPI.list(), adminAPI.users()]).then(([g, u]) => {
      setGrupos(g.data.results || g.data)
      setUsers(u.data.results || u.data)
    })

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const miembrosActivos = useMemo(
    () => users.filter((u) => u.role === 'member' && u.is_active_member && u.is_active !== false),
    [users],
  )

  const coordinadoresDisponibles = useMemo(
    () => users.filter((u) => u.role === 'coordinator' && u.is_active !== false),
    [users],
  )

  const usersById = useMemo(() => {
    const map = new Map()
    users.forEach((u) => map.set(u.id, u))
    return map
  }, [users])

  const gruposFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return grupos
    return grupos.filter((g) => {
      const nombre = (g.nombre || '').toLowerCase()
      const coords = (g.coordinadores_nombres || []).join(' ').toLowerCase()
      return nombre.includes(q) || coords.includes(q)
    })
  }, [grupos, busqueda])

  const crear = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await groupsAPI.create(payloadFromForm(form))
      setForm(emptyForm)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const abrirModificar = async (grupo) => {
    setEditing(grupo)
    setLoadingEdit(true)
    try {
      const { data } = await groupsAPI.get(grupo.id)
      const miembros = (data.miembros || [])
        .map((id) => usersById.get(id) || data.miembros_detalle?.find((u) => u.id === id))
        .filter(Boolean)
      const coordinadores = (data.coordinadores || [])
        .map((id) => usersById.get(id) || data.coordinadores_detalle?.find((u) => u.id === id))
        .filter(Boolean)
      setEditForm({
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        dia_reunion: data.dia_reunion || '',
        hora_reunion: horaToInput(data.hora_reunion),
        miembros,
        coordinadores,
      })
      setEditing({
        ...grupo,
        ...data,
        horario_requiere_revision: data.horario_requiere_revision,
      })
    } catch {
      setEditing(null)
    } finally {
      setLoadingEdit(false)
    }
  }

  const cerrarModificar = () => {
    setEditing(null)
    setEditForm(emptyForm)
  }

  const guardarModificar = async (e) => {
    e.preventDefault()
    if (!editing) return
    setSavingEdit(true)
    try {
      await groupsAPI.update(editing.id, payloadFromForm(editForm))
      cerrarModificar()
      await load()
    } finally {
      setSavingEdit(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Grupos de pastoreo" subtitle="Comunidades de formación y coordinación" />
      <Card sx={{ mb: 3, maxWidth: 640 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo grupo</Typography>
          <GrupoFields
            form={form}
            setForm={setForm}
            miembrosActivos={miembrosActivos}
            coordinadoresDisponibles={coordinadoresDisponibles}
          />
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Creando…' : 'Crear grupo'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h3">Grupos Existentes</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            Revisa cada grupo y modifica sus datos, miembros o coordinadores cuando lo necesites.
          </Typography>
          <TextField
            size="small"
            label="Buscar"
            placeholder="Nombre del grupo o coordinador"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ minWidth: 260, maxWidth: 420, mb: 1 }}
          />
        </CardContent>

        {grupos.length === 0 ? (
          <CardContent>
            <EmptyState
              title="Aún no hay grupos"
              description="Crea el primero con el formulario de arriba."
            />
          </CardContent>
        ) : gruposFiltrados.length === 0 ? (
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No hay grupos con esta búsqueda.
            </Typography>
          </CardContent>
        ) : (
          <Grid container spacing={2} sx={{ px: 2, pb: 2.5 }}>
            {gruposFiltrados.map((g) => (
              <Grid key={g.id} size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }} flexWrap="wrap" useFlexGap>
                      <Typography variant="subtitle1" fontWeight={600}>{g.nombre}</Typography>
                      {g.horario_requiere_revision && (
                        <Chip size="small" color="warning" label="Revisar horario" />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                      {g.descripcion || 'Sin descripción'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Horario:</strong> {g.horario_display || g.horario_reunion || '—'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Miembros ({g.total_miembros}):</strong>{' '}
                      {(g.miembros_nombres || []).length
                        ? g.miembros_nombres.join(', ')
                        : 'Sin miembros'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>
                        {(g.coordinadores_nombres || []).length === 1 ? 'Coordinador' : 'Coordinadores'}:
                      </strong>{' '}
                      {(g.coordinadores_nombres || []).length
                        ? g.coordinadores_nombres.join(', ')
                        : 'Sin asignar'}
                    </Typography>
                    <Button size="small" variant="outlined" onClick={() => abrirModificar(g)}>
                      Modificar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Card>

      <Dialog open={Boolean(editing)} onClose={cerrarModificar} fullWidth maxWidth="sm">
        <form onSubmit={guardarModificar}>
          <DialogTitle>Modificar grupo</DialogTitle>
          <DialogContent dividers>
            {loadingEdit ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Cargando datos del grupo…
              </Typography>
            ) : (
              <Stack sx={{ pt: 1 }}>
                {editing?.horario_requiere_revision && (
                  <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                    Este grupo tenía horario en texto libre que no se pudo interpretar.
                    Define día y hora abajo. Texto anterior: “{editing.horario_reunion}”
                  </Typography>
                )}
                <GrupoFields
                  form={editForm}
                  setForm={setEditForm}
                  miembrosActivos={miembrosActivos}
                  coordinadoresDisponibles={coordinadoresDisponibles}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={cerrarModificar} disabled={savingEdit}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={savingEdit || loadingEdit}>
              {savingEdit ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
