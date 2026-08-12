import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Circle, CircleCheck, FileText, Presentation, Video } from 'lucide-react'
import { contentAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import AnimatedProgress from '../../components/common/AnimatedProgress'
import { colors } from '../../theme/muiTheme'

const SECTIONS = [
  {
    tipo: 'documento',
    label: 'Documentos',
    singular: 'Documento',
    description: 'Lecturas, guías y materiales para profundizar con calma.',
    icon: FileText,
    accent: colors.primary,
  },
  {
    tipo: 'presentacion',
    label: 'Presentaciones',
    singular: 'Presentación',
    description: 'Apoyos visuales para la formación y el estudio comunitario.',
    icon: Presentation,
    accent: colors.blue,
  },
  {
    tipo: 'video',
    label: 'Videos',
    singular: 'Video',
    description: 'Clases y reflexiones audiovisuales de tu camino formativo.',
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

export default function Contenidos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState('documento')
  const [openingId, setOpeningId] = useState(null)

  const loadItems = () =>
    contentAPI.list().then((r) => setItems(r.data.results || r.data))

  useEffect(() => {
    loadItems().finally(() => setLoading(false))
  }, [])

  const byTipo = useMemo(() => {
    const map = { documento: [], presentacion: [], video: [] }
    items.forEach((item) => {
      if (map[item.tipo]) map[item.tipo].push(item)
    })
    return map
  }, [items])

  const overall = useMemo(() => {
    const relevant = items.filter((item) => ['documento', 'presentacion', 'video'].includes(item.tipo))
    return sectionStats(relevant)
  }, [items])

  const handleOpen = async (contenido) => {
    if (!contenido.url_externa && !contenido.archivo) return
    setOpeningId(contenido.id)
    try {
      await contentAPI.marcarVisto(contenido.id)
      setItems((prev) =>
        prev.map((item) => (item.id === contenido.id ? { ...item, visto: true } : item)),
      )
    } catch {
      // Abrimos igual aunque falle el registro de vista
    } finally {
      setOpeningId(null)
    }

    const url = contenido.url_externa || contenido.archivo
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) return <LoadingScreen rows={3} />

  const hasContent = SECTIONS.some((section) => byTipo[section.tipo].length > 0)

  return (
    <>
      <PageHeader
        title="Biblioteca de contenidos"
        subtitle="Explora documentos, presentaciones y videos. Marca tu avance al consultar cada material."
      />

      {!hasContent ? (
        <EmptyState
          title="La biblioteca está vacía por ahora"
          description="Los manuales y materiales de tu módulo aparecerán aquí cuando estén disponibles."
          actionLabel="Ver mi ficha pedagógica"
          onAction={() => { window.location.href = '/app/ficha' }}
        />
      ) : (
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
              Tu progreso en contenidos
            </Typography>
            <Typography className="font-display" sx={{ fontSize: '1.35rem', mb: 1.5, color: colors.dark }}>
              {overall.vistos} de {overall.total} consultados · {overall.percent}%
            </Typography>
            <AnimatedProgress value={overall.percent} />
          </Box>

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
                        Todavía no hay {section.label.toLowerCase()} disponibles.
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
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: 2,
                              alignItems: { sm: 'center' },
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                                {contenido.visto ? (
                                  <CircleCheck size={20} color={colors.moss} />
                                ) : (
                                  <Circle size={20} color={colors.muted} />
                                )}
                                <Typography variant="body2" sx={{ color: contenido.visto ? colors.moss : colors.muted, fontWeight: 500 }}>
                                  {contenido.visto ? 'Ya consultado' : 'Pendiente'}
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
                            <Button
                              variant={contenido.visto ? 'outlined' : 'contained'}
                              onClick={() => handleOpen(contenido)}
                              disabled={openingId === contenido.id || (!contenido.url_externa && !contenido.archivo)}
                              sx={{ flexShrink: 0, minWidth: 140 }}
                            >
                              {openingId === contenido.id
                                ? 'Abriendo…'
                                : contenido.visto
                                  ? 'Volver a abrir'
                                  : `Abrir ${section.singular.toLowerCase()}`}
                            </Button>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Stack>
        </Stack>
      )}
    </>
  )
}
