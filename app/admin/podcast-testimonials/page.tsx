"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { podcastTestimonialsApi, PodcastTestimonial } from "@/services/api"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Textarea } from "@/components/ui-admin/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Switch } from "@/components/ui-admin/switch"
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

export default function PodcastTestimonialsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<PodcastTestimonial | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role_pt: "",
    text_pt: "",
    order: 0,
    isActive: true,
  })

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["podcast-testimonials"],
    queryFn: () => podcastTestimonialsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { name: string; role_pt: string; text_pt: string; order?: number; isActive?: boolean }) =>
      podcastTestimonialsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-testimonials"] })
      toast.success("Testemunho criado com sucesso! As traduções foram geradas automaticamente.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar testemunho")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      podcastTestimonialsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-testimonials"] })
      toast.success("Testemunho atualizado com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar testemunho")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => podcastTestimonialsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-testimonials"] })
      toast.success("Testemunho removido com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover testemunho")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.role_pt || !formData.text_pt) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const data = {
      name: formData.name,
      role_pt: formData.role_pt,
      text_pt: formData.text_pt,
      order: formData.order,
      isActive: formData.isActive,
    }

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (testimonial: PodcastTestimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role_pt: testimonial.role_pt,
      text_pt: testimonial.text_pt,
      order: testimonial.order,
      isActive: testimonial.isActive,
    })
    setShowForm(true)
  }

  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => setTestimonialToDelete(id)

  const confirmDelete = () => {
    if (testimonialToDelete) {
      deleteMutation.mutate(testimonialToDelete)
      setTestimonialToDelete(null)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingTestimonial(null)
    setFormData({
      name: "",
      role_pt: "",
      text_pt: "",
      order: 0,
      isActive: true,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        A carregar...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Testemunhos do Podcast</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os testemunhos exibidos na página do podcast.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Novo Testemunho
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingTestimonial ? "Editar Testemunho" : "Novo Testemunho"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm} aria-label="Fechar formulário">
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Maria Santos"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role_pt">Função (Português) *</Label>
                  <Input
                    id="role_pt"
                    value={formData.role_pt}
                    onChange={(e) => setFormData({ ...formData, role_pt: e.target.value })}
                    placeholder="Ex: Ouvinte Fiel"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text_pt">Testemunho (Português) *</Label>
                <Textarea
                  id="text_pt"
                  value={formData.text_pt}
                  onChange={(e) => setFormData({ ...formData, text_pt: e.target.value })}
                  placeholder="O que a pessoa disse sobre o podcast..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Ordem de Exibição</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="isActive">Ativo</Label>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  <strong>Nota:</strong> As traduções para inglês e francês serão geradas automaticamente via API DeepL.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : (editingTestimonial ? "Atualizar" : "Criar")}
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
        {testimonials?.map((testimonial: PodcastTestimonial) => (
          <Card key={testimonial.id} className={!testimonial.isActive ? "opacity-60" : ""}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded">Ordem: {testimonial.order}</span>
                    {!testimonial.isActive && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">Inativo</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground mb-2">{testimonial.role_pt}</p>
                  <p className="text-sm text-muted-foreground mb-3 italic text-pretty">&quot;{testimonial.text_pt}&quot;</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium mb-1">EN:</p>
                      <p className="line-clamp-2">{testimonial.text_en || "Sem tradução"}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">FR:</p>
                      <p className="line-clamp-2">{testimonial.text_fr || "Sem tradução"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(testimonial)} aria-label="Editar testemunho">
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deleteMutation.isPending}
                    aria-label="Remover testemunho"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <AlertDialog open={testimonialToDelete === testimonial.id} onOpenChange={(open) => !open && setTestimonialToDelete(null)}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover testemunho</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover este testemunho? Esta ação não pode ser desfeita.
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!testimonials || testimonials.length === 0) && (
        <Card>
          <CardContent className="text-center text-muted-foreground">
            Nenhum testemunho cadastrado. Clique em &quot;Novo Testemunho&quot; para começar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
