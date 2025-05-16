"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, RefreshCw, Archive } from "lucide-react"
import {
  getProducts,
  deleteProduct,
  deleteProductsBatch,
  restoreProduct,
  restoreProductsBatch,
} from "@/lib/api/products"
import ProductForm from "./product-form"
import DeleteConfirmationModal from "./delete-confirmation-modal"
import { useToast } from "@/components/ui/toast"

export default function ProductsManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showDeleted, setShowDeleted] = useState(false)
  const [batchActionLoading, setBatchActionLoading] = useState(false)
  const toast = useToast()

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts({
        search: searchTerm,
        includeDeleted: true,
        onlyDeleted: showDeleted,
      })
      setProducts(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast.error("Erro ao carregar produtos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [searchTerm, showDeleted])

  const handleAddNew = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  // Função para abrir o modal de confirmação
  const confirmDelete = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  // Função para lidar com a exclusão de produtos
  const handleDelete = async () => {
    if (!productToDelete) return

    setDeleteLoading(true)

    try {
      await deleteProduct(productToDelete.id)

      // Atualizar a lista de produtos
      loadProducts()

      // Feedback para o usuário
      toast.success(`Produto "${productToDelete.name}" excluído com sucesso!`)
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast.error("Erro ao excluir produto. Por favor, tente novamente.")
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
      setProductToDelete(null)
    }
  }

  // Função para restaurar um produto
  const handleRestore = async (product) => {
    try {
      await restoreProduct(product.id)

      // Atualizar a lista de produtos
      loadProducts()

      // Feedback para o usuário
      toast.success(`Produto "${product.name}" restaurado com sucesso!`)
    } catch (error) {
      console.error("Erro ao restaurar produto:", error)
      toast.error("Erro ao restaurar produto. Por favor, tente novamente.")
    }
  }

  // Função para selecionar/deselecionar um produto
  const toggleProductSelection = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id)
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  // Função para selecionar/deselecionar todos os produtos
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts([...products])
    }
  }

  // Função para excluir produtos em lote
  const handleBatchDelete = async () => {
    if (selectedProducts.length === 0) return

    if (!window.confirm(`Tem certeza que deseja excluir ${selectedProducts.length} produtos?`)) {
      return
    }

    setBatchActionLoading(true)

    try {
      const ids = selectedProducts.map((p) => p.id)
      await deleteProductsBatch(ids)

      // Atualizar a lista de produtos
      loadProducts()

      // Limpar seleção
      setSelectedProducts([])

      // Feedback para o usuário
      toast.success(`${selectedProducts.length} produtos excluídos com sucesso!`)
    } catch (error) {
      console.error("Erro ao excluir produtos em lote:", error)
      toast.error("Erro ao excluir produtos em lote. Por favor, tente novamente.")
    } finally {
      setBatchActionLoading(false)
    }
  }

  // Função para restaurar produtos em lote
  const handleBatchRestore = async () => {
    if (selectedProducts.length === 0) return

    setBatchActionLoading(true)

    try {
      const ids = selectedProducts.map((p) => p.id)
      await restoreProductsBatch(ids)

      // Atualizar a lista de produtos
      loadProducts()

      // Limpar seleção
      setSelectedProducts([])

      // Feedback para o usuário
      toast.success(`${selectedProducts.length} produtos restaurados com sucesso!`)
    } catch (error) {
      console.error("Erro ao restaurar produtos em lote:", error)
      toast.error("Erro ao restaurar produtos em lote. Por favor, tente novamente.")
    } finally {
      setBatchActionLoading(false)
    }
  }

  const handleFormSubmit = () => {
    setShowForm(false)
    loadProducts() // Recarregar a lista após salvar
  }

  const handleFormCancel = () => {
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Gerenciar Produtos</h2>
        <button
          onClick={handleAddNew}
          className="bg-black text-white px-4 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors"
          disabled={showDeleted}
        >
          <Plus size={18} />
          Novo Produto
        </button>
      </div>

      {showForm ? (
        <ProductForm product={editingProduct} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 flex items-center gap-2 border rounded-lg transition-colors ${
                showDeleted
                  ? "bg-gray-200 border-gray-300 text-gray-800"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {showDeleted ? <RefreshCw size={18} /> : <Archive size={18} />}
              {showDeleted ? "Mostrar Ativos" : "Mostrar Excluídos"}
            </button>
          </div>

          {/* Ações em lote */}
          {selectedProducts.length > 0 && (
            <div className="bg-gray-100 p-3 mb-4 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-medium">{selectedProducts.length}</span> produtos selecionados
              </div>
              <div className="flex gap-2">
                {showDeleted ? (
                  <button
                    onClick={handleBatchRestore}
                    disabled={batchActionLoading}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md flex items-center gap-1 hover:bg-green-700 transition-colors"
                  >
                    <RefreshCw size={16} />
                    Restaurar Selecionados
                  </button>
                ) : (
                  <button
                    onClick={handleBatchDelete}
                    disabled={batchActionLoading}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-md flex items-center gap-1 hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    Excluir Selecionados
                  </button>
                )}
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border w-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left p-3 border">Nome</th>
                    <th className="text-left p-3 border">Categoria</th>
                    <th className="text-left p-3 border">Preço</th>
                    <th className="text-left p-3 border">Estoque</th>
                    <th className="text-left p-3 border">Destaque</th>
                    <th className="text-left p-3 border">Status</th>
                    <th className="text-left p-3 border">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">
                        {showDeleted ? "Nenhum produto excluído encontrado" : "Nenhum produto encontrado"}
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className={`border-b hover:bg-gray-50 ${product.isDeleted ? "bg-gray-50" : ""}`}
                      >
                        <td className="p-3 border text-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.some((p) => p.id === product.id)}
                            onChange={() => toggleProductSelection(product)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-3 border">{product.name}</td>
                        <td className="p-3 border capitalize">{product.category}</td>
                        <td className="p-3 border">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                          {product.discountPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              R$ {product.discountPrice.toFixed(2).replace(".", ",")}
                            </span>
                          )}
                        </td>
                        <td className="p-3 border">{product.stock}</td>
                        <td className="p-3 border">{product.featured ? "Sim" : "Não"}</td>
                        <td className="p-3 border">
                          {product.isDeleted ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Excluído
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Ativo
                            </span>
                          )}
                        </td>
                        <td className="p-3 border">
                          <div className="flex gap-2">
                            {product.isDeleted ? (
                              <button
                                onClick={() => handleRestore(product)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Restaurar produto"
                              >
                                <RefreshCw size={18} />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Editar produto"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => confirmDelete(product)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  disabled={deleteLoading}
                                  title="Excluir produto"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {/* Modal de confirmação */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          item={productToDelete}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false)
            setProductToDelete(null)
          }}
        />
      )}
    </div>
  )
}
