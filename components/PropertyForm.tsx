"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Property } from "@/types/property"
import { formatCurrency, parseCurrency } from "@/lib/currency"

interface PropertyFormProps {
  initialData?: Property | null
  onSubmit: (data: any, images: File[], imagesToRemove?: string[]) => void
  isLoading?: boolean
  submitButtonText?: string
  cancelButtonText?: string
  onCancel?: () => void
}

export default function PropertyForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  onCancel,
}: PropertyFormProps) {
  const isEditMode = !!initialData

  const [formData, setFormData] = useState(
    initialData || {
      reference: "",
      title: "",
      description: "",
      transactionType: "comprar",
      propertyType: "",
      isEmpreendimento: false,
      propertyState: "",
      energyClass: "",
      price: "0",
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
      status: "active",
      images: [] as string[],
    }
  )

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
  const [priceDisplay, setPriceDisplay] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setPriceDisplay(formatCurrency(initialData.price))
    }
  }, [initialData])

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const stringValue = parseCurrency(inputValue)
    updateField("price", stringValue)
    setPriceDisplay(formatCurrency(stringValue))
  }

  const validateAreas = (field: string, value: number | null) => {
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

  const handleAreaChange = (field: string, value: string) => {
    const numValue = value ? Number(value) : null
    updateField(field, numValue)
    validateAreas(field, numValue)
  }

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
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img !== url)
    })
    setImagesToRemove((prev) => [...prev, url])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar se há erros de área
    if (Object.keys(errors).length > 0) {
      return
    }

    onSubmit(formData, selectedImages, imagesToRemove)
  }

  return (
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
          {isEditMode && (
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
          )}

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
                  <SelectItem value="arrendar">Arrendar</SelectItem>
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
                placeholder="Ex: Aceita financiamento"
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
                placeholder="150"
                value={formData.totalArea ?? ""}
                onChange={(e) => handleAreaChange("totalArea", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Área Construída (m²)</Label>
              <Input
                type="number"
                placeholder="120"
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
                placeholder="100"
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
              value={formData.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens *</CardTitle>
          <CardDescription>
            {isEditMode ? "Gerencie as fotos da propriedade" : "Adicione fotos da propriedade (mínimo 1)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditMode && formData.images && formData.images.length > 0 && (
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
              <h3 className="text-body-small font-medium mb-2">
                {isEditMode ? "Adicionar Novas Imagens" : "Imagens"}
              </h3>
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
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : submitButtonText}
        </Button>
      </div>
    </form>
  )
}
