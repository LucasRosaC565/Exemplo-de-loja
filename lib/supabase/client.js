// Cliente Supabase para uso no lado do cliente (componentes com 'use client')
import { createClient } from "@supabase/supabase-js"

// Cria uma única instância do cliente Supabase para uso em toda a aplicação
let supabaseClient

const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Variáveis de ambiente do Supabase não configuradas corretamente")
      throw new Error("Configuração do Supabase incompleta")
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  }
  return supabaseClient
}

export default getSupabaseClient