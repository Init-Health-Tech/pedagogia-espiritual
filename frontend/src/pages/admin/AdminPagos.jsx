import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
import { Plus } from 'lucide-react'
import { adminAPI, paymentsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { colors } from '../../theme/muiTheme'

const emptyPlanForm = {
  nombre: '',
  precio: '',
  duracion_meses: '',
}

function formatFecha(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-MX', { dateStyle: 'medium' })
}

function addMonths(iso, months) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const result = new Date(d)
  result.setMonth(result.getMonth() + Number(months || 0))
  return result
}

function nombreUsuario(u) {
  return u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username
}

export default function AdminPagos() {
  const [planes, setPlanes] = useState([])
  const [miembros, setMiembros] = useState([])
  const [suscripciones, setSuscripciones] = useState([])
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogMode, setDialogMode] = useState(null)
  const [editingPlan, setEditingPlan] = useState(null)
  const [planForm, setPlanForm] = useState(emptyPlanForm)
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const load = () =>
    Promise.all([
      paymentsAPI.planes(),
      paymentsAPI.suscripciones(),
      paymentsAPI.pagos(),
      adminAPI.users(),
    ]).then(([pl, s, p, u]) => {
      const listaPlanes = pl.data.results || pl.data
      setPlanes(listaPlanes.filter((plan) => plan.activo !== false))
      setSuscripciones(s.data.results || s.data)
      setPagos(p.data.results || p.data)
      const users = u.data.results || u.data
      setMiembros(users.filter((user) => user.role === 'member'))
    })

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const filasMiembros = useMemo(() => {
    return miembros.map((m) => {
      const subs = suscripciones
        .filter((s) => (s.usuario === m.id || s.usuario_detalle?.id === m.id))
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      const sub = subs.find((s) => s.estado === 'activa') || subs[0] || null

      const pagosUsuario = pagos
        .filter((p) => (p.usuario === m.id || p.usuario_detalle?.id === m.id) && p.estado === 'completado')
        .sort((a, b) => {
          const ta = new Date(a.fecha_pago || a.created_at || 0).getTime()
          const tb = new Date(b.fecha_pago || b.created_at || 0).getTime()
          return tb - ta
        })
      const pago = pagosUsuario[0] || null

      const plan = sub?.plan_detalle || null
      const fechaPago = pago?.fecha_pago || pago?.created_at || sub?.fecha_inicio || null
      const proximoPago = sub?.fecha_fin
        || (fechaPago && plan?.duracion_meses
          ? addMonths(fechaPago, plan.duracion_meses)?.toISOString()
          : null)

      return {
        id: m.id,
        nombre: nombreUsuario(m),
        username: m.username,
        plan: plan?.nombre || 'Sin plan',
        monto: pago?.monto ?? plan?.precio ?? null,
        fechaPago,
        proximoPago,
        tienePago: Boolean(pago || sub),
      }
    })
  }, [miembros, suscripciones, pagos])

  const abrirNuevo = () => {
    setEditingPlan(null)
    setPlanForm(emptyPlanForm)
    setDialogMode('create')
  }

  const abrirModificar = (plan) => {
    setEditingPlan(plan)
    setPlanForm({
      nombre: plan.nombre || '',
      precio: String(plan.precio ?? ''),
      duracion_meses: String(plan.duracion_meses ?? ''),
    })
    setDialogMode('edit')
  }

  const cerrarDialog = () => {
    setDialogMode(null)
    setEditingPlan(null)
    setPlanForm(emptyPlanForm)
  }

  const guardarPlan = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        nombre: planForm.nombre.trim(),
        precio: planForm.precio,
        duracion_meses: Number(planForm.duracion_meses),
      }
      if (dialogMode === 'create') {
        await paymentsAPI.createPlan({ ...payload, activo: true })
      } else if (editingPlan) {
        await paymentsAPI.updatePlan(editingPlan.id, payload)
      }
      cerrarDialog()
      await load()
    } finally {
      setSaving(false)
    }
  }

  const eliminarPlan = async (id) => {
    try {
      await paymentsAPI.deletePlan(id)
    } catch {
      await paymentsAPI.updatePlan(id, { activo: false })
    }
    setConfirmId(null)
    await load()
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Pagos y suscripciones" subtitle="Planes, pagos pendientes y membresías" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>Nuestros Planes</Typography>
        <Grid container spacing={2.5}>
          {planes.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 400, mb: 1 }}>{p.nombre}</Typography>
                  <Typography variant="h2" sx={{ color: 'secondary.main', my: 1, fontWeight: 300 }}>
                    ${p.precio}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Duración: {p.duracion_meses} {Number(p.duracion_meses) === 1 ? 'mes' : 'meses'}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => abrirModificar(p)}>
                      Modificar
                    </Button>
                    <Button size="small" color="error" variant="outlined" onClick={() => setConfirmId(p.id)}>
                      Eliminar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card
              onClick={abrirNuevo}
              sx={{
                height: '100%',
                minHeight: 160,
                cursor: 'pointer',
                border: `1px dashed ${colors.border}`,
                bgcolor: colors.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s, background-color 0.2s',
                '&:hover': {
                  borderColor: colors.primary,
                  bgcolor: colors.surface,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: `1.5px solid ${colors.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                    color: colors.primary,
                  }}
                >
                  <Plus size={28} strokeWidth={1.75} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Agregar plan
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Card>
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h3">Pagos de miembros</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Plan contratado, monto pagado, fecha de pago y próxima renovación según la duración del plan.
          </Typography>
        </CardContent>

        {filasMiembros.length === 0 ? (
          <CardContent>
            <EmptyState
              title="No hay miembros registrados"
              description="Cuando existan miembros en la plataforma, su información de pago aparecerá aquí."
            />
          </CardContent>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Miembro</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Pago</TableCell>
                  <TableCell>Fecha de pago</TableCell>
                  <TableCell>Próximo pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filasMiembros.map((fila) => (
                  <TableRow key={fila.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{fila.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">@{fila.username}</Typography>
                    </TableCell>
                    <TableCell>{fila.plan}</TableCell>
                    <TableCell>
                      {fila.monto != null ? `$${fila.monto}` : '—'}
                    </TableCell>
                    <TableCell>{formatFecha(fila.fechaPago)}</TableCell>
                    <TableCell>{formatFecha(fila.proximoPago)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Dialog open={Boolean(dialogMode)} onClose={cerrarDialog} fullWidth maxWidth="xs">
        <form onSubmit={guardarPlan}>
          <DialogTitle>{dialogMode === 'edit' ? 'Modificar plan' : 'Nuevo plan'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Nombre del Plan"
                fullWidth
                required
                value={planForm.nombre}
                onChange={(e) => setPlanForm({ ...planForm, nombre: e.target.value })}
              />
              <TextField
                label="Precio"
                type="number"
                fullWidth
                required
                inputProps={{ min: 0, step: '0.01' }}
                value={planForm.precio}
                onChange={(e) => setPlanForm({ ...planForm, precio: e.target.value })}
              />
              <TextField
                label="Duración"
                type="number"
                fullWidth
                required
                helperText="Duración en meses"
                inputProps={{ min: 1, step: 1 }}
                value={planForm.duracion_meses}
                onChange={(e) => setPlanForm({ ...planForm, duracion_meses: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={cerrarDialog} disabled={saving}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Guardando…' : dialogMode === 'edit' ? 'Guardar cambios' : 'Crear plan'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="¿Eliminar este plan?"
        message="El plan dejará de estar disponible para nuevos miembros."
        confirmLabel="Sí, eliminar"
        onConfirm={() => eliminarPlan(confirmId)}
        onClose={() => setConfirmId(null)}
      />
    </>
  )
}
