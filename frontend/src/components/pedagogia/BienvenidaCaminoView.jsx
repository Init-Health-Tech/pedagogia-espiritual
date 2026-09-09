import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../common/PageHeader'
import LoadingScreen from '../common/LoadingScreen'
import EmptyState from '../common/EmptyState'
import AnimatedProgress from '../common/AnimatedProgress'
import SugerenciaBanner from './SugerenciaBanner'
import { colors } from '../../theme/muiTheme'

const SEMANAS_REFERENCIA = 12

export default function BienvenidaCaminoView({ onHelp }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() =>
    pedagogiaAPI.miBienvenida()
      .then((res) => setData(res.data))
      .catch(() => setData(null)),
  [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  const toggle = async (tareaId, completada) => {
    setBusyId(tareaId)
    try {
      const { data: next } = await pedagogiaAPI.marcarBienvenida({
        tarea_id: tareaId,
        completada,
      })
      setData(next)
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <LoadingScreen />

  if (!data) {
    return (
      <EmptyState
        title="No se pudo cargar tu bienvenida"
        description="Intenta de nuevo en un momento."
      />
    )
  }

  const { tareas = [], progreso = {}, sugerencia_inicio_formal: sug, semanas_en_bienvenida: semanas } = data
  const completadas = progreso.completadas || 0
  const total = progreso.total || 0
  const percent = total === 0 ? 0 : Math.round((completadas / total) * 100)

  return (
    <>
      <PageHeader
        title="Mi camino"
        subtitle="Periodo de orientación antes de tu camino formal"
        onHelp={onHelp}
        helpLabel="Ver ayuda de Camino"
      />

      <Card sx={{ mb: 3, border: `1px solid ${colors.border}` }}>
        <CardContent>
          <Typography variant="h2" component="h2" sx={{ fontWeight: 300, color: colors.dark, mb: 1 }}>
            Bienvenido a tu periodo de orientación
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
            Llevas {semanas} {semanas === 1 ? 'semana' : 'semanas'} de tu periodo de bienvenida
            {' '}(de aproximadamente {SEMANAS_REFERENCIA} semanas). Es una referencia orientativa,
            sin prisa: avanza a tu ritmo con estas tareas.
          </Typography>

          <Stack spacing={1} sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="body2" color="text.secondary">
                {completadas} de {total} tareas completadas
              </Typography>
              <Typography variant="body2" sx={{ color: colors.primary, fontWeight: 500 }}>
                {percent}%
              </Typography>
            </Stack>
            <AnimatedProgress value={percent} />
          </Stack>

          {sug?.mostrar_aviso_miembro && (
            <SugerenciaBanner mode="member" sx={{ mb: 2 }}>
              Has completado tu periodo de bienvenida. Tu coordinador se pondrá en contacto
              contigo para comenzar tu camino formal.
            </SugerenciaBanner>
          )}

          {tareas.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Todavía no hay tareas de bienvenida configuradas.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {tareas.map((t) => (
                <Box
                  key={t.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${colors.border}`,
                    bgcolor: t.completada ? `${colors.moss}10` : colors.surface,
                  }}
                >
                  <FormControlLabel
                    sx={{ alignItems: 'flex-start', m: 0, width: '100%' }}
                    control={
                      <Checkbox
                        checked={Boolean(t.completada)}
                        disabled={busyId === t.id}
                        onChange={(e) => toggle(t.id, e.target.checked)}
                        sx={{ mt: -0.5 }}
                      />
                    }
                    label={(
                      <Box sx={{ pl: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            color: colors.dark,
                            textDecoration: t.completada ? 'line-through' : 'none',
                            opacity: t.completada ? 0.75 : 1,
                          }}
                        >
                          {t.nombre}
                        </Typography>
                        {t.descripcion ? (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            {t.descripcion}
                          </Typography>
                        ) : null}
                      </Box>
                    )}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </>
  )
}
