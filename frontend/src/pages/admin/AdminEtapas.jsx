import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  IconButton,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Pencil, Trash2 } from 'lucide-react'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FormField from '../../components/common/FormField'
import StatusBadge from '../../components/common/StatusBadge'
import AdminTareasBienvenidaPanel from '../../components/admin/AdminTareasBienvenidaPanel'

const emptyEtapa = { nombre: '', descripcion: '', orden: 1, activo: true }
const emptyModulo = { nombre: '', descripcion: '', orden: 1, activo: true }
const emptyManual = { titulo: '', enlace: '', orden: 1, activo: true }

function EtapaFormFields({ form, setForm }) {
  return (
    <>
      <FormField label="Nombre de la etapa" required>
        <TextField
          fullWidth
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          hiddenLabel
          placeholder="Ej. Etapa I — Búsqueda"
        />
      </FormField>
      <FormField label="Orden" helper="Posición en el camino formativo">
        <TextField
          type="number"
          fullWidth
          value={form.orden}
          onChange={(e) => setForm({ ...form, orden: +e.target.value })}
          hiddenLabel
        />
      </FormField>
      <FormField label="Descripción">
        <TextField
          multiline
          rows={2}
          fullWidth
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          hiddenLabel
        />
      </FormField>
      <FormControlLabel
        control={<Checkbox checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />}
        label="Etapa activa y visible para los miembros"
        sx={{ mt: 1 }}
      />
    </>
  )
}

function ManualRow({ manual, onEdit, onDelete }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={500}>{manual.titulo}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
          {manual.enlace || 'Sin enlace'}
        </Typography>
      </Box>
      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
        <IconButton size="small" aria-label="Editar manual" onClick={() => onEdit(manual)}>
          <Pencil size={16} />
        </IconButton>
        <IconButton size="small" aria-label="Eliminar manual" color="error" onClick={() => onDelete(manual)}>
          <Trash2 size={16} />
        </IconButton>
      </Stack>
    </Stack>
  )
}

