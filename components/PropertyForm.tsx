"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-admin/tabs"
import { Label } from "@/components/ui-admin/label"
import { Input } from "@/components/ui-admin/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import { Checkbox } from "@/components/ui-admin/checkbox"
import { Button } from "@/components/ui-admin/button"
import { X, Plus, Trash2, Save } from "lucide-react"
import { Property, PropertyImageSection } from "@/types/property"
import { imageSectionsApi, teamMembersApi, TeamMember } from "@/services/api"
import { toast } from "sonner"
import { DISTRITOS, DISTRITO_MUNICIPIOS, MUNICIPIO_FREGUESIAS, TIPOS_IMOVEL } from "@/app/shared/distritos"
import { COUNTRIES } from "@/app/shared/countries"
import CurrencyInput from "react-currency-input-field"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { FileManagement } from "@/components/FileManagement"
import { PropertyRelationships } from "@/components/PropertyRelationships"
import { PropertyFractionsTab } from "@/components/PropertyFractionsTab"
import { usePropertyDraft } from "@/hooks/usePropertyDraft"
import { CreatePropertyFractionDto } from "@/types/property"

interface PropertyFormProps {
  initialData?: Property | null
  draftId?: string | null
  onSubmit: (
    data: any,
    images: File[],
    imagesToRemove?: string[],
    pendingFiles?: File[],
    pendingRelated?: string[],
    pendingFractions?: CreatePropertyFractionDto[]
  ) => Promise<Property> | void
  isLoading?: boolean
  submitButtonText?: string
  cancelButtonText?: string
  onCancel?: () => void
  onSuccess?: () => void
}

// Helper functions to check if file/URL is video
const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/')
}

const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

