import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const fileId = params.id

    // Delete file record
    const { error } = await supabase.from("uploaded_files").delete().eq("id", fileId)

    if (error) {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
