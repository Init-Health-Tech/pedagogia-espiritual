import { useEffect, useState } from 'react'
import {
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

const emptyForm = { nombre: '', descripcion: '', orden: 1, color: '#030E30', manual_url: '', activo: true }

function ModuloFormFields({ form, setForm }) {
  return (
    <>
      <FormField label="Nombre del módulo" required>
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
      <FormField label="Enlace al manual" helper="URL del documento PDF o página">
        <TextField
          fullWidth
          value={form.manual_url}
          onChange={(e) => setForm({ ...form, manual_url: e.target.value })}
          hiddenLabel
        />
      </FormField>
      <FormControlLabel
        control={<Checkbox checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />}
        label="Módulo activo y visible para los miembros"
        sx={{ mt: 1 }}
      />
    </>
  )
}

export default function AdminModulos() {
  const [modulos, setModulos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)

  const load = () => pedagogiaAPI.modulos().then((r) => setModulos(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await pedagogiaAPI.createModulo(form)
    setForm(emptyForm)
    load()
  }

  const abrirEditar = (m) => {
    setEditing(m)
    setEditForm({
      nombre: m.nombre || '',
      descripcion: m.descripcion || '',
      orden: m.orden ?? 1,
      color: m.color || '#030E30',
      manual_url: m.manual_url || '',
      activo: Boolean(m.activo),
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
      await pedagogiaAPI.updateModulo(editing.id, editForm)
      cerrarEditar()
      load()
    } finally {
      setSavingEdit(false)
    }
  }

  const eliminar = async (id) => {
    await pedagogiaAPI.deleteModulo(id)
    setConfirmId(null)
    load()
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Módulos (manuales)" subtitle="Gestión de las etapas formativas del camino pedagógico" />
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nuevo módulo</Typography>
          <ModuloFormFields form={form} setForm={setForm} />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">Crear módulo</Button>
          </Box>
        </CardContent>
      </Card>

      {modulos.length === 0 ? (
        <EmptyState title="Aún no hay módulos" description="Crea el primer módulo formativo usando el formulario de arriba." />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Orden</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Manual</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modulos.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell>{m.orden}</TableCell>
                    <TableCell>{m.nombre}</TableCell>
                    <TableCell>{m.manual_url ? 'Enlace disponible' : 'Sin enlace'}</TableCell>
                    <TableCell>
                      <StatusBadge status={m.activo ? 'active' : 'pending'} label={m.activo ? 'Activo' : 'Inactivo'} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => abrirEditar(m)} sx={{ mr: 1 }}>
                        Editar
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(m.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={Boolean(editing)} onClose={cerrarEditar} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={guardarEditar}>
          <DialogTitle sx={{ fontWeight: 400 }}>Editar módulo</DialogTitle>
          <DialogContent dividers>
            <ModuloFormFields form={editForm} setForm={setEditForm} />
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
        title="¿Eliminar este módulo?"
        message="Esta acción no se puede deshacer. Los miembros ya no verán este módulo en su formación."
        confirmLabel="Sí, eliminar módulo"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}
