"use client"

import { useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import { Button } from "./button"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const isUpdatingRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: {
          keepMarks: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Escreva aqui...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (!isUpdatingRef.current) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: "tiptap min-h-[120px] px-2 py-1.5 text-black-muted body-14-medium outline-none",
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.hardBreak.create()).scrollIntoView())
          return true
        }
        return false
      },
    },
  })

  // Atualiza o conteúdo do editor quando o value muda externamente
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      isUpdatingRef.current = true
      editor.commands.setContent(value, { emitUpdate: false })
      isUpdatingRef.current = false
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="bg-white shadow-pretty border-b border-[#EAE6DF] px-2 py-1.5 flex gap-1">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "brown" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-7 w-7"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "brown" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-7 w-7"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "brown" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-7 w-7"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "brown" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-7 w-7"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="w-full shadow-pretty bg-white"
      />
    </div>
  )
}
