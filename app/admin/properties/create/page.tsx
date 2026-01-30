"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { propertiesApi, propertyFilesApi, propertyFractionsApi, propertyRelationshipsApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import PropertyForm from "@/components/PropertyForm"
import { CreatePropertyFractionDto, Property } from "@/types/property"
import { Suspense } from "react"

function CreatePropertyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // Pega o ID do rascunho da URL se existir
  const draftId = searchParams.get("draft")

  const createMutation = useMutation({
    mutationFn: ({ data, images }: { data: any; images: File[] }) =>
      propertiesApi.create(data, images),
    onSuccess: async (data) => {
      // Invalidar cache de todas as propriedades
      await queryClient.invalidateQueries({ queryKey: ["properties"] })
      // Invalidar cache específico da propriedade criada
      await queryClient.invalidateQueries({ queryKey: ["property", data.id] })

      toast.success("Propriedade criada com sucesso!")
      router.push(`/admin/properties/${data.id}`)
    },
    onError: (error: any) => {
      console.error("Error creating property:", error)

      // Extrair mensagem de erro do backend
      const errorMessage = error?.message || "Erro ao criar propriedade"

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

  const handleSubmit = async (
    data: any,
    images: File[],
    imagesToRemove?: string[],
    pendingFiles?: File[],
    pendingRelated?: string[],
    pendingFractions?: CreatePropertyFractionDto[]
  ): Promise<Property> => {
    // Validar se tem exatamente uma imagem
    if (images.length === 0) {
      toast.error("A propriedade precisa ter uma imagem principal")
      throw new Error("Imagem principal obrigatória")
    }

    return new Promise<Property>((resolve, reject) => {
      createMutation.mutate(
        {
          data,
          images,
        },
        {
          onSuccess: async (property) => {
            // Processar arquivos pendentes se houver
            if (pendingFiles && pendingFiles.length > 0) {
              try {
                await propertyFilesApi.uploadMultiple(property.id, pendingFiles, undefined, true)
                toast.success(`${pendingFiles.length} arquivo(s) enviado(s) com sucesso!`)
              } catch (error) {
                console.error("Erro ao enviar arquivos:", error)
                toast.error("Erro ao enviar alguns arquivos")
              }
            }

            // Processar relacionamentos pendentes se houver
            if (pendingRelated && pendingRelated.length > 0) {
              try {
                await propertyRelationshipsApi.setRelated(property.id, pendingRelated)
                toast.success(`${pendingRelated.length} propriedade(s) relacionada(s) com sucesso!`)
              } catch (error) {
                console.error("Erro ao definir propriedades relacionadas:", error)
                toast.error("Erro ao relacionar propriedades")
              }
            }

            // Processar frações pendentes se houver
            if (pendingFractions && pendingFractions.length > 0) {
              try {
                await propertyFractionsApi.bulkCreate(property.id, pendingFractions)
                toast.success(`${pendingFractions.length} fração(ões) criada(s) com sucesso!`)
              } catch (error) {
                console.error("Erro ao criar frações:", error)
                toast.error("Erro ao criar frações")
              }
            }

            // Invalidar cache novamente após upload de arquivos, relacionamentos e frações
            await queryClient.invalidateQueries({ queryKey: ["property", property.id] })

            resolve(property)
          },
          onError: (error) => {
            reject(error)
          },
        }
      )
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/admin/properties">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>

      <PropertyForm
        draftId={draftId}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitButtonText="Criar Propriedade"
        cancelButtonText="Cancelar"
        onCancel={() => router.push("/admin/properties")}
      />
    </div>
  )
}

export default function CreatePropertyPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6">Carregando...</div>}>
      <CreatePropertyContent />
    </Suspense>
  )
}
