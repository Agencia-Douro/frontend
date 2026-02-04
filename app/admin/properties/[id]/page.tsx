"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { propertiesApi } from "@/services/api"
import { Button, buttonVariants } from "@/components/ui-admin/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui-admin/alert-dialog"
import ImagensImoveis from "@/components/Sections/ImagensImoveis"
import { Trash2, Pencil, Star, ChevronLeft, Images } from "lucide-react"
import { cn } from "@/lib/utils"

const isVideoUrl = (url: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".flv", ".wmv", ".m4v"]
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext))
}

const MediaItem = ({
  src,
  alt,
  className,
  onClick,
}: {
  src: string
  alt: string
  className?: string
  onClick?: () => void
}) => {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        controls
        className={className}
        preload="metadata"
        onClick={onClick}
      />
    )
  }
  return (
    <Image
      width={1000}
      height={1000}
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
    />
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  )
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const propertyId = params.id as string
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

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

  const handleDelete = () => deleteMutation.mutate(propertyId)
  const handleToggleFeatured = () => toggleFeaturedMutation.mutate(propertyId)

  if (isLoading) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-6 md:px-6">
        <h1 className="mb-2 text-lg font-semibold text-foreground tracking-tight">Imóvel</h1>
        <p className="py-12 text-center text-sm text-muted-foreground">A carregar...</p>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-6 md:px-6">
        <h1 className="mb-2 text-lg font-semibold text-foreground tracking-tight">Imóvel</h1>
        <p className="py-12 text-center text-sm text-destructive">Imóvel não encontrado</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/properties">Voltar à lista</Link>
        </Button>
      </div>
    )
  }

  const transactionTypeMap: Record<string, string> = {
    comprar: "Compra",
    arrendar: "Arrendamento",
    trespasse: "Trespasse",
  }

  const allImages = property.imageSections
    ?.filter((section) => section.images?.length)
    .flatMap((section) =>
      (section.images ?? []).map((url) => ({ url, name: section.sectionName }))
    ) ?? []

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
      {/* Barra de ações */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/admin/properties"
            className="flex items-center gap-2 text-foreground hover:text-muted-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Voltar para lista
          </Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={property.isFeatured ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleFeatured}
            disabled={toggleFeaturedMutation.isPending}
          >
            <Star
              className={cn("size-4", property.isFeatured && "fill-current")}
              aria-hidden
            />
            {toggleFeaturedMutation.isPending
              ? "A processar..."
              : property.isFeatured
                ? "Remover destaque"
                : "Destacar"}
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/properties/${propertyId}/edit`}>
              <Pencil className="size-4" aria-hidden />
              Editar
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash2 className="size-4" aria-hidden />
            Excluir
          </Button>
        </div>
      </div>

      {/* Caminho e Ver todas as imagens */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="capitalize text-foreground">{property.transactionType}</span>
          <span aria-hidden> / </span>
          <span className="capitalize text-foreground">{property.propertyType}</span>
          <span aria-hidden> / </span>
          <span>{property.distrito}</span>
        </p>
        {(property.image || allImages.length > 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openLightboxAt(0)}
            aria-label="Ver todas as imagens"
          >
            <Images className="size-4" aria-hidden />
            Ver todas as imagens
          </Button>
        )}
      </div>

      {/* Lightbox (controlado) */}
      <ImagensImoveis
        property={property}
        lightboxOpen={lightboxOpen}
        lightboxIndex={lightboxIndex}
        onLightboxClose={() => setLightboxOpen(false)}
      />

      {/* Grid de imagens (preview) – altura reduzida ~30% */}
      <div className="grid h-64 grid-cols-12 gap-2 sm:h-72">
        <button
          type="button"
          className="col-span-6 row-span-2 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => property.image && openLightboxAt(0)}
        >
          {property.image && (
            <MediaItem
              src={property.image}
              alt={property.title}
              className="size-full object-cover"
            />
          )}
        </button>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            className={cn(
              "col-span-3 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              i === 0 && "row-span-2"
            )}
            onClick={() => allImages[i] && openLightboxAt(i + (property.image ? 1 : 0))}
          >
            {allImages[i] && (
              <MediaItem
                src={allImages[i].url}
                alt={`${property.title} - ${allImages[i].name}`}
                className="size-full object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Localização e referência */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-medium text-foreground">
          {property.concelho}, {property.distrito}
        </span>
        <span className="h-3 w-px bg-border" aria-hidden />
        <span className="capitalize text-muted-foreground">{property.propertyType}</span>
        <span className="h-3 w-px bg-border" aria-hidden />
        <span className="tabular-nums text-muted-foreground">#{property.reference}</span>
        <span className="h-3 w-px bg-border" aria-hidden />
        <span className="text-muted-foreground">
          Tipo de negócio:{" "}
          <span className="capitalize text-foreground">
            {transactionTypeMap[property.transactionType]}
          </span>
        </span>
      </div>

      <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground tabular-nums text-balance">
        {parseFloat(property.price).toLocaleString("pt-PT")} €
      </h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Descrição */}
        <div className="lg:col-span-7">
          <div
            className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line wrap-break-word text-pretty text-foreground"
            dangerouslySetInnerHTML={{ __html: property.description }}
          />
          {property.deliveryDate && (
            <div className="mt-4 border-l-4 border-border bg-muted/30 px-4 py-2">
              <h6 className="mb-1 text-sm font-medium text-foreground">Previsão de entrega</h6>
              <p className="text-sm text-muted-foreground">{property.deliveryDate}</p>
            </div>
          )}
          {property.paymentConditions && (
            <div className="mt-4 border-l-4 border-border bg-muted/30 px-4 py-2">
              <h6 className="mb-1 text-sm font-medium text-foreground">Condições de pagamento</h6>
              <div
                className="prose prose-neutral dark:prose-invert text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: property.paymentConditions }}
              />
            </div>
          )}
        </div>

        {/* Características + mapa */}
        <div className="space-y-8 lg:col-span-5 lg:col-end-13">
          <Card>
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg">Características</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 p-0 pt-0">
              {property.totalArea != null && property.totalArea > 0 && (
                <DetailRow label="Área total" value={`${property.totalArea} m²`} />
              )}
              {property.builtArea != null && property.builtArea > 0 && (
                <DetailRow label="Área construída" value={`${property.builtArea} m²`} />
              )}
              {property.usefulArea != null && property.usefulArea > 0 && (
                <DetailRow label="Área útil" value={`${property.usefulArea} m²`} />
              )}
              {property.bathrooms > 0 && (
                <DetailRow label="Casas de banho" value={String(property.bathrooms)} />
              )}
              {property.bedrooms > 0 && (
                <DetailRow label="Quartos" value={String(property.bedrooms)} />
              )}
              {property.hasOffice && <DetailRow label="Escritório" value="Sim" />}
              {property.hasLaundry && <DetailRow label="Lavandaria" value="Sim" />}
              {property.garageSpaces > 0 && (
                <DetailRow
                  label="Garagem"
                  value={
                    property.garageSpaces === 1
                      ? "1 lugar"
                      : `${property.garageSpaces} lugares`
                  }
                />
              )}
              {property.constructionYear != null && property.constructionYear > 0 && (
                <DetailRow label="Ano de construção" value={String(property.constructionYear)} />
              )}
              {property.propertyState && (
                <DetailRow
                  label="Estado"
                  value={
                    property.propertyState.charAt(0).toUpperCase() +
                    property.propertyState.slice(1)
                  }
                />
              )}
              {property.energyClass && (
                <DetailRow label="Classe energética" value={property.energyClass.toUpperCase()} />
              )}
            </CardContent>
          </Card>

          <div className="overflow-hidden">
            <iframe
              title="Localização"
              className="h-72 w-full border-0"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                `${property.concelho}, ${property.distrito}, Portugal`
              )}`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja excluir a propriedade{" "}
              <span className="font-semibold text-foreground">{property.title}</span>? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenDeleteDialog(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "A excluir..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
