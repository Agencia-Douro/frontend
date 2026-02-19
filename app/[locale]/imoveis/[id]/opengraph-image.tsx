import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "Agência Douro"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const logoRes = await fetch("https://www.agenciadouro.pt/Logo.png")
  const logoBase64 = logoRes.ok
    ? `data:image/png;base64,${Buffer.from(await logoRes.arrayBuffer()).toString("base64")}`
    : null

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f0e8",
      }}
    >
      {logoBase64 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoBase64} alt="Agência Douro" style={{ maxWidth: 600 }} />
      ) : (
        <div style={{ fontSize: 64, color: "#8B7355", fontFamily: "serif" }}>
          Agência Douro
        </div>
      )}
    </div>,
    size
  )
}
