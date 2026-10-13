"use client"

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react"

interface RoomContextType {
  roomCode: string
  isPrivate: boolean
  savedRooms: string[]
  setRoom: (code: string) => void
  leaveRoom: () => void
  createRoom: () => string
  removeSavedRoom: (code: string) => void
  getShareableLink: () => string
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

interface StoreState {
  roomCode: string
  savedRooms: string[]
}

const storeState: StoreState = {
  roomCode: "public",
  savedRooms: [],
}

const listeners = new Set<() => void>()

if (typeof window !== "undefined") {
  const urlParams = new URLSearchParams(window.location.search)
  const urlRoom = urlParams.get("room")?.trim().toLowerCase()
  const savedListRaw = localStorage.getItem("zapshare_saved_rooms")
  let parsedSaved: string[] = []

  try {
    if (savedListRaw) {
      parsedSaved = JSON.parse(savedListRaw)
    }
  } catch {
    parsedSaved = []
  }

  if (urlRoom) {
    storeState.roomCode = urlRoom
    localStorage.setItem("zapshare_room", urlRoom)
    if (urlRoom !== "public" && !parsedSaved.includes(urlRoom)) {
      parsedSaved.unshift(urlRoom)
      localStorage.setItem("zapshare_saved_rooms", JSON.stringify(parsedSaved))
    }
  } else {
    const saved = localStorage.getItem("zapshare_room")?.trim().toLowerCase()
    if (saved) {
      storeState.roomCode = saved
      if (saved !== "public") {
        const nextUrl = new URL(window.location.href)
        nextUrl.searchParams.set("room", saved)
        window.history.replaceState(null, "", nextUrl.toString())
      }
    }
  }

  storeState.savedRooms = parsedSaved

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search)
    storeState.roomCode = params.get("room")?.trim().toLowerCase() || "public"
    listeners.forEach((listener) => listener())
  })
}

function notify() {
  listeners.forEach((listener) => listener())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function getSnapshot() {
  return storeState
}

const serverSnapshot: StoreState = {
  roomCode: "public",
  savedRooms: [],
}

function getServerSnapshot() {
  return serverSnapshot
}

export function RoomProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setRoom = useCallback((code: string) => {
    const clean = code.trim().toLowerCase() || "public"
    storeState.roomCode = clean

    if (typeof window !== "undefined") {
      localStorage.setItem("zapshare_room", clean)
      const nextUrl = new URL(window.location.href)

      if (clean === "public") {
        nextUrl.searchParams.delete("room")
      } else {
        nextUrl.searchParams.set("room", clean)
        let updatedSaved = [...storeState.savedRooms]
        if (!updatedSaved.includes(clean)) {
          updatedSaved = [clean, ...updatedSaved].slice(0, 10)
          storeState.savedRooms = updatedSaved
          localStorage.setItem(
            "zapshare_saved_rooms",
            JSON.stringify(updatedSaved)
          )
        }
      }

      window.history.replaceState(null, "", nextUrl.toString())
    }

    notify()
  }, [])

  const leaveRoom = useCallback(() => {
    setRoom("public")
  }, [setRoom])

  const createRoom = useCallback(() => {
    const sixDigitCode = Math.floor(100000 + Math.random() * 900000).toString()
    setRoom(sixDigitCode)
    return sixDigitCode
  }, [setRoom])

  const removeSavedRoom = useCallback(
    (code: string) => {
      const target = code.trim().toLowerCase()
      const filtered = storeState.savedRooms.filter((r) => r !== target)
      storeState.savedRooms = filtered

      if (typeof window !== "undefined") {
        localStorage.setItem("zapshare_saved_rooms", JSON.stringify(filtered))
        if (storeState.roomCode === target) {
          setRoom("public")
          return
        }
      }

      notify()
    },
    [setRoom]
  )

  const getShareableLink = useCallback(() => {
    if (typeof window === "undefined") return ""
    const url = new URL(window.location.origin)
    if (state.roomCode !== "public") {
      url.searchParams.set("room", state.roomCode)
    }
    return url.toString()
  }, [state.roomCode])

  return (
    <RoomContext.Provider
      value={{
        roomCode: state.roomCode,
        isPrivate: state.roomCode !== "public",
        savedRooms: state.savedRooms,
        setRoom,
        leaveRoom,
        createRoom,
        removeSavedRoom,
        getShareableLink,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider")
  }
  return context
}
