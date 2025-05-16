import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-gray-600 hover:text-black">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/lojas" className="text-gray-600 hover:text-black">
                  Nossas lojas
                </Link>
              </li>
              <li>
                <Link href="/trabalhe-conosco" className="text-gray-600 hover:text-black">
                  Trabalhe conosco
                </Link>
              </li>
              <li>
                <Link href="/sustentabilidade" className="text-gray-600 hover:text-black">
                  Sustentabilidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Ajuda</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-black">
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="text-gray-600 hover:text-black">
                  Trocas e devoluções
                </Link>
              </li>
              <li>
                <Link href="/entregas" className="text-gray-600 hover:text-black">
                  Entregas
                </Link>
              </li>
              <li>
                <Link href="/pagamentos" className="text-gray-600 hover:text-black">
                  Formas de pagamento
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Conta</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-black">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="text-gray-600 hover:text-black">
                  Criar conta
                </Link>
              </li>
              <li>
                <Link href="/pedidos" className="text-gray-600 hover:text-black">
                  Meus pedidos
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="text-gray-600 hover:text-black">
                  Lista de desejos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Central de atendimento:</li>
              <li className="text-gray-600">0800 123 4567</li>
              <li className="text-gray-600">contato@elegante.com.br</li>
              <li className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-600 hover:text-black">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-600 hover:text-black">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-600 hover:text-black">
                  <Twitter size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-6 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Elegante Joalheria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
