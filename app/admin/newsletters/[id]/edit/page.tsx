"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { newslettersApi } from "@/services/api"
import Image from "next/image"
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

    // Garantir que propertyIds seja sempre um array (mesmo que vazio)
    const submitData = {
      ...formData,
      propertyIds: formData.propertyIds || []
    }

    updateMutation.mutate(submitData)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
        <p className="text-sm text-muted-foreground">A carregar…</p>
      </div>
    )
  }

  if (!newsletter) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
        <p className="text-sm text-muted-foreground">Newsletter não encontrada.</p>
        <Button variant="outline" size="sm" asChild className="mt-4">
          <Link href="/admin/newsletters">Voltar à lista</Link>
        </Button>
      </div>
    )
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
                  {uploadingImage && <p className="text-sm text-muted-foreground">A enviar imagem…</p>}
                  {formData.coverImage && (
                    <Image src={formData.coverImage} alt="Preview" className="w-full max-w-md h-48 object-cover border mt-2"
                      width={500}
                      height={500}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
                <CardTitle className="text-lg font-semibold">Conteúdo da newsletter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 px-0 pt-0 pb-4 bg-transparent">
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo *</Label>
                  <RichTextEditor
                    key={id}
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
                <div className="space-y-4">
                  <div>
                    <Label>Imóveis relacionados</Label>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Selecione os imóveis a associar a esta newsletter
                    </p>
                  </div>

                  {newsletter?.properties && newsletter.properties.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {newsletter.properties.map((property) => (
                        <div key={property.id} className="overflow-hidden">
                          <div className="relative h-40 w-full">
                            <Image
                              src={property.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <p className="line-clamp-1 text-sm font-medium text-foreground">{property.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {property.concelho}, {property.distrito}
                            </p>
                            <p className="mt-2 text-sm font-medium tabular-nums text-foreground">
                              {new Intl.NumberFormat("pt-PT", {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 0,
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

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-6">
          {activeTab === "properties" ? (
            <>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/newsletters">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "A guardar…" : "Guardar alterações"}
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
