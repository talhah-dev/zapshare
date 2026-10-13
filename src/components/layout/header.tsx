"use client"

import { Zap } from "lucide-react"
import { SessionInfoDialog } from "@/components/layout/session-info-dialog"
import { ModeToggle } from "@/components/layout/mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Zap className="size-4.5 fill-primary-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-foreground">
              ZapShare
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <SessionInfoDialog />
        </div>
      </div>
    </header>
  )
}
