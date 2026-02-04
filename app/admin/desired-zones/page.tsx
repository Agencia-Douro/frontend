"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { desiredZonesApi, DesiredZone } from "@/services/api"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"
import { Checkbox } from "@/components/ui-admin/checkbox"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui-admin/alert-dialog"

export default function DesiredZonesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingZone, setEditingZone] = useState<DesiredZone | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    displayOrder: 0,
    isActive: true,
    country: "PT",
  })

  // Mapeamento de códigos de países para nomes
  const countryOptions = [
    { code: "PT", name: "Portugal" },
    { code: "AE", name: "Dubai" },
    { code: "GB", name: "Reino Unido" },
  ]
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data: zones, isLoading } = useQuery({
    queryKey: ["desired-zones"],
    queryFn: () => desiredZonesApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { name: string; image?: File; displayOrder?: number; isActive?: boolean }) =>
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

  const [zoneToDelete, setZoneToDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setZoneToDelete(id)
  }

  const confirmDelete = () => {
    if (zoneToDelete) {
      deleteMutation.mutate(zoneToDelete)
      setZoneToDelete(null)
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        A carregar...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Zonas Mais Desejadas</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerir zonas destacadas na página Sobre Nós.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Nova Zona
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingZone ? "Editar Zona" : "Nova Zona"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm} aria-label="Fechar formulário">
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                  required
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
                <Label htmlFor="image">Imagem {!editingZone && "*"}</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
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
                  Ativa
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingZone ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-y-6 gap-x-4">
        {zones?.map((zone) => (
          <Card key={zone.id}>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={zone.image}
                  alt={zone.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{zone.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {countryOptions.find(c => c.code === zone.country)?.name || zone.country || "Portugal"} · Ordem: {zone.displayOrder} · {zone.isActive ? "Ativa" : "Inativa"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(zone)} aria-label="Editar zona">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(zone.id)}
                  disabled={deleteMutation.isPending}
                  aria-label="Remover zona"
                >
                  <Trash2 className="size-4" />
                </Button>
                <AlertDialog open={zoneToDelete === zone.id} onOpenChange={(open) => !open && setZoneToDelete(null)}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover zona</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover esta zona? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={confirmDelete}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!zones || zones.length === 0) && (
        <Card>
          <CardContent className="text-center text-muted-foreground">
            Nenhuma zona cadastrada. Clique em &quot;Nova Zona&quot; para começar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
