import { TextMessageItem, SharedFileItem } from "@/types/share"

export const INITIAL_TEXT_MESSAGES: TextMessageItem[] = [
  {
    id: "text-1",
    content: "Project Access Credentials:\nhttps://zapshare.app/shared/workspace-7749\nSecret token: zapshare_live_sec_8921a4",
    createdAt: "2026-10-12T18:50:00.000Z",
    charCount: 96,
    wordCount: 7,
    isPinned: true,
  },
  {
    id: "text-2",
    content: "Quick Docs: https://github.com/developer/project-docs\nRemember to test the instant file download before merging the PR.",
    createdAt: "2026-10-12T18:25:00.000Z",
    charCount: 118,
    wordCount: 14,
  },
  {
    id: "text-3",
    content: "Design & Launch checklist:\n- Minimalist frontend with shadcn/ui components\n- Instant cross-device copy to clipboard\n- Universal upload/download from any browser or phone",
    createdAt: "2026-10-12T17:10:00.000Z",
    charCount: 177,
    wordCount: 22,
  },
]

export const INITIAL_FILES: SharedFileItem[] = [
  {
    id: "file-1",
    name: "project-design-spec.pdf",
    size: 2450000,
    formattedSize: "2.3 MB",
    type: "application/pdf",
    category: "document",
    createdAt: "2026-10-12T18:40:00.000Z",
  },
  {
    id: "file-2",
    name: "screenshot-dashboard-preview.png",
    size: 1140000,
    formattedSize: "1.1 MB",
    type: "image/png",
    category: "image",
    createdAt: "2026-10-12T18:15:00.000Z",
  },
  {
    id: "file-3",
    name: "source-code-bundle.zip",
    size: 5820000,
    formattedSize: "5.5 MB",
    type: "application/zip",
    category: "archive",
    createdAt: "2026-10-12T16:00:00.000Z",
  },
]
