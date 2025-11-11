import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || ""
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || ""
const SHOPIFY_SCOPES = ["write_products", "read_orders", "write_orders", "read_checkouts"]

export async function POST(request: NextRequest) {
  try {
    const { shopName } = await request.json()

    if (!shopName) {
      return NextResponse.json({ error: "Missing shop name" }, { status: 400 })
    }

    if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET) {
      console.error("[v0] Missing Shopify API credentials")
      return NextResponse.json(
        {
          error:
            "Shopify API credentials not configured. Please add SHOPIFY_API_KEY and SHOPIFY_API_SECRET to environment variables.",
        },
        { status: 500 },
      )
    }

    // Generate nonce for CSRF protection
    const nonce = crypto.randomBytes(16).toString("hex")

    // Build OAuth URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/shopify/callback`
    const scope = SHOPIFY_SCOPES.join(",")

    const authUrl = new URL(`https://${shopName}/admin/oauth/authorize`)
    authUrl.searchParams.append("client_id", SHOPIFY_API_KEY)
    authUrl.searchParams.append("scope", scope)
    authUrl.searchParams.append("redirect_uri", redirectUri)
    authUrl.searchParams.append("state", nonce)

    console.log("[v0] Generated auth URL for shop:", shopName)

    return NextResponse.json({
      authUrl: authUrl.toString(),
      nonce,
    })
  } catch (error) {
    console.error("[v0] Auth error:", error)
    return NextResponse.json({ error: "Auth failed" }, { status: 500 })
  }
}
