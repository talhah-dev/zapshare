import { supabase } from "@/lib/supabase"
import { SharedFileItem } from "@/types/share"
import { detectFileCategory, formatFileSize } from "@/lib/formatters"

export interface FetchSharedFilesResult {
  files: SharedFileItem[]
  error?: string
}

export async function getSharedFiles(): Promise<FetchSharedFilesResult> {
  if (!supabase) {
    return { files: [] }
  }

  const { data, error } = await supabase
    .from("shared_files")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return { files: [], error: error.message }
  }

  if (!data) {
    return { files: [] }
  }

  return {
    files: data.map((item) => ({
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
    })),
  }
}

export async function uploadFileToStorage(file: File): Promise<SharedFileItem> {
  const category = detectFileCategory(file.name, file.type)
  const formattedSize = formatFileSize(file.size)

  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your .env.local file.")
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const storagePath = `${Date.now()}-${sanitizedName}`

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

  const { data, error: insertError } = await supabase
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

export async function clearAllSharedFileRecords(): Promise<boolean> {
  if (!supabase) {
    return true
  }

  const { data: allFiles } = await supabase
    .from("shared_files")
    .select("storage_path")

  if (allFiles && allFiles.length > 0) {
    const paths = allFiles
      .map((f) => f.storage_path)
      .filter(Boolean) as string[]

    if (paths.length > 0) {
      await supabase.storage.from("uploads").remove(paths)
    }
  }

  const { error } = await supabase
    .from("shared_files")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")

  if (error) {
    throw new Error(error.message)
  }
  return true
}
