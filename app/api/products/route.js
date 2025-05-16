import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createProduct } from "@/lib/api/products"

// Rota para criar um novo produto
export async function POST(request) {
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

    // Criar o produto
    const product = await createProduct({
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
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: error.message || "Erro ao criar produto" }, { status: 500 })
  }
}
