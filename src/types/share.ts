export interface TextMessageItem {
  id: string
  content: string
  createdAt: string
  charCount: number
  wordCount: number
  isPinned?: boolean
}

export type FileCategory =
  | "image"
  | "document"
  | "archive"
  | "video"
  | "audio"
  | "code"
  | "other"

export interface SharedFileItem {
  id: string
  name: string
  size: number
  formattedSize: string
  type: string
  category: FileCategory
  createdAt: string
  previewUrl?: string
  blob?: Blob
  storagePath?: string
  publicUrl?: string
}
