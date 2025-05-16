import { Suspense } from "react"
import Hero from "@/components/home/hero"
import FeaturedProducts from "@/components/home/featured-products"
import Categories from "@/components/home/categories"
import Newsletter from "@/components/home/newsletter"
import Loading from "@/components/ui/loading"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif text-center mb-8">Coleções em Destaque</h2>
        <Suspense fallback={<Loading />}>
          <Categories />
        </Suspense>

        <h2 className="text-3xl font-serif text-center mt-16 mb-8">Produtos em Destaque</h2>
        <Suspense fallback={<Loading />}>
          <FeaturedProducts />
        </Suspense>

        <Newsletter />
      </div>
    </main>
  )
}
