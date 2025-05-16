import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Rota para popular o banco de dados com dados iniciais
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

    // Inserir categorias
    const categories = [
      { name: "Anéis", slug: "aneis" },
      { name: "Brincos", slug: "brincos" },
      { name: "Colares", slug: "colares" },
      { name: "Pulseiras", slug: "pulseiras" },
      { name: "Relógios", slug: "relogios" },
    ]

    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .upsert(categories, { onConflict: "slug" })
      .select()

    if (categoriesError) {
      console.error("Erro ao inserir categorias:", categoriesError)
      return NextResponse.json({ error: "Erro ao inserir categorias" }, { status: 500 })
    }

    // Mapear IDs das categorias
    const categoryMap = {}
    categoriesData.forEach((category) => {
      categoryMap[category.slug] = category.id
    })

    // Inserir produtos
    const products = [
      {
        name: "Anel Solitário Ouro Amarelo",
        slug: "anel-solitario-ouro-amarelo",
        description: "Anel solitário em ouro amarelo 18k com diamante central de 20 pontos.",
        price: 3990.0,
        discount_price: null,
        category_id: categoryMap["aneis"],
        featured: true,
        stock: 15,
      },
      {
        name: "Brinco Argola Ouro Rosé",
        slug: "brinco-argola-ouro-rose",
        description: "Brinco argola em ouro rosé 18k com acabamento polido.",
        price: 2490.0,
        discount_price: 1990.0,
        category_id: categoryMap["brincos"],
        featured: true,
        stock: 8,
      },
      {
        name: "Colar Pingente Coração Prata",
        slug: "colar-pingente-coracao-prata",
        description: "Colar com pingente de coração em prata 925 com zircônias.",
        price: 890.0,
        discount_price: null,
        category_id: categoryMap["colares"],
        featured: true,
        stock: 20,
      },
      {
        name: "Pulseira Riviera Ouro Branco",
        slug: "pulseira-riviera-ouro-branco",
        description: "Pulseira riviera em ouro branco 18k com diamantes.",
        price: 7990.0,
        discount_price: null,
        category_id: categoryMap["pulseiras"],
        featured: true,
        stock: 5,
      },
      {
        name: "Relógio Feminino Dourado",
        slug: "relogio-feminino-dourado",
        description: "Relógio feminino com caixa em aço dourado e pulseira em couro.",
        price: 1290.0,
        discount_price: 990.0,
        category_id: categoryMap["relogios"],
        featured: true,
        stock: 12,
      },
    ]

    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .upsert(products, { onConflict: "slug" })
      .select()

    if (productsError) {
      console.error("Erro ao inserir produtos:", productsError)
      return NextResponse.json({ error: "Erro ao inserir produtos" }, { status: 500 })
    }

    // Mapear IDs dos produtos
    const productMap = {}
    productsData.forEach((product) => {
      productMap[product.slug] = product.id
    })

    // Inserir imagens dos produtos
    const productImages = [
      {
        product_id: productMap["anel-solitario-ouro-amarelo"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 0,
      },
      {
        product_id: productMap["anel-solitario-ouro-amarelo"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 1,
      },
      {
        product_id: productMap["brinco-argola-ouro-rose"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 0,
      },
      {
        product_id: productMap["brinco-argola-ouro-rose"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 1,
      },
      {
        product_id: productMap["colar-pingente-coracao-prata"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 0,
      },
      {
        product_id: productMap["colar-pingente-coracao-prata"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 1,
      },
      {
        product_id: productMap["pulseira-riviera-ouro-branco"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 0,
      },
      {
        product_id: productMap["pulseira-riviera-ouro-branco"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 1,
      },
      {
        product_id: productMap["relogio-feminino-dourado"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 0,
      },
      {
        product_id: productMap["relogio-feminino-dourado"],
        url: "/placeholder.svg?height=400&width=400",
        display_order: 1,
      },
    ]

    // Limpar imagens existentes
    for (const productId of Object.values(productMap)) {
      await supabase.from("product_images").delete().eq("product_id", productId)
    }

    const { error: imagesError } = await supabase.from("product_images").insert(productImages)

    if (imagesError) {
      console.error("Erro ao inserir imagens:", imagesError)
      return NextResponse.json({ error: "Erro ao inserir imagens" }, { status: 500 })
    }

    // Inserir especificações dos produtos
    const productSpecifications = [
      {
        product_id: productMap["anel-solitario-ouro-amarelo"],
        name: "Material",
        value: "Ouro Amarelo 18k",
      },
      {
        product_id: productMap["anel-solitario-ouro-amarelo"],
        name: "Pedra",
        value: "Diamante",
      },
      {
        product_id: productMap["anel-solitario-ouro-amarelo"],
        name: "Quilate",
        value: "20 pontos",
      },
      {
        product_id: productMap["brinco-argola-ouro-rose"],
        name: "Material",
        value: "Ouro Rosé 18k",
      },
      {
        product_id: productMap["brinco-argola-ouro-rose"],
        name: "Diâmetro",
        value: "2.5cm",
      },
      {
        product_id: productMap["colar-pingente-coracao-prata"],
        name: "Material",
        value: "Prata 925",
      },
      {
        product_id: productMap["colar-pingente-coracao-prata"],
        name: "Comprimento",
        value: "45cm",
      },
      {
        product_id: productMap["colar-pingente-coracao-prata"],
        name: "Pedras",
        value: "Zircônias",
      },
      {
        product_id: productMap["pulseira-riviera-ouro-branco"],
        name: "Material",
        value: "Ouro Branco 18k",
      },
      {
        product_id: productMap["pulseira-riviera-ouro-branco"],
        name: "Pedras",
        value: "Diamantes",
      },
      {
        product_id: productMap["pulseira-riviera-ouro-branco"],
        name: "Comprimento",
        value: "18cm",
      },
      {
        product_id: productMap["relogio-feminino-dourado"],
        name: "Material",
        value: "Aço Dourado",
      },
      {
        product_id: productMap["relogio-feminino-dourado"],
        name: "Pulseira",
        value: "Couro",
      },
      {
        product_id: productMap["relogio-feminino-dourado"],
        name: "Diâmetro",
        value: "32mm",
      },
    ]

    // Limpar especificações existentes
    for (const productId of Object.values(productMap)) {
      await supabase.from("product_specifications").delete().eq("product_id", productId)
    }

    const { error: specificationsError } = await supabase.from("product_specifications").insert(productSpecifications)

    if (specificationsError) {
      console.error("Erro ao inserir especificações:", specificationsError)
      return NextResponse.json({ error: "Erro ao inserir especificações" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Dados iniciais inseridos com sucesso",
      data: {
        categories: categoriesData.length,
        products: productsData.length,
        images: productImages.length,
        specifications: productSpecifications.length,
      },
    })
  } catch (error) {
    console.error("Erro ao popular banco de dados:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
