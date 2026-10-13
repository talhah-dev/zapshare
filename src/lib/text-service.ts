import { supabase } from "@/lib/supabase"
import { TextMessageItem } from "@/types/share"

export interface FetchTextMessagesResult {
  items: TextMessageItem[]
  error?: string
}

export async function getTextMessages(): Promise<FetchTextMessagesResult> {
  if (!supabase) {
    return { items: [] }
  }

  const { data, error } = await supabase
    .from("text_messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return { items: [], error: error.message }
  }

  if (!data) {
    return { items: [] }
  }

  return {
    items: data.map((item) => ({
      id: item.id,
      content: item.content,
      createdAt: item.created_at,
      charCount: item.char_count,
      wordCount: item.word_count,
      isPinned: item.is_pinned,
    })),
  }
}

export async function addTextMessage(content: string): Promise<TextMessageItem> {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your .env.local file.")
  }

  const { data, error } = await supabase
    .from("text_messages")
    .insert([
      {
        content,
        char_count: charCount,
        word_count: wordCount,
        is_pinned: false,
      },
    ])
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message || "Failed to insert text message into database.")
  }

  return {
    id: data.id,
    content: data.content,
    createdAt: data.created_at,
    charCount: data.char_count,
    wordCount: data.word_count,
    isPinned: data.is_pinned,
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

export async function clearAllTextMessageRecords(): Promise<boolean> {
  if (!supabase) {
    return true
  }

  const { error } = await supabase
    .from("text_messages")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")

  if (error) {
    throw new Error(error.message)
  }
  return true
}