function ModuloAccordion({
  modulo,
  onReload,
  onDeleteModulo,
}) {
  const [modForm, setModForm] = useState({
    nombre: modulo.nombre || '',
    descripcion: modulo.descripcion || '',
    orden: modulo.orden ?? 1,
    activo: Boolean(modulo.activo),
  })
  const [savingMod, setSavingMod] = useState(false)
  const [manualForm, setManualForm] = useState(emptyManual)
  const [editingManual, setEditingManual] = useState(null)
  const [manualEditForm, setManualEditForm] = useState(emptyManual)
  const [savingManual, setSavingManual] = useState(false)
  const [confirmManualId, setConfirmManualId] = useState(null)

  const guardarModulo = async (e) => {
    e.preventDefault()
    setSavingMod(true)
    try {
      await pedagogiaAPI.updateModulo(modulo.id, modForm)
      await onReload()
    } finally {
      setSavingMod(false)
    }
  }

  const crearManual = async (e) => {
    e.preventDefault()
    setSavingManual(true)
    try {
      await pedagogiaAPI.createManual({
        ...manualForm,
        modulo: modulo.id,
        orden: manualForm.orden || 1,
      })
      setManualForm(emptyManual)
      await onReload()
    } finally {
      setSavingManual(false)
    }
  }

  const guardarManual = async (e) => {
    e.preventDefault()
    if (!editingManual) return
    setSavingManual(true)
    try {
      await pedagogiaAPI.updateManual(editingManual.id, {
        ...manualEditForm,
        modulo: modulo.id,
      })
      setEditingManual(null)
      setManualEditForm(emptyManual)
      await onReload()
    } finally {
      setSavingManual(false)
    }
  }

  const eliminarManual = async (id) => {
    await pedagogiaAPI.deleteManual(id)
    setConfirmManualId(null)
    await onReload()
  }

  const manuales = modulo.manuales || []

  return (
    <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', pr: 1 }}>
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            {modulo.nombre || 'Módulo'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {manuales.length} manual{manuales.length === 1 ? '' : 'es'}
          </Typography>
          <StatusBadge
            status={modulo.activo ? 'active' : 'pending'}
            label={modulo.activo ? 'Activo' : 'Inactivo'}
          />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Box component="form" onSubmit={guardarModulo} sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Datos del módulo
          </Typography>
          <FormField label="Nombre" required>
            <TextField
              fullWidth
              required
              value={modForm.nombre}
              onChange={(e) => setModForm({ ...modForm, nombre: e.target.value })}
              hiddenLabel
            />
          </FormField>
          <FormField label="Orden">
            <TextField
              type="number"
              fullWidth
              value={modForm.orden}
              onChange={(e) => setModForm({ ...modForm, orden: +e.target.value })}
              hiddenLabel
            />
          </FormField>
          <FormField label="Descripción">
            <TextField
              multiline
              rows={2}
              fullWidth
              value={modForm.descripcion}
              onChange={(e) => setModForm({ ...modForm, descripcion: e.target.value })}
              hiddenLabel
            />
          </FormField>
          <FormControlLabel
            control={
              <Checkbox
                checked={modForm.activo}
                onChange={(e) => setModForm({ ...modForm, activo: e.target.checked })}
              />
            }
            label="Módulo activo"
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Button type="submit" size="small" variant="contained" disabled={savingMod}>
              {savingMod ? 'Guardando…' : 'Guardar módulo'}
            </Button>
            <Button size="small" color="error" variant="outlined" onClick={() => onDeleteModulo(modulo)}>
              Eliminar módulo
            </Button>
          </Stack>
        </Box>

        <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
          Manuales de este módulo
        </Typography>
        {manuales.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Aún no hay manuales en este módulo.
          </Typography>
        ) : (
          <Box sx={{ mb: 2 }}>
            {manuales.map((man) => (
              <ManualRow
                key={man.id}
                manual={man}
                onEdit={(m) => {
                  setEditingManual(m)
                  setManualEditForm({
                    titulo: m.titulo || '',
                    enlace: m.enlace || '',
                    orden: m.orden ?? 1,
                    activo: Boolean(m.activo),
                  })
                }}
                onDelete={(m) => setConfirmManualId(m.id)}
              />
            ))}
          </Box>
        )}

        <Box component="form" onSubmit={crearManual}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>Agregar manual</Typography>
          <FormField label="Título" required>
            <TextField
              fullWidth
              required
              value={manualForm.titulo}
              onChange={(e) => setManualForm({ ...manualForm, titulo: e.target.value })}
              hiddenLabel
            />
          </FormField>
          <FormField label="Enlace" required>
            <TextField
              fullWidth
              required
              value={manualForm.enlace}
              onChange={(e) => setManualForm({ ...manualForm, enlace: e.target.value })}
              hiddenLabel
              placeholder="https://…"
            />
          </FormField>
          <FormField label="Orden">
            <TextField
              type="number"
              fullWidth
              value={manualForm.orden}
              onChange={(e) => setManualForm({ ...manualForm, orden: +e.target.value })}
              hiddenLabel
            />
          </FormField>
          <Button type="submit" size="small" variant="outlined" disabled={savingManual} sx={{ mt: 1 }}>
            {savingManual ? 'Agregando…' : 'Agregar manual'}
          </Button>
        </Box>

        <Dialog open={Boolean(editingManual)} onClose={() => setEditingManual(null)} fullWidth maxWidth="sm">
          <Box component="form" onSubmit={guardarManual}>
            <DialogTitle sx={{ fontWeight: 400 }}>Editar manual</DialogTitle>
            <DialogContent dividers>
              <FormField label="Título" required>
                <TextField
                  fullWidth
                  required
                  value={manualEditForm.titulo}
                  onChange={(e) => setManualEditForm({ ...manualEditForm, titulo: e.target.value })}
                  hiddenLabel
                />
              </FormField>
              <FormField label="Enlace" required>
                <TextField
                  fullWidth
                  required
                  value={manualEditForm.enlace}
                  onChange={(e) => setManualEditForm({ ...manualEditForm, enlace: e.target.value })}
                  hiddenLabel
                />
              </FormField>
              <FormField label="Orden">
                <TextField
                  type="number"
                  fullWidth
                  value={manualEditForm.orden}
                  onChange={(e) => setManualEditForm({ ...manualEditForm, orden: +e.target.value })}
                  hiddenLabel
                />
              </FormField>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={manualEditForm.activo}
                    onChange={(e) => setManualEditForm({ ...manualEditForm, activo: e.target.checked })}
                  />
                }
                label="Manual activo"
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
              <Button onClick={() => setEditingManual(null)} disabled={savingManual}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={savingManual}>
                {savingManual ? 'Guardando…' : 'Guardar'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <ConfirmDialog
          open={Boolean(confirmManualId)}
          title="¿Eliminar este manual?"
          message="Esta acción no se puede deshacer."
          confirmLabel="Sí, eliminar"
          onConfirm={() => eliminarManual(confirmManualId)}
          onClose={() => setConfirmManualId(null)}
        />
      </AccordionDetails>
    </Accordion>
  )
}

