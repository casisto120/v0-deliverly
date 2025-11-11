"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to log in",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
