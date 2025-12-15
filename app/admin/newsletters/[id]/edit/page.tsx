"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { newslettersApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/RichTextEditor"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function EditNewsletterPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const id = params.id as string

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    coverImage: "",
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const result = await newslettersApi.uploadImage(file)
      setFormData({ ...formData, coverImage: result.url })
      toast.success("Imagem enviada com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload da imagem")
    } finally {
      setUploadingImage(false)
    }
  }

  const { data: newsletter, isLoading } = useQuery({
    queryKey: ["newsletter", id],
    queryFn: () => newslettersApi.getById(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (newsletter) {
      setFormData({
        title: newsletter.title,
        content: newsletter.content,
        category: newsletter.category,
        coverImage: newsletter.coverImage || "",
      })
    }
  }, [newsletter])

  const updateMutation = useMutation({
    mutationFn: (data: any) => newslettersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] })
      queryClient.invalidateQueries({ queryKey: ["newsletter", id] })
      toast.success("Newsletter atualizada com sucesso!")
      router.push("/admin/newsletters")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar newsletter")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!newsletter) {
    return (
      <div className="container mx-auto p-6">
        <p>Newsletter não encontrada</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/newsletters")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Newsletter</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Newsletter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título da newsletter"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                key={formData.category}
                value={formData.category || undefined}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mercado">Mercado</SelectItem>
                  <SelectItem value="dicas">Dicas</SelectItem>
                  <SelectItem value="noticias">Notícias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Imagem de Capa</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && <p className="text-sm text-gray-500">Enviando imagem...</p>}
              {formData.coverImage && (
                <img src={formData.coverImage} alt="Preview" className="w-full max-w-md h-48 object-cover rounded border mt-2" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <RichTextEditor
                key={id}
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Digite o conteúdo da newsletter..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/newsletters")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
