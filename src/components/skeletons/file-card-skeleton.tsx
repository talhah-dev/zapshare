import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FileCardSkeleton() {
  return (
    <Card className="border shadow-xs">
      <CardContent className="p-4">
        <div className="flex items-start gap-3.5">
          <Skeleton className="size-12 shrink-0 rounded-lg" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-3/5 rounded-sm" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-14 rounded-sm" />
              <Skeleton className="h-3 w-16 rounded-sm" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-2.5">
          <Skeleton className="h-7 w-20 rounded-md" />

          <div className="flex items-center gap-1.5">
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
