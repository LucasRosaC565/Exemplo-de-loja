import getSupabaseClient from "../supabase/client"

// Função para obter a lista de desejos do usuário atual
export async function getWishlist() {
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
    .from("wishlist_items")
    .select(`
      *,
      product:products(
        id, name, slug, price, discount_price,
        images:product_images(url, display_order)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar lista de desejos:", error)
    throw new Error("Erro ao buscar lista de desejos")
  }

  return data.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    price: Number.parseFloat(item.product.price),
    discountPrice: item.product.discount_price ? Number.parseFloat(item.product.discount_price) : null,
    image: item.product.images.sort((a, b) => a.display_order - b.display_order)[0]?.url || null,
  }))
}

// Função para adicionar um produto à lista de desejos
export async function addToWishlist(productId) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  const { error } = await supabase.from("wishlist_items").insert({
    user_id: user.id,
    product_id: productId,
  })

  if (error) {
    // Se o erro for de violação de unicidade, o produto já está na lista
    if (error.code === "23505") {
      return { success: true, message: "Produto já está na lista de desejos" }
    }

    console.error("Erro ao adicionar à lista de desejos:", error)
    throw new Error("Erro ao adicionar à lista de desejos")
  }

  return { success: true }
}

// Função para remover um produto da lista de desejos
export async function removeFromWishlist(productId) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", productId)

  if (error) {
    console.error("Erro ao remover da lista de desejos:", error)
    throw new Error("Erro ao remover da lista de desejos")
  }

  return { success: true }
}

// Função para verificar se um produto está na lista de desejos
export async function isInWishlist(productId) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return false
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // Não encontrado
      return false
    }

    console.error("Erro ao verificar lista de desejos:", error)
    return false
  }

  return !!data
}
