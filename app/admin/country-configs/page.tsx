"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { countryConfigsApi, CountryConfig } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"

export default function CountryConfigsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingCountry, setEditingCountry] = useState<CountryConfig | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    label: "",
    displayOrder: 0,
  })

  const { data: countries, isLoading } = useQuery({
    queryKey: ["country-configs"],
    queryFn: () => countryConfigsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { code: string; label: string; displayOrder?: number }) =>
      countryConfigsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["country-configs"] })
      toast.success("País adicionado com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao adicionar país")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: { label?: string; displayOrder?: number } }) =>
      countryConfigsApi.update(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["country-configs"] })
      toast.success("País atualizado com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar país")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (code: string) => countryConfigsApi.delete(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["country-configs"] })
      toast.success("País removido com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover país")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.label.trim()) {
      toast.error("O nome do país é obrigatório")
      return
    }

    if (editingCountry) {
      updateMutation.mutate({
        code: editingCountry.code,
        data: { label: formData.label, displayOrder: formData.displayOrder },
      })
    } else {
      if (!formData.code.trim() || formData.code.trim().length !== 2) {
        toast.error("O código ISO deve ter exatamente 2 letras (ex: PT, AE, GB)")
        return
      }
      createMutation.mutate({
        code: formData.code.trim().toUpperCase(),
        label: formData.label,
        displayOrder: formData.displayOrder,
      })
    }
  }

  const handleEdit = (country: CountryConfig) => {
    setEditingCountry(country)
    setFormData({ code: country.code, label: country.label, displayOrder: country.displayOrder })
    setShowForm(true)
  }

  const handleDelete = (code: string) => {
    if (confirm(`Tem certeza que deseja remover o país "${code}"? As zonas associadas continuarão a existir.`)) {
      deleteMutation.mutate(code)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCountry(null)
    setFormData({ code: "", label: "", displayOrder: 0 })
  }

  if (isLoading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Países / Regiões</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie os países que aparecem como abas nas Zonas Mais Desejadas
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo País
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingCountry ? `Editar: ${editingCountry.label}` : "Novo País"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código ISO *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: PT, AE, GB, FR..."
                  maxLength={2}
                  disabled={!!editingCountry}
                  required
                />
                <p className="text-xs text-gray-500">
                  Código ISO 3166-1 alpha-2 (2 letras). Não pode ser alterado após a criação.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Nome a exibir *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ex: Portugal, Dubai, Reino Unido..."
                  required
                />
                <p className="text-xs text-gray-500">
                  Este nome aparece na tab de seleção na página principal.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Ordem de Exibição</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingCountry ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {countries?.map((country) => (
          <Card key={country.code}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-sm text-gray-700">
                  {country.code}
                </div>
                <div>
                  <p className="font-semibold">{country.label}</p>
                  <p className="text-sm text-gray-500">Ordem: {country.displayOrder}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(country)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="brown"
                  size="icon"
                  onClick={() => handleDelete(country.code)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!countries || countries.length === 0) && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Nenhum país cadastrado. Adicione pelo menos um para as zonas aparecerem corretamente.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
