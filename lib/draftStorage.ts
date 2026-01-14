"use client"

// IndexedDB storage para arquivos de rascunhos de propriedades

const DB_NAME = "property-drafts-db"
const DB_VERSION = 1
const FILES_STORE = "draft-files"

export interface DraftFile {
  draftId: string
  fieldName: string // 'mainImage', 'section-0', 'section-1', etc.
  fileName: string
  fileType: string
  fileData: ArrayBuffer
  fileIndex?: number // Para múltiplos arquivos no mesmo campo
}

// Abre ou cria o banco de dados
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Cria o object store se não existir
      if (!db.objectStoreNames.contains(FILES_STORE)) {
        const store = db.createObjectStore(FILES_STORE, {
          keyPath: ["draftId", "fieldName", "fileIndex"],
        })
        store.createIndex("by-draft", "draftId", { unique: false })
      }
    }
  })
}

// Salva um arquivo
export async function saveDraftFile(
  draftId: string,
  fieldName: string,
  file: File,
  fileIndex: number = 0
): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const transaction = db.transaction(FILES_STORE, "readwrite")
      const store = transaction.objectStore(FILES_STORE)

      const draftFile: DraftFile = {
        draftId,
        fieldName,
        fileName: file.name,
        fileType: file.type,
        fileData: reader.result as ArrayBuffer,
        fileIndex,
      }

      const request = store.put(draftFile)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

// Salva múltiplos arquivos para um campo
export async function saveDraftFiles(
  draftId: string,
  fieldName: string,
  files: File[]
): Promise<void> {
  // Primeiro remove arquivos antigos deste campo
  await deleteDraftFieldFiles(draftId, fieldName)

  // Salva os novos
  for (let i = 0; i < files.length; i++) {
    await saveDraftFile(draftId, fieldName, files[i], i)
  }
}

// Carrega arquivos de um rascunho
export async function loadDraftFiles(draftId: string): Promise<Map<string, File[]>> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILES_STORE, "readonly")
    const store = transaction.objectStore(FILES_STORE)
    const index = store.index("by-draft")

    const request = index.getAll(draftId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const result = new Map<string, File[]>()
      const draftFiles: DraftFile[] = request.result

      // Agrupa por fieldName
      const grouped = new Map<string, DraftFile[]>()
      for (const df of draftFiles) {
        const list = grouped.get(df.fieldName) || []
        list.push(df)
        grouped.set(df.fieldName, list)
      }

      // Converte para File objects
      for (const [fieldName, files] of grouped) {
        // Ordena por fileIndex
        files.sort((a, b) => (a.fileIndex || 0) - (b.fileIndex || 0))

        const fileList = files.map((df) => {
          const blob = new Blob([df.fileData], { type: df.fileType })
          return new File([blob], df.fileName, { type: df.fileType })
        })

        result.set(fieldName, fileList)
      }

      resolve(result)
    }
  })
}

// Deleta arquivos de um campo específico
export async function deleteDraftFieldFiles(
  draftId: string,
  fieldName: string
): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILES_STORE, "readwrite")
    const store = transaction.objectStore(FILES_STORE)
    const index = store.index("by-draft")

    const request = index.getAllKeys(draftId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const keys = request.result as [string, string, number][]
      const deletePromises: Promise<void>[] = []

      for (const key of keys) {
        if (key[1] === fieldName) {
          deletePromises.push(
            new Promise((res, rej) => {
              const delReq = store.delete(key)
              delReq.onerror = () => rej(delReq.error)
              delReq.onsuccess = () => res()
            })
          )
        }
      }

      Promise.all(deletePromises)
        .then(() => resolve())
        .catch(reject)
    }
  })
}

// Deleta todos os arquivos de um rascunho
export async function deleteDraftFiles(draftId: string): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILES_STORE, "readwrite")
    const store = transaction.objectStore(FILES_STORE)
    const index = store.index("by-draft")

    const request = index.getAllKeys(draftId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const keys = request.result
      let completed = 0

      if (keys.length === 0) {
        resolve()
        return
      }

      for (const key of keys) {
        const deleteRequest = store.delete(key)
        deleteRequest.onerror = () => reject(deleteRequest.error)
        deleteRequest.onsuccess = () => {
          completed++
          if (completed === keys.length) {
            resolve()
          }
        }
      }
    }
  })
}

// Deleta todos os arquivos de todos os rascunhos
export async function deleteAllDraftFiles(): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILES_STORE, "readwrite")
    const store = transaction.objectStore(FILES_STORE)

    const request = store.clear()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Verifica se um rascunho tem arquivos
export async function draftHasFiles(draftId: string): Promise<boolean> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILES_STORE, "readonly")
    const store = transaction.objectStore(FILES_STORE)
    const index = store.index("by-draft")

    const request = index.count(draftId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result > 0)
  })
}
