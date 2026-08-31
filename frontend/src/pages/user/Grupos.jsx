import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { Calendar, MessageCircle, Users, X } from 'lucide-react'
import { groupsAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import { colors } from '../../theme/muiTheme'

const VISIBLE_AVATARS = 4

function initialsOf(person) {
  return person.iniciales || (person.full_name || '?').slice(0, 2).toUpperCase()
}

function PersonAvatar({ person, size = 32, sx = {} }) {
  return (
    <Avatar
      src={person.avatar || undefined}
      alt={person.full_name}
      sx={{
        width: size,
        height: size,
        fontSize: size < 36 ? '0.7rem' : '0.85rem',
        fontWeight: 600,
        bgcolor: colors.primary,
        color: colors.cream,
        border: `2px solid ${colors.surface}`,
        ...sx,
      }}
    >
      {initialsOf(person)}
    </Avatar>
  )
}

function AvatarStack({ people = [], total }) {
  const shown = people.slice(0, VISIBLE_AVATARS)
  const extra = Math.max((total ?? people.length) - shown.length, 0)

  if (!people.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        Aún no hay miembros
      </Typography>
    )
  }

  return (
    <Stack direction="row" alignItems="center">
      {shown.map((person, i) => (
        <PersonAvatar
          key={person.id}
          person={person}
          sx={{ ml: i === 0 ? 0 : -1.25, zIndex: shown.length - i }}
        />
      ))}
      {extra > 0 && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            ml: -1.25,
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: colors.cream,
            color: colors.secondary,
            border: `2px solid ${colors.surface}`,
            zIndex: 0,
          }}
        >
          +{extra}
        </Avatar>
      )}
    </Stack>
  )
}

function formatFecha(iso) {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
}

function etiquetaProximaReunion(proxima, fallbackHorario) {
  if (!proxima?.fecha) return fallbackHorario || null
  const fecha = formatFecha(proxima.fecha)
  const hora = proxima.hora_display || ''
  if (fecha && hora) return `${fecha}, ${hora}`
  return fecha || hora || fallbackHorario || null
}

