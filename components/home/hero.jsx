import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          filter: "brightness(0.9)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-4xl md:text-6xl font-serif mb-4">Elegância em Cada Detalhe</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Descubra nossa nova coleção de joias exclusivas, criadas para momentos especiais
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/produtos/colecao-nova"
            className="bg-white text-black px-8 py-3 hover:bg-gray-100 transition-colors"
          >
            Nova Coleção
          </Link>
          <Link
            href="/produtos"
            className="border border-white text-white px-8 py-3 hover:bg-white/10 transition-colors"
          >
            Ver Todos os Produtos
          </Link>
        </div>
      </div>
    </div>
  )
}
