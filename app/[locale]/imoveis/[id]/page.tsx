import { Metadata } from "next"
import { notFound } from "next/navigation"
import { propertiesApi } from "@/services/api"
import ImovelDetailsClient from "./ImovelDetailsClient"

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const url = `https://www.agenciadouro.pt/${locale}/imoveis/${id}`
  const property = await propertiesApi.getById(id, locale).catch(() => null)
  const fallback = "https://img4.idealista.pt/blur/WEB_DETAIL-XL-L/0/id.pro.pt.image.master/ff/da/d4/307306083.webp"
  const rawImage = property?.image ?? fallback
  const image = `https://agenciadouro.pt/api/properties/og-image?url=${encodeURIComponent(rawImage)}`
  const title = property?.title ?? "Imóvel | Agência Douro"
  const description = property?.description ?? "Agência Douro — Mediação Imobiliária no Alto Douro."

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: [image],
    },
  }
}

export default async function ImovelDetails({ params }: Props) {
  const { id, locale } = await params

  let initialProperty
  try {
    initialProperty = await propertiesApi.getById(id, locale)
  } catch {
    notFound()
  }
  if (!initialProperty) notFound()

  return <ImovelDetailsClient initialProperty={initialProperty} />
}
