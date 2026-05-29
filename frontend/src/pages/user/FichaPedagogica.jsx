import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import AnimatedProgress from '../../components/common/AnimatedProgress'
import { staggerContainer, staggerItem } from '../../animations/variants'

export default function FichaPedagogica() {
  const [ficha, setFicha] = useState(null)
  const [modulos, setModulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)

  const load = () =>
    Promise.all([pedagogiaAPI.miFicha(), pedagogiaAPI.modulos()])
      .then(([f, m]) => {
        setFicha(f.data)
        setModulos(m.data.results || m.data)
      })

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const checklist = ficha?.checklist || []
  const completadas = checklist.filter((c) => c.completada).length
  const progreso = ficha?.progreso_general || 0

  const togglePregunta = async (item) => {
    setSaving(item.pregunta_id)
    try {
      const { data } = await pedagogiaAPI.responderChecklist({
        pregunta_id: item.pregunta_id,
        completada: !item.completada,
        nota: item.nota || '',
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
        title="Ficha pedagógica"
        subtitle="Checklist de reflexión y módulos formativos (manuales)"
      />

      <Box component={motion.div} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Avance global
              </Typography>
              <Typography variant="h2" color="secondary.main">
                {progreso}%
              </Typography>
            </Box>
            {ficha?.modulo_actual_detalle && (
              <Chip
                label={`Módulo: ${ficha.modulo_actual_detalle.nombre}`}
                variant="outlined"
                color="primary"
                sx={{ maxWidth: '100%' }}
              />
            )}
          </Stack>
          <AnimatedProgress value={progreso} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {completadas} de {checklist.length} preguntas completadas
          </Typography>
        </CardContent>
      </Card>
      </Box>

      <Typography variant="h3" sx={{ mb: 0.5 }}>
        Checklist de reflexión
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Marca cada pregunta al completar tu reflexión. El progreso se actualiza automáticamente.
      </Typography>

      {checklist.length === 0 ? (
        <EmptyState
          title="Checklist no configurado"
          description="El administrador debe definir las diez preguntas desde el panel de administración."
        />
      ) : (
        <Stack component={motion.div} variants={staggerContainer} initial="initial" animate="animate" spacing={1.5} sx={{ mb: 4 }}>
          <AnimatePresence mode="popLayout">
          {checklist.map((item) => (
            <motion.div
              key={item.pregunta_id}
              layout
              variants={staggerItem}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.008 }}
              transition={{ layout: { duration: 0.3 } }}
            >
            <Card
              sx={{
                borderColor: item.completada ? 'success.light' : 'divider',
                bgcolor: item.completada ? '#E8F2ED' : 'background.paper',
              }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.completada}
                      disabled={saving === item.pregunta_id}
                      onChange={() => togglePregunta(item)}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="overline" color="text.secondary" display="block">
                        Pregunta {item.orden}
                        {item.modulo_nombre && ` · ${item.modulo_nombre}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          textDecoration: item.completada ? 'line-through' : 'none',
                          color: item.completada ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {item.texto}
                      </Typography>
                      {item.ayuda && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          {item.ayuda}
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', m: 0, width: '100%' }}
                />
              </CardContent>
            </Card>
            </motion.div>
          ))}
          </AnimatePresence>
        </Stack>
      )}

      <Typography variant="h3" sx={{ mb: 0.5 }}>
        Módulos formativos
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Manuales del camino pedagógico organizados por etapa
      </Typography>

      <Grid container spacing={2} component={motion.div} variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
        {modulos.map((mod) => (
          <Grid key={mod.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <motion.div variants={staggerItem} whileHover={{ y: -4, transition: { duration: 0.25 } }}>
            <Card
              sx={{
                height: '100%',
                borderTop: 3,
                borderColor: mod.color || 'secondary.main',
                ...(ficha?.modulo_actual === mod.id && {
                  boxShadow: 2,
                  borderColor: mod.color,
                }),
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Módulo {mod.orden}
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {mod.nombre}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  {mod.descripcion}
                </Typography>
                {mod.manual_url && (
                  <Link href={mod.manual_url} target="_blank" rel="noreferrer" variant="body2">
                    Consultar manual
                  </Link>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
