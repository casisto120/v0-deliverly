"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ShopifySetupForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [shopDomain, setShopDomain] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shopDomain) {
      toast({
        title: "Error",
        description: "Please enter your Shopify store domain",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Normalize shop domain
      let normalizedDomain = shopDomain.toLowerCase().trim()
      if (!normalizedDomain.endsWith(".myshopify.com")) {
        if (normalizedDomain.includes(".")) {
          normalizedDomain = normalizedDomain.split(".")[0] + ".myshopify.com"
        } else {
          normalizedDomain = normalizedDomain + ".myshopify.com"
        }
      }

      console.log("[v0] Submitting setup for domain:", normalizedDomain)

      const response = await fetch("/api/shopify/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopName: normalizedDomain }),
      })

      const responseText = await response.text()
      console.log("[v0] Setup response status:", response.status)
      console.log("[v0] Setup response:", responseText)

      if (!response.ok) {
        let errorMessage = "Failed to start setup"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = JSON.parse(responseText)

      // Redirect to Shopify OAuth URL
      if (data.authUrl) {
        console.log("[v0] Redirecting to Shopify OAuth")
        window.location.href = data.authUrl
      } else {
        throw new Error("No auth URL received from server")
      }
    } catch (error: any) {
      console.error("[v0] Setup error details:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to start setup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Shopify Store</CardTitle>
        <CardDescription>Enter your Shopify store domain to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You'll be redirected to Shopify to authorize the app connection</AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Shopify Store Domain</label>
            <div className="flex">
              <Input
                placeholder="your-store"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
                disabled={isLoading}
                className="rounded-r-none"
              />
              <span className="px-3 py-2 bg-muted border border-l-0 border-border rounded-r-md text-sm text-muted-foreground">
                .myshopify.com
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Example: if your store is mystore.myshopify.com, enter "mystore"
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Connecting..." : "Connect Shopify Store"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
