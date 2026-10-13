import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/20 py-6 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">ZapShare</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1">
            <Shield className="size-3 text-muted-foreground" />
            No accounts required
          </span>
        </div>
      </div>
    </footer>
  )
}
