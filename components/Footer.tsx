import Link from "next/link"
import Image from "next/image"

export default function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-white">
            {/* Barra dourada no topo */}
            <div className="h-2 bg-gold"></div>

            <div className="container py-16">
                <div className="grid grid-cols-4 gap-8">
                    {/* Logo */}
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-light tracking-wider">AGÊNCIA</h2>
                            <h2 className="text-2xl font-light tracking-wider">DOURO</h2>
                            <p className="text-sm italic mt-1">Imobiliária</p>
                        </div>

                        {/* Seletor de Idioma */}
                        <div className="inline-flex items-center gap-2 bg-gold text-black px-3 py-1.5 rounded cursor-pointer">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="9" fill="#FF0000"/>
                                <circle cx="10" cy="10" r="6" fill="#FFD700"/>
                                <circle cx="10" cy="10" r="3" fill="#00FF00"/>
                            </svg>
                            <span className="text-sm font-medium">Português</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    {/* Coluna 1 */}
                    <div>
                        <nav className="flex flex-col gap-3">
                            <Link href="/" className="body-14-medium text-white hover:text-gold transition-colors">
                                INÍCIO
                            </Link>
                            <Link href="/imoveis" className="body-14-medium text-white hover:text-gold transition-colors">
                                IMÓVEIS
                            </Link>
                            <Link href="/sobre" className="body-14-medium text-white hover:text-gold transition-colors">
                                SOBRE NÓS
                            </Link>
                            <Link href="/contacto" className="body-14-medium text-white hover:text-gold transition-colors">
                                CONTACTO
                            </Link>
                        </nav>
                    </div>

                    {/* Coluna 2 */}
                    <div>
                        <nav className="flex flex-col gap-3">
                            <Link href="/novidades" className="body-14-medium text-white hover:text-gold transition-colors">
                                NOVIDADES
                            </Link>
                            <Link href="/newsletter" className="body-14-medium text-white hover:text-gold transition-colors">
                                NEWSLETTER
                            </Link>
                            <Link href="/podcast" className="body-14-medium text-white hover:text-gold transition-colors">
                                PODCAST
                            </Link>
                        </nav>
                    </div>

                    {/* Coluna 3 */}
                    <div>
                        <nav className="flex flex-col gap-3">
                            <Link href="/imoveis?transactionType=comprar" className="body-14-medium text-white hover:text-gold transition-colors">
                                COMPRAR
                            </Link>
                            <Link href="/imoveis?transactionType=arrendar" className="body-14-medium text-white hover:text-gold transition-colors">
                                ARRENDAR
                            </Link>
                            <Link href="/imoveis?transactionType=vender" className="body-14-medium text-white hover:text-gold transition-colors">
                                VENDER
                            </Link>
                            <Link href="/imoveis?isEmpreendimento=true" className="body-14-medium text-white hover:text-gold transition-colors">
                                EMPREENDIMENTOS
                            </Link>
                            <Link href="/imoveis-luxo" className="body-14-medium text-white hover:text-gold transition-colors">
                                IMÓVEIS DE LUXO
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Rodapé inferior */}
                <div className="flex justify-between items-center mt-16 pt-8 border-t border-white/10">
                    <p className="text-sm text-white/60">
                        © Agência Douro. Todos os direitos reservados.
                    </p>

                    <div className="flex items-center gap-6">
                        {/* Redes Sociais */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://wa.me/351919766323"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:text-white transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/agenciadouro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:text-white transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a
                                href="https://www.facebook.com/agenciadouro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:text-white transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                </svg>
                            </a>
                        </div>

                        {/* Links legais */}
                        <div className="flex items-center gap-4">
                            <Link href="/termos" className="text-sm text-white/60 hover:text-gold transition-colors">
                                TERMOS E CONDIÇÕES
                            </Link>
                            <span className="text-white/40">•</span>
                            <Link href="/livro-reclamacoes" className="text-sm text-white/60 hover:text-gold transition-colors">
                                LIVRO RECLAMAÇÕES ONLINE
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
