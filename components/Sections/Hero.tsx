"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select-line";
import HeroImage from "@/public/hero-image.png";
import { DISTRITOS, TIPOS_IMOVEL } from "@/app/shared/distritos";

type TransactionType = "comprar" | "arrendar" | "investir";

export default function Hero() {
    const router = useRouter();
    const [transactionType, setTransactionType] = useState<TransactionType>("comprar");
    const [localizacao, setLocalizacao] = useState<string>("");
    const [tipo, setTipo] = useState<string>("");
    const [preco, setPreco] = useState<string>("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();

        // Mapear transactionType para o formato correto da API
        if (transactionType === "comprar") {
            params.set("transactionType", "comprar");
        } else if (transactionType === "arrendar") {
            params.set("transactionType", "arrendar");
        } else if (transactionType === "investir") {
            params.set("transactionType", "vender");
        }

        // Localização = distrito
        if (localizacao) params.set("distrito", localizacao);

        // Tipo = propertyType
        if (tipo) params.set("propertyType", tipo);

        // Preço = maxPrice (extrair o valor máximo do range)
        if (preco) {
            const maxPrice = preco.split("-")[1];
            params.set("maxPrice", maxPrice);
        }

        router.push(`/imoveis?${params.toString()}`);
    };

    return (
        <section className="mt-6 md:mt-10 lg:mt-12 xl:mt-16 container relative flex justify-center lg:block">
            <div className="flex flex-col md:items-center lg:items-start md:max-w-[616px] z-100 w-full">
                <h1 className="text-balance heading-quatro-regular md:heading-tres-medium lg:heading-dois-medium xl:heading-um-medium md:text-center lg:text-start">A imobiliária mais exclusiva de portugal.</h1>
                <p className="xl:mt-8 lg:mt-6 mt-4 body-16-regular text-black-muted max-w-[540px] md:text-center lg:text-start">Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.</p>
                <form className="mt-4 md:mt-6 lg:mt-10 xl:mt-12 w-full" onSubmit={handleSearch}>
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-row w-full">
                            <Button
                                type="button"
                                variant={transactionType === "comprar" ? "gold" : "ghost"}
                                className="px-4.5 w-1/3 md:w-min"
                                onClick={() => setTransactionType("comprar")}
                            >
                                Comprar
                            </Button>
                            <Button
                                type="button"
                                variant={transactionType === "arrendar" ? "gold" : "ghost"}
                                className="px-4.5 w-1/3 md:w-min"
                                onClick={() => setTransactionType("arrendar")}
                            >
                                Arrendar
                            </Button>
                            <Button
                                type="button"
                                variant={transactionType === "investir" ? "gold" : "ghost"}
                                className="px-4.5 w-1/3 md:w-min"
                                onClick={() => setTransactionType("investir")}
                            >
                                Investir
                            </Button>
                        </div>
                        <Button type="submit" variant="brown" className="px-4.5 hidden md:block">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="size-5">
                                <path d="M14.1666 14.1667L17.5 17.5M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </div>
                    <div className="p-4 flex flex-col md:flex-row gap-4 bg-white">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="localizacao">Localização</Label>
                            <Select value={localizacao} onValueChange={setLocalizacao}>
                                <SelectTrigger id="localizacao" name="localizacao">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DISTRITOS.map((distrito) => (
                                        <SelectItem key={distrito} value={distrito}>
                                            {distrito}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="tipo">Tipo</Label>
                            <Select value={tipo} onValueChange={setTipo}>
                                <SelectTrigger id="tipo" name="tipo">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                    {TIPOS_IMOVEL.map((tipo) => (
                                        <SelectItem key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="preco">Preço Máximo</Label>
                            <Select value={preco} onValueChange={setPreco}>
                                <SelectTrigger id="preco" name="preco">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                    <SelectItem value="0-100000">100.000€</SelectItem>
                                    <SelectItem value="100000-200000">200.000€</SelectItem>
                                    <SelectItem value="100000-500000">500.000€</SelectItem>
                                    <SelectItem value="500000-1000000">1.000.000€</SelectItem>
                                    <SelectItem value="1000000-2000000">2.000.000€</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" variant="brown" className="px-4.5 md:hidden block w-full">Pesquisar</Button>
                </form>
            </div>
            <Image
                src={HeroImage}
                alt="Hero Image"
                width={511}
                height={382}
                className="absolute top-px left-[58.5%] -z-10 hidden lg:block"
            />
        </section>
    )
}