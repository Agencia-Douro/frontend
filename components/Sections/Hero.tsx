"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select-line";
import { DISTRITOS, TIPOS_IMOVEL } from "@/app/shared/distritos";
import Folha from "../Folha";
import { Pinyon_Script } from "next/font/google";
import ModelViewer from "../ModelViewer";

const pynionScript = Pinyon_Script({
    weight: "400",
    subsets: ["latin"],
});

type TransactionType = "comprar" | "arrendar" | "trespasse";

export default function Hero() {
    const router = useRouter();
    const [transactionType, setTransactionType] = useState<TransactionType>("comprar");
    const [localizacao, setLocalizacao] = useState<string>("");
    const [tipo, setTipo] = useState<string>("");
    const [preco, setPreco] = useState<string>("");
    const [shouldAnimate, setShouldAnimate] = useState(false);

    // Limpar preço quando mudar o tipo de transação
    useEffect(() => {
        setPreco("");
    }, [transactionType]);

    // Iniciar animações após a splash screen desaparecer
    // Splash screen: 2s mínimo + 400ms fade out = 2.4s total
    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldAnimate(true);
        }, 2400);

        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();

        // Mapear transactionType para o formato correto da API
        if (transactionType === "comprar") {
            params.set("transactionType", "comprar");
        } else if (transactionType === "arrendar") {
            params.set("transactionType", "arrendar");
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
        <section className="mt-6 md:mt-10 lg:mt-12 xl:mt-16 container relative">
            <Folha className="top-12 left-0 rotate-30 opacity-30 hidden lg:block text-brown" />
            <div className="flex justify-between items-center gap-4">
                <motion.div
                    className="flex flex-col md:max-w-[616px] w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.h1
                        className={`text-balance heading-quatro-regular md:heading-tres-medium lg:heading-dois-medium xl:heading-um-medium ${pynionScript.className}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        A imobiliária mais exclusiva de Portugal.
                    </motion.h1>
                    <motion.p
                        className="xl:mt-8 lg:mt-6 mt-4 body-18-regular text-black-muted max-w-[540px] text-balance hidden md:block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    >
                        Descubra imóveis exclusivos em Portugal com a nossa imobiliária especializada.
                    </motion.p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="hidden lg:block"
                >
                    <ModelViewer
                        src="/model3.gltf"
                        alt="Modelo 3D"
                        autoRotate
                        cameraControls
                        style={{ width: '700px', height: '550px' }}
                    />
                </motion.div>
            </div>
            <motion.form
                className="mt-4 md:mt-6 lg:mt-10 xl:mt-12 w-full max-w-6xl mx-auto"
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 30 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
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
                            variant={transactionType === "trespasse" ? "gold" : "ghost"}
                            className="px-4.5 w-1/3 md:w-min"
                            onClick={() => setTransactionType("trespasse")}
                        >
                            Trespasse
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
                                {transactionType === "arrendar" ? (
                                    <>
                                        <SelectItem value="0-500">500€</SelectItem>
                                        <SelectItem value="500-1000">1.000€</SelectItem>
                                        <SelectItem value="1000-1500">1.500€</SelectItem>
                                        <SelectItem value="1500-2000">2.000€</SelectItem>
                                        <SelectItem value="2000-3000">3.000€</SelectItem>
                                        <SelectItem value="3000-5000">5.000€</SelectItem>
                                    </>
                                ) : (
                                    <>
                                        <SelectItem value="0-100000">100.000€</SelectItem>
                                        <SelectItem value="100000-200000">200.000€</SelectItem>
                                        <SelectItem value="200000-500000">500.000€</SelectItem>
                                        <SelectItem value="500000-1000000">1.000.000€</SelectItem>
                                        <SelectItem value="1000000-2000000">2.000.000€</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button type="submit" variant="brown" className="px-4.5 md:hidden block w-full">Pesquisar</Button>
            </motion.form>
        </section>
    )
}