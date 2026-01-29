import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <section className="bg-deaf min-h-screen flex items-center justify-center">
            <div className="container py-16 text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                    <h1 className="heading-um-regular text-brown">404</h1>
                    <h2 className="heading-tres-medium text-brown">Página não encontrada</h2>
                    <p className="body-18-regular text-black-muted">
                        Lamentamos, mas a página que procura não existe ou foi movida.
                        Pode ter introduzido um endereço incorreto ou a página pode ter sido removida.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button variant="gold" asChild>
                            <Link href="/">Voltar à página inicial</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/imoveis">Ver imóveis</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}






