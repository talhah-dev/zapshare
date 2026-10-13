"use client"

import { useSyncExternalStore } from "react"
import { formatTimeAgo } from "@/lib/formatters"

let listeners: (() => void)[] = []
let intervalId: ReturnType<typeof setInterval> | null = null

function subscribe(callback: () => void) {
  listeners.push(callback)
  if (listeners.length === 1 && typeof window !== "undefined") {
    intervalId = setInterval(() => {
      listeners.forEach((l) => l())
    }, 15000)
  }
  return () => {
    listeners = listeners.filter((l) => l !== callback)
    if (listeners.length === 0 && intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}

export function useTimeAgo(isoDate: string): string {
  return useSyncExternalStore(
    subscribe,
    () => formatTimeAgo(isoDate),
    () => "Recently"
  )
}
