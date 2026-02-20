import { ImageResponse } from "next/og"
import { propertiesApi } from "@/services/api"

export const runtime = "nodejs"
export const alt = "Agência Douro"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const FALLBACK = "https://img4.idealista.pt/blur/WEB_DETAIL-XL-L/0/id.pro.pt.image.master/ff/da/d4/307306083.webp"

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function Image({ params }: Props) {
  const { id, locale } = await params
  const property = await propertiesApi.getById(id, locale).catch(() => null)
  const imageUrl = property?.image ?? FALLBACK

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />,
    { width: 1200, height: 630 }
  )
}
