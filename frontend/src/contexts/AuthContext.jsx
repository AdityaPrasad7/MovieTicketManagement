import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import config from '../config'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkAuthStatus()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.get(`${config.apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setUser(response.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${config.apiUrl}/api/auth/login`, {
        email,
        password
      })

      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${config.apiUrl}/api/auth/register`, userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(`${config.apiUrl}/api/auth/admin/login`, {
        email,
        password
      })

      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Admin login failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    adminLogin,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 