function EtapasPanel() {
  const [etapas, setEtapas] = useState([])
  const [form, setForm] = useState(emptyEtapa)
  const [editForm, setEditForm] = useState(emptyEtapa)
  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)
  const [confirmModulo, setConfirmModulo] = useState(null)
  const [newModulo, setNewModulo] = useState(emptyModulo)
  const [savingModulo, setSavingModulo] = useState(false)

  const load = async () => {
    const r = await pedagogiaAPI.etapas()
    const list = r.data.results || r.data
    setEtapas(list)
    setEditing((prev) => {
      if (!prev) return prev
      return list.find((e) => e.id === prev.id) || prev
    })
    return list
  }

  useEffect(() => { load().finally(() => setLoading(false)) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const crear = async (e) => {
    e.preventDefault()
    await pedagogiaAPI.createEtapa(form)
    setForm(emptyEtapa)
    load()
  }

  const abrirEditar = (etapa) => {
    setEditing(etapa)
    setEditForm({
      nombre: etapa.nombre || '',
      descripcion: etapa.descripcion || '',
      orden: etapa.orden ?? 1,
      activo: Boolean(etapa.activo),
    })
    setNewModulo(emptyModulo)
  }

  const cerrarEditar = () => {
    setEditing(null)
    setEditForm(emptyEtapa)
    setNewModulo(emptyModulo)
  }

  const guardarEditar = async (e) => {
    e.preventDefault()
    if (!editing) return
    setSavingEdit(true)
    try {
      await pedagogiaAPI.updateEtapa(editing.id, editForm)
      await load()
      cerrarEditar()
    } finally {
      setSavingEdit(false)
    }
  }

  const eliminar = async (id) => {
    await pedagogiaAPI.deleteEtapa(id)
    setConfirmId(null)
    if (editing?.id === id) cerrarEditar()
    load()
  }

  const agregarModulo = async (e) => {
    e.preventDefault()
    if (!editing) return
    setSavingModulo(true)
    try {
      await pedagogiaAPI.createModulo({
        ...newModulo,
        etapa: editing.id,
      })
      setNewModulo(emptyModulo)
      await load()
    } finally {
      setSavingModulo(false)
    }
  }

  const eliminarModulo = async (modulo) => {
    await pedagogiaAPI.deleteModulo(modulo.id)
    setConfirmModulo(null)
    await load()
  }

  if (loading) return <LoadingScreen rows={2} />

  const modulosEditing = editing?.modulos || []

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nueva etapa</Typography>
          <EtapaFormFields form={form} setForm={setForm} />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">Crear etapa</Button>
          </Box>
        </CardContent>
      </Card>

      {etapas.length === 0 ? (
        <EmptyState title="Aún no hay etapas" description="Crea la primera etapa formativa usando el formulario de arriba." />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Orden</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Módulos</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {etapas.map((etapa) => {
                  const count = (etapa.modulos || []).length
                  return (
                    <TableRow key={etapa.id} hover>
                      <TableCell>{etapa.orden}</TableCell>
                      <TableCell>{etapa.nombre}</TableCell>
                      <TableCell>
                        {count} módulo{count === 1 ? '' : 's'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={etapa.activo ? 'active' : 'pending'}
                          label={etapa.activo ? 'Activo' : 'Inactivo'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                          <Button size="small" variant="outlined" onClick={() => abrirEditar(etapa)}>
                            Editar
                          </Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(etapa.id)}>
                            Eliminar
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={Boolean(editing)} onClose={cerrarEditar} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 400 }}>Editar etapa</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="etapa-edit-form" onSubmit={guardarEditar}>
            <EtapaFormFields form={editForm} setForm={setEditForm} />
          </Box>

          <Typography variant="h3" sx={{ mt: 3, mb: 1.5 }}>
            Módulos de esta etapa
          </Typography>

          <Stack spacing={1} sx={{ mb: 3 }}>
            {modulosEditing.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Esta etapa aún no tiene módulos.
              </Typography>
            ) : (
              modulosEditing.map((mod) => (
                <ModuloAccordion
                  key={mod.id}
                  modulo={mod}
                  onReload={load}
                  onDeleteModulo={(m) => setConfirmModulo(m)}
                />
              ))
            )}
          </Stack>

          <Box component="form" onSubmit={agregarModulo} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Agregar módulo</Typography>
            <FormField label="Nombre" required>
              <TextField
                fullWidth
                required
                value={newModulo.nombre}
                onChange={(e) => setNewModulo({ ...newModulo, nombre: e.target.value })}
                hiddenLabel
              />
            </FormField>
            <FormField label="Orden">
              <TextField
                type="number"
                fullWidth
                value={newModulo.orden}
                onChange={(e) => setNewModulo({ ...newModulo, orden: +e.target.value })}
                hiddenLabel
              />
            </FormField>
            <FormField label="Descripción">
              <TextField
                multiline
                rows={2}
                fullWidth
                value={newModulo.descripcion}
                onChange={(e) => setNewModulo({ ...newModulo, descripcion: e.target.value })}
                hiddenLabel
              />
            </FormField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newModulo.activo}
                  onChange={(e) => setNewModulo({ ...newModulo, activo: e.target.checked })}
                />
              }
              label="Módulo activo"
            />
            <Button type="submit" size="small" variant="contained" disabled={savingModulo} sx={{ mt: 1 }}>
              {savingModulo ? 'Agregando…' : 'Agregar módulo'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
          <Button onClick={cerrarEditar} disabled={savingEdit}>Cancelar</Button>
          <Button type="submit" form="etapa-edit-form" variant="contained" disabled={savingEdit}>
            {savingEdit ? 'Guardando…' : 'Guardar etapa'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="¿Eliminar esta etapa?"
        message="Esta acción no se puede deshacer. Los miembros ya no verán esta etapa en su formación."
        confirmLabel="Sí, eliminar etapa"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />

      <ConfirmDialog
        open={Boolean(confirmModulo)}
        title="¿Eliminar este módulo?"
        message="Se eliminarán también sus manuales. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar módulo"
        onConfirm={() => eliminarModulo(confirmModulo)}
        onClose={() => setConfirmModulo(null)}
      />
    </>
  )
}

export default function AdminEtapas() {
  const [tab, setTab] = useState(0)

  return (
    <>
      <PageHeader
        title="Etapas"
        subtitle="Etapas formativas, módulos, manuales y periodo de bienvenida"
      />
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Etapas del camino" />
        <Tab label="Periodo de bienvenida" />
      </Tabs>
      {tab === 0 ? <EtapasPanel /> : <AdminTareasBienvenidaPanel />}
    </>
  )
}
