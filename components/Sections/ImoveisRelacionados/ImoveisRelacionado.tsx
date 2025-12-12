import { Button } from "@/components/ui/button";
import Card from "../Imoveis/Card";
import imageTest from "@/public/test-Image.jpg";

export default function ImoveisRelacionados() {
    return (
        <section className="container py-16">
            <div className="flex justify-between items-center">
                <h2 className="text-heading-tres text-brown">Imóveis Relacionados</h2>
                {/*
                <div className="flex gap-2 items-center">
                    <Button variant="icon-brown">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown group-hover:text-white">
                            <path d="M6.52692 9.16658L10.9969 4.69657L9.81842 3.51807L3.33659 9.99992L9.81842 16.4817L10.9969 15.3032L6.52692 10.8332H16.6699V9.16658H6.52692Z" fill="currentColor"/>
                        </svg>
                    </Button>
                    <Button variant="icon-brown">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown group-hover:text-white">
                            <path d="M13.4731 9.16658L9.00308 4.69657L10.1816 3.51807L16.6634 9.99992L10.1816 16.4817L9.00308 15.3032L13.4731 10.8332H3.33008V9.16658H13.4731Z" fill="currentColor"/>
                        </svg>
                    </Button>
                </div> */}
            </div>
            <div className="pt-6 grid grid-cols-3 gap-4">
                <Card href="/imoveis/1" titulo="Imóvel 1" localizacao="Localização 1" preco="100000" image={imageTest.src} />
                <Card href="/imoveis/2" titulo="Imóvel 2" localizacao="Localização 2" preco="200000" image={imageTest.src} />
                <Card href="/imoveis/3" titulo="Imóvel 3" localizacao="Localização 3" preco="300000" image={imageTest.src} />
            </div>
        </section>
    )
}