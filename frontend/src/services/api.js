import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh/', { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login/', { username, password }),
  register: (data) => api.post('/accounts/register/', data),
  me: () => api.get('/accounts/me/'),
  updateMe: (data) => api.patch('/accounts/me/', data),
}

export const pedagogiaAPI = {
  miFicha: () => api.get('/pedagogia/fichas/mi_ficha/'),
  fichas: () => api.get('/pedagogia/fichas/'),
  etapas: () => api.get('/pedagogia/etapas/'),
  avances: (fichaId) => api.get('/pedagogia/avances/', { params: { ficha: fichaId } }),
}

export const contentAPI = {
  list: (params) => api.get('/content/', { params }),
  videos: () => api.get('/content/videos/'),
  presentaciones: () => api.get('/content/presentaciones/'),
  categorias: () => api.get('/content/categorias/'),
  create: (data) => api.post('/content/', data),
  update: (id, data) => api.patch(`/content/${id}/`, data),
  delete: (id) => api.delete(`/content/${id}/`),
}

export const groupsAPI = {
  misGrupos: () => api.get('/groups/mis_grupos/'),
  list: () => api.get('/groups/'),
  esquemas: (grupoId) => api.get('/groups/esquemas/', { params: { grupo: grupoId } }),
  create: (data) => api.post('/groups/', data),
}

export const paymentsAPI = {
  planes: () => api.get('/payments/planes/'),
  suscripciones: () => api.get('/payments/suscripciones/'),
  miSuscripcion: () => api.get('/payments/suscripciones/mi_suscripcion/'),
  pagos: () => api.get('/payments/pagos/'),
  confirmarPago: (id) => api.post(`/payments/pagos/${id}/confirmar/`),
}

export const communicationsAPI = {
  anuncios: () => api.get('/communications/anuncios/'),
  mensajesRecibidos: () => api.get('/communications/mensajes/recibidos/'),
  mensajesEnviados: () => api.get('/communications/mensajes/enviados/'),
  enviarMensaje: (data) => api.post('/communications/mensajes/', data),
  noLeidos: () => api.get('/communications/mensajes/no_leidos/'),
  marcarLeido: (id) => api.post(`/communications/mensajes/${id}/marcar_leido/`),
}

export const adminAPI = {
  users: () => api.get('/accounts/users/'),
  createUser: (data) => api.post('/accounts/users/', data),
  updateUser: (id, data) => api.patch(`/accounts/users/${id}/`, data),
  toggleActive: (id) => api.post(`/accounts/users/${id}/toggle_active/`),
}

export default api
