"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { serviceItemsApi } from "@/services/api"
import { CreateServiceItemDto, UpdateServiceItemDto, ServiceItem } from "@/types/about-us"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Textarea } from "@/components/ui-admin/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
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
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"

export default function ServiceItemsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null)
  const [formData, setFormData] = useState<CreateServiceItemDto>({
    title_pt: "",
    description_pt: "",
    order: 0,
  })

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["service-items"],
    queryFn: () => serviceItemsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateServiceItemDto) => serviceItemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-items"] })
      toast.success("Serviço criado com sucesso! Traduções automáticas em andamento.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar serviço")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceItemDto }) =>
      serviceItemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-items"] })
      toast.success("Serviço atualizado com sucesso! Traduções automáticas em andamento.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar serviço")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-items"] })
      toast.success("Serviço deletado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao deletar serviço")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title_pt || !formData.description_pt) {
      toast.error("Título e descrição são obrigatórios")
      return
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (item: ServiceItem) => {
    setEditingItem(item)
    setFormData({
      title_pt: item.title_pt || "",
      description_pt: item.description_pt || "",
      order: item.order || 0,
    })
    setShowForm(true)
  }

  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => setItemToDelete(id)

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete)
      setItemToDelete(null)
    }
  }

  const resetForm = () => {
    setFormData({
      title_pt: "",
      description_pt: "",
      order: 0,
    })
    setEditingItem(null)
    setShowForm(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Serviços Oferecidos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os serviços oferecidos pela empresa. Edite em português e as traduções serão feitas automaticamente.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="size-4" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Novo Serviço
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{showForm ? (editingItem ? "Editar Serviço" : "Novo Serviço") : "Serviços"}</CardTitle>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6"
            >
              <h3 className="text-lg font-medium text-foreground mb-4">
                {editingItem ? "Editar Serviço" : "Novo Serviço"}
              </h3>
              <div className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="title">Título (PT)</Label>
                  <Input
                    id="title"
                    value={formData.title_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, title_pt: e.target.value })
                    }
                    placeholder="Ex: Consultoria Jurídica"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Descrição (PT)</Label>
                  <Textarea
                    id="description"
                    value={formData.description_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, description_pt: e.target.value })
                    }
                    rows={4}
                    placeholder="Descrição do serviço oferecido..."
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="order">Ordem de Exibição</Label>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                  <p className="text-sm text-muted-foreground">
                    Serviços com ordem menor aparecem primeiro
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Salvando..."
                    : editingItem
                      ? "Atualizar"
                      : "Criar"}
                </Button>
              </div>
            </form>
          )}

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.title_pt}</h3>
                      <span className="text-sm text-muted-foreground">
                        (Ordem: {item.order})
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground text-pretty">{item.description_pt}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      size="icon"
                      aria-label="Editar serviço"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      aria-label="Eliminar serviço"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <AlertDialog open={itemToDelete === item.id} onOpenChange={(open) => !open && setItemToDelete(null)}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar serviço</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja eliminar este serviço? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={confirmDelete}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8 text-sm">
              Nenhum serviço cadastrado. Clique em &quot;Novo Serviço&quot; para começar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
