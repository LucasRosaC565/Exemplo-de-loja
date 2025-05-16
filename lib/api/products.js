import getSupabaseClient from "../supabase/client"
import { createServerSupabaseClient } from "../supabase/server"

// Função para obter produtos com filtros, paginação e ordenação
export async function getProducts(options = {}) {
  const supabase = getSupabaseClient()

  // Determinar se devemos incluir produtos excluídos
  const includeDeleted = options.includeDeleted === true

  // Escolher a tabela ou view apropriada
  const table = includeDeleted ? "all_products" : "products"

  let query = supabase.from(table).select(`
    *,
    category:categories(id, name, slug),
    images:product_images(id, url, display_order),
    specifications:product_specifications(id, name, value)
  `)

  // Se não estamos incluindo excluídos, garantir que deleted_at é nulo
  if (!includeDeleted) {
    query = query.is("deleted_at", null)
  }

  // Aplicar filtros
  if (options.category) {
    // Buscar pelo slug da categoria
    const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", options.category).single()

    if (categoryData) {
      query = query.eq("category_id", categoryData.id)
    }
  }

  if (options.featured !== undefined) {
    query = query.eq("featured", options.featured)
  }

  if (options.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }

  // Filtrar por status de exclusão
  if (options.onlyDeleted) {
    query = query.not("deleted_at", "is", null)
  }

  // Aplicar ordenação
  if (options.sort) {
    switch (options.sort) {
      case "price-asc":
        query = query.order("price", { ascending: true })
        break
      case "price-desc":
        query = query.order("price", { ascending: false })
        break
      case "name-asc":
        query = query.order("name", { ascending: true })
        break
      case "name-desc":
        query = query.order("name", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }
  } else {
    // Ordenação padrão: mais recentes primeiro
    query = query.order("created_at", { ascending: false })
  }

  // Aplicar paginação
  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.page && options.limit) {
    const offset = (options.page - 1) * options.limit
    query = query.range(offset, offset + options.limit - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Erro ao buscar produtos:", error)
    throw new Error("Erro ao buscar produtos")
  }

  // Formatar os dados para o formato esperado pela aplicação
  return data.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number.parseFloat(product.price),
    discountPrice: product.discount_price ? Number.parseFloat(product.discount_price) : null,
    category: product.category?.slug || "",
    featured: product.featured,
    stock: product.stock,
    isDeleted: product.deleted_at !== null,
    deletedAt: product.deleted_at,
    images: product.images.sort((a, b) => a.display_order - b.display_order).map((img) => img.url),
    specifications: product.specifications.map((spec) => ({
      name: spec.name,
      value: spec.value,
    })),
  }))
}

