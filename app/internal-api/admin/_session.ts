import { createHmac, timingSafeEqual } from "crypto"

function base64url(input: string | Buffer) {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function base64urlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4))
  return Buffer.from(normalized + pad, "base64").toString("utf8")
}

export type AdminSessionPayload = {
  sub: "admin"
  exp: number
}

export function signAdminSession(payload: AdminSessionPayload, secret: string) {
  const body = base64url(JSON.stringify(payload))
  const sig = createHmac("sha256", secret).update(body).digest()
  return `${body}.${base64url(sig)}`
}

export function verifyAdminSession(token: string, secret: string): AdminSessionPayload | null {
  const [body, sig] = token.split(".")
  if (!body || !sig) return null

  const expected = createHmac("sha256", secret).update(body).digest()
  const actual = Buffer.from(sig.replace(/-/g, "+").replace(/_/g, "/"), "base64")

  if (actual.length !== expected.length) return null
  if (!timingSafeEqual(actual, expected)) return null

  const payload = JSON.parse(base64urlDecode(body)) as AdminSessionPayload
  if (!payload?.exp || payload.sub !== "admin") return null
  if (Date.now() > payload.exp) return null
  return payload
}
