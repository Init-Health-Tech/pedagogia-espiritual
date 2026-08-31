import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { communicationsAPI, groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import StatusBadge from '../../components/common/StatusBadge'
import { colors } from '../../theme/muiTheme'

const emptyForm = {
  titulo: '',
  contenido: '',
  destino: 'todos',
  grupos: [],
  importante: false,
}

const ROL_LABEL = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  moderator: 'Moderador',
  member: 'Miembro',
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function filtraPorPeriodo(anuncios, periodo) {
  if (periodo === 'todos') return anuncios
  const ahora = new Date()
  const hoy = startOfDay(ahora)

  return anuncios.filter((a) => {
    const fecha = new Date(a.created_at)
    if (Number.isNaN(fecha.getTime())) return false
    if (periodo === 'hoy') return fecha >= hoy
    if (periodo === 'semana') {
      const inicio = new Date(hoy)
      inicio.setDate(inicio.getDate() - 6)
      return fecha >= inicio
    }
    if (periodo === 'mes') {
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      return fecha >= inicio
    }
    return true
  })
}

function anuncioToForm(anuncio, gruposCatalogo) {
  const ids = Array.isArray(anuncio.grupos) ? anuncio.grupos : []
  return {
    titulo: anuncio.titulo || '',
    contenido: anuncio.contenido || '',
    destino: anuncio.es_global ? 'todos' : 'grupos',
    grupos: ids
      .map((id) => gruposCatalogo.find((g) => g.id === id))
      .filter(Boolean),
    importante: Boolean(anuncio.importante),
  }
}

function formToPayload(form) {
  const esGlobal = form.destino === 'todos'
  return {
    titulo: form.titulo,
    contenido: form.contenido,
    es_global: esGlobal,
    grupos: esGlobal ? [] : form.grupos.map((g) => g.id),
    importante: form.importante,
  }
}

function AnuncioFormFields({ form, setForm, grupos }) {
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
        label="Contenido"
        multiline
        rows={4}
        fullWidth
        required
        sx={{ mb: 2 }}
        value={form.contenido}
        onChange={(e) => setForm({ ...form, contenido: e.target.value })}
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
          <FormControlLabel
            value="todos"
            control={<Radio />}
            label="Para todos"
          />
          <FormControlLabel
            value="grupos"
            control={<Radio />}
            label="Seleccionar grupos"
          />
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
              helperText="Elige uno o más grupos que recibirán este aviso"
              sx={{ mb: 2 }}
            />
          )}
          noOptionsText="No hay grupos disponibles"
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={form.importante}
            onChange={(e) => setForm({ ...form, importante: e.target.checked })}
          />
        }
        label="Marcar como importante"
        sx={{ mb: 1, display: 'block' }}
      />
    </>
  )
}

export default function AdminAnuncios() {
  const [anuncios, setAnuncios] = useState([])
  const [grupos, setGrupos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [ordenFecha, setOrdenFecha] = useState('reciente')
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos')

  const load = () =>
    Promise.all([communicationsAPI.anuncios(), groupsAPI.list()]).then(([a, g]) => {
      setAnuncios(a.data.results || a.data)
      setGrupos(g.data.results || g.data)
    })

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const anunciosFiltrados = useMemo(() => {
    const filtrados = filtraPorPeriodo(anuncios, filtroPeriodo)
    return [...filtrados].sort((a, b) => {
      const ta = new Date(a.created_at).getTime() || 0
      const tb = new Date(b.created_at).getTime() || 0
      return ordenFecha === 'reciente' ? tb - ta : ta - tb
    })
  }, [anuncios, ordenFecha, filtroPeriodo])

  const crear = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await communicationsAPI.createAnuncio(formToPayload(form))
      setForm(emptyForm)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const abrirEditar = (anuncio) => {
    setEditing(anuncio)
    setEditForm(anuncioToForm(anuncio, grupos))
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
      await communicationsAPI.updateAnuncio(editing.id, formToPayload(editForm))
      cerrarEditar()
      await load()
    } finally {
      setSavingEdit(false)
    }
  }

  const eliminar = async (id) => {
    await communicationsAPI.deleteAnuncio(id)
    setConfirmId(null)
    await load()
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Anuncios" subtitle="Comunicación institucional interna" />
      <Card sx={{ mb: 3, maxWidth: 720 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo anuncio</Typography>
          <AnuncioFormFields form={form} setForm={setForm} grupos={grupos} />
          <Box sx={{ mt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || (form.destino === 'grupos' && form.grupos.length === 0)}
            >
              {saving ? 'Publicando…' : 'Publicar'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h3">Historial de avisos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            Filtra por fecha de publicación y revisa quién emitió cada aviso.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 1 }}>
            <TextField
              select
              size="small"
              label="Orden por fecha"
              value={ordenFecha}
              onChange={(e) => setOrdenFecha(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="reciente">Más recientes</MenuItem>
              <MenuItem value="antiguo">Más antiguos</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Periodo"
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="hoy">Hoy</MenuItem>
              <MenuItem value="semana">Últimos 7 días</MenuItem>
              <MenuItem value="mes">Este mes</MenuItem>
            </TextField>
          </Stack>
        </CardContent>

        {anuncios.length === 0 ? (
          <CardContent>
            <EmptyState
              title="Sin avisos todavía"
              description="Los anuncios que publiques aparecerán aquí en el historial."
            />
          </CardContent>
        ) : anunciosFiltrados.length === 0 ? (
          <CardContent>
            <EmptyState
              title="Sin avisos en este periodo"
              description="Prueba con otro filtro de fecha o publica un nuevo anuncio."
            />
          </CardContent>
        ) : (
          <Stack spacing={1.5} sx={{ px: 2, pb: 2.5 }}>
            {anunciosFiltrados.map((a) => (
              <Card key={a.id} variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ lineHeight: 1.4, m: 0 }}
                      >
                        {a.titulo}
                      </Typography>
                      {a.importante && <StatusBadge status="pending" label="Importante" />}
                    </Stack>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flexShrink: 0,
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.4,
                        m: 0,
                      }}
                    >
                      {formatFecha(a.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>
                    {a.contenido}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Emitido por:</strong>{' '}
                    {a.autor_nombre || 'Sin autor'}
                    {a.autor_rol ? ` (${ROL_LABEL[a.autor_rol] || a.autor_rol})` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    <strong>Destino:</strong>{' '}
                    {a.es_global
                      ? 'Todos los grupos'
                      : (a.grupos_nombres || []).length
                        ? a.grupos_nombres.join(', ')
                        : 'Sin grupos asignados'}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => abrirEditar(a)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => setConfirmId(a.id)}
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
          <DialogTitle>Editar anuncio</DialogTitle>
          <DialogContent dividers>
            <AnuncioFormFields form={editForm} setForm={setEditForm} grupos={grupos} />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
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

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="¿Eliminar este aviso?"
        message="Se borrará del historial y ningún miembro destinatario podrá verlo."
        confirmLabel="Sí, eliminar"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}
