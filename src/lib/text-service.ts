import { supabase } from "@/lib/supabase"
import { TextMessageItem } from "@/types/share"

export interface FetchTextMessagesResult {
  items: TextMessageItem[]
  error?: string
}

function isRoomCodeError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const err = error as { message?: string; code?: string }
  const msg = (err.message || "").toLowerCase()
  return msg.includes("room_code") || msg.includes("column") || err.code === "42703" || err.code === "PGRST204"
}

export async function getTextMessages(roomCode: string = "public"): Promise<FetchTextMessagesResult> {
  if (!supabase) {
    return { items: [] }
  }

  const normalized = roomCode.trim().toLowerCase() || "public"

  let { data, error } = await supabase
    .from("text_messages")
    .select("*")
    .eq("room_code", normalized)
    .order("created_at", { ascending: false })

  if (error && isRoomCodeError(error)) {
    const fallback = await supabase
      .from("text_messages")
      .select("*")
      .order("created_at", { ascending: false })
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    return { items: [], error: error.message }
  }

  if (!data) {
    return { items: [] }
  }

  const filtered = data.filter((item) => {
    const itemRoom = (item.room_code || "").trim().toLowerCase()
    const content = item.content || ""
    if (normalized === "public") {
      return (!itemRoom || itemRoom === "public") && !content.startsWith("[zap_room:")
    }
    return itemRoom === normalized || content.startsWith(`[zap_room:${normalized}]`)
  })

  return {
    items: filtered.map((item) => ({
      id: item.id,
      content: item.content.replace(new RegExp(`^\\[zap_room:${normalized}\\]`), ""),
      createdAt: item.created_at,
      charCount: item.char_count,
      wordCount: item.word_count,
      isPinned: item.is_pinned,
      roomCode: item.room_code || normalized,
    })),
  }
}

export async function addTextMessage(
  content: string,
  roomCode: string = "public"
): Promise<TextMessageItem> {
  const normalized = roomCode.trim().toLowerCase() || "public"
  const storedContent =
    normalized !== "public" ? `[zap_room:${normalized}]${content}` : content
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your .env.local file.")
  }

  let { data, error } = await supabase
    .from("text_messages")
    .insert([
      {
        content: storedContent,
        char_count: charCount,
        word_count: wordCount,
        is_pinned: false,
        room_code: normalized,
      },
    ])
    .select()
    .single()

  if (error && isRoomCodeError(error)) {
    const fallback = await supabase
      .from("text_messages")
      .insert([
        {
          content: storedContent,
          char_count: charCount,
          word_count: wordCount,
          is_pinned: false,
        },
      ])
      .select()
      .single()
    data = fallback.data
    error = fallback.error
  }

  if (error || !data) {
    throw new Error(error?.message || "Failed to insert text message into database.")
  }

  return {
    id: data.id,
    content,
    createdAt: data.created_at,
    charCount: data.char_count,
    wordCount: data.word_count,
    isPinned: data.is_pinned,
    roomCode: data.room_code || normalized,
  }
}

export async function removeTextMessage(id: string): Promise<boolean> {
  if (!supabase) {
    return true
  }

  const { error } = await supabase.from("text_messages").delete().eq("id", id)
  if (error) {
    throw new Error(error.message)
  }
  return true
}

export async function updateTextMessagePin(id: string, isPinned: boolean): Promise<boolean> {
  if (!supabase) {
    return true
  }

  const { error } = await supabase
    .from("text_messages")
    .update({ is_pinned: isPinned })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
  return true
}

export async function clearAllTextMessageRecords(
  roomCode: string = "public"
): Promise<boolean> {
  if (!supabase) {
    return true
  }

  const normalized = roomCode.trim().toLowerCase() || "public"

  const { error } = await supabase
    .from("text_messages")
    .delete()
    .eq("room_code", normalized)

  if (error && isRoomCodeError(error)) {
    const { data: allMessages } = await supabase
      .from("text_messages")
      .select("id, content")

    if (allMessages) {
      const idsToDelete = allMessages
        .filter((item) => {
          if (normalized === "public") {
            return !item.content.startsWith("[zap_room:")
          }
          return item.content.startsWith(`[zap_room:${normalized}]`)
        })
        .map((item) => item.id)

      if (idsToDelete.length > 0) {
        await supabase.from("text_messages").delete().in("id", idsToDelete)
      }
    }
    return true
  }

  if (error) {
    throw new Error(error.message)
  }
  return true
}
