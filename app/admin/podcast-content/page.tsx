"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { podcastContentApi } from "@/services/api"
import { UpdatePodcastContentDto } from "@/types/about-us"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Textarea } from "@/components/ui-admin/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-admin/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-admin/tabs"
import { toast } from "sonner"

export default function PodcastContentPage() {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<UpdatePodcastContentDto>({
    headerLabel_pt: "",
    pageTitle_pt: "",
    pageSubtitle_pt: "",
    pageDescription_pt: "",
    // About Section
    aboutLabel_pt: "",
    aboutTitle_pt: "",
    aboutIntro_pt: "",
    aboutOrigin_pt: "",
    aboutIntention_pt: "",
    aboutPresentation_pt: "",
    // Topics
    topicsLabel_pt: "",
    topicsTitle_pt: "",
    // Episodes
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
    // Host
    hostLabel_pt: "",
    hostName: "",
    hostDescription_pt: "",
    hostCredential_pt: "",
    hostParagraph1_pt: "",
    hostParagraph2_pt: "",
    hostParagraph3_pt: "",
    hostQuote_pt: "",
    hostLinkedInUrl: "",
    hostLinkedInLabel_pt: "",
    // Guests Header
    guestsLabel_pt: "",
    guestsTitle_pt: "",
    // Gallery Header
    galleryLabel_pt: "",
    galleryTitle_pt: "",
    galleryDescription_pt: "",
    // WhyListen Header
    whyListenLabel_pt: "",
    whyListenTitle_pt: "",
    whyListenSubtitle_pt: "",
    // Testimonials Header
    testimonialsLabel_pt: "",
    testimonialsTitle_pt: "",
    testimonialsSubtitle_pt: "",
    // CTA Final
    ctaLabel_pt: "",
    ctaTitle_pt: "",
    ctaDescription_pt: "",
    ctaHint_pt: "",
    ctaButtonLabel_pt: "",
    // Platforms Header
    platformsLabel_pt: "",
    platformsTitle_pt: "",
    platformsDescription_pt: "",
  })

  const { data: content, isLoading } = useQuery({
    queryKey: ["podcast-content"],
    queryFn: () => podcastContentApi.get(),
  })

  useEffect(() => {
    if (content) {
      const c = content as any
      setFormData({
        headerLabel_pt: c.headerLabel_pt || "",
        pageTitle_pt: c.pageTitle_pt || "",
        pageSubtitle_pt: c.pageSubtitle_pt || "",
        pageDescription_pt: c.pageDescription_pt || "",
        // About Section
        aboutLabel_pt: c.aboutLabel_pt || "",
        aboutTitle_pt: c.aboutTitle_pt || "",
        aboutIntro_pt: c.aboutIntro_pt || "",
        aboutOrigin_pt: c.aboutOrigin_pt || "",
        aboutIntention_pt: c.aboutIntention_pt || "",
        aboutPresentation_pt: c.aboutPresentation_pt || "",
        // Topics
        topicsLabel_pt: c.topicsLabel_pt || "",
        topicsTitle_pt: c.topicsTitle_pt || "",
        // Episodes
        episodesLabel_pt: c.episodesLabel_pt || "",
        episodesTitle_pt: c.episodesTitle_pt || "",
        episodesDescription_pt: c.episodesDescription_pt || "",
        episode1Url: c.episode1Url || "",
        episode1Title_pt: c.episode1Title_pt || "",
        episode2Url: c.episode2Url || "",
        episode2Title_pt: c.episode2Title_pt || "",
        episode3Url: c.episode3Url || "",
        episode3Title_pt: c.episode3Title_pt || "",
        episode4Url: c.episode4Url || "",
        episode4Title_pt: c.episode4Title_pt || "",
        episode5Url: c.episode5Url || "",
        episode5Title_pt: c.episode5Title_pt || "",
        episode6Url: c.episode6Url || "",
        episode6Title_pt: c.episode6Title_pt || "",
        // Host
        hostLabel_pt: c.hostLabel_pt || "",
        hostName: c.hostName || "",
        hostDescription_pt: c.hostDescription_pt || "",
        hostCredential_pt: c.hostCredential_pt || "",
        hostParagraph1_pt: c.hostParagraph1_pt || "",
        hostParagraph2_pt: c.hostParagraph2_pt || "",
        hostParagraph3_pt: c.hostParagraph3_pt || "",
        hostQuote_pt: c.hostQuote_pt || "",
        hostLinkedInUrl: c.hostLinkedInUrl || "",
        hostLinkedInLabel_pt: c.hostLinkedInLabel_pt || "",
        // Guests Header
        guestsLabel_pt: c.guestsLabel_pt || "",
        guestsTitle_pt: c.guestsTitle_pt || "",
        // Gallery Header
        galleryLabel_pt: c.galleryLabel_pt || "",
        galleryTitle_pt: c.galleryTitle_pt || "",
        galleryDescription_pt: c.galleryDescription_pt || "",
        // WhyListen Header
        whyListenLabel_pt: c.whyListenLabel_pt || "",
        whyListenTitle_pt: c.whyListenTitle_pt || "",
        whyListenSubtitle_pt: c.whyListenSubtitle_pt || "",
        // Testimonials Header
        testimonialsLabel_pt: c.testimonialsLabel_pt || "",
        testimonialsTitle_pt: c.testimonialsTitle_pt || "",
        testimonialsSubtitle_pt: c.testimonialsSubtitle_pt || "",
        // CTA Final
        ctaLabel_pt: c.ctaLabel_pt || "",
        ctaTitle_pt: c.ctaTitle_pt || "",
        ctaDescription_pt: c.ctaDescription_pt || "",
        ctaHint_pt: c.ctaHint_pt || "",
        ctaButtonLabel_pt: c.ctaButtonLabel_pt || "",
        // Platforms Header
        platformsLabel_pt: c.platformsLabel_pt || "",
        platformsTitle_pt: c.platformsTitle_pt || "",
        platformsDescription_pt: c.platformsDescription_pt || "",
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
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 md:px-6">
        <p className="text-sm text-muted-foreground">A carregar…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-6 md:px-6">
      <div className="mb-4 shrink-0">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Conteúdo da página Podcast
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edite os textos em português. As traduções para inglês e francês são feitas automaticamente via DeepL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Tabs defaultValue="hero" className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TabsList variant="line" className="w-full shrink-0 justify-start">
            <TabsTrigger variant="line" value="hero">Hero</TabsTrigger>
            <TabsTrigger variant="line" value="sobre">Sobre</TabsTrigger>
            <TabsTrigger variant="line" value="apresentadora">Apresentadora</TabsTrigger>
            <TabsTrigger variant="line" value="seccoes">Secções</TabsTrigger>
            <TabsTrigger variant="line" value="episodios">Episódios</TabsTrigger>
            <TabsTrigger variant="line" value="plataformas-cta">Plataformas e CTA</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>Seção Principal (Hero)</CardTitle>
            <CardDescription>Textos da introdução do podcast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
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
            </div>
          </TabsContent>

          <TabsContent value="sobre" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-6 pb-6">
        {/* Seção About */}
        <Card>
          <CardHeader>
            <CardTitle>Seção "Sobre o Podcast"</CardTitle>
            <CardDescription>Textos da seção de apresentação do podcast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="aboutLabel">Label</Label>
                <Input
                  id="aboutLabel"
                  value={formData.aboutLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, aboutLabel_pt: e.target.value })
                  }
                  placeholder="Sobre o Podcast"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="aboutTitle">Título</Label>
                <Input
                  id="aboutTitle"
                  value={formData.aboutTitle_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, aboutTitle_pt: e.target.value })
                  }
                  placeholder="Norte Imobiliário & Business"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="aboutIntro">Introdução</Label>
              <Textarea
                id="aboutIntro"
                value={formData.aboutIntro_pt}
                onChange={(e) =>
                  setFormData({ ...formData, aboutIntro_pt: e.target.value })
                }
                rows={3}
                placeholder="Texto de introdução sobre o podcast..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="aboutOrigin">Origem / História</Label>
              <Textarea
                id="aboutOrigin"
                value={formData.aboutOrigin_pt}
                onChange={(e) =>
                  setFormData({ ...formData, aboutOrigin_pt: e.target.value })
                }
                rows={3}
                placeholder="Como surgiu o podcast..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="aboutIntention">Intenção / Objetivo</Label>
              <Textarea
                id="aboutIntention"
                value={formData.aboutIntention_pt}
                onChange={(e) =>
                  setFormData({ ...formData, aboutIntention_pt: e.target.value })
                }
                rows={3}
                placeholder="O objetivo do podcast é..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="aboutPresentation">Apresentação</Label>
              <Textarea
                id="aboutPresentation"
                value={formData.aboutPresentation_pt}
                onChange={(e) =>
                  setFormData({ ...formData, aboutPresentation_pt: e.target.value })
                }
                rows={3}
                placeholder="Apresentação geral..."
              />
            </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>

          <TabsContent value="apresentadora" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-6 pb-6">
        {/* Seção Apresentadora */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Apresentadora</CardTitle>
            <CardDescription>Informações completas sobre a apresentadora do podcast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-1">
              <Label htmlFor="hostCredential">Credencial / Título Profissional</Label>
              <Input
                id="hostCredential"
                value={formData.hostCredential_pt}
                onChange={(e) =>
                  setFormData({ ...formData, hostCredential_pt: e.target.value })
                }
                placeholder="CEO & Fundadora da Agência do Douro"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hostDescription">Descrição (Legacy)</Label>
              <Textarea
                id="hostDescription"
                value={formData.hostDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, hostDescription_pt: e.target.value })
                }
                rows={3}
                placeholder="Vânia Fernandes é uma profissional reconhecida..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hostParagraph1">Parágrafo 1</Label>
              <Textarea
                id="hostParagraph1"
                value={formData.hostParagraph1_pt}
                onChange={(e) =>
                  setFormData({ ...formData, hostParagraph1_pt: e.target.value })
                }
                rows={3}
                placeholder="Primeiro parágrafo da biografia..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hostParagraph2">Parágrafo 2</Label>
              <Textarea
                id="hostParagraph2"
                value={formData.hostParagraph2_pt}
                onChange={(e) =>
                  setFormData({ ...formData, hostParagraph2_pt: e.target.value })
                }
                rows={3}
                placeholder="Segundo parágrafo da biografia..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hostParagraph3">Parágrafo 3</Label>
              <Textarea
                id="hostParagraph3"
                value={formData.hostParagraph3_pt}
                onChange={(e) =>
                  setFormData({ ...formData, hostParagraph3_pt: e.target.value })
                }
                rows={3}
                placeholder="Terceiro parágrafo da biografia..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hostQuote">Citação / Quote</Label>
              <Textarea
                id="hostQuote"
                value={formData.hostQuote_pt}
                onChange={(e) =>
                  setFormData({ ...formData, hostQuote_pt: e.target.value })
                }
                rows={2}
                placeholder="Uma frase marcante da apresentadora..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="hostLinkedInUrl">URL do LinkedIn</Label>
                <Input
                  id="hostLinkedInUrl"
                  value={formData.hostLinkedInUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, hostLinkedInUrl: e.target.value })
                  }
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="hostLinkedInLabel">Texto do Botão LinkedIn</Label>
                <Input
                  id="hostLinkedInLabel"
                  value={formData.hostLinkedInLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, hostLinkedInLabel_pt: e.target.value })
                  }
                  placeholder="Conectar no LinkedIn"
                />
              </div>
            </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>

          <TabsContent value="seccoes" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-6 pb-6">
        {/* Seção Tópicos */}
        <Card>
          <CardHeader>
            <CardTitle>Seção "O Que Abordamos"</CardTitle>
            <CardDescription>Títulos da seção de tópicos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Seção Convidados Header */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Convidados (Header)</CardTitle>
            <CardDescription>Títulos da seção de convidados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="guestsLabel">Label</Label>
                <Input
                  id="guestsLabel"
                  value={formData.guestsLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, guestsLabel_pt: e.target.value })
                  }
                  placeholder="Convidados Especiais"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="guestsTitle">Título</Label>
                <Input
                  id="guestsTitle"
                  value={formData.guestsTitle_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, guestsTitle_pt: e.target.value })
                  }
                  placeholder="Quem Já Passou Por Aqui"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção Galeria Header */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Galeria (Header)</CardTitle>
            <CardDescription>Títulos da seção de galeria de fotos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="galleryLabel">Label</Label>
                <Input
                  id="galleryLabel"
                  value={formData.galleryLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, galleryLabel_pt: e.target.value })
                  }
                  placeholder="Galeria"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="galleryTitle">Título</Label>
                <Input
                  id="galleryTitle"
                  value={formData.galleryTitle_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, galleryTitle_pt: e.target.value })
                  }
                  placeholder="Bastidores do Podcast"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="galleryDescription">Descrição</Label>
              <Textarea
                id="galleryDescription"
                value={formData.galleryDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, galleryDescription_pt: e.target.value })
                }
                rows={2}
                placeholder="Momentos especiais das gravações..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção Why Listen Header */}
        <Card>
          <CardHeader>
            <CardTitle>Seção "Por Que Ouvir" (Header)</CardTitle>
            <CardDescription>Títulos da seção de motivos para ouvir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="whyListenLabel">Label</Label>
                <Input
                  id="whyListenLabel"
                  value={formData.whyListenLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, whyListenLabel_pt: e.target.value })
                  }
                  placeholder="Por Que Ouvir"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="whyListenTitle">Título</Label>
                <Input
                  id="whyListenTitle"
                  value={formData.whyListenTitle_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, whyListenTitle_pt: e.target.value })
                  }
                  placeholder="Razões Para Acompanhar"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="whyListenSubtitle">Subtítulo</Label>
              <Textarea
                id="whyListenSubtitle"
                value={formData.whyListenSubtitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, whyListenSubtitle_pt: e.target.value })
                }
                rows={2}
                placeholder="Descubra o que torna o nosso podcast único..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção Testimonials Header */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Testemunhos (Header)</CardTitle>
            <CardDescription>Títulos da seção de testemunhos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="testimonialsLabel">Label</Label>
                <Input
                  id="testimonialsLabel"
                  value={formData.testimonialsLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, testimonialsLabel_pt: e.target.value })
                  }
                  placeholder="Testemunhos"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="testimonialsTitle">Título</Label>
                <Input
                  id="testimonialsTitle"
                  value={formData.testimonialsTitle_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, testimonialsTitle_pt: e.target.value })
                  }
                  placeholder="O Que Dizem Sobre Nós"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="testimonialsSubtitle">Subtítulo</Label>
              <Textarea
                id="testimonialsSubtitle"
                value={formData.testimonialsSubtitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, testimonialsSubtitle_pt: e.target.value })
                }
                rows={2}
                placeholder="Opiniões de quem acompanha o podcast..."
              />
            </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>

          <TabsContent value="episodios" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-6 pb-6">
        {/* Seção Episódios */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Episódios</CardTitle>
            <CardDescription>Títulos da seção de episódios em destaque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div key={num} className="space-y-3">
                <h4 className="font-medium text-foreground">Episódio {num}</h4>
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
            </div>
          </TabsContent>

          <TabsContent value="plataformas-cta" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-6 pb-6">
        {/* Seção Platforms Header */}
        <Card>
          <CardHeader>
            <CardTitle>Seção Plataformas (Header)</CardTitle>
            <CardDescription>Títulos da seção de plataformas de streaming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="platformsLabel">Label</Label>
                <Input
                  id="platformsLabel"
                  value={formData.platformsLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, platformsLabel_pt: e.target.value })
                  }
                  placeholder="Onde Nos Encontrar"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="platformsTitle">Título</Label>
                <Input
                  id="platformsTitle"
                  value={formData.platformsTitle_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, platformsTitle_pt: e.target.value })
                  }
                  placeholder="Disponível Nas Principais Plataformas"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="platformsDescription">Descrição</Label>
              <Textarea
                id="platformsDescription"
                value={formData.platformsDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, platformsDescription_pt: e.target.value })
                }
                rows={2}
                placeholder="Ouça no Spotify, YouTube, Apple Podcasts..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção CTA Final */}
        <Card>
          <CardHeader>
            <CardTitle>Seção CTA Final</CardTitle>
            <CardDescription>Textos do call-to-action final (convite para participar)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ctaLabel">Label</Label>
                <Input
                  id="ctaLabel"
                  value={formData.ctaLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaLabel_pt: e.target.value })
                  }
                  placeholder="Participe"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ctaTitle">Título</Label>
                <Input
                  id="ctaTitle"
                  value={formData.ctaTitle_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaTitle_pt: e.target.value })
                  }
                  placeholder="Quer Ser o Próximo Convidado?"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ctaDescription">Descrição</Label>
              <Textarea
                id="ctaDescription"
                value={formData.ctaDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, ctaDescription_pt: e.target.value })
                }
                rows={3}
                placeholder="Se você tem uma história inspiradora..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ctaHint">Dica / Incentivo</Label>
                <Input
                  id="ctaHint"
                  value={formData.ctaHint_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaHint_pt: e.target.value })
                  }
                  placeholder="Entre em contacto connosco!"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ctaButtonLabel">Texto do Botão</Label>
                <Input
                  id="ctaButtonLabel"
                  value={formData.ctaButtonLabel_pt}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaButtonLabel_pt: e.target.value })
                  }
                  placeholder="Enviar Proposta"
                />
              </div>
            </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 left-0 right-0 z-10 flex justify-end bg-background/95 py-3 backdrop-blur-sm">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "A guardar…" : "Guardar alterações"}
          </Button>
        </div>
      </form>
    </div>
  )
}
