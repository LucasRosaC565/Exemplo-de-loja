import getSupabaseClient from "../supabase/client"

// Função para obter os endereços do usuário atual
export async function getUserAddresses() {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar endereços:", error)
    throw new Error("Erro ao buscar endereços")
  }

  return data.map((address) => ({
    id: address.id,
    name: address.name,
    recipient: address.recipient,
    street: address.street,
    number: address.number,
    complement: address.complement,
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    postalCode: address.postal_code,
    isDefault: address.is_default,
  }))
}

// Função para criar um novo endereço
export async function createAddress(addressData) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  // Se for o endereço padrão, remover o padrão dos outros endereços
  if (addressData.isDefault) {
    const { error: updateError } = await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)

    if (updateError) {
      console.error("Erro ao atualizar endereços padrão:", updateError)
    }
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      name: addressData.name,
      recipient: addressData.recipient,
      street: addressData.street,
      number: addressData.number,
      complement: addressData.complement || null,
      neighborhood: addressData.neighborhood || null,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.postalCode,
      is_default: addressData.isDefault || false,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar endereço:", error)
    throw new Error("Erro ao criar endereço")
  }

  return {
    id: data.id,
    name: data.name,
    recipient: data.recipient,
    street: data.street,
    number: data.number,
    complement: data.complement,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    postalCode: data.postal_code,
    isDefault: data.is_default,
  }
}

// Função para atualizar um endereço
export async function updateAddress(id, addressData) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  // Se for o endereço padrão, remover o padrão dos outros endereços
  if (addressData.isDefault) {
    const { error: updateError } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .neq("id", id)

    if (updateError) {
      console.error("Erro ao atualizar endereços padrão:", updateError)
    }
  }

  const { data, error } = await supabase
    .from("addresses")
    .update({
      name: addressData.name,
      recipient: addressData.recipient,
      street: addressData.street,
      number: addressData.number,
      complement: addressData.complement || null,
      neighborhood: addressData.neighborhood || null,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.postalCode,
      is_default: addressData.isDefault || false,
    })
    .eq("id", id)
    .eq("user_id", user.id) // Garantir que o endereço pertence ao usuário
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar endereço:", error)
    throw new Error("Erro ao atualizar endereço")
  }

  return {
    id: data.id,
    name: data.name,
    recipient: data.recipient,
    street: data.street,
    number: data.number,
    complement: data.complement,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    postalCode: data.postal_code,
    isDefault: data.is_default,
  }
}

// Função para excluir um endereço
export async function deleteAddress(id) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id) // Garantir que o endereço pertence ao usuário

  if (error) {
    console.error("Erro ao excluir endereço:", error)
    throw new Error("Erro ao excluir endereço")
  }

  return { success: true }
}
