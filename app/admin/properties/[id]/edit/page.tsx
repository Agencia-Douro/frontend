"use client"

import { useRouter, useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { propertiesApi } from "@/services/api"
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
import { Property } from "@/types/property"

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const propertyId = params.id as string
  const segments = getBreadcrumbSegments(pathname ?? "")

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertiesApi.getById(propertyId),
  })

  const updateMutation = useMutation({
    mutationFn: ({ data, images }: { data: Property; images: File[]; imagesToRemove: string[] }) =>
      propertiesApi.update(propertyId, data, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
      toast.success("Propriedade atualizada com sucesso!")
      router.push(`/admin/properties/${propertyId}`)
    },
    onError: (err: Error & { response?: { data?: { message?: string; errors?: string[] } } }) => {
      const errorMessage = err?.message ?? "Erro ao atualizar propriedade"
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message)
      } else if (Array.isArray(err?.response?.data?.errors)) {
        err.response.data.errors.forEach((msg: string) => toast.error(msg))
      } else {
        toast.error(errorMessage)
      }
    },
  })

  const handleSubmit = async (data: Property, images: File[], imagesToRemove?: string[]): Promise<Property> => {
    const hasExistingImage = data.image && String(data.image).length > 0
    const hasNewImage = images.length > 0
    if (!hasExistingImage && !hasNewImage) {
      toast.error("A propriedade precisa de uma imagem principal")
      throw new Error("Imagem principal obrigatória")
    }
    return new Promise<Property>((resolve, reject) => {
      updateMutation.mutate(
        { data, images, imagesToRemove: imagesToRemove ?? [] },
        { onSuccess: resolve, onError: reject }
      )
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-6 md:px-6">
        <h1 className="mb-2 text-lg font-semibold text-foreground tracking-tight">Editar propriedade</h1>
        <p className="py-12 text-center text-sm text-muted-foreground">A carregar...</p>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-6 md:px-6">
        <h1 className="mb-2 text-lg font-semibold text-foreground tracking-tight">Editar propriedade</h1>
        <p className="py-12 text-center text-sm text-destructive">Propriedade não encontrada</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/properties">Voltar à lista</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 md:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
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
            href={`/admin/properties/${propertyId}`}
            className="flex items-center gap-2 text-foreground hover:text-muted-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Voltar para o imóvel
          </Link>
        </Button>
      </div>

      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitButtonText="Atualizar propriedade"
        cancelButtonText="Cancelar"
        onCancel={() => router.push(`/admin/properties/${propertyId}`)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
        }}
      />
    </div>
  )
}
