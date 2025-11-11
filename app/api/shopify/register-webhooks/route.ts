import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const SHOPIFY_API_VERSION = "2024-01"

async function registerWebhook(
  shopName: string,
  accessToken: string,
  topic: string,
  webhookUrl: string,
): Promise<boolean> {
  try {
    const response = await fetch(`https://${shopName}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: `
            mutation {
              webhookSubscriptionCreate(
                topic: ${topic}
                webhookSubscription: {
                  callbackUrl: "${webhookUrl}"
                  format: JSON
                }
              ) {
                userErrors {
                  field
                  message
                }
                webhookSubscription {
                  id
                }
              }
            }
          `,
      }),
    })

    const data = await response.json()
    return !data.data?.webhookSubscriptionCreate?.userErrors?.length
  } catch (error) {
    console.error("[v0] Webhook registration error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the first shop
    const { data: shops } = await supabase.from("shops").select("*").limit(1)

    if (!shops || shops.length === 0) {
      return NextResponse.json({ error: "No shop found" }, { status: 404 })
    }

    const shop = shops[0]
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/shopify/webhook`

    // Register webhooks
    const topics = ["ORDERS_CREATE", "ORDERS_UPDATED", "ORDER_TRANSACTIONS_CREATE"]

    for (const topic of topics) {
      await registerWebhook(shop.shop_name, shop.access_token, topic, webhookUrl)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Register webhooks error:", error)
    return NextResponse.json({ error: "Failed to register webhooks" }, { status: 500 })
  }
}
