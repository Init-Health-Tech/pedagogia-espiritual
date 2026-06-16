import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import api from '../services/api'
import MeshBackground from '../components/common/MeshBackground'
import TorLogo from '../components/common/TorLogo'
import FormField from '../components/common/FormField'
import { scaleIn } from '../animations/variants'
import { colors } from '../theme/muiTheme'

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password_confirm: '',
    first_name: '', last_name: '', phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/accounts/register/', form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'object' && data) {
        const mensajes = {
          username: 'Este nombre de usuario ya está en uso.',
          email: 'Este correo ya está registrado.',
          password: 'La contraseña no cumple los requisitos.',
          password_confirm: 'Las contraseñas no coinciden.',
        }
        const clave = Object.keys(data)[0]
        setError(mensajes[clave] || 'Revisa los datos e inténtalo de nuevo.')
      } else {
        setError('No pudimos completar el registro. Inténtalo más tarde.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', py: 6 }}>
      <MeshBackground subtle />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          component={motion.div}
          initial="initial"
          animate="animate"
          variants={scaleIn}
          sx={{ p: { xs: 3, sm: 5 }, bgcolor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 4 }}
        >
          <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
            <Box textAlign="center" sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <TorLogo size="lg" />
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 300 }}>Crear cuenta</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Únete al camino de formación espiritual</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}

            <FormField label="Nombre">
              <TextField name="first_name" value={form.first_name} onChange={handleChange} required fullWidth hiddenLabel placeholder="Tu nombre" />
            </FormField>
            <FormField label="Apellido">
              <TextField name="last_name" value={form.last_name} onChange={handleChange} required fullWidth hiddenLabel placeholder="Tu apellido" />
            </FormField>
            <FormField label="Usuario" helper="Será tu nombre para iniciar sesión">
              <TextField name="username" value={form.username} onChange={handleChange} required fullWidth hiddenLabel />
            </FormField>
            <FormField label="Correo electrónico">
              <TextField name="email" type="email" value={form.email} onChange={handleChange} required fullWidth hiddenLabel />
            </FormField>
            <FormField label="Teléfono (opcional)">
              <TextField name="phone" value={form.phone} onChange={handleChange} fullWidth hiddenLabel />
            </FormField>
            <FormField label="Contraseña" helper="Mínimo 8 caracteres">
              <TextField name="password" type="password" value={form.password} onChange={handleChange} required fullWidth hiddenLabel inputProps={{ minLength: 8 }} />
            </FormField>
            <FormField label="Confirmar contraseña">
              <TextField name="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} required fullWidth hiddenLabel />
            </FormField>

            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ mt: 1 }}>
              {loading ? 'Registrando…' : 'Crear cuenta'}
            </Button>
            <Typography variant="body1" textAlign="center">
              ¿Ya tienes cuenta? <Link component={RouterLink} to="/login">Inicia sesión</Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
