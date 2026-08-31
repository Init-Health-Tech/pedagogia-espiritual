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
  Stack,
  Tab,
  Tabs,
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

const emptyArea = {
  nombre: '',
  grupo_grafica: '',
  escala_min: 0,
  escala_max: 10,
  orden: 1,
  activa: true,
}

const emptyPraxis = {
  nombre: '',
  orden: 1,
  activo: true,
}

function AreaFormFields({ form, setForm }) {
  return (
    <>
      <FormField label="Nombre del área" required>
        <TextField
          fullWidth
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          hiddenLabel
          placeholder="Ej. Alma"
        />
      </FormField>
      <FormField
        label="Grupo de gráfica"
        required
        helper="Agrupa áreas para graficar juntas en fases posteriores"
      >
        <TextField
          fullWidth
          required
          value={form.grupo_grafica}
          onChange={(e) => setForm({ ...form, grupo_grafica: e.target.value })}
          hiddenLabel
          placeholder="Ej. Antropología Triádica Relacional"
        />
      </FormField>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormField label="Escala mínima">
          <TextField
            type="number"
            fullWidth
            value={form.escala_min}
            onChange={(e) => setForm({ ...form, escala_min: +e.target.value })}
            hiddenLabel
            inputProps={{ min: 0 }}
          />
        </FormField>
        <FormField label="Escala máxima">
          <TextField
            type="number"
            fullWidth
            value={form.escala_max}
            onChange={(e) => setForm({ ...form, escala_max: +e.target.value })}
            hiddenLabel
            inputProps={{ min: 0 }}
          />
        </FormField>
        <FormField label="Orden">
          <TextField
            type="number"
            fullWidth
            value={form.orden}
            onChange={(e) => setForm({ ...form, orden: +e.target.value })}
            hiddenLabel
            inputProps={{ min: 0 }}
          />
        </FormField>
      </Stack>
      <FormControlLabel
        control={
          <Checkbox
            checked={form.activa}
            onChange={(e) => setForm({ ...form, activa: e.target.checked })}
          />
        }
        label="Área activa"
        sx={{ mt: 1 }}
      />
    </>
  )
}

function PraxisFormFields({ form, setForm }) {
  return (
    <>
      <FormField label="Nombre del ítem" required>
        <TextField
          fullWidth
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          hiddenLabel
          placeholder="Ej. Santa Eucaristía"
        />
      </FormField>
      <FormField label="Orden">
        <TextField
          type="number"
          fullWidth
          value={form.orden}
          onChange={(e) => setForm({ ...form, orden: +e.target.value })}
          hiddenLabel
          inputProps={{ min: 0 }}
        />
      </FormField>
      <FormControlLabel
        control={
          <Checkbox
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
        }
        label="Ítem activo"
        sx={{ mt: 1 }}
      />
    </>
  )
}

function AreasTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyArea)
  const [editForm, setEditForm] = useState(emptyArea)
  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)

  const load = () =>
    pedagogiaAPI.areasEvaluacion().then((r) => setItems(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await pedagogiaAPI.createAreaEvaluacion(form)
    setForm(emptyArea)
    load()
  }

  const abrirEditar = (a) => {
    setEditing(a)
    setEditForm({
      nombre: a.nombre || '',
      grupo_grafica: a.grupo_grafica || '',
      escala_min: a.escala_min ?? 0,
      escala_max: a.escala_max ?? 10,
      orden: a.orden ?? 1,
      activa: Boolean(a.activa),
    })
  }

  const cerrarEditar = () => {
    setEditing(null)
    setEditForm(emptyArea)
  }

  const guardarEditar = async (e) => {
    e.preventDefault()
    if (!editing) return
    setSavingEdit(true)
    try {
      await pedagogiaAPI.updateAreaEvaluacion(editing.id, editForm)
      cerrarEditar()
      load()
    } finally {
      setSavingEdit(false)
    }
  }

  const eliminar = async (id) => {
    await pedagogiaAPI.deleteAreaEvaluacion(id)
    setConfirmId(null)
    load()
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        Estas áreas alimentarán las gráficas de la autoevaluación semanal en fases posteriores.
        Puedes agregar más cuando el camino crezca a nuevas etapas.
      </Alert>
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nueva área de evaluación</Typography>
          <AreaFormFields form={form} setForm={setForm} />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">Agregar área</Button>
          </Box>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          title="No hay áreas configuradas"
          description="Agrega la primera área de evaluación con el formulario de arriba."
        />
      ) : (
        <Stack spacing={1.5}>
          {items.map((a) => (
            <Card key={a.id} sx={{ opacity: a.activa ? 1 : 0.75 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }} flexWrap="wrap">
                    <Typography variant="overline">Orden {a.orden}</Typography>
                    <StatusBadge status={a.activa ? 'active' : 'pending'} label={a.activa ? 'Activa' : 'Inactiva'} />
                  </Stack>
                  <Typography variant="body1" fontWeight={600}>{a.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Grupo: {a.grupo_grafica}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Escala: {a.escala_min} – {a.escala_max}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => abrirEditar(a)}>
                    Editar
                  </Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(a.id)}>
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
          <DialogTitle sx={{ fontWeight: 400 }}>Editar área</DialogTitle>
          <DialogContent dividers>
            <AreaFormFields form={editForm} setForm={setEditForm} />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={cerrarEditar} disabled={savingEdit}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={savingEdit}>
              {savingEdit ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="¿Eliminar esta área?"
        message="Si ya hay entradas semanales ligadas, la eliminación puede fallar. Prefiere desactivarla si ya se usó."
        confirmLabel="Sí, eliminar"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}

function PraxisTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyPraxis)
  const [editForm, setEditForm] = useState(emptyPraxis)
  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)

  const load = () =>
    pedagogiaAPI.praxisItems().then((r) => setItems(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await pedagogiaAPI.createPraxisItem(form)
    setForm(emptyPraxis)
    load()
  }

  const abrirEditar = (p) => {
    setEditing(p)
    setEditForm({
      nombre: p.nombre || '',
      orden: p.orden ?? 1,
      activo: Boolean(p.activo),
    })
  }

  const cerrarEditar = () => {
    setEditing(null)
    setEditForm(emptyPraxis)
  }

  const guardarEditar = async (e) => {
    e.preventDefault()
    if (!editing) return
    setSavingEdit(true)
    try {
      await pedagogiaAPI.updatePraxisItem(editing.id, editForm)
      cerrarEditar()
      load()
    } finally {
      setSavingEdit(false)
    }
  }

  const eliminar = async (id) => {
    await pedagogiaAPI.deletePraxisItem(id)
    setConfirmId(null)
    load()
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        Ítems de praxis espiritual para el checklist semanal acumulativo. El miembro los marcará en una fase posterior.
      </Alert>
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo ítem de praxis</Typography>
          <PraxisFormFields form={form} setForm={setForm} />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">Agregar ítem</Button>
          </Box>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          title="No hay ítems de praxis"
          description="Agrega el primer ítem con el formulario de arriba."
        />
      ) : (
        <Stack spacing={1.5}>
          {items.map((p) => (
            <Card key={p.id} sx={{ opacity: p.activo ? 1 : 0.75 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="overline">Orden {p.orden}</Typography>
                    <StatusBadge status={p.activo ? 'active' : 'pending'} label={p.activo ? 'Activo' : 'Inactivo'} />
                  </Stack>
                  <Typography variant="body1">{p.nombre}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
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
          <DialogTitle sx={{ fontWeight: 400 }}>Editar ítem de praxis</DialogTitle>
          <DialogContent dividers>
            <PraxisFormFields form={editForm} setForm={setEditForm} />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={cerrarEditar} disabled={savingEdit}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={savingEdit}>
              {savingEdit ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="¿Eliminar este ítem?"
        message="Si ya hay registros semanales ligados, la eliminación puede fallar. Prefiere desactivarlo si ya se usó."
        confirmLabel="Sí, eliminar"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}

export default function AdminFichaPedagogica() {
  const [tab, setTab] = useState(0)

  return (
    <>
      <PageHeader
        title="Ficha Pedagógica"
        subtitle="Catálogos de autoevaluación cuantitativa (áreas y praxis). El diario semanal de reflexión sigue en Checklist."
      />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Áreas de evaluación" sx={{ fontSize: '1rem' }} />
        <Tab label="Praxis espiritual" sx={{ fontSize: '1rem' }} />
      </Tabs>
      {tab === 0 && <AreasTab />}
      {tab === 1 && <PraxisTab />}
    </>
  )
}
