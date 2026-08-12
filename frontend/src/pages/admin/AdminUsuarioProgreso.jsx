import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ArrowLeft, Circle, CircleCheck, FileText, Presentation, Video } from 'lucide-react'
import { adminAPI, pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import AnimatedProgress from '../../components/common/AnimatedProgress'
import EtapasJourney from '../../components/pedagogia/EtapasJourney'
import { colors } from '../../theme/muiTheme'

const ROLE_LABELS = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  moderator: 'Moderador',
  member: 'Miembro',
}

const SECTIONS = [
  {
    tipo: 'documento',
    label: 'Documentos',
    description: 'Lecturas y materiales consultados por el miembro.',
    icon: FileText,
    accent: colors.primary,
  },
  {
    tipo: 'presentacion',
    label: 'Presentaciones',
    description: 'Apoyos visuales abiertos en su biblioteca.',
    icon: Presentation,
    accent: colors.blue,
  },
  {
    tipo: 'video',
    label: 'Videos',
    description: 'Clases y reflexiones audiovisuales vistas.',
    icon: Video,
    accent: colors.accent,
  },
]

function sectionStats(items) {
  const total = items.length
  const vistos = items.filter((item) => item.visto).length
  const percent = total === 0 ? 0 : Math.round((vistos / total) * 100)
  return { total, vistos, percent }
}

