import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import AnimatedProgress from '../../components/common/AnimatedProgress'
import EtapasJourney from '../../components/pedagogia/EtapasJourney'
import { colors } from '../../theme/muiTheme'

export default function CoordinatorSeguimiento() {
  const [fichas, setFichas] = useState([])
  const [modulos, setModulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [notas, setNotas] = useState('')
  const [etapaId, setEtapaId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([pedagogiaAPI.fichas(), pedagogiaAPI.modulos()])
      .then(([f, m]) => {
        const lista = f.data.results || f.data
        setFichas(lista.filter((fi) => fi.usuario_detalle?.role === 'member'))
        setModulos(m.data.results || m.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const abrirFicha = (ficha) => {
    setSelected(ficha)
    setNotas(ficha.notas_formador || '')
    setEtapaId(ficha.modulo_actual || '')
  }

  const guardarSeguimiento = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const payload = { notas_formador: notas }
      if (etapaId) payload.modulo_actual = etapaId
      const { data } = await pedagogiaAPI.updateFicha(selected.id, payload)
      setFichas((prev) => prev.map((f) => (f.id === data.id ? data : f)))
      setSelected(data)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader
        title="Seguimiento de caminos"
        subtitle="Acompaña el progreso de cada miembro por etapas y revisa su diario semanal"
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: selected ? 5 : 12 }}>
          {fichas.length === 0 ? (
            <EmptyState title="Sin miembros" description="Aún no hay fichas pedagógicas registradas." />
          ) : (
            <Stack spacing={1.5}>
              {fichas.map((f) => {
                const u = f.usuario_detalle
                const nombre = u ? `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username : 'Miembro'
                const semanas = (f.checklist || []).filter((c) => c.completada).length
                return (
                  <Card
                    key={f.id}
                    onClick={() => abrirFicha(f)}
                    sx={{
                      cursor: 'pointer',
                      border: selected?.id === f.id ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>{nombre}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {semanas} semanas en diario · {f.progreso_general}% avance
                          </Typography>
                        </Box>
                        {f.modulo_actual_detalle && (
                          <Chip
                            size="small"
                            label={f.modulo_actual_detalle.nombre.replace(/^Etapa [IVX]+ — /, '')}
                            variant="outlined"
                          />
                        )}
                      </Stack>
                      <Box sx={{ mt: 1.5 }}>
                        <AnimatedProgress value={f.progreso_general} sx={{ height: 6 }} />
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          )}
        </Grid>

        {selected && (
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ border: `1px solid ${colors.border}`, position: 'sticky', top: 88 }}>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  {selected.usuario_detalle?.first_name || selected.usuario_detalle?.username}
                </Typography>

                <EtapasJourney
                  modulos={modulos}
                  etapaActualId={selected.modulo_actual}
                />

                <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                  <InputLabel id="etapa-label">Etapa actual del miembro</InputLabel>
                  <Select
                    labelId="etapa-label"
                    label="Etapa actual del miembro"
                    value={etapaId}
                    onChange={(e) => setEtapaId(e.target.value)}
                  >
                    {modulos.map((m) => (
                      <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Notas de acompañamiento"
                  multiline
                  minRows={3}
                  fullWidth
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  helperText="Observaciones privadas para el seguimiento pastoral"
                  sx={{ mb: 2 }}
                />

                <Button variant="contained" onClick={guardarSeguimiento} disabled={saving} sx={{ mt: 2 }}>
                  {saving ? 'Guardando…' : 'Guardar seguimiento'}
                </Button>

                <Typography variant="overline" sx={{ display: 'block', mt: 4, mb: 1.5 }}>
                  Diario semanal
                </Typography>
                <Stack spacing={1.5} sx={{ maxHeight: 360, overflow: 'auto' }}>
                  {(selected.checklist || []).filter((c) => c.nota).map((c) => (
                    <Box key={c.pregunta_id} sx={{ p: 2, bgcolor: colors.surface, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Semana {c.semana || c.orden}
                      </Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                        {c.texto.replace(/^Semana \d+ — /, '')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{c.nota}</Typography>
                    </Box>
                  ))}
                  {(selected.checklist || []).filter((c) => c.nota).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Aún no hay entradas en el diario.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  )
}
