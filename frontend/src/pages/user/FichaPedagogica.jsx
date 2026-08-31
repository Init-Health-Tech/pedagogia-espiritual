import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Collapse,
  FormControlLabel,
  Stack,
  Tab,
  Tabs,
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
import MiProgresoTab from '../../components/pedagogia/MiProgresoTab'
import { colors } from '../../theme/muiTheme'

function groupByGrupo(entradas) {
  const map = new Map()
  for (const e of entradas) {
    const key = e.grupo_grafica || 'Otras dimensiones'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(e)
  }
  return [...map.entries()]
}

function rangeNums(min, max) {
  const start = Math.max(1, min || 1)
  const end = Math.max(start, max || 10)
  const out = []
  for (let n = start; n <= end; n += 1) out.push(n)
  return out
}

function DiarioTab({
  checklist,
  drafts,
  setDrafts,
  expandedWeek,
  setExpandedWeek,
  saving,
  guardarEntrada,
}) {
  if (checklist.length === 0) {
    return (
      <EmptyState
        title="Diario no configurado"
        description="El administrador debe definir las entradas semanales desde el panel."
      />
    )
  }

  return (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <PenLine size={20} color={colors.primary} />
        <Typography variant="h3">Diario semanal</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Cada semana escribe con libertad. No hay respuestas correctas — es tu espacio personal de reflexión.
      </Typography>

      {checklist.map((item) => {
        const locked = item.disponible === false
        const open = !locked && expandedWeek === item.pregunta_id
        const draft = drafts[item.pregunta_id] ?? item.nota ?? ''
        const canSave = draft.trim().length >= 15
        const lockLabel = item.dias_restantes === 1
          ? 'Disponible mañana'
          : item.dias_restantes > 1
            ? `Disponible en ${item.dias_restantes} días`
            : 'Próxima semana'

        return (
          <Card
            key={item.pregunta_id}
            sx={{
              border: `1px solid ${locked ? colors.border : item.completada ? colors.moss + '55' : colors.border}`,
              bgcolor: locked ? colors.light : item.completada ? `${colors.moss}0D` : 'background.paper',
              overflow: 'hidden',
              opacity: locked ? 0.78 : 1,
            }}
          >
            <CardContent
              sx={{ cursor: locked ? 'default' : 'pointer', pb: open ? 0 : 2 }}
              onClick={() => {
                if (locked) return
                setExpandedWeek(open ? null : item.pregunta_id)
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ width: '100%' }}>
                <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    Semana {item.semana || item.orden}
                    {item.modulo_nombre && ` · ${item.modulo_nombre.replace(/^Etapa [IVX]+ — /, '')}`}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{ mt: 0.5, color: locked ? 'text.secondary' : 'text.primary' }}
                  >
                    {item.texto.replace(/^Semana \d+ — /, '')}
                  </Typography>
                </Box>
                {locked ? (
                  <Chip
                    label={lockLabel}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 'auto', flexShrink: 0, borderColor: colors.border, color: colors.muted }}
                  />
                ) : item.completada ? (
                  <Chip label="Escrito" size="small" color="success" variant="outlined" sx={{ ml: 'auto', flexShrink: 0 }} />
                ) : null}
              </Stack>
              {!open && !locked && item.nota && (
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
                <Stack spacing={1} sx={{ mt: 0.5, width: '100%' }}>
                  <Typography variant="caption" color={canSave ? 'text.secondary' : 'warning.main'}>
                    {canSave ? `${draft.trim().length} caracteres` : 'Mínimo 15 caracteres para guardar'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!canSave || saving === item.pregunta_id}
                      onClick={(e) => { e.stopPropagation(); guardarEntrada(item) }}
                      sx={{ minWidth: 168, px: 2.5 }}
                    >
                      {saving === item.pregunta_id ? 'Guardando…' : item.completada ? 'Actualizar entrada' : 'Guardar semana'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Collapse>
          </Card>
        )
      })}
    </Stack>
  )
}

