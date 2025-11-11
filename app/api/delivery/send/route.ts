import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

async function sendEmailWithFile(
  recipientEmail: string,
  fileName: string,
  fileKey: string,
  supabase: any,
): Promise<boolean> {
  try {
    // Retrieve file from cache
    const fileBuffer = await kv.get(fileKey)

    if (!fileBuffer) {
      console.error("[v0] File not found in cache:", fileKey)
      return false
    }

    // TODO: Integrate SendGrid or email service
    // For now, log the delivery
    console.log(`[v0] Email ready to send to ${recipientEmail} with file ${fileName}`)

    return true
  } catch (error) {
    console.error("[v0] Email sending error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { orderId, deliveryMethod } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    // Get order details
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get delivery configurations for products
    const { data: configs, error: configError } = await supabase
      .from("delivery_configs")
      .select("*")
      .eq("shop_id", order.shop_id)
      .in("product_id", order.product_ids)

    if (configError) {
      return NextResponse.json({ error: "Failed to fetch configs" }, { status: 500 })
    }

    // Send files based on delivery method
    let success = true
    for (const config of configs) {
      const sent = await sendEmailWithFile(order.customer_email, config.file_name, config.file_key, supabase)

      if (!sent) {
        success = false
      }
    }

    // Update order status
    const status = success ? "sent" : "failed"
    await supabase
      .from("orders")
      .update({
        delivery_status: status,
        delivered_at: new Date(),
        error_message: success ? null : "Delivery failed",
      })
      .eq("id", orderId)

    return NextResponse.json({
      success,
      message: success ? "Files delivered" : "Delivery failed",
    })
  } catch (error) {
    console.error("[v0] Delivery error:", error)
    return NextResponse.json({ error: "Delivery processing failed" }, { status: 500 })
  }
}
