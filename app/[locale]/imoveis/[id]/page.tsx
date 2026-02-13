import { Metadata } from "next"
import { notFound } from "next/navigation"
import { propertiesApi } from "@/services/api"
import ImovelDetailsClient from "./ImovelDetailsClient"
import { siteConfig } from "@/lib/site"
import { routing } from "@/i18n/routing"

type Props = {
    params: Promise<{
        id: string
        locale: string
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, locale } = await params

    try {
    const property = await propertiesApi.getById(id, locale)

    if (!property) {
      return {
        title: "Imóvel não encontrado | Agência Douro",
        description: "O imóvel que procura não foi encontrado.",
      }
    }

        const transactionTypeMap: Record<string, string> = {
            comprar: "Comprar",
            arrendar: "Arrendar",
            trespasse: "Trespasse",
        }

        const propertyTypeMap: Record<string, string> = {
            apartamento: "Apartamento",
            moradia: "Moradia",
            terreno: "Terreno",
            escritório: "Escritório",
            loja: "Loja",
            armazém: "Armazém",
            prédio: "Prédio",
            quinta: "Quinta",
            garagem: "Garagem",
            cave: "Cave",
        }

        const transactionType = transactionTypeMap[property.transactionType] || property.transactionType
        const propertyType = propertyTypeMap[property.propertyType.toLowerCase()] || property.propertyType
        const price = parseFloat(property.price).toLocaleString('pt-PT')
        const totalArea = property.totalArea ?? 0

        const title = `${property.title} - ${price} € | Agência Douro`
        const description = `${transactionType} ${propertyType} em ${property.concelho}, ${property.distrito}. ${property.bedrooms > 0 ? `${property.bedrooms} quartos` : ''}${property.bathrooms > 0 ? `, ${property.bathrooms} casas de banho` : ''}${totalArea > 0 ? `, ${totalArea}m²` : ''}. Referência: ${property.reference}`

        // Get absolute URL for og:image
        const imageUrl = property.image?.startsWith('http')
            ? property.image
            : `${process.env.NEXT_PUBLIC_API_URL || 'https://agenciadouro.pt'}${property.image}`

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url
        const canonicalUrl = `${baseUrl}/${locale}/imoveis/${id}`
        const languages: Record<string, string> = {}
        for (const loc of routing.locales) {
            languages[loc] = `${baseUrl}/${loc}/imoveis/${id}`
        }

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: locale === "pt" ? "pt_PT" : "en_US",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
        siteName: "Agência Douro",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch {
    return {
      title: "Imóvel não encontrado | Agência Douro",
      description: "O imóvel que procura não foi encontrado.",
    }
  }
}

export default async function ImovelDetails({ params }: Props) {
    const { id, locale } = await params
  let initialProperty: Awaited<ReturnType<typeof propertiesApi.getById>> | null = null
    try {
    initialProperty = await propertiesApi.getById(id, locale)
  } catch {
    notFound()
  }
  if (!initialProperty) notFound()
  return <ImovelDetailsClient initialProperty={initialProperty} />
}
