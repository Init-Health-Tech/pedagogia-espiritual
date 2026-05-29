import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import api from '../services/api'
import MeshBackground from '../components/common/MeshBackground'
import { scaleIn } from '../animations/variants'

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
      if (typeof data === 'object') {
        setError(Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' · '))
      } else {
        setError('Error al registrar. Verifique los datos.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', py: 4 }}>
      <MeshBackground subtle />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          component={motion.div}
          initial="initial"
          animate="animate"
          variants={scaleIn}
          sx={{ p: { xs: 3, sm: 4 }, bgcolor: 'rgba(255,255,255,0.92)' }}
        >
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box textAlign="center">
              <Typography variant="h1">Crear cuenta</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Únete al camino de formación espiritual
              </Typography>
            </Box>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert severity="error">{error}</Alert>
              </motion.div>
            )}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Nombre" name="first_name" value={form.first_name} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Apellido" name="last_name" value={form.last_name} onChange={handleChange} required fullWidth />
              </Grid>
            </Grid>
            <TextField label="Usuario" name="username" value={form.username} onChange={handleChange} required fullWidth />
            <TextField label="Correo" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
            <TextField label="Teléfono" name="phone" value={form.phone} onChange={handleChange} fullWidth />
            <TextField label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth inputProps={{ minLength: 8 }} />
            <TextField label="Confirmar contraseña" name="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} required fullWidth />
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} className="btn-glow">
                {loading ? 'Registrando…' : 'Crear cuenta'}
              </Button>
            </motion.div>
            <Typography variant="body2" textAlign="center">
              ¿Ya tienes cuenta? <Link component={RouterLink} to="/login">Inicia sesión</Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
