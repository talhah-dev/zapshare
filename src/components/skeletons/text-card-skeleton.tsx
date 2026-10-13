import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TextCardSkeleton() {
  return (
    <Card className="border shadow-xs">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-sm" />
            <Skeleton className="h-4 w-14 rounded-sm" />
          </div>

          <div className="flex items-center gap-1">
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="size-7 rounded-md" />
          </div>
        </div>

        <div className="rounded-md bg-muted/30 p-3 space-y-2">
          <Skeleton className="h-3.5 w-full rounded-sm" />
          <Skeleton className="h-3.5 w-5/6 rounded-sm" />
          <Skeleton className="h-3.5 w-2/5 rounded-sm" />
        </div>

        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3.5 w-16 rounded-sm" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
