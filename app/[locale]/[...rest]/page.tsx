import { notFound } from "next/navigation"

/**
 * Catch-all para rotas desconhecidas dentro de [locale].
 * Garante que o nosso not-found.tsx é mostrado em vez do 404 default do Next.js.
 */
export default function CatchAllPage() {
  notFound()
}
