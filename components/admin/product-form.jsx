"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Plus } from "lucide-react"
import { getCategories } from "@/lib/api/categories"

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    discountPrice: product?.discountPrice || "",
    category: product?.category || "",
    featured: product?.featured || false,
    stock: product?.stock || 1,
    images: product?.images || [],
    specifications: product?.specifications || [{ name: "", value: "" }],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Carregar categorias do banco de dados
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        // Se não houver categoria selecionada e existirem categorias, selecionar a primeira
        if (!formData.category && categoriesData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: categoriesData[0].slug,
          }))
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      }
    }

    loadCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    // Permitir apenas números e um ponto decimal
    const sanitizedValue = value.replace(/[^0-9.]/g, "")
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }))
  }

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index][field] = value
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }))
  }

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }))
  }

  const removeSpecification = (index) => {
    const newSpecs = [...formData.specifications]
    newSpecs.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }))
  }

  const handleImageUpload = async (files) => {
    if (files.length === 0) return

    setUploading(true)
    const newImages = [...formData.images]

    try {
      for (const file of files) {
        // Criar um FormData para o upload
        const formData = new FormData()
        formData.append("file", file)

        // Fazer o upload para a API
        const response = await fetch("/api/storage", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao fazer upload da imagem")
        }

        const data = await response.json()
        newImages.push(data.url)
      }

      setFormData((prev) => ({
        ...prev,
        images: newImages,
      }))
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      setError("Erro ao fazer upload das imagens. Tente novamente.")
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    handleImageUpload(files)
  }

  const removeImage = (index) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validar dados
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      // Remover especificações vazias
      const validSpecs = formData.specifications.filter((spec) => spec.name.trim() && spec.value.trim())

      // Preparar dados para envio
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        discountPrice: formData.discountPrice ? Number.parseFloat(formData.discountPrice) : null,
        categoryId: categories.find((cat) => cat.slug === formData.category)?.id,
        featured: formData.featured,
        stock: Number.parseInt(formData.stock),
        images: formData.images,
        specifications: validSpecs,
      }

      // Enviar para o servidor
      if (product) {
        // Atualizar produto existente
        const formDataToSubmit = new FormData()
        Object.entries(productData).forEach(([key, value]) => {
          if (key === "images" || key === "specifications") {
            formDataToSubmit.append(key, JSON.stringify(value))
          } else {
            formDataToSubmit.append(key, value)
          }
        })

        const response = await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          body: formDataToSubmit,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao atualizar produto")
        }
      } else {
        // Criar novo produto
        const formDataToSubmit = new FormData()
        Object.entries(productData).forEach(([key, value]) => {
          if (key === "images" || key === "specifications") {
            formDataToSubmit.append(key, JSON.stringify(value))
          } else {
            formDataToSubmit.append(key, value)
          }
        })

        const response = await fetch("/api/products", {
          method: "POST",
          body: formDataToSubmit,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao criar produto")
        }
      }

      onSubmit()
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      setError(error.message || "Ocorreu um erro ao salvar o produto. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-medium mb-6">{product ? "Editar Produto" : "Novo Produto"}</h3>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nome do Produto</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
          >
            {categories.length === 0 ? (
              <option value="">Carregando categorias...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preço (R$)</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handlePriceChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preço com Desconto (R$)</label>
          <input
            type="text"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handlePriceChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estoque</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Produto em Destaque
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
        ></textarea>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Imagens</label>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center disabled:text-gray-400"
          >
            <Plus size={16} className="mr-1" />
            {uploading ? "Enviando..." : "Adicionar Imagem"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        <div className="border-2 border-dashed rounded-lg p-6 text-center mb-4">
          {formData.images.length === 0 ? (
            <>
              <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">Arraste e solte imagens ou clique para selecionar</p>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors disabled:bg-gray-200"
              >
                {uploading ? "Enviando..." : "Selecionar Imagens"}
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-md border">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Prévia ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div
                className="aspect-square border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current.click()}
              >
                <Plus size={24} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">Dica: A primeira imagem será usada como imagem principal do produto.</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Especificações</label>
          <button
            type="button"
            onClick={addSpecification}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Especificação
          </button>
        </div>

        {formData.specifications.map((spec, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={spec.name}
              onChange={(e) => handleSpecChange(index, "name", e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Nome (ex: Material)"
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) => handleSpecChange(index, "value", e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Valor (ex: Ouro 18k)"
            />
            <button
              type="button"
              onClick={() => removeSpecification(index)}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Prévia do Produto */}
      <div className="mb-6 border-t pt-6">
        <h4 className="text-lg font-medium mb-4">Prévia do Produto</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {formData.images.length > 0 ? (
                <div className="aspect-square overflow-hidden rounded-md border">
                  <img
                    src={formData.images[0] || "/placeholder.svg"}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Sem imagem</p>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-medium">{formData.name || "Nome do Produto"}</h3>
              <div className="mt-2">
                {formData.discountPrice ? (
                  <div>
                    <span className="text-lg font-medium">
                      R${" "}
                      {Number(formData.discountPrice || 0)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      R${" "}
                      {Number(formData.price || 0)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-medium">
                    R${" "}
                    {Number(formData.price || 0)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                )}
              </div>
              <p className="mt-3 text-gray-600 line-clamp-3">{formData.description || "Descrição do produto"}</p>
              <div className="mt-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2 capitalize">
                  {categories.find((c) => c.slug === formData.category)?.name || formData.category || "Categoria"}
                </span>
                {formData.featured && (
                  <span className="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-medium text-yellow-700">
                    Destaque
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Salvando..." : product ? "Atualizar Produto" : "Criar Produto"}
        </button>
      </div>
    </form>
  )
}
