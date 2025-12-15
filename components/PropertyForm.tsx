"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { X, Plus, Trash2 } from "lucide-react"
import { Property, PropertyImageSection } from "@/types/property"
import { formatCurrency, parseCurrency } from "@/lib/currency"
import { imageSectionsApi } from "@/services/api"
import { toast } from "sonner"
import { DISTRITOS, DISTRITO_MUNICIPIOS, TIPOS_IMOVEL } from "@/app/shared/distritos"

interface PropertyFormProps {
  initialData?: Property | null
  onSubmit: (data: any, images: File[], imagesToRemove?: string[]) => Promise<Property> | void
  isLoading?: boolean
  submitButtonText?: string
  cancelButtonText?: string
  onCancel?: () => void
  onSuccess?: () => void
}

export default function PropertyForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  onCancel,
  onSuccess,
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
      image: "",
    }
  )

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageToRemove, setImageToRemove] = useState<string>("")
  const [priceDisplay, setPriceDisplay] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Estados para Image Sections
  const [imageSections, setImageSections] = useState<PropertyImageSection[]>([])
  const [newSections, setNewSections] = useState<Array<{
    sectionName: string
    images: File[]
    displayOrder: number
  }>>([])
  const [isLoadingSections, setIsLoadingSections] = useState(false)
  const [loadingDeleteSection, setLoadingDeleteSection] = useState<string | null>(null)
  const [loadingRemoveImage, setLoadingRemoveImage] = useState<string | null>(null)
  const [loadingAddImage, setLoadingAddImage] = useState<string | null>(null)

  // Get municipios based on selected distrito
  const municipios = formData.distrito ? DISTRITO_MUNICIPIOS[formData.distrito] || [] : []

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setPriceDisplay(formatCurrency(initialData.price))

      // Carregar seções de imagens se estiver no modo de edição
      if (initialData.id) {
        loadImageSections(initialData.id)
      }
    }
  }, [initialData])

  // Reset concelho when distrito changes
  useEffect(() => {
    if (formData.distrito && formData.concelho) {
      const validMunicipios = DISTRITO_MUNICIPIOS[formData.distrito] || []
      if (!validMunicipios.includes(formData.concelho)) {
        updateField("concelho", "")
      }
    }
  }, [formData.distrito, formData.concelho])

  const loadImageSections = async (propertyId: string) => {
    try {
      setIsLoadingSections(true)
      const sections = await imageSectionsApi.getAll(propertyId)
      setImageSections(sections)
    } catch (error) {
      console.error("Erro ao carregar seções de imagens:", error)
    } finally {
      setIsLoadingSections(false)
    }
  }

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

  const handleImageChange = (file: File) => {
    setSelectedImage(file)
  }

  const removeNewImage = () => {
    setSelectedImage(null)
  }

  const removeExistingImage = () => {
    setImageToRemove(formData.image)
    setFormData({
      ...formData,
      image: ""
    })
  }

  // Funções para gerenciar seções de imagens
  const suggestedSections = [
    'Cozinha',
    'Sala de Estar',
    'Sala de Jantar',
    'Quartos',
    'Quarto Principal',
    'Banheiros',
    'Escritório',
    'Lavandaria',
    'Garagem',
    'Exterior',
    'Jardim',
    'Piscina',
    'Varanda',
    'Vista',
    'Área Comum',
    'Ginásio',
    'Outros'
  ]

  const addNewSection = () => {
    setNewSections([
      ...newSections,
      {
        sectionName: '',
        images: [],
        displayOrder: Math.max(0, (imageSections.length || 0) + newSections.length)
      }
    ])
  }

  const updateNewSection = (index: number, field: string, value: any) => {
    const updated = [...newSections]
    updated[index] = { ...updated[index], [field]: value }
    setNewSections(updated)
  }

  const addImagesToNewSection = (index: number, files: File[]) => {
    const updated = [...newSections]
    updated[index].images = [...updated[index].images, ...files]
    setNewSections(updated)
  }

  const removeImageFromNewSection = (sectionIndex: number, imageIndex: number) => {
    const updated = [...newSections]
    updated[sectionIndex].images = updated[sectionIndex].images.filter((_, i) => i !== imageIndex)
    setNewSections(updated)
  }

  const removeNewSection = (index: number) => {
    setNewSections(newSections.filter((_, i) => i !== index))
  }

  const deleteExistingSection = async (sectionId: string) => {
    try {
      setLoadingDeleteSection(sectionId)
      await imageSectionsApi.delete(sectionId)
      setImageSections(imageSections.filter((s) => s.id !== sectionId))
      toast.success("Seção deletada com sucesso")
    } catch (error) {
      toast.error("Erro ao deletar seção")
    } finally {
      setLoadingDeleteSection(null)
    }
  }

  const addImageToExistingSection = async (sectionId: string, files: File[]) => {
    try {
      setLoadingAddImage(sectionId)
      const section = imageSections.find((s) => s.id === sectionId)
      if (!section) return

      await imageSectionsApi.update(sectionId, {
        imagesToAdd: files
      })

      // Recarregar seções
      if (initialData?.id) {
        await loadImageSections(initialData.id)
      }
      toast.success("Imagens adicionadas com sucesso")
    } catch (error) {
      toast.error("Erro ao adicionar imagens")
    } finally {
      setLoadingAddImage(null)
    }
  }

  const removeImageFromExistingSection = async (sectionId: string, imageUrl: string) => {
    try {
      setLoadingRemoveImage(`${sectionId}-${imageUrl}`)
      await imageSectionsApi.update(sectionId, {
        imagesToRemove: [imageUrl]
      })

      // Recarregar seções
      if (initialData?.id) {
        await loadImageSections(initialData.id)
      }
      toast.success("Imagem removida com sucesso")
    } catch (error) {
      toast.error("Erro ao remover imagem")
    } finally {
      setLoadingRemoveImage(null)
    }
  }

  const saveNewSections = async (propertyId: string) => {
    for (const section of newSections) {
      if (!section.sectionName) continue

      try {
        // Garantir que displayOrder seja um número inteiro >= 0
        const displayOrder = Math.max(0, Math.floor(section.displayOrder || 0))

        await imageSectionsApi.create(
          propertyId,
          section.sectionName,
          displayOrder,
          section.images
        )
      } catch (error) {
        console.error(`Erro ao criar seção ${section.sectionName}:`, error)
        toast.error(`Erro ao criar seção ${section.sectionName}`)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar se há erros de área
    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      const images = selectedImage ? [selectedImage] : []
      const imagesToRemove = imageToRemove ? [imageToRemove] : []

      const result = await onSubmit(formData, images, imagesToRemove)

      // Se retornar uma propriedade e houver novas seções, criar as seções
      if (result && result.id && newSections.length > 0) {
        await saveNewSections(result.id)
        setNewSections([]) // Limpar seções criadas

        // Chamar callback de sucesso para invalidar cache
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      console.error("Erro ao salvar propriedade:", error)
    }
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
              <div className="space-y-2">
                <Label>Referência</Label>
                <Input
                  placeholder="Ex: REF123456"
                  value={formData.reference || ""}
                  onChange={(e) => updateField("reference", e.target.value)}
                />
              </div>
            </div>
          )}

          {!isEditMode && (
            <div className="space-y-2">
              <Label>Referência</Label>
              <Input
                placeholder="Ex: REF123456"
                value={formData.reference || ""}
                onChange={(e) => updateField("reference", e.target.value)}
              />
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
                  {TIPOS_IMOVEL.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
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
              <Select
                value={formData.distrito || undefined}
                onValueChange={(value) => updateField("distrito", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o distrito" />
                </SelectTrigger>
                <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                  {DISTRITOS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Concelho *</Label>
              <Select
                value={formData.concelho || undefined}
                onValueChange={(value) => updateField("concelho", value)}
                disabled={!formData.distrito}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !formData.distrito
                        ? "Selecione primeiro um distrito"
                        : "Selecione o concelho"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                  {municipios.length > 0 ? (
                    municipios.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))
                  ) : null}
                </SelectContent>
              </Select>
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

      {/* Imagem Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Imagem Principal *</CardTitle>
          <CardDescription>
            {isEditMode ? "Gerencie a foto de capa da propriedade" : "Adicione a foto de capa da propriedade"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditMode && formData.image && (
              <div>
                <h3 className="text-body-small font-medium mb-2">Imagem Atual</h3>
                <div className="relative group w-fit">
                  <img
                    src={formData.image}
                    alt="Imagem principal"
                    className="w-64 h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="brown"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeExistingImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {(!isEditMode || !formData.image) && !selectedImage && (
              <div>
                <h3 className="text-body-small font-medium mb-2">
                  {isEditMode ? "Adicionar Nova Imagem" : "Imagem"}
                </h3>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleImageChange(e.target.files[0])
                    }
                  }}
                />
              </div>
            )}

            {selectedImage && (
              <div>
                <h3 className="text-body-small font-medium mb-2">Nova Imagem</h3>
                <div className="relative group w-fit">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Nova imagem principal"
                    className="w-64 h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="brown"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeNewImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Galeria Organizada por Seções */}
      <Card>
        <CardHeader>
          <CardTitle>Galeria Organizada por Seções</CardTitle>
          <CardDescription>
            Organize as imagens por ambientes (ex: Cozinha, Sala, Quartos, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingSections ? (
            <p className="text-muted-foreground">Carregando seções...</p>
          ) : (
            <>
              {/* Seções Existentes (apenas no modo edição) */}
              {isEditMode && imageSections.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-body-small font-medium">Seções Existentes</h3>
                  {imageSections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{section.sectionName}</h4>
                        <Button
                          type="button"
                          variant="brown"
                          size="default"
                          onClick={() => deleteExistingSection(section.id)}
                          disabled={loadingDeleteSection === section.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {loadingDeleteSection === section.id ? "Deletando..." : "Deletar Seção"}
                        </Button>
                      </div>

                      {section.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {section.images.map((url, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={url}
                                alt={`${section.sectionName} ${imgIndex + 1}`}
                                className="w-full h-32 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="brown"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImageFromExistingSection(section.id, url)}
                                disabled={loadingRemoveImage === `${section.id}-${url}`}
                              >
                                {loadingRemoveImage === `${section.id}-${url}` ? (
                                  <span className="animate-spin">⏳</span>
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <Label htmlFor={`section-${section.id}-images`} className="text-sm">
                          {loadingAddImage === section.id ? "Adicionando imagens..." : "Adicionar Imagens"}
                        </Label>
                        <Input
                          id={`section-${section.id}-images`}
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={loadingAddImage === section.id}
                          onChange={(e) => {
                            if (e.target.files) {
                              const files = Array.from(e.target.files)
                              addImageToExistingSection(section.id, files)
                              e.target.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Novas Seções */}
              {newSections.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-body-small font-medium">Novas Seções</h3>
                  {newSections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`new-section-${index}-name`}>Nome da Seção *</Label>
                          <Select
                            value={section.sectionName}
                            onValueChange={(value) => updateNewSection(index, 'sectionName', value)}
                          >
                            <SelectTrigger id={`new-section-${index}-name`}>
                              <SelectValue placeholder="Selecione ou digite" />
                            </SelectTrigger>
                            <SelectContent>
                              {suggestedSections.map((name) => (
                                <SelectItem key={name} value={name}>
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="button"
                          variant="brown"
                          size="icon"
                          onClick={() => removeNewSection(index)}
                          className="mt-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {section.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {section.images.map((file, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`${section.sectionName} ${imgIndex + 1}`}
                                className="w-full h-32 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="brown"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImageFromNewSection(index, imgIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <Label htmlFor={`new-section-${index}-images`} className="text-sm">
                          Adicionar Imagens
                        </Label>
                        <Input
                          id={`new-section-${index}-images`}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              const files = Array.from(e.target.files)
                              addImagesToNewSection(index, files)
                              e.target.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Botão para adicionar nova seção */}
              <Button
                type="button"
                variant="outline"
                onClick={addNewSection}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Seção
              </Button>
            </>
          )}
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
