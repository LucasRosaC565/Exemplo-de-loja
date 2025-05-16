"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, Filter } from "lucide-react"

// Dados simulados para os gráficos
const salesData = [
  { name: "Jan", value: 12000 },
  { name: "Fev", value: 15000 },
  { name: "Mar", value: 18000 },
  { name: "Abr", value: 16000 },
  { name: "Mai", value: 21000 },
  { name: "Jun", value: 19000 },
  { name: "Jul", value: 23000 },
  { name: "Ago", value: 25000 },
  { name: "Set", value: 22000 },
  { name: "Out", value: 27000 },
  { name: "Nov", value: 32000 },
  { name: "Dez", value: 38000 },
]

const categoryData = [
  { name: "Anéis", value: 35 },
  { name: "Brincos", value: 25 },
  { name: "Colares", value: 20 },
  { name: "Pulseiras", value: 15 },
  { name: "Relógios", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function Analytics() {
  const [period, setPeriod] = useState("year")

  // Filtrar dados com base no período selecionado
  const filteredSalesData =
    period === "year"
      ? salesData
      : period === "quarter"
        ? salesData.slice(salesData.length - 3)
        : salesData.slice(salesData.length - 1)

  // Calcular totais
  const totalSales = salesData.reduce((sum, item) => sum + item.value, 0)
  const totalOrders = 1254
  const averageOrderValue = Math.round(totalSales / totalOrders)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Análise de Vendas</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 text-sm ${period === "month" ? "bg-black text-white" : "hover:bg-gray-100"}`}
            >
              Mês
            </button>
            <button
              onClick={() => setPeriod("quarter")}
              className={`px-3 py-1.5 text-sm ${period === "quarter" ? "bg-black text-white" : "hover:bg-gray-100"}`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`px-3 py-1.5 text-sm ${period === "year" ? "bg-black text-white" : "hover:bg-gray-100"}`}
            >
              Ano
            </button>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 border rounded-md hover:bg-gray-100">
            <Calendar size={16} />
            <span className="text-sm">Período</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 border rounded-md hover:bg-gray-100">
            <Filter size={16} />
            <span className="text-sm">Filtros</span>
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm text-gray-500 mb-1">Total de Vendas</h3>
          <p className="text-2xl font-semibold">R$ {totalSales.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-green-600 mt-2">+12% em relação ao período anterior</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm text-gray-500 mb-1">Pedidos</h3>
          <p className="text-2xl font-semibold">{totalOrders}</p>
          <p className="text-sm text-green-600 mt-2">+8% em relação ao período anterior</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm text-gray-500 mb-1">Valor Médio do Pedido</h3>
          <p className="text-2xl font-semibold">R$ {averageOrderValue.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-green-600 mt-2">+4% em relação ao período anterior</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Vendas por Período</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredSalesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Vendas"]} />
                <Legend />
                <Bar dataKey="value" name="Vendas (R$)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Vendas por Categoria</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Porcentagem"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela de produtos mais vendidos */}
      <div className="mt-8 bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border">Produto</th>
                <th className="text-left p-3 border">Categoria</th>
                <th className="text-left p-3 border">Vendas</th>
                <th className="text-left p-3 border">Receita</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 border">Anel Solitário Ouro Amarelo</td>
                <td className="p-3 border">Anéis</td>
                <td className="p-3 border">124</td>
                <td className="p-3 border">R$ 494.760,00</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border">Brinco Argola Ouro Rosé</td>
                <td className="p-3 border">Brincos</td>
                <td className="p-3 border">98</td>
                <td className="p-3 border">R$ 244.020,00</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border">Pulseira Riviera Ouro Branco</td>
                <td className="p-3 border">Pulseiras</td>
                <td className="p-3 border">76</td>
                <td className="p-3 border">R$ 607.240,00</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border">Colar Pingente Coração Prata</td>
                <td className="p-3 border">Colares</td>
                <td className="p-3 border">65</td>
                <td className="p-3 border">R$ 57.850,00</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 border">Aliança de Casamento Ouro</td>
                <td className="p-3 border">Anéis</td>
                <td className="p-3 border">58</td>
                <td className="p-3 border">R$ 173.420,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
