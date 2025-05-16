"use client"

import { useState } from "react"
import { Search, Filter, Download, ChevronRight, Truck, Package, CheckCircle, XCircle } from "lucide-react"

// Dados simulados de pedidos
const ordersData = [
  {
    id: "12345",
    customer: {
      name: "Maria Silva",
      email: "maria.silva@example.com",
    },
    date: "2023-11-15",
    total: 2990.0,
    status: "delivered",
    items: [
      {
        id: 1,
        name: "Anel Solitário Ouro Amarelo",
        price: 2990.0,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    shipping: {
      address: "Av. Paulista, 1000, Apto 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      method: "Sedex",
      tracking: "BR123456789",
    },
    payment: {
      method: "Cartão de Crédito",
      card: "**** **** **** 1234",
      installments: 10,
    },
  },
  {
    id: "12289",
    customer: {
      name: "João Santos",
      email: "joao.santos@example.com",
    },
    date: "2023-11-10",
    total: 1590.0,
    status: "shipped",
    items: [
      {
        id: 2,
        name: "Brinco Argola Ouro Rosé",
        price: 1590.0,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    shipping: {
      address: "Rua Augusta, 500, Casa",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
      method: "PAC",
      tracking: "BR987654321",
    },
    payment: {
      method: "Boleto",
      reference: "34191.79001 01043.510047 91020.150008 9 87650000017990",
    },
  },
  {
    id: "12156",
    customer: {
      name: "Ana Oliveira",
      email: "ana.oliveira@example.com",
    },
    date: "2023-11-05",
    total: 3490.0,
    status: "processing",
    items: [
      {
        id: 4,
        name: "Pulseira Riviera Ouro Branco",
        price: 3490.0,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    shipping: {
      address: "Av. Rebouças, 3000, Apto 45",
      city: "São Paulo",
      state: "SP",
      zipCode: "05402-600",
      method: "Sedex",
    },
    payment: {
      method: "Cartão de Crédito",
      card: "**** **** **** 5678",
      installments: 5,
    },
  },
  {
    id: "12098",
    customer: {
      name: "Carlos Pereira",
      email: "carlos.pereira@example.com",
    },
    date: "2023-11-01",
    total: 890.0,
    status: "pending",
    items: [
      {
        id: 3,
        name: "Colar Pingente Coração Prata",
        price: 890.0,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    shipping: {
      address: "Rua Oscar Freire, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01426-001",
      method: "PAC",
    },
    payment: {
      method: "PIX",
      reference:
        "00020126580014BR.GOV.BCB.PIX0136a629532e-7693-4846-b028-f142a1dd1d5e5204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***6304E2CA",
    },
  },
  {
    id: "12045",
    customer: {
      name: "Fernanda Costa",
      email: "fernanda.costa@example.com",
    },
    date: "2023-10-28",
    total: 4290.0,
    status: "canceled",
    items: [
      {
        id: 5,
        name: "Anel Eternity",
        price: 4290.0,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    shipping: {
      address: "Av. Brigadeiro Faria Lima, 1500, Sala 101",
      city: "São Paulo",
      state: "SP",
      zipCode: "01452-001",
      method: "Sedex",
    },
    payment: {
      method: "Cartão de Crédito",
      card: "**** **** **** 9012",
      installments: 10,
    },
  },
]

export default function OrdersManager() {
  const [orders, setOrders] = useState(ordersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Filtrar pedidos com base na busca e no filtro de status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus }
        }
        return order
      }),
    )
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return { text: "Pendente", class: "bg-yellow-100 text-yellow-800", icon: Package }
      case "processing":
        return { text: "Em Processamento", class: "bg-blue-100 text-blue-800", icon: Package }
      case "shipped":
        return { text: "Enviado", class: "bg-purple-100 text-purple-800", icon: Truck }
      case "delivered":
        return { text: "Entregue", class: "bg-green-100 text-green-800", icon: CheckCircle }
      case "canceled":
        return { text: "Cancelado", class: "bg-red-100 text-red-800", icon: XCircle }
      default:
        return { text: status, class: "bg-gray-100 text-gray-800", icon: Package }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Gerenciar Pedidos</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 border rounded-md hover:bg-gray-100">
            <Download size={16} />
            <span className="text-sm">Exportar</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por pedido, cliente ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="processing">Em Processamento</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="canceled">Cancelado</option>
          </select>
        </div>
      </div>

      {showOrderDetails && selectedOrder ? (
        <OrderDetails
          order={selectedOrder}
          onBack={() => setShowOrderDetails(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 bg-white p-6 rounded-lg border">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const status = getStatusLabel(order.status)
              const StatusIcon = status.icon
              return (
                <div key={order.id} className="bg-white rounded-lg border overflow-hidden">
                  <div
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div>
                        <p className="font-medium">Pedido #{order.id}</p>
                        <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="flex items-center">
                        <StatusIcon
                          size={16}
                          className={`mr-1 ${status.class.replace("bg-", "text-").replace("-100", "-600")}`}
                        />
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <div className="mr-4">
                        <p className="text-sm text-gray-600">{order.customer.name}</p>
                        <p className="font-medium">R$ {order.total.toFixed(2).replace(".", ",")}</p>
                      </div>
                      <ChevronRight
                        size={20}
                        className={`transform transition-transform ${expandedOrder === order.id ? "rotate-90" : ""}`}
                      />
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="p-4 border-t bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h4 className="font-medium mb-1">Cliente</h4>
                          <p className="text-sm">{order.customer.name}</p>
                          <p className="text-sm text-gray-600">{order.customer.email}</p>
                        </div>
                        <div className="mt-3 md:mt-0">
                          <h4 className="font-medium mb-1">Pagamento</h4>
                          <p className="text-sm">{order.payment.method}</p>
                          {order.payment.card && (
                            <p className="text-sm text-gray-600">
                              {order.payment.card} - {order.payment.installments}x
                            </p>
                          )}
                        </div>
                        <div className="mt-3 md:mt-0">
                          <h4 className="font-medium mb-1">Envio</h4>
                          <p className="text-sm">{order.shipping.method}</p>
                          {order.shipping.tracking && (
                            <p className="text-sm text-gray-600">Rastreio: {order.shipping.tracking}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewOrder(order)
                          }}
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                        >
                          Ver Detalhes Completos
                        </button>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUpdateStatus(order.id, "processing")
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Processar
                            </button>
                          )}
                          {order.status === "processing" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUpdateStatus(order.id, "shipped")
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                            >
                              Marcar como Enviado
                            </button>
                          )}
                          {order.status === "shipped" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUpdateStatus(order.id, "delivered")
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Marcar como Entregue
                            </button>
                          )}
                          {(order.status === "pending" || order.status === "processing") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm("Tem certeza que deseja cancelar este pedido?")) {
                                  handleUpdateStatus(order.id, "canceled")
                                }
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Mostrando {filteredOrders.length} de {orders.length} pedidos
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-100">Anterior</button>
          <button className="px-3 py-1 bg-black text-white rounded">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">Próximo</button>
        </div>
      </div>
    </div>
  )
}

function OrderDetails({ order, onBack, onUpdateStatus }) {
  const status = getStatusLabel(order.status)
  const StatusIcon = status.icon

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 text-gray-500 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h3 className="text-xl font-medium">Pedido #{order.id}</h3>
        </div>
        <div className="flex items-center">
          <StatusIcon size={18} className={`mr-2 ${status.class.replace("bg-", "text-").replace("-100", "-600")}`} />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
            {status.text}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Informações do Cliente</h4>
          <p className="text-sm font-medium">{order.customer.name}</p>
          <p className="text-sm text-gray-600">{order.customer.email}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Informações de Pagamento</h4>
          <p className="text-sm font-medium">{order.payment.method}</p>
          {order.payment.card && (
            <p className="text-sm text-gray-600">
              {order.payment.card} - {order.payment.installments}x
            </p>
          )}
          {order.payment.reference && <p className="text-sm text-gray-600 truncate">Ref: {order.payment.reference}</p>}
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Informações de Envio</h4>
          <p className="text-sm font-medium">{order.shipping.method}</p>
          <p className="text-sm text-gray-600">
            {order.shipping.address}, {order.shipping.city}/{order.shipping.state}
          </p>
          <p className="text-sm text-gray-600">CEP: {order.shipping.zipCode}</p>
          {order.shipping.tracking && <p className="text-sm text-gray-600">Rastreio: {order.shipping.tracking}</p>}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-4">Itens do Pedido</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border">Produto</th>
                <th className="text-left p-3 border">Preço</th>
                <th className="text-left p-3 border">Quantidade</th>
                <th className="text-left p-3 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 border">
                    <div className="flex items-center">
                      <div className="w-12 h-12 relative flex-shrink-0 border rounded">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <span className="ml-3">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 border">R$ {item.price.toFixed(2).replace(".", ",")}</td>
                  <td className="p-3 border">{item.quantity}</td>
                  <td className="p-3 border">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan="3" className="p-3 border text-right font-medium">
                  Total
                </td>
                <td className="p-3 border font-medium">R$ {order.total.toFixed(2).replace(".", ",")}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-4">Histórico do Pedido</h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium">Pedido criado</p>
              <p className="text-sm text-gray-600">
                {new Date(order.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {order.status !== "pending" && (
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Pedido em processamento</p>
                <p className="text-sm text-gray-600">
                  {new Date(new Date(order.date).getTime() + 86400000).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}

          {(order.status === "shipped" || order.status === "delivered") && (
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Pedido enviado</p>
                <p className="text-sm text-gray-600">
                  {new Date(new Date(order.date).getTime() + 172800000).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {order.shipping.tracking && (
                  <p className="text-sm text-blue-600">Rastreio: {order.shipping.tracking}</p>
                )}
              </div>
            </div>
          )}

          {order.status === "delivered" && (
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Pedido entregue</p>
                <p className="text-sm text-gray-600">
                  {new Date(new Date(order.date).getTime() + 432000000).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}

          {order.status === "canceled" && (
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Pedido cancelado</p>
                <p className="text-sm text-gray-600">
                  {new Date(new Date(order.date).getTime() + 86400000).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          Voltar
        </button>
        <div className="flex gap-2">
          {order.status === "pending" && (
            <button
              onClick={() => onUpdateStatus(order.id, "processing")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Processar Pedido
            </button>
          )}
          {order.status === "processing" && (
            <button
              onClick={() => onUpdateStatus(order.id, "shipped")}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Marcar como Enviado
            </button>
          )}
          {order.status === "shipped" && (
            <button
              onClick={() => onUpdateStatus(order.id, "delivered")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Marcar como Entregue
            </button>
          )}
          {(order.status === "pending" || order.status === "processing") && (
            <button
              onClick={() => {
                if (window.confirm("Tem certeza que deseja cancelar este pedido?")) {
                  onUpdateStatus(order.id, "canceled")
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Cancelar Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function getStatusLabel(status) {
  switch (status) {
    case "pending":
      return { text: "Pendente", class: "bg-yellow-100 text-yellow-800", icon: Package }
    case "processing":
      return { text: "Em Processamento", class: "bg-blue-100 text-blue-800", icon: Package }
    case "shipped":
      return { text: "Enviado", class: "bg-purple-100 text-purple-800", icon: Truck }
    case "delivered":
      return { text: "Entregue", class: "bg-green-100 text-green-800", icon: CheckCircle }
    case "canceled":
      return { text: "Cancelado", class: "bg-red-100 text-red-800", icon: XCircle }
    default:
      return { text: status, class: "bg-gray-100 text-gray-800", icon: Package }
  }
}
