"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { aboutUsContentApi } from "@/services/api"
import { UpdateAboutUsContentDto } from "@/types/about-us"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Textarea } from "@/components/ui-admin/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { toast } from "sonner"

export default function AboutUsContentPage() {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<UpdateAboutUsContentDto>({
    pageTitle_pt: "",
    pageSubtitle_pt: "",
    description1_pt: "",
    description2_pt: "",
    cultureLabel_pt: "",
    cultureTitle_pt: "",
    servicesLabel_pt: "",
    servicesTitle_pt: "",
    teamLabel_pt: "",
    teamTitle_pt: "",
    teamDescription_pt: "",
    televisionLabel_pt: "",
    televisionTitle_pt: "",
    televisionDescription_pt: "",
    youtubeLink1: "",
    youtubeLink2: "",
    youtubeLink3: "",
  })

  const { data: content, isLoading } = useQuery({
    queryKey: ["about-us-content"],
    queryFn: () => aboutUsContentApi.get(),
  })

  useEffect(() => {
    if (content) {
      setFormData({
        pageTitle_pt: (content as any).pageTitle_pt || "",
        pageSubtitle_pt: (content as any).pageSubtitle_pt || "",
        description1_pt: (content as any).description1_pt || "",
        description2_pt: (content as any).description2_pt || "",
        cultureLabel_pt: (content as any).cultureLabel_pt || "",
        cultureTitle_pt: (content as any).cultureTitle_pt || "",
        servicesLabel_pt: (content as any).servicesLabel_pt || "",
        servicesTitle_pt: (content as any).servicesTitle_pt || "",
        teamLabel_pt: (content as any).teamLabel_pt || "",
        teamTitle_pt: (content as any).teamTitle_pt || "",
        teamDescription_pt: (content as any).teamDescription_pt || "",
        televisionLabel_pt: (content as any).televisionLabel_pt || "",
        televisionTitle_pt: (content as any).televisionTitle_pt || "",
        televisionDescription_pt: (content as any).televisionDescription_pt || "",
        youtubeLink1: (content as any).youtubeLink1 || "",
        youtubeLink2: (content as any).youtubeLink2 || "",
        youtubeLink3: (content as any).youtubeLink3 || "",
      })
    }
  }, [content])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAboutUsContentDto) => aboutUsContentApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-us-content"] })
      toast.success("Conteúdo atualizado com sucesso! Traduções automáticas em andamento.")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar conteúdo")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
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
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Conteúdo da Página Sobre Nós
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edite os textos em português. As traduções para inglês e francês serão
          feitas automaticamente via DeepL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Principal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="pageTitle">Título da Página</Label>
              <Input
                id="pageTitle"
                value={formData.pageTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, pageTitle_pt: e.target.value })
                }
                placeholder="Sobre Nós"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pageSubtitle">Subtítulo</Label>
              <Input
                id="pageSubtitle"
                value={formData.pageSubtitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, pageSubtitle_pt: e.target.value })
                }
                placeholder="Especialistas em Imóveis de Luxo..."
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description1">Descrição 1</Label>
              <Textarea
                id="description1"
                value={formData.description1_pt}
                onChange={(e) =>
                  setFormData({ ...formData, description1_pt: e.target.value })
                }
                rows={4}
                placeholder="Na Agência Douro, a nossa missão é..."
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description2">Descrição 2</Label>
              <Textarea
                id="description2"
                value={formData.description2_pt}
                onChange={(e) =>
                  setFormData({ ...formData, description2_pt: e.target.value })
                }
                rows={4}
                placeholder="A atuar no mercado nacional e internacional..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção Cultura */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Cultura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="cultureLabel">Label</Label>
              <Input
                id="cultureLabel"
                value={formData.cultureLabel_pt}
                onChange={(e) =>
                  setFormData({ ...formData, cultureLabel_pt: e.target.value })
                }
                placeholder="Nossa Identidade"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="cultureTitle">Título</Label>
              <Input
                id="cultureTitle"
                value={formData.cultureTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, cultureTitle_pt: e.target.value })
                }
                placeholder="A Nossa Cultura"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção Serviços */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Serviços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="servicesLabel">Label</Label>
              <Input
                id="servicesLabel"
                value={formData.servicesLabel_pt}
                onChange={(e) =>
                  setFormData({ ...formData, servicesLabel_pt: e.target.value })
                }
                placeholder="O Que Oferecemos"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="servicesTitle">Título</Label>
              <Input
                id="servicesTitle"
                value={formData.servicesTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, servicesTitle_pt: e.target.value })
                }
                placeholder="Os Nossos Serviços"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção Equipa */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Equipa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="teamLabel">Label</Label>
              <Input
                id="teamLabel"
                value={formData.teamLabel_pt}
                onChange={(e) =>
                  setFormData({ ...formData, teamLabel_pt: e.target.value })
                }
                placeholder="Conheça a Nossa Equipa"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="teamTitle">Título</Label>
              <Input
                id="teamTitle"
                value={formData.teamTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, teamTitle_pt: e.target.value })
                }
                placeholder="A Nossa Equipa"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="teamDescription">Descrição da Equipa</Label>
              <Textarea
                id="teamDescription"
                value={formData.teamDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, teamDescription_pt: e.target.value })
                }
                rows={3}
                placeholder="A nossa equipa é composta por..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Nova Seção - Television */}
        <Card>
          <CardHeader>
            <CardTitle>Nova Seção - Television</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="televisionLabel">Label</Label>
              <Input
                id="televisionLabel"
                value={formData.televisionLabel_pt}
                onChange={(e) =>
                  setFormData({ ...formData, televisionLabel_pt: e.target.value })
                }
                placeholder="Na Televisão"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="televisionTitle">Título</Label>
              <Input
                id="televisionTitle"
                value={formData.televisionTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, televisionTitle_pt: e.target.value })
                }
                placeholder="Veja-nos na Televisão"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="televisionDescription">Descrição</Label>
              <Textarea
                id="televisionDescription"
                value={formData.televisionDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, televisionDescription_pt: e.target.value })
                }
                rows={3}
                placeholder="Confira as nossas aparições e entrevistas..."
              />
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <Label className="text-base font-medium">Links do YouTube</Label>
              
              <div className="space-y-1">
                <Label htmlFor="youtubeLink1">Link do YouTube 1</Label>
                <Input
                  id="youtubeLink1"
                  type="url"
                  value={formData.youtubeLink1}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeLink1: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="youtubeLink2">Link do YouTube 2</Label>
                <Input
                  id="youtubeLink2"
                  type="url"
                  value={formData.youtubeLink2}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeLink2: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="youtubeLink3">Link do YouTube 3</Label>
                <Input
                  id="youtubeLink3"
                  type="url"
                  value={formData.youtubeLink3}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeLink3: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  )
}
