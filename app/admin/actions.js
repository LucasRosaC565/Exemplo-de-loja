"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Função para verificar se o usuário é administrador
async function isAdmin() {
  const supabase = createServerSupabaseClient()

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return false
  }

  // Verificar se o usuário é administrador
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

  return !!profile?.is_admin
}

// Função para criar um produto
export async function createProductAction(formData) {
  if (!(await isAdmin())) {
    return { error: "Não autorizado" }
  }

  try {
    const supabase = createServerSupabaseClient()

    // Extrair dados do formulário
    const name = formData.get("name")
    const description = formData.get("description")
    const price = Number.parseFloat(formData.get("price"))
    const discountPrice = formData.get("discountPrice") ? Number.parseFloat(formData.get("discountPrice")) : null
    const categorySlug = formData.get("category")
    const stock = Number.parseInt(formData.get("stock"))
    const featured = formData.get("featured") === "on"
    const images = JSON.parse(formData.get("images") || "[]")
    const specifications = JSON.parse(formData.get("specifications") || "[]")

    // Buscar o ID da categoria
    const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).single()

    if (!category) {
      return { error: "Categoria não encontrada" }
    }

    // Criar slug a partir do nome
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Inserir o produto
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        price,
        discount_price: discountPrice,
        category_id: category.id,
        featured,
        stock,
      })
      .select()
      .single()

    if (productError) {
      console.error("Erro ao criar produto:", productError)
      return { error: "Erro ao criar produto" }
    }

    // Inserir imagens
    if (images.length > 0) {
      const imagesToInsert = images.map((url, index) => ({
        product_id: product.id,
        url,
        display_order: index,
      }))

      const { error: imagesError } = await supabase.from("product_images").insert(imagesToInsert)

      if (imagesError) {
        console.error("Erro ao inserir imagens:", imagesError)
        return { error: "Erro ao inserir imagens" }
      }
    }

    // Inserir especificações
    if (specifications.length > 0) {
      const specsToInsert = specifications.map((spec) => ({
        product_id: product.id,
        name: spec.name,
        value: spec.value,
      }))

      const { error: specsError } = await supabase.from("product_specifications").insert(specsToInsert)

      if (specsError) {
        console.error("Erro ao inserir especificações:", specsError)
        return { error: "Erro ao inserir especificações" }
      }
    }

    // Revalidar a página de produtos
    revalidatePath("/admin")

    return { success: true, product }
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return { error: "Erro interno do servidor" }
  }
}

// Função para atualizar um produto
export async function updateProductAction(id, formData) {
  if (!(await isAdmin())) {
    return { error: "Não autorizado" }
  }

  try {
    const supabase = createServerSupabaseClient()

    // Extrair dados do formulário
    const name = formData.get("name")
    const description = formData.get("description")
    const price = Number.parseFloat(formData.get("price"))
    const discountPrice = formData.get("discountPrice") ? Number.parseFloat(formData.get("discountPrice")) : null
    const categorySlug = formData.get("category")
    const stock = Number.parseInt(formData.get("stock"))
    const featured = formData.get("featured") === "on"
    const images = JSON.parse(formData.get("images") || "[]")
    const specifications = JSON.parse(formData.get("specifications") || "[]")

    // Buscar o ID da categoria
    const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).single()

    if (!category) {
      return { error: "Categoria não encontrada" }
    }

    // Atualizar o produto
    const { error: productError } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        discount_price: discountPrice,
        category_id: category.id,
        featured,
        stock,
      })
      .eq("id", id)

    if (productError) {
      console.error("Erro ao atualizar produto:", productError)
      return { error: "Erro ao atualizar produto" }
    }

    // Atualizar imagens (remover todas e inserir novamente)
    // Remover imagens existentes
    const { error: deleteImagesError } = await supabase.from("product_images").delete().eq("product_id", id)

    if (deleteImagesError) {
      console.error("Erro ao remover imagens:", deleteImagesError)
      return { error: "Erro ao atualizar imagens" }
    }

    // Inserir novas imagens
    if (images.length > 0) {
      const imagesToInsert = images.map((url, index) => ({
        product_id: id,
        url,
        display_order: index,
      }))

      const { error: insertImagesError } = await supabase.from("product_images").insert(imagesToInsert)

      if (insertImagesError) {
        console.error("Erro ao inserir imagens:", insertImagesError)
        return { error: "Erro ao atualizar imagens" }
      }
    }

    // Atualizar especificações (remover todas e inserir novamente)
    // Remover especificações existentes
    const { error: deleteSpecsError } = await supabase.from("product_specifications").delete().eq("product_id", id)

    if (deleteSpecsError) {
      console.error("Erro ao remover especificações:", deleteSpecsError)
      return { error: "Erro ao atualizar especificações" }
    }

    // Inserir novas especificações
    if (specifications.length > 0) {
      const specsToInsert = specifications.map((spec) => ({
        product_id: id,
        name: spec.name,
        value: spec.value,
      }))

      const { error: insertSpecsError } = await supabase.from("product_specifications").insert(specsToInsert)

      if (insertSpecsError) {
        console.error("Erro ao inserir especificações:", insertSpecsError)
        return { error: "Erro ao atualizar especificações" }
      }
    }

    // Revalidar a página de produtos
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return { error: "Erro interno do servidor" }
  }
}

// Função para excluir um produto
export async function deleteProductAction(id) {
  if (!(await isAdmin())) {
    return { error: "Não autorizado" }
  }

  try {
    const supabase = createServerSupabaseClient()

    // As imagens e especificações serão excluídas automaticamente devido à restrição ON DELETE CASCADE
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir produto:", error)
      return { error: "Erro ao excluir produto" }
    }

    // Revalidar a página de produtos
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return { error: "Erro interno do servidor" }
  }
}

// Função para atualizar o status de um pedido
export async function updateOrderStatusAction(id, status) {
  if (!(await isAdmin())) {
    return { error: "Não autorizado" }
  }

  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("orders").update({ status }).eq("id", id)

    if (error) {
      console.error("Erro ao atualizar status do pedido:", error)
      return { error: "Erro ao atualizar status do pedido" }
    }

    // Revalidar a página de pedidos
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    return { error: "Erro interno do servidor" }
  }
}
