"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { siteConfigApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SiteConfigPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    clientesSatisfeitos: 0,
    rating: 0,
    imoveisVendidos: 0,
    anosExperiencia: 0,
  })

  const { data: config, isLoading } = useQuery({
    queryKey: ["site-config"],
    queryFn: () => siteConfigApi.get(),
  })

  useEffect(() => {
    if (config) {
      setFormData({
        clientesSatisfeitos: config.clientesSatisfeitos || 0,
        rating: config.rating || 0,
        imoveisVendidos: config.imoveisVendidos || 0,
        anosExperiencia: config.anosExperiencia || 0,
      })
    }
  }, [config])

  const updateMutation = useMutation({
    mutationFn: (data: any) => siteConfigApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-config"] })
      toast.success("Configurações atualizadas com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar configurações")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.clientesSatisfeitos < 0 || formData.rating < 0 || formData.rating > 5) {
      toast.error("Valores inválidos. Rating deve estar entre 0 e 5.")
      return
    }

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
        <h1 className="heading-tres-medium text-brown mb-2">Configurações do Site</h1>
        <p className="body-16-regular text-grey">
          Configure informações gerais exibidas no site
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas do Site</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1 w-full">
              <Label htmlFor="clientesSatisfeitos">Clientes Satisfeitos</Label>
              <Input
                id="clientesSatisfeitos"
                type="number"
                min="0"
                value={formData.clientesSatisfeitos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clientesSatisfeitos: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Digite o número de clientes satisfeitos"
                required
              />
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Digite o rating (ex: 4.5)"
                required
              />
              <p className="body-14-regular text-grey">
                Insira um valor entre 0 e 5 (pode usar decimais, ex: 4.5)
              </p>
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="anos">Anos de Experiência</Label>
              <Input
                id="anos"
                type="number"
                value={formData.anosExperiencia}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    anosExperiencia: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Digite os anos de experiencia"
                required
              />
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="imoveis">Imóveis Vendidos</Label>
              <Input
                id="imoveis"
                type="number"
                value={formData.imoveisVendidos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    imoveisVendidos: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Digite a quantidade de imóveis vendidos"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6 justify-end">
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
