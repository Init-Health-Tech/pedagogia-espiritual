import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { authAPI, pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import FormField from '../../components/common/FormField'
import { colors } from '../../theme/muiTheme'

const EMPTY = '—'

function ProfileSummaryRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', py: 0.75 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: '0.04em', minWidth: 140 }}>
        {label}:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {value || EMPTY}
      </Typography>
    </Box>
  )
}

export default function Perfil() {
  const { user, fetchUser } = useAuth()
  const [procesoFe, setProcesoFe] = useState('')
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    pedagogiaAPI.miFicha()
      .then((r) => setProcesoFe(r.data?.modulo_actual_detalle?.nombre || ''))
      .catch(() => setProcesoFe(''))
  }, [])

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

  const nombre = user?.full_name
    || `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
    || user?.username
    || ''

  return (
    <>
      <PageHeader title="Mi perfil" />
      <Card sx={{ maxWidth: 560, mb: 2, border: `1px solid ${colors.border}` }}>
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <ProfileSummaryRow label="NOMBRE" value={nombre} />
          <ProfileSummaryRow label="EDAD" value="" />
          <ProfileSummaryRow label="ESTADO CIVIL" value="" />
          <ProfileSummaryRow label="PROCESO DE FE" value={procesoFe} />
        </CardContent>
      </Card>
      <Typography variant="body2" sx={{ mb: { xs: 2.5, md: 3 }, maxWidth: 560 }}>
        Actualiza tu información personal
      </Typography>
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
