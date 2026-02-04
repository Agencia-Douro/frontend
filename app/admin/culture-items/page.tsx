"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cultureItemsApi } from "@/services/api"
import { CreateCultureItemDto, UpdateCultureItemDto, CultureItem } from "@/types/about-us"
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

export default function CultureItemsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<CultureItem | null>(null)
  const [formData, setFormData] = useState<CreateCultureItemDto>({
    title_pt: "",
    description_pt: "",
    order: 0,
  })

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["culture-items"],
    queryFn: () => cultureItemsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateCultureItemDto) => cultureItemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["culture-items"] })
      toast.success("Item criado com sucesso! Traduções automáticas em andamento.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar item")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCultureItemDto }) =>
      cultureItemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["culture-items"] })
      toast.success("Item atualizado com sucesso! Traduções automáticas em andamento.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar item")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cultureItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["culture-items"] })
      toast.success("Item deletado com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao deletar item")
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

  const handleEdit = (item: CultureItem) => {
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
          <h1 className="text-lg font-semibold text-foreground">Itens de Cultura</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os valores e cultura da empresa. Edite em português e as traduções serão feitas automaticamente.
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
              Novo Item
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{showForm ? (editingItem ? "Editar Item" : "Novo Item") : "Itens de Cultura"}</CardTitle>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6"
            >
              <h3 className="text-lg font-medium text-foreground mb-4">
                {editingItem ? "Editar Item" : "Novo Item"}
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
                    placeholder="Ex: Excelência"
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
                    placeholder="Descrição do valor ou cultura..."
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
                    Itens com ordem menor aparecem primeiro
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
                      aria-label="Editar item"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      aria-label="Eliminar item"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <AlertDialog open={itemToDelete === item.id} onOpenChange={(open) => !open && setItemToDelete(null)}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja eliminar este item? Esta ação não pode ser desfeita.
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
              Nenhum item de cultura cadastrado. Clique em &quot;Novo Item&quot; para começar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
