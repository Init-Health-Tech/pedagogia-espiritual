import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Alert,
  Autocomplete,
  Avatar,
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
import { colors } from '../../theme/muiTheme'

function flattenContactos(payload) {
  const secciones = payload?.secciones || []
  return secciones.flatMap((seccion) =>
    (seccion.personas || []).map((persona) => ({
      ...persona,
      grupoTitulo: seccion.titulo,
    })),
  )
}

export default function Comunicacion() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState(0)
  const [anuncios, setAnuncios] = useState([])
  const [recibidos, setRecibidos] = useState([])
  const [contactos, setContactos] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [destinatario, setDestinatario] = useState(null)
  const [form, setForm] = useState({ asunto: '', cuerpo: '' })

  const load = () => {
    setLoading(true)
    Promise.all([
      communicationsAPI.anuncios(),
      communicationsAPI.mensajesRecibidos(),
      communicationsAPI.destinatarios(),
    ])
      .then(([a, m, d]) => {
        setAnuncios(a.data.results || a.data)
        setRecibidos(m.data)
        setContactos(flattenContactos(d.data))
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const cerrarCompose = () => {
    setOpen(false)
    setErrorEnvio('')
    setDestinatario(null)
    setForm({ asunto: '', cuerpo: '' })
    if (searchParams.get('destinatario')) setSearchParams({})
  }

  useEffect(() => {
    const dest = searchParams.get('destinatario')
    if (!dest) return
    const id = Number(dest)
    const encontrado = contactos.find((p) => p.id === id) || (
      Number.isFinite(id)
        ? {
            id,
            full_name: searchParams.get('nombre') || '',
            avatar: null,
            iniciales: (searchParams.get('nombre') || '?').slice(0, 2).toUpperCase(),
            grupoTitulo: 'Tu coordinador',
          }
        : null
    )
    setDestinatario(encontrado)
    setForm((prev) => ({
      ...prev,
      asunto: searchParams.get('asunto') || prev.asunto,
    }))
    setTab(1)
    setOpen(true)
  }, [searchParams, contactos])

  const opcionesUnicas = useMemo(() => {
    const seen = new Set()
    return contactos.filter((p) => {
      const key = `${p.grupoTitulo}-${p.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [contactos])

  const enviar = async (e) => {
    e.preventDefault()
    if (!destinatario?.id) return
    setErrorEnvio('')
    try {
      await communicationsAPI.enviarMensaje({
        destinatario: destinatario.id,
        asunto: form.asunto,
        cuerpo: form.cuerpo,
      })
      cerrarCompose()
      load()
    } catch (err) {
      const data = err.response?.data
      const msg = data?.destinatario
        ? (Array.isArray(data.destinatario) ? data.destinatario[0] : data.destinatario)
        : 'No se pudo enviar el mensaje.'
      setErrorEnvio(msg)
    }
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

      <Dialog open={open} onClose={cerrarCompose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 400 }}>Enviar mensaje</DialogTitle>
        <Box component="form" onSubmit={enviar}>
          <DialogContent>
            {errorEnvio && <Alert severity="error" sx={{ mb: 2 }}>{errorEnvio}</Alert>}
            <FormField
              label="Destinatario"
              helper={
                opcionesUnicas.length === 0
                  ? 'Cuando tengas un grupo de pastoreo, podrás escribir a tu coordinador y a tus compañeros.'
                  : 'Elige a tu coordinador o a un compañero de grupo'
              }
            >
              <Autocomplete
                options={opcionesUnicas}
                value={destinatario}
                onChange={(_, value) => setDestinatario(value)}
                groupBy={(option) => option.grupoTitulo}
                getOptionLabel={(option) => option.full_name || ''}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                noOptionsText="No hay personas disponibles"
                renderOption={(props, option) => {
                  const { key, ...rest } = props
                  return (
                    <Box key={key} component="li" {...rest} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={option.avatar || undefined}
                        alt={option.full_name}
                        sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: colors.primary, color: colors.cream }}
                      >
                        {option.iniciales || (option.full_name || '?').slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Typography variant="body1">{option.full_name}</Typography>
                    </Box>
                  )
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    hiddenLabel
                    placeholder="Buscar por nombre"
                  />
                )}
              />
            </FormField>
            <FormField label="Asunto">
              <TextField value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} required fullWidth hiddenLabel />
            </FormField>
            <FormField label="Mensaje">
              <TextField multiline rows={4} value={form.cuerpo} onChange={(e) => setForm({ ...form, cuerpo: e.target.value })} required fullWidth hiddenLabel />
            </FormField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={cerrarCompose} variant="outlined">Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!destinatario}>Enviar mensaje</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
