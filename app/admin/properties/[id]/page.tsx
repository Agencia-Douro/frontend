"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { propertiesApi } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, MapPin, Bed, Bath, Car, Ruler, Calendar, Trash2, Pencil, Star } from "lucide-react"
import { formatPriceNumber, translatePropertyStatus } from "@/lib/currency"

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const propertyId = params.id as string
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertiesApi.getById(propertyId),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      router.push("/admin/properties")
    },
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => propertiesApi.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
      queryClient.invalidateQueries({ queryKey: ["properties"] })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate(propertyId)
  }

  const handleToggleFeatured = () => {
    toggleFeaturedMutation.mutate(propertyId)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando detalhes...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-500">
            Erro ao carregar propriedade: {error?.message || "Propriedade não encontrada"}
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/properties`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex gap-2">
          <Button
            variant={property.isFeatured ? "gold" : "brown"}
            onClick={handleToggleFeatured}
            disabled={toggleFeaturedMutation.isPending}
          >
            <Star className={`h-4 w-4 mr-2 ${property.isFeatured ? "fill-current" : ""}`} />
            {toggleFeaturedMutation.isPending
              ? "Processando..."
              : property.isFeatured
                ? "Remover Destaque"
                : "Destacar"}
          </Button>

          <Button
            variant="brown"
            onClick={() => router.push(`/admin/properties/${propertyId}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>

          <Button
            variant="brown"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Propriedade
          </Button>
        </div>
      </div>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a propriedade{" "}
              <span className="font-semibold">{property.title}</span>? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="brown"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="brown"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">{property.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {property.address && `${property.address} - `}
                      {property.concelho}, {property.distrito}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {formatPriceNumber(property.price)} €
                  </p>
                  <p className="text-body-small font-medium text-muted-foreground">
                    {translatePropertyStatus(property.status)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-semibold">
                      {property.totalArea || property.builtArea || property.usefulArea || 'N/A'}m²
                    </p>
                    <p className="text-xs text-muted-foreground">Área Total</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-semibold">{property.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Quartos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-semibold">{property.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Banheiros</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-semibold">{property.garageSpaces}</p>
                    <p className="text-xs text-muted-foreground">Vagas</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {property.image && (
            <Card>
              <CardHeader>
                <CardTitle>Imagem Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={property.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity max-w-2xl"
                >
                  <img
                    src={property.image}
                    alt={`${property.title} - Imagem principal`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-body-small font-medium">
                      Clique para ampliar
                    </span>
                  </div>
                </a>
              </CardContent>
            </Card>
          )}

          {property.imageSections && property.imageSections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Galeria por Seções</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {property.imageSections.map((section) => (
                  <div key={section.id} className="space-y-3">
                    <h3 className="font-semibold text-lg">{section.sectionName}</h3>
                    {section.images && section.images.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.images.map((photo, index) => (
                          <a
                            key={index}
                            href={photo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            <img
                              src={photo}
                              alt={`${section.sectionName} - Foto ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-body-small font-medium">
                                Clique para ampliar
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Nenhuma imagem nesta seção</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-body-small font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Imóvel Destacado:</span>
                <span className={`font-medium flex items-center gap-1 ${property.isFeatured ? "text-yellow-600" : ""}`}>
                  {property.isFeatured && <Star className="h-4 w-4 fill-current" />}
                  {property.isFeatured ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium capitalize">{property.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de Transação:</span>
                <span className="font-medium capitalize">{property.transactionType}</span>
              </div>
              {property.propertyState && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado do Imóvel:</span>
                  <span className="font-medium capitalize">{property.propertyState}</span>
                </div>
              )}
              {property.energyClass && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classe Energética:</span>
                  <span className="font-medium">{property.energyClass}</span>
                </div>
              )}
              {property.constructionYear && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ano de Construção:</span>
                  <span className="font-medium">{property.constructionYear}</span>
                </div>
              )}
              {property.deliveryDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Entrega:</span>
                  <span className="font-medium">{property.deliveryDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">É Empreendimento:</span>
                <span className="font-medium">{property.isEmpreendimento ? "Sim" : "Não"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tem Escritório:</span>
                <span className="font-medium">{property.hasOffice ? "Sim" : "Não"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tem Lavandaria:</span>
                <span className="font-medium">{property.hasLaundry ? "Sim" : "Não"}</span>
              </div>
              {property.totalArea && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área Total:</span>
                  <span className="font-medium">{property.totalArea}m²</span>
                </div>
              )}
              {property.builtArea && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área Construída:</span>
                  <span className="font-medium">{property.builtArea}m²</span>
                </div>
              )}
              {property.usefulArea && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área Útil:</span>
                  <span className="font-medium">{property.usefulArea}m²</span>
                </div>
              )}
              {property.paymentConditions && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condições de Pagamento:</span>
                  <span className="font-medium">{property.paymentConditions}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-body-small font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Atualizado em</p>
                  <p className="font-medium">
                    {new Date(property.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
