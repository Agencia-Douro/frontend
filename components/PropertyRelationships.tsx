"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import { Checkbox } from "@/components/ui-admin/checkbox"
import { Loader2, Plus, Sparkles, Home } from "lucide-react"
import { toast } from "sonner"
import { propertyRelationshipsApi, propertiesApi } from "@/services/api"
import { Property } from "@/types/property"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DISTRITOS, TIPOS_IMOVEL } from "@/app/shared/distritos"
import Image from "next/image"
import { formatPriceNumber } from "@/lib/currency"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

interface PropertyRelationshipsProps {
  propertyId?: string
  isEditMode?: boolean
  onPendingRelatedChange?: (propertyIds: string[]) => void
  pendingRelated?: string[]
}

export function PropertyRelationships({
  propertyId,
  isEditMode = false,
  onPendingRelatedChange,
  pendingRelated = []
}: PropertyRelationshipsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [localPendingRelated, setLocalPendingRelated] = useState<Property[]>([])
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([])
  const [filters, setFilters] = useState({
    search: "",
    distrito: "",
    propertyType: "",
    transactionType: "",
    page: 1,
  })
  const queryClient = useQueryClient()

  // Buscar propriedades relacionadas existentes
  const { data: relatedProperties = [], isLoading: loadingRelated } = useQuery({
    queryKey: ["property-related", propertyId],
    queryFn: () => propertyRelationshipsApi.getRelated(propertyId!),
    enabled: isEditMode && !!propertyId,
  })

  // Buscar propriedades similares (sugestões automáticas)
  const { data: similarProperties = [], isLoading: loadingSimilar } = useQuery({
    queryKey: ["property-similar", propertyId],
    queryFn: () => propertyRelationshipsApi.getSimilar(propertyId!, 10),
    enabled: isEditMode && !!propertyId,
  })

  // Buscar propriedades para o modal
  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ["properties-selector", filters],
    queryFn: () => propertiesApi.getAll({
      limit: 12,
      page: filters.page,
      status: "active",
      ...(filters.search && { search: filters.search }),
      ...(filters.distrito && { distrito: filters.distrito }),
      ...(filters.propertyType && { propertyType: filters.propertyType }),
      ...(filters.transactionType && { transactionType: filters.transactionType }),
    }),
    enabled: dialogOpen,
  })

  // Carregar propriedades pendentes inicialmente no modo de criação
  useEffect(() => {
    if (!isEditMode && pendingRelated.length > 0) {
      const loadPendingProperties = async () => {
        try {
          const promises = pendingRelated.map(id => propertiesApi.getById(id))
          const properties = await Promise.all(promises)
          setLocalPendingRelated(properties)
        } catch (error) {
          console.error("Erro ao carregar propriedades pendentes:", error)
        }
      }
      loadPendingProperties()
    }
  }, [pendingRelated, isEditMode])

  // Notificar mudanças nas propriedades relacionadas pendentes
  useEffect(() => {
    if (!isEditMode && onPendingRelatedChange) {
      onPendingRelatedChange(localPendingRelated.map(p => p.id))
    }
  }, [localPendingRelated, isEditMode, onPendingRelatedChange])

  // Mutation para definir propriedades relacionadas
  const setRelatedMutation = useMutation({
    mutationFn: (relatedPropertyIds: string[]) =>
      propertyRelationshipsApi.setRelated(propertyId!, relatedPropertyIds),
    onSuccess: () => {
      toast.success("Propriedades relacionadas atualizadas!")
      queryClient.invalidateQueries({ queryKey: ["property-related", propertyId] })
      queryClient.invalidateQueries({ queryKey: ["property-similar", propertyId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar propriedades relacionadas")
    },
  })

  // Determinar qual lista de propriedades usar (existentes ou pendentes)
  const currentRelated = isEditMode ? relatedProperties : localPendingRelated
  const isLoadingRelatedData = isEditMode ? loadingRelated : false

  const handleOpenDialog = () => {
    // Inicializar seleção com propriedades já relacionadas
    const currentIds = currentRelated.map(p => p.id)
    setTempSelectedIds(currentIds)
    setDialogOpen(true)
  }

  const handleToggle = (id: string) => {
    setTempSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(propId => propId !== id)
        : [...prev, id]
    )
  }

  const handleConfirm = async () => {
    if (isEditMode) {
      await setRelatedMutation.mutateAsync(tempSelectedIds)
    } else {
      // Modo de criação - atualizar localmente
      try {
        const promises = tempSelectedIds.map(id => propertiesApi.getById(id))
        const properties = await Promise.all(promises)
        setLocalPendingRelated(properties)
        toast.success("Propriedades relacionadas atualizadas!")
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error)
        toast.error("Erro ao carregar propriedades")
      }
    }
    setDialogOpen(false)
    clearFilters()
  }

  const handleCancel = () => {
    setTempSelectedIds(currentRelated.map(p => p.id))
    setDialogOpen(false)
    clearFilters()
  }

  const handleAddSimilar = async (property: Property) => {
    if (isEditMode) {
      const newIds = [...currentRelated.map(p => p.id), property.id]
      await setRelatedMutation.mutateAsync(newIds)
    } else {
      setLocalPendingRelated([...localPendingRelated, property])
      toast.success("Propriedade adicionada!")
    }
  }

  const handleRemove = async (property: Property) => {
    if (window.confirm(`Remover "${property.title}" das propriedades relacionadas?`)) {
      if (isEditMode) {
        const newIds = currentRelated.filter(p => p.id !== property.id).map(p => p.id)
        await setRelatedMutation.mutateAsync(newIds)
      } else {
        setLocalPendingRelated(localPendingRelated.filter(p => p.id !== property.id))
        toast.success("Propriedade removida!")
      }
    }
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      distrito: "",
      propertyType: "",
      transactionType: "",
      page: 1,
    })
  }

  const updatePage = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const totalPages = propertiesResponse?.totalPages || 1
  const currentPage = propertiesResponse?.page || 1

  return (
    <div className="space-y-6">
      {!isEditMode && (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
          <p className="text-sm text-foreground">
            As propriedades relacionadas serão guardadas após criar a propriedade.
          </p>
        </div>
      )}

      {/* Propriedades Relacionadas Atuais */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Label className="text-sm font-medium">Propriedades relacionadas ({currentRelated.length})</Label>
          <Button type="button" size="default" variant="outline" onClick={handleOpenDialog}>
            <Plus className="size-4 shrink-0" aria-hidden />
            Gerir propriedades
          </Button>
        </div>

        {isLoadingRelatedData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
          </div>
        ) : currentRelated.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center">
            <Home className="mx-auto mb-3 size-12 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Nenhuma propriedade relacionada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentRelated.map((property) => (
              <div
                key={property.id}
                className="relative overflow-hidden rounded-lg border border-border bg-muted/10"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-medium text-foreground">{property.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {property.concelho}, {property.distrito}
                  </p>
                  <p className="mt-1 text-sm font-medium tabular-nums text-foreground">
                    {formatPriceNumber(property.price)} €
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(property)}
                  className="absolute right-2 top-2 opacity-90 hover:opacity-100 transition-opacity"
                  aria-label={`Remover ${property.title}`}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sugestões automáticas – apenas no modo de edição */}
      {isEditMode && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" aria-hidden />
            <Label className="text-sm font-medium">Sugestões automáticas</Label>
          </div>

          {loadingSimilar ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
            </div>
          ) : similarProperties.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/10 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma propriedade similar encontrada.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Propriedades similares por tipo, localização e preço (±30%).
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {similarProperties
                  .filter((prop) => !relatedProperties.some((rel) => rel.id === prop.id))
                  .slice(0, 5)
                  .map((property) => (
                    <div
                      key={property.id}
                      className="overflow-hidden rounded-lg border border-border bg-muted/10"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={property.image}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 text-sm font-medium text-foreground">{property.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {property.concelho}, {property.distrito}
                        </p>
                        <p className="mt-1 text-sm font-medium tabular-nums text-foreground">
                          {formatPriceNumber(property.price)} €
                        </p>
                      </div>
                      <div className="p-3 pt-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSimilar(property)}
                          disabled={setRelatedMutation.isPending}
                          className="w-full"
                        >
                          <Plus className="size-4 shrink-0" aria-hidden />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal de seleção */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex h-[95vh] max-h-dvh w-[95vw] max-w-[1600px] flex-col overflow-hidden border-border bg-background p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Selecionar propriedades relacionadas</DialogTitle>
            <DialogDescription>
              Escolha as propriedades a relacionar com este imóvel.
            </DialogDescription>
          </DialogHeader>

          {/* Filtros */}
          <div className="space-y-4 border-b border-border pb-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Título ou referência..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distrito">Distrito</Label>
                <Select
                  value={filters.distrito || undefined}
                  onValueChange={(value) => setFilters({ ...filters, distrito: value, page: 1 })}
                >
                  <SelectTrigger id="distrito">
                    <SelectValue placeholder="Todos os distritos" />
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

              <div className="space-y-2">
                <Label htmlFor="propertyType">Tipo</Label>
                <Select
                  value={filters.propertyType || undefined}
                  onValueChange={(value) => setFilters({ ...filters, propertyType: value, page: 1 })}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Todos os tipos" />
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

              <div className="space-y-2">
                <Label htmlFor="transactionType">Transação</Label>
                <Select
                  value={filters.transactionType || undefined}
                  onValueChange={(value) => setFilters({ ...filters, transactionType: value, page: 1 })}
                >
                  <SelectTrigger id="transactionType">
                    <SelectValue placeholder="Todas as transações" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprar">Comprar</SelectItem>
                    <SelectItem value="arrendar">Arrendar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button variant="outline" size="default" onClick={clearFilters}>
                Limpar filtros
              </Button>
              <p className="text-sm text-muted-foreground tabular-nums">
                {tempSelectedIds.length} selecionada(s)
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto py-4">
            {loadingProperties ? (
              <p className="py-12 text-center text-sm text-muted-foreground">A carregar propriedades…</p>
            ) : propertiesResponse?.data && propertiesResponse.data.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {propertiesResponse.data
                  .filter((p) => p.id !== propertyId)
                  .map((property) => (
                    <button
                      key={property.id}
                      type="button"
                      className="relative w-full cursor-pointer rounded-lg border border-border bg-muted/10 text-left transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => handleToggle(property.id)}
                    >
                      <div className="absolute right-2 top-2 z-10" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={tempSelectedIds.includes(property.id)}
                          onCheckedChange={() => handleToggle(property.id)}
                          aria-label={tempSelectedIds.includes(property.id) ? "Desmarcar" : "Selecionar"}
                        />
                      </div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
                        <Image src={property.image} alt="" fill className="object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 text-sm font-medium text-foreground">{property.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {property.concelho}, {property.distrito}
                        </p>
                        <p className="mt-1 text-sm font-medium tabular-nums text-foreground">
                          {formatPriceNumber(property.price)} €
                        </p>
                        {property.reference && (
                          <p className="mt-1 text-xs text-muted-foreground">Ref: {property.reference}</p>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Nenhuma propriedade encontrada com os filtros aplicados.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border py-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => updatePage(currentPage - 1)}
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
                  onClick={() => updatePage(page)}
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
              onClick={() => updatePage(currentPage + 1)}
              aria-label="Página seguinte"
            >
              Próxima
            </Button>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={setRelatedMutation.isPending}>
              {setRelatedMutation.isPending ? (
                <>
                  <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                  A guardar…
                </>
              ) : (
                `Confirmar (${tempSelectedIds.length})`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
