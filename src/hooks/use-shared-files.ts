"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { SharedFileItem } from "@/types/share"
import { INITIAL_FILES } from "@/lib/mock-data"
import {
  getSharedFiles,
  removeSharedFile,
  clearAllSharedFileRecords,
} from "@/lib/file-service"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { useRoom } from "@/components/providers/room-provider"
import { toast } from "sonner"

export function useSharedFiles(roomCodeParam?: string) {
  const queryClient = useQueryClient()
  const roomContext = useRoom()
  const roomCode = (roomCodeParam || roomContext.roomCode || "public").trim().toLowerCase()

  const query = useQuery({
    queryKey: ["shared-files", roomCode],
    queryFn: async () => {
      const result = await getSharedFiles(roomCode)
      if (result.error) {
        toast.error(
          "Database table 'shared_files' not found. Please run schema.sql in Supabase SQL Editor."
        )
        throw new Error(result.error)
      }
      return result.files
    },
    initialData:
      isSupabaseConfigured || roomCode !== "public"
        ? undefined
        : INITIAL_FILES,
  })

  useEffect(() => {
    const client = supabase
    if (!client) return

    const channelId = `shared-files-${roomCode}-${Math.random().toString(36).slice(2, 9)}`
    const channel = client
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shared_files" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["shared-files", roomCode] })
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [queryClient, roomCode])

  const addUploadedFiles = (newFiles: SharedFileItem[]) => {
    queryClient.setQueryData<SharedFileItem[]>(
      ["shared-files", roomCode],
      (prev = []) => {
        const filteredNew = newFiles.filter(
          (nf) => !prev.some((pf) => pf.id === nf.id)
        )
        return [...filteredNew, ...prev]
      }
    )
  }

  const deleteMutation = useMutation({
    mutationFn: ({
      id,
      storagePath,
    }: {
      id: string
      storagePath?: string
    }) => removeSharedFile(id, storagePath),
    onSuccess: (_, { id }) => {
      queryClient.setQueryData<SharedFileItem[]>(
        ["shared-files", roomCode],
        (prev = []) => prev.filter((file) => file.id !== id)
      )
      toast.info("File removed")
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to remove file"
      toast.error(msg)
    },
  })

  const clearAllMutation = useMutation({
    mutationFn: () => clearAllSharedFileRecords(roomCode),
    onSuccess: () => {
      queryClient.setQueryData<SharedFileItem[]>(["shared-files", roomCode], [])
      toast.info("All shared files cleared")
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to clear files"
      toast.error(msg)
    },
  })

  return {
    files: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    addUploadedFiles,
    deleteFile: (id: string, storagePath?: string) =>
      deleteMutation.mutateAsync({ id, storagePath }),
    clearAll: clearAllMutation.mutateAsync,
  }
}
