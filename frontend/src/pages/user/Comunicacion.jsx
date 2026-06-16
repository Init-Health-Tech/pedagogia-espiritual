import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
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
import EmptyState from '../../components/common/EmptyState'
import FormField from '../../components/common/FormField'
import StatusBadge from '../../components/common/StatusBadge'

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

  if (loading) return <LoadingScreen rows={2} />

  return (
    <>
      <PageHeader
        title="Comunicación interna"
        subtitle="Anuncios institucionales y mensajería entre miembros"
        action={<Button variant="contained" onClick={() => setOpen(true)}>Escribir mensaje</Button>}
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Anuncios" sx={{ fontSize: '1rem' }} />
        <Tab label="Mensajes recibidos" sx={{ fontSize: '1rem' }} />
      </Tabs>

      {tab === 0 && (
        anuncios.length === 0 ? (
          <EmptyState title="No hay anuncios por ahora" description="Los avisos importantes del movimiento aparecerán aquí." />
        ) : (
          <Stack spacing={2} divider={<Divider sx={{ opacity: 0.6 }} />}>
            {anuncios.map((a) => (
              <Card key={a.id}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 400 }}>{a.titulo}</Typography>
                    {a.importante && <StatusBadge status="pending" label="Importante" />}
                  </Stack>
                  <Typography variant="body1" color="text.secondary">{a.contenido}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>Publicado por {a.autor_nombre}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      )}

      {tab === 1 && (
        recibidos.length === 0 ? (
          <EmptyState title="No tienes mensajes" description="Cuando alguien te escriba, verás sus mensajes aquí." actionLabel="Escribir un mensaje" onAction={() => setOpen(true)} />
        ) : (
          <Stack spacing={2}>
            {recibidos.map((m) => (
              <Card key={m.id} sx={{ borderLeft: m.leido ? undefined : 3, borderLeftColor: 'secondary.main' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 400, mb: 0.5 }}>{m.asunto}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    De: {m.remitente_detalle?.full_name || m.remitente_detalle?.username}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1.5 }}>{m.cuerpo}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 400 }}>Enviar mensaje</DialogTitle>
        <Box component="form" onSubmit={enviar}>
          <DialogContent>
            <FormField label="Destinatario" helper="Número de identificación del miembro">
              <TextField value={form.destinatario} onChange={(e) => setForm({ ...form, destinatario: e.target.value })} required fullWidth hiddenLabel />
            </FormField>
            <FormField label="Asunto">
              <TextField value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} required fullWidth hiddenLabel />
            </FormField>
            <FormField label="Mensaje">
              <TextField multiline rows={4} value={form.cuerpo} onChange={(e) => setForm({ ...form, cuerpo: e.target.value })} required fullWidth hiddenLabel />
            </FormField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} variant="outlined">Cancelar</Button>
            <Button type="submit" variant="contained">Enviar mensaje</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
