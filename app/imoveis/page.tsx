import Card from "@/components/Sections/Imoveis/Card";
import Sidebar from "@/components/sidebar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-flat";
import testImage from "@/public/test-Image.jpg"

export default function Imoveis() {
    return (
        <section className="h-[calc(100vh-73px)]">
            <div className="container flex divide-x divide-[#EAE6DF] h-full">
                <Sidebar />
                <div className="border-r border-[#EAE6DF] bg-deaf">
                    <div className="px-6 py-4 flex justify-between border-b border-[#EAE6DF]">
                        <div className="flex items-center gap-4">
                            <p><span>1 - 20</span> de <span>125</span> imóveis </p>
                            <div className="bg-white shadow-pretty divide-x divide-muted">
                                <button className="cursor-pointer p-1.5 hover:bg-deaf">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-black-grey">
                                        <path d="M8.33333 4.79163L3.125 9.99996L8.33333 15.2083M3.75 9.99996H16.875" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                                <button className="cursor-pointer p-1.5 hover:bg-deaf">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-black-muted">
                                        <path d="M11.6667 4.79163L16.875 9.99996L11.6667 15.2083M16.25 9.99996H3.125" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="tipo" className="body-14-medium text-grey whitespace-nowrap">Ordenar por:</Label>
                            <Select>
                                <SelectTrigger id="tipo" name="tipo">
                                    <SelectValue placeholder="Mais recentes" />
                                </SelectTrigger>
                                <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                    <SelectItem value="mais-recentes">Mais recentes</SelectItem>
                                    <SelectItem value="mais antigos">Mais antigos</SelectItem>
                                    <SelectItem value="menor-preco">Menos preço</SelectItem>
                                    <SelectItem value="maior-preco">Maior preço</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                        <Card image={testImage} href="/imoveis/1" titulo="Apartamento T3 com varandas" localizacao="Canidelo, Vila nova de gaia" preco="395000" />
                        <Card image={testImage} href="/imoveis/2" titulo="Apartamento T2 com varandas" localizacao="Canidelo, Vila nova de gaia" preco="295000" />
                        <Card image={testImage} href="/imoveis/3" titulo="Apartamento T1 com varandas" localizacao="Canidelo, Vila nova de gaia" preco="195000" />
                        <Card image={testImage} href="/imoveis/4" titulo="Apartamento T0 com varandas" localizacao="Canidelo, Vila nova de gaia" preco="95000" />
                        <Card image={testImage} href="/imoveis/5" titulo="Apartamento T0 com varandas" localizacao="Canidelo, Vila nova de gaia" preco="95000" />
                    </div>
                </div>
            </div>
        </section>
    )
}