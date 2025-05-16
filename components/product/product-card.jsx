"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={400}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.images.length > 1 && isHovered && (
          <Image
            src={product.images[1] || "/placeholder.svg"}
            alt={`${product.name} - imagem alternativa`}
            width={400}
            height={400}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}

        <button
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Implementar lógica de favoritos
          }}
        >
          <Heart size={18} className="text-gray-700" />
        </button>

        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        )}
      </div>

      <div className="product-card-info">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">
          {product.discountPrice ? (
            <>
              <span className="line-through text-gray-500 mr-2">R$ {product.price.toFixed(2).replace(".", ",")}</span>
              <span className="text-black">R$ {product.discountPrice.toFixed(2).replace(".", ",")}</span>
            </>
          ) : (
            <span>R$ {product.price.toFixed(2).replace(".", ",")}</span>
          )}
        </p>
      </div>
    </Link>
  )
}
