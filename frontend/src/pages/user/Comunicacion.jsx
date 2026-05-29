import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { communicationsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'

export default function Comunicacion() {
  const [tab, setTab] = useState(0)
  const [anuncios, setAnuncios] = useState([])
  const [recibidos, setRecibidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ destinatario: '', asunto: '', cuerpo: '' })

  const load = () => {
    setLoading(true)
    Promise.all([communicationsAPI.anuncios(), communicationsAPI.mensajesRecibidos()])
      .then(([a, m]) => {
        setAnuncios(a.data.results || a.data)
        setRecibidos(m.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const enviar = async (e) => {
    e.preventDefault()
    await communicationsAPI.enviarMensaje({ ...form, destinatario: parseInt(form.destinatario, 10) })
    setOpen(false)
    setForm({ destinatario: '', asunto: '', cuerpo: '' })
    load()
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader
        title="Comunicación interna"
        subtitle="Anuncios institucionales y mensajería"
        action={<Button variant="contained" onClick={() => setOpen(true)}>Nuevo mensaje</Button>}
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Anuncios" />
        <Tab label="Mensajes recibidos" />
      </Tabs>

      {tab === 0 && (
        <Stack spacing={1.5} divider={<Divider />}>
          {anuncios.map((a) => (
            <Card key={a.id} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>{a.titulo}</Typography>
                  {a.importante && <Chip label="Importante" size="small" color="warning" variant="outlined" />}
                </Stack>
                <Typography variant="body2">{a.contenido}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  {a.autor_nombre}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {tab === 1 && (
        <Stack spacing={1.5}>
          {recibidos.map((m) => (
            <Card key={m.id} variant="outlined" sx={{ borderLeft: m.leido ? undefined : 3, borderLeftColor: 'secondary.main' }}>
              <CardContent>
                <Typography variant="subtitle2">{m.asunto}</Typography>
                <Typography variant="caption" color="text.secondary">
                  De: {m.remitente_detalle?.full_name || m.remitente_detalle?.username}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{m.cuerpo}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Enviar mensaje</DialogTitle>
        <Box component="form" onSubmit={enviar}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField label="ID destinatario" value={form.destinatario} onChange={(e) => setForm({ ...form, destinatario: e.target.value })} required fullWidth />
              <TextField label="Asunto" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} required fullWidth />
              <TextField label="Mensaje" multiline rows={4} value={form.cuerpo} onChange={(e) => setForm({ ...form, cuerpo: e.target.value })} required fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Enviar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
