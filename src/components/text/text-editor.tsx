"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, Clipboard, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface TextEditorProps {
  onSaveText: (content: string) => Promise<void> | void
}

export function TextEditor({ onSaveText }: TextEditorProps) {
  const [content, setContent] = useState("")
  const [isPasting, setIsPasting] = useState(false)

  const charCount = content.length
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please enter some text to share")
      return
    }

    try {
      await onSaveText(content.trim())
      setContent("")
      toast.success("Text snippet saved successfully")
    } catch {
      return
    }
  }

  const handlePaste = async () => {
    try {
      setIsPasting(true)
      const text = await navigator.clipboard.readText()
      if (text) {
        setContent((prev) => (prev ? `${prev}\n${text}` : text))
        toast.info("Pasted from clipboard")
      } else {
        toast.error("Clipboard is empty")
      }
    } catch {
      toast.error("Clipboard permission was denied or not supported by browser")
    } finally {
      setIsPasting(false)
    }
  }

  const handleClear = () => {
    if (!content) return
    setContent("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Card className="border shadow-xs">
      <CardContent className="space-y-3">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste text to share (notes, links, passwords, code)..."
            rows={5}
            className="resize-y min-h-[50vh] text-sm leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 ">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {charCount} {charCount === 1 ? "char" : "chars"}
            </span>
            <span>•</span>
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-[11px] opacity-75">
              Press Ctrl+Enter to share
            </span>
          </div>

          <div className="flex items-center gap-2">
            {content && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5 mr-1" />
                Clear
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePaste}
              disabled={isPasting}
              className="h-8 px-2.5 text-xs"
            >
              <Clipboard className="size-3.5 mr-1" />
              Paste
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!content.trim()}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <Send className="size-3.5" />
              <span>Share Text</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
