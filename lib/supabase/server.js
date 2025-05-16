// Cliente Supabase para uso no lado do servidor (Server Actions, API Routes)
import { createClient } from "@supabase/supabase-js"

// Cria um cliente Supabase com a chave de serviço para operações administrativas
export const createServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Cria um cliente Supabase com a chave anônima para operações públicas
export const createServerSupabaseClientAnon = () => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
}
