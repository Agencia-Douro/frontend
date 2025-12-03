import Image from "next/image";
import img from "@/public/test-Image.jpg"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ZonasMaisDesejadas() {
    return (
        <section className="bg-deaf mt-16 py-16">
            <div className="container">
                <div className="text-center flex flex-col items-center">
                    <h2 className="text-heading-dois">As zonas mais desejadas</h2>
                    <p className="mt-6 text-medium text-black-muted w-[490px]">Descubra as regiões que atraem quem busca exclusividade, conforto e um estilo de vida sem igual.</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-12">
                    <div className="overflow-hidden w-[405px] max-h-58 group relative">
                        <Image src={img} alt="teste-image" className="object-cover bg-center"/>
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/100 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Douro</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-[405px] max-h-58 group relative">
                        <Image src={img} alt="teste-image" className="object-cover bg-center"/>
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/100 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Douro</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-[405px] max-h-58 group relative">
                        <Image src={img} alt="teste-image" className="object-cover bg-center"/>
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/100 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Douro</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-[405px] max-h-58 group relative">
                        <Image src={img} alt="teste-image" className="object-cover bg-center"/>
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/100 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Douro</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-[405px] max-h-58 group relative">
                        <Image src={img} alt="teste-image" className="object-cover bg-center"/>
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/100 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Douro</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden w-[405px] max-h-58 group relative">
                        <Image src={img} alt="teste-image" className="object-cover bg-center"/>
                        <div className="group-hover:opacity-100 opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/100 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="translate-y-16 group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">Douro</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href="/imoveis">Ver Todos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}