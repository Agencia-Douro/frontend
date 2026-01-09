"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import { DISTRITOS, DISTRITO_MUNICIPIOS, TIPOS_IMOVEL } from "@/app/shared/distritos"
import { useTranslations } from "next-intl"

interface SidebarProps {
    basePath?: string
    isOpen?: boolean
    onClose?: () => void
}

export default function Sidebar({ basePath = "/imoveis", isOpen = true, onClose }: SidebarProps) {
    const t = useTranslations("Sidebar");
    const router = useRouter()
    const searchParams = useSearchParams()
    const isFirstRender = useRef(true)

    // Determine initial selection based on URL params
    const getInitialSelection = () => {
        if (searchParams.get("isEmpreendimento") === "true") {
            return "empreendimentos"
        }
        return searchParams.get("transactionType") || "comprar"
    }

    const [selection, setSelection] = useState(getInitialSelection())
    const [isArrendar, setIsArrendar] = useState(searchParams.get("transactionType") === "arrendar")
    const [onlyFavorites, setOnlyFavorites] = useState(searchParams.get("onlyFavorites") === "true")
    const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "")
    const [propertyState, setPropertyState] = useState(searchParams.get("propertyState") || "")
    const [energyClass, setEnergyClass] = useState(searchParams.get("energyClass") || "")
    const [distrito, setDistrito] = useState(searchParams.get("distrito") || "")
    const [concelho, setConcelho] = useState(searchParams.get("concelho") || "")

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
    const [minUsefulArea, setMinUsefulArea] = useState(searchParams.get("minUsefulArea") || "")
    const [maxUsefulArea, setMaxUsefulArea] = useState(searchParams.get("maxUsefulArea") || "")
    const [bedrooms, setBedrooms] = useState<number[]>(
        searchParams.get("bedrooms")?.split(",").map(Number) || []
    )
    const [bathrooms, setBathrooms] = useState<number[]>(
        searchParams.get("bathrooms")?.split(",").map(Number) || []
    )

    const [resetKey, setResetKey] = useState(0)

    const [tipoImovelOpen, setTipoImovelOpen] = useState(true)
    const [quartosCasasBanhoOpen, setQuartosCasasBanhoOpen] = useState(true)
    const [precosAreaOpen, setPrecosAreaOpen] = useState(true)
    const [localizacaoOpen, setLocalizacaoOpen] = useState(true)
    const [estadoClasseOpen, setEstadoClasseOpen] = useState(true)

    // Get municipios based on selected distrito
    const municipios = distrito ? DISTRITO_MUNICIPIOS[distrito] || [] : []

    // Bloquear scroll quando sidebar mobile está aberto
    useEffect(() => {
        if (isOpen && window.innerWidth < 1280) { // xl breakpoint
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }, [isOpen]);

    // Reset concelho when distrito changes
    useEffect(() => {
        if (distrito && concelho) {
            const validMunicipios = DISTRITO_MUNICIPIOS[distrito] || []
            if (!validMunicipios.includes(concelho)) {
                setConcelho("")
            }
        }
    }, [distrito, concelho])

    const toggleBedroom = (value: number) => {
        setBedrooms((prev) =>
            prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
        )
    }

    const toggleBathroom = (value: number) => {
        setBathrooms((prev) =>
            prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
        )
    }

    // Apply filters when search button is clicked
    const handleSearch = () => {
        const params = new URLSearchParams()

        // Handle selection: empreendimentos = comprar + isEmpreendimento=true
        if (selection === "empreendimentos") {
            params.set("transactionType", "comprar")
            params.set("isEmpreendimento", "true")
        } else if (selection) {
            params.set("transactionType", selection)
        }

        if (isArrendar) params.set("transactionType", "arrendar")
        if (onlyFavorites) params.set("onlyFavorites", "true")
        if (propertyType) params.set("propertyType", propertyType)
        if (propertyState) params.set("propertyState", propertyState)
        if (energyClass) params.set("energyClass", energyClass)
        if (distrito) params.set("distrito", distrito)
        if (concelho) params.set("concelho", concelho)
        if (minPrice) params.set("minPrice", minPrice)
        if (maxPrice) params.set("maxPrice", maxPrice)
        if (minUsefulArea) params.set("minUsefulArea", minUsefulArea)
        if (maxUsefulArea) params.set("maxUsefulArea", maxUsefulArea)
        if (bedrooms.length > 0) params.set("bedrooms", bedrooms.join(","))
        if (bathrooms.length > 0) params.set("bathrooms", bathrooms.join(","))

        router.push(`${basePath}?${params.toString()}`)

        // Close mobile sidebar after search
        if (onClose) {
            onClose()
        }
    }

    const handleReset = () => {
        setSelection("comprar")
        setIsArrendar(false)
        setOnlyFavorites(false)
        setPropertyType("")
        setPropertyState("")
        setEnergyClass("")
        setDistrito("")
        setConcelho("")
        setMinPrice("")
        setMaxPrice("")
        setMinUsefulArea("")
        setMaxUsefulArea("")
        setBedrooms([])
        setBathrooms([])
        setResetKey(prev => prev + 1)
        router.push(basePath)
    }

    return (
        <>
            {/* Overlay para mobile */}
            {isOpen && (
                <div
                    className="xl:hidden fixed inset-0 top-16 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}
            <aside className={`min-w-[300px] max-w-[300px] border-x border-[#EAE6DF] h-[calc(100vh-73px)] bg-deaf hidden xl:block`}>
                <div className="flex flex-col h-full">
                    <div className="flex flex-col flex-1 overflow-y-auto remove-scrollbar">
                        <div className="p-4 border-b border-[#EAE6DF]">
                            <div className="flex">
                                <button
                                    type="button"
                                    onClick={() => setSelection("comprar")}
                                    className={`grow body-14-medium py-1.5 cursor-pointer ${selection === "comprar"
                                        ? "text-white bg-gold"
                                        : "text-brown bg-muted"
                                        }`}
                                >
                                    {t("buy")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelection("trespasse")}
                                    className={`grow body-14-medium py-1.5 cursor-pointer ${selection === "trespasse"
                                        ? "text-white bg-gold"
                                        : "text-brown bg-muted"
                                        }`}
                                >
                                    {t("businessTransfer")}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelection("empreendimentos")}
                                className={`grow body-14-medium py-1.5 cursor-pointer w-full ${selection === "empreendimentos"
                                    ? "text-white bg-gold"
                                    : "text-brown bg-muted"
                                    }`}
                            >
                                {t("developments")}
                            </button>
                        </div>
                        {/* 1. Tipo de Imóvel */}
                        <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
                            <button
                                type="button"
                                onClick={() => setTipoImovelOpen(!tipoImovelOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("propertyType")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${tipoImovelOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {tipoImovelOpen && (
                                <div className="space-y-3">
                                    <Label htmlFor="tipo">{t("propertyType")}</Label>
                                    <Select key={`propertyType-${resetKey}`} value={propertyType || undefined} onValueChange={setPropertyType}>
                                        <SelectTrigger id="tipo" name="tipo">
                                            <SelectValue placeholder={t("selectPropertyType")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIPOS_IMOVEL.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        {/* 2. Quartos e Casas de banho */}
                        <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
                            <button
                                type="button"
                                onClick={() => setQuartosCasasBanhoOpen(!quartosCasasBanhoOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("bedroomsAndBathrooms")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${quartosCasasBanhoOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {quartosCasasBanhoOpen && (
                                <>
                                    <div className="space-y-3">
                                        <Label>{t("bedrooms")}</Label>
                                        <div className="flex gap-2">
                                            {[0, 1, 2, 3, 4].map((num) => (
                                                <div key={num} className="flex items-center gap-1.5">
                                                    <Checkbox
                                                        id={`bedroom-${num}`}
                                                        checked={bedrooms.includes(num)}
                                                        onCheckedChange={() => toggleBedroom(num)}
                                                    />
                                                    <label
                                                        htmlFor={`bedroom-${num}`}
                                                        className="text-body-small font-medium cursor-pointer"
                                                    >
                                                        T{num}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>{t("bathrooms")}</Label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <div key={num} className="flex items-center gap-1.5">
                                                    <Checkbox
                                                        id={`bathroom-${num}`}
                                                        checked={bathrooms.includes(num)}
                                                        onCheckedChange={() => toggleBathroom(num)}
                                                    />
                                                    <label
                                                        htmlFor={`bathroom-${num}`}
                                                        className="text-body-small font-medium cursor-pointer"
                                                    >
                                                        {num}{num === 5 ? "+" : ""}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* 4. Preço e Área útil */}
                        <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
                            <button
                                type="button"
                                onClick={() => setPrecosAreaOpen(!precosAreaOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("priceAndArea")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${precosAreaOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {precosAreaOpen && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-xs text-black-muted">{t("minPrice")}</Label>
                                            <Input
                                                key={`minPrice-${resetKey}`}
                                                type="number"
                                                placeholder={t("minimum")}
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-xs text-black-muted">{t("maxPrice")}</Label>
                                            <Input
                                                key={`maxPrice-${resetKey}`}
                                                type="number"
                                                placeholder={t("maximum")}
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-xs text-black-muted">{t("minUsefulArea")}</Label>
                                            <Input
                                                key={`minUsefulArea-${resetKey}`}
                                                type="number"
                                                placeholder={t("minimum")}
                                                value={minUsefulArea}
                                                onChange={(e) => setMinUsefulArea(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-xs text-black-muted">{t("maxUsefulArea")}</Label>
                                            <Input
                                                key={`maxUsefulArea-${resetKey}`}
                                                type="number"
                                                placeholder={t("maximum")}
                                                value={maxUsefulArea}
                                                onChange={(e) => setMaxUsefulArea(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* 5. Localização */}
                        <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
                            <button
                                type="button"
                                onClick={() => setLocalizacaoOpen(!localizacaoOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("location")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${localizacaoOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {localizacaoOpen && (
                                <>
                                    <div className="space-y-3">
                                        <Label htmlFor="distrito">{t("district")}</Label>
                                        <Select
                                            key={`distrito-${resetKey}`}
                                            value={distrito || undefined}
                                            onValueChange={setDistrito}
                                        >
                                            <SelectTrigger id="distrito" name="distrito">
                                                <SelectValue placeholder={t("selectDistrict")} />
                                            </SelectTrigger>
                                            <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                                {DISTRITOS.map((d) => (
                                                    <SelectItem key={d} value={d}>
                                                        {d}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="concelho">{t("municipality")}</Label>
                                        <Select
                                            key={`concelho-${resetKey}`}
                                            value={concelho || undefined}
                                            onValueChange={setConcelho}
                                            disabled={!distrito}
                                        >
                                            <SelectTrigger id="concelho" name="concelho">
                                                <SelectValue
                                                    placeholder={
                                                        !distrito
                                                            ? t("selectDistrictFirst")
                                                            : t("selectMunicipality")
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                                {municipios.length > 0 ? (
                                                    municipios.map((m) => (
                                                        <SelectItem key={m} value={m}>
                                                            {m}
                                                        </SelectItem>
                                                    ))
                                                ) : null}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* 6. Estado do imóvel e Classe energética */}
                        <div className="p-4 flex flex-col gap-2 ]">
                            <button
                                type="button"
                                onClick={() => setEstadoClasseOpen(!estadoClasseOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("other")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${estadoClasseOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {estadoClasseOpen && (
                                <>
                                    <div className="space-y-3">
                                        <Label htmlFor="estado">{t("propertyState")}</Label>
                                        <Select key={`propertyState-${resetKey}`} value={propertyState || undefined} onValueChange={setPropertyState}>
                                            <SelectTrigger id="estado" name="estado">
                                                <SelectValue placeholder={t("propertyStates.new")} />
                                            </SelectTrigger>
                                            <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                                <SelectItem value="novo">{t("propertyStates.new")}</SelectItem>
                                                <SelectItem value="usado">{t("propertyStates.used")}</SelectItem>
                                                <SelectItem value="renovado">{t("propertyStates.renovated")}</SelectItem>
                                                <SelectItem value="em-construcao">{t("propertyStates.underConstruction")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="classe">{t("energyClass")}</Label>
                                        <Select key={`energyClass-${resetKey}`} value={energyClass || undefined} onValueChange={setEnergyClass}>
                                            <SelectTrigger id="classe" name="classe">
                                                <SelectValue placeholder="A+" />
                                            </SelectTrigger>
                                            <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                                <SelectItem value="B-">B-</SelectItem>
                                                <SelectItem value="C">C</SelectItem>
                                                <SelectItem value="D">D</SelectItem>
                                                <SelectItem value="E">E</SelectItem>
                                                <SelectItem value="F">F</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-4 border-t border-[#EAE6DF] flex gap-2 items-center">
                            <Switch
                                checked={isArrendar}
                                onCheckedChange={setIsArrendar}
                                className="cursor-pointer"
                            />
                            <p className="text-black-muted body-14-medium cursor-pointer" onClick={() => setIsArrendar(!isArrendar)}>{t("rent")}</p>
                        </div>
                        <div className="p-4 border-t border-[#EAE6DF] flex gap-2 items-center">
                            <Switch
                                checked={onlyFavorites}
                                onCheckedChange={setOnlyFavorites}
                                className="cursor-pointer"
                            />
                            <p className="text-black-muted body-14-medium cursor-pointer" onClick={() => setOnlyFavorites(!onlyFavorites)}>{t("favorites")}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5 p-4 border-t border-[#EAE6DF]">
                        <Button variant="gold" className="w-full" onClick={handleSearch}>
                            {t("search")}
                        </Button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="shadow-pretty w-full flex justify-center items-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive button-14-semibold bg-white text-black-muted px-3 py-2 cursor-pointer">{t("clear")}</button>
                    </div>
                </div>
            </aside>
            {/* Sidebar mobile */}
            <aside className={`xl:hidden fixed top-16 left-0 min-w-[300px] max-w-[300px] border-r border-[#EAE6DF] h-[calc(100dvh-64px)] bg-deaf z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex flex-col flex-1 overflow-y-auto remove-scrollbar">
                        <div className="p-4 border-b border-[#EAE6DF]">
                            <div className="flex">
                                <button
                                    type="button"
                                    onClick={() => setSelection("comprar")}
                                    className={`grow body-14-medium py-1.5 cursor-pointer ${selection === "comprar"
                                        ? "text-white bg-gold"
                                        : "text-brown bg-muted"
                                        }`}
                                >
                                    {t("buy")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelection("trespasse")}
                                    className={`grow body-14-medium py-1.5 cursor-pointer ${selection === "trespasse"
                                        ? "text-white bg-gold"
                                        : "text-brown bg-muted"
                                        }`}
                                >
                                    {t("businessTransfer")}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelection("empreendimentos")}
                                className={`grow body-14-medium py-1.5 cursor-pointer w-full ${selection === "empreendimentos"
                                    ? "text-white bg-gold"
                                    : "text-brown bg-muted"
                                    }`}
                            >
                                {t("developments")}
                            </button>
                        </div>
                        {/* 1. Tipo de Imóvel */}
                        <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
                            <button
                                type="button"
                                onClick={() => setTipoImovelOpen(!tipoImovelOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("propertyType")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${tipoImovelOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {tipoImovelOpen && (
                                <div className="space-y-3">
                                    <Label htmlFor="tipo-mobile">{t("propertyType")}</Label>
                                    <Select key={`propertyType-mobile-${resetKey}`} value={propertyType || undefined} onValueChange={setPropertyType}>
                                        <SelectTrigger id="tipo-mobile" name="tipo-mobile">
                                            <SelectValue placeholder={t("selectPropertyType")} />
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
                            )}
                        </div>
                        {/* 2. Quartos e Casas de banho */}
                        <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
                            <button
                                type="button"
                                onClick={() => setQuartosCasasBanhoOpen(!quartosCasasBanhoOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("bedroomsAndBathrooms")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${quartosCasasBanhoOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {quartosCasasBanhoOpen && (
                                <>
                                    <div className="space-y-3">
                                        <Label>{t("bedrooms")}</Label>
                                        <div className="flex gap-2">
                                            {[0, 1, 2, 3, 4].map((num) => (
                                                <div key={num} className="flex items-center gap-1.5">
                                                    <Checkbox
                                                        id={`bedroom-mobile-${num}`}
                                                        checked={bedrooms.includes(num)}
                                                        onCheckedChange={() => toggleBedroom(num)}
                                                    />
                                                    <label
                                                        htmlFor={`bedroom-mobile-${num}`}
                                                        className="text-body-small font-medium cursor-pointer"
                                                    >
                                                        T{num}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>{t("bathrooms")}</Label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <div key={num} className="flex items-center gap-1.5">
                                                    <Checkbox
                                                        id={`bathroom-mobile-${num}`}
                                                        checked={bathrooms.includes(num)}
                                                        onCheckedChange={() => toggleBathroom(num)}
                                                    />
                                                    <label
                                                        htmlFor={`bathroom-mobile-${num}`}
                                                        className="text-body-small font-medium cursor-pointer"
                                                    >
                                                        {num}{num === 5 ? "+" : ""}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* 4. Preço e Área útil */}
                        <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
                            <button
                                type="button"
                                onClick={() => setPrecosAreaOpen(!precosAreaOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("priceAndArea")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${precosAreaOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {precosAreaOpen && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-xs text-black-muted">{t("minPrice")}</Label>
                                            <Input
                                                key={`minPrice-mobile-${resetKey}`}
                                                type="number"
                                                placeholder={t("minimum")}
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-xs text-black-muted">{t("maxPrice")}</Label>
                                            <Input
                                                key={`maxPrice-mobile-${resetKey}`}
                                                type="number"
                                                placeholder={t("maximum")}
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-xs text-black-muted">{t("minUsefulArea")}</Label>
                                            <Input
                                                key={`minUsefulArea-mobile-${resetKey}`}
                                                type="number"
                                                placeholder={t("minimum")}
                                                value={minUsefulArea}
                                                onChange={(e) => setMinUsefulArea(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-xs text-black-muted">{t("maxUsefulArea")}</Label>
                                            <Input
                                                key={`maxUsefulArea-mobile-${resetKey}`}
                                                type="number"
                                                placeholder={t("maximum")}
                                                value={maxUsefulArea}
                                                onChange={(e) => setMaxUsefulArea(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* 5. Localização */}
                        <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
                            <button
                                type="button"
                                onClick={() => setLocalizacaoOpen(!localizacaoOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("location")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${localizacaoOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {localizacaoOpen && (
                                <>
                                    <div className="space-y-3">
                                        <Label htmlFor="distrito-mobile">{t("district")}</Label>
                                        <Select
                                            key={`distrito-mobile-${resetKey}`}
                                            value={distrito || undefined}
                                            onValueChange={setDistrito}
                                        >
                                            <SelectTrigger id="distrito-mobile" name="distrito-mobile">
                                                <SelectValue placeholder={t("selectDistrict")} />
                                            </SelectTrigger>
                                            <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                                {DISTRITOS.map((d) => (
                                                    <SelectItem key={d} value={d}>
                                                        {d}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="concelho-mobile">{t("municipality")}</Label>
                                        <Select
                                            key={`concelho-mobile-${resetKey}`}
                                            value={concelho || undefined}
                                            onValueChange={setConcelho}
                                            disabled={!distrito}
                                        >
                                            <SelectTrigger id="concelho-mobile" name="concelho-mobile">
                                                <SelectValue
                                                    placeholder={
                                                        !distrito
                                                            ? t("selectDistrictFirst")
                                                            : t("selectMunicipality")
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                                {municipios.length > 0 ? (
                                                    municipios.map((m) => (
                                                        <SelectItem key={m} value={m}>
                                                            {m}
                                                        </SelectItem>
                                                    ))
                                                ) : null}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* 6. Estado do imóvel e Classe energética */}
                        <div className="p-4 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => setEstadoClasseOpen(!estadoClasseOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                            >
                                <p className="body-16-medium text-black">{t("other")}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className={`text-gold transition-transform duration-200 ${estadoClasseOpen ? "" : "rotate-180"}`}
                                >
                                    <path
                                        d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                            {estadoClasseOpen && (
                                <>
                                    <div className="space-y-3">
                                        <Label htmlFor="estado-mobile">{t("propertyState")}</Label>
                                        <Select key={`propertyState-mobile-${resetKey}`} value={propertyState || undefined} onValueChange={setPropertyState}>
                                            <SelectTrigger id="estado-mobile" name="estado-mobile">
                                                <SelectValue placeholder={t("propertyStates.new")} />
                                            </SelectTrigger>
                                            <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                                <SelectItem value="novo">{t("propertyStates.new")}</SelectItem>
                                                <SelectItem value="usado">{t("propertyStates.used")}</SelectItem>
                                                <SelectItem value="renovado">{t("propertyStates.renovated")}</SelectItem>
                                                <SelectItem value="em-construcao">{t("propertyStates.underConstruction")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="classe-mobile">{t("energyClass")}</Label>
                                        <Select key={`energyClass-mobile-${resetKey}`} value={energyClass || undefined} onValueChange={setEnergyClass}>
                                            <SelectTrigger id="classe-mobile" name="classe-mobile">
                                                <SelectValue placeholder="A+" />
                                            </SelectTrigger>
                                            <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                                <SelectItem value="B-">B-</SelectItem>
                                                <SelectItem value="C">C</SelectItem>
                                                <SelectItem value="D">D</SelectItem>
                                                <SelectItem value="E">E</SelectItem>
                                                <SelectItem value="F">F</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Filtros adicionais mantidos */}
                        <div className="p-4 border-b border-[#EAE6DF] flex gap-2 items-center">
                            <Switch
                                checked={isArrendar}
                                onCheckedChange={setIsArrendar}
                                className="cursor-pointer"
                            />
                            <p className="text-black-muted body-14-medium cursor-pointer" onClick={() => setIsArrendar(!isArrendar)}>{t("rent")}</p>
                        </div>
                        <div className="p-4 border-b border-[#EAE6DF] flex gap-2 items-center">
                            <Switch
                                checked={onlyFavorites}
                                onCheckedChange={setOnlyFavorites}
                                className="cursor-pointer"
                            />
                            <p className="text-black-muted body-14-medium cursor-pointer" onClick={() => setOnlyFavorites(!onlyFavorites)}>{t("favorites")}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5 p-4 border-t border-[#EAE6DF]">
                        <Button variant="gold" className="w-full" onClick={handleSearch}>
                            {t("search")}
                        </Button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="shadow-pretty w-full flex justify-center items-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive button-14-semibold bg-white text-black-muted px-3 py-2 cursor-pointer">{t("clear")}</button>
                    </div>
                </div>
            </aside>
        </>
    )
}