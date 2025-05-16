"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, ShoppingBag } from "lucide-react"
import { getProductBySlug } from "@/lib/api"
import { useCart } from "@/context/cart-context"
import Loading from "@/components/ui/loading"

export default function ProductPage({ params }) {
  const { slug } = params
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const { addToCart } = useCart()

  useEffect(() => {
    async function loadProduct() {
      try {
        const productData = await getProductBySlug(slug)
        setProduct(productData)
      } catch (error) {
        console.error("Erro ao carregar produto:", error)
        setError("Produto não encontrado")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    // Feedback visual
    alert("Produto adicionado ao carrinho!")
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-medium mb-4">Produto não encontrado</h1>
        <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <Link href="/produtos" className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors">
          Ver todos os produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="py-4 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <Link href={`/produtos/${product.category}`} className="hover:text-black capitalize">
            {product.category}
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagens do produto */}
          <div>
            <div className="relative aspect-square overflow-hidden mb-4">
              <Image
                src={product.images[activeImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square border-2 ${
                      activeImage === index ? "border-black" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do produto */}
          <div>
            <h1 className="text-3xl font-serif mb-2">{product.name}</h1>

            <div className="mb-6">
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-medium">R$ {product.discountPrice.toFixed(2).replace(".", ",")}</span>
                  <span className="ml-2 text-gray-500 line-through">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-medium">R$ {product.price.toFixed(2).replace(".", ",")}</span>
              )}

              <p className="text-sm text-gray-500 mt-1">
                Em até 10x de R$ {((product.discountPrice || product.price) / 10).toFixed(2).replace(".", ",")} sem
                juros
              </p>
            </div>

            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="mr-6">
                  <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                    Quantidade
                  </label>
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Disponibilidade</p>
                  <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {product.stock > 0 ? `${product.stock} em estoque` : "Esgotado"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                <ShoppingBag size={20} />
                Adicionar ao Carrinho
              </button>
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Especificações</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex">
                      <span className="font-medium w-1/3">{spec.name}:</span>
                      <span className="text-gray-700">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
