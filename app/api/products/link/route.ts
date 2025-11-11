import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { shopId, productId, fileId } = await request.json()

    if (!shopId || !productId || !fileId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get file details
    const { data: file, error: fileError } = await supabase.from("uploaded_files").select("*").eq("id", fileId).single()

    if (fileError || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Create or update delivery config
    const { error } = await supabase.from("delivery_configs").upsert([
      {
        shop_id: shopId,
        product_id: productId,
        file_name: file.file_name,
        file_key: file.file_key,
        delivery_method: "email",
      },
    ])

    if (error) {
      console.error("[v0] Link error:", error)
      return NextResponse.json({ error: "Failed to link file" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Link error:", error)
    return NextResponse.json({ error: "Link failed" }, { status: 500 })
  }
}
