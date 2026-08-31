import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { getHomeRoute } from '../utils/routes'
import MeshBackground from '../components/common/MeshBackground'
import TorLogo from '../components/common/TorLogo'
import FormField from '../components/common/FormField'
import { scaleIn } from '../animations/variants'
import { colors } from '../theme/muiTheme'

export default function CambiarContrasena() {
  const { user, fetchUser, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.new_password !== form.new_password_confirm) {
      setError('Las contraseñas nuevas no coinciden.')
      return
    }
    if (form.new_password.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    setSaving(true)
    try {
      await authAPI.changePassword(form)
      const updated = await fetchUser()
      navigate(getHomeRoute(updated || user), { replace: true })
    } catch (err) {
      const data = err.response?.data
      const msg = data?.current_password?.[0]
        || data?.new_password_confirm?.[0]
        || data?.new_password?.[0]
        || data?.detail
        || 'No se pudo actualizar la contraseña.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', py: 6, bgcolor: colors.light }}>
      <MeshBackground subtle />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          component={motion.div}
          initial="initial"
          animate="animate"
          variants={scaleIn}
          sx={{ p: { xs: 3, sm: 5 }, bgcolor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 4 }}
        >
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box textAlign="center">
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}><TorLogo size="lg" /></Box>
              <Typography variant="h2" sx={{ fontWeight: 300 }}>Cambia tu contraseña</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Por seguridad, debes definir una contraseña nueva antes de continuar.
              </Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <FormField label="Contraseña temporal" required>
              <TextField
                type="password"
                value={form.current_password}
                onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                required
                fullWidth
                hiddenLabel
                autoFocus
              />
            </FormField>
            <FormField label="Nueva contraseña" required helper="Mínimo 8 caracteres">
              <TextField
                type="password"
                value={form.new_password}
                onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                required
                fullWidth
                hiddenLabel
              />
            </FormField>
            <FormField label="Confirmar nueva contraseña" required>
              <TextField
                type="password"
                value={form.new_password_confirm}
                onChange={(e) => setForm({ ...form, new_password_confirm: e.target.value })}
                required
                fullWidth
                hiddenLabel
              />
            </FormField>
            <Button type="submit" variant="contained" size="large" fullWidth disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar y continuar'}
            </Button>
            <Button variant="text" color="inherit" onClick={logout}>
              Cerrar sesión
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
