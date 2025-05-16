import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Função para gerar um nome de arquivo único
function generateUniqueFileName(originalName) {
  const extension = originalName.split(".").pop()
  const randomName = Math.random().toString(36).substring(2, 15)
  return `${randomName}.${extension}`
}

// Rota para fazer upload de imagens
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

    // Processar o upload do arquivo
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Verificar se é uma imagem
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "O arquivo deve ser uma imagem" }, { status: 400 })
    }

    // Converter o arquivo para um buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Gerar um nome único para o arquivo
    const fileName = generateUniqueFileName(file.name)
    const filePath = `products/${fileName}`

    // Fazer upload para o bucket do Supabase
    const { data, error } = await supabase.storage.from("product-images").upload(filePath, buffer, {
      contentType: file.type,
    })

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 })
    }

    // Obter a URL pública da imagem
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Erro ao processar upload:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
