import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || ""

function verifyWebhook(request: NextRequest, body: string): boolean {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256")
  if (!hmacHeader) return false

  const hash = crypto.createHmac("sha256", SHOPIFY_WEBHOOK_SECRET).update(body, "utf8").digest("base64")

  return hash === hmacHeader
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // Verify webhook authenticity
    if (!verifyWebhook(request, body)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const webhook = JSON.parse(body)
    const shopHeader = request.headers.get("x-shopify-shop-api-call-limit")

    if (webhook.domain) {
      const shopName = webhook.domain
      const supabase = await createClient()

      // Handle order creation
      if (request.headers.get("x-shopify-topic")?.includes("orders/create")) {
        const { data: shop } = await supabase.from("shops").select("id").eq("shop_name", shopName).single()

        if (!shop) {
          return NextResponse.json({ error: "Shop not found" }, { status: 404 })
        }

        const order = {
          shop_id: shop.id,
          shopify_order_id: webhook.id.toString(),
          customer_email: webhook.customer?.email || "",
          customer_name: webhook.customer?.first_name || "Customer",
          product_ids: webhook.line_items.map((item: any) => item.product_id.toString()),
          delivery_status: "pending",
          delivery_method: "email",
        }

        const { error } = await supabase.from("orders").insert([order])

        if (error) {
          console.error("[v0] Webhook order insert error:", error)
          return NextResponse.json({ error: "Failed to process order" }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