export default function PropertyForm({
  initialData,
  draftId,
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
      features: "",
      whyChoose: "",
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
      floor: "",
      country: "PT",
      distrito: "",
      concelho: "",
      freguesia: "",
      region: "",
      city: "",
      address: "",
      paymentConditions: "",
      status: "active",
      image: "",
      teamMemberId: null as string | null,
    }
  )

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageToRemove, setImageToRemove] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("info")

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

  // Estados para arquivos, relacionamentos e frações no modo de criação
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingRelated, setPendingRelated] = useState<string[]>([])
  const [pendingFractions, setPendingFractions] = useState<CreatePropertyFractionDto[]>([])

  // Estados para team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false)

  // Hook de rascunho (apenas no modo de criação)
  const {
    currentDraftId,
    loadDraft,
    loadDraftFiles,
    saveDraft,
    deleteDraft: clearDraft,
  } = usePropertyDraft(draftId)

  const [draftLoaded, setDraftLoaded] = useState(false)

  // Carregar rascunho se tiver draftId
  useEffect(() => {
    if (draftId && !isEditMode && !draftLoaded) {
      const draft = loadDraft(draftId)
      if (draft && draft.formData) {
        console.log("Restaurando rascunho:", draft.formData) // Debug

        // Restaura todos os dados do formulário de uma vez
        setFormData(prev => ({
          ...prev,
          ...draft.formData
        }))
        setPendingRelated(draft.pendingRelated || [])

        // Carrega arquivos do IndexedDB
        loadDraftFiles(draftId).then((draftFiles) => {
          // Restaura imagem principal
          if (draftFiles.mainImage) {
            setSelectedImage(draftFiles.mainImage)
          }

          // Restaura seções com suas imagens
          const restoredSections = draft.newSections?.map((s: any, idx: number) => ({
            sectionName: s.sectionName,
            displayOrder: s.displayOrder,
            images: draftFiles.sectionImages.get(idx) || []
          })) || []

          setNewSections(restoredSections)
        })
      }
      setDraftLoaded(true)
    }
  }, [draftId, isEditMode, draftLoaded, loadDraft, loadDraftFiles])

  // Auto-save do rascunho quando formData muda (apenas no modo de criação)
  useEffect(() => {
    if (!isEditMode && formData.title) {
      // Só salva se tiver pelo menos um título
      saveDraft(formData, newSections, pendingRelated, currentDraftId, selectedImage)
    }
  }, [formData, newSections, pendingRelated, isEditMode, saveDraft, currentDraftId, selectedImage])

  // Salvar rascunho imediatamente ao sair da página (beforeunload)
  useEffect(() => {
    if (isEditMode) return

    const handleBeforeUnload = () => {
      if (formData.title) {
        // Salva imediatamente no localStorage (síncrono)
        try {
          const saved = localStorage.getItem("property-drafts")
          const drafts = saved ? JSON.parse(saved) : []
          const id = currentDraftId || Date.now().toString(36) + Math.random().toString(36).slice(2)

          const draft = {
            id,
            formData,
            newSections: newSections.map((s) => ({
              sectionName: s.sectionName,
              displayOrder: s.displayOrder,
              imageCount: s.images?.length || 0,
            })),
            pendingRelated,
            savedAt: new Date().toISOString(),
            title: formData.title || "Sem título",
            propertyType: formData.propertyType || "",
            distrito: formData.distrito || "",
            concelho: formData.concelho || "",
            price: formData.price || "0",
            hasMainImage: !!selectedImage,
            sectionImageCounts: {},
          }

          const existingIndex = drafts.findIndex((d: any) => d.id === id)
          if (existingIndex >= 0) {
            drafts[existingIndex] = draft
          } else {
            drafts.push(draft)
          }

          localStorage.setItem("property-drafts", JSON.stringify(drafts))
        } catch (e) {
          console.error("Erro ao salvar rascunho antes de sair:", e)
        }
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isEditMode, formData, newSections, pendingRelated, currentDraftId, selectedImage])

  // Get municipios based on selected distrito
  const municipios = formData.distrito ? DISTRITO_MUNICIPIOS[formData.distrito] || [] : []

  // Get freguesias based on selected concelho
  const freguesias = formData.concelho ? MUNICIPIO_FREGUESIAS[formData.concelho] || [] : []
  console.log("Freguesias disponíveis para", formData.concelho, ":", freguesias) // Debug

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)

      // Carregar seções de imagens se estiver no modo de edição
      if (initialData.id) {
        loadImageSections(initialData.id)
      }
    }
  }, [initialData])

  // Buscar team members ao montar o componente
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setIsLoadingTeamMembers(true)
        const members = await teamMembersApi.getAll()
        setTeamMembers(members)
      } catch (error) {
        console.error("Erro ao carregar membros da equipa:", error)
        toast.error("Erro ao carregar membros da equipa")
      } finally {
        setIsLoadingTeamMembers(false)
      }
    }

    loadTeamMembers()
  }, [])

  // Reset concelho when distrito changes
  useEffect(() => {
    if (formData.distrito && formData.concelho) {
      const validMunicipios = DISTRITO_MUNICIPIOS[formData.distrito] || []
      if (!validMunicipios.includes(formData.concelho)) {
        updateField("concelho", "")
      }
    }
  }, [formData.distrito, formData.concelho])

  // Reset freguesia when concelho changes
  useEffect(() => {
    if (formData.concelho && formData.freguesia) {
      const validFreguesias = MUNICIPIO_FREGUESIAS[formData.concelho] || []
      if (!validFreguesias.includes(formData.freguesia)) {
        updateField("freguesia", "")
      }
    }
  }, [formData.concelho, formData.freguesia])

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

  const validateAreas = (field: string, value: number | null) => {
    const newErrors = { ...errors }
    const areas = { ...formData, [field]: value }

    // Área bruta privativa não pode ser maior que área total
    if (areas.builtArea && areas.totalArea && areas.builtArea > areas.totalArea) {
      newErrors.builtArea = "Área bruta privativa não pode ser maior que área total"
    } else {
      delete newErrors.builtArea
    }

    // Área útil não pode ser maior que área bruta privativa ou total
    if (areas.usefulArea) {
      if (areas.builtArea && areas.usefulArea > areas.builtArea) {
        newErrors.usefulArea = "Área útil não pode ser maior que área bruta privativa"
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
    'Salas',
    'Sala de Estar',
    'Sala de Jantar',
    'Quartos',
    'Quarto Principal',
    'Casas de Banho',
    'Escritório',
    'Lavandaria',
    'Garagem',
    'Exterior',
    'Jardim',
    'Piscina',
    'Varanda',
    'Terraço',
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

      const result = await onSubmit(
        formData,
        images,
        imagesToRemove,
        isEditMode ? undefined : pendingFiles,
        isEditMode ? undefined : pendingRelated,
        isEditMode ? undefined : pendingFractions
      )

      // Se retornar uma propriedade e houver novas seções, criar as seções
      if (result && result.id && newSections.length > 0) {
        await saveNewSections(result.id)
        setNewSections([]) // Limpar seções criadas

        // Chamar callback de sucesso para invalidar cache
        if (onSuccess) {
          onSuccess()
        }
      }

      // Limpar rascunho após sucesso (apenas no modo de criação)
      if (!isEditMode) {
        clearDraft()
      }
    } catch (error) {
      console.error("Erro ao salvar propriedade:", error)
    }
  }

  const goToNextTab = () => {
    const tabs = ["info", "features", "location", "team", "images", "files", "fractions", "relationships"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8 pb-20">
      {/* Indicador de Rascunho (apenas no modo de criação) */}
      {!isEditMode && currentDraftId && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Save className="size-4 shrink-0" aria-hidden />
            <span>Rascunho guardado automaticamente</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Tem a certeza que deseja limpar o rascunho? Esta ação não pode ser desfeita.")) {
                clearDraft(currentDraftId)
                setFormData({
                  reference: "",
                  title: "",
                  description: "",
                  features: "",
                  whyChoose: "",
                  transactionType: "comprar",
                  propertyType: "",
                  isEmpreendimento: false,
                  propertyState: "",
                  energyClass: "",
                  price: "0",
                  totalArea: null,
                  builtArea: null,
                  usefulArea: null,
                  bedrooms: 0,
                  bathrooms: 0,
                  hasOffice: false,
                  hasLaundry: false,
                  garageSpaces: 0,
                  constructionYear: null,
                  deliveryDate: "",
                  floor: "",
                  country: "PT",
                  distrito: "",
                  concelho: "",
                  freguesia: "",
                  region: "",
                  city: "",
                  address: "",
                  paymentConditions: "",
                  status: "active",
                  image: "",
                  teamMemberId: null,
                })
                setNewSections([])
                setPendingRelated([])
                setSelectedImage(null)
                toast.success("Rascunho limpo!")
              }
            }}
          >
            <Trash2 className="size-4" aria-hidden />
            Limpar rascunho
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList variant="line" className="mb-6 w-full flex-wrap justify-start">
          <TabsTrigger variant="line" value="info">
            Informações Básicas
          </TabsTrigger>
          <TabsTrigger variant="line" value="features">
            Características
          </TabsTrigger>
          <TabsTrigger variant="line" value="location">
            Localização
          </TabsTrigger>
          <TabsTrigger variant="line" value="team">
            Corretor
          </TabsTrigger>
          <TabsTrigger variant="line" value="images">
            Mídia
          </TabsTrigger>
          <TabsTrigger variant="line" value="files">
            Arquivos
          </TabsTrigger>
          <TabsTrigger variant="line" value="fractions">
            Frações
          </TabsTrigger>
          <TabsTrigger variant="line" value="relationships">
            Relacionamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6 mt-0">
          {/* Informações Básicas */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Informações Básicas</CardTitle>
              <CardDescription>
                Dados principais da propriedade
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-4 space-y-4 bg-transparent">
              {isEditMode && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status <span className="text-red">*</span></Label>
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
                        <SelectItem value="reserved">Reservado</SelectItem>
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

              <div className="space-y-2">
                <Label>Título <span className="text-red">*</span></Label>
                <Input
                  placeholder="Ex: Apartamento T3 no Centro do Porto"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

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
                <Label>Descrição <span className="text-red">*</span></Label>
                <RichTextEditor
                  placeholder="Descrição detalhada da propriedade..."
                  value={formData.description}
                  onChange={(value) => updateField("description", value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Características</Label>
                <RichTextEditor
                  placeholder="Características especiais da propriedade (piscina, jardim, vista, etc)..."
                  value={formData.features || ""}
                  onChange={(value) => updateField("features", value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Porque escolher esse imóvel?</Label>
                <RichTextEditor
                  placeholder="Destaque os motivos para escolher este imóvel..."
                  value={formData.whyChoose || ""}
                  onChange={(value) => updateField("whyChoose", value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Tipo de Transação <span className="text-red">*</span></Label>
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
                      <SelectItem value="trespasse">Trespasse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Imóvel <span className="text-red">*</span></Label>
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
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isEmpreendimento"
                    checked={formData.isEmpreendimento}
                    onCheckedChange={(checked) => updateField("isEmpreendimento", checked)}
                  />
                  <Label htmlFor="isEmpreendimento" className="font-normal cursor-pointer">
                    É um empreendimento
                  </Label>
                </div>

                <div className="space-y-3">
                  <Label>Classe Energética</Label>
                  <div className="flex flex-wrap gap-2">
                    {['A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F'].map((classe) => (
                      <Button
                        key={classe}
                        type="button"
                        variant={formData.energyClass === classe ? "default" : "outline"}
                        size="default"
                        className={formData.energyClass === classe ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : undefined}
                        onClick={() => updateField("energyClass", classe)}
                      >
                        {classe}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preço e Condições */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Preço e Condições</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-4 space-y-4 bg-transparent">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Preço (€) <span className="text-red">*</span></Label>
                  <CurrencyInput
                    id="price-input"
                    name="price"
                    placeholder="250.000 €"
                    value={formData.price}
                    decimalsLimit={0}
                    groupSeparator="."
                    decimalSeparator=","
                    suffix=" €"
                    onValueChange={(value) => {
                      updateField("price", value || "0")
                    }}
                    className={cn(
                      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Condições de Pagamento</Label>
                  <RichTextEditor
                    placeholder="Ex: Aceita financiamento, entrada de 30%, etc..."
                    value={formData.paymentConditions || ""}
                    onChange={(value) => updateField("paymentConditions", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-0">
          {/* Áreas */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Áreas</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-4 bg-transparent">
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
                  <Label>Área Bruta Privativa (m²)</Label>
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
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Características</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-4 bg-transparent">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Quartos <span className="text-red">*</span></Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="3"
                    value={formData.bedrooms || ""}
                    onChange={(e) => updateField("bedrooms", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Casas de Banho <span className="text-red">*</span></Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="2"
                    value={formData.bathrooms || ""}
                    onChange={(e) => updateField("bathrooms", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lugares de Garagem <span className="text-red">*</span></Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="1"
                    value={formData.garageSpaces || ""}
                    onChange={(e) => updateField("garageSpaces", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="hasOffice"
                    checked={formData.hasOffice}
                    onCheckedChange={(checked) => updateField("hasOffice", checked)}
                  />
                  <Label htmlFor="hasOffice" className="font-normal cursor-pointer">
                    Tem escritório
                  </Label>
                </div>

                <div className="flex items-center gap-3">
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
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Informações de Construção</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-4 bg-transparent">
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

                <div className="space-y-2">
                  <Label>Piso</Label>
                  <Input
                    placeholder="Ex: 2º andar, R/C, -1"
                    value={formData.floor ?? ""}
                    onChange={(e) => updateField("floor", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6 mt-0">
          {/* Localização */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="p-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Localização</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4 bg-transparent">
              {/* Seleção de País */}
              <div className="space-y-2">
                <Label>País <span className="text-red">*</span></Label>
                <Select
                  value={formData.country || "PT"}
                  onValueChange={(value) => {
                    // Atualizar país e limpar campos de localização em uma única operação
                    setFormData(prev => ({
                      ...prev,
                      country: value,
                      distrito: "",
                      concelho: "",
                      freguesia: "",
                      region: "",
                      city: "",
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campos específicos para Portugal */}
              {formData.country === "PT" ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Distrito <span className="text-red">*</span></Label>
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
                      <Label>Concelho <span className="text-red">*</span></Label>
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
                    <Label>Freguesia</Label>
                    <Select
                      value={formData.freguesia || undefined}
                      onValueChange={(value) => updateField("freguesia", value)}
                      disabled={!formData.concelho}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !formData.concelho
                              ? "Selecione primeiro um concelho"
                              : "Selecione a freguesia"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="[&>div]:flex [&>div]:flex-col gap-1">
                        {freguesias.length > 0 ? (
                          freguesias.map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                /* Campos genéricos para outros países */
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Região <span className="text-red">*</span></Label>
                    <Input
                      placeholder="Ex: Comunidade de Madrid, Île-de-France..."
                      value={formData.region || ""}
                      onChange={(e) => updateField("region", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cidade <span className="text-red">*</span></Label>
                    <Input
                      placeholder="Ex: Madrid, Paris, Barcelona..."
                      value={formData.city || ""}
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                  </div>
                </div>
              )}

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
        </TabsContent>

        <TabsContent value="team" className="space-y-6 mt-0">
          {/* Corretor Responsável */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="p-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Corretor Responsável</CardTitle>
              <CardDescription>
                Selecione o membro da equipa responsável por esta propriedade
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 bg-transparent">
              <div className="space-y-2">
                <Label>Corretor</Label>
                {isLoadingTeamMembers ? (
                  <p className="text-muted-foreground text-sm">A carregar membros da equipa...</p>
                ) : (
                  <Select
                    value={formData.teamMemberId || undefined}
                    onValueChange={(value) => updateField("teamMemberId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um corretor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6 mt-0">
          {/* Imagem/Vídeo Principal */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Mídia Principal *</CardTitle>
              <CardDescription>
                {isEditMode ? "Gerencie a imagem ou vídeo de capa da propriedade" : "Adicione a imagem ou vídeo de capa da propriedade"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-4 bg-transparent">
              <div className="space-y-6">
                {isEditMode && formData.image && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Mídia Atual</p>
                    <div className="relative inline-block overflow-hidden rounded-lg border border-border bg-muted/30">
                      {isVideoUrl(formData.image) ? (
                        <video
                          src={formData.image}
                          controls
                          className="size-64 object-cover md:w-72 md:h-52"
                        />
                      ) : (
                        <img
                          src={formData.image}
                          alt="Imagem principal"
                          className="size-64 object-cover md:w-72 md:h-52"
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 size-8 opacity-90 hover:opacity-100 transition-opacity"
                        onClick={removeExistingImage}
                        aria-label="Remover mídia atual"
                      >
                        <X className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                )}

                {(!isEditMode || !formData.image) && !selectedImage && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {isEditMode ? "Adicionar Nova Mídia" : "Imagem ou Vídeo"}
                    </p>
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6">
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleImageChange(e.target.files[0])
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {selectedImage && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Nova Mídia</p>
                    <div className="relative inline-block overflow-hidden rounded-lg border border-border bg-muted/30">
                      {isVideoFile(selectedImage) ? (
                        <video
                          src={URL.createObjectURL(selectedImage)}
                          controls
                          className="size-64 object-cover md:w-72 md:h-52"
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Nova imagem principal"
                          className="size-64 object-cover md:w-72 md:h-52"
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 size-8 opacity-90 hover:opacity-100 transition-opacity"
                        onClick={removeNewImage}
                        aria-label="Remover nova mídia"
                      >
                        <X className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Galeria Organizada por Seções */}
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Galeria Organizada por Seções</CardTitle>
              <CardDescription>
                Organize imagens e vídeos por ambientes (ex: Cozinha, Sala, Quartos, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0 space-y-6 bg-transparent">
              {isLoadingSections ? (
                <p className="text-sm text-muted-foreground">A carregar seções...</p>
              ) : (
                <>
                  {/* Seções Existentes (apenas no modo edição) */}
                  {isEditMode && imageSections.length > 0 && (
                    <div className="space-y-6">
                      <p className="text-sm font-medium text-foreground">Seções Existentes</p>
                      <div className="space-y-4">
                        {imageSections.map((section) => (
                          <div
                            key={section.id}
                            className="rounded-lg border border-border bg-muted/10 p-4 space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <h4 className="text-sm font-semibold text-foreground">{section.sectionName}</h4>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteExistingSection(section.id)}
                                disabled={loadingDeleteSection === section.id}
                                aria-label={`Eliminar secção ${section.sectionName}`}
                              >
                                <Trash2 className="size-4 shrink-0" aria-hidden />
                                {loadingDeleteSection === section.id ? "A eliminar…" : "Eliminar secção"}
                              </Button>
                            </div>

                            {section.images.length > 0 && (
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {section.images.map((url, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted/30"
                                  >
                                    {isVideoUrl(url) ? (
                                      <video
                                        src={url}
                                        controls
                                        className="size-full object-cover"
                                      />
                                    ) : (
                                      <img
                                        src={url}
                                        alt={`${section.sectionName} ${imgIndex + 1}`}
                                        className="size-full object-cover"
                                      />
                                    )}
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute right-1.5 top-1.5 size-7 opacity-90 hover:opacity-100 transition-opacity"
                                      onClick={() => removeImageFromExistingSection(section.id, url)}
                                      disabled={loadingRemoveImage === `${section.id}-${url}`}
                                      aria-label="Remover imagem"
                                    >
                                      {loadingRemoveImage === `${section.id}-${url}` ? (
                                        <span className="animate-spin text-[10px]" aria-hidden>⟳</span>
                                      ) : (
                                        <X className="size-3.5" aria-hidden />
                                      )}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <Label htmlFor={`section-${section.id}-images`} className="text-sm">
                                {loadingAddImage === section.id ? "A adicionar…" : "Adicionar imagens ou vídeos"}
                              </Label>
                              <Input
                                id={`section-${section.id}-images`}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                disabled={loadingAddImage === section.id}
                                onChange={(e) => {
                                  if (e.target.files) {
                                    const files = Array.from(e.target.files)
                                    addImageToExistingSection(section.id, files)
                                    e.target.value = ""
                                  }
                                }}
                                className="cursor-pointer"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Novas Seções */}
                  {newSections.length > 0 && (
                    <div className="space-y-6">
                      <p className="text-sm font-medium text-foreground">Novas Seções</p>
                      <div className="space-y-4">
                        {newSections.map((section, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-border bg-muted/10 p-4 space-y-4"
                          >
                            <div className="flex flex-wrap items-end gap-3">
                              <div className="min-w-0 flex-1 space-y-1.5">
                                <Label htmlFor={`new-section-${index}-name`}>
                                  Nome da seção <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                  value={section.sectionName}
                                  onValueChange={(value) => updateNewSection(index, "sectionName", value)}
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
                                variant="destructive"
                                size="icon"
                                onClick={() => removeNewSection(index)}
                                aria-label="Remover secção"
                              >
                                <Trash2 className="size-4" aria-hidden />
                              </Button>
                            </div>

                            {section.images.length > 0 && (
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {section.images.map((file, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted/30"
                                  >
                                    {isVideoFile(file) ? (
                                      <video
                                        src={URL.createObjectURL(file)}
                                        controls
                                        className="size-full object-cover"
                                      />
                                    ) : (
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={`${section.sectionName} ${imgIndex + 1}`}
                                        className="size-full object-cover"
                                      />
                                    )}
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute right-1.5 top-1.5 size-7 opacity-90 hover:opacity-100 transition-opacity"
                                      onClick={() => removeImageFromNewSection(index, imgIndex)}
                                      aria-label="Remover imagem"
                                    >
                                      <X className="size-3.5" aria-hidden />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <Label htmlFor={`new-section-${index}-images`} className="text-sm">
                                Adicionar imagens ou vídeos
                              </Label>
                              <Input
                                id={`new-section-${index}-images`}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files) {
                                    const files = Array.from(e.target.files)
                                    addImagesToNewSection(index, files)
                                    e.target.value = ""
                                  }
                                }}
                                className="cursor-pointer"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addNewSection}
                    className="w-full"
                  >
                    <Plus className="size-4 shrink-0" aria-hidden />
                    Adicionar secção
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6 mt-0">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="p-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Gestão de Arquivos</CardTitle>
              <CardDescription>
                Faça upload e gerencie documentos, PDFs, plantas, certificados e outros arquivos da propriedade
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 bg-transparent">
              <FileManagement
                propertyId={initialData?.id}
                isEditMode={isEditMode}
                onPendingFilesChange={setPendingFiles}
                pendingFiles={pendingFiles}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fractions" className="space-y-6 mt-0">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Frações do Imóvel</CardTitle>
              <CardDescription>
                Gerencie as unidades/frações disponíveis neste empreendimento (apartamentos, lojas, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-4 bg-transparent">
              <PropertyFractionsTab
                propertyId={initialData?.id}
                isEditMode={isEditMode}
                onPendingFractionsChange={setPendingFractions}
                pendingFractions={pendingFractions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-6 mt-0">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-4 pb-2 bg-transparent">
              <CardTitle className="text-base font-semibold">Propriedades Relacionadas</CardTitle>
              <CardDescription>
                Gerencie propriedades relacionadas para exibir como sugestões similares na página de detalhes
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0 pb-4 bg-transparent">
              <PropertyRelationships
                propertyId={initialData?.id}
                isEditMode={isEditMode}
                onPendingRelatedChange={setPendingRelated}
                pendingRelated={pendingRelated}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-background/95 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-end gap-2">
        {isEditMode ? (
          // Modo de edição - sempre mostrar botão de submit
          <>
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
          </>
        ) : (
          // Modo de criação - mostrar botão de submit apenas nas últimas abas
          activeTab === "relationships" ? (
            <>
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
            </>
          ) : (
            <Button
              type="button"
              onClick={goToNextTab}
            >
              Próxima
            </Button>
          )
        )}
        </div>
      </div>
    </form>
  )
}
