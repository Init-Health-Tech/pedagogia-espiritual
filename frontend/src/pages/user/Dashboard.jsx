import { useCallback, useEffect, useState } from 'react'
import { pedagogiaAPI, communicationsAPI, groupsAPI, eventsAPI } from '../../services/api'
import LoadingScreen from '../../components/common/LoadingScreen'
import DashboardHome from './DashboardHome'

export default function Dashboard() {
  const [ficha, setFicha] = useState(null)
  const [anuncios, setAnuncios] = useState([])
  const [grupos, setGrupos] = useState([])
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  const loadEventos = useCallback(() =>
    eventsAPI.proximos()
      .then((res) => {
        const data = res.data.results || res.data
        setEventos(Array.isArray(data) ? data : [])
      })
      .catch(() => setEventos([])),
  [])

  useEffect(() => {
    Promise.all([
      pedagogiaAPI.miFicha().catch(() => null),
      communicationsAPI.anuncios().catch(() => ({ data: { results: [] } })),
      groupsAPI.misGrupos().catch(() => ({ data: [] })),
      loadEventos(),
    ]).then(([fichaRes, anunciosRes, gruposRes]) => {
      if (fichaRes) setFicha(fichaRes.data)
      const anunciosData = anunciosRes.data.results || anunciosRes.data
      setAnuncios(Array.isArray(anunciosData) ? anunciosData.slice(0, 4) : [])
      setGrupos(gruposRes.data.results || gruposRes.data || [])
    }).finally(() => setLoading(false))
  }, [loadEventos])

  if (loading) return <LoadingScreen rows={4} />

  return (
    <DashboardHome
      ficha={ficha}
      anuncios={anuncios}
      grupos={grupos}
      eventos={eventos}
      onEventosUpdated={loadEventos}
    />
  )
}
