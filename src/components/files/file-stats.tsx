import { SharedFileItem } from "@/types/share"
import { formatFileSize } from "@/lib/formatters"
import { HardDrive } from "lucide-react"

interface FileStatsProps {
  files: SharedFileItem[]
}

export function FileStats({ files }: FileStatsProps) {
  const totalBytes = files.reduce((acc, f) => acc + f.size, 0)
  const formattedTotal = formatFileSize(totalBytes)

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3.5 py-2 text-xs text-muted-foreground">
      <HardDrive className="size-3.5 text-primary" />
      <span className="font-medium text-foreground">
        {files.length} {files.length === 1 ? "file" : "files"} ({formattedTotal})
      </span>
    </div>
  )
}
