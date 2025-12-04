"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select-line";
import HeroImage from "@/public/hero-image.png";

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
        params.set("transacao", transactionType);

        if (localizacao) params.set("localizacao", localizacao);
        if (tipo) params.set("tipo", tipo);
        if (preco) params.set("preco", preco);

        router.push(`/imoveis?${params.toString()}`);
    };

    return (
        <div className="mt-16 container relative">
            <div className="max-w-[616px] z-100">
                <h1 className="heading-um-medium">A imobiliária mais exclusiva de portugal.</h1>
                <p className="mt-8 body-16-regular text-black-muted max-w-[540px]">Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor
                    sit amet Lorem ipsum dolor sit amet.</p>
                <form className="mt-12" onSubmit={handleSearch}>
                    <div className="flex justify-between items-center">
                        <div className="flex">
                            <Button
                                type="button"
                                variant={transactionType === "comprar" ? "gold" : "ghost"}
                                className="px-4.5"
                                onClick={() => setTransactionType("comprar")}
                            >
                                Comprar
                            </Button>
                            <Button
                                type="button"
                                variant={transactionType === "arrendar" ? "gold" : "ghost"}
                                className="px-4.5"
                                onClick={() => setTransactionType("arrendar")}
                            >
                                Arrendar
                            </Button>
                            <Button
                                type="button"
                                variant={transactionType === "investir" ? "gold" : "ghost"}
                                className="px-4.5"
                                onClick={() => setTransactionType("investir")}
                            >
                                Investir
                            </Button>
                        </div>
                        <Button type="submit" variant="brown" className="px-4.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="size-5">
                                <path d="M14.1666 14.1667L17.5 17.5M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </div>
                    <div className="p-4 flex gap-4 bg-white">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="localizacao">Localização</Label>
                            <Select value={localizacao} onValueChange={setLocalizacao}>
                                <SelectTrigger id="localizacao" name="localizacao">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aveiro">Aveiro</SelectItem>
                                    <SelectItem value="beja">Beja</SelectItem>
                                    <SelectItem value="braga">Braga</SelectItem>
                                    <SelectItem value="castelo-branco">Castelo Branco</SelectItem>
                                    <SelectItem value="coimbra">Coimbra</SelectItem>
                                    <SelectItem value="braganca">Braganca</SelectItem>
                                    <SelectItem value="evora">Évora</SelectItem>
                                    <SelectItem value="faro">Faro</SelectItem>
                                    <SelectItem value="guarda">Guarda</SelectItem>
                                    <SelectItem value="lisboa">Lisboa</SelectItem>
                                    <SelectItem value="leiria">Leiria</SelectItem>
                                    <SelectItem value="portalegre">Portalegre</SelectItem>
                                    <SelectItem value="porto">Porto</SelectItem>
                                    <SelectItem value="santarem">Santarém</SelectItem>
                                    <SelectItem value="setubal">Setúbal</SelectItem>
                                    <SelectItem value="viana-do-castelo">Viana do Castelo</SelectItem>
                                    <SelectItem value="viseu">Viseu</SelectItem>
                                    <SelectItem value="vila-real">Vila Real</SelectItem>
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
                                    <SelectItem value="moradia">Moradia</SelectItem>
                                    <SelectItem value="apartamento">Apartamento</SelectItem>
                                    <SelectItem value="predio">Prédio</SelectItem>
                                    <SelectItem value="terreno">Terreno</SelectItem>
                                    <SelectItem value="escritorio">Escritório</SelectItem>
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
                </form>
            </div>
            <Image
                src={HeroImage}
                alt="Hero Image"
                width={511}
                height={382}
                className="absolute top-px left-[58.5%] -z-10 hidden lg:block"
            />
        </div>
    )
}