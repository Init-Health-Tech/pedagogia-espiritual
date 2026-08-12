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
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { adminAPI, groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'

const emptyForm = {
  nombre: '',
  descripcion: '',
  horario_reunion: '',
  miembros: [],
  coordinadores: [],
}

function labelUsuario(u) {
  const nombre = u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim()
  return nombre ? `${nombre} (@${u.username})` : u.username
}

function payloadFromForm(form) {
  return {
    nombre: form.nombre,
    descripcion: form.descripcion,
    horario_reunion: form.horario_reunion,
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
      <TextField
        label="Horario"
        fullWidth
        sx={{ mb: 2 }}
        value={form.horario_reunion}
        onChange={(e) => setForm({ ...form, horario_reunion: e.target.value })}
      />
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
        horario_reunion: data.horario_reunion || '',
        miembros,
        coordinadores,
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Revisa cada grupo y modifica sus datos, miembros o coordinadores cuando lo necesites.
          </Typography>
        </CardContent>

        {grupos.length === 0 ? (
          <CardContent>
            <EmptyState
              title="Aún no hay grupos"
              description="Crea el primero con el formulario de arriba."
            />
          </CardContent>
        ) : (
          <Grid container spacing={2} sx={{ px: 2, pb: 2.5 }}>
            {grupos.map((g) => (
              <Grid key={g.id} size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>{g.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                      {g.descripcion || 'Sin descripción'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Horario:</strong> {g.horario_reunion || '—'}
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
