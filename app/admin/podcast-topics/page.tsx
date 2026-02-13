"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { podcastTopicsApi, PodcastTopic, siteConfigApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"
import Image from "next/image"

export default function PodcastTopicsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingTopic, setEditingTopic] = useState<PodcastTopic | null>(null)
  const [formData, setFormData] = useState({
    title_pt: "",
    description_pt: "",
    order: 0,
  })
  const [apresentadoraImageFile, setApresentadoraImageFile] = useState<File | null>(null)
  const [apresentadoraImagePreview, setApresentadoraImagePreview] = useState<string | null>(null)
  const [diretorImageFile, setDiretorImageFile] = useState<File | null>(null)
  const [diretorImagePreview, setDiretorImagePreview] = useState<string | null>(null)

  const { data: topics, isLoading } = useQuery({
    queryKey: ["podcast-topics"],
    queryFn: () => podcastTopicsApi.getAll(),
  })

  const { data: config } = useQuery({
    queryKey: ["site-config"],
    queryFn: () => siteConfigApi.get(),
  })

  useEffect(() => {
    if (config?.apresentadoraImage) {
      setApresentadoraImagePreview(config.apresentadoraImage)
    }
    if (config?.diretorImage) {
      setDiretorImagePreview(config.diretorImage)
    }
  }, [config])

  const createMutation = useMutation({
    mutationFn: (data: { title_pt: string; description_pt: string; order?: number }) =>
      podcastTopicsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-topics"] })
      toast.success("Tópico criado com sucesso! As traduções foram geradas automaticamente.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar tópico")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      podcastTopicsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-topics"] })
      toast.success("Tópico atualizado com sucesso! As traduções foram atualizadas automaticamente.")
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar tópico")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => podcastTopicsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-topics"] })
      toast.success("Tópico removido com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover tópico")
    },
  })

  const updateApresentadoraMutation = useMutation({
    mutationFn: (imageFile: File) => {
      if (!config) throw new Error("Configuração não carregada")

      // Garantir que todos os campos numéricos tenham valores válidos
      const validatedConfig = {
        clientesSatisfeitos: Number(config.clientesSatisfeitos) || 0,
        rating: Number(config.rating) || 0,
        anosExperiencia: Number(config.anosExperiencia) || 0,
        imoveisVendidos: Number(config.imoveisVendidos) || 0,
        episodiosPublicados: config.episodiosPublicados !== undefined && config.episodiosPublicados !== null
          ? Number(config.episodiosPublicados)
          : undefined,
        temporadas: config.temporadas !== undefined && config.temporadas !== null
          ? Number(config.temporadas)
          : undefined,
        especialistasConvidados: config.especialistasConvidados !== undefined && config.especialistasConvidados !== null
          ? Number(config.especialistasConvidados)
          : undefined,
        eurosEmTransacoes: config.eurosEmTransacoes !== undefined && config.eurosEmTransacoes !== null
          ? Number(config.eurosEmTransacoes)
          : undefined,
      }

      return siteConfigApi.update(validatedConfig, imageFile)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-config"] })
      toast.success("Imagem da apresentadora atualizada com sucesso!")
      setApresentadoraImageFile(null)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar imagem")
    },
  })

  const updateDiretorMutation = useMutation({
    mutationFn: (imageFile: File) => {
      if (!config) throw new Error("Configuração não carregada")

      const validatedConfig = {
        clientesSatisfeitos: Number(config.clientesSatisfeitos) || 0,
        rating: Number(config.rating) || 0,
        anosExperiencia: Number(config.anosExperiencia) || 0,
        imoveisVendidos: Number(config.imoveisVendidos) || 0,
        episodiosPublicados: config.episodiosPublicados !== undefined && config.episodiosPublicados !== null
          ? Number(config.episodiosPublicados)
          : undefined,
        temporadas: config.temporadas !== undefined && config.temporadas !== null
          ? Number(config.temporadas)
          : undefined,
        especialistasConvidados: config.especialistasConvidados !== undefined && config.especialistasConvidados !== null
          ? Number(config.especialistasConvidados)
          : undefined,
        eurosEmTransacoes: config.eurosEmTransacoes !== undefined && config.eurosEmTransacoes !== null
          ? Number(config.eurosEmTransacoes)
          : undefined,
      }

      return siteConfigApi.update(validatedConfig, undefined, undefined, imageFile)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-config"] })
      toast.success("Imagem do diretor atualizada com sucesso!")
      setDiretorImageFile(null)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar imagem do diretor")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title_pt) {
      toast.error("O título é obrigatório")
      return
    }

    if (!formData.description_pt) {
      toast.error("A descrição é obrigatória")
      return
    }

    const data = {
      title_pt: formData.title_pt,
      description_pt: formData.description_pt,
      order: formData.order,
    }

    if (editingTopic) {
      updateMutation.mutate({ id: editingTopic.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (topic: PodcastTopic) => {
    setEditingTopic(topic)
    setFormData({
      title_pt: topic.title_pt,
      description_pt: topic.description_pt,
      order: topic.order,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este tópico?")) {
      deleteMutation.mutate(id)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingTopic(null)
    setFormData({
      title_pt: "",
      description_pt: "",
      order: 0,
    })
  }

  const handleApresentadoraImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setApresentadoraImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setApresentadoraImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveApresentadoraImage = () => {
    if (!apresentadoraImageFile) {
      toast.error("Selecione uma imagem primeiro")
      return
    }
    updateApresentadoraMutation.mutate(apresentadoraImageFile)
  }

  const handleDiretorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDiretorImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setDiretorImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveDiretorImage = () => {
    if (!diretorImageFile) {
      toast.error("Selecione uma imagem primeiro")
      return
    }
    updateDiretorMutation.mutate(diretorImageFile)
  }

  if (isLoading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Podcast</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie os tópicos e a imagem da apresentadora do podcast.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Tópico
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Imagem da Apresentadora</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apresentadora-image">Foto da Apresentadora do Podcast</Label>
              <Input
                id="apresentadora-image"
                type="file"
                accept="image/*"
                onChange={handleApresentadoraImageChange}
              />
            </div>
            {apresentadoraImagePreview && (
              <div className="mt-2">
                <Image
                  src={apresentadoraImagePreview}
                  alt="Preview Apresentadora"
                  width={200}
                  height={250}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            {apresentadoraImageFile && (
              <Button
                onClick={handleSaveApresentadoraImage}
                disabled={updateApresentadoraMutation.isPending}
              >
                {updateApresentadoraMutation.isPending ? "Salvando..." : "Salvar Imagem"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagem do Diretor de Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diretor-image">Foto do Diretor de Produção do Podcast</Label>
              <Input
                id="diretor-image"
                type="file"
                accept="image/*"
                onChange={handleDiretorImageChange}
              />
            </div>
            {diretorImagePreview && (
              <div className="mt-2">
                <Image
                  src={diretorImagePreview}
                  alt="Preview Diretor"
                  width={200}
                  height={250}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            {diretorImageFile && (
              <Button
                onClick={handleSaveDiretorImage}
                disabled={updateDiretorMutation.isPending}
              >
                {updateDiretorMutation.isPending ? "Salvando..." : "Salvar Imagem"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tópicos Abordados</h2>
        <p className="text-sm text-gray-500 mb-4">
          Gerencie os tópicos exibidos na seção "O Que Abordamos" da página do podcast.
          As traduções para inglês e francês são geradas automaticamente.
        </p>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingTopic ? "Editar Tópico" : "Novo Tópico"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_pt">Título (Português) *</Label>
                <Input
                  id="title_pt"
                  value={formData.title_pt}
                  onChange={(e) => setFormData({ ...formData, title_pt: e.target.value })}
                  placeholder="Ex: Tendências de Mercado"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_pt">Descrição (Português) *</Label>
                <Textarea
                  id="description_pt"
                  value={formData.description_pt}
                  onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                  placeholder="Ex: Análises aprofundadas sobre o mercado imobiliário português e suas constantes transformações."
                  rows={4}
                  required
                />
              </div>

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
                <p className="text-xs text-gray-500">
                  Menor número aparece primeiro. Use 0 para ordem padrão.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> As traduções para inglês e francês serão geradas automaticamente via API DeepL quando você salvar.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : (editingTopic ? "Atualizar" : "Criar")}
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
        {topics?.map((topic) => (
          <Card key={topic.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{topic.title_pt}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Ordem: {topic.order}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{topic.description_pt}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-medium text-gray-700 mb-1">🇬🇧 English:</p>
                      <p className="text-gray-600">{topic.title_en || "Sem tradução"}</p>
                      <p className="text-gray-500 mt-1 line-clamp-2">{topic.description_en || "Sem tradução"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-medium text-gray-700 mb-1">🇫🇷 Français:</p>
                      <p className="text-gray-600">{topic.title_fr || "Sem tradução"}</p>
                      <p className="text-gray-500 mt-1 line-clamp-2">{topic.description_fr || "Sem tradução"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(topic)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="brown"
                    size="icon"
                    onClick={() => handleDelete(topic.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!topics || topics.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Nenhum tópico cadastrado. Clique em "Novo Tópico" para começar.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
