import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const file = formData.get("file") as File
    const shopId = formData.get("shopId") as string

    if (!file || !shopId) {
      return NextResponse.json({ error: "Missing file or shopId" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const fileKey = `shop-${shopId}/file-${Date.now()}-${file.name}`

    // Store file metadata in database
    const { data, error } = await supabase
      .from("uploaded_files")
      .insert([
        {
          shop_id: shopId,
          file_name: file.name,
          file_key: fileKey,
          file_size: buffer.byteLength,
          mime_type: file.type,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] File upload error:", error)
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
    }

    // Cache file in Redis for quick retrieval
    await kv.set(fileKey, Buffer.from(buffer), { ex: 86400 * 30 }) // 30 days

    return NextResponse.json({
      success: true,
      fileId: data.id,
      fileName: file.name,
      fileKey,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
