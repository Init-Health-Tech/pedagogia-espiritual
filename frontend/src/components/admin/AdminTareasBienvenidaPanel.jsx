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
  Stack,
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
import LoadingScreen from '../common/LoadingScreen'
import EmptyState from '../common/EmptyState'
import ConfirmDialog from '../common/ConfirmDialog'
import FormField from '../common/FormField'
import StatusBadge from '../common/StatusBadge'

const emptyForm = { nombre: '', descripcion: '', orden: 1, activa: true }

function TareaFormFields({ form, setForm }) {
  return (
    <>
      <FormField label="Nombre de la tarea" required>
        <TextField
          fullWidth
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          hiddenLabel
          placeholder="Ej. Completar tu perfil"
        />
      </FormField>
      <FormField label="Descripción breve">
        <TextField
          multiline
          rows={2}
          fullWidth
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          hiddenLabel
        />
      </FormField>
      <FormField label="Orden">
        <TextField
          type="number"
          fullWidth
          value={form.orden}
          onChange={(e) => setForm({ ...form, orden: +e.target.value })}
          hiddenLabel
          inputProps={{ min: 1 }}
        />
      </FormField>
      <FormControlLabel
        control={<Checkbox checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} />}
        label="Tarea activa y visible para los miembros"
        sx={{ mt: 1 }}
      />
    </>
  )
}

export default function AdminTareasBienvenidaPanel() {
  const [tareas, setTareas] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)

  const load = () =>
    pedagogiaAPI.tareasBienvenida().then((r) => setTareas(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const crear = async (e) => {
    e.preventDefault()
    await pedagogiaAPI.createTareaBienvenida(form)
    setForm(emptyForm)
    load()
  }

  const abrirEditar = (t) => {
    setEditing(t)
    setEditForm({
      nombre: t.nombre || '',
      descripcion: t.descripcion || '',
      orden: t.orden ?? 1,
      activa: Boolean(t.activa),
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
      await pedagogiaAPI.updateTareaBienvenida(editing.id, editForm)
      cerrarEditar()
      load()
    } finally {
      setSavingEdit(false)
    }
  }

  const eliminar = async (id) => {
    await pedagogiaAPI.deleteTareaBienvenida(id)
    setConfirmId(null)
    load()
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent component="form" onSubmit={crear}>
          <Typography variant="h3" gutterBottom>Nueva tarea de bienvenida</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Estas tareas orientan al miembro nuevo antes de iniciar el camino formal de etapas.
          </Typography>
          <TareaFormFields form={form} setForm={setForm} />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">Agregar tarea</Button>
          </Box>
        </CardContent>
      </Card>

      {tareas.length === 0 ? (
        <EmptyState
          title="Sin tareas de bienvenida"
          description="Agrega la primera tarea de orientación con el formulario de arriba."
        />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Orden</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tareas.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.orden}</TableCell>
                    <TableCell>{t.nombre}</TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {t.descripcion || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={t.activa ? 'active' : 'pending'}
                        label={t.activa ? 'Activa' : 'Inactiva'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                        <Button size="small" variant="outlined" onClick={() => abrirEditar(t)}>
                          Editar
                        </Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(t.id)}>
                          Eliminar
                        </Button>
                      </Stack>
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
          <DialogTitle sx={{ fontWeight: 400 }}>Editar tarea</DialogTitle>
          <DialogContent dividers>
            <TareaFormFields form={editForm} setForm={setEditForm} />
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
        title="¿Eliminar esta tarea?"
        message="Los registros de completado asociados también se eliminarán."
        confirmLabel="Sí, eliminar"
        onConfirm={() => eliminar(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}
