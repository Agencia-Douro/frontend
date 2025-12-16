import Image from "next/image";
import porto from "@/public/localizacoes/porto.jpg"
import aveiro from "@/public/localizacoes/aveiro.jpg"
import faro from "@/public/localizacoes/faro.jpg"
import coimbra from "@/public/localizacoes/coimbra.jpg"
import braga from "@/public/localizacoes/braga.jpg"
import lisboa from "@/public/localizacoes/lisboa.jpg"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ZonasMaisDesejadas() {
    return (
        <section className="bg-deaf mt-16 py-16">
            <div className="container">
                <div className="text-center flex flex-col items-center">
                    <h2 className="text-heading-dois">As zonas mais desejadas</h2>
                    <p className="mt-6 text-medium text-black-muted w-full md:w-[490px]">Descubra as regiões que atraem quem busca exclusividade, conforto e um estilo de vida sem igual.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
                    <div className="overflow-hidden w-full max-h-58 group relative">
                        <Image src={porto} alt="teste-image" className="object-cover bg-center" />
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Porto</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis?distrito=Porto">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-full max-h-58 group relative">
                        <Image src={aveiro} alt="teste-image" className="object-cover bg-center" />
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Aveiro</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis?distrito=Aveiro">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-full max-h-58 group relative">
                        <Image src={faro} alt="teste-image" className="object-cover bg-center" />
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Faro</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis?distrito=Faro">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-full max-h-58 group relative">
                        <Image src={coimbra} alt="teste-image" className="object-cover bg-center" />
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Coimbra</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis?distrito=Coimbra">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-full max-h-58 group relative">
                        <Image src={braga} alt="teste-image" className="object-cover bg-center" />
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Braga</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis?distrito=Braga">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-full max-h-58 group relative">
                        <Image src={lisboa} alt="teste-image" className="object-cover bg-center" />
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Lisboa</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis?distrito=Lisboa">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}   