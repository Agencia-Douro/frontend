"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { depoimentosApi } from "@/services/api"
import { Depoimento, CreateDepoimentoDto, UpdateDepoimentoDto } from "@/types/about-us"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Textarea } from "@/components/ui-admin/textarea"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"

export default function DepoimentosPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingDepoimento, setEditingDepoimento] = useState<Depoimento | null>(null)
  const [formData, setFormData] = useState({
    clientName: "",
    text_pt: "",
  })

  const { data: depoimentos, isLoading } = useQuery({
    queryKey: ["depoimentos-admin"],
    queryFn: () => depoimentosApi.getAllRaw(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateDepoimentoDto) => depoimentosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos-admin"] })
      toast.success("Depoimento criado com sucesso!")
      toast.info("Traduções automáticas em andamento…")
      resetForm()
    },
    onError: (error: unknown) => {
      toast.error((error as Error)?.message || "Erro ao criar depoimento")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepoimentoDto }) =>
      depoimentosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos-admin"] })
      toast.success("Depoimento atualizado com sucesso!")
      toast.info("Traduções automáticas em andamento…")
      resetForm()
    },
    onError: (error: unknown) => {
      toast.error((error as Error)?.message || "Erro ao atualizar depoimento")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => depoimentosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos-admin"] })
      toast.success("Depoimento removido com sucesso!")
    },
    onError: (error: unknown) => {
      toast.error((error as Error)?.message || "Erro ao remover depoimento")
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
    const data = { clientName: formData.clientName, text_pt: formData.text_pt }
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
    if (confirm("Tem a certeza que deseja remover este depoimento?")) {
      deleteMutation.mutate(id)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingDepoimento(null)
    setFormData({ clientName: "", text_pt: "" })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
        <p className="text-sm text-muted-foreground">A carregar…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Depoimentos</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="size-4 shrink-0" aria-hidden />
            Novo depoimento
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">
              {editingDepoimento ? "Editar depoimento" : "Novo depoimento"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm} aria-label="Fechar formulário">
              <X className="size-4" aria-hidden />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do cliente *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text_pt">Texto (português) *</Label>
                <Textarea
                  id="text_pt"
                  rows={4}
                  value={formData.text_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, text_pt: e.target.value })
                  }
                  placeholder="Escreva o depoimento em português…"
                />
                <p className="text-xs text-muted-foreground">
                  O texto será traduzido automaticamente para inglês e francês.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
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

      <div className="space-y-4">
        {depoimentos?.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-foreground">{d.clientName}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.text_pt}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(d)}
                  aria-label="Editar depoimento"
                >
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(d.id)}
                  disabled={deleteMutation.isPending}
                  aria-label="Remover depoimento"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!depoimentos || depoimentos.length === 0) && (
        <Card>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">Nenhum depoimento. Clique em &quot;Novo depoimento&quot; para começar.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
