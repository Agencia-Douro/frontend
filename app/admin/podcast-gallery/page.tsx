"use client"

import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { podcastGalleryApi, PodcastGalleryImage, uploadApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

export default function PodcastGalleryPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<PodcastGalleryImage | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    imageUrl: "",
    alt_pt: "",
    order: 0,
    isActive: true,
  })

  const { data: images, isLoading } = useQuery({
    queryKey: ["podcast-gallery"],
    queryFn: () => podcastGalleryApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { imageUrl: string; alt_pt?: string; order?: number; isActive?: boolean }) =>
      podcastGalleryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-gallery"] })
      toast.success("Imagem adicionada com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao adicionar imagem")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      podcastGalleryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-gallery"] })
      toast.success("Imagem atualizada com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar imagem")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => podcastGalleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-gallery"] })
      toast.success("Imagem removida com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover imagem")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.imageUrl) {
      toast.error("A imagem é obrigatória")
      return
    }

    const data = {
      imageUrl: formData.imageUrl,
      alt_pt: formData.alt_pt || undefined,
      order: formData.order,
      isActive: formData.isActive,
    }

    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data })
    } else {
      createMutation.mutate(data)
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

  const handleEdit = (image: PodcastGalleryImage) => {
    setEditingImage(image)
    setFormData({
      imageUrl: image.imageUrl,
      alt_pt: image.alt_pt || "",
      order: image.order,
      isActive: image.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta imagem?")) {
      deleteMutation.mutate(id)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingImage(null)
    setFormData({
      imageUrl: "",
      alt_pt: "",
      order: 0,
      isActive: true,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (isLoading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Galeria do Podcast</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as imagens da galeria exibida na página do podcast.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Imagem
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingImage ? "Editar Imagem" : "Nova Imagem"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Imagem *</Label>
                {!formData.imageUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="gallery-image-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="gallery-image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                          <span className="text-sm text-gray-500">Enviando imagem...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-400" />
                          <span className="text-sm text-gray-500">Clique para selecionar uma imagem</span>
                          <span className="text-xs text-gray-400">PNG, JPG ou WEBP (máx. 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg overflow-hidden">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="brown"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt_pt">Texto Alternativo (Português)</Label>
                <Input
                  id="alt_pt"
                  value={formData.alt_pt}
                  onChange={(e) => setFormData({ ...formData, alt_pt: e.target.value })}
                  placeholder="Descrição da imagem para acessibilidade"
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
                  <Label htmlFor="isActive">Ativa</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : (editingImage ? "Atualizar" : "Adicionar")}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images?.map((image: PodcastGalleryImage) => (
          <Card key={image.id} className={!image.isActive ? "opacity-60" : ""}>
            <CardContent className="p-2">
              <div className="relative aspect-video mb-2 rounded overflow-hidden">
                <Image
                  src={image.imageUrl}
                  alt={image.alt_pt || "Gallery image"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">#{image.order}</span>
                  {!image.isActive && (
                    <span className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">Off</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEdit(image)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="brown"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(image.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {image.alt_pt && (
                <p className="text-xs text-gray-500 mt-1 truncate">{image.alt_pt}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!images || images.length === 0) && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Nenhuma imagem na galeria. Clique em &quot;Nova Imagem&quot; para começar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
