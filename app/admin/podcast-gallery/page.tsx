"use client"

import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { podcastGalleryApi, PodcastGalleryImage, uploadApi, MediaType } from "@/services/api"
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
import { Pencil, Trash2, Plus, X, Upload, Loader2, Play, ImageIcon, Video } from "lucide-react"
import Image from "next/image"

export default function PodcastGalleryPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<PodcastGalleryImage | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    mediaType: "image" as MediaType,
    imageUrl: "",
    videoUrl: "",
    alt_pt: "",
    order: 0,
    isActive: true,
  })
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)

  const { data: images, isLoading } = useQuery({
    queryKey: ["podcast-gallery"],
    queryFn: () => podcastGalleryApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { mediaType?: MediaType; imageUrl?: string; videoUrl?: string; alt_pt?: string; order?: number; isActive?: boolean }) =>
      podcastGalleryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-gallery"] })
      toast.success("Mídia adicionada com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao adicionar mídia")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { mediaType?: MediaType; imageUrl?: string; videoUrl?: string; alt_pt?: string; order?: number; isActive?: boolean } }) =>
      podcastGalleryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-gallery"] })
      toast.success("Mídia atualizada com sucesso!")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar mídia")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => podcastGalleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-gallery"] })
      toast.success("Mídia removida com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover mídia")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.mediaType === "image" && !formData.imageUrl) {
      toast.error("A imagem é obrigatória")
      return
    }

    if (formData.mediaType === "video" && !formData.videoUrl) {
      toast.error("O vídeo é obrigatório")
      return
    }

    const data = {
      mediaType: formData.mediaType,
      imageUrl: formData.imageUrl || undefined,
      videoUrl: formData.mediaType === "video" ? formData.videoUrl : undefined,
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

    if (file.size > 10 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 10MB")
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("video/")) {
      toast.error("Por favor, selecione um arquivo de vídeo")
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error("O vídeo deve ter no máximo 500MB")
      return
    }

    setUploadingVideo(true)
    try {
      const result = await uploadApi.uploadVideo(file)
      setFormData({ ...formData, videoUrl: result.url })
      toast.success("Vídeo enviado com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload do vídeo")
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: "" })
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const handleRemoveVideo = () => {
    setFormData({ ...formData, videoUrl: "" })
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  const handleEdit = (image: PodcastGalleryImage) => {
    setEditingImage(image)
    setFormData({
      mediaType: image.mediaType || "image",
      imageUrl: image.imageUrl || "",
      videoUrl: image.videoUrl || "",
      alt_pt: image.alt_pt || "",
      order: image.order,
      isActive: image.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => setImageToDelete(id)

  const confirmDelete = () => {
    if (imageToDelete) {
      deleteMutation.mutate(imageToDelete)
      setImageToDelete(null)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingImage(null)
    setFormData({
      mediaType: "image",
      imageUrl: "",
      videoUrl: "",
      alt_pt: "",
      order: 0,
      isActive: true,
    })
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
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
          <h1 className="text-lg font-semibold text-foreground">Galeria do Podcast</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as imagens e vídeos da galeria exibida na página do podcast.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Nova Mídia
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingImage ? "Editar Mídia" : "Nova Mídia"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm} aria-label="Fechar formulário">
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seletor de Tipo de Mídia */}
              <div className="space-y-2">
                <Label>Tipo de Mídia</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.mediaType === "image" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, mediaType: "image" })}
                    className="flex-1"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Imagem
                  </Button>
                  <Button
                    type="button"
                    variant={formData.mediaType === "video" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, mediaType: "video" })}
                    className="flex-1"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Vídeo
                  </Button>
                </div>
              </div>

              {/* Campo para Vídeo */}
              {formData.mediaType === "video" && (
                <div className="space-y-2">
                  <Label>Vídeo *</Label>
                  {!formData.videoUrl ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground/30 transition-colors">
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="gallery-video-upload"
                        disabled={uploadingVideo}
                      />
                      <label
                        htmlFor="gallery-video-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {uploadingVideo ? (
                          <>
                            <Loader2 className="size-10 text-muted-foreground animate-spin" />
                            <span className="text-sm text-muted-foreground">Enviando vídeo...</span>
                          </>
                        ) : (
                          <>
                            <Video className="size-10 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Clique para selecionar um vídeo</span>
                            <span className="text-xs text-muted-foreground">MP4, WebM, MOV ou AVI (máx. 500MB)</span>
                          </>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="relative border rounded-lg overflow-hidden">
                      <video
                        src={formData.videoUrl}
                        className="w-full h-48 object-cover bg-black"
                        controls
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveVideo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Campo para Imagem */}
              {formData.mediaType === "image" && (
                <div className="space-y-2">
                  <Label>Imagem *</Label>
                  {!formData.imageUrl ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground/30 transition-colors">
                      <input
                        ref={imageInputRef}
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
                            <Loader2 className="size-10 text-muted-foreground animate-spin" />
                            <span className="text-sm text-muted-foreground">Enviando imagem...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="size-10 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Clique para selecionar uma imagem</span>
                            <span className="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx. 10MB)</span>
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
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Thumbnail para vídeos (opcional) */}
              {formData.mediaType === "video" && (
                <div className="space-y-2">
                  <Label>Thumbnail do Vídeo (Opcional)</Label>
                  {!formData.imageUrl ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-muted-foreground/30 transition-colors">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="gallery-thumbnail-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="gallery-thumbnail-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="size-6 text-muted-foreground animate-spin" />
                            <span className="text-xs text-muted-foreground">Enviando...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="size-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Clique para adicionar uma thumbnail</span>
                          </>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="relative border rounded-lg overflow-hidden">
                      <Image
                        src={formData.imageUrl}
                        alt="Thumbnail"
                        width={200}
                        height={112}
                        className="w-full h-24 object-cover"
                        unoptimized
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="alt_pt">Texto Alternativo (Português)</Label>
                <Input
                  id="alt_pt"
                  value={formData.alt_pt}
                  onChange={(e) => setFormData({ ...formData, alt_pt: e.target.value })}
                  placeholder="Descrição da mídia para acessibilidade"
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
        {images?.map((image: PodcastGalleryImage) => {
          const isVideo = image.mediaType === "video"

          return (
            <Card key={image.id} className={!image.isActive ? "opacity-60" : ""}>
              <CardContent className="p-2">
                <div className="relative aspect-video mb-2 rounded overflow-hidden bg-muted">
                  {isVideo ? (
                    image.imageUrl ? (
                      <>
                        <Image
                          src={image.imageUrl}
                          alt={image.alt_pt || "Video thumbnail"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-red-600 rounded-full p-2">
                            <Play className="h-4 w-4 text-white fill-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <div className="text-center">
                          <Video className="size-8 text-muted-foreground mx-auto" />
                          <span className="text-xs text-muted-foreground mt-1 block">Vídeo</span>
                        </div>
                      </div>
                    )
                  ) : image.imageUrl ? (
                    <Image
                      src={image.imageUrl}
                      alt={image.alt_pt || "Gallery image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="size-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-muted px-2 py-1 rounded">#{image.order}</span>
                    {isVideo && (
                      <span className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">Vídeo</span>
                    )}
                    {!image.isActive && (
                      <span className="text-xs bg-muted text-muted-foreground px-1 py-0.5 rounded">Off</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="size-7" onClick={() => handleEdit(image)} aria-label="Editar mídia">
                      <Pencil className="size-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-7"
                      onClick={() => handleDelete(image.id)}
                      disabled={deleteMutation.isPending}
                      aria-label="Remover mídia"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                    <AlertDialog open={imageToDelete === image.id} onOpenChange={(open) => !open && setImageToDelete(null)}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover mídia</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover esta mídia? Esta ação não pode ser desfeita.
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
                {image.alt_pt && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">{image.alt_pt}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {(!images || images.length === 0) && (
        <Card>
          <CardContent className="text-center text-muted-foreground">
            Nenhuma mídia na galeria. Clique em &quot;Nova Mídia&quot; para adicionar imagens ou vídeos.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
