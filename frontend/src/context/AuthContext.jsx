import { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await authAPI.me()
      setUser(data)
    } catch {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (username, password) => {
    const { data: tokens } = await authAPI.login(username, password)
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    const { data: userData } = await authAPI.me()
    setUser(userData)
    setLoading(false)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin' || user?.is_superuser
  const isCoordinator = user?.role === 'coordinator'
  const isFormador = isAdmin || isCoordinator || user?.role === 'moderator'
  const isModerator = isFormador

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, fetchUser,
      isAdmin, isCoordinator, isFormador, isModerator,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
