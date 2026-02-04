"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sellPropertyContentApi } from "@/services/api"
import { UpdateSellPropertyContentDto } from "@/types/about-us"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Textarea } from "@/components/ui-admin/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-admin/tabs"
import { toast } from "sonner"

export default function SellPropertyContentPage() {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<UpdateSellPropertyContentDto>({
    // Hero Section
    heroBadge_pt: "",
    heroTitle_pt: "",
    heroDescription_pt: "",
    // Form Section
    formTitle_pt: "",
    formSubmit_pt: "",
    // Stats Section
    statsBadge_pt: "",
    statsTitle_pt: "",
    statsDescription_pt: "",
    statsReachLabel_pt: "",
    statsReachDescription_pt: "",
    statsClientsLabel_pt: "",
    statsClientsDescription_pt: "",
    statsLocationsLabel_pt: "",
    statsLocationsDescription_pt: "",
    statsExperienceLabel_pt: "",
    statsExperienceDescription_pt: "",
    // Marketing Section
    marketingBadge_pt: "",
    marketingTitle_pt: "",
    marketingDescription_pt: "",
    marketingWebsiteTitle_pt: "",
    marketingWebsiteDescription_pt: "",
    marketingWebsiteStat_pt: "",
    marketingNewsletterTitle_pt: "",
    marketingNewsletterDescription_pt: "",
    marketingNewsletterStat_pt: "",
    marketingAgenciesTitle_pt: "",
    marketingAgenciesDescription_pt: "",
    marketingAgenciesStat_pt: "",
    marketingMediaTitle_pt: "",
    marketingMediaDescription_pt: "",
    marketingMediaStat_pt: "",
  })

  const { data: content, isLoading } = useQuery({
    queryKey: ["sell-property-content"],
    queryFn: () => sellPropertyContentApi.get(),
  })

  useEffect(() => {
    if (content) {
      setFormData({
        heroBadge_pt: (content as any).heroBadge_pt || "",
        heroTitle_pt: (content as any).heroTitle_pt || "",
        heroDescription_pt: (content as any).heroDescription_pt || "",
        formTitle_pt: (content as any).formTitle_pt || "",
        formSubmit_pt: (content as any).formSubmit_pt || "",
        statsBadge_pt: (content as any).statsBadge_pt || "",
        statsTitle_pt: (content as any).statsTitle_pt || "",
        statsDescription_pt: (content as any).statsDescription_pt || "",
        statsReachLabel_pt: (content as any).statsReachLabel_pt || "",
        statsReachDescription_pt: (content as any).statsReachDescription_pt || "",
        statsClientsLabel_pt: (content as any).statsClientsLabel_pt || "",
        statsClientsDescription_pt: (content as any).statsClientsDescription_pt || "",
        statsLocationsLabel_pt: (content as any).statsLocationsLabel_pt || "",
        statsLocationsDescription_pt: (content as any).statsLocationsDescription_pt || "",
        statsExperienceLabel_pt: (content as any).statsExperienceLabel_pt || "",
        statsExperienceDescription_pt: (content as any).statsExperienceDescription_pt || "",
        marketingBadge_pt: (content as any).marketingBadge_pt || "",
        marketingTitle_pt: (content as any).marketingTitle_pt || "",
        marketingDescription_pt: (content as any).marketingDescription_pt || "",
        marketingWebsiteTitle_pt: (content as any).marketingWebsiteTitle_pt || "",
        marketingWebsiteDescription_pt: (content as any).marketingWebsiteDescription_pt || "",
        marketingWebsiteStat_pt: (content as any).marketingWebsiteStat_pt || "",
        marketingNewsletterTitle_pt: (content as any).marketingNewsletterTitle_pt || "",
        marketingNewsletterDescription_pt: (content as any).marketingNewsletterDescription_pt || "",
        marketingNewsletterStat_pt: (content as any).marketingNewsletterStat_pt || "",
        marketingAgenciesTitle_pt: (content as any).marketingAgenciesTitle_pt || "",
        marketingAgenciesDescription_pt: (content as any).marketingAgenciesDescription_pt || "",
        marketingAgenciesStat_pt: (content as any).marketingAgenciesStat_pt || "",
        marketingMediaTitle_pt: (content as any).marketingMediaTitle_pt || "",
        marketingMediaDescription_pt: (content as any).marketingMediaDescription_pt || "",
        marketingMediaStat_pt: (content as any).marketingMediaStat_pt || "",
      })
    }
  }, [content])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSellPropertyContentDto) => sellPropertyContentApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sell-property-content"] })
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
      <div className="mb-6 shrink-0">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Conteúdo da página Vender imóvel
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edite os textos em português. As traduções para inglês e francês são feitas automaticamente via DeepL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Tabs defaultValue="hero" className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TabsList variant="line" className="w-full shrink-0 justify-start">
            <TabsTrigger variant="line" value="hero">Hero</TabsTrigger>
            <TabsTrigger variant="line" value="formulario">Formulário</TabsTrigger>
            <TabsTrigger variant="line" value="estatisticas">Estatísticas</TabsTrigger>
            <TabsTrigger variant="line" value="marketing">Marketing</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-8 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Seção Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heroBadge">Badge (etiqueta superior)</Label>
              <Input
                id="heroBadge"
                value={formData.heroBadge_pt}
                onChange={(e) =>
                  setFormData({ ...formData, heroBadge_pt: e.target.value })
                }
                placeholder="Vender o seu imóvel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroTitle">Título Principal</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, heroTitle_pt: e.target.value })
                }
                placeholder="Solicite uma avaliação gratuita do seu imóvel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroDescription">Descrição</Label>
              <Textarea
                id="heroDescription"
                value={formData.heroDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, heroDescription_pt: e.target.value })
                }
                rows={4}
                placeholder="A nossa equipa de especialistas está pronta para avaliar o seu imóvel..."
                required
              />
            </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>

          <TabsContent value="formulario" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-8 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Seção Formulário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="formTitle">Título do Formulário</Label>
              <Input
                id="formTitle"
                value={formData.formTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, formTitle_pt: e.target.value })
                }
                placeholder="Descreva o seu imóvel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formSubmit">Texto do Botão de Envio</Label>
              <Input
                id="formSubmit"
                value={formData.formSubmit_pt}
                onChange={(e) =>
                  setFormData({ ...formData, formSubmit_pt: e.target.value })
                }
                placeholder="Solicitar Avaliação"
                required
              />
            </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>

          <TabsContent value="estatisticas" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-8 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Seção Estatísticas / Alcance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="statsBadge">Badge</Label>
              <Input
                id="statsBadge"
                value={formData.statsBadge_pt}
                onChange={(e) =>
                  setFormData({ ...formData, statsBadge_pt: e.target.value })
                }
                placeholder="O nosso alcance"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statsTitle">Título</Label>
              <Input
                id="statsTitle"
                value={formData.statsTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, statsTitle_pt: e.target.value })
                }
                placeholder="Uma rede global ao seu serviço"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statsDescription">Descrição</Label>
              <Textarea
                id="statsDescription"
                value={formData.statsDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, statsDescription_pt: e.target.value })
                }
                rows={3}
                placeholder="A Agência Douro faz parte de uma rede imobiliária de excelência..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 pt-6 border-t border-border">
              {/* Reach */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">Alcance Global</h4>
                <div className="space-y-2">
                  <Label htmlFor="statsReachLabel">Label</Label>
                  <Input
                    id="statsReachLabel"
                    value={formData.statsReachLabel_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, statsReachLabel_pt: e.target.value })
                    }
                    placeholder="Alcance Global"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statsReachDescription">Descrição</Label>
                  <Input
                    id="statsReachDescription"
                    value={formData.statsReachDescription_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, statsReachDescription_pt: e.target.value })
                    }
                    placeholder="Presença em múltiplos países e continentes"
                  />
                </div>
              </div>

              {/* Clients */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">Clientes</h4>
                <div className="space-y-2">
                  <Label htmlFor="statsClientsLabel">Label</Label>
                  <Input
                    id="statsClientsLabel"
                    value={formData.statsClientsLabel_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, statsClientsLabel_pt: e.target.value })
                    }
                    placeholder="Clientes Ativos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statsClientsDescription">Descrição</Label>
                  <Input
                    id="statsClientsDescription"
                    value={formData.statsClientsDescription_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, statsClientsDescription_pt: e.target.value })
                    }
                    placeholder="Base de clientes qualificados e interessados"
                  />
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">Localizações</h4>
                <div className="space-y-2">
                  <Label htmlFor="statsLocationsLabel">Label</Label>
                  <Input
                    id="statsLocationsLabel"
                    value={formData.statsLocationsLabel_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, statsLocationsLabel_pt: e.target.value })
                    }
                    placeholder="Localizações"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statsLocationsDescription">Descrição</Label>
                  <Input
                    id="statsLocationsDescription"
                    value={formData.statsLocationsDescription_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, statsLocationsDescription_pt: e.target.value })
                    }
                    placeholder="Cobertura em Portugal e internacional"
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">Experiência</h4>
                <div className="space-y-2">
                  <Label htmlFor="statsExperienceLabel">Label</Label>
                  <Input
                    id="statsExperienceLabel"
                    value={formData.statsExperienceLabel_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, statsExperienceLabel_pt: e.target.value })
                    }
                    placeholder="Anos de Experiência"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statsExperienceDescription">Descrição</Label>
                  <Input
                    id="statsExperienceDescription"
                    value={formData.statsExperienceDescription_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, statsExperienceDescription_pt: e.target.value })
                    }
                    placeholder="Conhecimento profundo do mercado"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
            <div className="space-y-8 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Seção Marketing / Canais de Promoção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="marketingBadge">Badge</Label>
              <Input
                id="marketingBadge"
                value={formData.marketingBadge_pt}
                onChange={(e) =>
                  setFormData({ ...formData, marketingBadge_pt: e.target.value })
                }
                placeholder="Como promovemos"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketingTitle">Título</Label>
              <Input
                id="marketingTitle"
                value={formData.marketingTitle_pt}
                onChange={(e) =>
                  setFormData({ ...formData, marketingTitle_pt: e.target.value })
                }
                placeholder="Canais de promoção do seu imóvel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketingDescription">Descrição</Label>
              <Textarea
                id="marketingDescription"
                value={formData.marketingDescription_pt}
                onChange={(e) =>
                  setFormData({ ...formData, marketingDescription_pt: e.target.value })
                }
                rows={3}
                placeholder="Utilizamos uma estratégia de marketing multicanal..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 pt-6 border-t border-border">
              {/* Website */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">Website</h4>
                <div className="space-y-2">
                  <Label htmlFor="marketingWebsiteTitle">Título</Label>
                  <Input
                    id="marketingWebsiteTitle"
                    value={formData.marketingWebsiteTitle_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingWebsiteTitle_pt: e.target.value })
                    }
                    placeholder="Website"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingWebsiteDescription">Descrição</Label>
                  <Input
                    id="marketingWebsiteDescription"
                    value={formData.marketingWebsiteDescription_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingWebsiteDescription_pt: e.target.value })
                    }
                    placeholder="Divulgação no nosso portal imobiliário de alta qualidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingWebsiteStat">Estatística</Label>
                  <Input
                    id="marketingWebsiteStat"
                    value={formData.marketingWebsiteStat_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingWebsiteStat_pt: e.target.value })
                    }
                    placeholder="+50.000 visitantes/mês"
                  />
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">Newsletter</h4>
                <div className="space-y-2">
                  <Label htmlFor="marketingNewsletterTitle">Título</Label>
                  <Input
                    id="marketingNewsletterTitle"
                    value={formData.marketingNewsletterTitle_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingNewsletterTitle_pt: e.target.value })
                    }
                    placeholder="Newsletter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingNewsletterDescription">Descrição</Label>
                  <Input
                    id="marketingNewsletterDescription"
                    value={formData.marketingNewsletterDescription_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingNewsletterDescription_pt: e.target.value })
                    }
                    placeholder="Envio para a nossa base de clientes qualificados"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingNewsletterStat">Estatística</Label>
                  <Input
                    id="marketingNewsletterStat"
                    value={formData.marketingNewsletterStat_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingNewsletterStat_pt: e.target.value })
                    }
                    placeholder="+10.000 subscritores"
                  />
                </div>
              </div>

              {/* Agencies */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">Agências Parceiras</h4>
                <div className="space-y-2">
                  <Label htmlFor="marketingAgenciesTitle">Título</Label>
                  <Input
                    id="marketingAgenciesTitle"
                    value={formData.marketingAgenciesTitle_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingAgenciesTitle_pt: e.target.value })
                    }
                    placeholder="Agências Parceiras"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingAgenciesDescription">Descrição</Label>
                  <Input
                    id="marketingAgenciesDescription"
                    value={formData.marketingAgenciesDescription_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingAgenciesDescription_pt: e.target.value })
                    }
                    placeholder="Exposição em vitrinas e escritórios"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingAgenciesStat">Estatística</Label>
                  <Input
                    id="marketingAgenciesStat"
                    value={formData.marketingAgenciesStat_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingAgenciesStat_pt: e.target.value })
                    }
                    placeholder="Rede de parceiros"
                  />
                </div>
              </div>

              {/* Media */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">Redes Sociais</h4>
                <div className="space-y-2">
                  <Label htmlFor="marketingMediaTitle">Título</Label>
                  <Input
                    id="marketingMediaTitle"
                    value={formData.marketingMediaTitle_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingMediaTitle_pt: e.target.value })
                    }
                    placeholder="Redes Sociais"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingMediaDescription">Descrição</Label>
                  <Input
                    id="marketingMediaDescription"
                    value={formData.marketingMediaDescription_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingMediaDescription_pt: e.target.value })
                    }
                    placeholder="Divulgação nas principais plataformas digitais"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingMediaStat">Estatística</Label>
                  <Input
                    id="marketingMediaStat"
                    value={formData.marketingMediaStat_pt}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingMediaStat_pt: e.target.value })
                    }
                    placeholder="Alto engagement"
                  />
                </div>
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
