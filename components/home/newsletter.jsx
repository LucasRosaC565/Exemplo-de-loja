"use client"

import { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar o email
    console.log("Email cadastrado:", email)
    setSubmitted(true)
    setEmail("")
  }

  return (
    <div className="my-16 py-12 bg-gray-100">
      <div className="max-w-xl mx-auto text-center px-4">
        <h3 className="text-2xl font-serif mb-4">Receba nossas novidades</h3>
        <p className="text-gray-600 mb-6">
          Cadastre-se para receber em primeira mão nossas promoções e lançamentos exclusivos.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
            Obrigado por se cadastrar! Em breve você receberá nossas novidades.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              required
              className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button type="submit" className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors">
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
