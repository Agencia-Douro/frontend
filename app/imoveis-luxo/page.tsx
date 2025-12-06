import Card from "@/components/Sections/Imoveis/Card";
import Sidebar from "@/components/sidebar";
import testImage from "@/public/test-Image.jpg"

export default function Imoveis() {
    return (
        <section className="h-[calc(100vh-73px)]">
            <div className="container flex divide-x divide-[#EAE6DF] h-full">
                <Sidebar />
                <div className="border-r border-[#EAE6DF] bg-deaf">
                    <div></div>
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