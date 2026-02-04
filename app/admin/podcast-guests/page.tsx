"use client"

import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { podcastGuestsApi, PodcastGuest, uploadApi } from "@/services/api"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
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
import { Pencil, Trash2, Plus, X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

export default function PodcastGuestsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingGuest, setEditingGuest] = useState<PodcastGuest | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    role_pt: "",
    imageUrl: "",
    order: 0,
    isActive: true,
  })

  const { data: guests, isLoading } = useQuery({
    queryKey: ["podcast-guests"],
    queryFn: () => podcastGuestsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { name: string; role_pt: string; imageUrl?: string; order?: number; isActive?: boolean }) =>
      podcastGuestsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-guests"] })
      toast.success("Convidado criado com sucesso! As traduções foram geradas automaticamente.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar convidado")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      podcastGuestsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-guests"] })
      toast.success("Convidado atualizado com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar convidado")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => podcastGuestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-guests"] })
      toast.success("Convidado removido com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover convidado")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error("O nome é obrigatório")
      return
    }

    if (!formData.role_pt) {
      toast.error("A função é obrigatória")
      return
    }

    const data = {
      name: formData.name,
      role_pt: formData.role_pt,
      imageUrl: formData.imageUrl || undefined,
      order: formData.order,
      isActive: formData.isActive,
    }

    if (editingGuest) {
      updateMutation.mutate({ id: editingGuest.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (guest: PodcastGuest) => {
    setEditingGuest(guest)
    setFormData({
      name: guest.name,
      role_pt: guest.role_pt,
      imageUrl: guest.imageUrl || "",
      order: guest.order,
      isActive: guest.isActive,
    })
    setShowForm(true)
  }

  const [guestToDelete, setGuestToDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => setGuestToDelete(id)

  const confirmDelete = () => {
    if (guestToDelete) {
      deleteMutation.mutate(guestToDelete)
      setGuestToDelete(null)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB")
      return
    }

    setUploadingImage(true)
    try {
      const result = await uploadApi.uploadImage(file)
      setFormData({ ...formData, imageUrl: result.url })
      toast.success("Imagem enviada com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload da imagem")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingGuest(null)
    setFormData({
      name: "",
      role_pt: "",
      imageUrl: "",
      order: 0,
      isActive: true,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Convidados do Podcast</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os convidados exibidos na página do podcast.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Novo Convidado
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingGuest ? "Editar Convidado" : "Novo Convidado"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm} aria-label="Fechar formulário">
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Dr. João Silva"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role_pt">Função (Português) *</Label>
                  <Input
                    id="role_pt"
                    value={formData.role_pt}
                    onChange={(e) => setFormData({ ...formData, role_pt: e.target.value })}
                    placeholder="Ex: Especialista em Investimentos"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagem</Label>
                {!formData.imageUrl ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted-foreground/30 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="guest-image-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="guest-image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="size-8 text-muted-foreground animate-spin" />
                          <span className="text-sm text-muted-foreground">Enviando imagem...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="size-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Clique para selecionar uma imagem</span>
                          <span className="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx. 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg overflow-hidden">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                      aria-label="Remover imagem"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
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
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : (editingGuest ? "Atualizar" : "Criar")}
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
        {guests?.map((guest: PodcastGuest) => (
          <Card key={guest.id} className={!guest.isActive ? "opacity-60" : ""}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {guest.imageUrl && (
                    <div className="w-16 h-16 relative rounded-full overflow-hidden shrink-0">
                      <Image
                        src={guest.imageUrl}
                        alt={guest.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{guest.name}</h3>
                      <span className="text-xs bg-muted px-2 py-1 rounded">Ordem: {guest.order}</span>
                      {!guest.isActive && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">Inativo</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{guest.role_pt}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium">EN:</span> {guest.role_en || "Sem tradução"}
                      </div>
                      <div>
                        <span className="font-medium">FR:</span> {guest.role_fr || "Sem tradução"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(guest)} aria-label="Editar convidado">
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(guest.id)}
                    disabled={deleteMutation.isPending}
                    aria-label="Remover convidado"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <AlertDialog open={guestToDelete === guest.id} onOpenChange={(open) => !open && setGuestToDelete(null)}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover convidado</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover este convidado? Esta ação não pode ser desfeita.
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

      {(!guests || guests.length === 0) && (
        <Card>
          <CardContent className="text-center text-muted-foreground">
            Nenhum convidado cadastrado. Clique em &quot;Novo Convidado&quot; para começar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
