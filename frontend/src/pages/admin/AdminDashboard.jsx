import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import { adminAPI, contentAPI, paymentsAPI, pedagogiaAPI } from '../../services/api'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import LoadingScreen from '../../components/common/LoadingScreen'
import { staggerContainer, staggerItem } from '../../animations/variants'

const sections = [
  { to: '/admin/usuarios', title: 'Usuarios y accesos', description: 'Gestión de miembros, roles y permisos de la plataforma', icon: PeopleOutlinedIcon },
  { to: '/admin/modulos', title: 'Módulos (manuales)', description: 'Manuales formativos del camino pedagógico', icon: LibraryBooksOutlinedIcon },
  { to: '/admin/preguntas', title: 'Checklist de la ficha', description: 'Diez preguntas de reflexión y seguimiento espiritual', icon: ChecklistOutlinedIcon },
  { to: '/admin/contenidos', title: 'Contenidos', description: 'Videos, documentos, presentaciones y esquemas', icon: VideoLibraryOutlinedIcon },
  { to: '/admin/pagos', title: 'Pagos y suscripciones', description: 'Planes, pagos pendientes y membresías activas', icon: PaymentsOutlinedIcon },
  { to: '/admin/grupos', title: 'Grupos de pastoreo', description: 'Comunidades de formación y coordinación', icon: GroupsOutlinedIcon },
  { to: '/admin/anuncios', title: 'Anuncios', description: 'Comunicación institucional interna', icon: CampaignOutlinedIcon },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, contenidos: 0, pagos: 0, modulos: 0, preguntas: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminAPI.users(),
      contentAPI.list(),
      paymentsAPI.pagos(),
      pedagogiaAPI.modulos(),
      pedagogiaAPI.preguntas(),
    ]).then(([u, c, p, m, pr]) => {
      setStats({
        users: (u.data.results || u.data).length,
        contenidos: (c.data.results || c.data).length,
        pagos: (p.data.results || p.data).length,
        modulos: (m.data.results || m.data).length,
        preguntas: (pr.data.results || pr.data).length,
      })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <>
      <PageHeader
        title="Panel de administración"
        subtitle="Gestión académica y operativa de la plataforma MFST"
      />

      <Box component={motion.div} variants={staggerContainer} initial="initial" animate="animate">
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Usuarios', value: stats.users },
            { label: 'Módulos', value: stats.modulos },
            { label: 'Preguntas checklist', value: stats.preguntas },
            { label: 'Contenidos', value: stats.contenidos },
            { label: 'Pagos', value: stats.pagos },
          ].map((s) => (
            <Grid key={s.label} size={{ xs: 6, sm: 4, md: 2.4 }}>
              <StatCard label={s.label} value={s.value} />
            </Grid>
          ))}
        </Grid>

        <motion.div variants={staggerItem}>
          <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 2 }}>
            Módulos de gestión
          </Typography>
        </motion.div>

        <Grid container spacing={2}>
          {sections.map(({ to, title, description, icon: Icon }) => (
            <Grid key={to} size={{ xs: 12, sm: 6, lg: 4 }}>
              <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      borderColor: 'secondary.light',
                      boxShadow: '0 12px 40px rgba(26,35,50,0.1)',
                    },
                  }}
                >
                  <CardActionArea component={RouterLink} to={to} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          color: 'primary.main',
                        }}
                      >
                        <Icon fontSize="small" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {title}
                      </Typography>
                      <Typography variant="body2">{description}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
}
