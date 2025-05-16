"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import getSupabaseClient from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const message = searchParams.get("message")

  useEffect(() => {
    // Se já estiver logado, redirecionar
    if (user) {
      router.push(redirect)
    }
  }, [user, router, redirect])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Código de depuração
    console.log("Tentando fazer login com:", { email })
    
    try {
      const supabase = getSupabaseClient()
      
      // Teste direto da API do Supabase
      console.log("Testando login direto com Supabase...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log("Resultado do login direto:", { data, error })
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Se chegou aqui, o login direto funcionou
      console.log("Login direto bem-sucedido, tentando login via contexto...")
      
      // Agora tenta o login normal
      await login(email, password)
      router.push(redirect)
    } catch (error) {
      console.error("Erro detalhado:", error)
      setError(error.message || "Email ou senha inválidos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border">
        <h1 className="text-2xl font-serif text-center mb-6">Entrar</h1>

        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg">{message}</div>
        )}

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">Para fins de demonstração, use:</p>
          <p className="mt-1">
            <strong>Admin:</strong> admin@example.com / admin123
          </p>
          <p>
            <strong>Cliente:</strong> cliente@example.com / cliente123
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/cadastro" className="text-sm text-blue-600 hover:text-blue-800">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  )
}