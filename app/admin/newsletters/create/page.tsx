"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { newslettersApi, propertiesApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import PropertySelectorModal from "@/components/PropertySelectorModal"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function CreateNewsletterPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    coverImage: "",
    propertyIds: [] as string[],
  })
  const [customCategory, setCustomCategory] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

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

  const createMutation = useMutation({
    mutationFn: (data: any) => newslettersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] })
      toast.success("Newsletter criada com sucesso!")
      router.push("/admin/newsletters")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar newsletter")
    },
  })

  const goToNextTab = () => {
    const tabs = ["info", "content", "properties"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    if (formData.category === "outro" && !customCategory) {
      toast.error("Digite a categoria personalizada")
      return
    }

    const dataToSubmit = {
      ...formData,
      category: formData.category === "outro" ? customCategory : formData.category
    }

    createMutation.mutate(dataToSubmit)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/admin/newsletters">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData({ ...formData, category: value })
                      if (value !== "outro") {
                        setCustomCategory("")
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mercado">Mercado</SelectItem>
                      <SelectItem value="dicas">Dicas</SelectItem>
                      <SelectItem value="noticias">Notícias</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.category === "outro" && (
                    <div className="mt-2">
                      <Input
                        placeholder="Digite a categoria personalizada"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        required
                      />
                    </div>
                  )}
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
                    value={formData.content}
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
                <div className="space-y-2">
                  <Label>Imóveis Relacionados</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Selecione os imóveis que deseja associar a esta newsletter
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPropertyModalOpen(true)}
                    className="w-full"
                  >
                    {formData.propertyIds.length > 0
                      ? `${formData.propertyIds.length} imóvel(is) selecionado(s) - Clique para editar`
                      : "Selecionar Imóveis"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-6 justify-end">
          {activeTab === "properties" ? (
            <>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/newsletters">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Criando..." : "Criar Newsletter"}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={goToNextTab}>
              Próximo
            </Button>
          )}
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
