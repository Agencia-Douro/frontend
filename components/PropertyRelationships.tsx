"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2, Plus, Search, Sparkles, Home } from "lucide-react"
import { toast } from "sonner"
import { propertyRelationshipsApi, propertiesApi } from "@/services/api"
import { Property } from "@/types/property"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PropertyRelationshipsProps {
  propertyId?: string
  isEditMode?: boolean
}

export function PropertyRelationships({ propertyId, isEditMode = false }: PropertyRelationshipsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Property[]>([])
  const [searching, setSearching] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
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

  // Mutation para adicionar propriedades relacionadas
  const addMutation = useMutation({
    mutationFn: (relatedPropertyIds: string[]) =>
      propertyRelationshipsApi.addRelated(propertyId!, relatedPropertyIds),
    onSuccess: () => {
      toast.success("Propriedade relacionada adicionada com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["property-related", propertyId] })
      queryClient.invalidateQueries({ queryKey: ["property-similar", propertyId] })
      setDialogOpen(false)
      setSearchTerm("")
      setSearchResults([])
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao adicionar propriedade relacionada")
    },
  })

  // Mutation para remover propriedades relacionadas
  const removeMutation = useMutation({
    mutationFn: (relatedPropertyIds: string[]) =>
      propertyRelationshipsApi.removeRelated(propertyId!, relatedPropertyIds),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ["property-related", propertyId] })
      queryClient.invalidateQueries({ queryKey: ["property-similar", propertyId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover propriedade relacionada")
    },
  })

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Digite um termo para pesquisar")
      return
    }

    setSearching(true)
    try {
      const response = await propertiesApi.getAll({
        search: searchTerm,
        limit: 10,
        status: "active",
      })

      // Filtrar para não mostrar a propriedade atual nem as já relacionadas
      const filtered = response.data.filter(
        (prop) =>
          prop.id !== propertyId &&
          !relatedProperties.some((rel) => rel.id === prop.id)
      )

      setSearchResults(filtered)

      if (filtered.length === 0) {
        toast.info("Nenhuma propriedade encontrada")
      }
    } catch (error) {
      toast.error("Erro ao pesquisar propriedades")
    } finally {
      setSearching(false)
    }
  }

  const handleAddRelated = async (property: Property) => {
    await addMutation.mutateAsync([property.id])
  }

  const handleRemoveRelated = async (property: Property) => {
    if (window.confirm(`Remover "${property.title}" das propriedades relacionadas?`)) {
      await removeMutation.mutateAsync([property.id])
    }
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice)
  }

  const PropertyCard = ({ property, onAction, actionLabel, actionIcon: ActionIcon, actionLoading }: {
    property: Property
    onAction: (property: Property) => void
    actionLabel: string
    actionIcon: any
    actionLoading?: boolean
  }) => (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border hover:border-gray-300 transition-colors">
      <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {property.title}
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          {property.propertyType} • {property.bedrooms} quartos • {property.bathrooms} casas de banho
        </p>
        <p className="text-xs text-gray-500">
          {property.distrito}, {property.concelho}
        </p>
        <p className="text-sm font-semibold text-brown mt-1">
          {formatPrice(property.price)}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="default"
        onClick={() => onAction(property)}
        disabled={actionLoading}
        className="flex-shrink-0"
      >
        {actionLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <ActionIcon className="h-4 w-4 mr-2" />
            {actionLabel}
          </>
        )}
      </Button>
    </div>
  )

  if (!isEditMode) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
        <Home className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Salve a propriedade primeiro para gerenciar propriedades relacionadas
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Propriedades Relacionadas Atuais */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Propriedades Relacionadas ({relatedProperties.length})</Label>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" size="default" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Propriedade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Propriedade Relacionada</DialogTitle>
                <DialogDescription>
                  Pesquise e selecione propriedades para relacionar
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Pesquisar por título, referência, distrito..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={searching}
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Resultados da Pesquisa</Label>
                    {searchResults.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onAction={handleAddRelated}
                        actionLabel="Adicionar"
                        actionIcon={Plus}
                        actionLoading={addMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loadingRelated ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : relatedProperties.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Nenhuma propriedade relacionada ainda
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {relatedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onAction={handleRemoveRelated}
                actionLabel="Remover"
                actionIcon={X}
                actionLoading={removeMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sugestões Automáticas */}
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
            <div className="space-y-2">
              {similarProperties
                .filter((prop) => !relatedProperties.some((rel) => rel.id === prop.id))
                .slice(0, 5)
                .map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onAction={handleAddRelated}
                    actionLabel="Adicionar"
                    actionIcon={Plus}
                    actionLoading={addMutation.isPending}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
