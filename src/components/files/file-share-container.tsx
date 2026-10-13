"use client"

import { useEffect } from "react"
import { SharedFileItem } from "@/types/share"
import { FileDropzone } from "@/components/files/file-dropzone"
import { FileList } from "@/components/files/file-list"
import { useSharedFiles } from "@/hooks/use-shared-files"

interface FileShareContainerProps {
  onCountChange?: (count: number) => void
}

export function FileShareContainer({ onCountChange }: FileShareContainerProps) {
  const {
    files,
    isLoading,
    addUploadedFiles,
    deleteFile,
    clearAll,
  } = useSharedFiles()

  useEffect(() => {
    onCountChange?.(files.length)
  }, [files.length, onCountChange])

  const handleFilesUploaded = (newFiles: SharedFileItem[]) => {
    addUploadedFiles(newFiles)
  }

  const handleDelete = async (id: string, storagePath?: string) => {
    await deleteFile(id, storagePath)
  }

  const handleClearAll = async () => {
    if (files.length === 0) return
    await clearAll()
  }

  return (
    <div className="space-y-6">
      <section>
        <FileDropzone onFilesUploaded={handleFilesUploaded} />
      </section>

      <section>
        <FileList
          files={files}
          isLoading={isLoading}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      </section>
    </div>
  )
}
