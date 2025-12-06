"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"

export default function Sidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [transactionType, setTransactionType] = useState(searchParams.get("transactionType") || "comprar")
  const [isEmpreendimento, setIsEmpreendimento] = useState(searchParams.get("isEmpreendimento") === "true")
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

  const [imovelOpen, setImovelOpen] = useState(true)
  const [localizacaoOpen, setLocalizacaoOpen] = useState(true)
  const [outroOpen, setOutroOpen] = useState(true)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (transactionType) params.set("transactionType", transactionType)
    if (isEmpreendimento) params.set("isEmpreendimento", "true")
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

    router.push(`/imoveis?${params.toString()}`)
  }

  const handleReset = () => {
    setTransactionType("comprar")
    setIsEmpreendimento(false)
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
    router.push("/imoveis")
  }

  return (
    <aside className="w-[300px] border-x border-[#EAE6DF] h-full bg-deaf">
      <form className="flex flex-col h-full" onSubmit={handleSubmit}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4 border-b border-[#EAE6DF]">
            <div className="flex">
              <button
                type="button"
                onClick={() => setTransactionType("comprar")}
                className={`grow body-14-medium py-1.5 ${transactionType === "comprar"
                    ? "text-white bg-brown"
                    : "text-brown bg-muted"
                  }`}
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("arrendar")}
                className={`grow body-14-medium py-1.5 ${transactionType === "arrendar"
                    ? "text-white bg-brown"
                    : "text-brown bg-muted"
                  }`}
              >
                Arrendar
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("vender")}
                className={`grow body-14-medium py-1.5 ${transactionType === "vender"
                    ? "text-white bg-brown"
                    : "text-brown bg-muted"
                  }`}
              >
                Vender
              </button>
            </div>
          </div>
          <div className="p-4 border-b border-[#EAE6DF] flex gap-2">
            <Switch
              checked={isEmpreendimento}
              onCheckedChange={setIsEmpreendimento}
            />
            <p className="text-black-muted body-14-medium">Empreendimentos</p>
          </div>
          <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
            <button
              type="button"
              onClick={() => setImovelOpen(!imovelOpen)}
              className="flex items-center justify-between w-full"
            >
              <p className="body-16-medium text-black">Imóvel</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={`text-gold transition-transform duration-200 ${imovelOpen ? "" : "rotate-180"}`}
              >
                <path
                  d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            {imovelOpen && (
              <>
                <div className="space-y-3">
                  <Label htmlFor="tipo">Tipo de Imóvel</Label>
                  <Select value={propertyType || undefined} onValueChange={setPropertyType}>
                    <SelectTrigger id="tipo" name="tipo">
                      <SelectValue placeholder="Selecione o tipo de imóvel" />
                    </SelectTrigger>
                    <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                      <SelectItem value="moradia">Moradia</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="escritorio">Escritório</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="estado">Estado do imóvel</Label>
                  <Select value={propertyState || undefined} onValueChange={setPropertyState}>
                    <SelectTrigger id="estado" name="estado">
                      <SelectValue placeholder="Novo" />
                    </SelectTrigger>
                    <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="usado">Usado</SelectItem>
                      <SelectItem value="renovado">Renovado</SelectItem>
                      <SelectItem value="em-construcao">Em Construção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="classe">Classe energética</Label>
                  <Select value={energyClass || undefined} onValueChange={setEnergyClass}>
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
          <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
            <button
              type="button"
              onClick={() => setLocalizacaoOpen(!localizacaoOpen)}
              className="flex items-center justify-between w-full"
            >
              <p className="body-16-medium text-black">Localização</p>
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
                  <Label htmlFor="distrito">Distrito</Label>
                  <Select value={distrito || undefined} onValueChange={setDistrito}>
                    <SelectTrigger id="distrito" name="distrito">
                      <SelectValue placeholder="Selecione a localização" />
                    </SelectTrigger>
                    <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                      <SelectItem value="aveiro">Aveiro</SelectItem>
                      <SelectItem value="beja">Beja</SelectItem>
                      <SelectItem value="braga">Braga</SelectItem>
                      <SelectItem value="braganca">Bragança</SelectItem>
                      <SelectItem value="castelo-branco">Castelo Branco</SelectItem>
                      <SelectItem value="coimbra">Coimbra</SelectItem>
                      <SelectItem value="evora">Évora</SelectItem>
                      <SelectItem value="faro">Faro</SelectItem>
                      <SelectItem value="guarda">Guarda</SelectItem>
                      <SelectItem value="leiria">Leiria</SelectItem>
                      <SelectItem value="lisboa">Lisboa</SelectItem>
                      <SelectItem value="portalegre">Portalegre</SelectItem>
                      <SelectItem value="porto">Porto</SelectItem>
                      <SelectItem value="santarem">Santarém</SelectItem>
                      <SelectItem value="setubal">Setúbal</SelectItem>
                      <SelectItem value="viana-do-castelo">Viana do Castelo</SelectItem>
                      <SelectItem value="vila-real">Vila Real</SelectItem>
                      <SelectItem value="viseu">Viseu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="concelho">Concelho</Label>
                  <Select value={concelho || undefined} onValueChange={setConcelho}>
                    <SelectTrigger id="concelho" name="concelho">
                      <SelectValue placeholder="Selecione a localização" />
                    </SelectTrigger>
                    <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                      <SelectItem value="porto">Porto</SelectItem>
                      <SelectItem value="lisboa">Lisboa</SelectItem>
                      <SelectItem value="braga">Braga</SelectItem>
                      <SelectItem value="coimbra">Coimbra</SelectItem>
                      <SelectItem value="faro">Faro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <div className="p-4 flex flex-col gap-2 border-b border-[#EAE6DF]">
            <button
              type="button"
              onClick={() => setOutroOpen(!outroOpen)}
              className="flex items-center justify-between w-full"
            >
              <p className="body-16-medium text-black">Outro</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={`text-gold transition-transform duration-200 ${outroOpen ? "" : "rotate-180"}`}
              >
                <path
                  d="M9.99996 9.14777L13.8889 13.125L15 11.9886L9.99996 6.875L5 11.9886L6.11111 13.125L9.99996 9.14777Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            {outroOpen && (
              <>
                <div className="space-y-3">
                  <Label>Preço</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Área útil</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={minUsefulArea}
                      onChange={(e) => setMinUsefulArea(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={maxUsefulArea}
                      onChange={(e) => setMaxUsefulArea(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Quartos</Label>
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
                  <Label>Casas de banho</Label>
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
        </div>
        <div className="flex gap-2.5 p-4 border-t border-[#EAE6DF]">
          <button
            type="button"
            onClick={handleReset}
            className="shadow-pretty grow flex justify-center items-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive button-14-semibold bg-white text-black-muted px-3 py-2 cursor-pointer"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="grow flex justify-center items-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive button-14-semibold bg-brown hover:bg-brown-muted text-white px-3 py-2 cursor-pointer"
          >
            Filtrar
          </button>
        </div>
      </form>
    </aside>
  )
}