export default function AdminUsuarioProgreso() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [modulos, setModulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState('documento')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([adminAPI.userProgreso(userId), pedagogiaAPI.modulos()])
      .then(([progresoRes, modulosRes]) => {
        if (cancelled) return
        setData(progresoRes.data)
        setModulos(modulosRes.data.results || modulosRes.data)
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar el progreso de este usuario.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [userId])

  const byTipo = useMemo(() => {
    const map = { documento: [], presentacion: [], video: [] }
    ;(data?.contenidos || []).forEach((item) => {
      if (map[item.tipo]) map[item.tipo].push(item)
    })
    return map
  }, [data])

  if (loading) return <LoadingScreen rows={3} />

  if (error || !data) {
    return (
      <>
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/admin/usuarios')}
          sx={{ mb: 2 }}
        >
          Volver a usuarios
        </Button>
        <EmptyState
          title="No se encontró el avance"
          description={error || 'El usuario no existe o no tienes permiso para verlo.'}
          actionLabel="Volver al listado"
          onAction={() => navigate('/admin/usuarios')}
        />
      </>
    )
  }

  const { usuario, ficha, resumen_contenidos: resumen } = data

  if (usuario.role !== 'member') {
    return (
      <>
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/admin/usuarios')}
          sx={{ mb: 2 }}
        >
          Volver a usuarios
        </Button>
        <EmptyState
          title="Sin avance formativo"
          description={`${usuario.full_name || usuario.username} es ${ROLE_LABELS[usuario.role] || usuario.role}. Este perfil supervisa a los miembros y no lleva un progreso propio.`}
          actionLabel="Volver al listado"
          onAction={() => navigate('/admin/usuarios')}
        />
      </>
    )
  }

  const nombre = usuario.full_name || usuario.username
  const caminoPercent = ficha?.progreso_general ?? 0
  const checklistHechas = (ficha?.checklist || []).filter((c) => c.completada).length
  const checklistTotal = (ficha?.checklist || []).length

  return (
    <>
      <Button
        startIcon={<ArrowLeft size={16} />}
        onClick={() => navigate('/admin/usuarios')}
        sx={{ mb: 1.5, alignSelf: 'flex-start' }}
      >
        Volver a usuarios
      </Button>

      <PageHeader
        title={nombre}
        subtitle={`Progreso de @${usuario.username} · ${ROLE_LABELS[usuario.role] || usuario.role}`}
        action={
          <StatusBadge
            status={usuario.is_active_member ? 'active' : 'alert'}
            label={usuario.is_active_member ? 'Activo' : 'Inactivo'}
          />
        }
      />

      <Stack spacing={3}>
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.surface,
          }}
        >
          <Typography variant="overline" sx={{ color: colors.muted, display: 'block', mb: 0.5 }}>
            Resumen
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            divider={
              <Box
                sx={{
                  width: { xs: '100%', sm: '1px' },
                  height: { xs: '1px', sm: 'auto' },
                  bgcolor: colors.border,
                  alignSelf: 'stretch',
                }}
              />
            }
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Camino pedagógico
              </Typography>
              <Typography className="font-display" sx={{ fontSize: '1.5rem', color: colors.dark, mb: 1 }}>
                {caminoPercent}%
              </Typography>
              <AnimatedProgress value={caminoPercent} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {ficha
                  ? `${checklistHechas} de ${checklistTotal} semanas en diario`
                  : 'Sin ficha pedagógica aún'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Biblioteca de contenidos
              </Typography>
              <Typography className="font-display" sx={{ fontSize: '1.5rem', color: colors.dark, mb: 1 }}>
                {resumen?.percent ?? 0}%
              </Typography>
              <AnimatedProgress value={resumen?.percent ?? 0} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {resumen?.vistos ?? 0} de {resumen?.total ?? 0} materiales consultados
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="overline" sx={{ color: colors.muted, display: 'block', mb: 1.5 }}>
            Camino pedagógico
          </Typography>
          {!ficha ? (
            <EmptyState
              title="Sin ficha aún"
              description="Este usuario todavía no tiene ficha pedagógica registrada."
            />
          ) : (
            <Stack spacing={2}>
              <Box
                sx={{
                  p: { xs: 2, md: 2.5 },
                  borderRadius: 3,
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.surface,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography className="font-display" sx={{ fontSize: '1.15rem', color: colors.dark }}>
                    Etapas del camino
                  </Typography>
                  {ficha.modulo_actual_detalle && (
                    <Chip
                      size="small"
                      label={ficha.modulo_actual_detalle.nombre.replace(/^Etapa [IVX]+ — /, '')}
                      variant="outlined"
                    />
                  )}
                </Stack>
                <EtapasJourney modulos={modulos} etapaActualId={ficha.modulo_actual} />
              </Box>

              <Box
                sx={{
                  p: { xs: 2, md: 2.5 },
                  borderRadius: 3,
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.surface,
                }}
              >
                <Typography className="font-display" sx={{ fontSize: '1.15rem', color: colors.dark, mb: 1.5 }}>
                  Diario semanal
                </Typography>
                <Stack spacing={1.5} sx={{ maxHeight: 420, overflow: 'auto' }}>
                  {(ficha.checklist || []).filter((c) => c.nota).map((c) => (
                    <Box key={c.pregunta_id} sx={{ p: 2, bgcolor: colors.light, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Semana {c.semana || c.orden}
                        {c.completada ? ' · Completada' : ''}
                      </Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                        {c.texto.replace(/^Semana \d+ — /, '')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{c.nota}</Typography>
                    </Box>
                  ))}
                  {(ficha.checklist || []).filter((c) => c.nota).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Aún no hay entradas en el diario de este miembro.
                    </Typography>
                  )}
                </Stack>
              </Box>

              {ficha.notas_formador && (
                <Box
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    borderRadius: 3,
                    border: `1px solid ${colors.border}`,
                    bgcolor: colors.surface,
                  }}
                >
                  <Typography className="font-display" sx={{ fontSize: '1.15rem', color: colors.dark, mb: 1 }}>
                    Notas del formador
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {ficha.notas_formador}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </Box>

        <Box>
          <Typography variant="overline" sx={{ color: colors.muted, display: 'block', mb: 1.5 }}>
            Contenidos consultados
          </Typography>
          <Stack spacing={1.5}>
            {SECTIONS.map((section) => {
              const sectionItems = byTipo[section.tipo]
              const stats = sectionStats(sectionItems)
              const Icon = section.icon
              const isOpen = expanded === section.tipo

              return (
                <Accordion
                  key={section.tipo}
                  expanded={isOpen}
                  onChange={(_, open) => setExpanded(open ? section.tipo : false)}
                  disableGutters
                  sx={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px !important',
                    bgcolor: colors.surface,
                    boxShadow: 'none',
                    overflow: 'hidden',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.primary }} />}
                    sx={{
                      minHeight: 72,
                      px: { xs: 2, md: 2.5 },
                      '& .MuiAccordionSummary-content': { my: 1.5, alignItems: 'center', gap: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: colors.light,
                        border: `1px solid ${colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={22} color={section.accent} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={0.5}
                      >
                        <Typography className="font-display" sx={{ fontSize: '1.2rem', color: colors.dark }}>
                          {section.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.muted, fontWeight: 500 }}>
                          {stats.total === 0
                            ? 'Sin materiales'
                            : `${stats.vistos}/${stats.total} · ${stats.percent}%`}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, lineHeight: 1.5 }}>
                        {section.description}
                      </Typography>
                      {stats.total > 0 && (
                        <LinearProgress
                          variant="determinate"
                          value={stats.percent}
                          sx={{
                            mt: 1.25,
                            height: 6,
                            borderRadius: 99,
                            bgcolor: colors.border,
                            '& .MuiLinearProgress-bar': { bgcolor: section.accent, borderRadius: 99 },
                          }}
                        />
                      )}
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: { xs: 2, md: 2.5 }, pb: 2.5, pt: 0 }}>
                    {sectionItems.length === 0 ? (
                      <Typography color="text.secondary" sx={{ py: 1 }}>
                        No hay {section.label.toLowerCase()} en la biblioteca.
                      </Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        {sectionItems.map((contenido) => (
                          <Box
                            key={contenido.id}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: `1px solid ${colors.border}`,
                              bgcolor: contenido.visto ? 'rgba(255,255,255,0.65)' : colors.light,
                            }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                              {contenido.visto ? (
                                <CircleCheck size={20} color={colors.moss} />
                              ) : (
                                <Circle size={20} color={colors.muted} />
                              )}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: contenido.visto ? colors.moss : colors.muted,
                                  fontWeight: 500,
                                }}
                              >
                                {contenido.visto ? 'Consultado' : 'Pendiente'}
                              </Typography>
                            </Stack>
                            <Typography className="font-display" sx={{ fontSize: '1.05rem', color: colors.dark, mb: 0.5 }}>
                              {contenido.titulo}
                            </Typography>
                            {contenido.descripcion && (
                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                                {contenido.descripcion}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Stack>
        </Box>
      </Stack>
    </>
  )
}
