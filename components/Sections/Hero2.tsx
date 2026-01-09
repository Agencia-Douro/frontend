"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select-line";
import { DISTRITOS, TIPOS_IMOVEL } from "@/app/shared/distritos";
import { useTranslations } from "next-intl";
import { propertiesApi } from "@/services/api";
import { Property } from "@/types/property";
import Image from "next/image";


type TransactionType = "comprar" | "empreendimentos" | "trespasse";

const heroImages = [
  "/hero/hero1.jpg",
  "/hero/hero2.jpg",
  "/hero/hero3.jpg",
];

export function Hero2() {
  const t = useTranslations("Hero")
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [transactionType, setTransactionType] = useState<TransactionType>("comprar");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [tipologia, setTipologia] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estados para pesquisa com autocomplete
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Carousel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000); // Muda a cada 6 segundos

    return () => clearInterval(interval);
  }, []);

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
    <section className="relative">
      {/* Hero com Carousel de Imagens */}
      <div className="relative w-full h-[68vh] md:h-[78vh] lg:h-[83vh] overflow-hidden bg-brown rounded-b-3xl">
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt={`Hero ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
              unoptimized
            />
            <div className="absolute inset-0 bg-black/45" />
          </motion.div>
        ))}


        {/* Indicadores do carousel */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-1 transition-all ${index === currentImageIndex ? "bg-white w-8" : "bg-white/50 w-8"
                }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>

        {/* Conteúdo sobre a imagem */}
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {/* Título alinhado à esquerda */}
              <motion.h1
                className="text-deaf leading-tight 
             md:heading-dois-medium lg:heading-dois-medium 
             drop-shadow-lg mb-6 md:mb-8 lg:mb-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {t("title")}
              </motion.h1>


              {/* Formulário de Pesquisa */}
              <motion.form
                className="w-full rounded-lg shadow-2xl overflow-hidden"
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <div className="flex justify-between items-center w-full border-b border-brown/10">
                  <div className="flex flex-row w-full gap-0 overflow-x-auto">
                    <Button
                      type="button"
                      variant={transactionType === "comprar" ? "gold" : "ghost"}
                      className="px-4.5 md:w-min whitespace-nowrap text-white"
                      onClick={() => setTransactionType("comprar")}
                    >
                      {t("buy")}
                    </Button>
                    <Button
                      type="button"
                      variant={transactionType === "empreendimentos" ? "gold" : "ghost"}
                      className="px-4.5 md:w-min whitespace-nowrap text-white"
                      onClick={() => setTransactionType("empreendimentos")}
                    >
                      {t("developments")}
                    </Button>
                    <Button
                      type="button"
                      variant={transactionType === "trespasse" ? "gold" : "ghost"}
                      className="px-4.5 md:w-min whitespace-nowrap text-white"
                      onClick={() => setTransactionType("trespasse")}
                    >
                      {t("businessTransfer")}
                    </Button>
                  </div>
                </div>
                <div className="p-6 md:p-8 bg-deaf">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
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

                    {/* Filtros */}
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
                {/* Botão Pesquisar */}
                <Button type="submit" variant="gold" className="whitespace-nowrap px-8 w-full">
                  Encontrar
                </Button>
              </motion.form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}