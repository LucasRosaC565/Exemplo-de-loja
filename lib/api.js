// Simulação de uma API para produtos
// Em um ambiente real, isso seria substituído por chamadas a um backend

// Banco de dados simulado
const productsDB = [
  {
    id: 1,
    name: "Anel Solitário Ouro Amarelo",
    slug: "anel-solitario-ouro-amarelo",
    description: "Anel solitário em ouro amarelo 18k com diamante central de 20 pontos.",
    price: 3990.0,
    discountPrice: null,
    category: "aneis",
    featured: true,
    stock: 15,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    specifications: [
      { name: "Material", value: "Ouro Amarelo 18k" },
      { name: "Pedra", value: "Diamante" },
      { name: "Quilate", value: "20 pontos" },
    ],
  },
  {
    id: 2,
    name: "Brinco Argola Ouro Rosé",
    slug: "brinco-argola-ouro-rose",
    description: "Brinco argola em ouro rosé 18k com acabamento polido.",
    price: 2490.0,
    discountPrice: 1990.0,
    category: "brincos",
    featured: true,
    stock: 8,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    specifications: [
      { name: "Material", value: "Ouro Rosé 18k" },
      { name: "Diâmetro", value: "2.5cm" },
    ],
  },
  {
    id: 3,
    name: "Colar Pingente Coração Prata",
    slug: "colar-pingente-coracao-prata",
    description: "Colar com pingente de coração em prata 925 com zircônias.",
    price: 890.0,
    discountPrice: null,
    category: "colares",
    featured: true,
    stock: 20,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    specifications: [
      { name: "Material", value: "Prata 925" },
      { name: "Comprimento", value: "45cm" },
      { name: "Pedras", value: "Zircônias" },
    ],
  },
  {
    id: 4,
    name: "Pulseira Riviera Ouro Branco",
    slug: "pulseira-riviera-ouro-branco",
    description: "Pulseira riviera em ouro branco 18k com diamantes.",
    price: 7990.0,
    discountPrice: null,
    category: "pulseiras",
    featured: true,
    stock: 5,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    specifications: [
      { name: "Material", value: "Ouro Branco 18k" },
      { name: "Pedras", value: "Diamantes" },
      { name: "Comprimento", value: "18cm" },
    ],
  },
  {
    id: 5,
    name: "Relógio Feminino Dourado",
    slug: "relogio-feminino-dourado",
    description: "Relógio feminino com caixa em aço dourado e pulseira em couro.",
    price: 1290.0,
    discountPrice: 990.0,
    category: "relogios",
    featured: true,
    stock: 12,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    specifications: [
      { name: "Material", value: "Aço Dourado" },
      { name: "Pulseira", value: "Couro" },
      { name: "Diâmetro", value: "32mm" },
    ],
  },
  {
    id: 6,
    name: "Aliança de Casamento Ouro",
    slug: "alianca-casamento-ouro",
    description: "Par de alianças de casamento em ouro amarelo 18k.",
    price: 2990.0,
    discountPrice: null,
    category: "aneis",
    featured: true,
    stock: 10,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    specifications: [
      { name: "Material", value: "Ouro Amarelo 18k" },
      { name: "Largura", value: "4mm" },
    ],
  },
  {
    id: 7,
    name: "Brinco Gota Esmeralda",
    slug: "brinco-gota-esmeralda",
    description: "Brinco em formato de gota com esmeralda e diamantes.",
    price: 4590.0,
    discountPrice: null,
    category: "brincos",
    featured: true,
    stock: 6,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    specifications: [
      { name: "Material", value: "Ouro Branco 18k" },
      { name: "Pedra Principal", value: "Esmeralda" },
      { name: "Pedras Secundárias", value: "Diamantes" },
    ],
  },
  {
    id: 8,
    name: "Pulseira Pandora Prata",
    slug: "pulseira-pandora-prata",
    description: "Pulseira estilo Pandora em prata 925 com berloques.",
    price: 790.0,
    discountPrice: 690.0,
    category: "pulseiras",
    featured: true,
    stock: 15,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    specifications: [
      { name: "Material", value: "Prata 925" },
      { name: "Comprimento", value: "19cm" },
      { name: "Berloques", value: "3 inclusos" },
    ],
  },
]

// Usuários simulados
const usersDB = [
  {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    password: "admin123", // Em um ambiente real, isso seria um hash
    isAdmin: true,
  },
  {
    id: 2,
    name: "Cliente Teste",
    email: "cliente@example.com",
    password: "cliente123", // Em um ambiente real, isso seria um hash
    isAdmin: false,
  },
]

// Funções da API

// Produtos
export async function getProducts(options = {}) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredProducts = [...productsDB]

  // Filtrar por categoria
  if (options.category) {
    filteredProducts = filteredProducts.filter((p) => p.category === options.category)
  }

  // Filtrar por destaque
  if (options.featured !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.featured === options.featured)
  }

  // Filtrar por busca
  if (options.search) {
    const searchLower = options.search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (p) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
    )
  }

  // Ordenar
  if (options.sort) {
    switch (options.sort) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
    }
  }

  // Limitar resultados
  if (options.limit) {
    filteredProducts = filteredProducts.slice(0, options.limit)
  }

  return filteredProducts
}

export async function getProductBySlug(slug) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  const product = productsDB.find((p) => p.slug === slug)

  if (!product) {
    throw new Error("Produto não encontrado")
  }

  return product
}

export async function createProduct(productData) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Gerar ID
  const newId = Math.max(...productsDB.map((p) => p.id)) + 1

  // Criar slug a partir do nome
  const slug = productData.name
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")

  const newProduct = {
    id: newId,
    slug,
    ...productData,
    // Garantir que as imagens sejam um array
    images: productData.images || ["/placeholder.svg?height=400&width=400"],
  }

  // Adicionar ao "banco de dados"
  productsDB.push(newProduct)

  return newProduct
}

export async function updateProduct(id, productData) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = productsDB.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error("Produto não encontrado")
  }

  // Atualizar o produto
  productsDB[index] = {
    ...productsDB[index],
    ...productData,
  }

  return productsDB[index]
}

export async function deleteProduct(id) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = productsDB.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error("Produto não encontrado")
  }

  // Remover o produto
  productsDB.splice(index, 1)

  return { success: true }
}

// Autenticação
export async function login(email, password) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  const user = usersDB.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Credenciais inválidas")
  }

  // Não retornar a senha
  const { password: _, ...userWithoutPassword } = user

  return userWithoutPassword
}

// Pedidos (simulação básica)
export async function createOrder(orderData) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Aqui você implementaria a lógica para criar um pedido
  // e atualizar o estoque dos produtos

  return {
    id: Math.floor(Math.random() * 10000),
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
}
