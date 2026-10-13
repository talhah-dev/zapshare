"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Database, HardDrive, Info } from "lucide-react"
import { formatFileSize } from "@/lib/formatters"

interface StorageIndicatorProps {
  type: "text" | "files"
  usedBytes: number
  itemsCount: number
}

const TEXT_QUOTA_BYTES = 500 * 1024 * 1024
const FILE_QUOTA_BYTES = 1024 * 1024 * 1024

export function StorageIndicator({
  type,
  usedBytes,
  itemsCount,
}: StorageIndicatorProps) {
  const isText = type === "text"
  const totalBytes = isText ? TEXT_QUOTA_BYTES : FILE_QUOTA_BYTES
  const safeUsedBytes = Math.max(0, usedBytes)
  const safeFreeBytes = Math.max(0, totalBytes - safeUsedBytes)

  const usedPercentage = (safeUsedBytes / totalBytes) * 100
  const freePercentage = Math.max(0, 100 - usedPercentage)

  const usedFormatted = formatFileSize(safeUsedBytes)
  const freeFormatted = formatFileSize(safeFreeBytes)
  const quotaFormatted = formatFileSize(totalBytes)

  let badgeText = "100% free"
  let usedPercentText = "0%"
  let freePercentText = "100%"

  if (safeUsedBytes > 0) {
    if (usedPercentage < 0.01) {
      badgeText = "> 99.9% free"
      usedPercentText = "< 0.01%"
      freePercentText = "> 99.99%"
    } else if (usedPercentage < 0.1) {
      badgeText = "> 99.9% free"
      usedPercentText = "< 0.1%"
      freePercentText = "> 99.9%"
    } else {
      badgeText = `${freePercentage.toFixed(1)}% free`
      usedPercentText = `${usedPercentage.toFixed(1)}%`
      freePercentText = `${freePercentage.toFixed(1)}%`
    }
  }

  const progressBarValue = Math.max(
    safeUsedBytes > 0 ? 1 : 0,
    Math.min(100, Math.round(usedPercentage * 10) / 10)
  )

  const itemsLabel = isText
    ? itemsCount === 1
      ? "note"
      : "notes"
    : itemsCount === 1
      ? "file"
      : "files"

  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={120}
        closeDelay={180}
        className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 hover:bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Info className="size-3 text-primary shrink-0" />
        <span className="font-mono text-[11px] font-medium text-foreground">
          {badgeText}
        </span>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-80 space-y-3.5 p-4"
      >
        <div className="flex items-center justify-between gap-2 border-b pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              {isText ? (
                <Database className="size-4" />
              ) : (
                <HardDrive className="size-4" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground leading-none">
                {isText ? "Database Storage" : "Media Storage"}
              </h4>
              <p className="mt-1 text-[11px] text-muted-foreground leading-none">
                {isText ? "PostgreSQL Text Storage" : "Bucket File Storage"}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono h-5">
            {quotaFormatted} Quota
          </Badge>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">Used Storage</span>
            <span className="font-medium text-foreground text-[11px] font-mono">
              {usedPercentText} used
            </span>
          </div>
          <Progress value={progressBarValue} className="h-2 w-full" />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
            <span>{usedFormatted} used</span>
            <span className="font-medium text-foreground">{freeFormatted} free</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-md border bg-muted/30 p-2 text-center">
            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
              Used
            </span>
            <span className="block text-xs font-bold text-foreground font-mono mt-0.5">
              {usedFormatted}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              {itemsCount} {itemsLabel}
            </span>
          </div>
          <div className="rounded-md border bg-muted/30 p-2 text-center">
            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
              Remaining
            </span>
            <span className="block text-xs font-bold text-primary font-mono mt-0.5">
              {freeFormatted}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              {freePercentText} free
            </span>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground border-t pt-2.5">
          {isText
            ? "Supabase provides 500 MB database quota for text notes. Deleting text notes frees space instantly."
            : "Supabase provides 1 GB free bucket storage for uploaded files. Deleting files frees space instantly."}
        </p>
      </PopoverContent>
    </Popover>
  )
}
