"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { podcastWhyListenApi, PodcastWhyListenCard } from "@/services/api"
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

export default function PodcastWhyListenPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<PodcastWhyListenCard | null>(null)
  const [formData, setFormData] = useState({
    iconKey: "",
    title_pt: "",
    subtext_pt: "",
    order: 0,
    isActive: true,
  })

  const { data: cards, isLoading } = useQuery({
    queryKey: ["podcast-why-listen"],
    queryFn: () => podcastWhyListenApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { iconKey: string; title_pt: string; subtext_pt: string; order?: number; isActive?: boolean }) =>
      podcastWhyListenApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-why-listen"] })
      toast.success("Card criado com sucesso! As traduções foram geradas automaticamente.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar card")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      podcastWhyListenApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-why-listen"] })
      toast.success("Card atualizado com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar card")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => podcastWhyListenApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-why-listen"] })
      toast.success("Card removido com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover card")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.iconKey || !formData.title_pt || !formData.subtext_pt) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const data = {
      iconKey: formData.iconKey,
      title_pt: formData.title_pt,
      subtext_pt: formData.subtext_pt,
      order: formData.order,
      isActive: formData.isActive,
    }

    if (editingCard) {
      updateMutation.mutate({ id: editingCard.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (card: PodcastWhyListenCard) => {
    setEditingCard(card)
    setFormData({
      iconKey: card.iconKey,
      title_pt: card.title_pt,
      subtext_pt: card.subtext_pt,
      order: card.order,
      isActive: card.isActive,
    })
    setShowForm(true)
  }

  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => setCardToDelete(id)

  const confirmDelete = () => {
    if (cardToDelete) {
      deleteMutation.mutate(cardToDelete)
      setCardToDelete(null)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCard(null)
    setFormData({
      iconKey: "",
      title_pt: "",
      subtext_pt: "",
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
          <h1 className="text-lg font-semibold text-foreground">Cards &quot;Por Que Ouvir&quot;</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os cards da seção &quot;Por Que Ouvir&quot; na página do podcast.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Novo Card
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingCard ? "Editar Card" : "Novo Card"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm} aria-label="Fechar formulário">
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iconKey">Chave do Ícone *</Label>
                  <Input
                    id="iconKey"
                    value={formData.iconKey}
                    onChange={(e) => setFormData({ ...formData, iconKey: e.target.value })}
                    placeholder="Ex: mic, users, star, trending-up"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Use nomes de ícones do Lucide: mic, users, star, trending-up, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_pt">Título (Português) *</Label>
                  <Input
                    id="title_pt"
                    value={formData.title_pt}
                    onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                    placeholder="Ex: Conteúdo de Qualidade"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtext_pt">Subtexto (Português) *</Label>
                <Textarea
                  id="subtext_pt"
                  value={formData.subtext_pt}
                  onChange={(e) => setFormData({ ...formData, subtext_pt: e.target.value })}
                  placeholder="Descrição do motivo para ouvir o podcast..."
                  rows={3}
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
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : (editingCard ? "Atualizar" : "Criar")}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {cards?.map((card: PodcastWhyListenCard) => (
          <Card key={card.id} className={!card.isActive ? "opacity-60" : ""}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl bg-muted p-2 rounded">{card.iconKey}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{card.title_pt}</h3>
                      <div className="flex gap-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">#{card.order}</span>
                        {!card.isActive && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Inativo</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 text-pretty">{card.subtext_pt}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium mb-1">EN:</p>
                      <p className="line-clamp-2">{card.title_en || "..."}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">FR:</p>
                      <p className="line-clamp-2">{card.title_fr || "..."}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(card)} aria-label="Editar card">
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(card.id)}
                    disabled={deleteMutation.isPending}
                    aria-label="Remover card"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <AlertDialog open={cardToDelete === card.id} onOpenChange={(open) => !open && setCardToDelete(null)}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover card</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover este card? Esta ação não pode ser desfeita.
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

      {(!cards || cards.length === 0) && (
        <Card>
          <CardContent className="text-center text-muted-foreground">
            Nenhum card cadastrado. Clique em &quot;Novo Card&quot; para começar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
