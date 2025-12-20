"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { propertiesApi } from "@/services/api"
import { Property } from "@/types/property"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DISTRITOS, TIPOS_IMOVEL } from "@/app/shared/distritos"
import { X } from "lucide-react"
import Image from "next/image"
import { formatPriceNumber } from "@/lib/currency"

interface PropertySelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPropertyIds: string[]
  onConfirm: (propertyIds: string[]) => void
}

export default function PropertySelectorModal({
  open,
  onOpenChange,
  selectedPropertyIds,
  onConfirm,
}: PropertySelectorModalProps) {
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedPropertyIds)
  const [filters, setFilters] = useState({
    search: "",
    distrito: "",
    propertyType: "",
    transactionType: "",
    page: 1,
  })

  const { data: propertiesResponse, isLoading } = useQuery({
    queryKey: ["properties-selector", filters],
    queryFn: () => propertiesApi.getAll({
      limit: 12,
      page: filters.page,
      ...(filters.search && { search: filters.search }),
      ...(filters.distrito && { distrito: filters.distrito }),
      ...(filters.propertyType && { propertyType: filters.propertyType }),
      ...(filters.transactionType && { transactionType: filters.transactionType }),
    }),
    enabled: open,
  })

  const handleToggle = (propertyId: string) => {
    setTempSelectedIds(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const handleConfirm = () => {
    onConfirm(tempSelectedIds)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempSelectedIds(selectedPropertyIds)
    onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[1600px] h-[95vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl body-18-medium">Selecionar Imóveis</DialogTitle>
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
                  <SelectItem value="vender">Vender</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" size="default" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <p className="text-sm text-gray-600">
              {tempSelectedIds.length} imóvel(is) selecionado(s)
            </p>
          </div>
        </div>

        {/* Grid de Imóveis */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {isLoading ? (
            <p className="text-center text-gray-500 py-12">A carregar imóveis...</p>
          ) : propertiesResponse?.data && propertiesResponse.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {propertiesResponse.data.map((property) => (
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
              Nenhum imóvel encontrado com os filtros aplicados
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
          <Button onClick={handleConfirm}>
            Confirmar Seleção ({tempSelectedIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
