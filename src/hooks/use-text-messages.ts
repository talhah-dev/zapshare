"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { TextMessageItem } from "@/types/share"
import { INITIAL_TEXT_MESSAGES } from "@/lib/mock-data"
import {
  getTextMessages,
  addTextMessage,
  removeTextMessage,
  updateTextMessagePin,
  clearAllTextMessageRecords,
} from "@/lib/text-service"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { toast } from "sonner"

export function useTextMessages() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["text-messages"],
    queryFn: async () => {
      const result = await getTextMessages()
      if (result.error) {
        toast.error(
          "Database table 'text_messages' not found. Please run schema.sql in Supabase SQL Editor."
        )
        throw new Error(result.error)
      }
      return result.items
    },
    initialData: isSupabaseConfigured ? undefined : INITIAL_TEXT_MESSAGES,
  })

  useEffect(() => {
    const client = supabase
    if (!client) return

    const channelId = `text-messages-${Math.random().toString(36).slice(2, 9)}`
    const channel = client
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "text_messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["text-messages"] })
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [queryClient])

  const addMutation = useMutation({
    mutationFn: addTextMessage,
    onSuccess: (newItem) => {
      queryClient.setQueryData<TextMessageItem[]>(
        ["text-messages"],
        (prev = []) => {
          const exists = prev.some((item) => item.id === newItem.id)
          return exists ? prev : [newItem, ...prev]
        }
      )
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to save text"
      toast.error(`Database error: ${msg}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: removeTextMessage,
    onSuccess: (_, id) => {
      queryClient.setQueryData<TextMessageItem[]>(
        ["text-messages"],
        (prev = []) => prev.filter((item) => item.id !== id)
      )
      toast.info("Text note deleted")
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to delete"
      toast.error(msg)
    },
  })

  const togglePinMutation = useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      updateTextMessagePin(id, isPinned),
    onSuccess: (_, { id, isPinned }) => {
      queryClient.setQueryData<TextMessageItem[]>(
        ["text-messages"],
        (prev = []) =>
          prev.map((item) => (item.id === id ? { ...item, isPinned } : item))
      )
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update pin"
      toast.error(msg)
    },
  })

  const clearAllMutation = useMutation({
    mutationFn: clearAllTextMessageRecords,
    onSuccess: () => {
      queryClient.setQueryData<TextMessageItem[]>(["text-messages"], [])
      toast.info("All text notes cleared")
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to clear notes"
      toast.error(msg)
    },
  })

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    addMessage: addMutation.mutateAsync,
    deleteMessage: deleteMutation.mutateAsync,
    togglePin: (id: string) => {
      const target = (query.data ?? []).find((item) => item.id === id)
      if (target) {
        return togglePinMutation.mutateAsync({
          id,
          isPinned: !target.isPinned,
        })
      }
    },
    clearAll: clearAllMutation.mutateAsync,
  }
}
