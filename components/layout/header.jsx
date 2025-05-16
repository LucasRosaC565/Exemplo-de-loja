"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, Menu, X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-sm" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-serif">
            Elegante
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/produtos/aneis" className="hover:text-gray-600">
              Anéis
            </Link>
            <Link href="/produtos/brincos" className="hover:text-gray-600">
              Brincos
            </Link>
            <Link href="/produtos/colares" className="hover:text-gray-600">
              Colares
            </Link>
            <Link href="/produtos/pulseiras" className="hover:text-gray-600">
              Pulseiras
            </Link>
            <Link href="/produtos/relogios" className="hover:text-gray-600">
              Relógios
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-600">
              <Search size={20} />
            </button>
            <Link href="/carrinho" className="hover:text-gray-600 relative">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="hover:text-gray-600 flex items-center">
                  <User size={20} />
                  <span className="ml-1 text-xs hidden md:inline">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link href="/conta" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Minha Conta
                  </Link>

                  <button
                    onClick={() => {
                      logout()
                      router.push("/")
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm hover:underline">
                  Entrar
                </Link>
                <Link href="/cadastro" className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
                  Cadastrar
                </Link>
              </div>
            )}
            {user?.isAdmin && (
              <Link href="/admin" className="text-sm font-medium bg-black text-white px-3 py-1 rounded">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <nav className="flex flex-col px-4 py-4 space-y-4 border-t">
            <Link href="/produtos/aneis" className="hover:text-gray-600">
              Anéis
            </Link>
            <Link href="/produtos/brincos" className="hover:text-gray-600">
              Brincos
            </Link>
            <Link href="/produtos/colares" className="hover:text-gray-600">
              Colares
            </Link>
            <Link href="/produtos/pulseiras" className="hover:text-gray-600">
              Pulseiras
            </Link>
            <Link href="/produtos/relogios" className="hover:text-gray-600">
              Relógios
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
