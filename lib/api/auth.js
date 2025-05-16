import getSupabaseClient from "../supabase/client"

// Função para registrar um novo usuário
export async function registerUser(email, password, userData) {
  const supabase = getSupabaseClient()

  // Registrar o usuário no Auth do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: userData.name,
      },
    },
  })

  if (authError) {
    console.error("Erro ao registrar usuário:", authError)
    throw new Error(authError.message)
  }

  // Criar o perfil do usuário
  if (authData.user) {
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: authData.user.id,
      full_name: userData.name,
      phone: userData.phone || null,
      is_admin: false,
    })

    if (profileError) {
      console.error("Erro ao criar perfil do usuário:", profileError)
    }
  }

  return {
    id: authData.user.id,
    email: authData.user.email,
    name: userData.name,
    isAdmin: false,
  }
}

export async function login(email, password) {
  const supabase = getSupabaseClient()

  try {
    // Fazer login no Auth do Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erro ao fazer login:", error)
      throw new Error(error.message || "Credenciais inválidas")
    }

    if (!data.user) {
      throw new Error("Usuário não encontrado")
    }

    // Buscar o perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Erro ao buscar perfil do usuário:", profileError)
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name: profile?.full_name || data.user.user_metadata?.full_name || "Usuário",
      isAdmin: profile?.is_admin || false,
    }
  } catch (error) {
    console.error("Erro no processo de login:", error)
    throw error
  }
}

// Função para fazer logout
export async function logout() {
  const supabase = getSupabaseClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Erro ao fazer logout:", error)
    throw new Error("Erro ao fazer logout")
  }

  return { success: true }
}

// Função para obter o usuário atual
export async function getCurrentUser() {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      return null
    }

    // Buscar o perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Erro ao buscar perfil do usuário:", profileError)
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name: profile?.full_name || data.user.user_metadata?.full_name || "Usuário",
      isAdmin: profile?.is_admin || false,
    }
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error)
    return null
  }
}

// Função para atualizar o perfil do usuário
export async function updateUserProfile(userData) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  // Atualizar os metadados do usuário
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      full_name: userData.name,
    },
  })

  if (updateError) {
    console.error("Erro ao atualizar metadados do usuário:", updateError)
  }

  // Atualizar o perfil do usuário
  const { error: profileError } = await supabase
    .from("user_profiles")
    .update({
      full_name: userData.name,
      phone: userData.phone || null,
    })
    .eq("id", user.id)

  if (profileError) {
    console.error("Erro ao atualizar perfil do usuário:", profileError)
    throw new Error("Erro ao atualizar perfil")
  }

  return {
    id: user.id,
    email: user.email,
    name: userData.name,
    phone: userData.phone,
  }
}
