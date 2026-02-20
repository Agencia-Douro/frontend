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
  const image = "https://karelly.s3.eu-north-1.amazonaws.com/Captura+de+ecra%CC%83+2026-02-03%2C+a%CC%80s+09.56.49.png"
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
