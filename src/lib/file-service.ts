import { supabase } from "@/lib/supabase"
import { SharedFileItem } from "@/types/share"
import { detectFileCategory, formatFileSize } from "@/lib/formatters"

export interface FetchSharedFilesResult {
  files: SharedFileItem[]
  error?: string
}

function isRoomCodeError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const err = error as { message?: string; code?: string }
  const msg = (err.message || "").toLowerCase()
  return msg.includes("room_code") || msg.includes("column") || err.code === "42703" || err.code === "PGRST204"
}

export async function getSharedFiles(roomCode: string = "public"): Promise<FetchSharedFilesResult> {
  if (!supabase) {
    return { files: [] }
  }

  const normalized = roomCode.trim().toLowerCase() || "public"

  let { data, error } = await supabase
    .from("shared_files")
    .select("*")
    .eq("room_code", normalized)
    .order("created_at", { ascending: false })

  if (error && isRoomCodeError(error)) {
    const fallback = await supabase
      .from("shared_files")
      .select("*")
      .order("created_at", { ascending: false })
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    return { files: [], error: error.message }
  }

  if (!data) {
    return { files: [] }
  }

  const filtered = data.filter((item) => {
    const itemRoom = (item.room_code || "").trim().toLowerCase()
    const path = item.storage_path || ""
    if (normalized === "public") {
      return (!itemRoom || itemRoom === "public") && !path.startsWith("rooms_")
    }
    return itemRoom === normalized || path.startsWith(`rooms_${normalized}_`)
  })

  return {
    files: filtered.map((item) => ({
      id: item.id,
      name: item.name,
      size: Number(item.size),
      formattedSize: item.formatted_size,
      type: item.type,
      category: item.category,
      createdAt: item.created_at,
      storagePath: item.storage_path,
      publicUrl: item.public_url,
      previewUrl: item.category === "image" ? item.public_url : undefined,
      roomCode: item.room_code || normalized,
    })),
  }
}

export async function uploadFileToStorage(
  file: File,
  roomCode: string = "public"
): Promise<SharedFileItem> {
  const category = detectFileCategory(file.name, file.type)
  const formattedSize = formatFileSize(file.size)
  const normalized = roomCode.trim().toLowerCase() || "public"

  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your .env.local file.")
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const storagePath =
    normalized !== "public"
      ? `rooms_${normalized}_${Date.now()}-${sanitizedName}`
      : `${Date.now()}-${sanitizedName}`

  const { error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Upload error: ${uploadError.message}`)
  }

  const { data: urlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(storagePath)

  const publicUrl = urlData.publicUrl

  let { data, error: insertError } = await supabase
    .from("shared_files")
    .insert([
      {
        name: file.name,
        size: file.size,
        formatted_size: formattedSize,
        type: file.type || "application/octet-stream",
        category,
        storage_path: storagePath,
        public_url: publicUrl,
        room_code: normalized,
      },
    ])
    .select()
    .single()

  if (insertError && isRoomCodeError(insertError)) {
    const fallback = await supabase
      .from("shared_files")
      .insert([
        {
          name: file.name,
          size: file.size,
          formatted_size: formattedSize,
          type: file.type || "application/octet-stream",
          category,
          storage_path: storagePath,
          public_url: publicUrl,
        },
      ])
      .select()
      .single()
    data = fallback.data
    insertError = fallback.error
  }

  if (insertError || !data) {
    throw new Error(`Database error: ${insertError?.message || "Failed to save file metadata."}`)
  }

  return {
    id: data.id,
    name: data.name,
    size: Number(data.size),
    formattedSize: data.formatted_size,
    type: data.type,
    category: data.category,
    createdAt: data.created_at,
    storagePath: data.storage_path,
    publicUrl: data.public_url,
    previewUrl: data.category === "image" ? data.public_url : undefined,
    roomCode: data.room_code || normalized,
  }
}

export async function removeSharedFile(id: string, storagePath?: string): Promise<boolean> {
  if (!supabase) {
    return true
  }

  let pathToDelete = storagePath

  if (!pathToDelete) {
    const { data } = await supabase
      .from("shared_files")
      .select("storage_path")
      .eq("id", id)
      .single()

    if (data?.storage_path) {
      pathToDelete = data.storage_path
    }
  }

  if (pathToDelete) {
    await supabase.storage.from("uploads").remove([pathToDelete])
  }

  const { error } = await supabase.from("shared_files").delete().eq("id", id)
  if (error) {
    throw new Error(error.message)
  }
  return true
}

export async function clearAllSharedFileRecords(
  roomCode: string = "public"
): Promise<boolean> {
  if (!supabase) {
    return true
  }

  const normalized = roomCode.trim().toLowerCase() || "public"

  let allFilesResult = await supabase
    .from("shared_files")
    .select("id, storage_path, room_code")
    .eq("room_code", normalized)

  if (allFilesResult.error && isRoomCodeError(allFilesResult.error)) {
    allFilesResult = await supabase.from("shared_files").select("id, storage_path, room_code")
  }

  const rawFiles = allFilesResult.data || []

  const targetFiles = rawFiles.filter((item) => {
    const itemRoom = (item.room_code || "").trim().toLowerCase()
    const path = item.storage_path || ""
    if (normalized === "public") {
      return (!itemRoom || itemRoom === "public") && !path.startsWith("rooms_")
    }
    return itemRoom === normalized || path.startsWith(`rooms_${normalized}_`)
  })

  if (targetFiles.length > 0) {
    const paths = targetFiles.map((f) => f.storage_path).filter(Boolean) as string[]
    const ids = targetFiles.map((f) => f.id)

    if (paths.length > 0) {
      await supabase.storage.from("uploads").remove(paths)
    }

    if (ids.length > 0) {
      await supabase.from("shared_files").delete().in("id", ids)
    }
  }

  return true
}
