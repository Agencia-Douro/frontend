"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { newslettersApi } from "@/services/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/RichTextEditor"
import PropertySelectorModal from "@/components/PropertySelectorModal"
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
    propertyIds: [] as string[],
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false)

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

  const handlePropertySelectionConfirm = (propertyIds: string[]) => {
    setFormData(prev => ({ ...prev, propertyIds }))
  }

  const { data: newsletter, isLoading } = useQuery({
    queryKey: ["newsletter", id],
    queryFn: () => newslettersApi.getById(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (newsletter) {
      // Extrair IDs das properties se existirem, caso contrário usar propertyIds
      const propertyIds = newsletter.propertyIds && Array.isArray(newsletter.propertyIds)
        ? newsletter.propertyIds
        : (newsletter.properties && Array.isArray(newsletter.properties)
          ? newsletter.properties.map((p: any) => p.id)
          : [])

      setFormData({
        title: newsletter.title || "",
        content: newsletter.content || "",
        category: newsletter.category || "",
        coverImage: newsletter.coverImage || "",
        propertyIds: propertyIds,
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

    // Garantir que propertyIds seja sempre um array (mesmo que vazio)
    const submitData = {
      ...formData,
      propertyIds: formData.propertyIds || []
    }

    updateMutation.mutate(submitData)
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
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="bg-transparent rounded-none p-0 h-auto w-full justify-start gap-3">
            <TabsTrigger
              value="info"
              className="cursor-pointer rounded-md border border-gray-300 data-[state=active]:border-transparent data-[state=active]:text-white data-[state=active]:bg-brown data-[state=active]:shadow-none px-4 py-3"
            >
              Informações
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="cursor-pointer rounded-md border border-gray-300 data-[state=active]:border-transparent data-[state=active]:text-white data-[state=active]:bg-brown data-[state=active]:shadow-none px-4 py-3"
            >
              Conteúdo
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="cursor-pointer rounded-md border border-gray-300 data-[state=active]:border-transparent data-[state=active]:text-white data-[state=active]:bg-brown data-[state=active]:shadow-none px-4 py-3"
            >
              Imóveis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
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
                  <Label htmlFor="coverImage">Imagem de Capa (Máximo 5MB)</Label>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo da Newsletter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
          </TabsContent>

          <TabsContent value="properties" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Imóveis Relacionados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Imóveis Relacionados</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Selecione os imóveis que deseja associar a esta newsletter
                    </p>
                  </div>

                  {/* Cards dos imóveis selecionados */}
                  {newsletter?.properties && newsletter.properties.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                      {newsletter.properties.map((property) => (
                        <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                          <div className="relative w-full h-40">
                            <Image
                              src={property.image}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <p className="body-16-medium text-black line-clamp-1">{property.title}</p>
                            <p className="body-14-medium text-grey mt-1">
                              {property.concelho}, {property.distrito}
                            </p>
                            <p className="body-20-medium text-black mt-2">
                              {new Intl.NumberFormat('pt-PT', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0
                              }).format(parseFloat(property.price))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Botão para editar seleção */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPropertyModalOpen(true)}
                    className="w-full"
                  >
                    {formData.propertyIds.length > 0
                      ? `${formData.propertyIds.length} imóvel(is) selecionado(s) - Clique para editar seleção`
                      : "Selecionar Imóveis"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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

      <PropertySelectorModal
        open={isPropertyModalOpen}
        onOpenChange={setIsPropertyModalOpen}
        selectedPropertyIds={formData.propertyIds}
        onConfirm={handlePropertySelectionConfirm}
      />
    </div>
  )
}
