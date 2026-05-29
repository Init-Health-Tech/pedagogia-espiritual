import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { paymentsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'

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

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader title="Pagos y suscripciones" subtitle="Planes, pagos pendientes y membresías" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {planes.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>{p.nombre}</Typography>
                <Typography variant="h3" color="secondary.main" sx={{ my: 1 }}>${p.precio}</Typography>
                <Typography variant="body2">{p.duracion_meses} meses</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
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
                  <TableCell><Chip label={p.estado} size="small" color={p.estado === 'completado' ? 'success' : 'default'} /></TableCell>
                  <TableCell align="right">
                    {p.estado === 'pendiente' && <Button size="small" variant="contained" onClick={() => confirmar(p.id)}>Confirmar</Button>}
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
