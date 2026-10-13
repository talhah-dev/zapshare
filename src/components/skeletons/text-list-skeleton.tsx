import { TextCardSkeleton } from "@/components/skeletons/text-card-skeleton"

export function TextListSkeleton() {
  return (
    <div className="grid gap-3">
      <TextCardSkeleton />
      <TextCardSkeleton />
      <TextCardSkeleton />
    </div>
  )
}
