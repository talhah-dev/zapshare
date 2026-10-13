import { FileCategory } from "@/types/share"

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function detectFileCategory(fileName: string, mimeType?: string): FileCategory {
  const ext = fileName.split(".").pop()?.toLowerCase() || ""

  if (
    mimeType?.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(ext)
  ) {
    return "image"
  }

  if (
    mimeType?.startsWith("video/") ||
    ["mp4", "webm", "mov", "mkv", "avi"].includes(ext)
  ) {
    return "video"
  }

  if (
    mimeType?.startsWith("audio/") ||
    ["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(ext)
  ) {
    return "audio"
  }

  if (
    mimeType?.includes("pdf") ||
    mimeType?.includes("word") ||
    mimeType?.includes("document") ||
    ["pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx", "ppt", "pptx", "csv"].includes(ext)
  ) {
    return "document"
  }

  if (
    ["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext) ||
    mimeType?.includes("zip") ||
    mimeType?.includes("tar")
  ) {
    return "archive"
  }

  if (
    [
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "css",
      "json",
      "py",
      "java",
      "c",
      "cpp",
      "go",
      "rs",
      "php",
      "sh",
      "sql",
      "yml",
      "yaml",
      "xml",
    ].includes(ext)
  ) {
    return "code"
  }

  return "other"
}

export function formatTimeAgo(isoDate: string): string {
  const now = new Date()
  const past = new Date(isoDate)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 30) return "Just now"
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
