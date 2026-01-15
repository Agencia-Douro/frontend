"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { podcastContentApi } from "@/services/api"
import { UpdatePodcastContentDto } from "@/types/about-us"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"

export default function PodcastContentPage() {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<UpdatePodcastContentDto>({
    headerLabel_pt: "",
    pageTitle_pt: "",
    pageSubtitle_pt: "",
    pageDescription_pt: "",
    topicsLabel_pt: "",
    topicsTitle_pt: "",
    episodesLabel_pt: "",
    episodesTitle_pt: "",
    episodesDescription_pt: "",
    episode1Url: "",
    episode1Title_pt: "",
    episode2Url: "",
    episode2Title_pt: "",
    episode3Url: "",
    episode3Title_pt: "",
    episode4Url: "",
    episode4Title_pt: "",
    episode5Url: "",
    episode5Title_pt: "",
    episode6Url: "",
    episode6Title_pt: "",
    hostLabel_pt: "",
    hostName: "",
    hostDescription_pt: "",
  })

  const { data: content, isLoading } = useQuery({
    queryKey: ["podcast-content"],
    queryFn: () => podcastContentApi.get(),
  })

  useEffect(() => {
    if (content) {
      setFormData({
        headerLabel_pt: (content as any).headerLabel_pt || "",
        pageTitle_pt: (content as any).pageTitle_pt || "",
        pageSubtitle_pt: (content as any).pageSubtitle_pt || "",
        pageDescription_pt: (content as any).pageDescription_pt || "",
        topicsLabel_pt: (content as any).topicsLabel_pt || "",
        topicsTitle_pt: (content as any).topicsTitle_pt || "",
        episodesLabel_pt: (content as any).episodesLabel_pt || "",
        episodesTitle_pt: (content as any).episodesTitle_pt || "",
        episodesDescription_pt: (content as any).episodesDescription_pt || "",
        episode1Url: (content as any).episode1Url || "",
        episode1Title_pt: (content as any).episode1Title_pt || "",
        episode2Url: (content as any).episode2Url || "",
        episode2Title_pt: (content as any).episode2Title_pt || "",
        episode3Url: (content as any).episode3Url || "",
        episode3Title_pt: (content as any).episode3Title_pt || "",
        episode4Url: (content as any).episode4Url || "",
        episode4Title_pt: (content as any).episode4Title_pt || "",
        episode5Url: (content as any).episode5Url || "",
        episode5Title_pt: (content as any).episode5Title_pt || "",
        episode6Url: (content as any).episode6Url || "",
        episode6Title_pt: (content as any).episode6Title_pt || "",
        hostLabel_pt: (content as any).hostLabel_pt || "",
        hostName: (content as any).hostName || "",
        hostDescription_pt: (content as any).hostDescription_pt || "",
      })
    }
  }, [content])

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePodcastContentDto) => podcastContentApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-content"] })
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
      <div className="container mx-auto p-6">
        <p>A carregar...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="heading-tres-medium text-brown mb-2">
          Conteúdo da Página Podcast
        </h1>
        <p className="body-16-regular text-grey">
          Edite os textos em português. As traduções para inglês e francês serão
          feitas automaticamente via DeepL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Principal</CardTitle>
            <CardDescription>Textos da introdução do podcast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="headerLabel">Label Superior</Label>
              <Input
                id="headerLabel"
                value={formData.headerLabel_pt}
                onChange={(e) =>
                  setFormData({ ...formData, headerLabel_pt: e.target.value })
                }
                placeholder="Conteúdo Exclusivo"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pageTitle">Título da Página</Label>
              <Input
                id="pageTitle"
                value={formData.pageTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, pageTitle_pt: e.target.value })
                }
                placeholder="Podcast Norte Imobiliário e Business"
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
                placeholder="Conversas sobre o Mercado Imobiliário..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pageDescription">Descrição</Label>
              <Textarea
                id="pageDescription"
                value={formData.pageDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, pageDescription_pt: e.target.value })
                }
                rows={4}
                placeholder="Um podcast dedicado a discutir tendências..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção Tópicos */}
        <Card>
          <CardHeader>
            <CardTitle>Seção "O Que Abordamos"</CardTitle>
            <CardDescription>Títulos da seção de tópicos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="topicsLabel">Label</Label>
              <Input
                id="topicsLabel"
                value={formData.topicsLabel_pt}
                onChange={(e) =>
                  setFormData({ ...formData, topicsLabel_pt: e.target.value })
                }
                placeholder="Temas & Insights"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="topicsTitle">Título</Label>
              <Input
                id="topicsTitle"
                value={formData.topicsTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, topicsTitle_pt: e.target.value })
                }
                placeholder="O Que Abordamos"
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção Episódios */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Episódios</CardTitle>
            <CardDescription>Títulos da seção de episódios em destaque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="episodesLabel">Label</Label>
              <Input
                id="episodesLabel"
                value={formData.episodesLabel_pt}
                onChange={(e) =>
                  setFormData({ ...formData, episodesLabel_pt: e.target.value })
                }
                placeholder="Assista Agora"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="episodesTitle">Título</Label>
              <Input
                id="episodesTitle"
                value={formData.episodesTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, episodesTitle_pt: e.target.value })
                }
                placeholder="Episódios em Destaque"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="episodesDescription">Descrição</Label>
              <Textarea
                id="episodesDescription"
                value={formData.episodesDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, episodesDescription_pt: e.target.value })
                }
                rows={2}
                placeholder="Confira os nossos episódios mais assistidos..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Episódios do YouTube */}
        <Card>
          <CardHeader>
            <CardTitle>Episódios do YouTube</CardTitle>
            <CardDescription>
              Cole os links do YouTube dos episódios que deseja exibir em destaque (até 6)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium text-brown">Episódio {num}</h4>
                <div className="space-y-1">
                  <Label htmlFor={`episode${num}Url`}>Link do YouTube</Label>
                  <Input
                    id={`episode${num}Url`}
                    value={(formData as any)[`episode${num}Url`] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [`episode${num}Url`]: e.target.value })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`episode${num}Title`}>Título do Episódio</Label>
                  <Input
                    id={`episode${num}Title`}
                    value={(formData as any)[`episode${num}Title_pt`] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [`episode${num}Title_pt`]: e.target.value })
                    }
                    placeholder="Título do episódio..."
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Seção Apresentadora */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Apresentadora</CardTitle>
            <CardDescription>Informações sobre a apresentadora do podcast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="hostLabel">Label</Label>
              <Input
                id="hostLabel"
                value={formData.hostLabel_pt}
                onChange={(e) =>
                  setFormData({ ...formData, hostLabel_pt: e.target.value })
                }
                placeholder="Apresentadora"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hostName">Nome</Label>
              <Input
                id="hostName"
                value={formData.hostName}
                onChange={(e) =>
                  setFormData({ ...formData, hostName: e.target.value })
                }
                placeholder="Vânia Fernandes"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hostDescription">Descrição</Label>
              <Textarea
                id="hostDescription"
                value={formData.hostDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, hostDescription_pt: e.target.value })
                }
                rows={4}
                placeholder="Vânia Fernandes é uma profissional reconhecida..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="submit"
            variant="brown"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  )
}
