"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SettingsForm({ shopId }: { shopId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button onClick={handleSignOut} disabled={isLoading} variant="destructive" className="w-full">
            {isLoading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
