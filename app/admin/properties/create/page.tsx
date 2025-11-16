"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { propertiesApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, X } from "lucide-react"

export default function CreatePropertyPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const [formData, setFormData] = useState({
    reference: "",
    title: "",
    description: "",
    transactionType: "comprar",
    propertyType: "",
    isEmpreendimento: false,
    propertyState: "",
    energyClass: "",
    price: 0,
    totalArea: null as number | null,
    builtArea: null as number | null,
    usefulArea: null as number | null,
    bedrooms: 0,
    bathrooms: 0,
    hasOffice: false,
    hasLaundry: false,
    garageSpaces: 0,
    constructionYear: null as number | null,
    deliveryDate: "",
    distrito: "",
    concelho: "",
    address: "",
    paymentConditions: "",
    features: [] as string[],
    status: "active",
  })

  const createMutation = useMutation({
    mutationFn: ({ data, images }: { data: any; images: File[] }) =>
      propertiesApi.create(data, images),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      router.push(`/admin/properties/${data.id}`)
    },
    onError: (error) => {
      console.error("Error creating property:", error)
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedImages((prev) => [...prev, ...filesArray])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createMutation.mutate({
      data: formData,
      images: selectedImages,
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/properties")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Nova Propriedade</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Dados principais da propriedade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Referência</Label>
                <Input
                  placeholder="REF-001"
                  value={formData.reference}
                  onChange={(e) => updateField("reference", e.target.value)}
                />
              </div>

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
                placeholder="Ex: Apartamento T3 no Centro do Porto"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Textarea
                placeholder="Descrição detalhada da propriedade..."
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
                    <SelectItem value="arrender">Arrender</SelectItem>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado do Imóvel</Label>
                <Select
                  value={formData.propertyState}
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
                <Input
                  placeholder="Ex: A+, A, B"
                  value={formData.energyClass}
                  onChange={(e) => updateField("energyClass", e.target.value)}
                />
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
                  type="number"
                  placeholder="250000"
                  value={formData.price}
                  onChange={(e) => updateField("price", parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Condições de Pagamento</Label>
                <Input
                  placeholder="Ex: Aceita financiamento"
                  value={formData.paymentConditions}
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
                  placeholder="150"
                  value={formData.totalArea ?? ""}
                  onChange={(e) => updateField("totalArea", e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Área Construída (m²)</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={formData.builtArea ?? ""}
                  onChange={(e) => updateField("builtArea", e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Área Útil (m²)</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={formData.usefulArea ?? ""}
                  onChange={(e) => updateField("usefulArea", e.target.value ? Number(e.target.value) : null)}
                />
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
                  placeholder="3"
                  value={formData.bedrooms}
                  onChange={(e) => updateField("bedrooms", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Casas de Banho *</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="2"
                  value={formData.bathrooms}
                  onChange={(e) => updateField("bathrooms", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Garagem *</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="1"
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
                  placeholder="2020"
                  value={formData.constructionYear ?? ""}
                  onChange={(e) => updateField("constructionYear", e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Entrega</Label>
                <Input
                  placeholder="Ex: Dezembro 2025"
                  value={formData.deliveryDate}
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
                  placeholder="Porto"
                  value={formData.distrito}
                  onChange={(e) => updateField("distrito", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Concelho *</Label>
                <Input
                  placeholder="Porto"
                  value={formData.concelho}
                  onChange={(e) => updateField("concelho", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Morada Completa</Label>
              <Input
                placeholder="Rua Example, 123"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card>
          <CardHeader>
            <CardTitle>Imagens</CardTitle>
            <CardDescription>
              Adicione fotos da propriedade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Características Adicionais</CardTitle>
            <CardDescription>
              Uma característica por linha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ar condicionado&#10;Aquecimento central&#10;Varanda"
              value={formData.features.join('\n')}
              onChange={(e) => updateField("features", e.target.value.split('\n').filter(f => f.trim()))}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/properties")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Criando..." : "Criar Propriedade"}
          </Button>
        </div>
      </form>
    </div>
  )
}
