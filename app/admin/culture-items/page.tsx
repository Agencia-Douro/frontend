"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cultureItemsApi } from "@/services/api"
import { CreateCultureItemDto, UpdateCultureItemDto, CultureItem } from "@/types/about-us"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      deleteMutation.mutate(id)
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
      <div className="container mx-auto p-6">
        <p>A carregar...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="heading-tres-medium text-brown mb-2">Itens de Cultura</h1>
        <p className="body-16-regular text-grey">
          Gerencie os valores e cultura da empresa. Edite em português e as traduções
          serão feitas automaticamente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Itens de Cultura</CardTitle>
            <Button onClick={() => setShowForm(!showForm)} variant="brown">
              {showForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Item
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 border rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-medium mb-4">
                {editingItem ? "Editar Item" : "Novo Item"}
              </h3>
              <div className="space-y-4">
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
                  <p className="text-sm text-gray-500">
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
                  variant="brown"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
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
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{item.title_pt}</h3>
                      <span className="text-sm text-gray-400">
                        (Ordem: {item.order})
                      </span>
                    </div>
                    <p className="text-gray-600">{item.description_pt}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      className="px-2 py-1"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="red"
                      className="px-2 py-1"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum item de cultura cadastrado. Clique em "Novo Item" para
              começar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
