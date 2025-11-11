import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || ""
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || ""

async function getAccessToken(shopName: string, code: string): Promise<string> {
  const response = await fetch(`https://${shopName}/admin/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    }),
  })

  const data = await response.json()
  return data.access_token
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const shop = searchParams.get("shop")
    const state = searchParams.get("state")

    if (!code || !shop) {
      return NextResponse.redirect(new URL("/setup?error=missing_params", request.url))
    }

    // Get access token from Shopify
    const accessToken = await getAccessToken(shop, code)

    if (!accessToken) {
      return NextResponse.redirect(new URL("/setup?error=token_failed", request.url))
    }

    // Save shop to database
    const supabase = await createClient()
    const { error } = await supabase.from("shops").insert([
      {
        shop_name: shop,
        access_token: accessToken,
        scope: "write_products,read_orders",
      },
    ])

    if (error) {
      console.error("[v0] Shop save error:", error)
      return NextResponse.redirect(new URL("/setup?error=db_failed", request.url))
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("[v0] Callback error:", error)
    return NextResponse.redirect(new URL("/setup?error=callback_failed", request.url))
  }
}
