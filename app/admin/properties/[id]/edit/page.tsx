"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { propertiesApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-line"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, X } from "lucide-react"
import { Property } from "@/types/property"
import { toast } from "sonner"

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const propertyId = params.id as string

  const formatCurrency = (value: string | number): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue)
  }

  const parseCurrency = (value: string): string => {
    const cleanedValue = value.replace(/[^\d]/g, '')
    return cleanedValue || "0"
  }

  const [formData, setFormData] = useState<Property | null>(null)
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [priceDisplay, setPriceDisplay] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertiesApi.getById(propertyId),
  })

  useEffect(() => {
    if (property) {
      setFormData(property)
      setImagesToRemove([]) // Reset images to remove when property changes
      setPriceDisplay(formatCurrency(property.price))
    }
  }, [property])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const stringValue = parseCurrency(inputValue)
    updateField("price", stringValue)
    setPriceDisplay(formatCurrency(stringValue))
  }

  const validateAreas = (field: string, value: number | null) => {
    if (!formData) return

    const newErrors = { ...errors }
    const areas = { ...formData, [field]: value }

    // Área construída não pode ser maior que área total
    if (areas.builtArea && areas.totalArea && areas.builtArea > areas.totalArea) {
      newErrors.builtArea = "Área construída não pode ser maior que área total"
    } else {
      delete newErrors.builtArea
    }

    // Área útil não pode ser maior que área construída ou total
    if (areas.usefulArea) {
      if (areas.builtArea && areas.usefulArea > areas.builtArea) {
        newErrors.usefulArea = "Área útil não pode ser maior que área construída"
      } else if (areas.totalArea && areas.usefulArea > areas.totalArea) {
        newErrors.usefulArea = "Área útil não pode ser maior que área total"
      } else {
        delete newErrors.usefulArea
      }
    }

    setErrors(newErrors)
  }

  const handleAreaChange = (field: keyof Property, value: string) => {
    const numValue = value ? Number(value) : null
    updateField(field, numValue)
    validateAreas(field as string, numValue)
  }

  const updateMutation = useMutation({
    mutationFn: ({ data, images, imagesToRemove }: { data: any; images: File[]; imagesToRemove: string[] }) =>
      propertiesApi.update(propertyId, data, images, imagesToRemove),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
      toast.success("Propriedade atualizada com sucesso!")
      router.push(`/admin/properties/${propertyId}`)
    },
    onError: (error: any) => {
      console.error("Error updating property:", error)

      // Extrair mensagem de erro do backend
      const errorMessage = error?.message || "Erro ao atualizar propriedade"

      // Se houver mensagens de erro mais detalhadas do backend
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (Array.isArray(error?.response?.data?.errors)) {
        // Se o backend retornar um array de erros
        error.response.data.errors.forEach((err: string) => {
          toast.error(err)
        })
      } else {
        toast.error(errorMessage)
      }
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedImages((prev) => [...prev, ...filesArray])
    }
  }

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (url: string) => {
    if (formData) {
      setFormData({
        ...formData,
        images: formData.images.filter((img) => img !== url)
      })
      setImagesToRemove((prev) => [...prev, url])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    // Validar se tem pelo menos uma imagem (existente ou nova)
    const totalImages = (formData.images?.length || 0) + selectedImages.length
    if (totalImages === 0) {
      toast.error("A propriedade precisa ter pelo menos uma imagem")
      return
    }

    // Validar se há erros de área
    if (Object.keys(errors).length > 0) {
      toast.error("Por favor, corrija os erros antes de continuar")
      return
    }

    updateMutation.mutate({
      data: formData,
      images: selectedImages,
      imagesToRemove: imagesToRemove
    })
  }

  const updateField = (field: keyof Property, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value })
    }
  }

  if (!formData) return null

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto p-6">
        <p>Propriedade não encontrada</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Propriedade</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                    <SelectItem value="rented">Arrendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Textarea
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Tipo de Transação *</Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value) => updateField("transactionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprar">Comprar</SelectItem>
                    <SelectItem value="arrendar">arrendar</SelectItem>
                    <SelectItem value="vender">Vender</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Imóvel *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => updateField("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="moradia">Moradia</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="armazem">Armazém</SelectItem>
                    <SelectItem value="escritorio">Escritório</SelectItem>
                    <SelectItem value="loja">Loja</SelectItem>
                    <SelectItem value="garagem">Garagem</SelectItem>
                    <SelectItem value="quinta">Quinta</SelectItem>
                    <SelectItem value="terreno_urbano">Terreno Urbano</SelectItem>
                    <SelectItem value="terreno_rustico">Terreno Rústico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado do Imóvel</Label>
                <Select
                  value={formData.propertyState || ""}
                  onValueChange={(value) => updateField("propertyState", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
                    <SelectItem value="renovado">Renovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isEmpreendimento"
                  checked={formData.isEmpreendimento}
                  onCheckedChange={(checked) => updateField("isEmpreendimento", checked)}
                />
                <Label htmlFor="isEmpreendimento" className="font-normal cursor-pointer">
                  É um empreendimento
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Classe Energética</Label>
                <Select
                  value={formData.energyClass || ""}
                  onValueChange={(value) => updateField("energyClass", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preço e Condições */}
        <Card>
          <CardHeader>
            <CardTitle>Preço e Condições</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Preço (€) *</Label>
                <Input
                  type="text"
                  placeholder="250.000 €"
                  value={priceDisplay}
                  onChange={handlePriceChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Condições de Pagamento</Label>
                <Input
                  value={formData.paymentConditions || ""}
                  onChange={(e) => updateField("paymentConditions", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Áreas */}
        <Card>
          <CardHeader>
            <CardTitle>Áreas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Área Total (m²)</Label>
                <Input
                  type="number"
                  value={formData.totalArea ?? ""}
                  onChange={(e) => handleAreaChange("totalArea", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Área Construída (m²)</Label>
                <Input
                  type="number"
                  value={formData.builtArea ?? ""}
                  onChange={(e) => handleAreaChange("builtArea", e.target.value)}
                  className={errors.builtArea ? "border-red-500" : ""}
                />
                {errors.builtArea && (
                  <p className="text-body-small text-red-500">{errors.builtArea}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Área Útil (m²)</Label>
                <Input
                  type="number"
                  value={formData.usefulArea ?? ""}
                  onChange={(e) => handleAreaChange("usefulArea", e.target.value)}
                  className={errors.usefulArea ? "border-red-500" : ""}
                />
                {errors.usefulArea && (
                  <p className="text-body-small text-red-500">{errors.usefulArea}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Características */}
        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Quartos *</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => updateField("bedrooms", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Casas de Banho *</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => updateField("bathrooms", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Garagem *</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.garageSpaces}
                  onChange={(e) => updateField("garageSpaces", parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasOffice"
                  checked={formData.hasOffice}
                  onCheckedChange={(checked) => updateField("hasOffice", checked)}
                />
                <Label htmlFor="hasOffice" className="font-normal cursor-pointer">
                  Tem escritório
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLaundry"
                  checked={formData.hasLaundry}
                  onCheckedChange={(checked) => updateField("hasLaundry", checked)}
                />
                <Label htmlFor="hasLaundry" className="font-normal cursor-pointer">
                  Tem lavandaria
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Construção */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Construção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ano de Construção</Label>
                <Input
                  type="number"
                  value={formData.constructionYear ?? ""}
                  onChange={(e) => updateField("constructionYear", e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Entrega</Label>
                <Input
                  value={formData.deliveryDate || ""}
                  onChange={(e) => updateField("deliveryDate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle>Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Distrito *</Label>
                <Input
                  value={formData.distrito}
                  onChange={(e) => updateField("distrito", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Concelho *</Label>
                <Input
                  value={formData.concelho}
                  onChange={(e) => updateField("concelho", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Morada Completa</Label>
              <Input
                value={formData.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card>
          <CardHeader>
            <CardTitle>Imagens</CardTitle>
            <CardDescription>Gerencie as fotos da propriedade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.images && formData.images.length > 0 && (
                <div>
                  <h3 className="text-body-small font-medium mb-2">Imagens Atuais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="brown"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(url)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-body-small font-medium mb-2">Adicionar Novas Imagens</h3>
                <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
              </div>

              {selectedImages.length > 0 && (
                <div>
                  <h3 className="text-body-small font-medium mb-2">Novas Imagens</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="brown"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="brown"
            onClick={() => router.push(`/admin/properties/${propertyId}`)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Atualizando..." : "Atualizar Propriedade"}
          </Button>
        </div>
      </form>
    </div>
  )
}
