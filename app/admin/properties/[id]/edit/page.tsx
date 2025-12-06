"use client"

import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { propertiesApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import PropertyForm from "@/components/PropertyForm"
import { Property } from "@/types/property"

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const propertyId = params.id as string

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertiesApi.getById(propertyId),
  })

  const updateMutation = useMutation({
    mutationFn: ({ data, images }: { data: any; images: File[]; imagesToRemove: string[] }) =>
      propertiesApi.update(propertyId, data, images),
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

  const handleSubmit = async (data: any, images: File[], imagesToRemove?: string[]): Promise<Property> => {
    // Validar se tem exatamente uma imagem (existente ou nova)
    const hasExistingImage = data.image && data.image.length > 0
    const hasNewImage = images.length > 0

    if (!hasExistingImage && !hasNewImage) {
      toast.error("A propriedade precisa ter uma imagem principal")
      throw new Error("Imagem principal obrigatória")
    }

    return new Promise<Property>((resolve, reject) => {
      updateMutation.mutate(
        {
          data,
          images,
          imagesToRemove: imagesToRemove || []
        },
        {
          onSuccess: (property) => {
            resolve(property)
          },
          onError: (error) => {
            reject(error)
          },
        }
      )
    })
  }

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

      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitButtonText="Atualizar Propriedade"
        cancelButtonText="Cancelar"
        onCancel={() => router.push(`/admin/properties/${propertyId}`)}
        onSuccess={() => {
          // Invalidar cache da propriedade para recarregar com as novas seções
          queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
        }}
      />
    </div>
  )
}
