"use client"

import { useEffect } from "react"
import { TextEditor } from "@/components/text/text-editor"
import { TextList } from "@/components/text/text-list"
import { useTextMessages } from "@/hooks/use-text-messages"

interface TextShareContainerProps {
  onCountChange?: (count: number) => void
}

export function TextShareContainer({ onCountChange }: TextShareContainerProps) {
  const {
    messages,
    isLoading,
    addMessage,
    deleteMessage,
    togglePin,
    clearAll,
  } = useTextMessages()

  useEffect(() => {
    onCountChange?.(messages.length)
  }, [messages.length, onCountChange])

  const handleSaveText = async (content: string) => {
    await addMessage(content)
  }

  const handleDelete = async (id: string) => {
    await deleteMessage(id)
  }

  const handleTogglePin = async (id: string) => {
    await togglePin(id)
  }

  const handleClearAll = async () => {
    if (messages.length === 0) return
    await clearAll()
  }

  return (
    <div className="space-y-6">
      <section>
        <TextEditor onSaveText={handleSaveText} />
      </section>

      <section>
        <TextList
          items={messages}
          isLoading={isLoading}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
          onTogglePin={handleTogglePin}
        />
      </section>
    </div>
  )
}