function PerfilForm({ perfil, onSaved, onCancel, isEdit }) {
  const [form, setForm] = useState({
    edad: perfil?.edad ?? '',
    estado_civil: perfil?.estado_civil || '',
    proceso_de_fe: perfil?.proceso_de_fe || '',
  })
  const [notas, setNotas] = useState(() => {
    const initial = {}
    ;(perfil?.seguimiento || []).forEach((s) => { initial[s.campo] = s.valor || '' })
    return initial
  })
  const [saving, setSaving] = useState(false)

  const guardar = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...notas,
        edad: form.edad === '' ? null : Number(form.edad),
        estado_civil: form.estado_civil,
        proceso_de_fe: form.proceso_de_fe,
      }
      const { data } = await pedagogiaAPI.actualizarPerfil(payload)
      onSaved(data)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card sx={{ mb: 3, border: `1px solid ${colors.border}` }} component="form" onSubmit={guardar}>
      <CardContent>
        <Typography variant="h3" gutterBottom>
          {isEdit ? 'Actualiza tu información' : 'Antes de comenzar, cuéntanos un poco de ti'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Esto nos ayuda a acompañarte mejor. Puedes completar lo que sientas listo hoy y volver después.
        </Typography>

        <Stack spacing={2} sx={{ mb: 3, maxWidth: 520 }}>
          <TextField
            label="Edad"
            type="number"
            value={form.edad}
            onChange={(e) => setForm({ ...form, edad: e.target.value })}
            inputProps={{ min: 1, max: 120 }}
          />
          <TextField
            label="Estado civil"
            value={form.estado_civil}
            onChange={(e) => setForm({ ...form, estado_civil: e.target.value })}
          />
          <TextField
            label="Proceso de fe"
            helperText="Unas líneas sobre cómo vives tu fe hoy"
            multiline
            minRows={2}
            value={form.proceso_de_fe}
            onChange={(e) => setForm({ ...form, proceso_de_fe: e.target.value })}
          />
        </Stack>

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
          Tu seguimiento pedagógico
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Notas breves, cuando quieras. No hace falta llenarlo todo ahora.
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {(perfil?.seguimiento || []).map((s) => (
            <TextField
              key={s.campo}
              label={s.label}
              placeholder="Nota opcional…"
              multiline
              minRows={1}
              value={notas[s.campo] || ''}
              onChange={(e) => setNotas((n) => ({ ...n, [s.campo]: e.target.value }))}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {isEdit && (
            <Button type="button" onClick={onCancel} disabled={saving}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar y continuar'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

function FichaTab({ ficha, onFichaUpdate }) {
  const perfil = ficha?.perfil
  const semanal = ficha?.ficha_semanal || {}
  const semanas = semanal.semanas || []
  const semanaActual = semanal.semana_actual
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [praxisDraft, setPraxisDraft] = useState({})
  const [puntajeDraft, setPuntajeDraft] = useState({})
  const [savingWeek, setSavingWeek] = useState(null)

  const perfilCompleto = Boolean(perfil?.perfil_completado)

  useEffect(() => {
    if (!perfilCompleto || editandoPerfil) return
    const first = semanas.find((s) => s.disponible && s.semana === semanaActual)
      || semanas.find((s) => s.disponible && !s.guardada)
      || semanas.find((s) => s.disponible)
    if (first) {
      setExpanded(first.semana)
      initDraftsForWeek(first)
    }
  }, [perfilCompleto, editandoPerfil, semanaActual]) // eslint-disable-line react-hooks/exhaustive-deps

  const initDraftsForWeek = (semanaObj) => {
    const p = {}
    ;(semanaObj.praxis || []).forEach((item) => { p[item.item_id] = Boolean(item.cumplido) })
    const e = {}
    ;(semanaObj.entradas || []).forEach((area) => {
      if (area.puntaje != null) e[area.area_id] = Number(area.puntaje)
    })
    setPraxisDraft(p)
    setPuntajeDraft(e)
  }

  const abrirSemana = (semanaObj) => {
    if (semanaObj.disponible === false) return
    const open = expanded === semanaObj.semana
    if (open) {
      setExpanded(null)
      return
    }
    setExpanded(semanaObj.semana)
    initDraftsForWeek(semanaObj)
  }

  const guardarSemana = async (semanaObj) => {
    setSavingWeek(semanaObj.semana)
    try {
      const { data } = await pedagogiaAPI.guardarSemanaFicha({
        semana_global: semanaObj.semana,
        praxis: (semanaObj.praxis || []).map((item) => ({
          item_id: item.item_id,
          cumplido: Boolean(praxisDraft[item.item_id]),
        })),
        entradas: Object.entries(puntajeDraft).map(([areaId, puntaje]) => ({
          area_id: Number(areaId),
          puntaje,
        })),
      })
      onFichaUpdate(data)
    } finally {
      setSavingWeek(null)
    }
  }

  if (!perfilCompleto || editandoPerfil) {
    return (
      <PerfilForm
        perfil={perfil}
        isEdit={perfilCompleto && editandoPerfil}
        onCancel={() => setEditandoPerfil(false)}
        onSaved={(data) => {
          onFichaUpdate(data)
          setEditandoPerfil(false)
        }}
      />
    )
  }

  return (
    <Box sx={{ mb: 5 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Tu ficha semanal</Typography>
          <Typography variant="body2" color="text.secondary">
            Misma semana que tu diario. Aquí miras con calma cómo has vivido la praxis y cómo te percibes.
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {semanal.semanas_completadas || 0} de {semanal.total_semanas || 0} semanas acompañadas en tu ficha
          </Typography>
        </Box>
        <Button variant="text" size="small" onClick={() => setEditandoPerfil(true)} sx={{ flexShrink: 0 }}>
          Editar mi información
        </Button>
      </Stack>

      {semanas.length === 0 ? (
        <EmptyState
          title="Aún no hay semanas en tu camino"
          description="Cuando el diario semanal esté configurado, aquí aparecerán las mismas semanas."
        />
      ) : (
        <Stack spacing={2}>
          {semanas.map((s) => {
            const locked = s.disponible === false
            const open = !locked && expanded === s.semana
            const esActual = s.semana === semanaActual
            const soloLectura = !esActual && s.guardada
            const lockLabel = s.dias_restantes === 1
              ? 'Disponible mañana'
              : s.dias_restantes > 1
                ? `Disponible en ${s.dias_restantes} días`
                : 'Próxima semana'
            const praxisMarcadas = (s.praxis || []).filter((p) => p.cumplido).length
            const areasConValor = (s.entradas || []).filter((e) => e.puntaje != null).length

            return (
              <Card
                key={s.semana}
                sx={{
                  border: `1px solid ${locked ? colors.border : s.guardada ? colors.moss + '55' : colors.border}`,
                  bgcolor: locked ? colors.light : s.guardada ? `${colors.moss}0D` : 'background.paper',
                  overflow: 'hidden',
                  opacity: locked ? 0.78 : 1,
                }}
              >
                <CardContent
                  sx={{ cursor: locked ? 'default' : 'pointer', pb: open ? 0 : 2 }}
                  onClick={() => abrirSemana(s)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="overline" color="text.secondary">
                        Semana {s.semana}
                        {esActual && !locked ? ' · Esta semana' : ''}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight={500}
                        sx={{ mt: 0.5, color: locked ? 'text.secondary' : 'text.primary' }}
                      >
                        {locked
                          ? 'Aún no disponible'
                          : s.guardada
                            ? 'Registro de tu camino'
                            : '¿Cómo has vivido esta semana?'}
                      </Typography>
                    </Box>
                    {locked ? (
                      <Chip
                        label={lockLabel}
                        size="small"
                        variant="outlined"
                        sx={{ flexShrink: 0, borderColor: colors.border, color: colors.muted }}
                      />
                    ) : s.guardada ? (
                      <Chip label="Registrada" size="small" color="success" variant="outlined" sx={{ flexShrink: 0 }} />
                    ) : null}
                  </Stack>
                  {!open && !locked && s.guardada && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      Praxis marcada: {praxisMarcadas} · Dimensiones percibidas: {areasConValor}
                    </Typography>
                  )}
                </CardContent>

                <Collapse in={open}>
                  <CardContent sx={{ pt: 0 }} onClick={(e) => e.stopPropagation()}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                      Praxis espiritual esta semana
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      Marca lo que sí viviste. Si esta semana fue distinta, está bien dejarlo en blanco.
                    </Typography>
                    <Stack sx={{ mb: 3 }}>
                      {(s.praxis || []).map((item) => (
                        <FormControlLabel
                          key={item.item_id}
                          control={(
                            <Checkbox
                              checked={Boolean(praxisDraft[item.item_id])}
                              disabled={soloLectura}
                              onChange={(e) => setPraxisDraft((d) => ({
                                ...d,
                                [item.item_id]: e.target.checked,
                              }))}
                            />
                          )}
                          label={item.nombre}
                        />
                      ))}
                    </Stack>

                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                      ¿Cómo te percibes esta semana?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Elige el número que mejor refleja cómo te sientes en cada dimensión. No hay respuesta correcta.
                    </Typography>

                    {groupByGrupo(s.entradas || []).map(([grupo, areas]) => (
                      <Box key={grupo} sx={{ mb: 3 }}>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          sx={{ display: 'block', mb: 1.5 }}
                        >
                          {grupo}
                        </Typography>
                        <Stack spacing={2.5}>
                          {areas.map((area) => {
                            const selected = puntajeDraft[area.area_id]
                            const nums = rangeNums(area.escala_min, area.escala_max)
                            return (
                              <Box key={area.area_id}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                  {area.nombre}
                                </Typography>
                                <Stack
                                  direction="row"
                                  flexWrap="wrap"
                                  sx={{ gap: 0.75 }}
                                >
                                  {nums.map((n) => {
                                    const active = Number(selected) === n
                                    return (
                                      <Button
                                        key={n}
                                        size="small"
                                        disabled={soloLectura}
                                        variant={active ? 'contained' : 'outlined'}
                                        onClick={() => setPuntajeDraft((d) => ({
                                          ...d,
                                          [area.area_id]: n,
                                        }))}
                                        sx={{
                                          minWidth: 40,
                                          px: 1.25,
                                          borderRadius: 2,
                                          ...(active
                                            ? {}
                                            : {
                                                borderColor: colors.border,
                                                color: colors.dark,
                                                bgcolor: colors.surface,
                                              }),
                                        }}
                                      >
                                        {n}
                                      </Button>
                                    )
                                  })}
                                </Stack>
                              </Box>
                            )
                          })}
                        </Stack>
                      </Box>
                    ))}

                    {soloLectura ? (
                      <Typography variant="body2" color="text.secondary">
                        Semana ya registrada. Puedes revisarla con calma.
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={savingWeek === s.semana}
                          onClick={() => guardarSemana(s)}
                          sx={{ minWidth: 168, px: 2.5 }}
                        >
                          {savingWeek === s.semana
                            ? 'Guardando…'
                            : s.guardada
                              ? 'Actualizar semana'
                              : 'Guardar semana'}
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Collapse>
              </Card>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}

export default function FichaPedagogica() {
  const [ficha, setFicha] = useState(null)
  const [modulos, setModulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [manualModulo, setManualModulo] = useState(null)
  const [expandedWeek, setExpandedWeek] = useState(null)
  const [tab, setTab] = useState(0)

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
        const firstOpen = (f.data.checklist || []).find((c) => c.disponible && !c.completada)
          || (f.data.checklist || []).find((c) => c.disponible)
        if (firstOpen) setExpandedWeek(firstOpen.pregunta_id)
      })

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const checklist = ficha?.checklist || []
  const completadas = checklist.filter((c) => c.completada).length
  const progreso = ficha?.progreso_general || 0
  const etapaActual = ficha?.modulo_actual

  const fichaProgresoLabel = useMemo(() => {
    const s = ficha?.ficha_semanal
    if (!s) return null
    return `${s.semanas_completadas || 0} de ${s.total_semanas || 0} semanas acompañadas en tu ficha`
  }, [ficha])

  const guardarEntrada = async (item) => {
    const nota = (drafts[item.pregunta_id] || '').trim()
    if (nota.length < 15) return
    if (item.disponible === false) return
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
        subtitle="Diario semanal, ficha pedagógica y etapas de formación"
      />

      {ficha?.sugerencia_avance?.mostrar_aviso_miembro && (
        <Card
          sx={{
            mb: 2,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.surface,
          }}
        >
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Has completado tu recorrido en esta etapa. Tu coordinador revisará tu
              camino y se pondrá en contacto contigo pronto.
            </Typography>
          </CardContent>
        </Card>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card sx={{ mb: 3, border: `1px solid ${colors.border}` }}>
          <CardContent>
            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                spacing={2}
                sx={{ width: '100%' }}
              >
                <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
                  <Typography variant="overline" color="text.secondary">Tu recorrido</Typography>
                  <Typography variant="h2" color="secondary.main" sx={{ fontWeight: 400 }}>{progreso}%</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {completadas} de {checklist.length} semanas escritas en tu diario
                  </Typography>
                  {fichaProgresoLabel && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {fichaProgresoLabel}
                    </Typography>
                  )}
                </Box>
                {ficha?.modulo_actual_detalle && (
                  <Box sx={{ ml: 'auto', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
                    <Chip
                      label={`Etapa actual: ${ficha.modulo_actual_detalle.nombre.replace(/^Etapa [IVX]+ — /, '')}`}
                      sx={{ bgcolor: `${ficha.modulo_actual_detalle.color}22`, borderColor: ficha.modulo_actual_detalle.color }}
                      variant="outlined"
                    />
                  </Box>
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

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Diario semanal" sx={{ fontSize: '1rem' }} />
        <Tab label="Ficha pedagógica" sx={{ fontSize: '1rem' }} />
        <Tab label="Mi progreso" sx={{ fontSize: '1rem' }} />
      </Tabs>

      {tab === 0 && (
        <DiarioTab
          checklist={checklist}
          drafts={drafts}
          setDrafts={setDrafts}
          expandedWeek={expandedWeek}
          setExpandedWeek={setExpandedWeek}
          saving={saving}
          guardarEntrada={guardarEntrada}
        />
      )}

      {tab === 1 && (
        <FichaTab
          ficha={ficha}
          onFichaUpdate={setFicha}
        />
      )}

      {tab === 2 && <MiProgresoTab ficha={ficha} />}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <BookOpen size={20} color={colors.primary} />
        <Typography variant="h3">Manuales por etapa</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Guías interactivas — no solo PDFs. Explora tips, reflexiones e imágenes de cada etapa.
      </Typography>

      <Stack spacing={2}>
        {modulos.map((mod) => {
          const desbloqueado = Boolean(mod.contenido_manual?.length)
          return (
            <Card
              key={mod.id}
              sx={{
                borderLeft: 4,
                borderColor: desbloqueado ? (mod.color || colors.primary) : colors.border,
                bgcolor: desbloqueado ? colors.surface : colors.light,
                opacity: desbloqueado ? 1 : 0.78,
              }}
            >
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  spacing={2}
                >
                  <Box sx={{ flex: 1, minWidth: 0, pr: { sm: 2 } }}>
                    <Typography variant="overline" sx={{ color: desbloqueado ? 'text.secondary' : colors.muted }}>
                      Etapa {mod.orden}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: desbloqueado ? colors.dark : colors.muted }}>
                      {mod.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{mod.descripcion}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                    <Button
                      variant={desbloqueado ? 'contained' : 'outlined'}
                      onClick={() => desbloqueado && setManualModulo(mod)}
                      disabled={!desbloqueado}
                      sx={{
                        minWidth: 168,
                        px: 2.5,
                        ...(desbloqueado ? {} : { borderColor: colors.border, color: colors.muted }),
                      }}
                    >
                      {desbloqueado ? 'Abrir manual' : 'Próximamente'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    </>
  )
}
