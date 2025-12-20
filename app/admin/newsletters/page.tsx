"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { newslettersApi } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Trash2, Edit, X } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function NewslettersPage() {
  const router = useRouter()
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
      toast.success("Newsletter deletada com sucesso!")
      setDeleteId(null)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao deletar newsletter")
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
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Newsletters</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">A carregar newsletters...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Newsletters</h1>
        <div className="text-center py-12">
          <p className="text-red-500">Erro ao carregar newsletters: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="body-18-medium">Gerenciar Newsletters</h1>
          <p className="text-muted-foreground mt-1">
            Total de {newsletters?.length || 0} newsletter(s)
            {filteredAndSortedNewsletters.length !== newsletters?.length &&
              ` (${filteredAndSortedNewsletters.length} filtrada(s))`
            }
          </p>
        </div>
        <Button onClick={() => router.push("/admin/newsletters/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Newsletter
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou conteúdo..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryFilter || undefined}
            onValueChange={(value) => setCategoryFilter(value || "")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mercado">Mercado</SelectItem>
              <SelectItem value="dicas">Dicas</SelectItem>
              <SelectItem value="noticias">Notícias</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Mais recentes</SelectItem>
              <SelectItem value="createdAt">Mais antigos</SelectItem>
              <SelectItem value="title">Título A-Z</SelectItem>
              <SelectItem value="-title">Título Z-A</SelectItem>
            </SelectContent>
          </Select>
          {(categoryFilter || searchInput) && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedNewsletters.map((newsletter) => (
          <Card key={newsletter.id} className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer p-0">
            {newsletter.coverImage && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={newsletter.coverImage}
                  alt={newsletter.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="pb-5">
              <CardTitle className="text-lg line-clamp-2 mb-5">{newsletter.title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => router.push(`/admin/newsletters/${newsletter.id}/edit`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="brown"
                  size="default"
                  onClick={() => setDeleteId(newsletter.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedNewsletters.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma newsletter encontrada</p>
        </div>
      )}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="body-18-medium">Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta newsletter? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="brown" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              variant="ghost"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
