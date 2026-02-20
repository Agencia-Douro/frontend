export const runtime = "edge"
export const alt = "Agência Douro"
export const size = { width: 1200, height: 630 }
export const contentType = "image/webp"

export default async function Image() {
  const res = await fetch(
    "https://img4.idealista.pt/blur/WEB_DETAIL-XL-L/0/id.pro.pt.image.master/ff/da/d4/307306083.webp"
  )
  const buf = await res.arrayBuffer()
  return new Response(buf, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
