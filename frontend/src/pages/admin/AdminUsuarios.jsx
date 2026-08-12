import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
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

const ROLE_LABELS = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  moderator: 'Moderador',
  member: 'Miembro',
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

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader
        title="Usuarios y accesos"
        subtitle="Haz clic en un miembro para supervisar su avance. Admin y coordinadores no llevan progreso propio."
      />
      {users.length === 0 ? (
        <EmptyState title="No hay usuarios registrados" description="Cuando alguien se registre, aparecerá aquí para que puedas gestionar su acceso." />
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
                    return (
                      <TableRow
                        key={u.id}
                        hover={esMiembro}
                        onClick={esMiembro ? () => navigate(`/admin/usuarios/${u.id}`) : undefined}
                        sx={{ cursor: esMiembro ? 'pointer' : 'default' }}
                      >
                        <TableCell>{u.username}</TableCell>
                        <TableCell>{u.full_name}</TableCell>
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
