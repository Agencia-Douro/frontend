"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { propertiesApi, PropertyFilters } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-admin/card"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-admin/select"
import { Checkbox } from "@/components/ui-admin/checkbox"
import { AdminPropertyCard } from "@/components/AdminPropertyCard"
import { Plus, Search, SlidersHorizontal, X, FileEdit, Trash2, Clock, Image as ImageIcon, LayoutGrid, List, ChevronRight } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui-admin/sheet"
import { TIPOS_IMOVEL } from "@/app/shared/distritos"
import { usePropertyDrafts, getTimeAgo } from "@/hooks/usePropertyDraft"
import { useAdminTheme } from "@/contexts/admin-theme-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type ViewMode = "cards" | "list"

export default function PropertiesPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [searchInput, setSearchInput] = useState("")
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 9,
    sortBy: "-createdAt",
  })

  const { theme } = useAdminTheme()
  const { drafts, deleteDraft, deleteAllDrafts } = usePropertyDrafts()

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
    setFilters(prev => ({ ...prev, [key]: value, ...(key !== "page" && { page: 1 }) }))
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
      limit: 9,
      sortBy: "-createdAt",
    })
  }

  if (isLoading) {
    return (
      <div className="px-4 py-10 md:px-6">
        <h1 className="mb-6 text-xl font-semibold text-foreground tracking-tight text-balance">
          Gerenciar Propriedades
        </h1>
        <p className="py-12 text-center text-sm text-muted-foreground">
          A carregar propriedades...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-10 md:px-6">
        <h1 className="mb-6 text-xl font-semibold text-foreground tracking-tight text-balance">
          Gerenciar Propriedades
        </h1>
        <p className="py-12 text-center text-sm text-destructive">
          Erro ao carregar propriedades: {error.message}
        </p>
      </div>
    )
  }

  const totalPages = data?.totalPages || 1
  const currentPage = data?.page || 1

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-6 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight text-balance">
            Gerenciar Propriedades
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Total de {data?.total} propriedade(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5" role="group" aria-label="Vista">
            <Button
              type="button"
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("cards")}
              aria-label="Ver em cards"
            >
              <LayoutGrid className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              aria-label="Ver em lista"
            >
              <List className="size-4" aria-hidden />
            </Button>
          </div>
          <Button
            asChild
            className={cn(
              theme === "dark" &&
                "bg-white text-black hover:bg-white/90 border-0 shadow-sm",
            )}
          >
            <Link href="/admin/properties/create">
              <Plus className="size-4" aria-hidden />
              Nova Propriedade
            </Link>
          </Button>
        </div>
      </div>

      {/* Seção de Rascunhos */}
      {drafts.length > 0 && (
        <Card className="mb-6 text-foreground">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileEdit className="size-4 text-muted-foreground" aria-hidden />
                <CardTitle className="text-lg text-foreground">Rascunhos ({drafts.length})</CardTitle>
              </div>
              {drafts.length > 1 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (confirm("Tem certeza que deseja limpar todos os rascunhos?")) {
                      deleteAllDrafts()
                      toast.success("Todos os rascunhos foram removidos")
                    }
                  }}
                >
                  <Trash2 className="size-4" aria-hidden />
                  Limpar todos
                </Button>
              )}
            </div>
            <CardDescription className="text-muted-foreground">
              Continue de onde parou ou limpe os rascunhos que não precisa mais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between gap-2 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {draft.title || "Sem título"}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      {draft.propertyType && (
                        <span className="capitalize">{draft.propertyType}</span>
                      )}
                      {draft.concelho && draft.distrito && (
                        <span>• {draft.concelho}, {draft.distrito}</span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" aria-hidden />
                        <span>{getTimeAgo(new Date(draft.savedAt))}</span>
                      </div>
                      {(draft.hasMainImage || Object.keys(draft.sectionImageCounts || {}).length > 0) && (
                        <div className="flex items-center gap-1">
                          <ImageIcon className="size-3" aria-hidden />
                          <span>
                            {draft.hasMainImage ? "1" : "0"}
                            {Object.values(draft.sectionImageCounts || {}).reduce((a, b) => a + b, 0) > 0 &&
                              `+${Object.values(draft.sectionImageCounts || {}).reduce((a, b) => a + b, 0)}`
                            } mídia(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="secondary" size="sm" className="h-7 text-xs" asChild>
                      <Link href={`/admin/properties/create?draft=${draft.id}`}>
                        Continuar
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (confirm("Remover este rascunho?")) {
                          deleteDraft(draft.id)
                          toast.success("Rascunho removido")
                        }
                      }}
                      aria-label="Remover rascunho"
                    >
                      <X className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barra de Busca e Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar por título ou descrição..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "secondary" : "ghost"}
          onClick={() => setShowFilters(true)}
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtros
        </Button>
        {Object.keys(filters).some(key => !["page", "limit", "sortBy"].includes(key)) && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="size-4" aria-hidden />
            Limpar
          </Button>
        )}
      </div>

      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6">
            <div className="grid gap-6 py-6">
              {/* Tipo de Propriedade */}
              <div className="space-y-1.5">
                <Label className="text-xs">Tipo de Imóvel</Label>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) => updateFilter("propertyType", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
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

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
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
              <div className="space-y-1.5">
                <Label className="text-xs">Ordenar por</Label>
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
              <div className="space-y-1.5">
                <Label className="text-xs">Preço Mínimo (€)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ""}
                  onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Preço Máximo (€)</Label>
                <Input
                  type="number"
                  placeholder="Sem limite"
                  value={filters.maxPrice || ""}
                  onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>

              {/* Localização */}
              <div className="space-y-1.5">
                <Label className="text-xs">Distrito</Label>
                <Input
                  placeholder="Ex: Porto"
                  value={filters.distrito || ""}
                  onChange={(e) => updateFilter("distrito", e.target.value || undefined)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Concelho</Label>
                <Input
                  placeholder="Ex: Porto"
                  value={filters.concelho || ""}
                  onChange={(e) => updateFilter("concelho", e.target.value || undefined)}
                />
              </div>

              {/* Quartos */}
              <div className="space-y-1.5">
                <Label className="text-xs">Quartos</Label>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant={(filters.bedrooms || []).includes(num) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => toggleBedrooms(num)}
                    >
                      {num === 7 ? "7+" : num}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Banheiros */}
              <div className="space-y-1.5">
                <Label className="text-xs">Banheiros</Label>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant={(filters.bathrooms || []).includes(num) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => toggleBathrooms(num)}
                    >
                      {num === 7 ? "7+" : num}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Características */}
              <div className="space-y-1.5">
                <Label className="text-xs">Características</Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sheet-hasOffice"
                      checked={filters.hasOffice === true}
                      onCheckedChange={(checked) => updateFilter("hasOffice", checked ? true : undefined)}
                    />
                    <label htmlFor="sheet-hasOffice" className="cursor-pointer text-sm font-medium text-foreground">
                      Escritório
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sheet-hasLaundry"
                      checked={filters.hasLaundry === true}
                      onCheckedChange={(checked) => updateFilter("hasLaundry", checked ? true : undefined)}
                    />
                    <label htmlFor="sheet-hasLaundry" className="cursor-pointer text-sm font-medium text-foreground">
                      Lavandaria
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Conteúdo scrollável – a paginação fica sticky por cima para o blur ficar visível */}
      <div className="relative min-h-0 min-w-0 flex-1 overflow-auto overflow-x-hidden">
        {!data?.data?.length ? (
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Search className="size-7 text-muted-foreground" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Nenhuma propriedade encontrada</p>
              <p className="max-w-sm text-sm text-muted-foreground text-pretty">
                Não há resultados para os filtros aplicados. Tente alterar os critérios ou limpar os filtros.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-y-6 gap-x-4 pb-20 md:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((property) => (
              <AdminPropertyCard
                key={property.id}
                href={`/admin/properties/${property.id}`}
                image={property.image}
                localizacao={`${property.concelho}, ${property.distrito}`}
                preco={property.price}
                titulo={property.title}
                status={property.status}
              />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-border pb-20">
            {data?.data.map((property) => (
              <li key={property.id}>
                <Link
                  href={`/admin/properties/${property.id}`}
                  className="group flex items-center gap-3 py-2 text-left transition-colors hover:bg-accent/30"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded bg-muted">
                    {property.image ? (
                      <img
                        src={property.image}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="size-5" aria-hidden />
                      </div>
                    )}
                    {property.status === "reserved" && (
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-foreground/90 px-1 py-0.5 text-[10px] font-medium text-background">
                        Reservado
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {property.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {property.concelho}, {property.distrito}
                    </p>
                  </div>
                  <p className="shrink-0 tabular-nums text-sm font-medium text-foreground">
                    {Number(property.price).toLocaleString("pt-PT")} €
                  </p>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Barra de paginação sticky – só quando há resultados e mais de uma página */}
        {data?.data?.length && totalPages > 1 && (
        <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-background/95 py-3 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => updateFilter("page", currentPage - 1)}
              aria-label="Página anterior"
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="icon"
                  onClick={() => updateFilter("page", page)}
                  aria-label={page === currentPage ? `Página ${page} (atual)` : `Ir para página ${page}`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => updateFilter("page", currentPage + 1)}
              aria-label="Página seguinte"
            >
              Próxima
            </Button>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
