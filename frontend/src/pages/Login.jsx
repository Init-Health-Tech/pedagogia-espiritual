import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getHomeRoute } from '../utils/routes'
import MeshBackground from '../components/common/MeshBackground'
import TorLogo from '../components/common/TorLogo'
import FormField from '../components/common/FormField'
import { scaleIn } from '../animations/variants'
import { colors } from '../theme/muiTheme'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const userData = await login(username, password)
      navigate(getHomeRoute(userData))
    } catch (err) {
      if (!err.response) {
        setError('No pudimos conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.')
      } else {
        setError('El usuario o la contraseña no son correctos. Revísalos e inténtalo otra vez.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', py: 6, bgcolor: colors.light }}>
      <MeshBackground subtle />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper component={motion.div} initial="initial" animate="animate" variants={scaleIn} sx={{ p: { xs: 3, sm: 5 }, bgcolor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 4 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box textAlign="center">
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}><TorLogo size="lg" /></Box>
              <Typography variant="h2" sx={{ fontWeight: 300 }}>Iniciar sesión</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Accede a tu espacio de formación espiritual</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <FormField label="Usuario" helper="El nombre con el que te registraste">
              <TextField value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth autoFocus hiddenLabel placeholder="Tu usuario" />
            </FormField>
            <FormField label="Contraseña">
              <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth hiddenLabel placeholder="Tu contraseña" />
            </FormField>
            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </Button>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              ¿No tienes cuenta? <Link component={RouterLink} to="/registro" color="secondary">Regístrate aquí</Link>
            </Typography>
            <Typography variant="body1" textAlign="center">
              <Link component={RouterLink} to="/" color="text.secondary">Volver al sitio</Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
