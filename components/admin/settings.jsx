"use client"

import { useState } from "react"
import { Save, Globe, CreditCard, Truck, Bell, Shield, Mail } from "lucide-react"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general")
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Elegante Joalheria",
    storeEmail: "contato@elegante.com.br",
    storePhone: "(11) 3456-7890",
    storeAddress: "Av. Paulista, 1000 - São Paulo, SP",
    currency: "BRL",
    weightUnit: "g",
  })

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCreditCard: true,
    acceptDebitCard: true,
    acceptBankSlip: true,
    acceptPix: true,
    installmentsLimit: 10,
    interestRate: 0,
  })

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingMinimum: 500,
    defaultShippingFee: 25,
    deliveryEstimate: "3-5 dias úteis",
    shippingMethods: ["Correios PAC", "Correios Sedex", "Transportadora"],
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    abandonedCart: true,
    promotions: true,
    newsletterFrequency: "weekly",
  })

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target
    setPaymentSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveSettings = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    alert("Configurações salvas com sucesso!")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Configurações da Loja</h2>
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          <Save size={18} />
          Salvar Alterações
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs de navegação */}
        <div className="w-full md:w-64 bg-gray-100 p-4 rounded-lg">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 w-full p-3 rounded-lg ${
                activeTab === "general" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              <Globe size={18} />
              <span>Geral</span>
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`flex items-center gap-2 w-full p-3 rounded-lg ${
                activeTab === "payment" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              <CreditCard size={18} />
              <span>Pagamento</span>
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`flex items-center gap-2 w-full p-3 rounded-lg ${
                activeTab === "shipping" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              <Truck size={18} />
              <span>Entrega</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 w-full p-3 rounded-lg ${
                activeTab === "notifications" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              <Bell size={18} />
              <span>Notificações</span>
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center gap-2 w-full p-3 rounded-lg ${
                activeTab === "privacy" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              <Shield size={18} />
              <span>Privacidade</span>
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex items-center gap-2 w-full p-3 rounded-lg ${
                activeTab === "email" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              <Mail size={18} />
              <span>Email</span>
            </button>
          </nav>
        </div>

        {/* Conteúdo das configurações */}
        <div className="flex-1 bg-white p-6 rounded-lg border">
          {activeTab === "general" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome da Loja</label>
                  <input
                    type="text"
                    name="storeName"
                    value={generalSettings.storeName}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email da Loja</label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={generalSettings.storeEmail}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone da Loja</label>
                  <input
                    type="text"
                    name="storePhone"
                    value={generalSettings.storePhone}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Endereço da Loja</label>
                  <textarea
                    name="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={handleGeneralChange}
                    rows="2"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Moeda</label>
                    <select
                      name="currency"
                      value={generalSettings.currency}
                      onChange={handleGeneralChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="BRL">Real Brasileiro (R$)</option>
                      <option value="USD">Dólar Americano ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unidade de Peso</label>
                    <select
                      name="weightUnit"
                      value={generalSettings.weightUnit}
                      onChange={handleGeneralChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="g">Gramas (g)</option>
                      <option value="kg">Quilogramas (kg)</option>
                      <option value="oz">Onças (oz)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações de Pagamento</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-1">Métodos de Pagamento</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="acceptCreditCard"
                      name="acceptCreditCard"
                      checked={paymentSettings.acceptCreditCard}
                      onChange={handlePaymentChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="acceptCreditCard">Cartão de Crédito</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="acceptDebitCard"
                      name="acceptDebitCard"
                      checked={paymentSettings.acceptDebitCard}
                      onChange={handlePaymentChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="acceptDebitCard">Cartão de Débito</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="acceptBankSlip"
                      name="acceptBankSlip"
                      checked={paymentSettings.acceptBankSlip}
                      onChange={handlePaymentChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="acceptBankSlip">Boleto Bancário</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="acceptPix"
                      name="acceptPix"
                      checked={paymentSettings.acceptPix}
                      onChange={handlePaymentChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="acceptPix">PIX</label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Limite de Parcelas</label>
                    <input
                      type="number"
                      name="installmentsLimit"
                      value={paymentSettings.installmentsLimit}
                      onChange={handlePaymentChange}
                      min="1"
                      max="12"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Taxa de Juros (%)</label>
                    <input
                      type="number"
                      name="interestRate"
                      value={paymentSettings.interestRate}
                      onChange={handlePaymentChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações de Entrega</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Valor Mínimo para Frete Grátis (R$)</label>
                    <input
                      type="number"
                      name="freeShippingMinimum"
                      value={shippingSettings.freeShippingMinimum}
                      onChange={handleShippingChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Taxa de Entrega Padrão (R$)</label>
                    <input
                      type="number"
                      name="defaultShippingFee"
                      value={shippingSettings.defaultShippingFee}
                      onChange={handleShippingChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estimativa de Entrega</label>
                  <input
                    type="text"
                    name="deliveryEstimate"
                    value={shippingSettings.deliveryEstimate}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Métodos de Entrega</label>
                  <div className="border border-gray-300 rounded p-4">
                    <div className="space-y-2">
                      {shippingSettings.shippingMethods.map((method, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{method}</span>
                          <button className="text-red-600 hover:text-red-800">Remover</button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <input
                        type="text"
                        placeholder="Adicionar método de entrega"
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Adicionar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações de Notificações</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-1">Notificações por Email</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderConfirmation"
                      name="orderConfirmation"
                      checked={notificationSettings.orderConfirmation}
                      onChange={handleNotificationChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="orderConfirmation">Confirmação de Pedido</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderShipped"
                      name="orderShipped"
                      checked={notificationSettings.orderShipped}
                      onChange={handleNotificationChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="orderShipped">Pedido Enviado</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderDelivered"
                      name="orderDelivered"
                      checked={notificationSettings.orderDelivered}
                      onChange={handleNotificationChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="orderDelivered">Pedido Entregue</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="abandonedCart"
                      name="abandonedCart"
                      checked={notificationSettings.abandonedCart}
                      onChange={handleNotificationChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="abandonedCart">Carrinho Abandonado</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="promotions"
                      name="promotions"
                      checked={notificationSettings.promotions}
                      onChange={handleNotificationChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="promotions">Promoções e Novidades</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Frequência da Newsletter</label>
                  <select
                    name="newsletterFrequency"
                    value={notificationSettings.newsletterFrequency}
                    onChange={handleNotificationChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quinzenal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações de Privacidade</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Política de Privacidade</label>
                  <textarea
                    rows="10"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    defaultValue="A Elegante Joalheria está comprometida em proteger a privacidade dos nossos clientes. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Termos e Condições</label>
                  <textarea
                    rows="10"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    defaultValue="Ao utilizar nosso site, você concorda com estes Termos e Condições. A Elegante Joalheria reserva-se o direito de modificar estes termos a qualquer momento..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações de Email</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Servidor SMTP</label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Porta</label>
                    <input
                      type="number"
                      placeholder="587"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Segurança</label>
                    <select className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black">
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">Nenhuma</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email de Envio</label>
                  <input
                    type="email"
                    placeholder="noreply@elegante.com.br"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nome de Exibição</label>
                  <input
                    type="text"
                    placeholder="Elegante Joalheria"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Usuário SMTP</label>
                  <input
                    type="text"
                    placeholder="usuário"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Senha SMTP</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Testar Conexão</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
