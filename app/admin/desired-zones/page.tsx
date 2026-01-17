"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { desiredZonesApi, DesiredZone } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X, Search, MapPin, ImageIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const countryOptions = [
  { code: "PT", name: "Portugal" },
  { code: "AE", name: "Dubai" },
  { code: "GB", name: "Reino Unido" },
]

export default function DesiredZonesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingZone, setEditingZone] = useState<DesiredZone | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const [formData, setFormData] = useState({
    name: "",
    displayOrder: 0,
    isActive: true,
    country: "PT",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data: zones, isLoading, error } = useQuery({
    queryKey: ["desired-zones"],
    queryFn: () => desiredZonesApi.getAll(),
  })

  const filteredZones = useMemo(() => {
    if (!zones) return []

    let filtered = [...zones]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((zone) =>
        zone.name.toLowerCase().includes(query)
      )
    }

    if (countryFilter && countryFilter !== "all") {
      filtered = filtered.filter((zone) => zone.country === countryFilter)
    }

    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active"
      filtered = filtered.filter((zone) => zone.isActive === isActive)
    }

    filtered.sort((a, b) => a.displayOrder - b.displayOrder)

    return filtered
  }, [zones, searchQuery, countryFilter, statusFilter])

  const createMutation = useMutation({
    mutationFn: (data: { name: string; image?: File; displayOrder?: number; isActive?: boolean; country?: string }) =>
      desiredZonesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desired-zones"] })
      toast.success("Zona criada com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar zona")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      desiredZonesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desired-zones"] })
      toast.success("Zona atualizada com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar zona")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => desiredZonesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desired-zones"] })
      toast.success("Zona removida com sucesso!")
      setDeleteId(null)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover zona")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error("O nome é obrigatório")
      return
    }

    if (!editingZone && !imageFile) {
      toast.error("A imagem é obrigatória ao criar uma nova zona")
      return
    }

    const data: any = {
      name: formData.name,
      displayOrder: formData.displayOrder,
      isActive: formData.isActive,
      country: formData.country,
    }

    if (imageFile) {
      data.image = imageFile
    }

    if (editingZone) {
      updateMutation.mutate({ id: editingZone.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (zone: DesiredZone) => {
    setEditingZone(zone)
    setFormData({
      name: zone.name,
      displayOrder: zone.displayOrder,
      isActive: zone.isActive,
      country: zone.country || "PT",
    })
    setImagePreview(zone.image)
    setShowForm(true)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingZone(null)
    setFormData({
      name: "",
      displayOrder: 0,
      isActive: true,
      country: "PT",
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCountryFilter("all")
    setStatusFilter("all")
  }

  const hasActiveFilters = searchQuery || countryFilter !== "all" || statusFilter !== "all"

  const getCountryInfo = (code: string) => {
    return countryOptions.find((c) => c.code === code) || { code, name: code }
  }

  if (isLoading) {
    return (
      <div className="container mt-10">
        <h1 className="body-18-medium mb-6">Zonas Mais Desejadas</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">A carregar zonas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-10">
        <h1 className="body-18-medium mb-6">Zonas Mais Desejadas</h1>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar zonas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="body-18-medium flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Zonas Mais Desejadas
          </h1>
          <p className="text-muted-foreground mt-1">
            Total de {zones?.length || 0} zona(s)
            {filteredZones.length !== zones?.length &&
              ` (${filteredZones.length} filtrada(s))`
            }
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Zona
          </Button>
        )}
      </div>

      {/* Form Card */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="body-18-medium">
                {editingZone ? "Editar Zona" : "Nova Zona"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">País *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o país" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Zona *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Porto, Lisboa, Marina Dubai..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayOrder">Ordem de Exibição</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                      }
                      min="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked as boolean })
                      }
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      Zona Ativa
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagem {!editingZone && "*"}</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={300}
                          height={200}
                          className="rounded-lg object-cover mx-auto"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(editingZone?.image || null)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique para selecionar uma imagem
                        </p>
                      </div>
                    )}
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={imagePreview ? "mt-4" : ""}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "A guardar..." : editingZone ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome da zona..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Todos os países" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os países</SelectItem>
            {countryOptions.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Todos status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="inactive">Inativas</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>País</TableHead>
                <TableHead className="text-center">Ordem</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredZones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {hasActiveFilters
                        ? "Nenhuma zona encontrada com os filtros aplicados"
                        : "Nenhuma zona cadastrada"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredZones.map((zone) => {
                  const countryInfo = getCountryInfo(zone.country || "PT")
                  return (
                    <TableRow key={zone.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={zone.image}
                            alt={zone.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>{countryInfo.name}</TableCell>
                      <TableCell className="text-center">{zone.displayOrder}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={zone.isActive ? "success" : "muted"}>
                          {zone.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(zone)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="brown"
                            size="icon"
                            onClick={() => setDeleteId(zone.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="body-18-medium">Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover esta zona? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              variant="brown"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "A remover..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
