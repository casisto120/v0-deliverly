"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function EmailTestForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [fileName, setFileName] = useState("sample-file.pdf")

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !customerName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/email/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          customerName,
          fileName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send test email")
      }

      toast({
        title: "Success",
        description: `Test email sent to ${email}`,
      })

      setEmail("")
      setCustomerName("")
    } catch (error) {
      console.error("[v0] Send test error:", error)
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Email</CardTitle>
        <CardDescription>Send a test email to verify your notification setup</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendTest} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Email Address</label>
            <Input
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Customer Name</label>
            <Input
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">File Name</label>
            <Input
              placeholder="sample-file.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send Test Email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
