import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { BookOpen, PenLine } from 'lucide-react'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import AnimatedProgress from '../../components/common/AnimatedProgress'
import EtapasJourney from '../../components/pedagogia/EtapasJourney'
import ModuloManual from '../../components/pedagogia/ModuloManual'
import { colors } from '../../theme/muiTheme'

export default function FichaPedagogica() {
  const [ficha, setFicha] = useState(null)
  const [modulos, setModulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [manualModulo, setManualModulo] = useState(null)
  const [expandedWeek, setExpandedWeek] = useState(null)

  const load = () =>
    Promise.all([pedagogiaAPI.miFicha(), pedagogiaAPI.modulos()])
      .then(([f, m]) => {
        setFicha(f.data)
        setModulos(m.data.results || m.data)
        const initial = {}
        ;(f.data.checklist || []).forEach((c) => {
          initial[c.pregunta_id] = c.nota || ''
        })
        setDrafts(initial)
        const firstOpen = (f.data.checklist || []).find((c) => !c.completada)
        if (firstOpen) setExpandedWeek(firstOpen.pregunta_id)
      })

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const checklist = ficha?.checklist || []
  const completadas = checklist.filter((c) => c.completada).length
  const progreso = ficha?.progreso_general || 0
  const etapaActual = ficha?.modulo_actual

  const guardarEntrada = async (item) => {
    const nota = (drafts[item.pregunta_id] || '').trim()
    if (nota.length < 15) return
    setSaving(item.pregunta_id)
    try {
      const { data } = await pedagogiaAPI.responderChecklist({
        pregunta_id: item.pregunta_id,
        nota,
      })
      setFicha(data.ficha)
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader
        title="Mi camino"
        subtitle="Diario semanal de reflexión y etapas de formación"
      />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card sx={{ mb: 3, border: `1px solid ${colors.border}` }}>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={2}>
                <Box>
                  <Typography variant="overline" color="text.secondary">Tu recorrido</Typography>
                  <Typography variant="h2" color="secondary.main" sx={{ fontWeight: 400 }}>{progreso}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {completadas} de {checklist.length} semanas escritas en tu diario
                  </Typography>
                </Box>
                {ficha?.modulo_actual_detalle && (
                  <Chip
                    label={`Etapa actual: ${ficha.modulo_actual_detalle.nombre.replace(/^Etapa [IVX]+ — /, '')}`}
                    sx={{ bgcolor: `${ficha.modulo_actual_detalle.color}22`, borderColor: ficha.modulo_actual_detalle.color }}
                    variant="outlined"
                  />
                )}
              </Stack>
              <AnimatedProgress value={progreso} />
              <EtapasJourney
                modulos={modulos}
                etapaActualId={etapaActual}
                onSelect={(mod) => {
                  if (mod.contenido_manual?.length) setManualModulo(mod)
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Tu coordinador acompaña tu avance por etapas. Toca una etapa para abrir su manual digital.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      {manualModulo && (
        <Box sx={{ mb: 4 }}>
          <ModuloManual modulo={manualModulo} onClose={() => setManualModulo(null)} />
        </Box>
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <PenLine size={20} color={colors.primary} />
        <Typography variant="h3">Diario semanal</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Cada semana escribe con libertad. No hay respuestas correctas — es tu espacio personal de reflexión.
      </Typography>

      {checklist.length === 0 ? (
        <EmptyState
          title="Diario no configurado"
          description="El administrador debe definir las entradas semanales desde el panel."
        />
      ) : (
        <Stack spacing={2} sx={{ mb: 5 }}>
          {checklist.map((item) => {
            const open = expandedWeek === item.pregunta_id
            const draft = drafts[item.pregunta_id] ?? item.nota ?? ''
            const canSave = draft.trim().length >= 15

            return (
              <Card
                key={item.pregunta_id}
                sx={{
                  border: `1px solid ${item.completada ? colors.moss + '55' : colors.border}`,
                  bgcolor: item.completada ? `${colors.moss}0D` : 'background.paper',
                  overflow: 'hidden',
                }}
              >
                <CardContent
                  sx={{ cursor: 'pointer', pb: open ? 0 : 2 }}
                  onClick={() => setExpandedWeek(open ? null : item.pregunta_id)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Semana {item.semana || item.orden}
                        {item.modulo_nombre && ` · ${item.modulo_nombre.replace(/^Etapa [IVX]+ — /, '')}`}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={500} sx={{ mt: 0.5 }}>
                        {item.texto.replace(/^Semana \d+ — /, '')}
                      </Typography>
                    </Box>
                    {item.completada && (
                      <Chip label="Escrito" size="small" color="success" variant="outlined" />
                    )}
                  </Stack>
                  {!open && item.nota && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }} noWrap>
                      {item.nota.slice(0, 120)}…
                    </Typography>
                  )}
                </CardContent>
                <Collapse in={open}>
                  <CardContent sx={{ pt: 0 }}>
                    {item.ayuda && (
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                        {item.ayuda}
                      </Typography>
                    )}
                    <TextField
                      multiline
                      minRows={4}
                      fullWidth
                      placeholder="Escribe aquí tu reflexión de la semana…"
                      value={draft}
                      onChange={(e) => setDrafts((d) => ({ ...d, [item.pregunta_id]: e.target.value }))}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ mb: 2 }}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color={canSave ? 'text.secondary' : 'warning.main'}>
                        {canSave ? `${draft.trim().length} caracteres` : 'Mínimo 15 caracteres para guardar'}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={!canSave || saving === item.pregunta_id}
                        onClick={(e) => { e.stopPropagation(); guardarEntrada(item) }}
                      >
                        {saving === item.pregunta_id ? 'Guardando…' : item.completada ? 'Actualizar entrada' : 'Guardar semana'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>
            )
          })}
        </Stack>
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <BookOpen size={20} color={colors.primary} />
        <Typography variant="h3">Manuales por etapa</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Guías interactivas — no solo PDFs. Explora tips, reflexiones e imágenes de cada etapa.
      </Typography>

      <Stack spacing={2}>
        {modulos.map((mod) => (
          <Card key={mod.id} sx={{ borderLeft: 4, borderColor: mod.color || colors.primary }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
                <Box>
                  <Typography variant="overline">Etapa {mod.orden}</Typography>
                  <Typography variant="subtitle1" fontWeight={600}>{mod.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">{mod.descripcion}</Typography>
                </Box>
                <Button
                  variant={mod.contenido_manual?.length ? 'contained' : 'outlined'}
                  onClick={() => mod.contenido_manual?.length && setManualModulo(mod)}
                  disabled={!mod.contenido_manual?.length}
                >
                  {mod.contenido_manual?.length ? 'Abrir manual' : 'Próximamente'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  )
}
