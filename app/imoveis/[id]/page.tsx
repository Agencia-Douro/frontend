import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ImovelDetails() {
    return (
        <section className="container">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                    <Link 
                        href="/imoveis"
                        className="body-14-medium text-brown hover:bg-muted flex gap-2 px-1.5 py-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M5.16725 9.12965L2.19555 5.80428L5.16336 2.5M2 5.81495H11.0427C12.676 5.81495 14 7.31142 14 9.1575C14 11.0035 12.676 12.5 11.0427 12.5H7.38875" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>Voltar
                    </Link>
                    <div className="w-px h-3 bg-brown/20"></div>
                    <div className="flex items-center gap-0.5">
                        <p className="body-16-medium text-brown">Comprar</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20">
                            <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor"/>
                        </svg>
                        <p className="body-16-medium text-brown">Casa</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20">
                            <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor"/>
                        </svg>
                        <p className="body-16-medium text-brown">Faro</p>
                    </div>
                </div>
                <Button variant="outline">Ver Todas</Button>
            </div>
            <div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div></div>
            <h2></h2>
            <div>
                <div></div>
                <div></div>
            </div>
            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </section>
    )
}