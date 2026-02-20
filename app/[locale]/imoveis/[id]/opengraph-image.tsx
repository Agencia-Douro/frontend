import { propertiesApi } from "@/services/api"

export const runtime = "nodejs"
export const alt = "Agência Douro"
export const size = { width: 1200, height: 630 }
export const contentType = "image/jpeg"

const FALLBACK = "https://img4.idealista.pt/blur/WEB_DETAIL-XL-L/0/id.pro.pt.image.master/ff/da/d4/307306083.webp"

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function Image({ params }: Props) {
  const { id, locale } = await params
  const sharp = (await import("sharp")).default

  const property = await propertiesApi.getById(id, locale).catch(() => null)
  const imageUrl = property?.image ?? FALLBACK

  const res = await fetch(imageUrl, { signal: AbortSignal.timeout(8000) }).catch(() => null)
  const src = res?.ok ? res : await fetch(FALLBACK)

  const buf = Buffer.from(await src.arrayBuffer())
  const jpeg = await sharp(buf)
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 80 })
    .toBuffer()

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
