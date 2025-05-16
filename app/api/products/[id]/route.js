import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { updateProduct, deleteProduct } from "@/lib/api/products"

// Rota para atualizar um produto
export async function PUT(request, { params }) {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar se o usuário está autenticado e é admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Processar o formulário
    const formData = await request.formData()

    // Extrair dados do formulário
    const name = formData.get("name")
    const description = formData.get("description")
    const price = Number.parseFloat(formData.get("price"))
    const discountPrice = formData.get("discountPrice") ? Number.parseFloat(formData.get("discountPrice")) : null
    const categoryId = formData.get("categoryId")
    const stock = Number.parseInt(formData.get("stock"))
    const featured = formData.get("featured") === "true"
    const images = JSON.parse(formData.get("images") || "[]")
    const specifications = JSON.parse(formData.get("specifications") || "[]")

    // Atualizar o produto
    const product = await updateProduct(params.id, {
      name,
      description,
      price,
      discountPrice,
      categoryId,
      featured,
      stock,
      images,
      specifications,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return NextResponse.json({ error: error.message || "Erro ao atualizar produto" }, { status: 500 })
  }
}

// Rota para excluir um produto
export async function DELETE(request, { params }) {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar se o usuário está autenticado e é admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Excluir o produto
    await deleteProduct(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return NextResponse.json({ error: error.message || "Erro ao excluir produto" }, { status: 500 })
  }
}
