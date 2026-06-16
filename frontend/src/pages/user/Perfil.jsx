import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import FormField from '../../components/common/FormField'

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
      setMsg({ type: 'success', text: 'Tus datos se guardaron correctamente.' })
    } catch {
      setMsg({ type: 'error', text: 'No pudimos guardar tus datos. Inténtalo de nuevo en un momento.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Mi perfil" subtitle="Actualiza tu información personal" />
      {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}
      <Card sx={{ maxWidth: 560 }}>
        <CardContent component="form" onSubmit={handleSubmit}>
          <FormField label="Nombre">
            <TextField fullWidth value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} hiddenLabel />
          </FormField>
          <FormField label="Apellido">
            <TextField fullWidth value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} hiddenLabel />
          </FormField>
          <FormField label="Correo electrónico" helper="Usaremos este correo para comunicaciones importantes">
            <TextField type="email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} hiddenLabel />
          </FormField>
          <FormField label="Teléfono">
            <TextField fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} hiddenLabel placeholder="Opcional" />
          </FormField>
          <FormField label="Biografía" helper="Una breve presentación sobre ti y tu camino de fe">
            <TextField multiline rows={3} fullWidth value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} hiddenLabel />
          </FormField>
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 1 }}>
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
