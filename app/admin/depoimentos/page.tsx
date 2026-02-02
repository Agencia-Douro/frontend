"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { depoimentosApi } from "@/services/api"
import { Depoimento, CreateDepoimentoDto, UpdateDepoimentoDto } from "@/types/about-us"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function DepoimentosPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingDepoimento, setEditingDepoimento] = useState<Depoimento | null>(null)
  const [formData, setFormData] = useState({
    clientName: "",
    text_pt: ""
  })

  const { data: depoimentos, isLoading } = useQuery({
    queryKey: ["depoimentos-admin"],
    queryFn: () => depoimentosApi.getAllRaw(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateDepoimentoDto) =>
      depoimentosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos-admin"] })
      toast.success("Depoimento criado com sucesso!")
      toast.info("Traduções automáticas em andamento...")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar depoimento")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepoimentoDto }) =>
      depoimentosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos-admin"] })
      toast.success("Depoimento atualizado com sucesso!")
      toast.info("Traduções automáticas em andamento...")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar depoimento")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => depoimentosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos-admin"] })
      toast.success("Depoimento removido com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover depoimento")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clientName) {
      toast.error("O nome é obrigatório")
      return
    }

    if (!formData.text_pt) {
      toast.error("O texto é obrigatório")
      return
    }

    const data = {
      clientName: formData.clientName,
      text_pt: formData.text_pt,
    }

    if (editingDepoimento) {
      updateMutation.mutate({ id: editingDepoimento.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (depoimento: Depoimento) => {
    setEditingDepoimento(depoimento)
    setFormData({
      clientName: depoimento.clientName,
      text_pt: depoimento.text_pt,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover esse depoimento?")) {
      deleteMutation.mutate(id)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingDepoimento(null)
    setFormData({
      clientName: "",
      text_pt: ""
    })
  }

  if (isLoading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Depoimentos</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Depoimento
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingDepoimento ? "Editar Depoimento" : "Novo Depoimento"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cliente *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text_pt">Texto (Português) *</Label>
                <Textarea
                  id="text_pt"
                  rows={4}
                  value={formData.text_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, text_pt: e.target.value })
                  }
                  placeholder="Escreva o depoimento em português..."
                />
                <p className="text-xs text-muted-foreground">
                  O texto será traduzido automaticamente para inglês e francês.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingDepoimento ? "Atualizar" : "Criar"}
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
        {depoimentos?.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="font-semibold text-lg">{d.clientName}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2">{d.text_pt}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="icon" onClick={() => handleEdit(d)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="brown"
                  size="icon"
                  onClick={() => handleDelete(d.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!depoimentos || depoimentos.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Nenhum depoimento cadastrado.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
