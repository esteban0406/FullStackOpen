// src/contexts/AuthProvider.js
import { useState, useEffect } from 'react'
import AuthContext from '../contexts/AuthContext'
import AuthStorage from './authStorage'

const authStorage = new AuthStorage()

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkLogin = async () => {
    const token = await authStorage.getAccessToken()
    setIsLoggedIn(!!token)
  }

  useEffect(() => {
    checkLogin()
  }, [])

  const login = async (token) => {
    await authStorage.setAccessToken(token)
    setIsLoggedIn(true)
  }

  const logout = async () => {
    await authStorage.removeAccessToken()
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
