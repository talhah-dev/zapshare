"use client"

import { useState } from "react"
import Image from "next/image"
import { SharedFileItem } from "@/types/share"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Trash2,
  Copy,
  Check,
  FileText,
  ImageIcon,
  FileArchive,
  Film,
  Music,
  FileCode,
  File,
  Clock,
} from "lucide-react"
import { useTimeAgo } from "@/hooks/use-time-ago"
import { toast } from "sonner"

interface FileCardProps {
  file: SharedFileItem
  onDelete: (id: string, storagePath?: string) => void
}

export function FileCard({ file, onDelete }: FileCardProps) {
  const [copied, setCopied] = useState(false)
  const timeAgo = useTimeAgo(file.createdAt)

  const getCategoryIcon = () => {
    switch (file.category) {
      case "image":
        return <ImageIcon className="size-5 text-sky-500" />
      case "document":
        return <FileText className="size-5 text-amber-500" />
      case "archive":
        return <FileArchive className="size-5 text-indigo-500" />
      case "video":
        return <Film className="size-5 text-rose-500" />
      case "audio":
        return <Music className="size-5 text-purple-500" />
      case "code":
        return <FileCode className="size-5 text-emerald-500" />
      default:
        return <File className="size-5 text-muted-foreground" />
    }
  }

  const handleDownload = () => {
    let url = file.publicUrl || file.previewUrl

    if (!url && file.blob) {
      url = URL.createObjectURL(file.blob)
    }

    if (!url) {
      const blob = new Blob([`ZapShare content for file: ${file.name}`], {
        type: file.type || "application/octet-stream",
      })
      url = URL.createObjectURL(blob)
    }

    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast.success(`Downloading "${file.name}"`)
  }

  const handleCopyFileName = async () => {
    try {
      await navigator.clipboard.writeText(file.name)
      setCopied(true)
      toast.info(`Copied "${file.name}" to clipboard`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy file name")
    }
  }

  const imageSrc = file.previewUrl || file.publicUrl

  return (
    <Card className="group relative border shadow-xs transition-colors hover:border-foreground/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3.5">
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/60">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={file.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              getCategoryIcon()
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4
                className="truncate text-sm font-medium text-foreground"
                title={file.name}
              >
                {file.name}
              </h4>
              <Badge variant="secondary" className="shrink-0 text-[10px] font-mono font-medium">
                {file.formattedSize}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{file.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {timeAgo}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyFileName}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="size-3 mr-1 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3 mr-1" />
                Copy Name
              </>
            )}
          </Button>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(file.id, file.storagePath)}
              className="size-7 text-muted-foreground hover:text-destructive"
              title="Delete file"
            >
              <Trash2 className="size-3.5" />
            </Button>

            <Button
              size="sm"
              onClick={handleDownload}
              className="h-7 px-2.5 text-xs gap-1"
            >
              <Download className="size-3" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
