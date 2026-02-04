"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { newslettersApi } from "@/services/api"
import { Card, CardContent, CardTitle } from "@/components/ui-admin/card"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui-admin/alert-dialog"
import { Plus, Search, Trash2, Edit, X } from "lucide-react"
import { toast } from "sonner"

export default function NewslettersPage() {
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState("-createdAt")

  const { data: newsletters, isLoading, error } = useQuery({
    queryKey: ["newsletters"],
    queryFn: () => newslettersApi.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => newslettersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] })
      toast.success("Newsletter eliminada com sucesso.")
      setDeleteId(null)
    },
    onError: (error: unknown) => {
      toast.error((error as Error)?.message || "Erro ao eliminar newsletter")
    },
  })

  const filteredAndSortedNewsletters = useMemo(() => {
    if (!newsletters) return []
    let filtered = [...newsletters]
    if (searchInput) {
      const search = searchInput.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(search) ||
          n.content.toLowerCase().includes(search)
      )
    }
    if (categoryFilter) {
      filtered = filtered.filter((n) => n.category === categoryFilter)
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "-createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "createdAt":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "-title":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
    return filtered
  }, [newsletters, searchInput, categoryFilter, sortBy])

  const clearFilters = () => {
    setSearchInput("")
    setCategoryFilter("")
    setSortBy("-createdAt")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
        <h1 className="mb-2 text-lg font-semibold tracking-tight text-foreground">Newsletters</h1>
        <p className="py-12 text-center text-sm text-muted-foreground">A carregar newsletters…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
        <h1 className="mb-2 text-lg font-semibold tracking-tight text-foreground">Newsletters</h1>
        <p className="py-12 text-center text-sm text-destructive">
          Erro ao carregar newsletters: {(error as Error).message}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Newsletters</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {newsletters?.length ?? 0} newsletter(s)
            {filteredAndSortedNewsletters.length !== (newsletters?.length ?? 0) &&
              ` (${filteredAndSortedNewsletters.length} filtrada(s))`}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/newsletters/create">
            <Plus className="size-4 shrink-0" aria-hidden />
            Nova newsletter
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar por título ou conteúdo…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter || undefined} onValueChange={(v) => setCategoryFilter(v || "")}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mercado">Mercado</SelectItem>
            <SelectItem value="dicas">Dicas</SelectItem>
            <SelectItem value="noticias">Notícias</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-createdAt">Mais recentes</SelectItem>
            <SelectItem value="createdAt">Mais antigos</SelectItem>
            <SelectItem value="title">Título A–Z</SelectItem>
            <SelectItem value="-title">Título Z–A</SelectItem>
          </SelectContent>
        </Select>
        {(categoryFilter || searchInput) && (
          <Button variant="ghost" size="default" onClick={clearFilters}>
            <X className="size-4 shrink-0" aria-hidden />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid gap-y-6 gap-x-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedNewsletters.map((newsletter) => (
          <Card
            key={newsletter.id}
            className="flex h-full flex-col overflow-hidden border-border bg-card p-0 transition-shadow hover:shadow-md"
          >
            {newsletter.coverImage && (
              <div className="h-48 w-full shrink-0 overflow-hidden">
                <img
                  src={newsletter.coverImage}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
            )}
            <CardContent className="flex flex-1 flex-col">
              <CardTitle className="mb-4 line-clamp-2 text-lg font-semibold">{newsletter.title}</CardTitle>
              <div className="mt-auto flex gap-2">
                <Button variant="outline" size="default" className="min-w-0 flex-1" asChild>
                  <Link href={`/admin/newsletters/${newsletter.id}/edit`}>
                    <Edit className="size-4 shrink-0" aria-hidden />
                    Editar
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="default"
                  onClick={() => setDeleteId(newsletter.id)}
                  aria-label="Eliminar newsletter"
                >
                  <Trash2 className="size-4 shrink-0" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedNewsletters.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma newsletter encontrada.</p>
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar esta newsletter? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "A eliminar…" : "Eliminar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
