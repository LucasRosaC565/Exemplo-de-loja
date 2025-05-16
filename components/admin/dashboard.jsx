"use client"

import { useState } from "react"
import { LayoutDashboard, Package, Users, ShoppingBag, Settings, FileText } from "lucide-react"
import ProductsManager from "./products-manager"
import CustomersManager from "./customers-manager"
import OrdersManager from "./orders-manager"
import SettingsManager from "./settings"
import Analytics from "./analytics"
import AuditLogs from "./audit-logs"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("analytics")

  const tabs = [
    { id: "analytics", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "products", label: "Produtos", icon: <Package size={20} /> },
    { id: "customers", label: "Clientes", icon: <Users size={20} /> },
    { id: "orders", label: "Pedidos", icon: <ShoppingBag size={20} /> },
    { id: "audit", label: "Logs de Auditoria", icon: <FileText size={20} /> },
    { id: "settings", label: "Configurações", icon: <Settings size={20} /> },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md md:min-h-screen">
        <div className="p-4 border-b">
          <h2 className="text-xl font-medium">Painel Admin</h2>
        </div>
        <nav className="p-2">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id} className="mb-1">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeTab === tab.id ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "products" && <ProductsManager />}
        {activeTab === "customers" && <CustomersManager />}
        {activeTab === "orders" && <OrdersManager />}
        {activeTab === "audit" && <AuditLogs />}
        {activeTab === "settings" && <SettingsManager />}
      </div>
    </div>
  )
}
