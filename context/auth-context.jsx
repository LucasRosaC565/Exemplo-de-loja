"use client"

import { createContext, useContext, useState, useEffect } from "react"
import getSupabaseClient from "@/lib/supabase/client"
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "@/lib/api/auth"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  // Verificar se o usuário está logado quando o componente montar
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Erro ao verificar usuário:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session)
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error("Erro ao obter usuário após login:", error)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    checkUser()

    // Limpar subscription quando o componente desmontar
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    try {
      const userData = await apiLogin(email, password)
      setUser(userData)
      return userData
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
      setUser(null)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}