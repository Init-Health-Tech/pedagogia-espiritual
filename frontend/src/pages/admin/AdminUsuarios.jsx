import { useEffect, useState } from 'react'
import { Button, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { adminAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'

export default function AdminUsuarios() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => adminAPI.users().then((r) => setUsers(r.data.results || r.data))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const toggle = async (id) => {
    await adminAPI.toggleActive(id)
    load()
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Usuarios y accesos" subtitle="Administración de miembros de la plataforma" />
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
                  <TableCell><Chip label={u.role} size="small" variant="outlined" /></TableCell>
                  <TableCell>
                    <Chip label={u.is_active_member ? 'Activo' : 'Inactivo'} size="small" color={u.is_active_member ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" onClick={() => toggle(u.id)}>Cambiar acceso</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
}
