import getSupabaseClient from "../supabase/client"
import { createServerSupabaseClient } from "../supabase/server"

// Função para obter todas as categorias
export async function getCategories() {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    throw new Error("Erro ao buscar categorias")
  }

  return data.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }))
}

// Função para criar uma nova categoria (admin)
export async function createCategory(categoryData) {
  const supabase = createServerSupabaseClient()

  // Criar slug a partir do nome
  const slug = categoryData.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: categoryData.name,
      slug,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar categoria:", error)
    throw new Error("Erro ao criar categoria")
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
  }
}

// Função para atualizar uma categoria (admin)
export async function updateCategory(id, categoryData) {
  const supabase = createServerSupabaseClient()

  // Criar slug a partir do nome
  const slug = categoryData.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: categoryData.name,
      slug,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar categoria:", error)
    throw new Error("Erro ao atualizar categoria")
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
  }
}

// Função para excluir uma categoria (admin)
export async function deleteCategory(id) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir categoria:", error)
    throw new Error("Erro ao excluir categoria")
  }

  return { success: true }
}
