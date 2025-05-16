import getSupabaseClient from "../supabase/client"
import { createServerSupabaseClient } from "../supabase/server"

// Função para criar um novo pedido
export async function createOrder(orderData) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  // Iniciar uma transação (simulada com várias operações)

  // 1. Criar o pedido
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total: orderData.total,
      shipping_fee: orderData.shippingFee || 0,
      address_id: orderData.addressId,
      payment_method: orderData.paymentMethod,
      payment_details: orderData.paymentDetails || {},
      notes: orderData.notes || null,
    })
    .select()
    .single()

  if (orderError) {
    console.error("Erro ao criar pedido:", orderError)
    throw new Error("Erro ao criar pedido")
  }

  // 2. Inserir os itens do pedido
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    quantity: item.quantity,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Erro ao inserir itens do pedido:", itemsError)
    throw new Error("Erro ao inserir itens do pedido")
  }

  // 3. Atualizar o estoque dos produtos
  for (const item of orderData.items) {
    const { error: updateError } = await supabase.rpc("decrease_product_stock", {
      product_id: item.id,
      quantity: item.quantity,
    })

    if (updateError) {
      console.error(`Erro ao atualizar estoque do produto ${item.id}:`, updateError)
    }
  }

  return {
    id: order.id,
    status: order.status,
    total: order.total,
    createdAt: order.created_at,
  }
}

// Função para obter os pedidos do usuário atual
export async function getUserOrders() {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  // Buscar os pedidos do usuário
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (ordersError) {
    console.error("Erro ao buscar pedidos:", ordersError)
    throw new Error("Erro ao buscar pedidos")
  }

  // Formatar os pedidos para o formato esperado pela aplicação
  return orders.map((order) => ({
    id: order.id,
    date: order.created_at,
    status: order.status,
    total: Number.parseFloat(order.total),
    items: order.items.map((item) => ({
      id: item.product_id,
      name: item.product_name,
      price: Number.parseFloat(item.price),
      quantity: item.quantity,
    })),
  }))
}

// Função para obter um pedido específico
export async function getOrderById(orderId) {
  const supabase = getSupabaseClient()

  // Obter o usuário atual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Usuário não autenticado")
  }

  // Buscar o pedido
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*),
      address:addresses(*)
    `)
    .eq("id", orderId)
    .single()

  if (orderError) {
    console.error("Erro ao buscar pedido:", orderError)
    throw new Error("Pedido não encontrado")
  }

  // Verificar se o pedido pertence ao usuário atual ou se é um administrador
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()

  if (order.user_id !== user.id && !profile?.is_admin) {
    throw new Error("Acesso negado")
  }

  // Formatar o pedido para o formato esperado pela aplicação
  return {
    id: order.id,
    date: order.created_at,
    status: order.status,
    total: Number.parseFloat(order.total),
    shippingFee: Number.parseFloat(order.shipping_fee),
    paymentMethod: order.payment_method,
    paymentDetails: order.payment_details,
    trackingCode: order.tracking_code,
    notes: order.notes,
    address: order.address
      ? {
          recipient: order.address.recipient,
          street: order.address.street,
          number: order.address.number,
          complement: order.address.complement,
          neighborhood: order.address.neighborhood,
          city: order.address.city,
          state: order.address.state,
          postalCode: order.address.postal_code,
        }
      : null,
    items: order.items.map((item) => ({
      id: item.product_id,
      name: item.product_name,
      price: Number.parseFloat(item.price),
      quantity: item.quantity,
    })),
  }
}

// Função para atualizar o status de um pedido (admin)
export async function updateOrderStatus(orderId, status) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

  if (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    throw new Error("Erro ao atualizar status do pedido")
  }

  return { success: true }
}

// Função para obter todos os pedidos (admin)
export async function getAllOrders(options = {}) {
  const supabase = createServerSupabaseClient()

  let query = supabase.from("orders").select(`
      *,
      user:user_profiles!user_id(full_name),
      items:order_items(*)
    `)

  // Aplicar filtros
  if (options.status) {
    query = query.eq("status", options.status)
  }

  if (options.search) {
    query = query.or(`id.ilike.%${options.search}%,user.full_name.ilike.%${options.search}%`)
  }

  // Aplicar ordenação
  if (options.sort) {
    const [field, direction] = options.sort.split("-")
    query = query.order(field, { ascending: direction === "asc" })
  } else {
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
    console.error("Erro ao buscar pedidos:", error)
    throw new Error("Erro ao buscar pedidos")
  }

  // Formatar os pedidos para o formato esperado pela aplicação
  return data.map((order) => ({
    id: order.id,
    customer: {
      name: order.user?.full_name || "Cliente",
      email: order.user_id, // Idealmente, buscaríamos o email do usuário
    },
    date: order.created_at,
    status: order.status,
    total: Number.parseFloat(order.total),
    items: order.items.map((item) => ({
      id: item.product_id,
      name: item.product_name,
      price: Number.parseFloat(item.price),
      quantity: item.quantity,
    })),
  }))
}
