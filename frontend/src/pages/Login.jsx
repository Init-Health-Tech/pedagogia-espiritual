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
import { useAuth } from '../context/AuthContext'
import MeshBackground from '../components/common/MeshBackground'
import { fadeInUp, scaleIn } from '../animations/variants'

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
      navigate(userData.role === 'admin' ? '/admin' : '/app')
    } catch (err) {
      if (!err.response) {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.')
      } else {
        setError(err.response?.data?.detail || 'Credenciales incorrectas.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        py: 4,
      }}
    >
      <MeshBackground subtle />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          component={motion.div}
          initial="initial"
          animate="animate"
          variants={scaleIn}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            p: { xs: 3, sm: 4 },
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(255,255,255,0.92)',
          }}
          elevation={0}
        >
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box component={motion.div} variants={fadeInUp} textAlign="center">
              <Typography variant="overline" color="text.secondary">
                Movimiento Franciscano
              </Typography>
              <Typography variant="h1" sx={{ mt: 0.5 }}>
                Iniciar sesión
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Pedagogía Espiritual de la Santísima Trinidad
              </Typography>
            </Box>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <Alert severity="error">{error}</Alert>
              </motion.div>
            )}
            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                className="btn-glow"
              >
                {loading ? 'Ingresando…' : 'Ingresar'}
              </Button>
            </motion.div>
            <Typography variant="body2" textAlign="center" color="text.secondary">
              ¿No tienes cuenta?{' '}
              <Link component={RouterLink} to="/registro">
                Regístrate
              </Link>
            </Typography>
            <Typography variant="body2" textAlign="center">
              <Link component={RouterLink} to="/" color="text.secondary">
                Volver al inicio
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
