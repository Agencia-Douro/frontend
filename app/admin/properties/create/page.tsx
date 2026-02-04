"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { propertiesApi, propertyFilesApi, propertyFractionsApi, propertyRelationshipsApi } from "@/services/api"
import { Button } from "@/components/ui-admin/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui-admin/breadcrumb"
import { getBreadcrumbSegments } from "@/lib/admin-nav"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import PropertyForm from "@/components/PropertyForm"
import { CreatePropertyFractionDto, Property } from "@/types/property"
import { Suspense } from "react"

function CreatePropertyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const draftId = searchParams.get("draft")
  const segments = getBreadcrumbSegments(pathname ?? "")

  const createMutation = useMutation({
    mutationFn: ({ data, images }: { data: Property; images: File[] }) =>
      propertiesApi.create(data, images),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] })
      await queryClient.invalidateQueries({ queryKey: ["property", data.id] })
      toast.success("Propriedade criada com sucesso!")
      router.push(`/admin/properties/${data.id}`)
    },
    onError: (err: Error & { response?: { data?: { message?: string; errors?: string[] } } }) => {
      const errorMessage = err?.message ?? "Erro ao criar propriedade"
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message)
      } else if (Array.isArray(err?.response?.data?.errors)) {
        err.response.data.errors.forEach((msg: string) => toast.error(msg))
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
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList>
            {segments.map((seg, i) => (
              <span key={seg.href} className="contents">
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {seg.isPage ? (
                    <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={seg.href}>{seg.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/admin/properties"
            className="flex items-center gap-2 text-foreground hover:text-muted-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Voltar para lista
          </Link>
        </Button>
      </div>

      <PropertyForm
        draftId={draftId}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitButtonText="Criar propriedade"
        cancelButtonText="Cancelar"
        onCancel={() => router.push("/admin/properties")}
      />
    </div>
  )
}

export default function CreatePropertyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-6 md:px-6">
          <h1 className="mb-2 text-lg font-semibold text-foreground tracking-tight">Nova propriedade</h1>
          <p className="py-12 text-center text-sm text-muted-foreground">A carregar...</p>
        </div>
      }
    >
      <CreatePropertyContent />
    </Suspense>
  )
}
