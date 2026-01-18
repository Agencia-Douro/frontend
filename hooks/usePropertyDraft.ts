"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  saveDraftFile,
  saveDraftFiles,
  loadDraftFiles,
  deleteDraftFiles,
  deleteAllDraftFiles,
} from "@/lib/draftStorage"

const DRAFTS_KEY = "property-drafts"
const DEBOUNCE_MS = 1000

export interface PropertyDraft {
  id: string
  formData: any
  newSections: any[]
  pendingRelated: string[]
  savedAt: string
  // Preview info
  title: string
  propertyType: string
  distrito: string
  concelho: string
  price: string
  // Indica se tem arquivos salvos
  hasMainImage: boolean
  sectionImageCounts: Record<string, number> // { 'section-0': 3, 'section-1': 2 }
}

// Gera um ID único simples
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Helper para formatar tempo relativo
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "agora mesmo"
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? "s" : ""}`
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`
  return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`
}

// Hook para listar rascunhos (usado na página de listagem)
export function usePropertyDrafts() {
  const [drafts, setDrafts] = useState<PropertyDraft[]>([])

  const loadDrafts = useCallback(() => {
    try {
      const saved = localStorage.getItem(DRAFTS_KEY)
      if (saved) {
        const parsed: PropertyDraft[] = JSON.parse(saved)
        // Ordenar por data de salvamento (mais recente primeiro)
        parsed.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
        setDrafts(parsed)
      } else {
        setDrafts([])
      }
    } catch (error) {
      console.error("Erro ao carregar rascunhos:", error)
      setDrafts([])
    }
  }, [])

  useEffect(() => {
    loadDrafts()

    // Escuta mudanças no localStorage (de outras abas)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === DRAFTS_KEY) {
        loadDrafts()
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [loadDrafts])

  const deleteDraft = useCallback(async (id: string) => {
    try {
      // Deleta arquivos do IndexedDB
      await deleteDraftFiles(id)

      // Deleta metadados do localStorage
      const saved = localStorage.getItem(DRAFTS_KEY)
      if (saved) {
        const parsed: PropertyDraft[] = JSON.parse(saved)
        const filtered = parsed.filter(d => d.id !== id)
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered))
        setDrafts(filtered)
      }
    } catch (error) {
      console.error("Erro ao deletar rascunho:", error)
    }
  }, [])

  const deleteAllDrafts = useCallback(async () => {
    try {
      // Deleta todos os arquivos do IndexedDB
      await deleteAllDraftFiles()

      // Deleta todos os metadados do localStorage
      localStorage.removeItem(DRAFTS_KEY)
      setDrafts([])
    } catch (error) {
      console.error("Erro ao limpar rascunhos:", error)
    }
  }, [])

  return {
    drafts,
    deleteDraft,
    deleteAllDrafts,
    refreshDrafts: loadDrafts,
  }
}

// Interface para arquivos do rascunho
export interface DraftFiles {
  mainImage: File | null
  sectionImages: Map<number, File[]> // index da seção -> arquivos
}

// Hook para gerenciar um rascunho específico (usado no formulário)
export function usePropertyDraft(draftId?: string | null) {
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId || null)
  const [isLoaded, setIsLoaded] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const filesDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Carrega um rascunho específico pelo ID
  const loadDraft = useCallback((id: string): PropertyDraft | null => {
    try {
      const saved = localStorage.getItem(DRAFTS_KEY)
      if (saved) {
        const parsed: PropertyDraft[] = JSON.parse(saved)
        return parsed.find(d => d.id === id) || null
      }
    } catch (error) {
      console.error("Erro ao carregar rascunho:", error)
    }
    return null
  }, [])

  // Carrega arquivos de um rascunho
  const loadDraftFilesForDraft = useCallback(async (id: string): Promise<DraftFiles> => {
    try {
      const filesMap = await loadDraftFiles(id)

      const mainImageFiles = filesMap.get("mainImage")
      const mainImage = mainImageFiles && mainImageFiles.length > 0 ? mainImageFiles[0] : null

      const sectionImages = new Map<number, File[]>()
      for (const [key, files] of filesMap) {
        if (key.startsWith("section-")) {
          const index = parseInt(key.replace("section-", ""), 10)
          if (!isNaN(index)) {
            sectionImages.set(index, files)
          }
        }
      }

      return { mainImage, sectionImages }
    } catch (error) {
      console.error("Erro ao carregar arquivos do rascunho:", error)
      return { mainImage: null, sectionImages: new Map() }
    }
  }, [])

  // Salva/atualiza um rascunho (metadados)
  const saveDraft = useCallback((
    formData: any,
    newSections: any[] = [],
    pendingRelated: string[] = [],
    existingId?: string | null,
    mainImage?: File | null
  ) => {
    // Cancela o debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Agenda o save
    debounceRef.current = setTimeout(async () => {
      try {
        console.log("Salvando rascunho - formData:", formData) // Debug

        const saved = localStorage.getItem(DRAFTS_KEY)
        const drafts: PropertyDraft[] = saved ? JSON.parse(saved) : []

        const id = existingId || currentDraftId || generateId()

        // Conta imagens por seção
        const sectionImageCounts: Record<string, number> = {}
        newSections.forEach((s, idx) => {
          if (s.images && s.images.length > 0) {
            sectionImageCounts[`section-${idx}`] = s.images.length
          }
        })

        const draft: PropertyDraft = {
          id,
          formData,
          newSections: newSections.map((s, idx) => ({
            sectionName: s.sectionName,
            displayOrder: s.displayOrder,
            // Marca quantas imagens tem (para referência)
            imageCount: s.images?.length || 0,
          })),
          pendingRelated,
          savedAt: new Date().toISOString(),
          // Preview info
          title: formData.title || "Sem título",
          propertyType: formData.propertyType || "",
          distrito: formData.distrito || "",
          concelho: formData.concelho || "",
          price: formData.price || "0",
          hasMainImage: !!mainImage,
          sectionImageCounts,
        }

        // Atualiza ou adiciona
        const existingIndex = drafts.findIndex(d => d.id === id)
        if (existingIndex >= 0) {
          drafts[existingIndex] = draft
        } else {
          drafts.push(draft)
        }

        localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
        setCurrentDraftId(id)

        // Salva imagem principal no IndexedDB
        if (mainImage) {
          await saveDraftFile(id, "mainImage", mainImage, 0)
        }

        // Salva imagens das seções no IndexedDB
        for (let i = 0; i < newSections.length; i++) {
          const section = newSections[i]
          if (section.images && section.images.length > 0) {
            await saveDraftFiles(id, `section-${i}`, section.images)
          }
        }
      } catch (error) {
        console.error("Erro ao salvar rascunho:", error)
      }
    }, DEBOUNCE_MS)

    return currentDraftId
  }, [currentDraftId])

  // Deleta o rascunho atual
  const deleteDraft = useCallback(async (id?: string) => {
    const targetId = id || currentDraftId
    if (!targetId) return

    try {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (filesDebounceRef.current) {
        clearTimeout(filesDebounceRef.current)
      }

      // Deleta arquivos do IndexedDB
      await deleteDraftFiles(targetId)

      // Deleta metadados do localStorage
      const saved = localStorage.getItem(DRAFTS_KEY)
      if (saved) {
        const parsed: PropertyDraft[] = JSON.parse(saved)
        const filtered = parsed.filter(d => d.id !== targetId)
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered))
      }

      if (targetId === currentDraftId) {
        setCurrentDraftId(null)
      }
    } catch (error) {
      console.error("Erro ao deletar rascunho:", error)
    }
  }, [currentDraftId])

  // Limpa debounce ao desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (filesDebounceRef.current) {
        clearTimeout(filesDebounceRef.current)
      }
    }
  }, [])

  // Carrega rascunho inicial se ID foi passado
  useEffect(() => {
    if (draftId && !isLoaded) {
      setCurrentDraftId(draftId)
      setIsLoaded(true)
    }
  }, [draftId, isLoaded])

  return {
    currentDraftId,
    loadDraft,
    loadDraftFiles: loadDraftFilesForDraft,
    saveDraft,
    deleteDraft,
    setCurrentDraftId,
  }
}