export default function Grupos() {
  const navigate = useNavigate()
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [detalle, setDetalle] = useState(null)
  const [loadingDetalle, setLoadingDetalle] = useState(false)

  useEffect(() => {
    groupsAPI.misGrupos()
      .then((r) => setGrupos(Array.isArray(r.data) ? r.data : r.data.results || []))
      .finally(() => setLoading(false))
  }, [])

  const abrirDetalle = async (grupo) => {
    setDetalle(grupo)
    setLoadingDetalle(true)
    try {
      const { data } = await groupsAPI.get(grupo.id)
      setDetalle({ ...grupo, ...data })
    } catch {
      setDetalle(grupo)
    } finally {
      setLoadingDetalle(false)
    }
  }

  const escribirA = (persona, grupoNombre) => {
    const params = new URLSearchParams({
      destinatario: String(persona.id),
      nombre: persona.full_name || '',
      asunto: grupoNombre ? `Consulta — ${grupoNombre}` : '',
    })
    navigate(`/app/comunicacion?${params.toString()}`)
  }

  if (loading) return <LoadingScreen rows={2} />

  const miembrosDe = (g) => g.miembros_preview || []
  const coordinadoresDe = (g) => g.coordinadores_preview || g.coordinadores_detalle?.map((u) => ({
    id: u.id,
    full_name: u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username,
    avatar: u.avatar,
    iniciales: `${(u.first_name || u.full_name || '?')[0]}${(u.last_name || '')[0] || ''}`.toUpperCase(),
  })) || []

  return (
    <>
      <PageHeader title="Grupos de pastoreo" subtitle="Tu comunidad de formación y acompañamiento" />
      {grupos.length === 0 ? (
        <EmptyState
          title="Aún no tienes un grupo asignado"
          description="Tu coordinador te asignará un grupo de pastoreo pronto. Mientras tanto, puedes continuar con tu ficha pedagógica."
          actionLabel="Ir a mi ficha"
          onAction={() => { window.location.href = '/app/ficha' }}
        />
      ) : (
        <Grid
          container
          spacing={2.5}
          sx={{ maxWidth: grupos.length === 1 ? 440 : '100%' }}
        >
          {grupos.map((g) => (
            <Grid key={g.id} size={{ xs: 12, sm: grupos.length === 1 ? 12 : 6, lg: grupos.length === 1 ? 12 : 4 }}>
              <Card className="card-hover" sx={{ height: '100%' }}>
                <CardActionArea
                  onClick={() => abrirDetalle(g)}
                  sx={{ height: '100%', display: 'flex', alignItems: 'stretch' }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${colors.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Users size={24} color={colors.primary} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 400, mb: 1 }}>{g.nombre}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {g.descripcion || 'Grupo de pastoreo y acompañamiento.'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5, color: colors.muted }}>
                      {(g.coordinadores_nombres || []).length === 1 ? 'Coordinador' : 'Coordinadores'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {(g.coordinadores_nombres || []).length
                        ? g.coordinadores_nombres.join(', ')
                        : 'Por asignar'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: colors.muted }}>Comunidad</Typography>
                    <AvatarStack people={miembrosDe(g)} total={g.total_miembros} />
                    {(g.proxima_reunion?.fecha || g.horario_display || g.horario_reunion) && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {etiquetaProximaReunion(g.proxima_reunion, g.horario_display || g.horario_reunion)}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={Boolean(detalle)}
        onClose={() => setDetalle(null)}
        fullWidth
        maxWidth="sm"
      >
        {detalle && (
          <>
            <DialogTitle sx={{ pr: 6, fontWeight: 400 }}>
              {detalle.nombre}
              <IconButton
                onClick={() => setDetalle(null)}
                sx={{ position: 'absolute', right: 12, top: 12 }}
                aria-label="Cerrar"
              >
                <X size={18} />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {loadingDetalle ? (
                <Typography color="text.secondary">Cargando el grupo…</Typography>
              ) : (
                <Stack spacing={3}>
                  <Typography variant="body1" color="text.secondary">
                    {detalle.descripcion || 'Grupo de pastoreo y acompañamiento.'}
                  </Typography>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
                      <Calendar size={18} color={colors.secondary} />
                      <Typography variant="overline">Próxima reunión</Typography>
                    </Stack>
                    <Typography variant="body1">
                      {etiquetaProximaReunion(
                        detalle.proxima_reunion,
                        detalle.horario_display || detalle.horario_reunion,
                      ) || 'Horario por confirmar'}
                    </Typography>
                    {detalle.proxima_reunion?.titulo && (
                      <Typography variant="body2" color="text.secondary">
                        {detalle.proxima_reunion.titulo}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="overline" sx={{ display: 'block', mb: 1.25 }}>Coordinación</Typography>
                    <Stack spacing={1.5}>
                      {coordinadoresDe(detalle).length === 0 ? (
                        <Typography color="text.secondary">Coordinador por asignar</Typography>
                      ) : coordinadoresDe(detalle).map((coord) => (
                        <Stack key={coord.id} direction="row" spacing={1.5} alignItems="center">
                          <PersonAvatar person={coord} size={40} />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography fontWeight={500}>{coord.full_name}</Typography>
                            <Typography variant="caption" color="text.secondary">Coordinador</Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<MessageCircle size={16} />}
                            onClick={() => escribirA(coord, detalle.nombre)}
                          >
                            Mensaje
                          </Button>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="overline" sx={{ display: 'block', mb: 1.25 }}>
                      Miembros ({detalle.total_miembros || miembrosDe(detalle).length})
                    </Typography>
                    <Stack spacing={1.25}>
                      {miembrosDe(detalle).length === 0 ? (
                        <Typography color="text.secondary">Aún no hay miembros en este grupo.</Typography>
                      ) : miembrosDe(detalle).map((m) => (
                        <Stack key={m.id} direction="row" spacing={1.5} alignItems="center">
                          <PersonAvatar person={m} size={36} />
                          <Typography>{m.full_name}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  )
}
