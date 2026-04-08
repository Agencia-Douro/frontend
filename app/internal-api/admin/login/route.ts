import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { signAdminSession } from "../_session"

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string
    password?: string
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const sessionSecret = process.env.ADMIN_SESSION_SECRET

  if (!adminEmail || !adminPassword || !sessionSecret) {
    return NextResponse.json(
      { error: "Configuração do servidor incompleta" },
      { status: 500 }
    )
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
    password !== adminPassword
  ) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
  }

  const token = signAdminSession(
    { sub: "admin", exp: Date.now() + 1000 * 60 * 60 * 24 * 7 },
    sessionSecret
  )

  const cookieStore = await cookies()
  cookieStore.set({
    name: "admin_session",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({ ok: true })
}

