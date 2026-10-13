"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UploadCloud, FileUp, ImageIcon, FileText, FileArchive } from "lucide-react"
import { toast } from "sonner"
import { SharedFileItem } from "@/types/share"
import { uploadFileToStorage } from "@/lib/file-service"

interface FileDropzoneProps {
  onFilesUploaded: (newFiles: SharedFileItem[]) => void
}

export function FileDropzone({ onFilesUploaded }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadingCount, setUploadingCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const filesArray = Array.from(fileList)
    setUploadingCount(filesArray.length)
    setIsUploading(true)
    setUploadProgress(20)

    try {
      const uploadedResults: SharedFileItem[] = []

      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i]
        const uploaded = await uploadFileToStorage(file)
        uploadedResults.push(uploaded)
        const progressPercentage = Math.round(((i + 1) / filesArray.length) * 100)
        setUploadProgress(progressPercentage)
      }

      onFilesUploaded(uploadedResults)
      toast.success(
        uploadedResults.length === 1
          ? `Uploaded "${uploadedResults[0].name}"`
          : `Uploaded ${uploadedResults.length} files successfully`
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "File upload failed. Please try again."
      toast.error(msg)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadingCount(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!isUploading ? openFileDialog : undefined}
      className={`relative cursor-pointer border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.005]"
          : "border-border hover:border-foreground/30 hover:bg-muted/30"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <CardContent className="flex flex-col items-center justify-center p-8 text-center sm:p-10">
        {isUploading ? (
          <div className="w-full max-w-sm space-y-3 py-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-foreground">
                <FileUp className="size-4 animate-bounce text-primary" />
                Uploading {uploadingCount} {uploadingCount === 1 ? "file" : "files"} to ZapShare...
              </span>
              <span className="text-muted-foreground font-mono">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2 w-full" />
            <p className="text-[11px] text-muted-foreground">
              Instant upload, available anywhere
            </p>
          </div>
        ) : (
          <>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-transform group-hover:scale-105 mb-4">
              <UploadCloud className="size-7 text-primary" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Drag & drop any files here, or{" "}
                <span className="text-primary underline underline-offset-4">browse</span>
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Upload photos, documents, videos, archives, or code files. Anyone can download them instantly from anywhere.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5">
                <ImageIcon className="size-3 text-muted-foreground" />
                Images (PNG, JPG, WebP)
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5">
                <FileText className="size-3 text-muted-foreground" />
                Documents (PDF, DOCX)
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5">
                <FileArchive className="size-3 text-muted-foreground" />
                Any File Type
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
