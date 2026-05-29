import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Grid, TextField } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'

export default function Perfil() {
  const { user, fetchUser } = useAuth()
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.updateMe(form)
      await fetchUser()
      setMsg({ type: 'success', text: 'Perfil actualizado correctamente.' })
    } catch {
      setMsg({ type: 'error', text: 'Error al actualizar el perfil.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Mi perfil" subtitle="Datos personales de tu cuenta" />
      {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}
      <Card sx={{ maxWidth: 560 }}>
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Nombre" fullWidth value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Apellido" fullWidth value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </Grid>
            <Grid size={12}>
              <TextField label="Correo" type="email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Grid>
            <Grid size={12}>
              <TextField label="Teléfono" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Grid>
            <Grid size={12}>
              <TextField label="Biografía" multiline rows={3} fullWidth value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
