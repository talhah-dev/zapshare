"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRoom } from "@/components/providers/room-provider"
import { RoomDialog } from "@/components/room/room-dialog"
import { Globe, Lock } from "lucide-react"

export function RoomBadge() {
  const { roomCode, isPrivate } = useRoom()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className={`h-8 gap-1.5 px-2.5 text-xs transition-colors cursor-pointer ${
          isPrivate
            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title={isPrivate ? `Private Room: ${roomCode.toUpperCase()}` : "Public Space"}
      >
        {isPrivate ? (
          <>
            <Lock className="size-3.5 shrink-0" />
            <span className="font-mono font-medium uppercase">#{roomCode}</span>
          </>
        ) : (
          <>
            <Globe className="size-3.5 text-emerald-500 shrink-0" />
            <span className="hidden sm:inline">Public Space</span>
            <span className="sm:hidden">Public</span>
          </>
        )}
      </Button>

      <RoomDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
