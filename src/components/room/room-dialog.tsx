"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRoom } from "@/components/providers/room-provider"
import {
  Globe,
  Lock,
  Copy,
  Check,
  Share2,
  Sparkles,
  ArrowRight,
  LogOut,
  Hash,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

interface RoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomDialog({ open, onOpenChange }: RoomDialogProps) {
  const {
    roomCode,
    isPrivate,
    savedRooms,
    setRoom,
    leaveRoom,
    createRoom,
    removeSavedRoom,
    getShareableLink,
  } = useRoom()
  const [inputCode, setInputCode] = useState("")
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = inputCode.trim().toLowerCase()
    if (!clean) {
      toast.error("Please enter a room code")
      return
    }
    setRoom(clean)
    setInputCode("")
    toast.success(`Joined room #${clean.toUpperCase()}`)
    onOpenChange(false)
  }

  const handleCreateRandom = () => {
    const newCode = createRoom()
    setInputCode("")
    toast.success(`Created private room #${newCode}`)
    onOpenChange(false)
  }

  const handleLeave = () => {
    leaveRoom()
    toast.info("Returned to Public Space")
    onOpenChange(false)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode.toUpperCase())
      setCopiedCode(true)
      toast.success("Room code copied to clipboard")
      setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      toast.error("Failed to copy room code")
    }
  }

  const handleCopyLink = async () => {
    try {
      const link = getShareableLink()
      await navigator.clipboard.writeText(link)
      setCopiedLink(true)
      toast.success("Room invite link copied to clipboard")
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {isPrivate ? <Lock className="size-4" /> : <Globe className="size-4" />}
            </div>
            <div>
              <DialogTitle className="text-base">Private Room Codes</DialogTitle>
              <DialogDescription className="text-xs">
                Isolate your shared notes and files into a private, temporary space.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-lg border bg-muted/40 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Current Location
              </span>
              {isPrivate ? (
                <Badge variant="default" className="text-[10px] gap-1 font-mono uppercase">
                  <Lock className="size-2.5" />
                  Private Room
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Globe className="size-2.5" />
                  Public Space
                </Badge>
              )}
            </div>

            {isPrivate ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                  <div className="font-mono text-base font-bold tracking-wider text-primary uppercase">
                    #{roomCode}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyCode}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      {copiedCode ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>Copy Code</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      {copiedLink ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Share2 className="size-3" />
                      )}
                      <span>Copy Link</span>
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Anyone with this 6-digit code or link can see and share files in this room.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are currently in the <strong>Public Space</strong>. Any text or files you share are visible to anyone visiting ZapShare without a room code.
              </p>
            )}
          </div>

          {savedRooms.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Saved Rooms
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {savedRooms.map((code, idx) => {
                  const isActive = isPrivate && roomCode === code
                  return (
                    <div
                      key={code}
                      className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setRoom(code)
                          onOpenChange(false)
                        }}
                        className="flex items-center gap-1 cursor-pointer font-mono"
                      >
                        <Hash className="size-3" />
                        <span>Room {idx + 1} (#{code})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSavedRoom(code)}
                        className="text-muted-foreground hover:text-destructive p-0.5 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="size-2.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Enter Room Code to Join
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter 6-digit code or name..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="h-9 text-xs font-mono"
              />
              <Button type="submit" size="sm" className="h-9 text-xs gap-1.5 shrink-0">
                <span>Join</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </form>

          <div className="flex flex-col gap-2 pt-1 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreateRandom}
              className="w-full text-xs gap-1.5 border-dashed hover:border-primary hover:bg-primary/5 cursor-pointer"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span>Generate 6-Digit Private Room</span>
            </Button>

            {isPrivate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLeave}
                className="w-full text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>Leave Room & Return to Public Space</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