// Função para obter um produto pelo slug
export async function getProductBySlug(slug) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, display_order),
      specifications:product_specifications(id, name, value)
    `)
    .eq("slug", slug)
    .is("deleted_at", null)
    .single()

  if (error) {
    console.error("Erro ao buscar produto:", error)
    throw new Error("Produto não encontrado")
  }

  // Formatar o produto para o formato esperado pela aplicação
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: Number.parseFloat(data.price),
    discountPrice: data.discount_price ? Number.parseFloat(data.discount_price) : null,
    category: data.category?.slug || "",
    featured: data.featured,
    stock: data.stock,
    images: data.images.sort((a, b) => a.display_order - b.display_order).map((img) => img.url),
    specifications: data.specifications.map((spec) => ({
      name: spec.name,
      value: spec.value,
    })),
  }
}

// Função para criar um novo produto (lado do servidor)
export async function createProduct(productData) {
  const supabase = createServerSupabaseClient()

  // Criar slug a partir do nome
  const slug = productData.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")

  // Inserir o produto
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: productData.name,
      slug,
      description: productData.description,
      price: productData.price,
      discount_price: productData.discountPrice || null,
      category_id: productData.categoryId,
      featured: productData.featured || false,
      stock: productData.stock || 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar produto:", error)
    throw new Error("Erro ao criar produto")
  }

  // Registrar na auditoria
  await supabase.rpc("log_audit_event", {
    action: "create",
    table_name: "products",
    record_id: product.id,
    details: { product_name: product.name },
  })

  // Inserir imagens
  if (productData.images && productData.images.length > 0) {
    const imagesToInsert = productData.images.map((url, index) => ({
      product_id: product.id,
      url,
      display_order: index,
    }))

    const { error: imagesError } = await supabase.from("product_images").insert(imagesToInsert)

    if (imagesError) {
      console.error("Erro ao inserir imagens:", imagesError)
    }
  }

  // Inserir especificações
  if (productData.specifications && productData.specifications.length > 0) {
    const specsToInsert = productData.specifications.map((spec) => ({
      product_id: product.id,
      name: spec.name,
      value: spec.value,
    }))

    const { error: specsError } = await supabase.from("product_specifications").insert(specsToInsert)

    if (specsError) {
      console.error("Erro ao inserir especificações:", specsError)
    }
  }

  // Buscar o produto completo para retornar
  return getProductBySlug(slug)
}

// Função para atualizar um produto existente (lado do servidor)
export async function updateProduct(id, productData) {
  const supabase = createServerSupabaseClient()

  // Atualizar o produto
  const { error } = await supabase
    .from("products")
    .update({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      discount_price: productData.discountPrice || null,
      category_id: productData.categoryId,
      featured: productData.featured || false,
      stock: productData.stock || 0,
    })
    .eq("id", id)

  if (error) {
    console.error("Erro ao atualizar produto:", error)
    throw new Error("Erro ao atualizar produto")
  }

  // Registrar na auditoria
  await supabase.rpc("log_audit_event", {
    action: "update",
    table_name: "products",
    record_id: id,
    details: { product_name: productData.name },
  })

  // Atualizar imagens (remover todas e inserir novamente)
  if (productData.images) {
    // Remover imagens existentes
    const { error: deleteImagesError } = await supabase.from("product_images").delete().eq("product_id", id)

    if (deleteImagesError) {
      console.error("Erro ao remover imagens:", deleteImagesError)
    }

    // Inserir novas imagens
    if (productData.images.length > 0) {
      const imagesToInsert = productData.images.map((url, index) => ({
        product_id: id,
        url,
        display_order: index,
      }))

      const { error: insertImagesError } = await supabase.from("product_images").insert(imagesToInsert)

      if (insertImagesError) {
        console.error("Erro ao inserir imagens:", insertImagesError)
      }
    }
  }

  // Atualizar especificações (remover todas e inserir novamente)
  if (productData.specifications) {
    // Remover especificações existentes
    const { error: deleteSpecsError } = await supabase.from("product_specifications").delete().eq("product_id", id)

    if (deleteSpecsError) {
      console.error("Erro ao remover especificações:", deleteSpecsError)
    }

    // Inserir novas especificações
    if (productData.specifications.length > 0) {
      const specsToInsert = productData.specifications.map((spec) => ({
        product_id: id,
        name: spec.name,
        value: spec.value,
      }))

      const { error: insertSpecsError } = await supabase.from("product_specifications").insert(specsToInsert)

      if (insertSpecsError) {
        console.error("Erro ao inserir especificações:", insertSpecsError)
      }
    }
  }

  // Buscar o produto atualizado
  const { data: product } = await supabase.from("products").select("slug").eq("id", id).single()

  return getProductBySlug(product.slug)
}

// Função para excluir um produto (soft delete)
export async function deleteProduct(id) {
  const supabase = createServerSupabaseClient()

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é administrador
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

  if (!profile?.is_admin) {
    throw new Error("Acesso negado: apenas administradores podem excluir produtos")
  }

  // Obter o nome do produto para o log de auditoria
  const { data: product } = await supabase.from("products").select("name").eq("id", id).single()

  // Soft delete - atualizar o campo deleted_at
  const { error } = await supabase.from("products").update({ deleted_at: new Date().toISOString() }).eq("id", id)

  if (error) {
    console.error("Erro ao excluir produto:", error)
    throw new Error("Erro ao excluir produto")
  }

  // Registrar na auditoria
  await supabase.rpc("log_audit_event", {
    action: "delete",
    table_name: "products",
    record_id: id,
    details: { product_name: product.name },
  })

  return { success: true }
}

// Função para excluir produtos em lote (soft delete)
export async function deleteProductsBatch(ids) {
  const supabase = createServerSupabaseClient()

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é administrador
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

  if (!profile?.is_admin) {
    throw new Error("Acesso negado: apenas administradores podem excluir produtos")
  }

  // Obter os nomes dos produtos para o log de auditoria
  const { data: products } = await supabase.from("products").select("id, name").in("id", ids)

  // Soft delete - atualizar o campo deleted_at para todos os produtos
  const { error } = await supabase.from("products").update({ deleted_at: new Date().toISOString() }).in("id", ids)

  if (error) {
    console.error("Erro ao excluir produtos em lote:", error)
    throw new Error("Erro ao excluir produtos em lote")
  }

  // Registrar na auditoria para cada produto
  for (const product of products) {
    await supabase.rpc("log_audit_event", {
      action: "delete_batch",
      table_name: "products",
      record_id: product.id,
      details: { product_name: product.name },
    })
  }

  return { success: true, count: ids.length }
}

// Função para restaurar um produto
export async function restoreProduct(id) {
  const supabase = createServerSupabaseClient()

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é administrador
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

  if (!profile?.is_admin) {
    throw new Error("Acesso negado: apenas administradores podem restaurar produtos")
  }

  // Obter o nome do produto para o log de auditoria
  const { data: product } = await supabase.from("products").select("name").eq("id", id).single()

  // Restaurar o produto - definir deleted_at como null
  const { error } = await supabase.from("products").update({ deleted_at: null }).eq("id", id)

  if (error) {
    console.error("Erro ao restaurar produto:", error)
    throw new Error("Erro ao restaurar produto")
  }

  // Registrar na auditoria
  await supabase.rpc("log_audit_event", {
    action: "restore",
    table_name: "products",
    record_id: id,
    details: { product_name: product.name },
  })

  return { success: true }
}

// Função para restaurar produtos em lote
export async function restoreProductsBatch(ids) {
  const supabase = createServerSupabaseClient()

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é administrador
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

  if (!profile?.is_admin) {
    throw new Error("Acesso negado: apenas administradores podem restaurar produtos")
  }

  // Obter os nomes dos produtos para o log de auditoria
  const { data: products } = await supabase.from("products").select("id, name").in("id", ids)

  // Restaurar os produtos - definir deleted_at como null para todos
  const { error } = await supabase.from("products").update({ deleted_at: null }).in("id", ids)

  if (error) {
    console.error("Erro ao restaurar produtos em lote:", error)
    throw new Error("Erro ao restaurar produtos em lote")
  }

  // Registrar na auditoria para cada produto
  for (const product of products) {
    await supabase.rpc("log_audit_event", {
      action: "restore_batch",
      table_name: "products",
      record_id: product.id,
      details: { product_name: product.name },
    })
  }

  return { success: true, count: ids.length }
}

// Função para obter logs de auditoria
export async function getAuditLogs(options = {}) {
  const supabase = createServerSupabaseClient()

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é administrador
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

  if (!profile?.is_admin) {
    throw new Error("Acesso negado: apenas administradores podem ver logs de auditoria")
  }

  let query = supabase
    .from("audit_logs")
    .select(`
      *,
      user:user_profiles(id, full_name)
    `)
    .order("created_at", { ascending: false })

  // Filtrar por tabela
  if (options.table) {
    query = query.eq("table_name", options.table)
  }

  // Filtrar por ação
  if (options.action) {
    query = query.eq("action", options.action)
  }

  // Filtrar por ID de registro
  if (options.recordId) {
    query = query.eq("record_id", options.recordId)
  }

  // Aplicar paginação
  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.page && options.limit) {
    const offset = (options.page - 1) * options.limit
    query = query.range(offset, offset + options.limit - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Erro ao buscar logs de auditoria:", error)
    throw new Error("Erro ao buscar logs de auditoria")
  }

  return data
}

// Função para fazer upload de imagem para o Storage do Supabase
export async function uploadProductImage(file) {
  const supabase = getSupabaseClient()

  // Gerar um nome único para o arquivo
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `products/${fileName}`

  // Fazer upload do arquivo
  const { data, error } = await supabase.storage.from("product-images").upload(filePath, file)

  if (error) {
    console.error("Erro ao fazer upload da imagem:", error)
    throw new Error("Erro ao fazer upload da imagem")
  }

  // Obter a URL pública da imagem
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath)

  return publicUrl
}
