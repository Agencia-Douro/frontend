"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { desiredZonesApi, DesiredZone, depoimentosApi, Depoimento } from "@/services/api"
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

export default function DepoimentosPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingDepoimento, setEditingDepoimento] = useState<Depoimento | null>(null)
  const [formData, setFormData] = useState({
    clientName: "",
    text: ""
  })

  const { data: depoimentos, isLoading } = useQuery({
    queryKey: ["depoimentos"],
    queryFn: () => depoimentosApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { clientName: string; text: string; }) =>
      depoimentosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos"] })
      toast.success("Depoimento criado com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar zona")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      depoimentosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos"] })
      toast.success("Depoimento atualizado com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar depoimento")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => depoimentosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depoimentos"] })
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

    const data: any = {
      clientName: formData.clientName,
      text: formData.text,
    }


    if (editingDepoimento) {
      updateMutation.mutate({ id: editingDepoimento.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (zone: Depoimento) => {
    setEditingDepoimento(zone)
    setFormData({
      clientName: zone.clientName,
      text: zone.text,
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
      text: ""
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
                <Label htmlFor="image">Texto</Label>
                <Input
                  id="text"
                  type="text"
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                />

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
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{d.clientName}</h3>
                </div>
                <p>{d.text}</p>
              </div>
              <div className="flex gap-2">
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
