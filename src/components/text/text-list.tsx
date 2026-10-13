"use client"

import { useState } from "react"
import { TextMessageItem } from "@/types/share"
import { TextCard } from "@/components/text/text-card"
import { TextListSkeleton } from "@/components/skeletons/text-list-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StorageIndicator } from "@/components/common/storage-indicator"
import { FileText, Search, Trash2 } from "lucide-react"

interface TextListProps {
  items: TextMessageItem[]
  isLoading?: boolean
  onDelete: (id: string) => void
  onClearAll: () => void
  onTogglePin?: (id: string) => void
}

export function TextList({
  items,
  isLoading = false,
  onDelete,
  onClearAll,
  onTogglePin,
}: TextListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const totalBytes = items.reduce(
    (acc, item) =>
      acc + (new TextEncoder().encode(item.content).length || item.charCount || 0),
    0
  )

  const filteredItems = items.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Shared Notes & Snippets
          </h2>
          {isLoading ? (
            <Skeleton className="h-5 w-6 rounded-full" />
          ) : (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs font-mono">
              {items.length}
            </Badge>
          )}
          <StorageIndicator
            type="text"
            usedBytes={totalBytes}
            itemsCount={items.length}
          />
        </div>

        {!isLoading && items.length > 0 && (
          <div className="flex items-center gap-2">
            {items.length > 2 && (
              <div className="relative w-44 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <TextListSkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-card">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            <FileText className="size-5" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No shared text yet</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Type or paste notes, URLs, or code in the box above to immediately share across any device.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-xs text-muted-foreground">
          No notes match &ldquo;{searchQuery}&rdquo;.
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedItems.map((item) => (
            <TextCard
              key={item.id}
              item={item}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      )}
    </div>
  )
}
