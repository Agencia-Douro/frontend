"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select-line";
import { Checkbox } from "../ui/checkbox";
import { DISTRITOS, TIPOS_IMOVEL } from "@/app/shared/distritos";
import { useTranslations } from "next-intl";
import { propertiesApi } from "@/services/api";
import { Property } from "@/types/property";
import Image from "next/image";
import Logo from "@/public/Logo.png"
import { formatPriceNumber } from "@/lib/currency";


type TransactionType = "comprar" | "arrendar" | "empreendimentos" | "trespasse";

const heroImages = [
  "/hero/hero1.jpg",
  "/hero/hero2.jpg",
  "/hero/hero3.jpg",
];

export function Hero() {
  const t = useTranslations("Hero")
  const tPropertyTypes = useTranslations("PropertyTypes")
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [transactionType, setTransactionType] = useState<TransactionType>("comprar");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [tipologias, setTipologias] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

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
      setAnimationKey((prev) => prev + 1); // Força reinício da animação
    }, 8000); // Muda a cada 8 segundos

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

  const toggleTipologia = (value: number) => {
    setTipologias((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
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
    } else if (transactionType === "arrendar") {
      params.set("transactionType", "arrendar");
    } else if (transactionType === "empreendimentos") {
      params.set("isEmpreendimento", "true");
    } else if (transactionType === "trespasse") {
      params.set("transactionType", "trespasse");
    }

    // Localização = distrito
    if (localizacao) params.set("distrito", localizacao);

    // Tipo = propertyType
    if (tipo) params.set("propertyType", tipo);

    // Tipologia = bedrooms (múltipla seleção)
    if (tipologias.length > 0) params.set("bedrooms", tipologias.join(","));

    router.push(`/${locale}/imoveis?${params.toString()}`);
  };

  return (
    <section className="relative">
      {/* Hero com Carousel de Imagens */}
      <div className="relative w-full h-dvh">
        {/* Container das imagens com overflow hidden */}
        <div className="absolute inset-0 overflow-hidden">
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
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes progressFill {
              from {
                width: 0%;
              }
              to {
                width: 100%;
              }
            }
            .hero-progress-bar {
              animation: progressFill 8s linear forwards;
            }
          `
          }} />
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10 items-center">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setAnimationKey((prev) => prev + 1);
                }}
                className="relative w-8 py-2 cursor-pointer transition-all group flex items-center justify-center"
                aria-label={`Ir para imagem ${index + 1}`}
              >
                <div className="relative w-full h-[3px]">
                  {/* Background base para todos os indicadores */}
                  <div className={`absolute inset-0 ${index === currentImageIndex ? 'bg-white/40' : 'bg-white/30'}`} />
                  {/* Barra de progresso apenas para o indicador ativo */}
                  {index === currentImageIndex && (
                    <div
                      key={animationKey}
                      className="absolute top-0 left-0 h-full bg-white hero-progress-bar"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo sobre a imagem */}
        <div className="absolute inset-0 flex items-center justify-center py-16 md:py-20 lg:py-24">
          <div className="container px-4 w-full">
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
              {/* Logo - apenas desktop */}
              <motion.div
                className="hidden lg:flex justify-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <Image
                  src={Logo}
                  alt="Agência Douro"
                  width={400}
                  height={400}
                  className="w-auto h-auto max-w-[400px] brightness-0 invert opacity-60"
                  priority
                />
              </motion.div>

              {/* Título alinhado à esquerda */}
              <motion.h1
                className="text-deaf leading-tight heading-quatro-medium md:heading-tres-regular lg:heading-dois-medium
             drop-shadow-lg mb-6 md:mb-8 lg:mb-10 text-center text-balance md:px-8 max-w-full px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                {t("title")}
              </motion.h1>


              {/* Formulário de Pesquisa */}
              <motion.form
                className="w-full"
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
                      className="px-3 md:px-4.5 md:w-min whitespace-nowrap text-white body-14-medium"
                      onClick={() => setTransactionType("comprar")}
                    >
                      {t("buy")}
                    </Button>
                    <Button
                      type="button"
                      variant={transactionType === "arrendar" ? "gold" : "ghost"}
                      className="px-3 md:px-4.5 md:w-min whitespace-nowrap text-white body-14-medium"
                      onClick={() => setTransactionType("arrendar")}
                    >
                      {t("rent")}
                    </Button>
                    <Button
                      type="button"
                      variant={transactionType === "empreendimentos" ? "gold" : "ghost"}
                      className="px-3 md:px-4.5 md:w-min whitespace-nowrap text-white body-14-medium"
                      onClick={() => setTransactionType("empreendimentos")}
                    >
                      {t("developments")}
                    </Button>
                    <Button
                      type="button"
                      variant={transactionType === "trespasse" ? "gold" : "ghost"}
                      className="px-3 md:px-4.5 md:w-min whitespace-nowrap text-white body-14-medium"
                      onClick={() => setTransactionType("trespasse")}
                    >
                      {t("businessTransfer")}
                    </Button>
                  </div>
                </div>
                <div className="p-6 md:p-6 lg:p-8 bg-deaf">
                  {/* Layout Mobile */}
                  <div className="flex flex-col gap-4 lg:hidden">
                    {/* Campo de pesquisa */}
                    <div className="relative w-full" ref={searchRef}>
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="search-mobile">{t("search")}</Label>
                        <div className="relative">
                          <input
                            id="search-mobile"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                              if (searchResults.length > 0) setShowResults(true);
                            }}
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
                        <div className="absolute z-50 w-full mt-2 bg-white shadow-xl border border-muted max-h-[70vh] overflow-y-auto max-w-[1088px]">
                          <div className="p-2 space-y-1">
                            {searchResults.map((property) => (
                              <button
                                key={property.id}
                                onClick={() => handlePropertyClick(property.id)}
                                className="w-full p-2.5 hover:bg-muted/50 transition-all duration-200 text-left flex gap-3 group"
                              >
                                {property.image && (
                                  <div className="relative w-20 h-20 shrink-0 overflow-hidden shadow-sm">
                                    <Image
                                      src={property.image}
                                      alt={property.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0 py-0.5">
                                  <h4 className="body-14-medium text-black truncate group-hover:text-brown transition-colors">{property.title}</h4>
                                  <p className="text-xs text-grey truncate mt-0.5">
                                    {property.concelho}, {property.distrito}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="body-14-medium text-gold">
                                      {formatPriceNumber(property.price)}€
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-grey/40"></span>
                                    {property.bedrooms > 0 && (
                                      <span className="text-xs text-grey">
                                        T{property.bedrooms}
                                      </span>
                                    )}
                                    {property.usefulArea && (
                                      <>
                                        <span className="w-1 h-1 rounded-full bg-grey/40"></span>
                                        <span className="text-xs text-grey">
                                          {property.usefulArea}m²
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
                        <div className="absolute z-50 w-full mt-2 bg-white shadow-xl border border-muted p-6 text-center text-grey body-14-regular">
                          {t("noResults")}
                        </div>
                      )}
                    </div>

                    {/* Localização */}
                    <div className="flex flex-col gap-1 w-full">
                      <Label htmlFor="localizacao-mobile">{t("location")}</Label>
                      <Select value={localizacao} onValueChange={setLocalizacao}>
                        <SelectTrigger id="localizacao-mobile" name="localizacao">
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

                    {/* Tipo e Tipologia - Horizontal */}
                    <div className="flex flex-row gap-3 w-full">
                      <div className="flex flex-col gap-1 flex-1">
                        <Label htmlFor="tipo-mobile">{t("type")}</Label>
                        <Select value={tipo} onValueChange={setTipo}>
                          <SelectTrigger id="tipo-mobile" name="tipo">
                            <SelectValue placeholder={t("select")} />
                          </SelectTrigger>
                          <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                            {TIPOS_IMOVEL.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tPropertyTypes(tipo.labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <Label htmlFor="tipologia-mobile">{t("typology")}</Label>
                        <Select>
                          <SelectTrigger id="tipologia-mobile" name="tipologia">
                            <SelectValue placeholder={tipologias.length > 0 ? tipologias.sort((a, b) => a - b).map(t => `T${t}`).join(", ") : t("select")} />
                          </SelectTrigger>
                          <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                            {[0, 1, 2, 3, 4].map((num) => (
                              <div
                                key={num}
                                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted"
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleTipologia(num);
                                }}
                              >
                                <Checkbox
                                  id={`tipologia-mobile-${num}`}
                                  checked={tipologias.includes(num)}
                                  onCheckedChange={() => toggleTipologia(num)}
                                />
                                <label
                                  htmlFor={`tipologia-mobile-${num}`}
                                  className="text-sm font-medium cursor-pointer flex-1"
                                >
                                  T{num}
                                </label>
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Layout Desktop */}
                  <div className="hidden lg:flex lg:flex-row gap-3 items-end">
                    {/* Campo de pesquisa */}
                    <div className="relative flex-1" ref={searchRef}>
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="search-desktop">{t("search")}</Label>
                        <div className="relative">
                          <input
                            id="search-desktop"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                              if (searchResults.length > 0) setShowResults(true);
                            }}
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
                        <div className="remove-scrollbar p-2 space-y-1 absolute z-50 mt-2 bg-white shadow-xl max-h-96 overflow-y-auto min-w-[calc(100%-64px)]">
                          {searchResults.map((property) => (
                            <button
                              key={property.id}
                              onClick={() => handlePropertyClick(property.id)}
                              className="w-full p-2 hover:bg-muted/50 transition-all duration-200 text-left flex gap-4 group"
                            >
                              {property.image && (
                                <div className="relative size-20 shrink-0 overflow-hidden shadow-sm">
                                  <Image
                                    src={property.image}
                                    alt={property.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 py-1">
                                <h4 className="body-16-medium text-black truncate group-hover:text-brown transition-colors">{property.title}</h4>
                                <p className="body-14-regular text-grey truncate mt-1">
                                  {property.concelho}, {property.distrito}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="body-16-medium text-gold">
                                    {formatPriceNumber(property.price)}€
                                  </span>
                                  <span className="size-0.5 rounded-full bg-grey/40"></span>
                                  {property.bedrooms > 0 && (
                                    <span className="body-14-regular text-grey">
                                      T{property.bedrooms}
                                    </span>
                                  )}
                                  {property.usefulArea && (
                                    <>
                                      <span className="size-0.5 rounded-full bg-grey/40"></span>
                                      <span className="body-14-regular text-grey">
                                        {property.usefulArea}m²
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
                        <div className="absolute z-50 w-full mt-2 bg-white shadow-xl p-6 text-center text-grey body-14-regular">
                          {t("noResults")}
                        </div>
                      )}
                    </div>

                    {/* Localização */}
                    <div className="flex flex-col gap-1 flex-1">
                      <Label htmlFor="localizacao-desktop">{t("location")}</Label>
                      <Select value={localizacao} onValueChange={setLocalizacao}>
                        <SelectTrigger id="localizacao-desktop" name="localizacao">
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

                    {/* Tipo */}
                    <div className="flex flex-col gap-1 flex-1">
                      <Label htmlFor="tipo-desktop">{t("type")}</Label>
                      <Select value={tipo} onValueChange={setTipo}>
                        <SelectTrigger id="tipo-desktop" name="tipo">
                          <SelectValue placeholder={t("select")} />
                        </SelectTrigger>
                        <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                          {TIPOS_IMOVEL.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tPropertyTypes(tipo.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tipologia */}
                    <div className="flex flex-col gap-1 flex-1">
                      <Label htmlFor="tipologia-desktop">{t("typology")}</Label>
                      <Select>
                        <SelectTrigger id="tipologia-desktop" name="tipologia">
                          <SelectValue placeholder={tipologias.length > 0 ? tipologias.sort((a, b) => a - b).map(t => `T${t}`).join(", ") : t("select")} />
                        </SelectTrigger>
                        <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                          {[0, 1, 2, 3, 4].map((num) => (
                            <div
                              key={num}
                              className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleTipologia(num);
                              }}
                            >
                              <Checkbox
                                id={`tipologia-desktop-${num}`}
                                checked={tipologias.includes(num)}
                                onCheckedChange={() => toggleTipologia(num)}
                              />
                              <label
                                htmlFor={`tipologia-desktop-${num}`}
                                className="text-sm font-medium cursor-pointer flex-1"
                              >
                                T{num}
                              </label>
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {/* Botão Pesquisar */}
                <Button type="submit" variant="gold" className="whitespace-nowrap px-8 w-full">
                  {t("searchButton")}
                </Button>
              </motion.form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}