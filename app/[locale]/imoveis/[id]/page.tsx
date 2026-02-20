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
      title: "Imóvel | Agência Douro",
      description: "Agência Douro — Mediação Imobiliária no Alto Douro.",
      url,
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
