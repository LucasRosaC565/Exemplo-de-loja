"use client"

import { useState } from "react"
import { Database, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/toast"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()

  const handleSetup = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja executar a migração do banco de dados? Esta ação adicionará suporte para exclusão lógica e logs de auditoria.",
      )
    ) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao executar migração")
      }

      setSuccess(true)
      toast.success("Migração executada com sucesso!")
    } catch (err) {
      console.error("Erro:", err)
      setError(err.message)
      toast.error(`Erro: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuração do Banco de Dados</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Database className="mr-2" />
          Migração para Novas Funcionalidades
        </h2>

        <p className="mb-4 text-gray-700">Esta migração adicionará as seguintes funcionalidades ao banco de dados:</p>

        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
          <li>
            <strong>Exclusão Lógica (Soft Delete)</strong>: Permite que produtos sejam marcados como excluídos sem
            removê-los permanentemente do banco de dados.
          </li>
          <li>
            <strong>Logs de Auditoria</strong>: Registra todas as ações administrativas (criação, atualização, exclusão)
            para fins de auditoria.
          </li>
          <li>
            <strong>Restauração de Produtos</strong>: Permite restaurar produtos que foram excluídos logicamente.
          </li>
          <li>
            <strong>Políticas de Segurança Atualizadas</strong>: Garante que apenas produtos ativos sejam visíveis para
            os clientes.
          </li>
        </ul>

        <div className="flex items-center justify-between">
          <button
            onClick={handleSetup}
            disabled={loading || success}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              success ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"
            } transition-colors`}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : success ? (
              <CheckCircle size={18} />
            ) : (
              <Database size={18} />
            )}
            {loading ? "Executando Migração..." : success ? "Migração Concluída" : "Executar Migração"}
          </button>

          {error && (
            <div className="text-red-600 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Importante:</strong> Esta migração é necessária para habilitar as novas funcionalidades de
              exclusão lógica, restauração de produtos e logs de auditoria. Execute-a apenas uma vez.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Instruções de Uso</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">Exclusão Lógica e Restauração</h3>
            <p className="text-gray-700">
              Após a migração, os produtos excluídos não serão removidos permanentemente do banco de dados. Você poderá
              visualizá-los e restaurá-los a qualquer momento no painel de administração.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">Logs de Auditoria</h3>
            <p className="text-gray-700">
              Todas as ações administrativas serão registradas automaticamente. Você pode visualizar esses logs na nova
              seção "Logs de Auditoria" no painel de administração.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg">Exclusão em Lote</h3>
            <p className="text-gray-700">
              Agora você pode selecionar múltiplos produtos e excluí-los ou restaurá-los de uma só vez, facilitando o
              gerenciamento do catálogo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
