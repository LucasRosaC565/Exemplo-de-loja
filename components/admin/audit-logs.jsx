"use client"

import { useState, useEffect } from "react"
import { getAuditLogs } from "@/lib/api/products"
import { useToast } from "@/components/ui/toast"
import { RefreshCw } from "lucide-react"

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    table: "",
    action: "",
    recordId: "",
    limit: 50,
    page: 1,
  })
  const toast = useToast()

  const loadLogs = async () => {
    setLoading(true)
    try {
      const data = await getAuditLogs(filter)
      setLogs(data)
    } catch (error) {
      console.error("Erro ao carregar logs de auditoria:", error)
      toast.error("Erro ao carregar logs de auditoria. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [filter])

  // Formatar data para exibição
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  // Traduzir ação para português
  const translateAction = (action) => {
    const translations = {
      create: "Criação",
      update: "Atualização",
      delete: "Exclusão",
      delete_batch: "Exclusão em lote",
      restore: "Restauração",
      restore_batch: "Restauração em lote",
    }
    return translations[action] || action
  }

  // Obter ações únicas para o filtro
  const uniqueActions = [...new Set(logs.map((log) => log.action))]

  // Obter tabelas únicas para o filtro
  const uniqueTables = [...new Set(logs.map((log) => log.table_name))]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Logs de Auditoria</h2>
        <button
          onClick={loadLogs}
          className="bg-gray-200 text-gray-800 px-4 py-2 flex items-center gap-2 hover:bg-gray-300 transition-colors rounded-lg"
        >
          <RefreshCw size={18} />
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tabela</label>
          <select
            value={filter.table}
            onChange={(e) => setFilter({ ...filter, table: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Todas as tabelas</option>
            {uniqueTables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
          <select
            value={filter.action}
            onChange={(e) => setFilter({ ...filter, action: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Todas as ações</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {translateAction(action)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">ID do Registro</label>
          <input
            type="text"
            placeholder="ID do registro"
            value={filter.recordId}
            onChange={(e) => setFilter({ ...filter, recordId: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border">Data/Hora</th>
                <th className="text-left p-3 border">Usuário</th>
                <th className="text-left p-3 border">Ação</th>
                <th className="text-left p-3 border">Tabela</th>
                <th className="text-left p-3 border">ID do Registro</th>
                <th className="text-left p-3 border">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    Nenhum log de auditoria encontrado
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 border">{formatDate(log.created_at)}</td>
                    <td className="p-3 border">{log.user?.full_name || log.user_id}</td>
                    <td className="p-3 border">{translateAction(log.action)}</td>
                    <td className="p-3 border">{log.table_name}</td>
                    <td className="p-3 border">
                      <span className="font-mono text-xs">{log.record_id}</span>
                    </td>
                    <td className="p-3 border">
                      {log.details ? (
                        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
