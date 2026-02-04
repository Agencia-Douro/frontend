"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { newslettersApi, propertiesApi } from "@/services/api"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-admin/tabs"
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
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/newsletters" className="flex items-center gap-2 text-foreground hover:text-muted-foreground">
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            Voltar
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList variant="line" className="mb-6 w-full justify-start">
            <TabsTrigger variant="line" value="info">Informações</TabsTrigger>
            <TabsTrigger variant="line" value="content">Conteúdo</TabsTrigger>
            <TabsTrigger variant="line" value="properties">Imóveis</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0 space-y-8">
            <Card>
              <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
                <CardTitle className="text-lg font-semibold">Informações básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 px-0 pt-0 pb-4 bg-transparent">
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
                  {uploadingImage && <p className="text-sm text-muted-foreground">A enviar imagem…</p>}
                  {formData.coverImage && (
                    <img src={formData.coverImage} alt="Preview" className="w-full max-w-md h-48 object-cover rounded border mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-0 space-y-8">
            <Card>
              <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
                <CardTitle className="text-lg font-semibold">Conteúdo da newsletter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 px-0 pt-0 pb-4 bg-transparent">
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

          <TabsContent value="properties" className="mt-0 space-y-8">
            <Card>
              <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
                <CardTitle className="text-lg font-semibold">Imóveis relacionados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 px-0 pt-0 pb-4 bg-transparent">
                <div className="space-y-2">
                  <Label>Imóveis relacionados</Label>
                  <p className="mb-3 text-sm text-muted-foreground">
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

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-6">
          {activeTab === "properties" ? (
            <>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/newsletters">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "A criar…" : "Criar newsletter"}
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
