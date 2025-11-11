import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, generateFileDeliveryEmail } from "@/lib/email/send-email"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, customerName, fileName } = await request.json()

    if (!email || !customerName || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate test email
    const testUrl = `${process.env.NEXT_PUBLIC_APP_URL}/files/download/test-file`
    const emailHtml = generateFileDeliveryEmail(customerName, testUrl, fileName)

    // Send email
    const success = await sendEmail({
      to: email,
      subject: `Your file is ready: ${fileName}`,
      html: emailHtml,
    })

    if (!success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Send test email error:", error)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}
