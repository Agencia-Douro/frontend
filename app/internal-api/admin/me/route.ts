import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminSession } from "../_session"

export async function GET() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET
  if (!sessionSecret) {
    return NextResponse.json(
      { error: "Configuração do servidor incompleta" },
      { status: 500 }
    )
  }

  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value
  if (!token) return NextResponse.json({ isAuthenticated: false }, { status: 200 })

  const payload = verifyAdminSession(token, sessionSecret)
  return NextResponse.json({ isAuthenticated: !!payload }, { status: 200 })
}

