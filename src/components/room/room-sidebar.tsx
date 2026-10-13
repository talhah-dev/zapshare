"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRoom } from "@/components/providers/room-provider"
import {
  Globe,
  Lock,
  Sparkles,
  ArrowRight,
  Share2,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Hash,
} from "lucide-react"
import { toast } from "sonner"

export function RoomSidebar() {
  const {
    roomCode,
    isPrivate,
    savedRooms,
    setRoom,
    leaveRoom,
    createRoom,
    removeSavedRoom,
  } = useRoom()

  const [inputCode, setInputCode] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
  }

  const handleGenerate = () => {
    const newCode = createRoom()
    setInputCode("")
    toast.success(`Created & joined private room #${newCode}`)
  }

  const handleCopyLink = async (code: string) => {
    try {
      const url = new URL(window.location.origin)
      url.searchParams.set("room", code)
      await navigator.clipboard.writeText(url.toString())
      setCopiedCode(code)
      toast.success(`Copied invite link for room #${code.toUpperCase()}`)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight">
                Rooms & Spaces
              </CardTitle>
              <CardDescription className="text-[11px] leading-tight">
                Private rooms isolate all notes & files
              </CardDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="lg:hidden h-7 w-7 p-0"
            aria-label="Toggle rooms sidebar"
          >
            {isMobileOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className={`p-4 pt-0 space-y-4 ${isMobileOpen ? "block" : "hidden lg:block"}`}>
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Default Space
          </span>

          <button
            type="button"
            onClick={leaveRoom}
            className={`w-full text-left rounded-lg border p-2.5 transition-all cursor-pointer flex items-center justify-between ${
              !isPrivate
                ? "border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/15 text-foreground ring-1 ring-emerald-500/20"
                : "border-border/70 hover:border-foreground/30 hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-md ${
                  !isPrivate ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                }`}
              >
                <Globe className="size-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">
                  Public Space
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  Visible to everyone
                </div>
              </div>
            </div>

            {!isPrivate && (
              <Badge
                variant="outline"
                className="h-5 px-1.5 text-[10px] gap-1 border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 font-medium"
              >
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </Badge>
            )}
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
              <Lock className="size-3" />
              <span>Private Rooms</span>
            </span>
            {savedRooms.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-[10px] font-mono">
                {savedRooms.length}
              </Badge>
            )}
          </div>

          {savedRooms.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/80 p-3 text-center space-y-1">
              <p className="text-[11px] font-medium text-foreground">
                No rooms joined yet
              </p>
              <p className="text-[10px] text-muted-foreground">
                Generate a 6-digit room or enter a code below to start.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
              {savedRooms.map((code, idx) => {
                const isActive = isPrivate && roomCode === code

                return (
                  <div
                    key={code}
                    className={`group flex items-center justify-between rounded-lg border p-2 transition-all ${
                      isActive
                        ? "border-primary/50 bg-primary/10 text-foreground ring-1 ring-primary/20"
                        : "border-border/70 hover:border-foreground/30 hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setRoom(code)}
                      className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <div
                        className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Hash className="size-3" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <span>Room {idx + 1}</span>
                          <span className="font-mono text-[11px] font-bold text-primary uppercase">
                            #{code}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {isActive ? "Currently viewing" : "Click to enter"}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      {isActive ? (
                        <Badge
                          variant="default"
                          className="h-5 px-1.5 text-[9px] gap-1 font-mono uppercase shrink-0"
                        >
                          <Lock className="size-2.5" />
                          Active
                        </Badge>
                      ) : null}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(code)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        title="Copy invite link"
                      >
                        {copiedCode === code ? (
                          <Check className="size-3 text-emerald-500" />
                        ) : (
                          <Share2 className="size-3" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeSavedRoom(code)
                          toast.info(`Removed room #${code.toUpperCase()} from your list`)
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-80 group-hover:opacity-100"
                        title="Remove from saved rooms"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t">
          <form onSubmit={handleJoin} className="space-y-1.5">
            <label className="text-[11px] font-medium text-foreground block">
              Join Private Room
            </label>
            <div className="flex gap-1.5">
              <Input
                type="text"
                placeholder="Enter 6-digit code or name..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="h-8 text-xs font-mono"
              />
              <Button type="submit" size="sm" className="h-8 px-2.5 text-xs gap-1 shrink-0">
                <span>Join</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </form>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            className="w-full h-8 text-xs gap-1.5 border-dashed hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Generate 6-Digit Room</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
