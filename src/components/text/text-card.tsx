"use client"

import { useState } from "react"
import { TextMessageItem } from "@/types/share"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Trash2, Pin, Clock, Download, ExternalLink } from "lucide-react"
import { useTimeAgo } from "@/hooks/use-time-ago"
import { toast } from "sonner"

interface TextCardProps {
  item: TextMessageItem
  onDelete: (id: string) => void
  onTogglePin?: (id: string) => void
}

export function TextCard({ item, onDelete, onTogglePin }: TextCardProps) {
  const [copied, setCopied] = useState(false)
  const timeAgo = useTimeAgo(item.createdAt)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content)
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([item.content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `shared-note-${item.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.info("Downloaded as .txt")
  }

  const isUrl = /^https?:\/\/[^\s]+$/.test(item.content.trim())

  return (
    <Card className="group relative border shadow-xs transition-colors hover:border-foreground/20">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {item.isPinned && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] gap-1">
                <Pin className="size-2.5 rotate-45" />
                Pinned
              </Badge>
            )}
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {timeAgo}
            </span>
            <span>•</span>
            <span>{item.charCount} chars</span>
          </div>

          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
            {onTogglePin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onTogglePin(item.id)}
                className={`size-7 text-muted-foreground hover:text-foreground ${
                  item.isPinned ? "text-primary" : ""
                }`}
                title={item.isPinned ? "Unpin note" : "Pin note"}
              >
                <Pin className="size-3.5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownloadTxt}
              className="size-7 text-muted-foreground hover:text-foreground"
              title="Download as text file"
            >
              <Download className="size-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="size-7 text-muted-foreground hover:text-destructive"
              title="Delete note"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="relative rounded-md bg-muted/40 p-3 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap selection:bg-primary/20">
          {item.content}
        </div>

        <div className="flex items-center justify-between pt-1">
          {isUrl ? (
            <a
              href={item.content.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="size-3" />
              Open Link
            </a>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              {item.wordCount} {item.wordCount === 1 ? "word" : "words"}
            </span>
          )}

          <Button
            size="sm"
            variant={copied ? "default" : "secondary"}
            onClick={handleCopy}
            className="h-8 px-3 text-xs gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
