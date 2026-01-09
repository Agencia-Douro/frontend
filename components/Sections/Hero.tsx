"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select-line";
import { DISTRITOS, TIPOS_IMOVEL } from "@/app/shared/distritos";
import Folha from "../Folha";
import { Playfair_Display } from "next/font/google";
import ModelViewer from "../ModelViewer";
import { useTranslations } from "next-intl";
import { propertiesApi } from "@/services/api";
import { Property } from "@/types/property";
import Image from "next/image";

const playfairDisplay = Playfair_Display({
    weight: ["400", "700"],
    subsets: ["latin"],
});

type TransactionType = "comprar" | "empreendimentos" | "trespasse";

export default function Hero() {
    const t = useTranslations("Hero")
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const [transactionType, setTransactionType] = useState<TransactionType>("comprar");
    const [localizacao, setLocalizacao] = useState<string>("");
    const [tipo, setTipo] = useState<string>("");
    const [tipologia, setTipologia] = useState<string>("");
    const [shouldAnimate, setShouldAnimate] = useState(true);

    // Estados para pesquisa com autocomplete
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Property[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce para pesquisa
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true);
                try {
                    const results = await propertiesApi.search(searchQuery, 5, locale);
                    setSearchResults(results);
                    setShowResults(true);
                } catch (error) {
                    console.error("Erro ao buscar imóveis:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, locale]);

    // Fechar resultados ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePropertyClick = (propertyId: string) => {
        router.push(`/${locale}/imoveis/${propertyId}`);
        setShowResults(false);
        setSearchQuery("");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();

        // Se houver uma pesquisa por texto, usar isso
        if (searchQuery.trim()) {
            params.set("search", searchQuery.trim());
        }

        // Mapear transactionType para o formato correto da API
        if (transactionType === "comprar") {
            params.set("transactionType", "comprar");
        } else if (transactionType === "empreendimentos") {
            params.set("isEmpreendimento", "true");
        } else if (transactionType === "trespasse") {
            params.set("transactionType", "trespasse");
        }

        // Localização = distrito
        if (localizacao) params.set("distrito", localizacao);

        // Tipo = propertyType
        if (tipo) params.set("propertyType", tipo);

        // Tipologia = bedrooms
        if (tipologia) params.set("bedrooms", tipologia);

        router.push(`/${locale}/imoveis?${params.toString()}`);
    };

    return (

        <section className="mt-6 md:mt-10 lg:mt-12 xl:mt-16 container relative">

            <Folha className="top-[50px] left-0 rotate-30 opacity-30 block lg:hidden text-brown" />
            <Folha className="top-[400px] left-[150px] rotate-310 opacity-30 block lg:hidden text-brown" />
            <Folha className="top-12 left-0 rotate-30 opacity-30 hidden lg:block text-brown" />
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-0 lg:gap-4 min-h-[60vh] lg:min-h-0">
                {/* Logo 3D - aparece primeiro no mobile, à direita no desktop */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full lg:w-auto flex justify-center lg:justify-start lg:order-2"
                >
                    <ModelViewer
                        autoRotate={false}
                        cameraControls
                        initialRotation={[0, 0, 0]}
                        style={{ width: '100%', maxWidth: '450px', height: '450px', touchAction: 'pan-y' }}
                        className="lg:w-[700px]! lg:h-[550px]! lg:max-w-none! mx-auto lg:mx-0"
                    />
                </motion.div>

                {/* Conteúdo de texto - aparece segundo no mobile, à esquerda no desktop */}
                <motion.div
                    className="flex flex-col md:max-w-[616px] w-full text-center lg:text-left lg:order-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <motion.h1
                        className={`text-balance text-[2rem] leading-tight font-medium md:heading-tres-medium lg:heading-dois-medium xl:heading-um-medium ${playfairDisplay.className}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                    >
                        {t("title")}
                    </motion.h1>
                    <motion.p
                        className="xl:mt-8 lg:mt-6 mt-4 body-18-regular text-black-muted max-w-[540px] text-balance hidden md:block mx-auto lg:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
                    >
                        {t("description")}
                    </motion.p>
                </motion.div>
            </div>
            <motion.form
                className="mt-20 md:mt-6 lg:mt-10 xl:mt-12 w-full max-w-6xl mx-auto"
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 30 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            >
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-row w-full gap-0 overflow-x-auto">
                        <Button
                            type="button"
                            variant={transactionType === "comprar" ? "gold" : "ghost"}
                            className="px-4.5 md:w-min whitespace-nowrap"
                            onClick={() => setTransactionType("comprar")}
                        >
                            {t("buy")}
                        </Button>
                        <Button
                            type="button"
                            variant={transactionType === "empreendimentos" ? "gold" : "ghost"}
                            className="px-4.5 md:w-min whitespace-nowrap"
                            onClick={() => setTransactionType("empreendimentos")}
                        >
                            {t("developments")}
                        </Button>
                        <Button
                            type="button"
                            variant={transactionType === "trespasse" ? "gold" : "ghost"}
                            className="px-4.5 md:w-min whitespace-nowrap"
                            onClick={() => setTransactionType("trespasse")}
                        >
                            {t("businessTransfer")}
                        </Button>
                    </div>
                    <Button type="submit" variant="gold" className="px-4.5 hidden md:block">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="size-5">
                            <path d="M14.1666 14.1667L17.5 17.5M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </div>
                <div className="p-4 flex flex-col gap-4 bg-white">
                    {/* Campo de pesquisa com autocomplete */}
                    <div className="relative w-full" ref={searchRef}>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="search">{t("search")}</Label>
                            <div className="relative">
                                <input
                                    id="search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (searchResults.length > 0) setShowResults(true);
                                    }}
                                    placeholder={t("searchPlaceholder")}
                                    className="w-full body-14-medium py-2 px-0 text-black-muted border-b border-b-gold placeholder:text-black-muted focus:outline-none focus:border-b-brown"
                                />
                                {isSearching && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-brown border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resultados do autocomplete */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white shadow-lg max-h-96 overflow-y-auto">
                                {searchResults.map((property) => (
                                    <button
                                        key={property.id}
                                        onClick={() => handlePropertyClick(property.id)}
                                        className="w-full p-3 hover:bg-muted transition-colors text-left border-b last:border-b-0 flex gap-3"
                                    >
                                        {property.image && (
                                            <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
                                                <Image
                                                    src={property.image}
                                                    alt={property.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="body-14-medium truncate">{property.title}</h4>
                                            <p className="text-xs text-grey truncate">
                                                {property.concelho}, {property.distrito}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="body-14-medium text-brown">
                                                    €{property.price.toLocaleString()}
                                                </span>
                                                {property.bedrooms > 0 && (
                                                    <span className="text-xs text-grey">
                                                        T{property.bedrooms}
                                                    </span>
                                                )}
                                                {property.usefulArea && (
                                                    <span className="text-xs text-grey">
                                                        {property.usefulArea}m²
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
                            <div className="absolute z-50 w-full mt-1 bg-white shadow-lg p-4 text-center text-grey body-14-regular">
                                {t("noResults")}
                            </div>
                        )}
                    </div>

                    {/* Filtros existentes */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="localizacao">{t("location")}</Label>
                            <Select value={localizacao} onValueChange={setLocalizacao}>
                                <SelectTrigger id="localizacao" name="localizacao">
                                    <SelectValue placeholder={t("select")} />
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
                            <Label htmlFor="tipo">{t("type")}</Label>
                            <Select value={tipo} onValueChange={setTipo}>
                                <SelectTrigger id="tipo" name="tipo">
                                    <SelectValue placeholder={t("select")} />
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
                            <Label htmlFor="tipologia">{t("typology")}</Label>
                            <Select value={tipologia} onValueChange={setTipologia}>
                                <SelectTrigger id="tipologia" name="tipologia">
                                    <SelectValue placeholder={t("select")} />
                                </SelectTrigger>
                                <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                    <SelectItem value="0">T0</SelectItem>
                                    <SelectItem value="1">T1</SelectItem>
                                    <SelectItem value="2">T2</SelectItem>
                                    <SelectItem value="3">T3</SelectItem>
                                    <SelectItem value="4">T4</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <Button type="submit" variant="gold" className="px-4.5 md:hidden block w-full">{t("search")}</Button>
            </motion.form>
        </section>
    )
}