import { useEffect, useState } from 'react'
import { Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { paymentsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function AdminPagos() {
  const [pagos, setPagos] = useState([])
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([paymentsAPI.pagos(), paymentsAPI.planes()])
      .then(([p, pl]) => { setPagos(p.data.results || p.data); setPlanes(pl.data.results || pl.data) })
      .finally(() => setLoading(false))
  }, [])

  const confirmar = async (id) => {
    await paymentsAPI.confirmarPago(id)
    const r = await paymentsAPI.pagos()
    setPagos(r.data.results || r.data)
  }

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader title="Pagos y suscripciones" subtitle="Planes, pagos pendientes y membresías" />
      {planes.length === 0 && pagos.length === 0 ? (
        <EmptyState title="No hay pagos registrados" description="Cuando los miembros realicen pagos o suscripciones, aparecerán aquí." />
      ) : (
        <>
          {planes.length > 0 && (
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              {planes.map((p) => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h3" sx={{ fontWeight: 400, mb: 1 }}>{p.nombre}</Typography>
                      <Typography variant="h2" sx={{ color: 'secondary.main', my: 1, fontWeight: 300 }}>${p.precio}</Typography>
                      <Typography variant="body1" color="text.secondary">{p.duracion_meses} meses</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Card>
            {pagos.length === 0 ? (
              <EmptyState title="Sin movimientos de pago" description="Los pagos de los miembros se listarán en esta tabla." />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Método</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagos.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell>{p.usuario_detalle?.full_name || p.usuario}</TableCell>
                        <TableCell>${p.monto}</TableCell>
                        <TableCell>{p.metodo}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={p.estado === 'completado' ? 'active' : p.estado === 'pendiente' ? 'pending' : 'info'}
                            label={p.estado === 'completado' ? 'Completado' : p.estado === 'pendiente' ? 'Pendiente' : p.estado}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {p.estado === 'pendiente' && (
                            <Button size="small" variant="contained" onClick={() => confirmar(p.id)}>Confirmar pago</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </>
      )}
    </>
  )
}
