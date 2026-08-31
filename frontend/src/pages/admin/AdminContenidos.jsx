import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { contentAPI, pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FormField from '../../components/common/FormField'
import StatusBadge from '../../components/common/StatusBadge'
import { colors } from '../../theme/muiTheme'

const emptyForm = { titulo: '', descripcion: '', tipo: 'documento', modulo: '', url_externa: '', es_publico: false }

const tipoOptions = {
  documento: 'Documento',
  presentacion: 'Presentación',
  video: 'Video',
}

const tipoLabel = {
  ...tipoOptions,
  esquema: 'Esquema',
}

/** Quita prefijos tipo "Documento: " del título para no duplicar la columna Tipo. */
function nombreContenido(titulo = '') {
  const labels = Object.values(tipoLabel).join('|')
  return titulo.replace(new RegExp(`^(?:${labels})\\s*[:\\-–—]\\s*`, 'i'), '').trim() || titulo
}

export default function AdminContenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [savingEdit, setSavingEdit] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [ordenTitulo, setOrdenTitulo] = useState('az')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroVisibilidad, setFiltroVisibilidad] = useState('todos')
  const [filtroEtapa, setFiltroEtapa] = useState('todos')
  const [modulos, setModulos] = useState([])

  const load = () =>
    Promise.all([contentAPI.list(), pedagogiaAPI.modulos()]).then(([c, m]) => {
      setItems(c.data.results || c.data)
      setModulos(m.data.results || m.data)
    })

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const itemsFiltrados = useMemo(() => {
    let list = items.filter((c) => ['documento', 'presentacion', 'video'].includes(c.tipo))

    if (filtroTipo !== 'todos') {
      list = list.filter((c) => c.tipo === filtroTipo)
    }
    if (filtroVisibilidad === 'publico') {
      list = list.filter((c) => c.es_publico)
    } else if (filtroVisibilidad === 'privado') {
      list = list.filter((c) => !c.es_publico)
    }
    if (filtroEtapa === 'sin') {
      list = list.filter((c) => !c.modulo)
    } else if (filtroEtapa !== 'todos') {
      list = list.filter((c) => String(c.modulo) === String(filtroEtapa))
    }

    const sorted = [...list].sort((a, b) => {
      const na = nombreContenido(a.titulo).localeCompare(nombreContenido(b.titulo), 'es', { sensitivity: 'base' })
      return ordenTitulo === 'az' ? na : -na
    })

    return sorted
  }, [items, ordenTitulo, filtroTipo, filtroVisibilidad, filtroEtapa])

  const crear = async (e) => {
    e.preventDefault()
    await contentAPI.create({ ...form, modulo: form.modulo ? parseInt(form.modulo, 10) : null, es_publico: false })
    setForm(emptyForm)
    load()
  }

  const eliminar = async (id) => {
    await contentAPI.delete(id)
    setConfirmId(null)
    load()
  }

  const abrirModificar = (contenido) => {
    setEditing(contenido)
    setEditForm({
      titulo: nombreContenido(contenido.titulo || ''),
      descripcion: contenido.descripcion || '',
      tipo: tipoOptions[contenido.tipo] ? contenido.tipo : 'documento',
      modulo: contenido.modulo || '',
      url_externa: contenido.url_externa || '',
      es_publico: Boolean(contenido.es_publico),
    })
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
      const { titulo, descripcion, tipo, modulo, url_externa } = editForm
      await contentAPI.update(editing.id, {
        titulo,
        descripcion,
        tipo,
        modulo: modulo ? parseInt(modulo, 10) : null,
        url_externa,
      })
      cerrarModificar()
      load()
    } finally {
      setSavingEdit(false)
    }
  }

  const toggleVisibilidad = async (contenido) => {
    setTogglingId(contenido.id)
    try {
      const { data } = await contentAPI.update(contenido.id, { es_publico: !contenido.es_publico })
      setItems((prev) => prev.map((item) => (item.id === contenido.id ? { ...item, ...data } : item)))
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Gestión de contenidos" subtitle="Documentos, presentaciones y videos" />
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo contenido</Typography>
          <FormField label="Título" required>
            <TextField fullWidth required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} hiddenLabel />
          </FormField>
          <FormField label="Tipo de contenido">
            <TextField select fullWidth value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} hiddenLabel>
              {Object.entries(tipoOptions).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
            </TextField>
          </FormField>
          <FormField label="Módulo relacionado">
            <TextField select fullWidth value={form.modulo} onChange={(e) => setForm({ ...form, modulo: e.target.value })} hiddenLabel>
              <MenuItem value="">Sin módulo específico</MenuItem>
              {modulos.map((m) => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
            </TextField>
          </FormField>
          <FormField label="Descripción">
            <TextField multiline rows={2} fullWidth value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} hiddenLabel />
          </FormField>
          <FormField label="Enlace externo" helper="URL del video, documento o recurso">
            <TextField fullWidth value={form.url_externa} onChange={(e) => setForm({ ...form, url_externa: e.target.value })} hiddenLabel />
          </FormField>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Publicar contenido</Button>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="No hay contenidos todavía" description="Publica el primer documento, presentación o video usando el formulario de arriba." />
      ) : (
        <Card>
          <CardContent sx={{ pb: 1 }}>
            <Typography variant="h3">Contenidos Activos</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
              Filtra y ordena la tabla; activa o desactiva la visibilidad, modifica o elimina un material.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ mb: 1 }}
            >
              <TextField
                select
                size="small"
                label="Título"
                value={ordenTitulo}
                onChange={(e) => setOrdenTitulo(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="az">A → Z</MenuItem>
                <MenuItem value="za">Z → A</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Tipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                {Object.entries(tipoOptions).map(([k, v]) => (
                  <MenuItem key={k} value={k}>{v}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                label="Visibilidad"
                value={filtroVisibilidad}
                onChange={(e) => setFiltroVisibilidad(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="publico">Público</MenuItem>
                <MenuItem value="privado">Privado</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Etapa"
                value={filtroEtapa}
                onChange={(e) => setFiltroEtapa(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="todos">Todas</MenuItem>
                <MenuItem value="sin">Sin etapa</MenuItem>
                {modulos.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Etapa</TableCell>
                  <TableCell>Visibilidad</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        No hay contenidos con estos filtros.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  itemsFiltrados.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} color="text.primary">
                          {nombreContenido(c.titulo)}
                        </Typography>
                      </TableCell>
                      <TableCell>{tipoLabel[c.tipo] || c.tipo}</TableCell>
                      <TableCell>{c.modulo_nombre || 'Sin etapa'}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Switch
                            size="small"
                            checked={Boolean(c.es_publico)}
                            disabled={togglingId === c.id}
                            onChange={() => toggleVisibilidad(c)}
                            inputProps={{ 'aria-label': `Cambiar visibilidad de ${nombreContenido(c.titulo)}` }}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': { color: colors.moss },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: colors.moss },
                            }}
                          />
                          <StatusBadge
                            status={c.es_publico ? 'active' : 'pending'}
                            label={c.es_publico ? 'Público' : 'Privado'}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button size="small" variant="outlined" onClick={() => abrirModificar(c)}>
                            Modificar
                          </Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(c.id)}>
                            Eliminar
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={Boolean(editing)} onClose={cerrarModificar} fullWidth maxWidth="sm">
        <form onSubmit={guardarModificar}>
          <DialogTitle>Modificar contenido</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={0} sx={{ pt: 1 }}>
              <FormField label="Título" required>
                <TextField
                  fullWidth
                  required
                  value={editForm.titulo}
                  onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                  hiddenLabel
                />
              </FormField>
              <FormField label="Tipo de contenido">
                <TextField
                  select
                  fullWidth
                  value={editForm.tipo}
                  onChange={(e) => setEditForm({ ...editForm, tipo: e.target.value })}
                  hiddenLabel
                >
                  {Object.entries(tipoOptions).map(([k, v]) => (
                    <MenuItem key={k} value={k}>{v}</MenuItem>
                  ))}
                </TextField>
              </FormField>
              <FormField label="Módulo relacionado">
                <TextField
                  select
                  fullWidth
                  value={editForm.modulo}
                  onChange={(e) => setEditForm({ ...editForm, modulo: e.target.value })}
                  hiddenLabel
                >
                  <MenuItem value="">Sin módulo específico</MenuItem>
                  {modulos.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
                  ))}
                </TextField>
              </FormField>
              <FormField label="Descripción">
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                  hiddenLabel
                />
              </FormField>
              <FormField label="Enlace externo" helper="URL del video, documento o recurso">
                <TextField
                  fullWidth
                  value={editForm.url_externa}
                  onChange={(e) => setEditForm({ ...editForm, url_externa: e.target.value })}
                  hiddenLabel
                />
              </FormField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={cerrarModificar} disabled={savingEdit}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={savingEdit}>
              {savingEdit ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
