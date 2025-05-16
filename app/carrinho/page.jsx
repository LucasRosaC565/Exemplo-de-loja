"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/carrinho")
      return
    }

    setCheckoutLoading(true)
    // Simulação de processamento de checkout
    setTimeout(() => {
      alert("Pedido realizado com sucesso!")
      clearCart()
      router.push("/")
      setCheckoutLoading(false)
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center p-4">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-medium mb-2">Seu carrinho está vazio</h1>
        <p className="text-gray-600 mb-6 text-center">
          Parece que você ainda não adicionou nenhum produto ao seu carrinho.
        </p>
        <Link href="/produtos" className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors">
          Continuar Comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif mb-8">Seu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border-b pb-4 mb-4 hidden md:grid md:grid-cols-12 text-sm font-medium">
              <div className="md:col-span-6">Produto</div>
              <div className="md:col-span-2 text-center">Preço</div>
              <div className="md:col-span-2 text-center">Quantidade</div>
              <div className="md:col-span-2 text-center">Subtotal</div>
            </div>

            {cartItems.map((item) => {
              const price = item.discountPrice || item.price
              const subtotal = price * item.quantity

              return (
                <div key={item.id} className="border-b py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 flex items-center">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="ml-4">
                      <Link href={`/produto/${item.slug}`} className="font-medium hover:text-gray-600">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center text-red-600 text-sm mt-1 hover:text-red-800"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Preço:</div>
                    R$ {price.toFixed(2).replace(".", ",")}
                  </div>

                  <div className="md:col-span-2 flex justify-center">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Quantidade:</div>
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center font-medium">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Subtotal:</div>
                    R$ {subtotal.toFixed(2).replace(".", ",")}
                  </div>
                </div>
              )
            })}

            <div className="mt-6">
              <Link href="/produtos" className="flex items-center text-gray-600 hover:text-black">
                <ArrowLeft size={16} className="mr-2" />
                Continuar Comprando
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-6 border rounded-lg">
              <h2 className="text-xl font-medium mb-4">Resumo do Pedido</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {getCartTotal().toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>R$ {getCartTotal().toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Em até 10x de R$ {(getCartTotal() / 10).toFixed(2).replace(".", ",")} sem juros
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {checkoutLoading ? "Processando..." : "Finalizar Compra"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
