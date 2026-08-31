import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
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
import { adminAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import StatusBadge from '../../components/common/StatusBadge'
import FormField from '../../components/common/FormField'

const ROLE_LABELS = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  moderator: 'Moderador',
  member: 'Miembro',
}

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: 'member',
}

function UserFormFields({ form, setForm }) {
  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormField label="Nombre" required>
          <TextField
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            required
            fullWidth
            hiddenLabel
          />
        </FormField>
        <FormField label="Apellido" required>
          <TextField
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            required
            fullWidth
            hiddenLabel
          />
        </FormField>
      </Stack>
      <FormField label="Correo electrónico" required>
        <TextField
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          fullWidth
          hiddenLabel
        />
      </FormField>
      <FormField label="Teléfono">
        <TextField
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          fullWidth
          hiddenLabel
        />
      </FormField>
      <FormField label="Rol" required helper="Por ahora solo Miembro o Coordinador">
        <TextField
          select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
          fullWidth
          hiddenLabel
        >
          <MenuItem value="member">Miembro</MenuItem>
          <MenuItem value="coordinator">Coordinador</MenuItem>
        </TextField>
      </FormField>
    </>
  )
}

function parseApiError(err) {
  const data = err.response?.data
  if (!data) return 'No se pudo guardar. Inténtalo de nuevo.'
  if (typeof data === 'string') return data
  if (data.detail) return typeof data.detail === 'string' ? data.detail : 'No se pudo guardar.'
  const first = Object.values(data)[0]
  if (Array.isArray(first)) return first[0]
  if (typeof first === 'string') return first
  return 'Revisa los datos e inténtalo de nuevo.'
}

