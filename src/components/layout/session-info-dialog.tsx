"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, Zap, Globe, ShieldCheck } from "lucide-react"

export function SessionInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Info className="size-3.5 text-muted-foreground" />
            <span>How It Works</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="size-5 text-primary fill-primary" />
            <span>How ZapShare Works</span>
          </DialogTitle>
          <DialogDescription>
            Instant, friction-free text and file sharing accessible from anywhere, on any device.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Access Mode</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Globe className="size-3.5" />
                Global / Anywhere
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Authentication</span>
              <Badge variant="secondary" className="text-[11px]">
                No Login Required
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              3 Simple Steps
            </h4>

            <div className="grid gap-2.5 text-xs">
              <div className="flex items-start gap-3 rounded-md border p-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium">Upload or Write</p>
                  <p className="text-muted-foreground">
                    Type notes, paste links, or upload any file type (images, PDFs, ZIPs, etc.).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-md border p-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium">Access from Anywhere</p>
                  <p className="text-muted-foreground">
                    Open ZapShare from your mobile, laptop, tablet, or another computer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-md border p-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  3
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium">Instant 1-Click Copy & Download</p>
                  <p className="text-muted-foreground">
                    Copy text snippets directly to clipboard or download files with one click.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border/80 bg-background p-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Fast, anonymous, and designed for quick cross-device transfers without friction.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
