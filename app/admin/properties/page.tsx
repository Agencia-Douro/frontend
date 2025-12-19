"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { propertiesApi, PropertyFilters } from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import ImovelCard from "@/components/Sections/Imoveis/Card"
import { Plus, Search, SlidersHorizontal, X } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { TIPOS_IMOVEL } from "@/app/shared/distritos"

export default function PropertiesPage() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 12,
    sortBy: "-createdAt",
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput || undefined, page: 1 }))
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertiesApi.getAll(filters),
  })

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const toggleBedrooms = (value: number) => {
    const current = filters.bedrooms || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateFilter("bedrooms", updated.length > 0 ? updated : undefined)
  }

  const toggleBathrooms = (value: number) => {
    const current = filters.bathrooms || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateFilter("bathrooms", updated.length > 0 ? updated : undefined)
  }

  const clearFilters = () => {
    setSearchInput("")
    setFilters({
      page: 1,
      limit: 12,
      sortBy: "-createdAt",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Propriedades</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando propriedades...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Propriedades</h1>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar propriedades: {error.message}</p>
        </div>
      </div>
    )
  }

  const totalPages = data?.totalPages || 1
  const currentPage = data?.page || 1

  return (
    <div className="container mt-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="body-18-medium">Gerenciar Propriedades</h1>
          <p className="text-muted-foreground mt-1">
            Total de {data?.total} propriedade(s)
          </p>
        </div>
        <Button onClick={() => router.push("/admin/properties/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Propriedade
        </Button>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou descrição..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "brown" : "ghost"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          {Object.keys(filters).some(key => !["page", "limit", "sortBy"].includes(key)) && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>

        <Collapsible open={showFilters}>
          <CollapsibleContent>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-white">
                  {/* Tipo de Propriedade */}
                  <div className="space-y-2">
                    <Label>Tipo de Imóvel</Label>
                    <Select
                      value={filters.propertyType}
                      onValueChange={(value) => updateFilter("propertyType", value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_IMOVEL.map(tipo => (
                          <SelectItem value={tipo.value}>{tipo.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => updateFilter("status", value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="sold">Vendido</SelectItem>
                        <SelectItem value="rented">Arrendado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ordenação */}
                  <div className="space-y-2">
                    <Label>Ordenar por</Label>
                    <Select
                      value={filters.sortBy || "-createdAt"}
                      onValueChange={(value) => updateFilter("sortBy", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-createdAt">Mais recentes</SelectItem>
                        <SelectItem value="createdAt">Mais antigos</SelectItem>
                        <SelectItem value="price">Menor preço</SelectItem>
                        <SelectItem value="-price">Maior preço</SelectItem>
                        <SelectItem value="area">Menor área</SelectItem>
                        <SelectItem value="-area">Maior área</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Faixa de Preço */}
                  <div className="space-y-2">
                    <Label>Preço Mínimo (€)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice || ""}
                      onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preço Máximo (€)</Label>
                    <Input
                      type="number"
                      placeholder="Sem limite"
                      value={filters.maxPrice || ""}
                      onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>

                  {/* Localização */}
                  <div className="space-y-2">
                    <Label>Distrito</Label>
                    <Input
                      placeholder="Ex: Porto"
                      value={filters.distrito || ""}
                      onChange={(e) => updateFilter("distrito", e.target.value || undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Concelho</Label>
                    <Input
                      placeholder="Ex: Porto"
                      value={filters.concelho || ""}
                      onChange={(e) => updateFilter("concelho", e.target.value || undefined)}
                    />
                  </div>

                  {/* Quartos */}
                  <div className="space-y-3">
                    <Label>Quartos</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <Button
                          key={num}
                          type="button"
                          variant={(filters.bedrooms || []).includes(num) ? "brown" : "outline"}
                          size="default"
                          onClick={() => toggleBedrooms(num)}
                        >
                          {num === 7 ? "7+" : num}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Banheiros */}
                  <div className="space-y-3">
                    <Label>Banheiros</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <Button
                          key={num}
                          type="button"
                          variant={(filters.bathrooms || []).includes(num) ? "brown" : "outline"}
                          size="default"
                          onClick={() => toggleBathrooms(num)}
                        >
                          {num === 7 ? "7+" : num}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Características */}
                  <div className="space-y-3">
                    <Label>Características</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasOffice"
                          checked={filters.hasOffice === true}
                          onCheckedChange={(checked) => updateFilter("hasOffice", checked ? true : undefined)}
                        />
                        <label htmlFor="hasOffice" className="text-body-small font-medium cursor-pointer">
                          Escritório
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasLaundry"
                          checked={filters.hasLaundry === true}
                          onCheckedChange={(checked) => updateFilter("hasLaundry", checked ? true : undefined)}
                        />
                        <label htmlFor="hasLaundry" className="text-body-small font-medium cursor-pointer">
                          Lavandaria
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Grid de Propriedades */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((property) => (
          <ImovelCard
            href={`properties/${property.id}`}
            image={property.image}
            localizacao={property.concelho + property.distrito}
            preco={property.price}
            titulo={property.title}
            key={property.id}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="brown"
            disabled={currentPage === 1}
            onClick={() => updateFilter("page", currentPage - 1)}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "brown" : "ghost"}
                onClick={() => updateFilter("page", page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="brown"
            disabled={currentPage === totalPages}
            onClick={() => updateFilter("page", currentPage + 1)}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
