"use client"

import { useState } from "react"
import { Search, Mail, Phone, Edit, Trash2, Filter, Download } from "lucide-react"

// Dados simulados de clientes
const customersData = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria.silva@example.com",
    phone: "(11) 98765-4321",
    totalOrders: 8,
    totalSpent: 12450.9,
    lastOrder: "2023-10-15",
    status: "active",
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao.santos@example.com",
    phone: "(21) 99876-5432",
    totalOrders: 5,
    totalSpent: 7890.5,
    lastOrder: "2023-11-02",
    status: "active",
  },
  {
    id: 3,
    name: "Ana Oliveira",
    email: "ana.oliveira@example.com",
    phone: "(31) 97654-3210",
    totalOrders: 12,
    totalSpent: 18750.75,
    lastOrder: "2023-11-20",
    status: "active",
  },
  {
    id: 4,
    name: "Carlos Pereira",
    email: "carlos.pereira@example.com",
    phone: "(41) 98765-1234",
    totalOrders: 3,
    totalSpent: 4320.25,
    lastOrder: "2023-09-28",
    status: "inactive",
  },
  {
    id: 5,
    name: "Fernanda Costa",
    email: "fernanda.costa@example.com",
    phone: "(51) 99876-2345",
    totalOrders: 7,
    totalSpent: 9870.6,
    lastOrder: "2023-11-15",
    status: "active",
  },
  {
    id: 6,
    name: "Ricardo Almeida",
    email: "ricardo.almeida@example.com",
    phone: "(61) 98765-3456",
    totalOrders: 2,
    totalSpent: 3450.3,
    lastOrder: "2023-08-10",
    status: "inactive",
  },
  {
    id: 7,
    name: "Juliana Lima",
    email: "juliana.lima@example.com",
    phone: "(71) 99876-4567",
    totalOrders: 9,
    totalSpent: 14560.8,
    lastOrder: "2023-11-18",
    status: "active",
  },
  {
    id: 8,
    name: "Marcelo Souza",
    email: "marcelo.souza@example.com",
    phone: "(81) 98765-5678",
    totalOrders: 4,
    totalSpent: 6780.45,
    lastOrder: "2023-10-05",
    status: "active",
  },
]

export default function CustomersManager() {
  const [customers, setCustomers] = useState(customersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)

  // Filtrar clientes com base na busca e no filtro de status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetails(true)
  }

  const handleDeleteCustomer = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      setCustomers(customers.filter((customer) => customer.id !== id))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Gerenciar Clientes</h2>
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
            placeholder="Buscar por nome ou email..."
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
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      {showCustomerDetails && selectedCustomer ? (
        <div className="bg-white p-6 rounded-lg border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Detalhes do Cliente</h3>
            <button onClick={() => setShowCustomerDetails(false)} className="text-sm text-gray-500 hover:text-black">
              Voltar para lista
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Informações Pessoais</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p>{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p>{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedCustomer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedCustomer.status === "active" ? "Ativo" : "Inativo"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Histórico de Compras</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Total de Pedidos</p>
                  <p>{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Total Gasto</p>
                  <p>R$ {selectedCustomer.totalSpent.toFixed(2).replace(".", ",")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Último Pedido</p>
                  <p>{new Date(selectedCustomer.lastOrder).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Médio por Pedido</p>
                  <p>R$ {(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2).replace(".", ",")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-4">Últimos Pedidos</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 border">Pedido</th>
                    <th className="text-left p-3 border">Data</th>
                    <th className="text-left p-3 border">Status</th>
                    <th className="text-left p-3 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 border">#12345</td>
                    <td className="p-3 border">15/11/2023</td>
                    <td className="p-3 border">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Entregue
                      </span>
                    </td>
                    <td className="p-3 border">R$ 2.990,00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 border">#12289</td>
                    <td className="p-3 border">02/10/2023</td>
                    <td className="p-3 border">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Entregue
                      </span>
                    </td>
                    <td className="p-3 border">R$ 1.590,00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 border">#12156</td>
                    <td className="p-3 border">18/09/2023</td>
                    <td className="p-3 border">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Entregue
                      </span>
                    </td>
                    <td className="p-3 border">R$ 3.490,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border">Nome</th>
                <th className="text-left p-3 border">Contato</th>
                <th className="text-left p-3 border">Pedidos</th>
                <th className="text-left p-3 border">Total Gasto</th>
                <th className="text-left p-3 border">Último Pedido</th>
                <th className="text-left p-3 border">Status</th>
                <th className="text-left p-3 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 border font-medium">{customer.name}</td>
                    <td className="p-3 border">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Mail size={14} className="mr-1 text-gray-500" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone size={14} className="mr-1 text-gray-500" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border text-center">{customer.totalOrders}</td>
                    <td className="p-3 border">R$ {customer.totalSpent.toFixed(2).replace(".", ",")}</td>
                    <td className="p-3 border">{new Date(customer.lastOrder).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3 border">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Ver detalhes"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Mostrando {filteredCustomers.length} de {customers.length} clientes
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
