import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('shapebot_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Simular login - em produção, fazer chamada para API
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        plan: 'free',
        createdAt: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('shapebot_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (email, password, name) => {
    try {
      // Simular registro - em produção, fazer chamada para API
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        plan: 'free',
        createdAt: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('shapebot_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('shapebot_user')
    localStorage.removeItem('shapebot_onboarding')
    localStorage.removeItem('shapebot_chat_history')
  }

  const updateUserPlan = (plan) => {
    const updatedUser = { ...user, plan }
    setUser(updatedUser)
    localStorage.setItem('shapebot_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserPlan,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

