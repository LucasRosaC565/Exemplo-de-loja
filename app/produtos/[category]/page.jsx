"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ChevronRight, SlidersHorizontal } from 'lucide-react'
import { getProducts } from "@/lib/api"
import ProductCard from "@/components/product/product-card"
import Loading from "@/components/ui/loading"

const categoryNames = {
  aneis: "Anéis",
  brincos: "Brincos",
  colares: "Colares",
  pulseiras: "Pulseiras",
  relogios: "Relógios",
}

export default function CategoryPage({ params }) {
  // Usar React.use() para desembrulhar params
  const unwrappedParams = use(params)
  const { category } = unwrappedParams
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOption, setSortOption] = useState("name-asc")
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const data = await getProducts({
          category,
          sort: sortOption,
        })
        setProducts(data)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category, sortOption])

  const categoryTitle = categoryNames[category] || "Produtos"

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="py-4 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-black">{categoryTitle}</span>
        </div>

        <h1 className="text-3xl font-serif mb-8">{categoryTitle}</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtros (mobile) */}
          <button className="md:hidden flex items-center gap-2 mb-4" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal size={20} />
            {filtersOpen ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>

          {/* Sidebar de filtros */}
          <div className={`w-full md:w-64 ${filtersOpen ? "block" : "hidden md:block"}`}>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">Filtros</h2>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Ordenar por</h3>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="name-asc">Nome (A-Z)</option>
                  <option value="name-desc">Nome (Z-A)</option>
                  <option value="price-asc">Preço (menor para maior)</option>
                  <option value="price-desc">Preço (maior para menor)</option>
                </select>
              </div>

              {/* Outros filtros podem ser adicionados aqui */}
            </div>
          </div>

          {/* Lista de produtos */}
          <div className="flex-1">
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Nenhum produto encontrado nesta categoria.</p>
                <Link href="/produtos" className="text-blue-600 hover:text-blue-800">
                  Ver todos os produtos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}