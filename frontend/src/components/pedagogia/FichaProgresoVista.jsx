import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Flame } from 'lucide-react'
import AnimatedProgress from '../common/AnimatedProgress'
import { colors } from '../../theme/muiTheme'

const PALETA_LINEAS = [
  colors.navy,
  colors.sky,
  colors.moss,
  colors.secondary,
  colors.accent,
  colors.earth,
]

function etiquetaSemanas(n) {
  return n === 1 ? 'semana' : 'semanas'
}

function ResumenCard({ overline, children, caption }) {
  return (
    <Card sx={{ flex: 1, border: `1px solid ${colors.border}`, minWidth: 0 }}>
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="overline" color="text.secondary" display="block">
          {overline}
        </Typography>
        {children}
        {caption && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            {caption}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

function GraficaGrupo({ grupo, emptyMessage }) {
  return (
    <Card sx={{ border: `1px solid ${colors.border}` }}>
      <CardContent>
        <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
          {grupo.grupo}
        </Typography>
        {grupo.listo ? (
          <Box sx={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={grupo.series} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={colors.border} strokeDasharray="3 3" />
                <XAxis
                  dataKey="semana"
                  tick={{ fill: colors.muted, fontSize: 12 }}
                  label={{ value: 'Semana', position: 'insideBottom', offset: -2, fill: colors.muted, fontSize: 12 }}
                />
                <YAxis
                  domain={[grupo.escala_min, grupo.escala_max]}
                  tick={{ fill: colors.muted, fontSize: 12 }}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    color: colors.dark,
                  }}
                  labelFormatter={(v) => `Semana ${v}`}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: colors.dark }} />
                {(grupo.areas || []).map((area, i) => (
                  <Line
                    key={area.id}
                    type="monotone"
                    dataKey={area.nombre}
                    stroke={PALETA_LINEAS[i % PALETA_LINEAS.length]}
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 0, fill: PALETA_LINEAS[i % PALETA_LINEAS.length] }}
                    connectNulls={false}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            {emptyMessage}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

function PerfilReadonly({ perfil }) {
  if (!perfil) return null
  const seguimiento = perfil.seguimiento || []
  const tieneSeguimiento = seguimiento.some((s) => (s.valor || '').trim())

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h3" sx={{ mb: 0.5 }}>Datos de perfil</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Información que el miembro compartió en su ficha (solo lectura).
      </Typography>
      <Card sx={{ border: `1px solid ${colors.border}` }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">Edad</Typography>
              <Typography variant="body1">{perfil.edad != null ? perfil.edad : '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Estado civil</Typography>
              <Typography variant="body1">{perfil.estado_civil?.trim() || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Proceso de fe</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {perfil.proceso_de_fe?.trim() || '—'}
              </Typography>
            </Box>
            {tieneSeguimiento && (
              <Box sx={{ pt: 1, borderTop: `1px solid ${colors.border}` }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Seguimiento pedagógico</Typography>
                <Stack spacing={1.5}>
                  {seguimiento.map((s) => (
                    <Box key={s.campo}>
                      <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {(s.valor || '').trim() || '—'}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
            {!tieneSeguimiento && (
              <Typography variant="body2" color="text.secondary">
                Aún no hay notas en los puntos de seguimiento.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

/**
 * Vista de solo lectura de progreso de Ficha Pedagógica.
 * @param {object} ficha — payload de FichaPedagogicaSerializer del miembro
 * @param {'member'|'admin'} variant — ajusta copy y secciones visibles
 * @param {boolean} showResumenCards — tarjetas etapa/ficha/racha (default: true)
 * @param {boolean} showPerfil — bloque FichaPerfil (default: true en admin)
 */
export default function FichaProgresoVista({
  ficha,
  variant = 'member',
  showResumenCards = true,
  showPerfil = variant === 'admin',
}) {
  const isAdmin = variant === 'admin'
  const progreso = ficha?.ficha_progreso || {}
  const perfil = ficha?.perfil
  const semanal = ficha?.ficha_semanal || {}
  const racha = progreso.racha_actual || 0
  const mejor = progreso.mejor_racha || 0
  const etapa = progreso.etapa_actual
  const etapaNombre = etapa?.nombre
    ? etapa.nombre.replace(/^Etapa [IVX]+ — /, '')
    : 'Sin etapa asignada'
  const graficas = progreso.graficas || []
  const praxis = progreso.praxis || []

  const tieneEntradas = (semanal.semanas_completadas || 0) > 0
    || (progreso.semanas_ficha_completadas || 0) > 0
    || graficas.some((g) => (g.semanas_con_dato || 0) > 0)
  const perfilIniciado = Boolean(perfil?.perfil_completado)

  if (isAdmin && !perfilIniciado && !tieneEntradas) {
    return (
      <Typography variant="body2" color="text.secondary">
        Este miembro aún no ha comenzado su Ficha Pedagógica.
      </Typography>
    )
  }

  const copy = isAdmin
    ? {
        rachaCero: 'El camino continúa semana a semana',
        rachaDesc: 'Semanas seguidas en las que completó tanto el diario como la ficha.',
        mejorRacha: 'Mejor racha',
        graficasTitulo: 'Cómo se ha percibido',
        graficasDesc: 'Cada línea es una dimensión. Se dibuja con al menos dos semanas registradas.',
        graficaVacia: 'La gráfica aparecerá conforme avance en su camino.',
        praxisTitulo: 'Praxis espiritual',
        praxisDesc: 'Presencia de cada práctica en las semanas ya disponibles.',
        praxisVacia: 'Aún no hay registros de praxis para este miembro.',
      }
    : {
        rachaCero: 'Tu camino continúa semana a semana',
        rachaDesc: 'Semanas seguidas en las que completaste tanto tu diario como tu ficha. Sin prisas: cada registro cuenta.',
        mejorRacha: 'Tu mejor racha',
        graficasTitulo: 'Cómo te has percibido',
        graficasDesc: 'Cada línea es una dimensión. Se dibuja cuando hay al menos dos semanas registradas.',
        graficaVacia: 'Tu gráfica aparecerá aquí conforme avances en tu camino.',
        praxisTitulo: 'Praxis espiritual',
        praxisDesc: 'Presencia de cada práctica en las semanas ya disponibles de tu camino.',
        praxisVacia: 'Cuando registres tu praxis semanal, verás aquí tu constancia en cada práctica.',
      }

  return (
    <Box>
      {showPerfil && perfilIniciado && <PerfilReadonly perfil={perfil} />}

      {showResumenCards && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <ResumenCard overline="Etapa actual">
            <Typography variant="h3" sx={{ fontWeight: 400, mt: 0.5 }}>
              {etapaNombre}
            </Typography>
          </ResumenCard>
          <ResumenCard overline="Ficha" caption="semanas acompañadas">
            <Typography variant="h3" sx={{ fontWeight: 400, mt: 0.5 }}>
              {progreso.semanas_ficha_completadas || 0} de {progreso.semanas_disponibles || 0}
            </Typography>
          </ResumenCard>
          <ResumenCard overline="Constancia" caption={etiquetaSemanas(racha)}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
              <Flame size={18} color={colors.secondary} strokeWidth={1.5} />
              <Typography variant="h3" sx={{ fontWeight: 400 }}>
                {racha}
              </Typography>
            </Stack>
          </ResumenCard>
        </Stack>
      )}

      <Card sx={{ mb: 4, border: `1px solid ${colors.border}` }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box sx={{ pt: 0.5, flexShrink: 0 }}>
              <Flame size={22} color={colors.secondary} strokeWidth={1.5} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h3" sx={{ fontWeight: 400, mb: 0.75 }}>
                {racha === 0
                  ? copy.rachaCero
                  : `${racha} ${etiquetaSemanas(racha)} de constancia`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.rachaDesc}
              </Typography>
              {mejor > 0 && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.25 }}>
                  {copy.mejorRacha}: {mejor} {etiquetaSemanas(mejor)}
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h3" sx={{ mb: 0.5 }}>{copy.graficasTitulo}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {copy.graficasDesc}
      </Typography>
      <Stack spacing={3} sx={{ mb: 5 }}>
        {graficas.length === 0 ? (
          <Card sx={{ border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {copy.graficaVacia}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          graficas.map((g) => (
            <GraficaGrupo key={g.grupo} grupo={g} emptyMessage={copy.graficaVacia} />
          ))
        )}
      </Stack>

      <Typography variant="h3" sx={{ mb: 0.5 }}>{copy.praxisTitulo}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {copy.praxisDesc}
      </Typography>
      {praxis.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {copy.praxisVacia}
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          {praxis.map((item) => (
            <Box key={item.item_id}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'baseline' }}
                spacing={0.5}
                sx={{ mb: 0.75 }}
              >
                <Typography variant="body1">{item.nombre}</Typography>
                <Typography variant="caption" color="text.secondary">
                  presente en {item.semanas_marcadas} de {item.semanas_disponibles} semanas
                </Typography>
              </Stack>
              <AnimatedProgress
                value={item.porcentaje}
                sx={{
                  height: 8,
                  borderRadius: 999,
                  bgcolor: colors.border,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                    bgcolor: colors.moss,
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}