export default function AdminUsuarios() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmUser, setConfirmUser] = useState(null)
  const [filtroNombre, setFiltroNombre] = useState('')
  const [ordenNombre, setOrdenNombre] = useState('az')
  const [filtroRol, setFiltroRol] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const [mode, setMode] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [createdCreds, setCreatedCreds] = useState(null)

  const load = () => adminAPI.users().then((r) => setUsers(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const usersFiltrados = useMemo(() => {
    const q = filtroNombre.trim().toLowerCase()
    let list = users.filter((u) => {
      if (filtroRol !== 'todos' && u.role !== filtroRol) return false
      if (filtroEstado === 'activo' && !u.is_active_member) return false
      if (filtroEstado === 'inactivo' && u.is_active_member) return false
      if (q) {
        const nombre = (u.full_name || '').toLowerCase()
        const username = (u.username || '').toLowerCase()
        if (!nombre.includes(q) && !username.includes(q)) return false
      }
      return true
    })

    list = [...list].sort((a, b) => {
      const na = (a.full_name || a.username || '').localeCompare(b.full_name || b.username || '', 'es', { sensitivity: 'base' })
      return ordenNombre === 'az' ? na : -na
    })
    return list
  }, [users, filtroNombre, ordenNombre, filtroRol, filtroEstado])

  const toggle = async (id) => {
    await adminAPI.toggleActive(id)
    setConfirmUser(null)
    load()
  }

  const abrirNuevo = () => {
    setMode('create')
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const abrirEditar = (u) => {
    if (u.role === 'admin') return
    setMode('edit')
    setEditing(u)
    setForm({
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role === 'coordinator' ? 'coordinator' : 'member',
    })
    setFormError('')
  }

  const cerrarForm = () => {
    if (saving) return
    setMode(null)
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const guardar = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      role: form.role,
    }
    try {
      if (mode === 'create') {
        const { data } = await adminAPI.createUser(payload)
        setMode(null)
        setCreatedCreds({
          username: data.username,
          temporary_password: data.temporary_password,
          full_name: data.full_name,
          email: data.email,
        })
      } else {
        await adminAPI.updateUser(editing.id, payload)
        setMode(null)
      }
      await load()
    } catch (err) {
      setFormError(parseApiError(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader
        title="Usuarios y accesos"
        subtitle="Haz clic en un miembro para supervisar su avance. Admin y coordinadores no llevan progreso propio."
        action={
          <Button variant="contained" onClick={abrirNuevo}>
            Nuevo usuario
          </Button>
        }
      />
      {users.length === 0 ? (
        <EmptyState
          title="No hay usuarios registrados"
          description="Crea una cuenta manualmente o espera a que alguien se registre."
          actionLabel="Nuevo usuario"
          onAction={abrirNuevo}
        />
      ) : (
        <Card>
          <CardContent sx={{ pb: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 1 }} useFlexGap flexWrap="wrap">
              <TextField
                size="small"
                label="Nombre"
                placeholder="Buscar por nombre o usuario"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                sx={{ minWidth: 200, flex: 1 }}
              />
              <TextField
                select
                size="small"
                label="Orden"
                value={ordenNombre}
                onChange={(e) => setOrdenNombre(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="az">A → Z</MenuItem>
                <MenuItem value="za">Z → A</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Rol"
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="coordinator">Coordinador</MenuItem>
                <MenuItem value="member">Miembro</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </TextField>
            </Stack>
          </CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        No hay usuarios con estos filtros.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  usersFiltrados.map((u) => {
                    const esMiembro = u.role === 'member'
                    const esAdmin = u.role === 'admin'
                    return (
                      <TableRow
                        key={u.id}
                        hover={esMiembro}
                        onClick={esMiembro ? () => navigate(`/admin/usuarios/${u.id}`) : undefined}
                        sx={{ cursor: esMiembro ? 'pointer' : 'default' }}
                      >
                        <TableCell>{u.username}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                            <span>{u.full_name}</span>
                            {esMiembro && u.listo_para_avanzar && (
                              <StatusBadge status="pending" label="Listo para avanzar" />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>{ROLE_LABELS[u.role] || u.role}</TableCell>
                        <TableCell>
                          <StatusBadge status={u.is_active_member ? 'active' : 'alert'} label={u.is_active_member ? 'Activo' : 'Inactivo'} />
                        </TableCell>
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          {esMiembro && (
                            <Button size="small" variant="text" onClick={() => navigate(`/admin/usuarios/${u.id}`)} sx={{ mr: 1 }}>
                              Ver avance
                            </Button>
                          )}
                          {!esAdmin && (
                            <Button size="small" variant="text" onClick={() => abrirEditar(u)} sx={{ mr: 1 }}>
                              Editar
                            </Button>
                          )}
                          <Button size="small" variant="outlined" onClick={() => setConfirmUser(u)}>
                            {u.is_active_member ? 'Desactivar acceso' : 'Activar acceso'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={Boolean(mode)} onClose={cerrarForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 400 }}>
          {mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}
        </DialogTitle>
        <Box component="form" onSubmit={guardar}>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            {mode === 'create' && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Se generará una contraseña temporal. Compártela con la persona; deberá cambiarla en su primer inicio de sesión.
              </Alert>
            )}
            <UserFormFields form={form} setForm={setForm} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={cerrarForm} variant="outlined" disabled={saving}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Guardando…' : mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(createdCreds)} onClose={() => setCreatedCreds(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 400 }}>Cuenta creada</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Guarda estos datos ahora. La contraseña temporal no se volverá a mostrar.
          </Alert>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>{createdCreds?.full_name}</strong> ({createdCreds?.email})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Usuario</Typography>
          <Typography variant="h3" sx={{ fontWeight: 400, mb: 2, fontFamily: 'monospace' }}>
            {createdCreds?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Contraseña temporal</Typography>
          <Typography variant="h3" sx={{ fontWeight: 400, fontFamily: 'monospace' }}>
            {createdCreds?.temporary_password}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setCreatedCreds(null)}>Entendido</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmUser)}
        title={confirmUser?.is_active_member ? '¿Desactivar este usuario?' : '¿Activar este usuario?'}
        message={
          confirmUser?.is_active_member
            ? `${confirmUser.full_name || confirmUser.username} no podrá acceder a la plataforma hasta que lo reactives.`
            : `${confirmUser?.full_name || confirmUser?.username} podrá volver a ingresar a la plataforma.`
        }
        confirmLabel={confirmUser?.is_active_member ? 'Sí, desactivar' : 'Sí, activar'}
        destructive={confirmUser?.is_active_member}
        onConfirm={() => toggle(confirmUser.id)}
        onClose={() => setConfirmUser(null)}
      />
    </>
  )
}
