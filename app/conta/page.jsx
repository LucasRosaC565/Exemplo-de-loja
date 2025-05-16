"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Package, Heart, CreditCard, LogOut, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/conta")
    }
  }, [isAuthenticated, router])

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif mb-8">Minha Conta</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={32} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center justify-between w-full p-3 rounded-lg ${
                  activeTab === "profile" ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <User size={18} className="mr-3" />
                  <span>Meus Dados</span>
                </div>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center justify-between w-full p-3 rounded-lg ${
                  activeTab === "orders" ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <Package size={18} className="mr-3" />
                  <span>Meus Pedidos</span>
                </div>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`flex items-center justify-between w-full p-3 rounded-lg ${
                  activeTab === "wishlist" ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <Heart size={18} className="mr-3" />
                  <span>Lista de Desejos</span>
                </div>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`flex items-center justify-between w-full p-3 rounded-lg ${
                  activeTab === "payment" ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <CreditCard size={18} className="mr-3" />
                  <span>Formas de Pagamento</span>
                </div>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full p-3 rounded-lg text-red-600 hover:bg-red-50"
              >
                <div className="flex items-center">
                  <LogOut size={18} className="mr-3" />
                  <span>Sair</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-medium mb-6">Meus Dados</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sobrenome</label>
                      <input
                        type="text"
                        defaultValue="Sobrenome"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Telefone</label>
                    <input
                      type="tel"
                      defaultValue="(11) 98765-4321"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="pt-4 border-t mt-6">
                    <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Senha Atual</label>
                        <input
                          type="password"
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nova Senha</label>
                        <input
                          type="password"
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Confirmar Nova Senha</label>
                        <input
                          type="password"
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t mt-6">
                    <h3 className="text-lg font-medium mb-4">Endereço de Entrega</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Rua</label>
                          <input
                            type="text"
                            defaultValue="Av. Paulista"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Número</label>
                          <input
                            type="text"
                            defaultValue="1000"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Complemento</label>
                        <input
                          type="text"
                          defaultValue="Apto 123"
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">CEP</label>
                          <input
                            type="text"
                            defaultValue="01310-100"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Cidade</label>
                          <input
                            type="text"
                            defaultValue="São Paulo"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Estado</label>
                          <input
                            type="text"
                            defaultValue="SP"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "orders" && <CustomerOrders />}

            {activeTab === "wishlist" && (
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-medium mb-6">Lista de Desejos</h2>
                <div className="text-center py-8">
                  <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Sua lista de desejos está vazia.</p>
                  <Link
                    href="/produtos"
                    className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Explorar Produtos
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-medium mb-6">Formas de Pagamento</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Cartões Salvos</h3>
                    <div className="border rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                            <span className="text-xs font-medium">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">Cartão de Crédito</p>
                            <p className="text-sm text-gray-600">**** **** **** 1234</p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-800 text-sm">Remover</button>
                      </div>
                    </div>

                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Adicionar Novo Cartão
                    </button>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Métodos de Pagamento Aceitos</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">VISA</span>
                      </div>
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">MASTER</span>
                      </div>
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">AMEX</span>
                      </div>
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">ELO</span>
                      </div>
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">PIX</span>
                      </div>
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">BOLETO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomerOrders() {
  // Dados simulados de pedidos
  const orders = [
    {
      id: "12345",
      date: "2023-11-15",
      status: "delivered",
      total: 2990.0,
      items: [
        {
          id: 1,
          name: "Anel Solitário Ouro Amarelo",
          price: 2990.0,
          quantity: 1,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
    {
      id: "12289",
      date: "2023-10-02",
      status: "delivered",
      total: 1590.0,
      items: [
        {
          id: 2,
          name: "Brinco Argola Ouro Rosé",
          price: 1590.0,
          quantity: 1,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
    {
      id: "12156",
      date: "2023-09-18",
      status: "delivered",
      total: 3490.0,
      items: [
        {
          id: 4,
          name: "Pulseira Riviera Ouro Branco",
          price: 3490.0,
          quantity: 1,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
  ]

  const [expandedOrder, setExpandedOrder] = useState(null)

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return { text: "Pendente", class: "bg-yellow-100 text-yellow-800" }
      case "processing":
        return { text: "Em Processamento", class: "bg-blue-100 text-blue-800" }
      case "shipped":
        return { text: "Enviado", class: "bg-purple-100 text-purple-800" }
      case "delivered":
        return { text: "Entregue", class: "bg-green-100 text-green-800" }
      case "canceled":
        return { text: "Cancelado", class: "bg-red-100 text-red-800" }
      default:
        return { text: status, class: "bg-gray-100 text-gray-800" }
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-medium mb-6">Meus Pedidos</h2>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Você ainda não realizou nenhum pedido.</p>
          <Link
            href="/produtos"
            className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Começar a Comprar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusLabel(order.status)
            return (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div>
                      <p className="font-medium">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}
                    >
                      {status.text}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <p className="font-medium mr-4">R$ {order.total.toFixed(2).replace(".", ",")}</p>
                    <ChevronRight
                      size={20}
                      className={`transform transition-transform ${expandedOrder === order.id ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="p-4 border-t bg-gray-50">
                    <h4 className="font-medium mb-3">Itens do Pedido</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="w-16 h-16 relative flex-shrink-0 border rounded">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity} | R$ {item.price.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Endereço de Entrega</h4>
                        <p className="text-sm text-gray-600">
                          Av. Paulista, 1000, Apto 123
                          <br />
                          São Paulo, SP - CEP 01310-100
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Método de Pagamento</h4>
                        <p className="text-sm text-gray-600">Cartão de Crédito (final 1234)</p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 border border-black rounded hover:bg-gray-100 transition-colors">
                        Rastrear Pedido
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
