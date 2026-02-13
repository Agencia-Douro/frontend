"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
          const properties = (await Promise.all(promises)).filter((p): p is Property => p !== null)
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
        const properties = (await Promise.all(promises)).filter((p): p is Property => p !== null)
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            As propriedades relacionadas serão salvas após criar a propriedade
          </p>
        </div>
      )}

      {/* Propriedades Relacionadas Atuais */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Propriedades Relacionadas ({currentRelated.length})</Label>
          <Button type="button" size="default" variant="outline" onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Gerenciar Propriedades
          </Button>
        </div>

        {isLoadingRelatedData ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : currentRelated.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Nenhuma propriedade relacionada ainda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRelated.map((property) => (
              <div key={property.id} className="relative group">
                <div className="w-full">
                  <div className="relative w-full h-40 overflow-hidden rounded-lg">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="body-14-medium text-black line-clamp-1">{property.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {property.concelho}, {property.distrito}
                    </p>
                    <p className="body-16-medium text-black mt-1">
                      {formatPriceNumber(property.price)}
                      <span className="text-grey body-14-medium">€</span>
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  onClick={() => handleRemove(property)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sugestões Automáticas - apenas no modo de edição */}
      {isEditMode && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <Label>Sugestões Automáticas</Label>
          </div>

          {loadingSimilar ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : similarProperties.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-500">
                Nenhuma propriedade similar encontrada
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Propriedades similares baseadas em tipo, localização e preço (±30%)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarProperties
                  .filter((prop) => !relatedProperties.some((rel) => rel.id === prop.id))
                  .slice(0, 5)
                  .map((property) => (
                    <div key={property.id} className="relative">
                      <div className="w-full">
                        <div className="relative w-full h-40 overflow-hidden rounded-lg">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-2">
                          <p className="body-14-medium text-black line-clamp-1">{property.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {property.concelho}, {property.distrito}
                          </p>
                          <p className="body-16-medium text-black mt-1">
                            {formatPriceNumber(property.price)}
                            <span className="text-grey body-14-medium">€</span>
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        onClick={() => handleAddSimilar(property)}
                        disabled={setRelatedMutation.isPending}
                        className="mt-2 w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal de Seleção */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!w-[95vw] !max-w-[1600px] h-[95vh] overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl body-18-medium">Selecionar Propriedades Relacionadas</DialogTitle>
            <DialogDescription>
              Escolha as propriedades que deseja relacionar com este imóvel
            </DialogDescription>
          </DialogHeader>

          {/* Filtros */}
          <div className="space-y-4 pb-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <div className="flex justify-between items-center">
              <Button variant="outline" size="default" onClick={clearFilters}>
                Limpar Filtros
              </Button>
              <p className="text-sm text-gray-600">
                {tempSelectedIds.length} propriedade(s) selecionada(s)
              </p>
            </div>
          </div>

          {/* Grid de Propriedades */}
          <div className="flex-1 overflow-y-auto py-4 px-2">
            {loadingProperties ? (
              <p className="text-center text-gray-500 py-12">A carregar propriedades...</p>
            ) : propertiesResponse?.data && propertiesResponse.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {propertiesResponse.data
                  .filter(p => p.id !== propertyId) // Não mostrar a propriedade atual
                  .map((property) => (
                    <div
                      key={property.id}
                      className="relative cursor-pointer group"
                      onClick={() => handleToggle(property.id)}
                    >
                      {/* Checkbox sobreposto */}
                      <div className="absolute top-2 right-2 z-10">
                        <Checkbox
                          checked={tempSelectedIds.includes(property.id)}
                          onCheckedChange={() => handleToggle(property.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-white shadow-lg"
                        />
                      </div>

                      {/* Card do Imóvel */}
                      <div className="w-full">
                        <div className="relative w-full h-40 overflow-hidden">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-2 px-1">
                          <p className="body-16-medium text-black line-clamp-1">{property.title}</p>
                          <p className="body-14-medium text-grey mt-1">
                            {property.concelho}, {property.distrito}
                          </p>
                        </div>
                        <p className="body-20-medium text-black mt-2 px-1">
                          {formatPriceNumber(property.price)}
                          <span className="text-grey body-16-medium">€</span>
                        </p>
                        {property.reference && (
                          <p className="text-xs text-gray-500 mt-1 px-1">Ref: {property.reference}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">
                Nenhuma propriedade encontrada com os filtros aplicados
              </p>
            )}
          </div>

          {/* Paginação */}
          <div className="flex justify-center gap-2 py-4 border-t">
            <Button
              variant="brown"
              disabled={currentPage === 1}
              onClick={() => updatePage(currentPage - 1)}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "brown" : "ghost"}
                  onClick={() => updatePage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="brown"
              disabled={currentPage === totalPages}
              onClick={() => updatePage(currentPage + 1)}
            >
              Próxima
            </Button>
          </div>

          {/* Footer */}
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={setRelatedMutation.isPending}>
              {setRelatedMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                `Confirmar Seleção (${tempSelectedIds.length})`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
