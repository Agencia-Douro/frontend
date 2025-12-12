"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { newslettersApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-line"
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
  })

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
