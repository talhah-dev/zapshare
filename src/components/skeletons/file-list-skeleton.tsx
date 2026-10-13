import { FileCardSkeleton } from "@/components/skeletons/file-card-skeleton"

export function FileListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FileCardSkeleton />
      <FileCardSkeleton />
      <FileCardSkeleton />
      <FileCardSkeleton />
    </div>
  )
}
