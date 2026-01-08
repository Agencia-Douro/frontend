"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { desiredZonesApi, DesiredZone } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DISTRITOS } from "@/app/shared/distritos"

export default function DesiredZonesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingZone, setEditingZone] = useState<DesiredZone | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    displayOrder: 0,
    isActive: true,
  })
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
    })
    setImagePreview(zone.image)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta zona?")) {
      deleteMutation.mutate(id)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingZone(null)
    setFormData({
      name: "",
      displayOrder: 0,
      isActive: true,
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
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Zonas Mais Desejadas</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Zona
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingZone ? "Editar Zona" : "Nova Zona"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Distrito *</Label>
                <Select
                  value={formData.name}
                  onValueChange={(value) => setFormData({ ...formData, name: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o distrito" />
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
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingZone ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {zones?.map((zone) => (
          <Card key={zone.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Image
                  src={zone.image}
                  alt={zone.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{zone.name}</h3>
                  <p className="text-sm text-gray-500">
                    Ordem: {zone.displayOrder} | {zone.isActive ? "Ativa" : "Inativa"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(zone)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(zone.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!zones || zones.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Nenhuma zona cadastrada
          </CardContent>
        </Card>
      )}
    </div>
  )
}
