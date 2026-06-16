import { useEffect, useState } from 'react'
import { Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
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
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmUser, setConfirmUser] = useState(null)

  const load = () => adminAPI.users().then((r) => setUsers(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const toggle = async (id) => {
    await adminAPI.toggleActive(id)
    setConfirmUser(null)
    load()
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Usuarios y accesos" subtitle="Administración de miembros de la plataforma" />
      {users.length === 0 ? (
        <EmptyState title="No hay usuarios registrados" description="Cuando alguien se registre, aparecerá aquí para que puedas gestionar su acceso." />
      ) : (
        <Card>
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
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.full_name}</TableCell>
                    <TableCell>{ROLE_LABELS[u.role] || u.role}</TableCell>
                    <TableCell>
                      <StatusBadge status={u.is_active_member ? 'active' : 'alert'} label={u.is_active_member ? 'Activo' : 'Inactivo'} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => setConfirmUser(u)}>
                        {u.is_active_member ? 'Desactivar acceso' : 'Activar acceso'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
