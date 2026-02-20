export const runtime = "nodejs"
export const alt = "Agência Douro"
export const size = { width: 1200, height: 630 }
export const contentType = "image/jpeg"

const IMAGE_URL = "https://img4.idealista.pt/blur/WEB_DETAIL-XL-L/0/id.pro.pt.image.master/ff/da/d4/307306083.webp"

export default async function Image() {
  const sharp = (await import("sharp")).default

  const res = await fetch(IMAGE_URL, { signal: AbortSignal.timeout(8000) })
  const buf = Buffer.from(await res.arrayBuffer())
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
