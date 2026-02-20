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

  return {
    title: "Imóvel | Agência Douro",
    description: "Agência Douro — Mediação Imobiliária no Alto Douro.",
    openGraph: {
      type: "website",
      title: "Imóvel | Agência Douro",
      description: "Agência Douro — Mediação Imobiliária no Alto Douro.",
      url,
      images: [
        "https://img4.idealista.pt/blur/WEB_DETAIL-XL-L/0/id.pro.pt.image.master/ff/da/d4/307306083.webp",
      ],
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
