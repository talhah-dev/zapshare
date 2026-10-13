"use client"

import { useState } from "react"
import { SharedFileItem } from "@/types/share"
import { FileCard } from "@/components/files/file-card"
import { FileListSkeleton } from "@/components/skeletons/file-list-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StorageIndicator } from "@/components/common/storage-indicator"
import { FolderArchive, Search, Trash2 } from "lucide-react"

interface FileListProps {
  files: SharedFileItem[]
  isLoading?: boolean
  onDelete: (id: string, storagePath?: string) => void
  onClearAll: () => void
}

export function FileList({
  files,
  isLoading = false,
  onDelete,
  onClearAll,
}: FileListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0)

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Shared Files
          </h2>
          {isLoading ? (
            <Skeleton className="h-5 w-6 rounded-full" />
          ) : (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs font-mono">
              {files.length}
            </Badge>
          )}
          <StorageIndicator
            type="files"
            usedBytes={totalBytes}
            itemsCount={files.length}
          />
        </div>

        {!isLoading && files.length > 0 && (
          <div className="flex items-center gap-2">
            {files.length > 2 && (
              <div className="relative w-40 sm:w-48">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filter files..."
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
        <FileListSkeleton />
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-card">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            <FolderArchive className="size-5" />
          </div>
          <h3 className="text-sm font-medium text-foreground">No files uploaded yet</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Drop images, PDFs, archives, or any files into the upload box above to share them instantly with anyone.
          </p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-xs text-muted-foreground">
          No files match &ldquo;{searchQuery}&rdquo;.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredFiles.map((file) => (
            <FileCard key={file.id} file={file} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
