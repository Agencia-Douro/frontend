import { propertiesApi } from "@/services/api"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const alt = "Property"
export const size = { width: 1200, height: 630 }
export const contentType = "image/webp"

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function Image({ params }: Props) {
  const { id, locale } = await params
  const sharp = (await import("sharp")).default

  try {
    const property = await propertiesApi.getById(id, locale)

    if (property?.image) {
      const url = property.image.startsWith("http")
        ? property.image
        : `https://agenciadouro.pt/api${property.image}`

      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        const webp = await sharp(buf)
          .resize(1200, 630, { fit: "cover" })
          .webp({ quality: 20 })
          .toBuffer()

        return new Response(new Uint8Array(webp), {
          headers: {
            "Content-Type": "image/webp",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        })
      }
    }
  } catch {
    // fall through to branded fallback
  }

  // Fallback: fundo da marca em WebP
  const fallback = await sharp({
    create: { width: 1200, height: 630, channels: 3, background: { r: 245, g: 240, b: 232 } },
  })
    .webp({ quality: 70 })
    .toBuffer()

  return new Response(new Uint8Array(fallback), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
