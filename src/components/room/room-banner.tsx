"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRoom } from "@/components/providers/room-provider"
import { Lock, Share2, Check, LogOut } from "lucide-react"
import { toast } from "sonner"

export function RoomBanner() {
  const { roomCode, isPrivate, leaveRoom, getShareableLink } = useRoom()
  const [copied, setCopied] = useState(false)

  if (!isPrivate) {
    return null
  }

  const handleCopyLink = async () => {
    try {
      const link = getShareableLink()
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast.success("Private room link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary shadow-2xs">
      <div className="flex items-center gap-2">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Lock className="size-3.5 text-primary" />
        </div>
        <div>
          <span className="font-semibold">Private Room:</span>{" "}
          <span className="font-mono font-bold uppercase tracking-wide">
            #{roomCode}
          </span>
          <span className="hidden sm:inline text-muted-foreground ml-1.5">
            — Only people with this code or link can see these items.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="h-7 px-2.5 text-xs gap-1"
        >
          {copied ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <Share2 className="size-3" />
          )}
          <span>Copy Invite Link</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={leaveRoom}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          title="Return to Public Space"
        >
          <LogOut className="size-3 mr-1" />
          <span>Exit</span>
        </Button>
      </div>
    </div>
  )
}
