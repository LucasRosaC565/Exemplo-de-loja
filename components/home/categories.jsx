"use client"

import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Anéis",
    image: "/placeholder.svg?height=400&width=400",
    slug: "aneis",
  },
  {
    id: 2,
    name: "Brincos",
    image: "/placeholder.svg?height=400&width=400",
    slug: "brincos",
  },
  {
    id: 3,
    name: "Colares",
    image: "/placeholder.svg?height=400&width=400",
    slug: "colares",
  },
  {
    id: 4,
    name: "Pulseiras",
    image: "/placeholder.svg?height=400&width=400",
    slug: "pulseiras",
  },
]

export default function Categories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {categories.map((category) => (
        <Link key={category.id} href={`/produtos/${category.slug}`} className="group">
          <div className="relative overflow-hidden">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              width={400}
              height={400}
              className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <h3 className="text-white text-xl font-serif">{category.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
